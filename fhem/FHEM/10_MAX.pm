##############################################
# $Id$
# 
#  (c) 2019 Copyright: Wzut
#  (c) 2012 Copyright: Matthias Gehre, M.Gehre@gmx.de
#
#  All rights reserved
#
#  FHEM Forum : https://forum.fhem.de/index.php/board,23.0.html
#
#  This code is free software; you can redistribute it and/or modify
#  it under the terms of the GNU General Public License as published by
#  the Free Software Foundation; either version 2 of the License, or
#  (at your option) any later version.
#  The GNU General Public License can be found at
#  http://www.gnu.org/copyleft/gpl.html.
#  A copy is found in the textfile GPL.txt and important notices to the license
#  from the author is found in LICENSE.txt distributed with these scripts.
#  This script is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#
# 2.0.0  =>  28.03.2020
# 1.0.0"  => (c) M.Gehre
################################################################

package main;

use strict;
use warnings;
use AttrTemplate;
use Date::Parse;

my %device_types = (
  0 => 'Cube',
  1 => 'HeatingThermostat',
  2 => 'HeatingThermostatPlus',
  3 => 'WallMountedThermostat',
  4 => 'ShutterContact',
  5 => 'PushButton',
  6 => 'virtualShutterContact',
  7 => 'virtualThermostat',
  8 => 'PlugAdapter'

);

my %msgId2Cmd = (
                 '00' => 'PairPing',
                 '01' => 'PairPong',
                 '02' => 'Ack',
                 '03' => 'TimeInformation',

                 '10' => 'ConfigWeekProfile',
                 '11' => 'ConfigTemperatures', #like eco/comfort etc
                 '12' => 'ConfigValve',

                 '20' => 'AddLinkPartner',
                 '21' => 'RemoveLinkPartner',
                 '22' => 'SetGroupId',
                 '23' => 'RemoveGroupId',

                 '30' => 'ShutterContactState',

                 '40' => 'SetTemperature', # to thermostat
                 '42' => 'WallThermostatControl', # by WallMountedThermostat
                 # Sending this without payload to thermostat sets desiredTempeerature to the comfort/eco temperature
                 # We don't use it, we just do SetTemperature
                 '43' => 'SetComfortTemperature',
                 '44' => 'SetEcoTemperature',

                 '50' => 'PushButtonState',

                 '60' => 'ThermostatState', # by HeatingThermostat

                 '70' => 'WallThermostatState',

                 '82' => 'SetDisplayActualTemperature',

                 'F1' => 'WakeUp',
                 'F0' => 'Reset',
               );

my %msgCmd2Id = reverse %msgId2Cmd;

my $defaultWeekProfile = '444855084520452045204520452045204520452045204520452044485508452045204520452045204520452045204520452045204448546c44cc55144520452045204520452045204520452045204448546c44cc55144520452045204520452045204520452045204448546c44cc55144520452045204520452045204520452045204448546c44cc55144520452045204520452045204520452045204448546c44cc5514452045204520452045204520452045204520';

my @ctrl_modes = ( 'auto', 'manual', 'temporary', 'boost' );

my %boost_durations = (0 => 0, 1 => 5, 2 => 10, 3 => 15, 4 => 20, 5 => 25, 6 => 30, 7 => 60);

my %boost_durationsInv = reverse %boost_durations;

my %decalcDays = (0 => "Sat", 1 => "Sun", 2 => "Mon", 3 => "Tue", 4 => "Wed", 5 => "Thu", 6 => "Fri");
my @weekDays = ("Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri");
my %decalcDaysInv = reverse %decalcDays;

sub validWindowOpenDuration { return $_[0] =~ /^\d+$/ && $_[0] >= 0 && $_[0] <= 60; }
sub validMeasurementOffset { return $_[0] =~ /^-?\d+(\.[05])?$/ && $_[0] >= -3.5 && $_[0] <= 3.5; }
sub validBoostDuration { return $_[0] =~ /^\d+$/ && exists($boost_durationsInv{$_[0]}); }
sub validValveposition { return $_[0] =~ /^\d+$/ && $_[0] >= 0 && $_[0] <= 100; }
sub validDecalcification { my ($decalcDay, $decalcHour) = ($_[0] =~ /^(...) (\d{1,2}):00$/);
  return defined($decalcDay) && defined($decalcHour) && exists($decalcDaysInv{$decalcDay}) && 0 <= $decalcHour && $decalcHour < 24; }
sub validWeekProfile { return length($_[0]) == 4*13*7; }
sub validGroupid { return $_[0] =~ /^\d+$/ && $_[0] >= 0 && $_[0] <= 255; }

my %readingDef = ( #min/max/default
  "maximumTemperature"    => [ \&validTemperature, "on"],
  "minimumTemperature"    => [ \&validTemperature, "off"],
  "comfortTemperature"    => [ \&validTemperature, 21],
  "ecoTemperature"        => [ \&validTemperature, 17],
  "windowOpenTemperature" => [ \&validTemperature, 12],
  "windowOpenDuration"    => [ \&validWindowOpenDuration,   15],
  "measurementOffset"     => [ \&validMeasurementOffset, 0],
  "boostDuration"         => [ \&validBoostDuration, 5 ],
  "boostValveposition"    => [ \&validValveposition, 80 ],
  "decalcification"       => [ \&validDecalcification, "Sat 12:00" ],
  "maxValveSetting"       => [ \&validValveposition, 100 ],
  "valveOffset"           => [ \&validValveposition, 00 ],
  "groupid"               => [ \&validGroupid, 0 ],
  ".weekProfile"          => [ \&validWeekProfile, $defaultWeekProfile ],
);

my %interfaces = (
  "Cube" => undef,
  "HeatingThermostat" => "thermostat;battery;temperature",
  "HeatingThermostatPlus" => "thermostat;battery;temperature",
  "WallMountedThermostat" => "thermostat;temperature;battery",
  "ShutterContact" => "switch_active;battery",
  "PushButton" => "switch_passive;battery"
  );

sub
MAX_Initialize($)
{
  my ($hash) = @_;

  Log3 $hash, 5, "Calling MAX_Initialize";
  $hash->{Match}     = "^MAX";
  $hash->{DefFn}     = "MAX_Define";
  $hash->{UndefFn}   = "MAX_Undef";
  $hash->{ParseFn}   = "MAX_Parse";
  $hash->{SetFn}     = "MAX_Set";
  $hash->{AttrList}  = "IODev do_not_notify:1,0 ignore:0,1 dummy:0,1 " .
                       "showtime:1,0 keepAuto:0,1 scanTemp:0,1 ".
                       $readingFnAttributes;
  $hash->{DbLog_splitFn} = "MAX_DbLog_splitFn";
  return undef;
}

#############################
sub
MAX_Define($$)
{
  my ($hash, $def) = @_;
  my @a = split("[ \t][ \t]*", $def);
  my $name = $hash->{NAME};
  return "name \"$name\" is reserved for internal use" if($name eq "fakeWallThermostat" or $name eq "fakeShutterContact");
  return "wrong syntax: define <name> MAX type addr"
        if(int(@a)!=4 || $a[3] !~ m/^[A-F0-9]{6}$/i);

  my $type = $a[2];
  my $addr = lc($a[3]); #all addr should be lowercase
  if(exists($modules{MAX}{defptr}{$addr})) {
    my $msg = "MAX_Define: Device with addr $addr is already defined";
    Log3 $hash, 1, $msg;
    return $msg;
  }
  if($type eq "Cube") {
    my $msg = "MAX_Define: Device type 'Cube' is deprecated. All properties have been moved to the MAXLAN device.";
    Log3 $hash, 1, $msg;
    return $msg;
  }
  Log3 $hash, 5, "Max_define $type with addr $addr ";
  $hash->{type} = $type;
  $hash->{addr} = $addr;
  $modules{MAX}{defptr}{$addr} = $hash;

  $hash->{internals}{interfaces} = $interfaces{$type};

  AssignIoPort($hash);
  return undef;
}

sub
MAX_Undef($$)
{
  my ($hash,$name) = @_;
  delete($modules{MAX}{defptr}{$hash->{addr}});
  return undef;
}

sub
MAX_DateTime2Internal($)
{
  my($day, $month, $year, $hour, $min) = ($_[0] =~ /^(\d{2}).(\d{2})\.(\d{4}) (\d{2}):(\d{2})$/);
  return (($month&0xE) << 20) | ($day << 16) | (($month&1) << 15) | (($year-2000) << 8) | ($hour*2 + int($min/30));
}

sub
MAX_TypeToTypeId($)
{
  foreach (keys %device_types) {
    return $_ if($_[0] eq $device_types{$_});
  }
  Log 1, "MAX_TypeToTypeId: Invalid type $_[0]";
  return 0;
}

sub
MAX_CheckIODev($)
{
  my $hash = shift;
  return !defined($hash->{IODev}) || ($hash->{IODev}{TYPE} ne "MAXLAN" && $hash->{IODev}{TYPE} ne "CUL_MAX");
}

# Print number in format "0.0", pass "on" and "off" verbatim, convert 30.5 and 4.5 to "on" and "off"
# Used for "desiredTemperature", "ecoTemperature" etc. but not "temperature"
sub
MAX_SerializeTemperature($)
{
  if($_[0] eq  "on" or $_[0] eq "off") {
    return $_[0];
  } elsif($_[0] == 4.5) {
    return "off";
  } elsif($_[0] == 30.5) {
    return "on";
  } else {
    return sprintf("%2.1f",$_[0]);
  }
}

sub
MAX_Validate(@)
{
  my ($name,$val) = @_;
  return 1 if(!exists($readingDef{$name}));
  return $readingDef{$name}[0]->($val);
}

#Get a reading, validating it's current value (maybe forcing to the default if invalid)
#"on" and "off" are converted to their numeric values
sub
MAX_ReadingsVal(@)
{
  my ($hash,$name) = @_;

  my $val = ReadingsVal($hash->{NAME},$name,"");
  #$readingDef{$name} array is [validatingFunc, defaultValue]
  if(exists($readingDef{$name}) and !$readingDef{$name}[0]->($val)) {
    #Error: invalid value
    Log3 $hash, 2, "MAX: Invalid value $val for READING $name on $hash->{NAME}. Forcing to $readingDef{$name}[1]";
    $val = $readingDef{$name}[1];

    #Save default value to READINGS
    if(exists($hash->{".updateTimestamp"})) {
      readingsBulkUpdate($hash,$name,$val);
    } else {
      readingsSingleUpdate($hash,$name,$val,0);
    }
  }
  return MAX_ParseTemperature($val);
}

