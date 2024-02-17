# reload 99_myUtils

package main;
 use strict;
 use warnings;
 use POSIX;
 
 sub myUtils_Initialize($$)
 {
   my ($hash) = @_;
 }
 
 sub myUtils_checkZigbee()
 {
 	foreach my $dev (devspec2array("NAME=zb.*")) {
		my $tmp = ReadingsAge($dev, "last_seen", 9999);
		if ($tmp < 3600) {
			fhem("setreading $dev lwt up");
			fhem("setreading $dev lwtDown up");
		} else{
			fhem("setreading $dev lwt down");
			fhem("setreading $dev lwtDown down ".AttrVal("$dev","alias",$dev));
		}
    }
 }
 # 0 : initialisiert, kommt nie; set Alarm.Doif checkall
 # 1 : np     ([Alarm_:level.] eq "disarmed" and [Status<gruppe>:AlarmState] eq "1")
 # 2 : off    ([Alarm_:level.] eq "disarmed" and [Status<gruppe>:AlarmState] eq "0")
 # 3 : seton  ([Alarm_:level.] eq "armwait")
 # 4 : on     ([Alarm_:level.] eq "armed" and [Password] eq "on")
 # 5 : na     ([Alarm_:level.] eq "armed" and [Password] ne "on")
 # 6 : arm    ($cmd==98) mit $self und $group
 # 7 : disarm ($cmd==99) mit $self und $group
 #######
 # 8 : alarm
 # 9 : cancel / Widerruf
 ############
 # Level
 # 0 : Erinnerungen ohne Alarm
 # 1 : technische Störungen ohne Alarm
 # 2 : Test, optische Möglichkeit zur Überprüfung der Alarmkreise
 # 3 : Alarmkreis 1
 # 4 : Alarmkreis 2
 # 5 : Alarmkreis 3
 # 6 : Alarmkreis Sabotage 
 # 7 : Sofortalarm / Notfallauslöser
 # virtuelle level:
 # 8 : Service (alle Alarme abgestellt)
 # 9 : Alarm widerrufen ("cancel" statt "disarm")
 
 sub myUtils_SetAlarm($$;$$)
 {
   my ($nr, $set, $self, $group) = @_;
   my $colorM = "0";
   my $colorN = "0";
   
   $set = "on" if ($set eq "na" and $nr == 2); 
   
   #         rrggbb 
   if ($set eq "np" and ($nr == 2 or $nr == 8 or $nr == 9)) {
     $colorM = "000000";$colorN = "000000";  # violett         # ein nicht möglich (not possible)
   } elsif ($set eq "np") {
     $colorM = "010001";$colorN = "FF00FF";  # dunkel bzw grau # unscharf, aus
   } elsif ($set eq "off") {
     $colorM = "000000";$colorN = "909090";  # dunkel bzw grau # unscharf, aus
   } elsif ($set eq "seton") {
     $colorM = "000001";$colorN = "0000FF";  # blau            # beim Einschalten/Scharfschalten
   } elsif ($set eq "on") {
     $colorM = "000100";$colorN = "53f3c7";  # grün            # scharf, ein: colorN wie Alarm_
   } elsif ($set eq "na") {
     $colorM = "000100";$colorN = "53f3c7";  # grün            # scharf, ein, aus nicht verfügbar (not available)
   } elsif ($set eq "arm" or $set eq "armed") {
     $colorM = "010100";$colorN = "FFFF00";  # gelb            # scharf schalten
   } elsif ($set eq "disarm" or $set eq "disarmed") {
     $colorM = "000101";$colorN = "00FFFF";  # türkis          # unscharf schalten
   } elsif ($set eq "cancel") {
     $colorM = "010101";$colorN = "FFFFFF";  # weiss           # unscharf schalten
   } elsif ($set eq "alarm") {
     $colorM = "010000";$colorM = "FF0000";  # rot             # scharf, Alarm ausgelöst
   }
   
   fhem("attr Alarm".$nr."Button disable 0");
   fhem("set Alarm".$nr."Button ".$set);
   fhem("setreading EspKeypad N".$nr." ".$colorN);
   fhem("set EspKeypad M".$nr." ".$colorM);
   fhem("setreading group=".$group." D1 ".($set eq "arm" ? "1" : "0")) if ($group and $group ne "ohne");
   fhem("set Password off") if ($nr > 2 and $nr < 8 and $set eq "arm");
   fhem("attr Alarm".$nr."Button disable 1") if ($nr > 0 && ($set eq "np" || $set eq "na"));
   fhem("defmod at_ntfy".$nr." at +00:00:05 set ".$self." checkall") if ($self);
   my $debug = $nr." ".$set." ".$colorM;
   $debug .= ",self ".$self if $self;
   $debug .= ",group ".$group if $group;
   Log3 "Alarm".$nr."Doif", 4, $debug;
   return 0;
 }
 
 sub myUtils_UF($$$)
 {
   my ($self, $device, $event) = @_;
   my $sender = "espIR2";
   my $command = "IR";
	 my %UF_cmds = (
		r1 =>        "0200401", 
		r2 =>        "0210402", 
		r3 =>        "0200403", 
		r4 =>        "0210404", 
		r5 =>        "0200405", 
		r6 =>        "0210406", 
		r7 =>        "0200407", 
		rPOWEROFF => "02004C7",
		rUP =>       "0201010",
		rDOWN =>     "0211011",
		rMUTE =>     "020100D",

		t0 =>        "0320DF08F7",
		t1 =>        "0320DF8877",
		t2 =>        "0320DF48B7",
		t3 =>        "0320DFC837",
		t4 =>        "0320DF28D7",
		t5 =>        "0320DFA857",
		t6 =>        "0320DF6897",
		t7 =>        "0320DFE817",
		t8 =>        "0320DF18E7",
		t9 =>        "0320DF9867",
		tPOWEROFF => "0320DF10EF",
		tUP =>       "0320DF40BF",
		tDOWN =>     "0320DFC03F",
		tMUTE =>     "0320DF906F",
		B001 => "",
	); 
	if ($UF_cmds{$event}){
	  fhem("set ".$sender." ".$command." ".$UF_cmds{$event})
	} else {
	  fhem("attr $self comment $device:$event ist unbekannt");
	}
 }
 
 sub myBlumenGiessen($$)
 {
   my ($name,$channel) = @_;
   my $val = ReadingsVal("$name","state",0);
   my $min = ReadingsVal("$name","alarm/low.$channel",0);
   my $max = ReadingsVal("$name","alarm/high.$channel",5);
   my $alarm = ReadingsVal("$name","alarm","");
   if($val < $min || $val > $max) {"on"} 
   elsif ($val > $min+0.1 && $val < $max - 0.1 || ($alarm ne "on" && $alarm ne "off")) {"off"} 
   else {undef}
 }
 
 sub myHEX2CIE($$)
 {
   my $rgb_hex = shift;
   my $briFactor = shift;
   
   #my @rgb 
   my ($r, $g, $b) = map $_ / 255, unpack 'C*', pack 'H*', $rgb_hex;
   #return myRGB2CIE($rgb);
   
   #;
   #$r = ($r > 0.04045) ? pow(($r + 0.055) / (1.0 + 0.055), 2.4) : ($r / 12.92);
   #$g = ($g > 0.04045) ? pow(($g + 0.055) / (1.0 + 0.055), 2.4) : ($g / 12.92);
   #$b = ($b > 0.04045) ? pow(($b + 0.055) / (1.0 + 0.055), 2.4) : ($b / 12.92);
   #my $X = $r * 0.649926 + $g * 0.103455 + $b * 0.197109;
   #my $Y = $r * 0.234327 + $g * 0.743075 + $b * 0.022598;
   #my $Z = $r * 0.000000 + $g * 0.053077 + $b * 1.035763;
   
   # https://www.cs.rit.edu/~ncs/color/t_convert.html: nicht genau genug bei Blau
   # my $X = $r * 0.412453 + $g * 0.357580 + $b * 0.180423;
   # my $Y = $r * 0.212671 + $g * 0.715160 + $b * 0.072169;
   # my $Z = $r * 0.019334 + $g * 0.119193 + $b * 0.950227;
   
   # IKEA empirisch, Matrix nach http://docs-hoffmann.de/ciexyz29082000.pdf
   my @Px = (0.37532339, 0.385281079, 0.189851458);
   my @Py = (0.181974977, 0.770562159, 0.047462864);
   my @Pz = (0.011373436, 0.128427026, 0.949257288);

   my $X = $r * $Px[0] + $g * $Px[1] + $b * $Px[2];
   my $Y = $r * $Py[0] + $g * $Py[1] + $b * $Py[2];
   my $Z = $r * $Pz[0] + $g * $Pz[1] + $b * $Pz[2];
  
   my $x = $X / ($X + $Y + $Z);
   my $y = $Y / ($X + $Y + $Z);
   
   my $bri = $Y * $briFactor; #$Y;
   return $x, $y, $bri;
 }
 
 sub myRGB2CIE($$$$)
 {
   my ($r, $g, $b, $bri) = @_;
   #return "$r $g $b";
   
   #$r = ($r > 0.04045) ? pow(($r + 0.055) / (1.0 + 0.055), 2.4) : ($r / 12.92);
   #$g = ($g > 0.04045) ? pow(($g + 0.055) / (1.0 + 0.055), 2.4) : ($g / 12.92);
   #$b = ($b > 0.04045) ? pow(($b + 0.055) / (1.0 + 0.055), 2.4) : ($b / 12.92);
   #my $X = $r * 0.649926 + $g * 0.103455 + $b * 0.197109;
   #my $Y = $r * 0.234327 + $g * 0.743075 + $b * 0.022598;
   #my $Z = $r * 0.000000 + $g * 0.053077 + $b * 1.035763;
   
   # https://www.cs.rit.edu/~ncs/color/t_convert.html: nicht genau genug bei Blau
   # my $X = $r * 0.412453 + $g * 0.357580 + $b * 0.180423;
   # my $Y = $r * 0.212671 + $g * 0.715160 + $b * 0.072169;
   # my $Z = $r * 0.019334 + $g * 0.119193 + $b * 0.950227;
   
   # IKEA empirisch, Matrix nach http://docs-hoffmann.de/ciexyz29082000.pdf
   my @Px = (0.37532339, 0.385281079, 0.189851458);
   my @Py = (0.181974977, 0.770562159, 0.047462864);
   my @Pz = (0.011373436, 0.128427026, 0.949257288);

   my $X = $r * $Px[0] + $g * $Px[1] + $b * $Px[2];
   my $Y = $r * $Py[0] + $g * $Py[1] + $b * $Py[2];
   my $Z = $r * $Pz[0] + $g * $Pz[1] + $b * $Pz[2];
  
   my $x = $X / ($X + $Y + $Z);
   my $y = $Y / ($X + $Y + $Z);
   
   #my $bri = 254; #$Y;
   return $x, $y, $bri;
 }

