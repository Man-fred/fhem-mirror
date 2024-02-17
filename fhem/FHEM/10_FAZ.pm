##############################################
# $Id: 10_FAZ.pm 8070 2016-11-19 12:45:34Z rudolfkoenig$
#  von F S 2 0
package main;

use strict;
use warnings;
use SetExtensions;

my %codes = (
  "000" => "C0",
  "002" => "C0-02", # 0103
  "100" => "C1",
  "102" => "C1-02", # 0102
  "104" => "C1-04", # 0102 int. scharf
  "10A" => "C1-0A", # 0102
  "200" => "C2",
  "202" => "C2-02", # 0101, 0106
  "20A" => "C2-0A", # 0101
  "20C" => "C2-0C", # 0101
  "300" => "C3",
  "302" => "C3-02", # 0100
  "30A" => "C3-0A",
  "400" => "C4",
  "500" => "C5",
  "800" => "C-PIR",
  "810" => "C-PIR-10", # Gehtest Ende
  "814" => "C-PIR-14",
  "81A" => "C-PIR-1A",
  "81C" => "C-PIR-AlarmExtern?",
  "802" => "C-PIR-02",
  "D00" => "C-SI",
  "D06" => "C-SI-bereit?",
  "D07" => "C-SI-offen?",
  "D14" => "C-SI-14",   # ..4 intern scharf?
  "D47" => "C-SI-47",
);

my %errors = (
  "00" => "unscharf",
  "40" => "Stoerung",
  "01" => "int. scharf 01",
  "20" => "int. scharf 20", # 0102
  "21" => "C1-04", # 0102 int. scharf
  "61" => "C1-0A", # 0102
  "02" => "TF-02",
  "22" => "SI-22", # 0101, 0106
  "06" => "SI-06", # 0101
  "08" => "SE-08",
  "41" => "TF-41", # 0100
  "30A" => "C3-0A",
  "400" => "C4",
  "500" => "C5",
  "800" => "C-PIR",
  "810" => "C-PIR-10", # Gehtest Ende
  "814" => "C-PIR-14",
  "81A" => "C-PIR-1A",
  "81C" => "C-PIR-AlarmExtern?",
  "802" => "C-PIR-02",
  "D00" => "C-SI",
  "D06" => "C-SI-bereit?",
  "D07" => "C-SI-offen?",
  "D14" => "C-SI-14",   # ..4 intern scharf?
  "D47" => "C-SI-47",
);

my %readonly = (
  "thermo-on" => 1,
  "thermo-off" => 1,
);

use vars qw(%faz_c2b);		# Peter would like to access it from outside

my $faz_simple ="off off-for-timer on on-for-timer reset timer toggle";
my %models = (
    fazfms     => 'sender',
    fazhgs     => 'sender',
    fazirl     => 'sender',
    fazkse     => 'sender',
    fazls      => 'sender',
    fazpira    => 'sender',
    fazpiri    => 'sender',
    fazpiru    => 'sender',
    fazs16     => 'sender',
    fazs20     => 'sender',
    fazs4      => 'sender',
    fazs4a     => 'sender',
    fazs4m     => 'sender',
    fazs4u     => 'sender',
    fazs4ub    => 'sender',
    fazs8      => 'sender',
    fazs8m     => 'sender',
    fazsd      => 'sender',    # Sensor: Daemmerung
    fazsn      => 'sender',    # Sensor: Naeherung
    fazsr      => 'sender',    # Sensor: Regen
    fazss      => 'sender',    # Sensor: Sprache
    fazstr     => 'sender',    # Sensor: Thermostat+Regelung
    faztc1     => 'sender',
    faztc6     => 'sender',    # TouchControl x 6
    faztfk     => 'sender',    # TuerFensterKontakt
    faztk      => 'sender',    # TuerKlingel
    fazuts     => 'sender',    # Universal Thermostat Sender
    fazze      => 'sender',    # FunkTimer (ZeitEinheit?)
    fazbf      => 'sender',    # BodenFeuchte
    fazbs      => 'sender',    # Beschattung
    fazsi3     => 'sender',    # 3 Kanal Schaltinterface
    dummySender => 'sender',

    fazdi      => 'dimmer',
    fazdi10    => 'dimmer',
    fazdu      => 'dimmer',
    dummyDimmer => 'dimmer',

    fazas1     => 'simple',
    fazas4     => 'simple',
    fazms2     => 'simple',
    fazrgbsa   => 'simple',
    fazrst     => 'simple',
    fazrsu     => 'simple',
    fazsa      => 'simple',
    fazsig     => 'simple',
    fazsm4     => 'simple',
    fazsm8     => 'simple',
    fazst      => 'simple',
    fazst2     => 'simple',
    fazsu      => 'simple',
    fazsv      => 'simple',
    fazue1     => 'simple',
    fazusr     => 'simple',
    fazws1     => 'simple',
    dummySimple => 'simple',

);

