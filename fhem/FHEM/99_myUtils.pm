package main;
 use strict;
 use warnings;
 use POSIX;
 
 sub myUtils_Initialize($$)
 {
   my ($hash) = @_;
 }
 
 sub myUtils_UF($$$)
 {
   my ($self, $device, $event) = @_;
	 my %UF_cmds = (
		r1 => "set IR irSend 00555", 
		r2 => "set IR irSend 00442", 
		r3 => "set IR irSend 00443", 
		r4 => "set IR irSend 00444", 
		r5 => "set IR irSend 00445", 
		rPOWEROFF => "set IR irSend 02000004C700",
		rUP => "set IR irSend 020000101000",
		rDOWN => "set IR irSend 020001101100",
		rMUTE => "set IR irSend 020000100D00",

		tPOWEROFF => "set IR irSend 0320DF10EF00",
		B001 => "",
	); 
	fhem($UF_cmds{$event} || "attr $self comment $device:$event ist ungekannt");
 }
 
1;