sub myHUE2CIE($$)
 {
   my $hue = shift;
   my $briFactor = shift;
   my $R;
   my $G;
   my $B;
   my $X = 1 - abs(($hue / 60) % 2 - 1);
   if    ($hue <  60) {$R =  1; $G = $X; $B =  0;}
   elsif ($hue < 120) {$R = $X; $G =  1; $B =  0;}
   else               {$R =  1; $G =  0; $B = $X;}
   my $r = $R*255;
   my $g = $G*255;
   my $b = $B*255;
   
   #$r = ($r > 0.04045) ? pow(($r + 0.055) / (1.0 + 0.055), 2.4) : ($r / 12.92);
   #$g = ($g > 0.04045) ? pow(($g + 0.055) / (1.0 + 0.055), 2.4) : ($g / 12.92);
   #$b = ($b > 0.04045) ? pow(($b + 0.055) / (1.0 + 0.055), 2.4) : ($b / 12.92);
   #my $X = $r * 0.649926 + $g * 0.103455 + $b * 0.197109;
   #my $Y = $r * 0.234327 + $g * 0.743075 + $b * 0.022598;
   #my $Z = $r * 0.000000 + $g * 0.053077 + $b * 1.035763;
   
   # https://www.cs.rit.edu/~ncs/color/t_convert.html: nicht genau genug bei Blau
   # my $X = $r * 0.412453 + $g * 0.357580 + $b * 0.180423;
   # my $Y = $r * 0.212671 + $g * 0.715160 + $b * 0.072169;
   # my $Z = $r * 0.019334 + $g * 0.119193 + $b * 0.950227;
   
   # IKEA empirisch, Matrix nach http://docs-hoffmann.de/ciexyz29082000.pdf
   my @Px = (0.37532339, 0.385281079, 0.189851458);
   my @Py = (0.181974977, 0.770562159, 0.047462864);
   my @Pz = (0.011373436, 0.128427026, 0.949257288);

      $X = $r * $Px[0] + $g * $Px[1] + $b * $Px[2];
   my $Y = $r * $Py[0] + $g * $Py[1] + $b * $Py[2];
   my $Z = $r * $Pz[0] + $g * $Pz[1] + $b * $Pz[2];
  
   my $x = $X / ($X + $Y + $Z);
   my $y = $Y / ($X + $Y + $Z);
   
   my $bri = $Y * $briFactor; #$Y;
   return $x, $y, $bri;
 }
 
