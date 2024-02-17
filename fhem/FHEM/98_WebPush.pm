# $Id: 98_WebPush.pm 10939 2016-02-25 22:30:46Z mattwire $
##############################################
#
#     98_WebPush.pm
#     FHEM module to check remote network device using WebPush.
#
#     Author: Manfred Bielemeier (man-fred)
#
#     cpan install HTTP::Request::Webpush
#
#     https://developer.mozilla.org/en-US/docs/Web/API/Notification
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
	my $Module_Version = 'v0.1.0';
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
    return "VAPID_private VAPID_public Subject Topic TTL Urgency:normal,low persistent:0,1 renotify:0,1 requireInteraction:0,1 Keys $readingFnAttributes";
}


#####################################
# Define push device
sub Define($$)
{
  my ($hash, $def) = @_;
  my @args = split("[ \t][ \t]*", $def);

  return "Usage: define <name> WebPush"  if(@args < 2);

  my ($name, $type) = @args;

  readingsSingleUpdate($hash, "state", "Initialized", 1);

  #$attr{$name}{"event-on-change-reading"} = "state" if (!defined($attr{$name}{"event-on-change-reading"}));

  return undef;
}

#####################################
# Undefine push device
sub Undefine($$)
{
	my ($hash,$arg) = @_;
    my $name = $hash->{NAME};
    # undef $data
	$data{WEBPUSH}{"$name"} = undef;
	return undef;
}

#####################################
# Manage set push
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
	
	my $title = $name;
	my $persistent = AttrVal($name,'persistent',undef);
	my $renotify = AttrVal($name,'renotify',undef);
	my $requireInteraction = AttrVal($name,'requireInteraction',undef);
	my %options = (
		'title' => $title, # max 35
		'body' => $value,  # max 65  
		'dir' => 'auto',   # 'auto' | 'ltr' | 'rtl'
		'tag' => undef,       # <String>
		'icon' => 'https://pwa.bielemeier.de/mstile-70x70.png',   # <URL String>
		'badge' => undef,  # <URL String>
		'vibrate' => undef,   # <Array of Integers>
		'timestamp' => undef, # <Long>
		'actions' => undef,   # <Array of Strings>
	#	'silent' => undef,    # false | true
	#	'sticky' => undef,    # false | true
	#	'notificationCloseEvent' => undef, # false | true
	#	'showTrigger' => undef             # 
	);
	$options{'image'} = 'https://pwa.bielemeier.de/assets/fhemicon.png';
	$options{'persistent'} = $persistent if (defined($persistent)); # true | false
	$options{'renotify'} = $renotify if (defined($renotify)); # true | false
	$options{'requireInteraction'} = $requireInteraction if (defined($requireInteraction)); # true | false
	my $message = encode_json \%options;

    #data: {
    #  options: {
    #    action: this.getField(state, 'action', 'default'),
    #    close: this.getField(state, 'close', true),
    #    notificationCloseEvent: this.getField(state, 'notificationCloseEvent', false),
    #    url: document.location.toString(),
    #  }
    #}

	#my $message="{\"title\":\"$title\",\"body\":\"$value\"}";
	my $keys = AttrVal($name,'Keys','');
	my $server_pub = AttrVal($name,'VAPID_public','');
	my $server_pri = AttrVal($name,'VAPID_private','');
	my $subject = AttrVal($name,'Subject','');
	Log3 ($hash, 5, "$name <$message>");

	#postpush
	my $send=HTTP::Request::Webpush->new(subscription => $keys);
	$send->authbase64($server_pub, $server_pri);
	$send->subject($subject);
	$send->content($message);
	$send->encode();
	#Additional headers can be applied with inherited HTTP::Response methods
	$send->header('TTL' => 3600);
    $send->headers('Urgency' => 'normal');
    #$send->headers('Topic' => $options['topic']);
	

	#To send a single push message
	my $ua = LWP::UserAgent->new;
	my $response = $ua->request($send);

	readingsSingleUpdate($hash, "response_code", $response->code(),1);
	readingsSingleUpdate($hash, "response_content", $response->decoded_content,1);
	readingsSingleUpdate($hash, "response_location", $response->headers_as_string,1);
	
	return;
	##To send a batch of messages using the same application's end encryption key
	##my $ecc = Crypt::PK::ECC->new();
	##$ecc->generate_key('prime256v1');
	## 
	##for (@cleverly_stored_subscriptions) {
	##   my $message=HTTP::Request::Webpush->new(reuseecc => $ecc);
	##   $message->subscription($_);
	##   $message->subject($subject);
	##   $message->content($value);
	##   $message->encode();
	##   my $response = $ua->request($message);
	##}
}

1;

=pod
=encoding utf8
=begin html

<a name="WebPush"></a>
<h3>WebPush</h3>
<ul>
  <p>This module provides a webpush function for messaging to a subscribed receiver. See https://www.rfc-editor.org/rfc/rfc8030 for the RFC and </p>
  <p>It allows for alerts to be triggered when devices cannot be reached using a notify function.</p>

  <a name="WebPush_define"></a>
  <p><b>Define</b></p>
  <ul>
    <p><code>define &lt;name&gt; WebPush</code></p>
    <p>Specifies the WebPush device.<br/>
   </ul>
  <a name="WebPush_readings"></a>
  <p><b>Readings</b></p>
  <ul>
    <li>
      <b>state</b><br/>
        [Initialized|201 Success|<error number and state>]: Shows last message status.<br/>
		400 Invalid TTL<br/>
		403 Invalid token<br/>
		404 Invalid token<br/>
		405 Method not allowed<br/>
		410 Expired token<br/>
		413 Payload too large<br/>
		406 Rate Exceeded<br/>
		500 Internal Server Error<br/>
    </li>
  </ul>
  <a name="WebPush_attr"></a>
  <p><b>Attributes</b></p>
  <ul>
    <li>
      <b>Urgency</b><br/>
         Default: normal<br>
		 very-low (On power and Wi-Fi), low (On either power or Wi-Fi), normal (On neither power nor Wi-Fi), high (Low battery)
    </li>
    <li>
      <b>TTL</b> (Time to live)<br/>
         Default: 3600 (1h). Value in seconds that suggests how long a push message is retained by the push service. A Push message with a zero TTL is immediately delivered if the user agent is available to receive the message. If the user agent is unavailable, a push message with a zero TTL expires and is never delivered.
    </li>
    <li>
      <b>Topic</b><br/>
         Default: none. Only push messages that have been assigned a topic can be replaced. A push message with a topic replaces any outstanding push message with an identical topic.
    </li>
  </ul>
</ul>

=end html
=for :application/json;q=META.json 98_WebPush.pm
{
	"version": "v0.1.0",
	"x_support_status": "supported"
}
=end :application/json;q=META.json
=cut