sub FAZ_hex2four($);
sub FAZ_four2hex($$);

sub
FAZ_Initialize($)
{
  my ($hash) = @_;

  foreach my $k (keys %codes) {
    $faz_c2b{$codes{$k}} = $k;
  }
#  $hash->{Match}     = "^81..(04|0c)..0101a001";
  $hash->{Match}     = "^Z................*";
  $hash->{SetFn}     = "FAZ_Set";
  $hash->{DefFn}     = "FAZ_Define";
  $hash->{UndefFn}   = "FAZ_Undef";
  $hash->{ParseFn}   = "FAZ_Parse";
  $hash->{AttrList}  = "IODev ".
                       "do_not_notify:1,0 ignore:1,0 dummy:1,0 showtime:1,0 ".
                       "$readingFnAttributes " .
                       "model:".join(",", sort keys %models);
}

###################################
sub
FAZ_Set($@)
{
  my ($hash, @a) = @_;
  my $ret = undef;
  my $na = int(@a);

  return "no set value specified" if($na < 2);
  return "Readonly value $a[1]" if(defined($readonly{$a[1]}));

  if($na > 2 && $a[1] eq "dim") {
    $a[1] = ($a[2] eq "0" ? "off" : sprintf("dim%02d%%",$a[2]) );
    splice @a, 2, 1;
    $na = int(@a);
  }

  my $c = $faz_c2b{$a[1]};
  my $name = $a[0];
  if(!defined($c)) {

    # Model specific set arguments
    my $list;
    if(defined($attr{$name}) && defined($attr{$name}{"model"})) {
      my $mt = $models{$attr{$name}{"model"}};
      $list = "" if($mt && $mt eq "sender");
      $list = $faz_simple if($mt && $mt eq "simple");
    }
    $list = (join(" ", sort keys %faz_c2b) . " dim:slider,0,6.25,100")
        if(!defined($list));
    return SetExtensions($hash, $list, @a);

  }

  return "Bad time spec" if($na == 3 && $a[2] !~ m/^\d*\.?\d+$/);

  my $v = join(" ", @a);
  Log3 $name, 3, "FAZ set $v";
  (undef, $v) = split(" ", $v, 2);	# Not interested in the name...

  my $val;

  if($na == 3) {                                # Timed command.
    $c = sprintf("%02X", (hex($c) | 0x20)); # Set the extension bit

    ########################
    # Calculating the time.
    LOOP: for(my $i = 0; $i <= 12; $i++) {
      for(my $j = 0; $j <= 15; $j++) {
        $val = (2**$i)*$j*0.25;
        if($val >= $a[2]) {
          if($val != $a[2]) {
            Log3 $name, 2, "$name: changing timeout to $val from $a[2]";
          }
          $c .= sprintf("%x%x", $i, $j);
          last LOOP;
        }
      }
    }
    return "Specified timeout too large, max is 15360" if(length($c) == 2);
  }

  IOWrite($hash, "04", "010101" . $hash->{XMIT} . $hash->{BTN} . $c);

  ###########################################
  # Set the state of a device to off if on-for-timer is called
  if($modules{FAZ}{ldata}{$name}) {
    CommandDelete(undef, $name . "_timer");
    delete $modules{FAZ}{ldata}{$name};
  }

  my $newState="";
  my $onTime = AttrVal($name, "follow-on-timer", undef);

  ####################################
  # following timers
  if($a[1] eq "on" && $na == 2 && $onTime) {
    $newState = "off";
    $val = $onTime;

  } elsif($a[1] =~ m/(on|off).*-for-timer/ && $na == 3 &&
     AttrVal($name, "follow-on-for-timer", undef)) {
    $newState = ($1 eq "on" ? "off" : "on");

  }

  if($newState) {
    my $to = sprintf("%02d:%02d:%02d", $val/3600, ($val%3600)/60, $val%60);
    $modules{FAZ}{ldata}{$name} = $to;
    Log3 $name, 4, "Follow: +$to setstate $name $newState";
    CommandDefine(undef, $name."_timer at +$to ".
      "{readingsSingleUpdate(\$defs{'$name'},'state','$newState', 1); undef}");
  }

  ##########################
  # Look for all devices with the same code, and set state, timestamp
  my $code = "$hash->{XMIT} $hash->{BTN}";
  my $tn = TimeNow();
  my $defptr = $modules{FAZ}{defptr}{$code};
  foreach my $n (keys %{ $defptr }) {
    readingsSingleUpdate($defptr->{$n}, "state", $v, 1);
  }
  return $ret;
}