sub myFarblicht($$){
	my ($schalter,$licht) = @_;
 
 	my $fT = ReadingsTimestamp("$schalter","Farbe",0);
	my $wT = ReadingsTimestamp("$schalter","Weiss",0);
	my $hT = ReadingsTimestamp("$schalter","Helligkeit",0);
	my $sT = ReadingsTimestamp("$schalter","state",0);
	my $fV = ReadingsVal("$schalter","Farbe",0);
	my $wV = ReadingsVal("$schalter","Weiss",0);
	my $hV = ReadingsVal("$schalter","Helligkeit",0);
	my $sV = ReadingsVal("$schalter","state",0);
	my $erg = "";
	my $erg2 = "";
	if ($sT gt $wT && $sT gt $fT && $sT gt $hT){
		$erg2 = "$fT $fV $wV $hV $sV";
		$erg = "{\"state\":\"$sV\"}";
	} elsif ($hT gt $wT && $hT gt $fT){
		$erg2 = "$fT $fV $wV $hV $sV";
		$erg = ($hV == 0 ? "{\"state\":\"OFF\"}" : "{\"state\":\"ON\",\"brightness\":$hV}");
	} elsif ($fT gt $wT){
	  my ($r1,$g1,$b1)=Color::hsv2rgb($fV,1,1); 
	  my ($cieX1,$cieY1,$cieB1) = myRGB2CIE($r1,$g1,$b1,$hV);
	  $erg2 = "$fT $fV $wV $hV,$cieB1 ".round($r1,0).",".round($g1,0).",".round($b1,0)." ". $sV;
	  $erg = "{\"state\":\"ON\",\"color\":{\"x\":$cieX1,\"y\":$cieY1}}";
	} else{
	  my ($r1,$g1,$b1)=Color::ct2rgb($wV); 
	  my ($cieX2,$cieY2,$cieB2) = myRGB2CIE($r1,$g1,$b1,$hV);
	  $erg2 = "$wT $fV $wV $hV,$cieB2 ".round($r1,0).",".round($g1,0).",".round($b1,0)." ". $sV;
	  $erg = "{\"state\":\"ON\",\"color\":{\"x\":$cieX2,\"y\":$cieY2} }";
	}
    fhem("set $licht set $erg");
	return "$erg2 : $erg";
}