sub
MAX_ParseWeekProfile(@) {
  my ($hash ) = @_;
  # Format of weekprofile: 16 bit integer (high byte first) for every control point, 13 control points for every day
  # each 16 bit integer value is parsed as
  # int time = (value & 0x1FF) * 5;
  # int hour = (time / 60) % 24;
  # int minute = time % 60;
  # int temperature = ((value >> 9) & 0x3F) / 2;

  my $curWeekProfile = MAX_ReadingsVal($hash, ".weekProfile");
  #parse weekprofiles for each day
  for (my $i=0;$i<7;$i++) {
    my (@time_prof, @temp_prof);
    for(my $j=0;$j<13;$j++) {
      $time_prof[$j] = (hex(substr($curWeekProfile,($i*52)+ 4*$j,4))& 0x1FF) * 5;
      $temp_prof[$j] = (hex(substr($curWeekProfile,($i*52)+ 4*$j,4))>> 9 & 0x3F ) / 2;
    }

    my @hours;
    my @minutes;
    my $j;
    for($j=0;$j<13;$j++) {
      $hours[$j] = ($time_prof[$j] / 60 % 24);
      $minutes[$j] = ($time_prof[$j]%60);
      #if 00:00 reached, last point in profile was found
      if (int($hours[$j]) == 0 && int($minutes[$j]) == 0) {
        $hours[$j] = 24;
        last;
      }
    }
    my $time_prof_str = "00:00";
    my $temp_prof_str;
    for (my $k=0;$k<=$j;$k++) {
      $time_prof_str .= sprintf("-%02d:%02d", $hours[$k], $minutes[$k]);
      $temp_prof_str .= sprintf("%2.1f °C",$temp_prof[$k]);
      if ($k < $j) {
        $time_prof_str .= "  /  " . sprintf("%02d:%02d", $hours[$k], $minutes[$k]);
        $temp_prof_str .= "  /  ";
      }
   }
   readingsBulkUpdate($hash, "weekprofile-$i-$decalcDays{$i}-time", $time_prof_str );
   readingsBulkUpdate($hash, "weekprofile-$i-$decalcDays{$i}-temp", $temp_prof_str );
  }
}
#############################

sub
MAX_WakeUp($)
{
  my $hash = $_[0];
  #3F corresponds to 31 seconds wakeup (so its probably the lower 5 bits)
  return ($hash->{IODev}{Send})->($hash->{IODev},"WakeUp",$hash->{addr}, "3F", callbackParam => "31" );
}

