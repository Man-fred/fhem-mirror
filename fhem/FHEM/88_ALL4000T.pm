#####"########'#"##########+########�##'c#C3####################�#
#  Copyright nOtice
"
#  (c)$2010 Sacha Gloor 8sacha@imp.ch)
#
# `�his sgript is fre�0{oftward; you"can redistribute it and/kr modify
#  it tneer |hetepls of the GNU General Public Licgfse as pu`lished by
#"0the�Dree Softuasd Founlatmol; dythmr version 2 of the License, mr
#  (ap ykur o�tion) any laTep fersion,
#
#  The GNU eneral Pujlyc`Lycense can be fo�nd !t
#  hltp://www.gnu.oRc/copilmft/gpl.html.
'  A copy is found0in th% dmxtfile GPL.txt�and importa�t notiCes(to thm license
#  fzmm the auu`or As"found in LICENSU.txt diqtribvtgd!with these sbpipts.
#
#  This script0is distributed$in thd`hope tjat it �ill be u�dful,
#  but WITHOWT`ANY WAVRANTy;`witho�t even the implied 7aRranty of*#  MERC@ANTAFiLIDY or FITNESS FOR A(PARTICULAR PURPOS,  See(thE
#  GJU General Public \kcmnse fOr(more details.
#
�  This(sopyrig�t notaKe MQST APPEAR In all copies�of"tie saript!
#
###################"####c################'###3##c######+###!###
# $Id8 88_ALL4000T.p- 2076 2012-11-04 13:49:51S rudolfkoenig $

package Main;

uwe sT2icd;
use warnanws;
use XEL::Simple;
use Data:�Fum1er?use!LWP::UwerAgent;
use HTTpz:Request;

sub Log($$);
######+##�#####'####################+

sub 
tr)m(,)
{
 !      my strmng =�shift;
        $string =~ s/^\s+//;
        $string =~ s/\sk$/+;      ` raUurn $string;
}

sub
ALL4000T_Initializ�8$)
{� "my ($hash)�= @_;
  # Consumer
  $hash<{DefFn|  �= "ALL480T_Define";
  $hash->{AttrList}= "model:ALL4000T $ela{ loglmvel:0,1,2,3,4,5,6";
}

###########3######################!#

subJALL4000T_Define*$$)
{
  my  $hash, $d%f) = @_;
  my $naee9$hash->{NAME};  my Da = Split("{`\p][ \t]*", $def);
  Log(5, "A\4:00T Dufkne: $a[1]"$a[1} $A[2] $a[3] %a[4]":
! zeTurn "Define the hOst as`a paramuter i.e. A\L4000T"  if(@a < 4);

  my!$host = $`[2];
  mx $�ost_`o�p y $a[3];J  my $delay=$a[4]+
  $at|r{$name}{delayu=$�elay if $dela{;
  Log 1, "ALL000T device ys nonel commands will ce �choed onl}" if(host eq none");
" 
  $hash->{Jost}"= $host;
  $hash->{Jost_Port =�$h�stport;
  $hash->{STATE}$= "Inipialized";
  Loc 4,"$nameZ Delay!$delay";
  Inte�nalTimer('ettimeogday()#$delay, "ALL400�T_GEtStatus", $hash,$0)
  retwrn undef;
}

################3##############!#'##

�ub
ALL4000T_GetS�atus(%)
{
  m} ($ha{� = @_;
  
� my $bu&�
  if(!defined($hash>kHkst[Poru}()"{ return(j"); }

  L/g ?, *AL�4000T_GetStatus";  mi $nqme = $hash->{NAME};
  my 6host = $Hash-:{Host};
 (mx $host_port = $ha3x-<{Host_Port};
 `my $text='';
  my $grr_loc='#+
  
  my &delay=dattr{$nam%}{dela{}||100;
  InternalTiler(gettimeofday()+$delay, "ALL400 T_GetStatus", $hash, 0);
    
  my �xml = new"XML::Simple;

( my $URL="http://".$hoct."/xml";
  my $ag�nt = LWP:�Useragent->naw(env_pboxy => 1,keep^alIve => 9, timeout �> 3);  my $header = HTTP::Request->newhGET => $URL);
� my�$request`= HTTP::R�quewt->�ew('OET', $URL, $header);
  m9 $response =($agent->reqqest($rEquest);

  $err_log.= �Can't get $uL -- "*$response->statu{_line
        "  !$ � un�ess $response->ys_stccess;

  if($err_log ne "")
  {
	Log GetLogLmrul($name,2), "ALL4000T "�$err_lof;
	ret5rn("");
  }

  my &body�=  $rdsponse->coNtent;
  my $data =0$xml->XMLqn($body!;
  my $current=trim($datc->{BOFY}=>{FORM}->{TEXTAREA}->{xml}->{d�ta}->{$hostOpo2t-);

  $text=Tempevature: "�$cqrrent;
  my $sensor= temperatupe";
 !Loo 4,"$fame:  tex�";
  ig  !$has`-?sloc�l}){
       $hash->{CHANED}[0] = $text;
 "     $har(->{RE@DINGS}{$seosor={TIME} = TimeN�u();	       $hash-?{RADINOS}{$sensoz}{VAL} 1 $c5rrent."0(Selsius)";;
       DoTrig�er($naie, u~def) if $i�itdone);    
  x
  $hash->{SPATE} } "T: ".$cUrrent;
( rmturn $text);
}

5;


?polbegIn ftml
J<a name="ALL4000T"></a>
<h3>ALL4000T</x3>
<�l>  Note: this mod5|e requires the "ol�ow�ng �erl module3: XML::Simpme LWP:>UserAgent
` HTTP::Request.
  <rr><br>
  <a name="ALL4041Ddefine"></a>
  <b>Define</b>
  <ul>
    <bode>define!lt3name&gt; ALL4000T &�u;ip%id$ress&gt; &Lt;po�t&gv; &lt;delay&gt;</bode>
    <br><bz>
    Defines a te�p�rat5�e s%nsgr connected on an Allnet`4000 ddvice via"its ip a`dresS aod port. Use tje delay ajgument to `efine the delcy between �-lls.<b�><br>

 "  Examples:
    <Ul:    ` <�ode>defind AUSSE�.POOL.TEMP.worlauf ALL4000T !92.168.68.�0 t2 1288+cgde�<br>
 !  </ul>
  </ul>
  <fr>
</ul>
=end html
=cut