sub myInfoList($$){
  my ($search,$internal) = @_;
  my @ret;
  my @etDev = devspec2array($search);
  foreach my $d (@etDev) {
    next unless $d;
    next if($d eq $search && !$defs{$d});
    push @ret, $defs{$d}{$internal}.' '.$defs{$d}{'NAME'};
  }
  return sort @ret;
}

sub myAtDay($$){
  my ($search,$internal) = @_;
  my @ret;
  my @etDev = devspec2array($search);
  my $alarm = '20240211';
  my $warn = '20240311';
  my @retAlarm;
  my @retWarn;
  my @retNormal;
  foreach my $d (@etDev) {
    next unless $d;
    next if($d eq $search && !$defs{$d});
	my $test = $defs{$d}{$internal};
	if ($test < $alarm){
	  push @retAlarm,  $test.' '.$defs{$d}{'NAME'};
	} elsif ($test < $warn){
	  push @retWarn,  $test.' '.$defs{$d}{'NAME'};
	} else {
	  push @retNormal,  $test.' '.$defs{$d}{'NAME'};
	} 
  }
  fhem "set termine_naechster faellig ".join( "\n\r", sort @retAlarm );
  fhem "set termine_naechster demnaechst ".join( "\n\r", sort @retWarn );
  fhem "set termine_naechster alle ".join( "\n\r", sort @retNormal );
}
1;