sub
MAX_Set($@)
{
  my ($hash, $devname, @a) = @_;
  my ($setting, @args) = @a;

  return "Invalid IODev" if(MAX_CheckIODev($hash));

  if($setting eq "desiredTemperature" and $hash->{type} =~ /.*Thermostat.*/) {
    return "missing a value" if(@args == 0);

    my $temperature;
    my $until = undef;
    my $ctrlmode = 1; #0=auto, 1=manual; 2=temporary

    if($args[0] eq "auto") {
      #This enables the automatic/schedule mode where the thermostat follows the weekly program

      #There can be a temperature supplied, which will be kept until the next switch point of the weekly program
      if(@args == 2) {
        if($args[1] eq "eco") {
          $temperature = MAX_ReadingsVal($hash,"ecoTemperature");
        } elsif($args[1] eq "comfort") {
          $temperature = MAX_ReadingsVal($hash,"comfortTemperature");
        } else {
          $temperature = MAX_ParseTemperature($args[1]);
        }
      } elsif(@args == 1) {
        $temperature = 0; #use temperature from weekly program
      } else {
        return "Too many parameters: desiredTemperature auto [<temperature>]";
      }

      $ctrlmode = 0; #auto
    } elsif($args[0] eq "boost") {
      return "Too many parameters: desiredTemperature boost" if(@args > 1);
      $temperature = 0;
      $ctrlmode = 3;
      #TODO: auto mode with temperature is also possible

    } else {
      if($args[0] eq "manual") {
        #User explicitly asked for manual mode
        $ctrlmode = 1; #manual, possibly overwriting keepAuto
        shift @args;
        return "Not enough parameters after 'desiredTemperature manual'" if(@args == 0);

      } elsif(AttrVal($hash->{NAME},"keepAuto","0") ne "0"
        && MAX_ReadingsVal($hash,"mode") eq "auto") {
        #User did not ask for any mode explicitly, but has keepAuto
        Log3 $hash, 5, "MAX_Set: staying in auto mode";
        $ctrlmode = 0; #auto
      }

      if($args[0] eq "eco") {
        $temperature = MAX_ReadingsVal($hash,"ecoTemperature");
      } elsif($args[0] eq "comfort") {
        $temperature = MAX_ReadingsVal($hash,"comfortTemperature");
      } else {
        $temperature = MAX_ParseTemperature($args[0]);
      }

      if(@args > 1) {
        #@args == 3 and $args[1] == "until"
        return "Second parameter must be 'until'" if($args[1] ne "until");
        return "Not enough parameters: desiredTemperature [manual] <temp> [until <date> <time>]" if(@args == 3);
        return "Too many parameters: desiredTemperature [manual] <temp> [until <date> <time>]" if(@args > 4);
        $ctrlmode = 2; #switch manual to temporary
        $until = sprintf("%06x",MAX_DateTime2Internal($args[2]." ".$args[3]));
      }
    }

    my $payload = sprintf("%02x",int($temperature*2.0) | ($ctrlmode << 6));
    $payload .= $until if(defined($until));
    my $groupid = MAX_ReadingsVal($hash,"groupid");
    return ($hash->{IODev}{Send})->($hash->{IODev},"SetTemperature",$hash->{addr},$payload, groupId => sprintf("%02x",$groupid), flags => ( $groupid ? "04" : "00" ));

  }elsif(grep (/^\Q$setting\E$/, ("boostDuration", "boostValveposition", "decalcification","maxValveSetting","valveOffset"))
      and $hash->{type} =~ /.*Thermostat.*/){

    my $val = join(" ",@args); #decalcification contains a space

    if(!MAX_Validate($setting, $val)) {
      my $msg = "Invalid value $args[0] for $setting";
      Log3 $hash, 1, $msg;
      return $msg;
    }

    my %h;
    $h{boostDuration} = MAX_ReadingsVal($hash,"boostDuration");
    $h{boostValveposition} = MAX_ReadingsVal($hash,"boostValveposition");
    $h{decalcification} = MAX_ReadingsVal($hash,"decalcification");
    $h{maxValveSetting} = MAX_ReadingsVal($hash,"maxValveSetting");
    $h{valveOffset} = MAX_ReadingsVal($hash,"valveOffset");

    $h{$setting} = MAX_ParseTemperature($val);

    my ($decalcDay, $decalcHour) = ($h{decalcification} =~ /^(...) (\d{1,2}):00$/);
    my $decalc = ($decalcDaysInv{$decalcDay} << 5) | $decalcHour;
    my $boost = ($boost_durationsInv{$h{boostDuration}} << 5) | int($h{boostValveposition}/5);

    my $payload = sprintf("%02x%02x%02x%02x", $boost, $decalc, int($h{maxValveSetting}*255/100), int($h{valveOffset}*255/100));
    return ($hash->{IODev}{Send})->($hash->{IODev},"ConfigValve",$hash->{addr},$payload,callbackParam => "$setting,$val");

  }elsif($setting eq "groupid"){
    return "argument needed" if(@args == 0);

    if($args[0]) {
      return ($hash->{IODev}{Send})->($hash->{IODev},"SetGroupId",$hash->{addr}, sprintf("%02x",$args[0]), callbackParam => "$args[0]" );
    } else {
      return ($hash->{IODev}{Send})->($hash->{IODev},"RemoveGroupId",$hash->{addr}, "00", callbackParam => "0");
    }

  }elsif( grep (/^\Q$setting\E$/, ("ecoTemperature", "comfortTemperature", "measurementOffset", "maximumTemperature", "minimumTemperature", "windowOpenTemperature", "windowOpenDuration" )) and $hash->{type} =~ /.*Thermostat.*/) {
    return "Cannot set without IODev" if(!exists($hash->{IODev}));

    if(!MAX_Validate($setting, $args[0])) {
      my $msg = "Invalid value $args[0] for $setting";
      Log3 $hash, 1, $msg;
      return $msg;
    }

    my %h;
    $h{comfortTemperature} = MAX_ReadingsVal($hash,"comfortTemperature");
    $h{ecoTemperature} = MAX_ReadingsVal($hash,"ecoTemperature");
    $h{maximumTemperature} = MAX_ReadingsVal($hash,"maximumTemperature");
    $h{minimumTemperature} = MAX_ReadingsVal($hash,"minimumTemperature");
    $h{windowOpenTemperature} = MAX_ReadingsVal($hash,"windowOpenTemperature");
    $h{windowOpenDuration} = MAX_ReadingsVal($hash,"windowOpenDuration");
    $h{measurementOffset} = MAX_ReadingsVal($hash,"measurementOffset");

    $h{$setting} = MAX_ParseTemperature($args[0]);

    my $comfort = int($h{comfortTemperature}*2);
    my $eco = int($h{ecoTemperature}*2);
    my $max = int($h{maximumTemperature}*2);
    my $min = int($h{minimumTemperature}*2);
    my $offset = int(($h{measurementOffset} + 3.5)*2);
    my $windowOpenTemp = int($h{windowOpenTemperature}*2);
    my $windowOpenTime = int($h{windowOpenDuration}/5);

    my $groupid = MAX_ReadingsVal($hash,"groupid");
    my $payload = sprintf("%02x%02x%02x%02x%02x%02x%02x",$comfort,$eco,$max,$min,$offset,$windowOpenTemp,$windowOpenTime);
    if($setting eq "measurementOffset") {
      return ($hash->{IODev}{Send})->($hash->{IODev},"ConfigTemperatures",$hash->{addr},$payload, groupId => "00", flags => "00", callbackParam => "$setting,$args[0]");
    } else {
      return ($hash->{IODev}{Send})->($hash->{IODev},"ConfigTemperatures",$hash->{addr},$payload, groupId => sprintf("%02x",$groupid), flags => ( $groupid ? "04" : "00" ), callbackParam => "$setting,$args[0]");
    }

  } elsif($setting eq "displayActualTemperature" and $hash->{type} eq "WallMountedThermostat") {
    return "Invalid arg" if($args[0] ne "0" and $args[0] ne "1");

    return ($hash->{IODev}{Send})->($hash->{IODev},"SetDisplayActualTemperature",$hash->{addr},
      sprintf("%02x",$args[0] ? 4 : 0), callbackParam => "$setting,$args[0]");

  } elsif($setting eq "fake") { #Deprecated, use fakeWT and fakeSC of CUL_MAX
    #Resolve first argument to address
    return "Invalid number of arguments" if(@args == 0);
    my $dest = $args[0];
    if(exists($defs{$dest})) {
      return "Destination is not a MAX device" if($defs{$dest}{TYPE} ne "MAX");
      $dest = $defs{$dest}{addr};
    } else {
      return "No MAX device with address $dest" if(!exists($modules{MAX}{defptr}{$dest}));
    }

    if($hash->{type} eq "ShutterContact") {
      return "Invalid number of arguments" if(@args != 2);
      Log3 $hash, 2, "fake is deprectaed and will be removed. Please use CUL_MAX's fakeSC";
      my $state = $args[1] ? "12" : "10";
      return ($hash->{IODev}{Send})->($hash->{IODev},"ShutterContactState",$dest,$state, flags => "06", src => $hash->{addr});
    } elsif($hash->{type} eq "WallMountedThermostat") {
      return "Invalid number of arguments" if(@args != 3);

      return "desiredTemperature is invalid" if($args[1] < 4.5 || $args[2] > 30.5);
      Log3 $hash, 2, "fake is deprectaed and will be removed. Please use CUL_MAX's fakeWT";
      $args[2] = 0 if($args[2] < 0); #Clamp temperature to minimum of 0 degree

      #Encode into binary form
      my $arg2 = int(10*$args[2]);
      #First bit is 9th bit of temperature, rest is desiredTemperature
      my $arg1 = (($arg2&0x100)>>1) | (int(2*$args[1])&0x7F);
      $arg2 &= 0xFF; #only take the lower 8 bits

      return ($hash->{IODev}{Send})->($hash->{IODev},"WallThermostatControl",$dest,
        sprintf("%02x%02x",$arg1,$arg2),flags => "04", src => $hash->{addr});
    } else {
      return "fake does not work for device type $hash->{type}";
    }

  } elsif(grep /^\Q$setting\E$/, ("associate", "deassociate")) {
    my $dest = $args[0];
    my $destType;
    if($dest eq "fakeWallThermostat") {
      return "IODev is not CUL_MAX" if($hash->{IODev}->{TYPE} ne "CUL_MAX");
      $dest = AttrVal($hash->{IODev}->{NAME}, "fakeWTaddr", "111111");
      return "Invalid fakeWTaddr attribute set (must not be 000000)" if($dest eq "000000");
      $destType = MAX_TypeToTypeId("WallMountedThermostat");

    } elsif($dest eq "fakeShutterContact") {
      return "IODev is not CUL_MAX" if($hash->{IODev}->{TYPE} ne "CUL_MAX");
      $dest = AttrVal($hash->{IODev}->{NAME}, "fakeSCaddr", "222222");
      return "Invalid fakeSCaddr attribute set (must not be 000000)" if($dest eq "000000");
      $destType = MAX_TypeToTypeId("ShutterContact");

    } else {
      if(exists($defs{$dest})) {
        return "Destination is not a MAX device" if($defs{$dest}{TYPE} ne "MAX");
        $dest = $defs{$dest}{addr};
      } else {
        return "No MAX device with address $dest" if(!exists($modules{MAX}{defptr}{$dest}));
      }
      $destType = MAX_TypeToTypeId($modules{MAX}{defptr}{$dest}{type});
    }

    Log3 $hash, 5, "Using dest $dest, destType $destType";
    if($setting eq "associate") {
      return ($hash->{IODev}{Send})->($hash->{IODev},"AddLinkPartner",$hash->{addr},sprintf("%s%02x", $dest, $destType));
    } else {
      return ($hash->{IODev}{Send})->($hash->{IODev},"RemoveLinkPartner",$hash->{addr},sprintf("%s%02x", $dest, $destType));
    }


  } elsif($setting eq "factoryReset") {

    if(exists($hash->{IODev}{RemoveDevice})) {
      #MAXLAN
      return ($hash->{IODev}{RemoveDevice})->($hash->{IODev},$hash->{addr});
    } else {
      #CUL_MAX
      return ($hash->{IODev}{Send})->($hash->{IODev},"Reset",$hash->{addr});
    }

  } elsif($setting eq "wakeUp") {
    return MAX_WakeUp($hash);

  } elsif($setting eq "weekProfile" and $hash->{type} =~ /.*Thermostat.*/) {
    return "Invalid arguments.  You must specify at least one: <weekDay> <temp[,hh:mm]>\nExample: Mon 10,06:00,17,09:00" if((@args%2 == 1)||(@args == 0));

    #Send wakeUp, so we can send the weekprofile pakets without preamble
    #Disabled for now. Seems like the first packet is lost. Maybe inserting a delay after the wakeup will fix this
    #MAX_WakeUp($hash) if( @args > 2 );

    for(my $i = 0; $i < @args; $i += 2) {
      return "Expected day (one of ".join (",",@weekDays)."), got $args[$i]" if(!exists($decalcDaysInv{$args[$i]}));
      my $day = $decalcDaysInv{$args[$i]};
      my @controlpoints = split(',',$args[$i+1]);
      return "Not more than 13 control points are allowed!" if(@controlpoints > 13*2);
      my $newWeekprofilePart = "";
      for(my $j = 0; $j < 13*2; $j += 2) {
        if( $j >= @controlpoints ) {
          $newWeekprofilePart .= "4520";
          next;
        }
        my ($hour, $min);
        if($j + 1 == @controlpoints) {
          $hour = 24; $min = 0;
        } else {
          ($hour, $min) = ($controlpoints[$j+1] =~ /^(\d{1,2}):(\d{1,2})$/);
        }
        my $temperature = $controlpoints[$j];
        return "Invalid time: $controlpoints[$j+1]" if(!defined($hour) || !defined($min) || $hour > 24 || $min > 59 || ($hour == 24 && $min > 0));
        return "Invalid temperature (Must be one of: off|on|5|5.5|6|6.5..30)" if(!validTemperature($temperature));
        $temperature = MAX_ParseTemperature($temperature); #replace "on" and "off" by their values
        $newWeekprofilePart .= sprintf("%04x", (int($temperature*2) << 9) | int(($hour * 60 + $min)/5));
      }
      Log3 $hash, 5, "New Temperature part for $day: $newWeekprofilePart";
      #Each day has 2 bytes * 13 controlpoints = 26 bytes = 52 hex characters
      #we don't have to update the rest, because the active part is terminated by the time 0:00

      #First 7 controlpoints (2*7=14 bytes => 2*2*7=28 hex characters )
      ($hash->{IODev}{Send})->($hash->{IODev},"ConfigWeekProfile",$hash->{addr},
          sprintf("0%1d%s", $day, substr($newWeekprofilePart,0,2*2*7)),
          callbackParam => "$day,0,".substr($newWeekprofilePart,0,2*2*7));
      #And then the remaining 6
      ($hash->{IODev}{Send})->($hash->{IODev},"ConfigWeekProfile",$hash->{addr},
          sprintf("1%1d%s", $day, substr($newWeekprofilePart,2*2*7,2*2*6)),
          callbackParam => "$day,1,".substr($newWeekprofilePart,2*2*7,2*2*6))
            if(@controlpoints > 2*7);
    }
    Log3 $hash, 5, "New weekProfile: " . MAX_ReadingsVal($hash, ".weekProfile");

  }else{
    my $templist = join(",",map { MAX_SerializeTemperature($_/2) }  (9..61));
    my $ret = "Unknown argument $setting, choose one of wakeUp factoryReset groupid";

    my $assoclist;
    #Build list of devices which this device can be associated to
    if($hash->{type} =~ /HeatingThermostat.*/) {
      $assoclist = join(",", map { defined($_->{type}) &&
        ($_->{type} eq "HeatingThermostat"
          || $_->{type} eq "HeatingThermostatPlus"
          || $_->{type} eq "WallMountedThermostat"
          || $_->{type} eq "ShutterContact")
        && $_ != $hash ? $_->{NAME} : () } values %{$modules{MAX}{defptr}});
      if($hash->{IODev}->{TYPE} eq "CUL_MAX") {
        $assoclist .= "," if(length($assoclist));
        $assoclist .= "fakeWallThermostat,fakeShutterContact";
      }

    } elsif($hash->{type} =~ /WallMountedThermostat/) {
      $assoclist = join(",", map { defined($_->{type}) &&
        ($_->{type} eq "HeatingThermostat"
          || $_->{type} eq "HeatingThermostatPlus"
          || $_->{type} eq "ShutterContact")
        && $_ != $hash ? $_->{NAME} : () } values %{$modules{MAX}{defptr}});
      if($hash->{IODev}->{TYPE} eq "CUL_MAX") {
        $assoclist .= "," if(length($assoclist));
        $assoclist .= "fakeShutterContact";
      }

    } elsif($hash->{type} eq "ShutterContact") {
      $assoclist = join(",", map { defined($_->{type}) && $_->{type} =~ /.*Thermostat.*/ ? $_->{NAME} : () } values %{$modules{MAX}{defptr}});
    }

    my $templistOffset = join(",",map { MAX_SerializeTemperature(($_-7)/2) }  (0..14));
    my $boostDurVal = join(",", values(%boost_durations));
    if($hash->{type} =~ /HeatingThermostat.*/) {
      my $shash;
      my $wallthermo = 0;
      # check if Wallthermo is in same group
      foreach my $addr ( keys %{$modules{MAX}{defptr}} ) {
        $shash = $modules{MAX}{defptr}{$addr};
        $wallthermo = 1 if(defined $shash->{type} && $shash->{type} eq "WallMountedThermostat" && (MAX_ReadingsVal($shash,"groupid") eq MAX_ReadingsVal($hash,"groupid")));
      }

      if ($wallthermo eq 1) {
        return "$ret associate:$assoclist deassociate:$assoclist desiredTemperature:eco,comfort,boost,auto,$templist measurementOffset:$templistOffset windowOpenDuration boostDuration:$boostDurVal boostValveposition decalcification maxValveSetting valveOffset weekProfile";
      } else {
        return "$ret associate:$assoclist deassociate:$assoclist desiredTemperature:eco,comfort,boost,auto,$templist ecoTemperature:$templist comfortTemperature:$templist measurementOffset:$templistOffset maximumTemperature:$templist minimumTemperature:$templist windowOpenTemperature:$templist windowOpenDuration boostDuration:$boostDurVal boostValveposition decalcification maxValveSetting valveOffset weekProfile";
      }
    } elsif($hash->{type} eq "WallMountedThermostat") {
      return "$ret associate:$assoclist deassociate:$assoclist displayActualTemperature:0,1 desiredTemperature:eco,comfort,boost,auto,$templist ecoTemperature:$templist comfortTemperature:$templist maximumTemperature:$templist minimumTemperature:$templist measurementOffset:$templistOffset windowOpenTemperature:$templist boostDuration:$boostDurVal boostValveposition ";
    } elsif($hash->{type} eq "ShutterContact") {
      return "$ret associate:$assoclist deassociate:$assoclist";
    } else {
      return $ret;
    }
  }
}

#############################
sub
MAX_ParseDateTime($$$)
{
  my ($byte1,$byte2,$byte3) = @_;
  my $day = $byte1 & 0x1F;
  my $month = (($byte1 & 0xE0) >> 4) | ($byte2 >> 7);
  my $year = $byte2 & 0x3F;
  my $time = ($byte3 & 0x3F);
  if($time%2){
    $time = int($time/2).":30";
  }else{
    $time = int($time/2).":00";
  }
  return { "day" => $day, "month" => $month, "year" => $year, "time" => $time, "str" => "$day.$month.$year $time" };
}

