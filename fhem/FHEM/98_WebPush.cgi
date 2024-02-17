# $Id: 98_WebPush.pm 10939 2016-02-25 22:30:46Z mattwire $
##############################################
#
#     98_WebPush.pm
#     FHEM module to check remote network device using ping.
#
#     Author: Matthew Wire (mattwire)
#
#     cpan install HTTP::Request::Webpush
#
#     Fhem is free software: you can redistribute it and/or modify
#     it under the terms of the GNU General Public License as published by
#     the Free Software Foundation, either version 2 of the License, or
#     (at your option) any later version.
#
#     Fhem is distributed in the hope that it will be useful,
#     but WITHOUT ANY WARRANTY; without even the implied warranty of
#     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#     GNU General Public License for more details.
#
#     You should have received a copy of the GNU General Public License
#     along with fhem.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################

package FHEM::WebPush;
use strict;
use warnings;
use FHEM::Meta;
use GPUtils qw(GP_Export GP_Import);
use vars qw(%attr %data %defs);

use CGI;
use Config::IniFiles;
use JSON;
use HTTP::Request::Webpush;
use LWP::UserAgent;
use MIME::Base64 qw( encode_base64url decode_base64url);
use constant APP_CONF => '/opt/push.conf';

use experimental qw /switch/;        #(CoolTux) - als Ersatz für endlos lange elsif Abfragen

#-- Run before package compilation
BEGIN {
	# fhem
	GP_Import(qw(
		readingFnAttributes
		readingsSingleUpdate
		IsDisabled
		Log3
		AttrVal
	));

    #-- Export to main context with different name
    GP_Export(qw(
        Initialize
    ));
}

sub Initialize {
    my ($hash) = @_;
my $Module_Version = '0.0.9';
my $language = 'EN';
    
    $hash->{DefFn}      = \&Define;
    $hash->{UndefFn}    = \&Undefine;
	#
    #$hash->{Delete}     = \&WebPush::Delete;
    $hash->{SetFn}      = \&Set;
    #$hash->{GetFn}      = \&Get;
    $hash->{AttrFn}     = \&Attr;
    #$hash->{ReadFn}     = \&WebPush::Read;
    #$hash->{RenameFn}   = \&WebPush::Rename;
    #$hash->{NotifyFn}   = \&WebPush::Notify;

    $hash->{AttrList}   = Attr_List();
    return FHEM::Meta::InitMod( __FILE__, $hash );
}

#####################################
#my $subscription='{"endpoint":"https://foo/fooer","expirationTime":null,"keys":{"p256dh":"BCNS...","auth":"dZ..."}}';
 
sub Attr_List{
    return "VAPID_private VAPID_public Subject Keys $readingFnAttributes";
}


#####################################
# Define push device
sub Define($$)
{
  my ($hash, $def) = @_;
  my @args = split("[ \t][ \t]*", $def);

  return "Usage: define <name> ping <host/ip> <mode> <timeout>"  if(@args < 5);

  my ($name, $type, $host, $mode, $timeout) = @args;

  # Parameters
  $hash->{HOST} = $host;
  $hash->{MODE} = lc($mode);
  $hash->{TIMEOUT} = $timeout;
  $hash->{FAILCOUNT} = 0;

  readingsSingleUpdate($hash, "state", "Initialized", 1);

  return "ERROR: mode must be one of tcp,udp,icmp" if ($hash->{MODE} !~ "tcp|udp|icmp");
  return "ERROR: timeout must be 0 or higher." if (($hash->{TIMEOUT} !~ /^\d*$/) || ($hash->{TIMEOUT} < 0));

  $attr{$name}{"checkInterval"} = 10 if (!defined($attr{$name}{"checkInterval"}));
  $attr{$name}{"event-on-change-reading"} = "state" if (!defined($attr{$name}{"event-on-change-reading"}));

  return undef;
}

#####################################
# Undefine ping device
sub Undefine($$)
{
	my ($hash,$arg) = @_;
    my $name = $hash->{NAME};
    # undef $data
	$data{WEBPUSH}{"$name"} = undef;
	return undef;
}

sub Set {
    my ( $hash, $name, $cmd, @args ) = @_;
    my $value = join(" ", @args);

    given ($cmd) {
        when ('msg') {
            return PushMessage($hash, $name, $value);
        }

        default {        
            return "Unknown argument $cmd, choose one of msg";
        }
    }
    
    return;
}


#####################################
# Manage attribute changes
sub Attr($$$$) {
  my ($command,$name,$attribute,$value) = @_;
  my $hash = $defs{$name};

  Log3 ($hash, 5, "$name Attr: Attr $attribute; Value $value");

  if ($command eq "set") {

    if ($attribute eq "checkInterval")
    {
      if (($value !~ /^\d*$/) || ($value < 5))
      {
        $attr{$name}{"checkInterval"} = 10;
        return "checkInterval is required in s (default: 10, min: 5)";
      }
    }
    # Handle "disable" attribute by opening/closing connection to device
    elsif ($attribute eq "disable")
    {
      # Disable on 1, enable on anything else.
      if ($value eq "1")
      {
        readingsSingleUpdate($hash, "state", "disabled", 1);
      }
      else
      {
        readingsSingleUpdate($hash, "state", "Initialized", 1);
      }
    }
  }

  return undef;
}

#####################################
# Push message to subscriber
# https://metacpan.org/release/ESTRELOW/HTTP-Request-Webpush-0.15/source/examples/send.pl

