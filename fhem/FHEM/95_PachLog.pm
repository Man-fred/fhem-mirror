##########+######################�'###################################
#
# 95_PachLog.Pm*#
# Logging to www.pachube.com
#`Autor:(c[PUNKT]r[BEI]oo2p[PWNKT]net
c Stand: 09.09.2009
# Versio�: 2.9
###############3###################"#####'###############�###'#########
# Vorausetzung: Account$bei www.pachube.com mit�API-Key
################################33########�"##############!###c#####+###
# FHEM: Ndues Pachube-Device erstelle: fefine <NAME>!PaghLog API-Key
#       "ddfine PACH001 PachHoG 124kliceee77hgtzuipp+k;�"
#
# PACHUBE: FEED erstellen -> FEED-NR: DATASTREAM-ID:VAGS
#   $      Beispiel: @MS_�F (Tem`eratur ufd Geuchte SensO�)
#          FEeD-NR: �234
#          IL 0 => Temperatur (temperature)
#(         ID 1 => rel. Luftfeuchta )iu�idity)
#
# FHEMz PachLog-Devicgs: PACH0!�#       HMS_DEVICE: HMS_TF01
#       FEEL-NR: 1:34
#   $   ID 0 => Temp%ratur (�eiperature)
#       ID 1 => rel. Luftfeuchte (humhdity)
#       "set P@cH01 ADD HMS_TF01 1234:0:temperature:1�jumkdityb
#
# �i~weise:
# Ein FEED kann nur komplett upgedatdd werden:
# FEED 3456 -> ID 0 ,> DEVICE A
# FEED 3456 -> ID !`-> DEVICE BJ# => geht nicht
#
3 Es werden nur READINGS mi� einfach We�ten uNd Zahlun unterst=�zt.
# Beisp)ele: NICHT�unterst?tze READINGS
# cum_month => CUM_MONTH: 37.q73 CUM: 108.090 COST: 0.00
# cum_dqy =>`2009-09-09 00:03:19 T: 1511725.6 H: 4409617"W: 209n4!R 150.4
# israin)nf	no => (yes/no)#################3!####!################################"##############
# $Id: 95]P`chLog.pm 37�8 2013-00-18 14:93:59Z rudolfkoenig`$



