##############################################
# $Id: 98_PasswordCheck.pm 18649 2019-05-31 19:24:47Z mBielemeier $
package main;

use strict;
use warnings;
use SetExtensions;
use Digest::SHA qw(sha256_base64);

sub
PasswordCheck_Initialize($)
{
  my ($hash) = @_;

  $hash->{SetFn}     = "PasswordCheck_Set";
  $hash->{GetFn}     = "PasswordCheck_Get";
  $hash->{DefFn}     = "PasswordCheck_Define";
  $hash->{AttrFn}    = "PasswordCheck_Attr";
  $hash->{AttrList}  = "password_.* length submit:multiple,button,auto,onleave ".
                       "disable disabledForIntervals ";
					   #.$readingFnAttributes;readingList setList
  $hash->{NOTIFYDEV} = "global";
}

###################################
#pin:pinManfred.state { use Digest::SHA qw(sha256_base64);; 
#if (sha256_base64(ReadingsVal("pinManfred","state","ftfzft")) eq ReadingsVal("pinManfred","hashpin","frkzcc")) 
#{return "on"} else {return "off"} },
#hashpin { use Digest::SHA qw(sha256_base64);; sha256_base64(AttrVal("pinManfred","pin","2345"));;},

sub PasswordCheck_Set($@)
{
  my ( $hash, $name, $cmd, @args ) = @_;
  
  return undef if IsDisabled($hash);
  
  return "\"set $name <pin>\" needs at least one argument" unless(defined($cmd));
  
  if($cmd eq "?") {
	return "Unknown ... choose one of state:passwordField,".AttrVal($name, "length", "30").",".AttrVal($name, "submit", "onleave");
  }
  if($cmd eq "state") {
    $cmd = shift @args;
	# $cmd = @args[0];
  }
  if($cmd eq "on" && ReadingsVal($name, "state", "off") eq "on") {
    Log3 $name, 1, "PasswordCheck set $name $cmd";
	return undef;
  } 
  if($cmd ne "off") {
	  if (length($cmd) < 16){
      $cmd = sha256_base64($cmd);
		}
		@_[2] = $cmd;
		@_[3] = "";
		my $key;
		#-             while ( my ($key, $value) = each($pstack{$pstackcount}) ) {
		#+             while ( my ($key, $value) = each(%{$pstack{$pstackcount}}) ) {
	  while (($key) = each(%{$attr{$name}})){
		if ($key =~ 'password_') {
		  if ( $attr{$name}{$key} eq $cmd ) {
			readingsBeginUpdate($hash);
			readingsBulkUpdate($hash,"pass",substr($key,9));
			readingsBulkUpdate($hash,"last",$cmd);
			readingsBulkUpdate($hash,"state","on");
			readingsEndUpdate($hash, 1);
			return undef;
		  }
		}
	  }
  }
  readingsBeginUpdate($hash);
  readingsBulkUpdate($hash,"pass","off");
  readingsBulkUpdate($hash,"last",$cmd);
  readingsBulkUpdate($hash,"state","off");
  readingsEndUpdate($hash, 1);
  return undef;
}

sub PasswordCheck_Get($@)
{
  my ($hash, @a) = @_;

  return $hash->{STATE};
}

sub PasswordCheck_Define($$)
{
  my ($hash, $def) = @_;
  my @a = split("[ \t][ \t]*", $def);

  return "Wrong syntax: use define <name> PasswordCheck" if(int(@a) != 2);
  return undef;
}

sub PasswordCheck_Attr($$$$)
{
	my ( $cmd, $name, $attrName, $attrValue ) = @_;
    
  	# $cmd  - Vorgangsart - kann die Werte "del" (löschen) oder "set" (setzen) annehmen
	# $name - Gerätename
	# $attrName/$attrValue sind Attribut-Name und Attribut-Wert
    
	if ($cmd eq "set") {
		if ($attrName =~ /password_.*/) {
			if (length($attrValue) < 10) {
				$_[3] = sha256_base64($attrValue);
			}
			addToDevAttrList($name, $attrName);
		}
	}
	return undef;
}
1;