sub PushMessage($$$)
{
    my ($hash,$name,$value) = @_;
	my $keys = AttrVal($name,'Keys','');
	my $server_pub = AttrVal($name,'VAPID_public','');
	my $server_pri = AttrVal($name,'VAPID_private','');
	my $subject = AttrVal($name,'Subject','');
	Log3 ($hash, 1, "$name, $keys, $server_pub, $server_pri, $subject, $value");

	#postpush
	my $send=HTTP::Request::Webpush->new(subscription => $keys);
	$send->authbase64($server_pub, $server_pri);
	$send->subject($subject);
	$send->content($value);
	$send->encode();
	#Additional headers can be applied with inherited HTTP::Response methods
	$send->header('TTL' => '90');

	#To send a single push message
	my $ua = LWP::UserAgent->new;
	my $response = $ua->request($send);

	readingsSingleUpdate($hash, "response_code", $response->code(),1);
	readingsSingleUpdate($hash, "response_content", $response->decoded_content,1);
	readingsSingleUpdate($hash, "response_location", $response->header('Location'),1);
	readingsSingleUpdate($hash, "response_link", $response->header('Link'),1);	
	
	return;
	##To send a batch of messages using the same application's end encryption key
	##my $ecc = Crypt::PK::ECC->new();
	##$ecc->generate_key('prime256v1');
	## 
	##for (@cleverly_stored_subscriptions) {
	##   my $message=HTTP::Request::Webpush->new(reuseecc => $ecc);
	##   $message->subscription($_);
	##   $message->subject('mailto:bobsbeverage@some.com');
	##   $message->content('Come taste our new pale ale brand');
	##   $message->encode();
	##   my $response = $ua->request($message);
	##}
}


sub subscription($){
   my $session=shift();
	
	my $conf=Config::IniFiles->new(-file => APP_CONF, -nocase => 1);
	die "Configuration fail" unless($conf);
	my $json=$conf->val($session,'data');
	#die "data $json";
	my $keys=from_json($json);
    return $keys;
}

sub postpush {
	my $session=shift();
	my $text=shift();
	my $keys=shift()       // subscription($session);
	my $server_pub=shift() // 'BGIyy69FMNFdhmCpyKY7R5SgWurpRt_lNEQ7pHsPkLnqD13T9t84O3_7xpFfnZKkgtp7W_bp3iMg1XCg7cPvH4g';
	my $server_pri=shift() // '8xjrPuPN3VGdCCEwZdLlawDkT11M4uNhKpb3lQCESuU';
	my $subject=shift()    // 'mailto:info@bielemeier.de';

	my $req=new CGI;
	my $send=HTTP::Request::Webpush->new(subscription => $keys);
	$send->authbase64($server_pub, $server_pri);
	$send->content($text);
	$send->subject($subject);
	$send->encode();
	$send->header('TTL' => '90');

	my $ua = LWP::UserAgent->new;
	my $response = $ua->request($send);
	print $req->header("text/plain");

	print "Message sent\n";
	print $response->code();
	print "\n";
	print $response->decoded_content;
	print "\n";
	print $response->header('Location');
	print "\n";
	print $response->header('Link');

}

#my $req=new CGI;

#my $cmd=$req->param('cmd') || $req->url_param('cmd');

#if ($cmd eq 'service-worker.js') {
   #print $req->header(-type       => 'application/javascript', -Content_length => length($worker));
   #print $worker;
#} elsif ($cmd eq 'subscribe') {
#   subscribe($req->param('POSTDATA'));
#}  elsif ($cmd eq 'send') {
#   my $text= $req->param('text') || 'Hello world';
#   postpush('subscription',$text);
#}   else {
#   print $req->header('text/html');
#   #renderpush;
#}

#1;

=pod
=encoding utf8
=begin html

<a name="WebPush"></a>
<h3>WebPush</h3>
<ul>
  <p>This module provides a simple "ping" function for testing the state of a remote network device.</p>
  <p>It allows for alerts to be triggered when devices cannot be reached using a notify function.</p>

  <a name="ping_define"></a>
  <p><b>Define</b></p>
  <ul>
    <p><code>define &lt;name&gt; ping &lt;host/ip&gt; &lt;mode&gt; &lt;timeout&gt;</code></p>
    <p>Specifies the ping device.<br/>
       &lt;host/ip&gt; is the hostname or IP address of the Bridge.</p>
    <p>Specifies ping mode.<br/>
       &lt;mode&gt; One of: tcp|udp|icmp.  Read the perl docs for more detail: http://perldoc.perl.org/Net/Ping.html</p>
    <p>Timeout.<br/>
       &lt;timeout&gt; is the maximum time to wait for each ping.</p>
  </ul>
  <a name="ping_readings"></a>
  <p><b>Readings</b></p>
  <ul>
    <li>
      <b>state</b><br/>
        [Initialized|ok|unreachable]: Shows reachable status check every 10 (checkInterval) seconds.
    </li>
  </ul>
  <a name="ping_attr"></a>
  <p><b>Attributes</b></p>
  <ul>
    <li>
      <b>checkInterval</b><br/>
         Default: 10s. Time after the bridge connection is re-checked.
    </li>
    <li>
      <b>minFailCount</b><br/>
         Default: 1. Number of failures before reporting "unreachable".
    </li>
  </ul>
</ul>

=end html
=for :application/json;q=META.json 98_WebPush.pm
{
	"version": "v0.0.1",
	"x_support_status": "unsupported"
}
=end :application/json;q=META.json
=cut