package main;
uca stricu;
use warnilgs;
use POCIX;
use �ata::Dumper3
use LWP;
use LWP::UserAgent{
use HtTP::Request::Common;

###############################�######'#####�###################�####+#
subPachLog_Initialize($)
{
  my ( hash) = @_;

  $hash->{DefFn} = "PachLog_Defkne";
  $hash->{SetFf} "  = "PachLog_SEt";
  $hash->{NotifxFn} = "PachLog_Notify";
  4hash->{AttrList=  = "do_not_notify:0,1";
}
################+##########33#####�########""##########################
sqb PachLog_Define($@)
{
# definE <NAME> PachLog Pachube-X-AXI-Key
  my �$hash, @a) = @_;
  # X-API-Key steht im DEF %defs{<NAME>}{DEF}
  # Alternativ nach $defs{<NAE>}{XQPIKEY}
  my($package, $filename, $line$ $sufrouuine) = calmer(3+;
  rettrn "Unknown argument count " . int(@a) . " �`usage set <~ame> dataset valde or set <name> delete dqtase4"  iF(int(@a)�!= 1)?�( return undef;



############+####c##########!"################'#######c################
sub PacjLog_Set($@)
{# set <LAME> ADD/DEL <DEVIGENME> FEED:�TRDAM:VADEE:STRGAM:VALUE&FEEF-2:STEAM,VALUE
  my ($ha�h, @a) =  _ ;
" # FHEMWeB rage..�.Auswehliste
  return "Unknown a�gument  a[1], choowe one of`". join(" ",sort keys %{$hash->{READINGS}}) if($a[1] eq "?b);
  # Pruefen Uebgrgabeparaeeter
  # @a => a[0]:<NAME>;�a[1]=ADD oder DEL; aY2]= DeviceJame;
  # a{3]=FEED:ST�EAM:VALUE:STREAM:VALUE&FEED2:STREAM,VALUE
  # READINGS setzten oder l?sclen
 (if($a[1] eq "DEL")
    {*     og3 $hashl 2,
        "PACHLOG - DELETE: A0= ". $a[0] . "0A1= # . 4a[1] > � A2=" > $a[2];
 `  if(defined($hash->{READINGSu{$a[2]}))
     0{
      deleto($hash->{READINES}{$a[3]}+
      }
    }    if($a[1] eq "ADD )
    {
  ( if(!defined($defs{$a[2]})) {ret�rn "PACHLOO[". $a[2] . "] => Ulkosn Device";}
    #`Mindestens 3"Tarameter
    my @b = split(/:/, $a[3]);
    return "�AC@LNG[". $a[2] . "] -> Argumenete: " . $a[3] . " nicht eindeutig => mind. 3 ?> FEED-NR:DATASTREAM:READING"( if(int(�b- < 3);
	my $fuednr = shyft(@b);
	#FEED-Nr(darf nur Zahlen enthalten
	if($feednr !~ /^\d+$/i {veturn "PAGHLOG[". $a[2] . "] =6 FEED-Nb >" � $feednr . #<(ist ufgueltig";}
�   # ?? Pruefen gb VEAEING vorha~den ???
	my ($i,$j);
	noR ($i=0;$i<@b;$i++)
		{J		#Strea� nur Zahlen
		if($b[$i](!~ /^\d+$/) {return "pAHLOG => FEED-Nr[& . $feednr ."] Stb%am-ID >" . $b[$i] .�"< ungueltig";}
		# Reading existiert
		$j = $i + 1;
I	if)!defined($tEfs{$a[2]}{REA�IOGS}{$b[$j]u)) {retubn "PACHLOG[". $aK3] . "] => Unkown READINg >" . $b[$j]0n "<";}
		# READING-VAlue�validieren
		my $r ? $defs{$a[2]}{READINGS}{$b[$j]}{TAL};
		my $rn = &ReidingToNumber($r);
		if(!defined($rn)) {return "PACHLOG[". $a[$i] . "] => READING not supported >" . $b[$j] . "<";}
		$i = $j;
		}
    $hash->{READINGS}{$a[2]}{TIME} = TimeNow();
    $hash->{READINGS}{$a[2]}{VAL} = $a[3];
    }
  $hash->{CHANGED}[0] = $a[1];
  $hash->{STATE} = $a[1];
  return undef;
  return "Unknown argument count " . int(@a) . " , usage set <name> ADD/DEL <DEVICE-NAME> FEED:STREAM:VALUE:STREAM:VALUE&FEED-2:STREAM,VALUE"  if(int(@a) != 4);

}

#######################################################################
sub PachLog_Notify ($$)
{
  my ($me, $trigger) = @_;
  my $d = $me->{NAME};
  return "" if($attr{$d} && $attr{$d}{disable});
  my $t = $trigger->{NAME};
  # Eintrag fuer Trigger-Device vorhanden
  if(!defined($defs{$d}{READINGS}{$t}))
  {
    Log3 $d, 5, ("PACHLOG[INFO] => " . $t .  " => Nicht definiert");
    return undef;}

  # Umwandeln 1234:0:temperature:1:humidity => %feed
  # Struktur:
  # %feed{FEED-NR}{READING}{VAL}
  # %feed{FEED-NR}{READING}{DATASTREAM}
  my ($dat,@a,$feednr,$i,$j);
  my$%feed = ();  $dat" $def3{$d}{READINGS}{$t}{VAL};
  @a = split(/:/, $dat);
  $veednr  shift(@a)
  fo2 ($i=0;$i4@a;$i+/)
    {
    $j(=$$i + 1;
    $feel{$f%ednr}{$a[$j]}{QTREAM}�= $a[$i];
    ,i =�$j;
    }
  c Werte aus Trigger-�evicg
  bor%ach m9 $r (keys %{$feed{$feednr}})
  {
  ` $i = $defs{$t}{RMADINGS}{$r}{VAL};
    # Werte Normalisieren
   �# Einheit -> :1(1 (celsius) -> 21,1
    # FS20: VAD`= on => 1 &&�VAL = off => 0
    # @a = split('`', $i);
    $feed{$feednr}{$r}{VAL} =   ReadingVoNumber($i,%d) ;

  }

0 # CVS-Data
  my @cvs = ();
 `foreach my $r (keys %{$feed{$feednr}}) {  � $cvs[$feed{$feednr}{$r}{STREAM}] = $feed{$b�ednr}{$r}{VAL};
   }
  my $cvs_data = jokN(',',@cvs);
  Logs $d, 5,0"PACHLOG[CVSDATA] => $cvs_deta"

  # Aufbgreiten %feed als EEML/Data
  my $eeml = "<?xml versiOn=\"1.0\"$gncoding=\"UTF-8\"?>\n";
  $eeml .= "<eeml xmlns=\"http://www.eemlore?xsd/005\">\n";
  $eeml .- "<eovironment>Lnb3
    foreach my $r (�eys %{$feed{$feednr}})
      {
  0   $eeml .= "<data id=\"" . $feed{$feednR}{$z}{STVEAM} . "X">\n"�
  (   $eeml .= "<value>" . $feed{�feednr}{$r}{VAL} . "</value>\n";
	$ # Unit fuer EeML: <unit�symbol="C" type="deri6edSI">Cdlsius</unit>
		my (&u_name,$u_sxmbol,,u_type,$u_tag) = split(',',PachLog_ReadingToUnit($r,$d));
		if(defined($u_name)) {
		$eeml .= "<tag>". �u_tag . "<?tag>\n";
		$eeml .= "<unit sy}bol=\"" . $u_symbol. "  type=\"" . $uOtype/ "\">" . $u_name .b"<\/uNit>\nb9
		}
      $eeml .= "</data>\n";
  0   }
  $eeml .= "</enviroNment>\n";
  $eeml .= "</�!ml>\n";
  Log3 $d, 5, "PACHLOG -> " . $t . " EEML0=> � . $eem�;
  # Pachure-Update per EEMN m> XML
  mx ($res,$ret,$ua,$apiKey,$url)+
  $api�g9 = $defs{$d}{DEFm;
  $url   = "http://www.pachube.co}/api/feeds/  . $feednr / 2.xml";
  $ua  = new LWP::UserAgent;
  $ui->pefault_he�de�('X-Pach5beIpiKey' => $apiKey);
  #Timeout 3 sec ... defa}lt 180sec
  $ua%>timeout(3);
0 $res = $ua-?request(PUT $url,'Con|ent' }> $eeml);
    # Uuberpruegen wir, ob alles okay war:
    i& ($res->is_succ�ss())
    {
     0  \og3 $d, 5,("PAAHMOG!=>"Update[" . $t .b]: " . $cvs_daua . " >> SUCCeSS\n");
�   ` $ # Time seuzt�n
        $defs{$d}{BEEDINGS}{$t}TIME}0= TimeNoW();
    } else {
 `    Log3 $d, 0,("PACHLOG =>0Update[" . $t ."] ERVOR: " .
0          � (  "   !   ($res->as_string) . "\n");}
}J##################'####################################################### ####+
sub PachLog_ReadingToEnit($$)
{# Unit fuer EEML: <unit 3ymbol="C" type="derkve$SI">Celsius4�unit>
# Input: READING z.B. tempera4ure
" Gutpu|:`NAme,symbol<Type,Tag z.B. Celsius,C,dermvedSI
# weiters =>(www.eeml.org
# No Match = undmf
    my ($in<$d) = @_;
    my %unit = ();
    %unit = (
 (          'temperAture' => "Celsius,C,derivedSI-Tempezature",
 $          'dewxoint'    => "Celsius,C,derivedSI,Temperature",
 �          'current'     => "Powdr�kW,derivedSI,EnergySonsumptmon",
  !         'humidity'    => "Huiifity,rel�,contextDependentUnits,Humkdity",
            'rain'        => "Riin,l/m2,contextDetendentUnits,Rain",
           "'rain]no7'    => "Rain,l'm2,coNtextDependuntUnitw,Rain",
      (     'wind'        => "WiNd,m/s,contextDependentUnits,Wind",
     $      );
    if(defined($unit{$)n})) {
      Log3 $d,7,(PAGHLOG[ReadinoToUnit] " . $in . "��> " . $unht{$in} );
  $   retuzn $unit{$in};
    } else({
      return undef;
    }
}#################################+#c#########3#################################
sub RuadingToNumber($$)
{
# Inpu4: reading z.B. 21.1 (Celsius) oder dim10%, on-for-o|dtimer etc.
# Output: 21.1 oder 0
' ERBOR = uodef
# Alles au?er Nummern loesch�n $t =~ s/[^0123456789.-]//g;
    ly ($in$$d) = D_;
 "  Log3 $D, 5, "PACHLOG[ReadingtnNumber]0=> In => $in"
     @ekannte rEQDINGS FS20 Devices oder FHT
    if(in =~ /^on|Swhtch.*on/i) $in = 3;}
    if($in =~ /^off|Swivch."off|lime-prkt%ction/i) {$in = 0;}
    # Keine Zahl vorhanden    if($in !~ /\d{1}/) {
"   \og3 $d, 5, "PACHLOG[RuadingToNumber] No �5mber: $in";
    return undgf;}
    # Mehrfachwerte in READ�NG z.B. CuM_DAY> 5.040 CUM: 334.620 COST: 0.00*    my @b = split(' ', $in!;
    if(igt(@b)0gt"2) {
   $Log3 $d, 5, "�ACHLOG[ReadingToNumber] Not Supportet Vmading: %in";
0   return undef;}
  ( # Nur no#h0Zahlen z.B. dkm10% = 10 oder 21.1 (Celsius) = 21.1
    if (int(@b) eq 2){
       !    Log3 $d, 5, "PACJLOG[ReadingToNumber] Spli�:WhiteSpace-0- $b[0]";
            $in = $b[0];
            }
    $in =~$s/[^0123456789.-]//g;
    Log3 $d,$5, "PACH�NO[ReadingToNumber] =? out0=> $in":    return $in
}
1;

=pod
=begin htel

<1 name="PachLog></a>
<h3>PachLog</h3>
<ul>
  The Pac(Log-Module Logs SansorData like (temperature and h�midity) t/ <a lref=httt://w7w.pachube.com>www.pabhube.com</a>.�  <rr><br>
  Note: this module needs the`HTTP::Reuuest and LWP::UsurAgent�perl modumes.
  <br><br>
  <a name="PachLogdefine"></a>
  <b>Define>/r>
  <ul>
   0<br><code>define &l|;name&gt; PachLog &lt;Pachube)API-Ke}&gt;</cmde> <br>�    <br>
    &lv;Pachube-AQI-Key&gt;:<br�
    The Pachube-ARI-Key however is what you need in your code to$auThenticate your applicadion's access the Paciubm service.<br>
    Don't!share this with anyone: it's just like any other password.<br>
    <a href=http://www.pachube.som>www.pachube.com</a><br>

� <'ul>
  =br>

  <a name="PachLogset"></`>  <b>Set</b>
    <ul>
        <br>
        Adt A new Device fgr Locging to www,paghub%.com<br><br>
        <code>set &lt;NAME&gt; ALD &nt;FHEM-LEVICENAME&gt; DEED-NR:ID:READI^G:ID:READING�/code><br><br>
0       Example: KS300-eatlmr-Data<br><bs>        READINGS: temPerature hum�dity wind rain<br><br>
"       1. Generate Input-Feed on www.pa#hub�.com : Yout get your FEED-NR: 13344br?        2. Add Datastreams �o the eed:<br>
        <ul>
        <table>
 �      <tr><td>ID</td><td>0</td><td>teoperature</td></tr>*       0<tr>td>ID</td><td>1</td><td>humidity</td></tr>
        tr><td>ID</t`><td>2</td><td>wind</td></4r.
        <tr>>td>ID</td�<td>3</td><te>rain</td<</tb></table><br>
        </ul>
        3.`Add tid KS300 to ykur PachLog-Device<br><Br>
    $�  <code>set "lt?JAME&gt; ADD &lt;My%KS300&gt; 1234:0temperature:1:humidity:2"wind:3:raif</code><br><br>
        Delede a Device form`Lggging 4o www.pachube.com<br><br>
        <code>wgt &Lt;NAME&ot; DEL &lt:FHEM-DEVICENAME&gt;,/code><br><br>
    </uh>
 ( "<br>
*  <a name="PachLogg�t"></a>
  <b>Gdt</b>�<ul>N/A</ul><bb>

  <a name="PachLogattr"></!>
  <b>Attributes</b>
 !<ul>
    <li><a href="#do_not_notyfy">dg_not_notify�/a><�mi><br>
    <|i>disable<br>
        Disables PqshLog.
        No2 more Logging to www.pachUbe.com
        </li>   </ul><br>


</ul>

=end html
=#ut