=pod
=item helper
=item summary    device to save and test passwords, saved as sha256-hashes
=item summary_DE Ger&auml;t zum Speichern und Testen von Passwörtern, gespeichert als sha256-hashes
=begin html

<a name="PasswordCheck"></a>
<h3>PasswordCheck</h3>
<ul>

  Define a device to check passwords. The device can take passwords via <a href="#attr">attr</a>.
  <br><br>

  <a name="PasswordCheckdefine"></a>
  <b>Define</b>
  <ul>
    <code>define &lt;name&gt; PasswordCheck</code>
    <br><br>

    Example:
    <ul>
      <code>define myPasswords PasswordCheck</code><br>
	  <code>attr myPasswords length 4</code><br>
      <code>attr myPasswords password_Joe 4596</code><br>
    </ul>
  </ul>
  <br>

  <a name="PasswordCheckset"></a>
  <b>Set</b>
  <ul>
    <code>set &lt;name&gt; &lt;value&gt</code><br>
    Set any value.
  </ul>
  <br>

  <a name="PasswordCheckget"></a>
  <b>Get</b> <ul>N/A</ul><br>

  <a name="dummyattr"></a>
  <b>Attributes</b>
  <ul>
    <li><a href="#disable">disable</a></li>
    <li><a href="#disabledForIntervals">disabledForIntervals</a></li>
    <li><a name="readingList">readingList</a><br>
      Space separated list of readings, which will be set, if the first
      argument of the set command matches one of them.</li>

    <li><a name="setList">setList</a><br>
      Space separated list of commands, which will be returned upon "set name
      ?", so the FHEMWEB frontend can construct a dropdown and offer on/off
      switches. Example: attr dummyName setList on off </li>

    <li><a name="useSetExtensions">useSetExtensions</a><br>
      If set, and setList contains on and off, then the
      <a href="#setExtensions">set extensions</a> are supported.
      In this case no arbitrary set commands are accepted, only the setList and
      the set exensions commands.</li>

    <li><a href="#readingFnAttributes">readingFnAttributes</a></li>
  </ul>
  <br>

</ul>

=end html

=begin html_DE

<a name="PasswordCheck"></a>
<h3>PasswordCheck</h3>
<ul>

  Definiert eine Pseudovariable, der mit <a href="#set">set</a> jeder beliebige
  Wert zugewiesen werden kann.  Sinnvoll zum Programmieren.
  <br><br>

  <a name="PasswordCheckdefine"></a>
  <b>Define</b>
  <ul>
    <code>define &lt;name&gt; dummy</code>
    <br><br>

    Beispiel:
    <ul>
      <code>define myvar dummy</code><br>
      <code>set myvar 7</code><br>
    </ul>
  </ul>
  <br>

  <a name="PasswordCheckset"></a>
  <b>Set</b>
  <ul>
    <li><code>set &lt;name&gt; &lt;value&gt</code></li><br>
    Erwartet ein g&uuml;ltiges Passwort und setzt den Status "on" wenn es gültig und "off" wenn es ungültig ist.
  </ul>
  <br>

  <a name="PasswordCheckget"></a>
  <b>Get</b> 
  <ul><code>get &lt;name&gt;</code><br></ul><br>

  <a name="dummyattr"></a>
  <b>Attributes</b>
  <ul>
    <li><a href="#disable">disable</a></li>
    <li><a href="#disabledForIntervals">disabledForIntervals</a></li>
    <li>length<br>
      Länge des Passworts vorgeben.</li>

    <li>submit<br>
      Liste mit Kommagetrenten Werten, durch die die Eingabemöglichkeiten definiert werden.<br> 
	  Beispiel: attr Passwort submit button,auto </li>

    <li>password_*<br>
      Falls gesetzt, und setList enth&auml;lt on und off, dann die <a
      href="#setExtensions">set extensions</a> Befehle sind auch aktiv.  In
      diesem Fall werden nur die Befehle aus setList und die set exensions
      akzeptiert.</li>

    <li><a href="#readingFnAttributes">readingFnAttributes</a></li>
  </ul>
  <br>

</ul>

=end html_DE

=cut