#############################
sub
MAX_Parse($$)
{
  my ($hash, $msg) = @_;
  my ($MAX,$isToMe,$msgtype,$addr,@args) = split(",",$msg);
  #$isToMe is 1 if the message was direct at the device $hash, and 0
  #if we just snooped a message directed at a different device (by CUL_MAX).
  return () if($MAX ne "MAX");

  Log3 $hash, 5, "MAX_Parse $msg";

  if(!exists($modules{MAX}{defptr}{$addr}))
  {
    my $devicetype = undef;
    $devicetype = $args[0] if($msgtype eq "define" and $args[0] ne "Cube");
    $devicetype = "ShutterContact" if($msgtype eq "ShutterContactState");
    $devicetype = "WallMountedThermostat" if(grep /^$msgtype$/, ("WallThermostatConfig","WallThermostatState","WallThermostatControl","SetTemperature"));
    $devicetype = "HeatingThermostat" if(grep /^$msgtype$/, ("HeatingThermostatConfig", "ThermostatState"));
    if($devicetype) {
      return "UNDEFINED MAX_$addr MAX $devicetype $addr";
    } else {
      Log3 $hash, 2, "Got message for undefined device $addr, and failed to guess type from msg '$msgtype' - ignoring";
      return $hash->{NAME};
    }
  }

  my $shash = $modules{MAX}{defptr}{$addr};

  #if $isToMe is true, then the message was directed at device $hash, thus we can also use it for sending
  if($isToMe) {
    $shash->{IODev} = $hash;
    $shash->{backend} = $hash->{NAME}; #for user information
  }

  readingsBeginUpdate($shash);
  if($msgtype eq "define"){
    my $devicetype = $args[0];
    Log3 $hash, 1, "Device changed type from $shash->{type} to $devicetype" if($shash->{type} ne $devicetype);
    $shash->{type} = $devicetype;
    if(@args > 1){
      my $serial = $args[1];
      Log3 $hash, 1, "Device changed serial from $shash->{serial} to $serial" if($shash->{serial} and ($shash->{serial} ne $serial));
      $shash->{serial} = $serial;
    }
    readingsBulkUpdate($shash, "groupid", $args[2]);
    $shash->{IODev} = $hash;

  } elsif($msgtype eq "ThermostatState") {

    my ($bits2,$valveposition,$desiredTemperature,$until1,$until2,$until3) = unpack("aCCCCC",pack("H*",$args[0]));
    my $mode = vec($bits2, 0, 2); #
    my $dstsetting = vec($bits2, 3, 1); #is automatically switching to DST activated
    my $langateway = vec($bits2, 4, 1); #??
    my $panel = vec($bits2, 5, 1); #1 if the heating thermostat is locked for manually setting the temperature at the device
    my $rferror = vec($bits2, 6, 1); #communication with link partner - if device is not accessible over the air from the cube
    my $batterylow = vec($bits2, 7, 1); #1 if battery is low

    my $untilStr = defined($until3) ? MAX_ParseDateTime($until1,$until2,$until3)->{str} : "";
    my $measuredTemperature = defined($until2) ? ((($until1 &0x01)<<8) + $until2)/10 : 0;
    #If the control mode is not "temporary", the cube sends the current (measured) temperature
    $measuredTemperature = "" if($mode == 2 || $measuredTemperature == 0);
    $untilStr = "" if($mode != 2);

    $desiredTemperature = ($desiredTemperature&0x7F)/2.0; #convert to degree celcius
    Log3 $hash, 5, "battery $batterylow, rferror $rferror, panel $panel, langateway $langateway, dstsetting $dstsetting, mode $mode, valveposition $valveposition %, desiredTemperature $desiredTemperature, until $untilStr, curTemp $measuredTemperature";

    #Very seldomly, the HeatingThermostat sends us temperatures like 0.2 or 0.3 degree Celcius - ignore them
    $measuredTemperature = "" if($measuredTemperature ne "" and $measuredTemperature < 1);

    $shash->{mode} = $mode;
    $shash->{rferror} = $rferror;
    $shash->{dstsetting} = $dstsetting;
    if($mode == 2){
      $shash->{until} = "$untilStr";
    }else{
      delete($shash->{until});
    }

    readingsBulkUpdate($shash, "mode", $ctrl_modes[$mode] );
    readingsBulkUpdate($shash, "battery", $batterylow ? "low" : "ok");
    readingsBulkUpdate($shash, "batteryState", $batterylow ? "low" : "ok"); # Forum #87575
    readingsBulkUpdate($shash, "panel", $panel ? "locked" : "unlocked");
    readingsBulkUpdate($shash, "rferror", $rferror ? "1" : "0");
    #The formatting of desiredTemperature must match with in MAX_Set:$templist
    #Sometime we get an MAX_Parse MAX,1,ThermostatState,01090d,180000000000, where desiredTemperature is 0 - ignore it
    readingsBulkUpdate($shash, "desiredTemperature", MAX_SerializeTemperature($desiredTemperature)) if($desiredTemperature != 0);
    if($measuredTemperature ne "") {
      readingsBulkUpdate($shash, "temperature", MAX_SerializeTemperature($measuredTemperature));
   }
    if($shash->{type} =~ /HeatingThermostatPlus/ and $hash->{TYPE} eq "MAXLAN") {
      readingsBulkUpdate($shash, "valveposition", int($valveposition*MAX_ReadingsVal($shash,"maxValveSetting")/100));
    } else {
      readingsBulkUpdate($shash, "valveposition", $valveposition);
    }

  }elsif(grep /^$msgtype$/,  ("WallThermostatState", "WallThermostatControl" )){
    my ($bits2,$displayActualTemperature,$desiredTemperatureRaw,$null1,$heaterTemperature,$null2,$temperature);
    if( length($args[0]) == 4 ) { #WallThermostatControl
      #This is the message that WallMountedThermostats send to paired HeatingThermostats
      ($desiredTemperatureRaw,$temperature) = unpack("CC",pack("H*",$args[0]));
    } elsif( length($args[0]) >= 6 and length($args[0]) <= 14) { #WallThermostatState
      #len=14: This is the message we get from the Cube over MAXLAN and which is probably send by WallMountedThermostats to the Cube
      #len=12: Payload of an Ack message, last field "temperature" is missing
      #len=10: Received by MAX_CUL as WallThermostatState
      #len=6 : Payload of an Ack message, last four fields (especially $heaterTemperature and $temperature) are missing
      ($bits2,$displayActualTemperature,$desiredTemperatureRaw,$null1,$heaterTemperature,$null2,$temperature) = unpack("aCCCCCC",pack("H*",$args[0]));
      #$heaterTemperature/10 is the temperature measured by a paired HeatingThermostat
      #we don't do anything with it here, because this value also appears as temperature in the HeatingThermostat's ThermostatState message
      my $mode = vec($bits2, 0, 2); #
      my $dstsetting = vec($bits2, 3, 1); #is automatically switching to DST activated
      my $langateway = vec($bits2, 4, 1); #??
      my $panel = vec($bits2, 5, 1); #1 if the heating thermostat is locked for manually setting the temperature at the device
      my $rferror = vec($bits2, 6, 1); #communication with link partner - if device is not accessible over the air from the cube
      my $batterylow = vec($bits2, 7, 1); #1 if battery is low

      my $untilStr = "";
      if(defined($null2) and ($null1 != 0 or $null2 != 0)) {
        $untilStr = MAX_ParseDateTime($null1,$heaterTemperature,$null2)->{str};
        $heaterTemperature = "";
        $shash->{until} = "$untilStr";
      } else {
        delete($shash->{until});
      }
      $heaterTemperature = "" if(!defined($heaterTemperature));

      Log3 $hash, 5, "battery $batterylow, rferror $rferror, panel $panel, langateway $langateway, dstsetting $dstsetting, mode $mode, displayActualTemperature $displayActualTemperature, heaterTemperature $heaterTemperature, untilStr $untilStr";
      $shash->{rferror} = $rferror;
      readingsBulkUpdate($shash, "mode", $ctrl_modes[$mode] );
      readingsBulkUpdate($shash, "battery", $batterylow ? "low" : "ok");
      readingsBulkUpdate($shash, "batteryState", $batterylow ? "low" : "ok"); # Forum #87575
      readingsBulkUpdate($shash, "panel", $panel ? "locked" : "unlocked");
      readingsBulkUpdate($shash, "rferror", $rferror ? "1" : "0");
      readingsBulkUpdate($shash, "displayActualTemperature", ($displayActualTemperature) ? 1 : 0);
    } else {
      Log3 $hash, 2, "Invalid $msgtype packet"
    }

    my $desiredTemperature = ($desiredTemperatureRaw &0x7F)/2.0; #convert to degree celcius
    if(defined($temperature)) {
      $temperature = ((($desiredTemperatureRaw &0x80)<<1) + $temperature)/10;	# auch Temperaturen über 25.5 °C werden angezeigt !
      Log3 $hash, 5, "desiredTemperature $desiredTemperature, temperature $temperature";
      readingsBulkUpdate($shash, "temperature", sprintf("%2.1f",$temperature));
    } else {
      Log3 $hash, 5, "desiredTemperature $desiredTemperature"
    }

    #This formatting must match with in MAX_Set:$templist
    readingsBulkUpdate($shash, "desiredTemperature", MAX_SerializeTemperature($desiredTemperature));

  }elsif($msgtype eq "ShutterContactState"){
    my $bits = pack("H2",$args[0]);
    my $isopen = vec($bits,0,2) == 0 ? 0 : 1;
    my $unkbits = vec($bits,2,4);
    my $rferror = vec($bits,6,1);
    my $batterylow = vec($bits,7,1);
    Log3 $hash, 5, "ShutterContact isopen $isopen, rferror $rferror, battery $batterylow, unkbits $unkbits";

    $shash->{rferror} = $rferror;

    readingsBulkUpdate($shash, "battery", $batterylow ? "low" : "ok");
    readingsBulkUpdate($shash, "batteryState", $batterylow ? "low" : "ok"); # Forum #87575
    readingsBulkUpdate($shash, "rferror", $rferror ? "1" : "0");
    readingsBulkUpdate($shash,"onoff",$isopen);

  }elsif($msgtype eq "PushButtonState") {
    my ($bits2, $onoff) = unpack("aC",pack("H*",$args[0]));
    #The meaning of $bits2 is completly guessed based on similarity to other devices, TODO: confirm
    my $gateway = vec($bits2, 4, 1); #Paired to a CUBE?
    my $rferror = vec($bits2, 6, 1); #communication with link partner (1 if we did not sent an Ack)
    my $batterylow = vec($bits2, 7, 1); #1 if battery is low

    readingsBulkUpdate($shash, "battery", $batterylow ? "low" : "ok");
    readingsBulkUpdate($shash, "batteryState", $batterylow ? "low" : "ok"); # Forum #87575
    readingsBulkUpdate($shash, "onoff", $onoff);
    readingsBulkUpdate($shash, "connection", $gateway);
    readingsBulkUpdate($shash, "rferror", $rferror ? "1" : "0");

  } elsif(grep /^$msgtype$/, ("HeatingThermostatConfig", "WallThermostatConfig")) {
    readingsBulkUpdate($shash, "ecoTemperature", MAX_SerializeTemperature($args[0]));
    readingsBulkUpdate($shash, "comfortTemperature", MAX_SerializeTemperature($args[1]));
    readingsBulkUpdate($shash, "maximumTemperature", MAX_SerializeTemperature($args[2]));
    readingsBulkUpdate($shash, "minimumTemperature", MAX_SerializeTemperature($args[3]));
    readingsBulkUpdate($shash, ".weekProfile", $args[4]);
    if(@args > 5) { #HeatingThermostat and WallThermostat with new firmware
      readingsBulkUpdate($shash, "boostValveposition", $args[5]);
      readingsBulkUpdate($shash, "boostDuration", $boost_durations{$args[6]});
      readingsBulkUpdate($shash, "measurementOffset", MAX_SerializeTemperature($args[7]));
      readingsBulkUpdate($shash, "windowOpenTemperature", MAX_SerializeTemperature($args[8]));
    }
    if(@args > 9) { #HeatingThermostat
      readingsBulkUpdate($shash, "windowOpenDuration", $args[9]);
      readingsBulkUpdate($shash, "maxValveSetting", $args[10]);
      readingsBulkUpdate($shash, "valveOffset", $args[11]);
      readingsBulkUpdate($shash, "decalcification", "$decalcDays{$args[12]} $args[13]:00");
    }

    MAX_ParseWeekProfile($shash);

  } elsif($msgtype eq "Error") {
    if(@args == 0) {
      delete $shash->{ERROR} if(exists($shash->{ERROR}));
    } else {
      $shash->{ERROR} = join(",",@args);
    }

  } elsif($msgtype eq "AckWakeUp") {
    my ($duration) = @args;
    #substract five seconds safety margin
    $shash->{wakeUpUntil} = gettimeofday() + $duration - 5;

  } elsif($msgtype eq "AckConfigWeekProfile") {
    my ($day, $part, $profile) = @args;

    my $curWeekProfile = MAX_ReadingsVal($shash, ".weekProfile");
    substr($curWeekProfile, $day*52+$part*2*2*7, length($profile)) = $profile;
    readingsBulkUpdate($shash, ".weekProfile", $curWeekProfile);
    MAX_ParseWeekProfile($shash);

  } elsif(grep /^$msgtype$/, ("AckConfigValve", "AckConfigTemperatures", "AckSetDisplayActualTemperature" )) {

    if($args[0] eq "windowOpenTemperature"
    || $args[0] eq "comfortTemperature"
    || $args[0] eq "ecoTemperature"
    || $args[0] eq "maximumTemperature"
    || $args[0] eq "minimumTemperature" ) {
      readingsBulkUpdate($shash, $args[0], MAX_SerializeTemperature($args[1]));
    } else {
      #displayActualTemperature, boostDuration, boostValveSetting, maxValve, decalcification, valveOffset
      readingsBulkUpdate($shash, $args[0], $args[1]);
    }

  } elsif(grep /^$msgtype$/, ("AckSetGroupId", "AckRemoveGroupId" )) {

    readingsBulkUpdate($shash, "groupid", $args[0]);

  } elsif($msgtype eq "Ack") {
    #The payload of an Ack is a 2-digit hex number (being "01" for okey and "81" for "invalid command/argument"
    if($isToMe and (unpack("C",pack("H*",$args[0])) & 0x80)) {
      my $device = $addr;
      $device = $modules{MAX}{defptr}{$device}{NAME} if(exists($modules{MAX}{defptr}{$device}));
      Log3 $hash, 1, "Device $device answered with: Invalid command/argument";
    }
    #with unknown meaning plus the data of a State broadcast from the same device
    #For HeatingThermostats, it does not contain the last three "until" bytes (or measured temperature)
    if($shash->{type} =~ /HeatingThermostat.*/ ) {
      return MAX_Parse($hash, "MAX,$isToMe,ThermostatState,$addr,". substr($args[0],2));
    } elsif($shash->{type} eq "WallMountedThermostat") {
      return MAX_Parse($hash, "MAX,$isToMe,WallThermostatState,$addr,". substr($args[0],2));
    } elsif($shash->{type} eq "ShutterContact") {
      return MAX_Parse($hash, "MAX,$isToMe,ShutterContactState,$addr,". substr($args[0],2));
    } elsif($shash->{type} eq "PushButton") {
      return MAX_Parse($hash, "MAX,$isToMe,PushButtonState,$addr,". substr($args[0],2));
    } elsif($shash->{type} eq "Cube") {
      ; #Payload is always "00"
    } else {
      Log3 $hash, 2, "MAX_Parse: Don't know how to interpret Ack payload for $shash->{type}";
    }
  } elsif(grep /^$msgtype$/,  ("SetTemperature")) { # SetTemperature is send by WallThermostat e.g. when pressing the boost button
    my $bits = unpack("C",pack("H*",$args[0]));
    my $mode = $bits >> 6;
    my $desiredTemperature = ($bits & 0x3F) /2.0; #convert to degree celcius
    readingsBulkUpdate($shash, "mode", $ctrl_modes[$mode] );
    #This formatting must match with in MAX_Set:$templist
    readingsBulkUpdate($shash, "desiredTemperature", MAX_SerializeTemperature($desiredTemperature));
    Log3 $hash, 5, "SetTemperature mode  $ctrl_modes[$mode], desiredTemperature $desiredTemperature";
  } else {
    Log3 $hash, 1, "MAX_Parse: Unknown message $msgtype";
  }

  #Build state READING
  my $state = "waiting for data";
  if(exists($shash->{READINGS})) {
    $state = $shash->{READINGS}{connection}{VAL} ? "connected" : "not connected" if(exists($shash->{READINGS}{connection}));
    $state = "$shash->{READINGS}{desiredTemperature}{VAL} °C" if(exists($shash->{READINGS}{desiredTemperature}));
    $state = $shash->{READINGS}{onoff}{VAL} ? "opened" : "closed" if(exists($shash->{READINGS}{onoff}));
  }

  $state .= " (clock not set)" if($shash->{clocknotset});
  $state .= " (auto)" if(exists($shash->{mode}) and $shash->{mode} eq "auto");
  #Don't print this: it's the standard mode
  #$state .= " (manual)" if(exists($shash->{mode}) and  $shash->{mode} eq "manual");
  $state .= " (until ".$shash->{until}.")" if(exists($shash->{mode}) and $shash->{mode} eq "temporary" );
  $state .= " (battery low)" if($shash->{batterylow});
  $state .= " (rf error)" if($shash->{rferror});

  readingsBulkUpdate($shash, "state", $state);
  readingsBulkUpdate($shash, "RSSI", $shash->{RSSI}) if ($shash->{RSSI});
  readingsEndUpdate($shash, 1);
  return $shash->{NAME}
}