#############################
sub
FAZ_Define($$)
{
  my ($hash, $def) = @_;
  my @a = split("[ \t][ \t]*", $def);

  my $u = "wrong syntax: define <name> FAZ housecode " .
                        "addr [fg addr] [lm addr] [gm FF]";

  return $u if(int(@a) < 4);
  return "Define $a[0]: wrong housecode format: specify a 2 digit hex value ".
         "or an 4 digit quad value"
  		if( ($a[2] !~ m/^[a-f0-9]{2}$/i) && ($a[2] !~ m/^[1-4]{4}$/i) );

  return "Define $a[0]: wrong addr format: specify a 4 digit hex value"
  		if( ($a[3] !~ m/^[a-f0-9]{4}$/i) );

  my $housecode = $a[2];
  $housecode = FAZ_four2hex($housecode,2) if (length($housecode) == 4);

  my $addrcode = $a[3];
  $addrcode = FAZ_four2hex($addrcode,4) if (length($addrcode) == 8);

  $hash->{XMIT} = lc($housecode);
  $hash->{BTN}  = lc($addrcode);

  my $code = lc("$housecode $addrcode");
  my $ncode = 1;
  my $name = $a[0];
  $hash->{CODE}{$ncode++} = $code;
  $modules{FAZ}{defptr}{$code}{$name}   = $hash;

  for(my $i = 4; $i < int(@a); $i += 2) {

    return "No address specified for $a[$i]" if($i == int(@a)-1);

    $a[$i] = lc($a[$i]);
    if($a[$i] eq "fg") {
      return "Bad fg address for $name, see the doc"
        if( ($a[$i+1] !~ m/^f[a-f0-9]$/) && ($a[$i+1] !~ m/^44[1-4][1-4]$/));
    } elsif($a[$i] eq "lm") {
      return "Bad lm address for $name, see the doc"
        if( ($a[$i+1] !~ m/^[a-f0-9]f$/) && ($a[$i+1] !~ m/^[1-4][1-4]44$/));
    } elsif($a[$i] eq "gm") {
      return "Bad gm address for $name, must be ff"
        if( ($a[$i+1] ne "ff") && ($a[$i+1] ne "4444"));
    } else {
      return $u;
    }

    my $grpcode = $a[$i+1];
    if (length($grpcode) == 4) {
       $grpcode = FAZ_four2hex($grpcode,2);
    }

    $code = "$housecode $grpcode";
    $hash->{CODE}{$ncode++} = $code;
    $modules{FAZ}{defptr}{$code}{$name}   = $hash;
  }
  AssignIoPort($hash);
}

#############################
sub
FAZ_Undef($$)
{
  my ($hash, $name) = @_;

  foreach my $c (keys %{ $hash->{CODE} } ) {
    $c = $hash->{CODE}{$c};

    # As after a rename the $name my be different from the $defptr{$c}{$n}
    # we look for the hash.
    foreach my $dname (keys %{ $modules{FAZ}{defptr}{$c} }) {
      delete($modules{FAZ}{defptr}{$c}{$dname})
        if($modules{FAZ}{defptr}{$c}{$dname} == $hash);
    }
  }
  return undef;
}

sub
FAZ_Parse($$)
{
  my ($hash, $msg) = @_;

  # Msg format: 
  # FAZ Prog? house addr d1 code btn   btn2 error intern
  # Z   0/8   1-F   0101 0  2   4   B 00   40   5D
  # Z   0     1     1064 0  5   4   B 00   40   2E
  # Z   0     1     0106 0  2   4   B 00   40   5A
  # Z   0     1     0101 0  2   1   0 00        46130000FF
  # Z   0     1     0101 F  2   4   A 00   40   ACF90000FF
  
  my $housecode  = substr($msg, 1, 2);
  my $addrcode = substr($msg, 3, 4);
  my $type = substr($msg, 3, 3);     # 010 TF, 106 Scharfschalteinheit, 020 PIR
  my $btn = substr($msg, 7, 1);
  my $cde = substr($msg, 8, 1);      # korreliert mit addrcode
  my $btn2 = substr($msg, 9, 2);
  #my $data3 = substr($msg, 10, 1);
  my $cde2 = substr($msg, 11, 2);    # bisher immer 00
  my $error = "";
  my $c;  
  if (length($msg) == 25) {
    $error = substr($msg, 13, 2);
    my $c = $errors{$error};
  }
  $cde .= $cde2;
  
  my $v = $codes{$cde};
  $v = "unknown_$cde" if(!defined($v));
  $c = "unknown_$error" if(!defined($c));

  my $def = $modules{FAZ}{defptr}{"$housecode $addrcode"};
  if($def) {
    my @list;
    foreach my $n (keys %{ $def }) {
      my $lh = $def->{$n};
      $n = $lh->{NAME};        # It may be renamed

      return "" if(IsIgnored($n));   # Little strange.

	  readingsBeginUpdate($lh);
	  readingsBulkUpdate($lh, "type", $type);
	  readingsBulkUpdate($lh, "state", $v);
	  readingsBulkUpdate($lh, "button", $btn);
	  readingsBulkUpdate($lh, "button2", $btn2);
	  readingsBulkUpdate($lh, "error", $error) if (length($msg) == 25);
	  readingsBulkUpdate($lh, "raw", $msg);
	  readingsEndUpdate($lh, 1);
      Log3 $n, 4, "FAZ $n $v";

      if($modules{FAZ}{ldata}{$n}) {
        CommandDelete(undef, $n . "_timer");
        delete $modules{FAZ}{ldata}{$n};
      }

      push(@list, $n);
    }
    return @list;

  } else {
    # Special FHZ initialization parameter. In Multi-FHZ-Mode we receive
    # it by the second FHZ
#    return "" if($dev eq "0001" && $btn eq "00" && $cde eq "00");

    Log3 $hash, 3, "FAZ Unknown device $addrcode , housecode $housecode , please define it";
    return "UNDEFINED FAZ_$housecode"."$addrcode FAZ $housecode $addrcode";
  }

}