#############################
sub MAX_DbLog_splitFn {

    my $event = shift;
    my $name  = shift;
    my ($reading, $value, $unit) = '';

    my @parts = split(/ /,$event);
    $reading = shift @parts;
    $reading =~ tr/://d;
    $value = $parts[0];
    $value = $parts[1]  if (defined($value) && (lc($value) =~ m/auto/));
    $value = 'n_a' if (!defined($value));
    if (!AttrNum($name, 'DbLog_log_onoff', 0)) {
			$value = '4.5'  if ( $value eq 'off' );
			$value = '30.5' if ( $value eq 'on' );
    }

    $unit = '\xB0C' if ( lc($reading) =~ m/temp/ );
    $unit = '%'     if ( lc($reading) =~ m/valve/ );
    return ($reading, $value, $unit);
}

sub MAX_RenameFn
{
  my $new = shift;
  my $old = shift;
  my $hash;

  for (devspec2array('TYPE=MAX'))
  {
    $hash = $defs{$_};
    next if(!$hash);
    if (exists($hash->{READINGS}{peerList}))
    {
     $hash->{READINGS}{peerList}{VAL} =~ s/$old/$new/;
    }
  }
 return;
}


sub MAX_Notify
{
    # $hash is my hash, $dev_hash is the hash of the changed device
    my $hash     = shift;
    my $dev_hash = shift;
    my $name = $hash->{NAME};

    my ($sd,$sr,$sn,$sm) = split(':', AttrVal($name, 'externalSensor', '::'));

    return  if ($dev_hash->{NAME} ne $sd);

    my $events = deviceEvents($dev_hash,0);
    my $reading; 
    my $val; 
    my $ret;

    foreach  my $event ( @{$events} ) {
	Log3($name, 5, "$name, NOTIFY EVENT -> Dev : $dev_hash->{NAME} | Event : $event");
	($reading,$val) = split(': ',$event);
	$reading =~ s/ //g;
	if (!defined($val) && defined($reading)) { # das muss state sein
	    $val     = $reading;
	    $reading = 'state';
	}
	last if ($reading eq $sr);
    }

    return if (!defined($val) || ($reading ne $sr)); # der Event war nicht dabei

    if (($hash->{devtype} < 6) || ($hash->{devtype} == 8)) {
	return if (!exists($hash->{READINGS}{desiredTemperature}{VAL}));
	my $dt = MAX_ParseTemperature($hash->{READINGS}{desiredTemperature}{VAL});

	Log3($name, 5, "$name, updating externalTemp with $val");
	setReadingsVal($hash, 'externalTemp', $val, TimeNow());

	my $check = MAX_CheckIODev($hash);
	$ret = $check  if ($check ne 'CUL_MAX');
	$ret = CommandSet(undef,$hash->{IODev}{NAME}." fakeWT $name $dt $val") if (!$ret && $sn);
    }

    if ($hash->{devtype} == 6) {
	Log3($name, 5, "$name, $reading - $val");
	return if (($val !~ m/$sn/) && ($val !~ m/$sm/));
	Log3($name, 4, "$name, got external open/close trigger -> $sd:$sr:$val");
	$ret = CommandSet(undef,$name.' open q')  if ($val =~ m/$sn/);
	$ret = CommandSet(undef,$name.' close q') if ($val =~ m/$sm/);
    }

    setReadingsVal($hash, 'temperature', sprintf('%.1f', $val), TimeNow()) if ($hash->{devtype} == 7);

    Log3($name, 3, "$name, NotifyFN : $ret") if ($ret);
    return;
}

sub MAX_FileList
{
  my $dir  = shift;
  my $file = shift;
  my @ret;
  my $found = (!$file) ? 1 : 0;

  if (configDBUsed())
  {
   my @files = split(/\n/, _cfgDB_Filelist('notitle'));
   foreach (@files) 
   {
    next if ( $_ !~ m/^$dir/ );
        $_ =~ s/$dir//;
    $_ =~ s/\.max//;
    $found = 1 if ($_ eq $file);
    push @ret, $_ if ($_);
   }
  }
  else
  {
   return 0 if(!opendir(DH,$dir));
   while(readdir(DH))
   {
    next if ( $_ !~ m,\.max$,);
    $_ =~ s/\.max//;
    $found = 1 if ($_ eq $file);
    push(@ret, $_) if ($_) ;
   }
  closedir(DH);
  }
  return @ret if ($found);
{
  my ($event) = @_;
  my ($reading, $value, $unit) = "";

  my @parts = split(/ /,$event);
  $reading = shift @parts;
  $reading =~ tr/://d;
  $value = $parts[0];
  $value = $parts[1] if(defined($value) && lc($value) =~ m/auto/);
  $unit = "\xB0C" if(lc($reading) =~ m/temp/);
  $unit = "%" if(lc($reading) =~ m/valve/);
  return ($reading, $value, $unit);
}

1;

=pod
=item device
=item summary controls an MAX! device
=item summary_DE Steuerung eines MAX! Geräts
=begin html

<a name="MAX"></a>
<h3>MAX</h3>
<ul>
  Devices from the eQ-3 MAX! group.<br>
  When heating thermostats show a temperature of zero degrees, they didn't yet send any data to the cube. You can
  force the device to send data to the cube by physically setting a temperature directly at the device (not through fhem).
  <br><br>
  <a name="MAXdefine"></a>
  <b>Define</b>
  <ul>
    <code>define &lt;name&gt; MAX &lt;type&gt; &lt;addr&gt;</code>
    <br><br>

    Define an MAX device of type &lt;type&gt; and rf address &lt;addr&gt.
    The &lt;type&gt; is one of HeatingThermostat, HeatingThermostatPlus, WallMountedThermostat, ShutterContact, PushButton, virtualShutterContact.
    The &lt;addr&gt; is a 6 digit hex number.
    You should never need to specify this by yourself, the <a href="#autocreate">autocreate</a> module will do it for you.<br>
    Exception : virtualShutterContact<br>
    It's advisable to set event-on-change-reading, like
    <code>attr MAX_123456 event-on-change-reading .*</code>
    because the polling mechanism will otherwise create events every 10 seconds.<br>

    Example:
    <ul>
      <code>define switch1 MAX PushButton ffc545</code><br>
    </ul>
  </ul>
  <br>

  <a name="MAXset"></a>
  <b>Set</b>
  <ul>
  <a name=""></a><li>deviceRename &lt;value&gt; <br>
   rename of the device and its logfile
  </li>
    <a name=""></a><li>desiredTemperature auto [&lt;temperature&gt;]<br>
        For devices of type HeatingThermostat only. If &lt;temperature&gt; is omitted,
        the current temperature according to the week profile is used. If &lt;temperature&gt; is provided,
        it is used until the next switch point of the week porfile. It maybe one of
        <ul>
          <li>degree celcius between 4.5 and 30.5 in 0.5 degree steps</li>
          <li>"on" or "off" set the thermostat to full or no heating, respectively</li>
          <li>"eco" or "comfort" using the eco/comfort temperature set on the device (just as the right-most physical button on the device itself does)</li>
        </ul></li>
    <a name=""></a><li>desiredTemperature [manual] &lt;value&gt; [until &lt;date&gt;]<br>
        For devices of type HeatingThermostat only. &lt;value&gt; maybe one of
        <ul>
          <li>degree celcius between 4.5 and 30.5 in 0.5 degree steps</li>
          <li>"on" or "off" set the thermostat to full or no heating, respectively</li>
          <li>"eco" or "comfort" using the eco/comfort temperature set on the device (just as the right-most physical button on the device itself does)</li>
        </ul>
        The optional "until" clause, with &lt;data&gt; in format "dd.mm.yyyy HH:MM" (minutes may only be "30" or "00"!),
        sets the temperature until that date/time. Make sure that the cube/device has a correct system time.
        If the keepAuto attribute is 1 and the device is currently in auto mode, 'desiredTemperature &lt;value&gt;'
        behaves as 'desiredTemperature auto &lt;value&gt;'. If the 'manual' keyword is used, the keepAuto attribute is ignored
        and the device goes into manual mode.</li>
    <a name=""></a><li>desiredTemperature boost<br>
      For devices of type HeatingThermostat only.
      Activates the boost mode, where for boostDuration minutes the valve is opened up boostValveposition percent.</li>
    <a name=""></a><li>groupid &lt;id&gt;<br>
      For devices of type HeatingThermostat only.
      Writes the given group id the device's memory. To sync all devices in one room, set them to the same groupid greater than zero.</li>
    <a name=""></a><li>ecoTemperature &lt;value&gt;<br>
      For devices of type HeatingThermostat only. Writes the given eco temperature to the device's memory. It can be activated by pressing the rightmost physical button on the device.</li>
    <a name=""></a><li>comfortTemperature &lt;value&gt;<br>
      For devices of type HeatingThermostat only. Writes the given comfort temperature to the device's memory. It can be activated by pressing the rightmost physical button on the device.</li>
    <a name=""></a><li>measurementOffset &lt;value&gt;<br>
      For devices of type HeatingThermostat only. Writes the given temperature offset to the device's memory. If the internal temperature sensor is not well calibrated, it may produce a systematic error. Using measurementOffset, this error can be compensated. The reading temperature is equal to the measured temperature at sensor + measurementOffset. Usually, the internally measured temperature is a bit higher than the overall room temperature (due to closeness to the heater), so one uses a small negative offset. Must be between -3.5 and 3.5 degree celsius.</li>
    <a name=""></a><li>minimumTemperature &lt;value&gt;<br>
      For devices of type HeatingThermostat only. Writes the given minimum temperature to the device's memory. It confines the temperature that can be manually set on the device.</li>
    <a name=""></a><li>maximumTemperature &lt;value&gt;<br>
            For devices of type HeatingThermostat only. Writes the given maximum temperature to the device's memory. It confines the temperature that can be manually set on the device.</li>
    <a name=""></a><li>windowOpenTemperature &lt;value&gt;<br>
            For devices of type HeatingThermostat only. Writes the given window open temperature to the device's memory. That is the temperature the heater will temporarily set if an open window is detected. Setting it to 4.5 degree or "off" will turn off reacting on open windows.</li>
    <a name=""></a><li>windowOpenDuration &lt;value&gt;<br>
            For devices of type HeatingThermostat only. Writes the given window open duration to the device's memory. That is the duration the heater will temporarily set the window open temperature if an open window is detected by a rapid temperature decrease. (Not used if open window is detected by ShutterControl. Must be between 0 and 60 minutes in multiples of 5.</li>
    <a name=""></a><li>decalcification &lt;value&gt;<br>
        For devices of type HeatingThermostat only. Writes the given decalcification time to the device's memory. Value must be of format "Sat 12:00" with minutes being "00". Once per week during that time, the HeatingThermostat will open the valves shortly for decalcification.</li>
    <a name=""></a><li>boostDuration &lt;value&gt;<br>
        For devices of type HeatingThermostat only. Writes the given boost duration to the device's memory. Value must be one of 5, 10, 15, 20, 25, 30, 60. It is the duration of the boost function in minutes.</li>
    <a name=""></a><li>boostValveposition &lt;value&gt;<br>
        For devices of type HeatingThermostat only. Writes the given boost valveposition to the device's memory. It is the valve position in percent during the boost function.</li>
    <a name=""></a><li>maxValveSetting &lt;value&gt;<br>
        For devices of type HeatingThermostat only. Writes the given maximum valveposition to the device's memory. The heating thermostat will not open the valve more than this value (in percent).</li>
    <a name=""></a><li>valveOffset &lt;value&gt;<br>
        For devices of type HeatingThermostat only. Writes the given valve offset to the device's memory. The heating thermostat will add this to all computed valvepositions during control.</li>
    <a name=""></a><li>factoryReset<br>
        Resets the device to factory values. It has to be paired again afterwards.<br>
        ATTENTION: When using this on a ShutterContact using the MAXLAN backend, the ShutterContact has to be triggered once manually to complete
        the factoryReset.</li>
    <a name=""></a><li>associate &lt;value&gt;<br>
        Associated one device to another. &lt;value&gt; can be the name of MAX device or its 6-digit hex address.<br>
        Associating a ShutterContact to a {Heating,WallMounted}Thermostat makes it send message to that device to automatically lower temperature to windowOpenTemperature while the shutter is opened. The thermostat must be associated to the ShutterContact, too, to accept those messages.
        <b>!Attention: After sending this associate command to the ShutterContact, you have to press the button on the ShutterContact to wake it up and accept the command. See the log for a message regarding this!</b>
        Associating HeatingThermostat and WallMountedThermostat makes them sync their desiredTemperature and uses the measured temperature of the
 WallMountedThermostat for control.</li>
    <a name=""></a><li>deassociate &lt;value&gt;<br>
        Removes the association set by associate.</li>
    <a name=""></a><li>weekProfile [&lt;day&gt; &lt;temp1&gt;,&lt;until1&gt;,&lt;temp2&gt;,&lt;until2&gt;] [&lt;day&gt; &lt;temp1&gt;,&lt;until1&gt;,&lt;temp2&gt;,&lt;until2&gt;] ...<br>
      Allows setting the week profile. For devices of type HeatingThermostat or WallMountedThermostat only. Example:<br>
      <code>set MAX_12345 weekProfile Fri 24.5,6:00,12,15:00,5 Sat 7,4:30,19,12:55,6</code><br>
      sets the profile <br>
      <code>Friday: 24.5 &deg;C for 0:00 - 6:00, 12 &deg;C for 6:00 - 15:00, 5 &deg;C for 15:00 - 0:00<br>
      Saturday: 7 &deg;C for 0:00 - 4:30, 19 &deg;C for 4:30 - 12:55, 6 &deg;C for 12:55 - 0:00</code><br>
      while keeping the old profile for all other days.
    </li>
    <a name=""></a><li>saveConfig &lt;name&gt;<br>

    </li>

    <a name=""></a><li>restoreReadings &lt;name of saved config&gt;<br>

    </li>

    <a name=""></a><li>restoreDevice &lt;name of saved config&gt;<br>

    </li>

    <a name=""></a><li>exportWeekprofile &lt;name od weekprofile device&gt;<br>

    </li>

  </ul>
  <br>

  <a name="MAXget"></a>
  <b>Get</b> <ul>N/A</ul><br>

  <a name="MAXattr"></a>
  <b>Attributes</b>
  <ul>
    <a name="actCycle"></a><li>actCycle &lt;hh:mm&gt; default none (only with CUL_MAX)<br>
    Provides life detection for the device. [hhh: mm] sets the maximum time without a message from this device.<br>
    If no messages are received within this time, the reading activity is set to dead.<br>
    If the device sends again, the reading is reset to alive.<br>
    <b>Important</b> : does not make sense with the ECO Pushbutton,<br>
    as it is the only member of the MAX! family that does not send cyclical status messages !</li><br>
    <a name="CULdev"></a><li>CULdev &lt;name&gt; default none (only with CUL_MAX)<br>
    send device when the CUL_MAX device is using a IOgrp (Multi IO)</li><br>
    <a name="DbLog_log_onoff"></a><li>DbLog_log_onoff (0|1) log on  and off or the real values 30.5 and 4.5</li><br>
    <a name="dummy"></a><li>dummy (0|1) default 0<br>sets device to a read-only device</li><br>
    <a name="debug"></a><li>debug (0|1) default 0<br>creates extra readings (only with CUL_MAX)</li><br>
    <a name="dTempCheck"></a><li>dTempCheck (0|1) default 0<br>
    monitors every 5 minutes whether the Reading desiredTemperature corresponds to the target temperature in the current weekprofile.<br>
    The result is a deviation in Reading dTempCheck, i.e. 0 = no deviation</li><br>
    <a name="externalSensor"></a><li>externalSensor &lt;device:reading&gt; default none<br>
    If there is no wall thermostat in a room but the room temperature is also recorded with an external sensor in FHEM (e.g. LaCrosse)<br>
    the current temperature value can be used to calculate the reading deviation instead of the own reading temperature</li><br>
    <a name="IODev"></a><li>IODev &lt;name&gt;<br>MAXLAN or CUL_MAX device name</li><br>
    <a name="keepAuto"></a><li>keepAuto (0|1) default 0<br>If set to 1, it will stay in the auto mode when you set a desiredTemperature while the auto (=weekly program) mode is active.</li><br>
    <a name="scanTemp"></a><li>scanTemp (0|1) default 0<br>used by MaxScanner</li><br>
    <a name="skipDouble"></a><li>skipDouble (0|1) default 0 (only with CUL_MAX)<br></li>
  </ul>
  <br>

  <a name="MAXevents"></a>
  <b>Generated events:</b>
  <ul>
    <li>desiredTemperature<br>Only for HeatingThermostat and WallMountedThermostat</li>
    <li>valveposition<br>Only for HeatingThermostat</li>
    <li>battery</li>
    <li>batteryState</li>
    <li>temperature<br>The measured temperature (= measured temperature at sensor + measurementOffset), only for HeatingThermostat and WallMountedThermostat</li>
  </ul>
</ul>

=end html

=begin html_DE

<a name="MAX"></a>
<h3>MAX</h3>
<ul>
  Verarbeitet MAX! Ger&auml;te, die von der eQ-3 MAX! Gruppe hergestellt werden.<br>
  Falls Heizk&ouml;rperthermostate eine Temperatur von Null Grad zeigen, wurde von ihnen
  noch nie Daten an den MAX Cube gesendet. In diesem Fall kann das Senden von Daten an
  den Cube durch Einstellen einer Temeratur direkt am Ger&auml;t (nicht &uuml;ber fhem)
  erzwungen werden.
  <br><br>
  <a name="MAXdefine"></a>
  <b>Define</b>
  <ul>
    <code>define &lt;name&gt; MAX &lt;type&gt; &lt;addr&gt;</code>
    <br><br>

    Erstellt ein MAX Ger&auml;t des Typs &lt;type&gt; und der RF Adresse &lt;addr&gt;.
    Als &lt;type&gt; kann entweder <code>HeatingThermostat</code> (Heizk&ouml;rperthermostat),
    <code>HeatingThermostatPlus</code> (Heizk&ouml;rperthermostat Plus),
    <code>WallMountedThermostat</code> (Wandthermostat), <code>ShutterContact</code> (Fensterkontakt),
    <code>PushButton</code> (Eco-Taster) oder <code>virtualShutterContact</code> (virtueller Fensterkontakt) gew&auml;hlt werden.
    Die Adresse &lt;addr&gt; ist eine 6-stellige hexadezimale Zahl.
    Da <a href="#autocreate">autocreate</a> diese vergibt, sollte diese eigentlich nie h&auml;ndisch gew&auml;hlt
    werden m&uuml;ssen. Ausnahme : virtueller Fensterkontakt<br>
    Es wird dringend  empfohlen das Atribut event-on-change-reading zu setzen, z.B.
    <code>attr MAX_123456 event-on-change-reading .*</code> da ansonsten der "Polling" Mechanismus
    alle 10 s ein Ereignis erzeugt.<br>

    Beispiel:
    <ul>
      <code>define switch1 MAX PushButton ffc545</code><br>
    </ul>
  </ul>
  <br>

  <a name="MAXset"></a>
  <b>Set</b>
  <ul>
    <a name="associate"></a><li>associate &lt;value&gt;<br>
      Verbindet ein Ger&auml;t mit einem anderen. &lt;value&gt; kann entweder der Name eines MAX Ger&auml;tes oder
      seine 6-stellige hexadezimale Adresse sein.<br>
      Wenn ein Fensterkontakt mit einem HT/WT verbunden wird, sendet der Fensterkontakt automatisch die <code>windowOpen</code> Information wenn der Kontakt
      ge&ouml;ffnet ist. Das Thermostat muss ebenfalls mit dem Fensterkontakt verbunden werden, um diese Nachricht zu verarbeiten.
      <b>Achtung: Nach dem Senden der Botschaft zum Verbinden an den Fensterkontakt muss der Knopf am Fensterkontakt gedr&uuml;ckt werden um den Fensterkonakt aufzuwecken
      und den Befehl zu verarbeiten. Details &uuml;ber das erfolgreiche Verbinden finden sich in der Logdatei!</b>
      Das Verbinden eines Heizk&ouml;rperthermostates und eines Wandthermostates synchronisiert deren
      <code>desiredTemperature</code> und verwendet die am Wandthermostat gemessene Temperatur f&uuml;r die Regelung.</li>

    <a name="comfortTemperature"></a><li>comfortTemperature &lt;value&gt;<br>
      Nur f&uuml;r HT/WT. Schreibt die angegebene <code>comfort</code> Temperatur in den Speicher des Ger&auml;tes.<br>
      Diese kann durch dr&uuml;cken der Taste Halbmond/Stern am Ger&auml;t aktiviert werden.</li>

    <a name="deassociate"></a><li>deassociate &lt;value&gt;<br>
      L&ouml;st die Verbindung, die mit <code>associate</code> gemacht wurde, wieder auf.</li>

    <a name="desiredTemperature"></a><li>desiredTemperature &lt;value&gt; [until &lt;date&gt;]<br>
        Nur f&uuml;r HT/WT &lt;value&gt; kann einer aus folgenden Werten sein
        <ul>
          <li>Grad Celsius zwischen 4,5 und 30,5 Grad Celisus in 0,5 Grad Schritten</li>
          <li>"on" (30.5) oder "off" (4.5) versetzt den Thermostat in volle Heizleistung bzw. schaltet ihn ab</li>
          <li>"eco" oder "comfort" mit der eco/comfort Temperatur, die direkt am Ger&auml;t
              eingestellt wurde (&auml;nhlich wie die Halbmond/Stern Taste am Ger&auml;t selbst)</li>
          <li>"auto &lt;temperature&gt;". Damit wird das am Thermostat eingestellte Wochenprogramm
              abgearbeitet. Wenn optional die Temperatur &lt;temperature&gt; angegeben wird, wird diese
              bis zum n&auml;sten Schaltzeitpunkt des Wochenprogramms als <code>desiredTemperature</code> gesetzt.</li>
          <li>"boost" aktiviert den Boost Modus, wobei f&uuml;r <code>boostDuration</code> Minuten
              das Ventil <code>boostValveposition</code> Prozent ge&ouml;ffnet wird.</li>
        </ul>
        Alle Werte au&szlig;er "auto" k&ouml;nnen zus&auml;zlich den Wert "until" erhalten,
        wobei &lt;date&gt; in folgendem Format sein mu&szlig;: "TT.MM.JJJJ SS:MM"
        (Minuten nur 30 bzw. 00 !), um kurzzeitige eine andere Temperatur bis zu diesem Datum und dieser
        Zeit einzustellen. Wichtig : der Zeitpunkt muß in der Zukunft liegen !<br>
	Wenn dd.mm.yyyy dem heutigen Tag entspricht kann statdessen auch das Schl&uml;sselwort today verwendet werden.
	Bitte sicherstellen, dass der Cube bzw. das Ger&auml;t die korrekte Systemzeit hat</li>

      <a name="deviceRename"></a><li>deviceRename &lt;value&gt; <br>
	Benennt das Device um, inklusive dem durch autocreate erzeugtem Logfile</li>

     <a name="ecoTemperature"></a><li>ecoTemperature &lt;value&gt;<br>
      Nur f&uuml;r HT/WT. Schreibt die angegebene <code>eco</code> Temperatur in den Speicher
      des Ger&auml;tes. Diese kann durch Dr&uuml;cken der Halbmond/Stern Taste am Ger&auml;t aktiviert werden.</li>

    <a name="export_Weekprofile"></a><li>export_Weekprofile [device weekprofile name]</li>

    <a name="factoryReset"></a><li>factoryReset<br>
      Setzt das Ger&auml;t auf die Werkseinstellungen zur&uuml;ck. Das Ger&auml;t muss anschlie&szlig;end neu angelernt werden.<br>
      ACHTUNG: Wenn dies in Kombination mit einem Fensterkontakt und dem MAXLAN Modul
      verwendet wird, muss der Fensterkontakt einmal manuell ausgel&ouml;st werden, damit das Zur&uuml;cksetzen auf Werkseinstellungen beendet werden kann.</li>


    <a name="groupid"></a><li>groupid &lt;id&gt;<br>
      Nur f&uuml;r Heizk&ouml;rperthermostate.
      Schreibt die angegebene Gruppen ID in den Speicher des Ger&auml;tes.
      Um alle Ger&auml;te in einem Raum zu synchronisieren, k&ouml;nnen diese derselben Gruppen ID
      zugeordnet werden, diese mu&szlig; gr&ouml;&szlig;er Null sein.</li>

    <a name="measurementOffset"></a><li>measurementOffset &lt;value&gt;<br>
      Nur f&uuml;r Heizk&ouml;rperthermostate. Schreibt die angegebene <code>offset</code> Temperatur in den Speicher
      des Ger&auml;tes. Wenn der interne Temperatursensor nicht korrekt kalibriert ist, kann dieses einen
      systematischen Fehler erzeugen. Mit dem Wert <code>measurementOffset</code>, kann dieser Fehler
      kompensiert werden. Die ausgelese Temperatur ist gleich der gemessenen
      Temperatur + <code>measurementOffset</code>. Normalerweise ist die intern gemessene Temperatur h&ouml;her
      als die Raumtemperatur, da der Sensor n&auml;her am Heizk&ouml;rper ist und man verwendet einen
      kleinen negativen Offset, der zwischen -3,5 und 3,5 Kelvin sein mu&szlig;.</li>
    <a name="minimumTemperature"></a><li>minimumTemperature &lt;value&gt;<br>
      Nur f&uuml;r Heizk&ouml;rperthermostate. Schreibt die angegemene <code>minimum</code> Temperatur in der Speicher
      des Ger&auml;tes. Diese begrenzt die Temperatur, die am Ger&auml;t manuell eingestellt werden kann.</li>
    <a name="maximumTemperature"></a><li>maximumTemperature &lt;value&gt;<br>
      Nur f&uuml;r Heizk&ouml;rperthermostate. Schreibt die angegemene <code>maximum</code> Temperatur in der Speicher
      des Ger&auml;tes. Diese begrenzt die Temperatur, die am Ger&auml;t manuell eingestellt werden kann.</li>
    <a name="windowOpenTemperature"></a><li>windowOpenTemperature &lt;value&gt;<br>
      Nur f&uuml;r Heizk&ouml;rperthermostate. Schreibt die angegemene <code>window open</code> Temperatur in den Speicher
      des Ger&auml;tes. Das ist die Tempereratur, die an der Heizung kurzfristig eingestellt wird, wenn ein
      ge&ouml;ffnetes Fenster erkannt wird. Der Wert 4,5 Grad bzw. "off" schaltet die Reaktion auf
      ein offenes Fenster aus.</li>
    <a name="windowOpenDuration"></a><li>windowOpenDuration &lt;value&gt;<br>
      Nur f&uuml;r Heizk&ouml;rperthermostate. Schreibt die angegebene <code>window</code> open Dauer in den Speicher
      des Ger&auml;tes. Dies ist die Dauer, w&auml;hrend der die Heizung kurzfristig die window open Temperatur
      einstellt, wenn ein offenes Fenster durch einen schnellen Temperatursturz erkannt wird.
      (Wird nicht verwendet, wenn das offene Fenster von <code>ShutterControl</code> erkannt wird.)
      Parameter muss zwischen Null und 60 Minuten sein als Vielfaches von 5.</li>
    <a name="decalcification"></a><li>decalcification &lt;value&gt;<br>
      Nur f&uuml;r Heizk&ouml;rperthermostate. Schreibt die angegebene Zeit f&uuml;r <code>decalcification</code>
      in den Speicher des Ger&auml;tes. Parameter muss im Format "Sat 12:00" sein, wobei die Minuten
      "00" sein m&uuml;ssen. Zu dieser angegebenen Zeit wird das Heizk&ouml;rperthermostat das Ventil
      kurz ganz &ouml;ffnen, um vor Schwerg&auml;ngigkeit durch Kalk zu sch&uuml;tzen.</li>
    <a name="boostDuration"></a><li>boostDuration &lt;value&gt;<br>
      Nur f&uuml;r Heizk&ouml;rperthermostate. Schreibt die angegebene Boost Dauer in den Speicher
      des Ger&auml;tes. Der gew&auml;hlte Parameter muss einer aus 5, 10, 15, 20, 25, 30 oder 60 sein
      und gibt die Dauer der Boost-Funktion in Minuten an.</li>
    <a name="boostValveposition"></a><li>boostValveposition &lt;value&gt;<br>
      Nur f&uuml;r Heizk&ouml;rperthermostate. Schreibt die angegebene Boost Ventilstellung in den Speicher
      des Ger&auml;tes. Dies ist die Ventilstellung (in Prozent) die bei der Boost-Fumktion eingestellt wird.</li>
    <a name="maxValveSetting"></a><li>maxValveSetting &lt;value&gt;<br>
      Nur f&uuml;r Heizk&ouml;rperthermostate. Schreibt die angegebene maximale Ventilposition in den Speicher
      des Ger&auml;tes. Der Heizk&ouml;rperthermostat wird das Ventil nicht weiter &ouml;ffnen als diesen Wert
      (Angabe in Prozent).</li>
    <a name="valveOffset"></a><li>valveOffset &lt;value&gt;<br>
      Nur f&uuml;r Heizk&ouml;rperthermostate. Schreibt den angegebenen <code>offset</code> Wert der Ventilstellung
      in den Speicher des Ger&auml;tes Der Heizk&ouml;rperthermostat wird diesen Wert w&auml;hrend der Regelung
      zu den berechneten Ventilstellungen hinzuaddieren.</li>


    <a name="weekProfile"></a><li>weekProfile [&lt;day&gt; &lt;temp1&gt;,&lt;until1&gt;,&lt;temp2&gt;,&lt;until2&gt;]
      [&lt;day&gt; &lt;temp1&gt;,&lt;until1&gt;,&lt;temp2&gt;,&lt;until2&gt;] ...<br>
      Erlaubt das Setzen eines Wochenprofils. Nur f&uuml;r Heizk&ouml;rperthermostate bzw. Wandthermostate.<br>
      Beispiel:<br>
      <code>set MAX_12345 weekProfile Fri 24.5,6:00,12,15:00,5 Sat 7,4:30,19,12:55,6</code><br>
      stellt das folgende Profil ein<br>
      <code>Freitag: 24.5 &deg;C von 0:00 - 6:00, 12 &deg;C von 6:00 - 15:00, 5 &deg;C von 15:00 - 0:00<br>
      Samstag: 7 &deg;C von 0:00 - 4:30, 19 &deg;C von 4:30 - 12:55, 6 &deg;C von 12:55 - 0:00</code><br>
      und beh&auml;lt die Profile f&uuml;r die anderen Wochentage bei.
    </li>
    <a name="saveConfig">saveConfig</a><li>saveConfig [name]</li>
    <a name="restoreRedings"></a><li>restoreRedings [name]</li>
    <a name="restoreDevice"></a><li>restoreDevice [name]</li>
  </ul>
  <br>

  <a name="MAXget"></a>
  <b>Get</b>
   <ul>
   <a name=""></a><li>show_savedConfig <device><br>
   zeigt gespeicherte Konfigurationen an die mittels set restoreReadings / restoreDevice verwendet werden k&ouml;nnen<br>
   steht erst zur Verf&uuml;gung wenn für dieses Ger&auml;t eine gespeichrte Konfiguration gefunden wurde.
   </li>
  </ul><br>

  <a name="MAXattr"></a>
  <b>Attributes</b>
  <ul>
    <a name="actCycle"></a> <li>actCycle &lt;hh:mm&gt; default leer (nur mit CUL_MAX)<br>
    Stellt eine Lebenserkennung für das Ger&auml;t zur Verf&uuml;gung. [hhh:mm] legt die maximale Zeit ohne eine Nachricht dieses Ger&auml;ts fest.<br>
    Wenn innerhalb dieser Zeit keine Nachrichten empfangen werden wird das Reading Actifity auf dead gesetzt.<br>
    Sendet das Ger&auml;t wieder wird das Reading auf alive zur&uuml;ck gesetzt.<br>
    <b>Wichtig</b> : Der Einsatz ist Nicht sinnvoll beim ECO Taster, da dieser als einziges Mitglied der MAX! Familie keine zyklischen Statusnachrichten verschickt !</li><br>
    <a name="CULdev"></a><li>CULdev &lt;name&gt; default leer (nur mit CUL_MAX)<br>
    CUL der zum senden benutzt wird wenn CUL_MAX eine IO Gruppe verwendet (Multi IO )</li><br>

    <a name="DbLog_log_onoff"></a><li>DbLog_log_onoff (0|1) schreibe die Werte on und off als Text in die DB oder ersetzt sie direkt durch
    ihre numerischen Werte 30.5 and 4.5<br>Hilfreich bei Plots da auf eine extra Plotfunktion verzichtet werden kann.</li><br>

    <a name="debug"></a><li>debug (0|1) default 0<br>erzeugt zus&auml;tzliche Readings (nur mit CUL_MAX)</li><br>

    <a name="dTempCheck"></a><li>dTempCheck (0|1) default 0<br>&uuml;berwacht im Abstand von 5 Minuten ob das Reading desiredTemperatur
     der Soll Temperatur im aktuellen Wochenprofil entspricht. (nur f&uuml; Ger&aumk;te vom Typ HT oder WT)<br>
     Das Ergebniss steht als Abweichung im Reading dTempCheck, d.h. 0 = keine Abweichung<br>
     Die &Uuml;berwachung is nur aktiv wenn die Soll Temperatur ungleich der Window Open Temperatur ist</li><br>

    <a name="dummy"></a><li>dummy (0|1) default 0<br>macht das Device zum read-only Device</li><br>

    <a name="externalSensor"></a><li>externalSensor &lt;device:reading&gt; default none<br>
    Wenn in einem Raum kein Wandthermostat vorhanden ist aber die Raumtemperatur zus&auml;tlich mit einem externen Sensor in FHEM erfasst wird (z.B. LaCrosse)<br>
    kann dessen aktueller Temperatur Wert zur Berechnung des Readings deviation benutzt werden statt des eigenen Readings temperature</li><br>

    <a name="IODev"></a><li>IODev &lt;name&gt;<br> MAXLAN oder CUL_MAX Device Name</li><br>

    <a name="keepAuto"></a><li>keepAuto (0|1) default 0<br>Wenn der Wert auf 1 gesetzt wird, bleibt das Ger&auml;t im Wochenprogramm auch wenn ein desiredTemperature gesendet wird.</li><br>

    <a name="scanTemp"></a><li>scanTemp (0|1) default 0<br>wird vom MaxScanner benutzt</li><br>

    <a name="skipDouble"></a><li>skipDouble (0|1) default 0 (nur mit CUL_MAX)<br>
    Wenn mehr als ein Thermostat zusammmen mit einem Fensterkontakt und/oder einem Wandthermostst eine Gruppe bildet,<br>
    versendet jedes Mitglieder der Gruppe seine Statusnachrichten einzeln an jedes andere Mitglied der Gruppe.<br>
    Das f&uuml;hrt dazu das manche Events doppelt oder sogar dreifach ausgel&ouml;st werden, kann mit diesem Attribut unterdr&uuml;ckt werden.</li><br>

    <a name="windowOpenCheck"></a><li>windowOpenCheck (0|1)<br>&uuml;berwacht im Abstand von 5 Minuten ob bei Geräten vom Typ ShutterContact das Reading onoff den Wert 1 hat (Fenster offen , default 1)<br>
     oder bei Geräten vom Typ HT/WT ob die Soll Temperatur gleich der Window Open Temperatur ist (default 0). Das Ergebniss steht im Reading windowOpen, Format hh:mm</li><br>
  </ul>
  <br>

  <a name="MAXevents"></a>
  <b>Erzeugte Ereignisse:</b>
  <ul>
    <li>desiredTemperature<br>Nur f&uuml;r Heizk&ouml;rperthermostate und Wandthermostate</li>
    <li>valveposition<br>Nur f&uuml;r Heizk&ouml;rperthermostate</li>
    <li>battery</li>
    <li>batteryState</li>
    <li>temperature<br>Die gemessene Temperatur (= gemessene Temperatur + <code>measurementOffset</code>),
       nur f&uuml;r Heizk&ouml;rperthermostate und Wandthermostate</li>
  </ul>
</ul>

=end html_DE
=cut