#############################
sub
FAZ_hex2four($)
{
  my $v = shift;
  my $r = "";
  foreach my $x (split("", $v)) {
    $r .= sprintf("%d%d", (hex($x)/4)+1, (hex($x)%4)+1);
  }
  return $r;
}

#############################
sub
FAZ_four2hex($$)
{
  my ($v,$len) = @_;
  my $r = 0;
  foreach my $x (split("", $v)) {
    $r = $r*4+($x-1);
  }
  return sprintf("%0*x", $len,$r);
}


1;

=pod
=begin html

<a name="FAZ"></a>
<h3>FAZ</h3>
<ul>
  The FAZ protocol is used by a wide range of devices, which are either of
  the sender/sensor category or the receiver/actuator category.  The radio
  (868.35 MHz) messages are either received through an <a href="#FHZ">FHZ</a>
  or an <a href="#CUL">CUL</a> device, so this must be defined first.

  <br><br>

  <a name="FAZdefine"></a>
  <b>Define</b>
  <ul>
    <code>define &lt;name&gt; FAZ &lt;housecode&gt; &lt;button&gt;
    [fg &lt;fgaddr&gt;] [lm &lt;lmaddr&gt;] [gm FF] </code>
    <br><br>

   The values of housecode, button, fg, lm, and gm can be either defined as
   hexadecimal value or as ELV-like "quad-decimal" value with digits 1-4. We
   will reference this ELV-like notation as ELV4 later in this document. You
   may even mix both hexadecimal and ELV4 notations, because FHEM can detect
   the used notation automatically by counting the digits.<br>

   <ul>
   <li><code>&lt;housecode&gt;</code> is a 4 digit hex or 8 digit ELV4 number,
     corresponding to the housecode address.</li>
   <li><code>&lt;button&gt;</code> is a 2 digit hex or 4 digit ELV4 number,
     corresponding to a button of the transmitter.</li>
   <li>The optional <code>&lt;fgaddr&gt;</code> specifies the function group.
     It is a 2 digit hex or 4 digit ELV address. The first digit of the hex
     address must be F or the first 2 digits of the ELV4 address must be
     44.</li>
   <li>The optional <code>&lt;lmaddr&gt;</code> specifies the local
     master. It is a 2 digit hex or 4 digit ELV address.  The last digit of the
     hex address must be F or the last 2 digits of the ELV4 address must be
     44.</li>
   <li>The optional gm specifies the global master, the address must be FF if
     defined as hex value or 4444 if defined as ELV4 value.</li>
   </ul>
   <br>

    Examples:
    <ul>
      <code>define lamp FAZ 7777 00 fg F1 gm F</code><br>
      <code>define roll1 FAZ 7777 01</code><br>
      <code>define otherlamp FAZ 24242424 1111 fg 4412 gm 4444</code><br>
      <code>define otherroll1 FAZ 24242424 1114</code>
    </ul>
  </ul>
  <br>

  <a name="FAZset"></a>
  <b>Set </b>
  <ul>
    <code>set &lt;name&gt; &lt;value&gt; [&lt;time&gt]</code>
    <br><br>
    where <code>value</code> is one of:<br>
    <ul><code>
      dim06% dim12% dim18% dim25% dim31% dim37% dim43% dim50%<br>
      dim56% dim62% dim68% dim75% dim81% dim87% dim93% dim100%<br>
      dimdown<br>
      dimup<br>
      dimupdown<br>
      off<br>
      off-for-timer<br>
      on                # dimmer: set to value before switching it off<br>
      on-for-timer      # see the note<br>
      on-old-for-timer  # set to previous (before switching it on)<br>
      ramp-on-time      # time to reach the desired dim value on dimmers<br>
      ramp-off-time     # time to reach the off state on dimmers<br>
      reset<br>
      sendstate<br>
      timer<br>
      toggle            # between off and previous dim val<br>
    </code></ul>
    The <a href="#setExtensions"> set extensions</a> are also supported.<br>
    <br>
    Examples:
    <ul>
      <code>set lamp on</code><br>
      <code>set lamp1,lamp2,lamp3 on</code><br>
      <code>set lamp1-lamp3 on</code><br>
      <code>set lamp on-for-timer 12</code><br>
    </ul>
    <br>

    Notes:
    <ul>
      <li>Use reset with care: the device forgets even the housecode.
      </li>
      <li>As the FAZ protocol needs about 0.22 seconds to transmit a
      sequence, a pause of 0.22 seconds is inserted after each command.
      </li>
      <li>The FAZST switches on for dim*%, dimup. It does not respond to
          sendstate.</li>
      <li>If the timer is set (i.e. it is not 0) then on, dim*,
          and *-for-timer will take it into account (at least by the FAZST).
      </li>
      <li>The <code>time</code> argument ranges from 0.25sec to 4 hours and 16
          minutes.  As the time is encoded in one byte there are only 112
          distinct values, the resolution gets coarse with larger values. The
          program will report the used timeout if the specified one cannot be
          set exactly.  The resolution is 0.25 sec from 0 to 4 sec, 0.5 sec
          from 4 to 8 sec, 1 sec from 8 to 16 sec and so on. If you need better
          precision for large values, use <a href="#at">at</a> which has a 1
          sec resolution.</li>
    </ul>
  </ul>
  <br>

  <b>Get</b> <ul>N/A</ul><br>

  <a name="FAZattr"></a>
  <b>Attributes</b>
  <ul>
    <a name="IODev"></a>
    <li>IODev<br>
        Set the IO or physical device which should be used for sending signals
        for this "logical" device. An example for the physical device is an FHZ
        or a CUL. Note: Upon startup FHEM assigns each logical device
        (FAZ/HMS/KS300/etc) the last physical device which can receive data
        for this type of device. The attribute IODev needs to be used only if
        you attached more than one physical device capable of receiving signals
        for this logical device.</li><br>

    <a name="eventMap"></a>
    <li>eventMap<br>
        Replace event names and set arguments. The value of this attribute
        consists of a list of space separated values, each value is a colon
        separated pair. The first part specifies the "old" value, the second
        the new/desired value. If the first character is slash(/) or komma(,)
        then split not by space but by this character, enabling to embed spaces.
        Examples:<ul><code>
        attr store eventMap on:open off:closed<br>
        attr store eventMap /on-for-timer 10:open/off:closed/<br>
        set store open
        </code></ul>
        </li><br>

    <a name="attrdummy"></a>
    <li>dummy<br>
    Set the device attribute dummy to define devices which should not
    output any radio signals. Associated notifys will be executed if
    the signal is received. Used e.g. to react to a code from a sender, but
    it will not emit radio signal if triggered in the web frontend.
    </li><br>

    <a name="follow-on-for-timer"></a>
    <li>follow-on-for-timer<br>
    schedule a "setstate off;trigger off" for the time specified as argument to
    the on-for-timer command. Or the same with on, if the command is
    off-for-timer.
    </li><br>

    <a name="follow-on-timer"></a>
    <li>follow-on-timer<br>
    Like with follow-on-for-timer schedule a "setstate off;trigger off", but
    this time for the time specified as argument in seconds to this attribute.
    This is used to follow the pre-programmed timer, which was set previously
    with the timer command or manually by pressing the button on the device,
    see your manual for details.
    </li><br>


    <a name="model"></a>
    <li>model<br>
        The model attribute denotes the model type of the device.
        The attributes will (currently) not be used by the fhem.pl directly.
        It can be used by e.g. external programs or web interfaces to
        distinguish classes of devices and send the appropriate commands
        (e.g. "on" or "off" to a fazst, "dim..%" to fazdu etc.).
        The spelling of the model names are as quoted on the printed
        documentation which comes which each device. This name is used
        without blanks in all lower-case letters. Valid characters should be
        <code>a-z 0-9</code> and <code>-</code> (dash),
        other characters should be ommited. Here is a list of "official"
        devices:<br><br>
          <b>Sender/Sensor</b>: fazfms fazhgs fazirl fazkse fazls
          fazpira fazpiri fazpiru fazs16 fazs20 fazs4  fazs4a fazs4m
          fazs4u fazs4ub fazs8 fazs8m fazsd  fazsn  fazsr fazss
          fazstr faztc1 faztc6 faztfk faztk  fazuts fazze fazbf fazsi3<br><br>

          <b>Dimmer</b>: fazdi  fazdi10 fazdu<br><br>

          <b>Receiver/Actor</b>: fazas1 fazas4 fazms2 fazrgbsa fazrst
          fazrsu fazsa fazsig fazsm4 fazsm8 fazst fazsu fazsv fazue1
          fazusr fazws1
    </li><br>


    <a name="ignore"></a>
    <li>ignore<br>
        Ignore this device, e.g. if it belongs to your neighbour. The device
        won't trigger any FileLogs/notifys, issued commands will silently
        ignored (no RF signal will be sent out, just like for the <a
        href="#attrdummy">dummy</a> attribute). The device won't appear in the
        list command (only if it is explicitely asked for it), nor will it
        appear in commands which use some wildcard/attribute as name specifiers
        (see <a href="#devspec">devspec</a>). You still get them with the
        "ignored=1" special devspec.
        </li><br>

    <li><a href="#do_not_notify">do_not_notify</a></li>
    <li><a href="#showtime">showtime</a></li>
    <li><a href="#readingFnAttributes">readingFnAttributes</a></li>

  </ul>
  <br>

  <a name="FAZevents"></a>
  <b>Generated events:</b>
  <ul>
     From an FAZ device you can receive one of the following events.
     <li>on</li>
     <li>off</li>
     <li>toggle</li>
     <li>dimdown</li>
     <li>dimup</li>
     <li>dimupdown</li>
     <li>on-for-timer</li>
     Which event is sent is device dependent and can sometimes configured on
     the device.
  </ul>
</ul>

=end html

=begin html_DE

<a name="FAZ"></a>
<h3>FAZ</h3>
<ul>
  Das FAZ Protokoll wird von einem gro&szlig;en Spektrum an Ger&auml;ten
  verwendet.  Diese stammen entweder aus der Kategorie Sensor/Sender oder
  Aktor/Empf&auml;nger.  Die Funknachrichten (868.35 MHz) k&ouml;nnen mit einem
  <a href="#FHZ">FHZ</a> oder einem <a href="#CUL">CUL</a> empfangen werden.
  Dieses muss daher zuerst definiert werden.
  <br><br>

  <a name="FAZdefine"></a>
  <b>Define</b>
  <ul>
    <code>define &lt;name&gt; FAZ &lt;housecode&gt; &lt;button&gt;
    [fg &lt;fgaddr&gt;] [lm &lt;lmaddr&gt;] [gm FF] </code>
    <br><br>

   Die Werte housecode, button, fg, lm, und gm k&ouml;nnen entweder hexadezimal
   oder in der ELV-typischen quatern&auml;ren Notation (Zahlen von 1-4)
   eingegeben werden.
   Hier und auch in sp&auml;teren Beispielen wird als Referenz die ELV4
   Notation verwendet. Die Notationen k&ouml;nnen auch gemischt werden da FHEM
   die verwendete Notation durch z&auml;hlen der Zeichen erkennt.<br>

   <ul>
   <li><code>&lt;housecode&gt;</code> ist eine 4 stellige Hex oder 8 stellige
     ELV4 Zahl, entsprechend der Hauscode Adresse.</li>

   <li><code>&lt;button&gt;</code> ist eine 2 stellige Hex oder 4 stellige ELV4
     Zahl, entsprechend dem Button des Transmitters.</li>

   <li>Optional definiert <code>&lt;fgaddr&gt;</code> die Funktionsgruppe mit
     einer 2 stelligen Hex oder 4 stelligen  ELV4 Adresse. Bei Hex muss die
     erste Stelle F, bei ELV4 die ersten zwei Stellen 44 sein.</li>

   <li>Optional definiert <code>&lt;lmaddr&gt;</code> definiert einen local
     master mit einer 2 stelligen Hex oder 4 stelligen  ELV4 Adresse. Bei Hex
     muss die letzte Stelle F, bei ELV4 die letzten zwei Stellen 44 sein.</li>

   <li>Optional definiert  gm den global master. Die Adresse muss FF bei HEX
     und 4444 bei ELV4 Notation sein.</li>

   </ul>
   <br>

    Beispiele:
    <ul>
      <code>define lamp FAZ 7777 00 fg F1 gm F</code><br>
      <code>define roll1 FAZ 7777 01</code><br>
      <code>define otherlamp FAZ 24242424 1111 fg 4412 gm 4444</code><br>
      <code>define otherroll1 FAZ 24242424 1114</code>
    </ul>
  </ul>
  <br>

  <a name="FAZset"></a>
  <b>Set </b>
  <ul>
    <code>set &lt;name&gt; &lt;value&gt; [&lt;time&gt]</code>
    <br><br>
    Wobei <code>value</code> einer der folgenden Werte sein kann:<br>
    <ul><code>
      dim06% dim12% dim18% dim25% dim31% dim37% dim43% dim50%<br>
      dim56% dim62% dim68% dim75% dim81% dim87% dim93% dim100%<br>
      dimdown<br>
      dimup<br>
      dimupdown<br>
      off<br>
      off-for-timer<br>
      on                # dimmer: Setze auf diesen Wert vor dem Ausschalten<br>
      on-for-timer      # Siehe Hinweise<br>
      on-old-for-timer  # Setze zum vorherigen (vor dem Einschalten)<br>
      ramp-on-time      # Zeit bis zum erreichen des gew&uuml;nschten Dim-Wertes<br>
      ramp-off-time     # Zeit bis zum Ausschalten bei Dimmern<br>
      reset<br>
      sendstate<br>
      timer<br>
      toggle            # zwischen aus und dem letztern Dim-Wert<br>
    </code></ul><br>
    Die<a href="#setExtensions"> set extensions</a> sind ebenfalls
    unterst&uuml;tzt.<br>
    <br>
    Beispiele:
    <ul>
      <code>set lamp on</code><br>
      <code>set lamp1,lamp2,lamp3 on</code><br>
      <code>set lamp1-lamp3 on</code><br>
      <code>set lamp on-for-timer 12</code><br>
    </ul>
    <br>

    Hinweise:
    <ul>
      <li>reset nur mit Vorsicht verwenden: Auch der Hauscode wird
        gel&ouml;scht.  </li>

      <li>Da das FAZ Protokoll 0.22Sek f&uuml;r eine Funksequenz ben&ouml;tigt
        wird nach jeder Ausf&uuml;hrung eine Pause von 0.22Sek eingef&uuml;gt.
        </li>

      <li>Das FAZST schaltet f&uuml;r dim*% und dimup ein. Es reagiert nicht
        auf sendstate.</li>

      <li>Wenn ein Timer gesetzt ist (und dieser nicht 0 ist) werden on, dim*,
        und *-for-timer ber&uuml;cksichtigt (zumindest beim FAZST).  </li>

      <li>Das <code>time</code> Argument geht von 0.25Sek bis 4Std und 16Min.
        Da <code>time</code> nur mit einem Byte dargestellt wird ergeben sich
        hieraus nur 112 eindeutige Zeit-Werte die mit ansteigender
        gr&ouml;&szlig;e immer gr&ouml;ber aufgel&ouml;st werden. Das Programm
        zeigt die exakte Restzeit an wenn die gew&auml;hlte Aufl&ouml;sung
        nicht eindeutig war.  Die Aufl&ouml;sung ist is 0.25Sek von 0 bis 4
        Sekunden, 0.5Sek von 4 bis 8Sek, 1Sek von 8 bis 16 Sek und so weiter.
        Wenn eine h&ouml;here Genauigkeit bei gro&szlig;en Werten gebraucht
        wird, dann hilft <a href="#at">at</a> mit einer Aufl&ouml;sung von
        1Sek.</li>
    </ul>
  </ul>
  <br>

  <b>Get</b> <ul>N/A</ul><br>

  <a name="FAZattr"></a>
  <b>Attribute</b>
  <ul>
    <a name="IODev"></a>
    <li>IODev<br>
      Setzt das IO oder das physische Device welches zum Senden der Signale an
      dieses logische Device verwendet werden soll (Beispielsweise FHZ oder
      CUL).  Hinweis: Beim Start weist FHEM jedem logischen Device das letzte
      physische Device zu, das Daten von diesem Typ empfangen kann.  Das
      Attribut IODev muss nur gesetzt werden wenn mehr als ein physisches
      Device f&auml;hig ist Signale von diesem logischen Device zu empfangen.
      </li><br>

    <a name="eventMap"></a>
    <li>eventMap<br>
      Ersetze Event Namen und setze Argumente. Der Wert dieses Attributes
      besteht aus einer Liste von durch Leerzeichen getrennte Werten. Jeder
      Wert ist ein durch Doppelpunkt getrenntes Paar. Der erste Teil stellt den
      "alten" Wert, der zweite Teil den "neuen" Wert dar. Wenn der erste Wert
      ein Slash (/) oder ein Komma (,) ist, dann wird nicht durch Leerzeichen
      sondern durch das vorgestellte Zeichen getrennt.
      Beispiele:
      <ul><code>
        attr store eventMap on:open off:closed<br>
        attr store eventMap /on-for-timer 10:open/off:closed/<br>
        set store open
      </code></ul>
      </li><br>

    <a name="attrdummy"></a>
    <li>dummy<br>
      Setzt das Attribut dummy um Devices zu definieren, die keine Funksignale
      absetzen.  Zugeh&ouml;rige notifys werden ausgef&uuml;hrt wenn das Signal
      empfangen wird.  Wird beispielsweise genutzt um auf Code eines Sender zu
      reagieren, dennoch wird es auch dann kein Signal senden wenn es im Web
      Frontend getriggert wird.
      </li><br>

    <a name="follow-on-for-timer"></a>
    <li>follow-on-for-timer<br>
      Plant ein "setstate off;trigger off" f&uuml;r die angegebene Zeit als
      Argument zum on-for-timer Command. Oder das gleiche mit "on" wenn der
      Befehl "follow-off-for-timer" war.
      </li><br>

    <a name="follow-on-timer"></a>
    <li>follow-on-timer<br>
      Wie follow-on-for-timer plant es ein "setstate off;trigger off", aber
      diesmal als Argument in Sekunden zum Attribut.  Wird verwendet um dem
      vorprogrammierten Timer zu folgen welcher vorher durch den timer-Befehl,
      oder manuell durch Dr&uuml;cken des Buttons gesetzt wurde. Im Handbuch
      finden sich noch mehr Informationen.
      </li><br>


    <a name="model"></a>
    <li>model<br>
      Das "model" Attribut bezeichnet den Modelltyp des Ger&auml;tes.  Dieses
      Attribut wird (derzeit) nicht direkt durch fhem.pl genutzt.  Es kann
      beispielsweise von externen Programmen oder Webinterfaces genutzt werden
      um Ger&auml;teklassen zu unterscheiden und dazu passende Befehle zu senden
      (z.B. "on" oder "off" an ein fazst, "dim..%" an ein fazdu etc.).  Die
      Schreibweise des Modellnamens ist wie die in Anf&uuml;hrungszeichen in
      der Anleitung gedruckte Bezeichnung die jedem Ger&auml;t beiliegt.
      Dieser Name wird ohne Leerzeichen ausschlie&szlig;lich in Kleinbuchstaben
      verwendet.  G&uuml;ltige Zeichen sind <code>a-z 0-9</code> und
      <code>-</code>, andere Zeichen sind zu vermeiden. Hier ist eine Liste der
      "offiziellen" Devices:<br><br>

      <b>Sender/Sensor</b>: fazfms fazhgs fazirl fazkse fazls
      fazpira fazpiri fazpiru fazs16 fazs20 fazs4  fazs4a fazs4m
      fazs4u fazs4ub fazs8 fazs8m fazsd  fazsn  fazsr fazss
      fazstr faztc1 faztc6 faztfk faztk  fazuts fazze fazbf fazsi3<br><br>

      <b>Dimmer</b>: fazdi  fazdi10 fazdu<br><br>

      <b>Empf&auml;nger/Aktor</b>: fazas1 fazas4 fazms2 fazrgbsa fazrst
      fazrsu fazsa fazsig fazsm4 fazsm8 fazst fazsu fazsv fazue1
      fazusr fazws1
      </li><br>


    <a name="ignore"></a>
    <li>ignore<br>
      Ignoriere dieses Ger&auml;t, beispielsweise wenn es dem Nachbar
      geh&ouml;rt.  Das Ger&auml;t wird keine FileLogs/notifys triggern,
      empfangene Befehle werden stillschweigend ignoriert (es wird kein
      Funksignal gesendet, wie auch beim <a href="#attrdummy">dummy</a>
      Attribut). Das Ger&auml;t wird weder in der Device-List angezeigt (es sei
      denn, es wird explizit abgefragt), noch wird es in Befehlen mit
      "Wildcard"-Namenspezifikation (siehe <a href="#devspec">devspec</a>)
      erscheinen.  Es kann mit dem "ignored=1" devspec dennoch erreicht werden.
      </li><br>

    <li><a href="#do_not_notify">do_not_notify</a></li>
    <li><a href="#showtime">showtime</a></li>
    <li><a href="#readingFnAttributes">readingFnAttributes</a></li>

  </ul>
  <br>

  <a name="FAZevents"></a>
  <b>Erzeugte Events:</b>
  <ul>
     Von einem FAZ Ger&auml;t k&ouml;nnen folgende Events empfangen werden:
     <li>on</li>
     <li>off</li>
     <li>toggle</li>
     <li>dimdown</li>
     <li>dimup</li>
     <li>dimupdown</li>
     <li>on-for-timer</li>
     Welches Event gesendet wird ist Ger&auml;teabh&auml;ngig und kann manchmal
     auf dem Device konfiguriert werden.
  </ul>
</ul>

=end html_DE

=cut
