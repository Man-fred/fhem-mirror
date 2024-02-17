// Wrapper for the jquery knob widget.
FW_widgets['passwordField'] = { createFn:FW_passwordFieldCreate, };

function
FW_passwordFieldCreate(elName, devName, vArr, currVal, set, params, cmd)
{
  if(vArr.length < 1 ||
     (vArr[0] != "passwordField" ) ||
     (params && params.length))
    return undefined;
  console.log(vArr);
  var is_Pin = true;
  var myLength = 30;
  if (vArr.length > 1)
	  myLength = vArr[1];
  var myButton = vArr.includes("button");
  var myAutosubmit  = vArr.includes("auto");
  //default:
  var myBlur  = vArr.includes("onleave") || (!myButton && !myAutosubmit); 

  var newEl = $("<div style='display:inline-block'>").get(0);
  if(set && set != "state" && vArr[0].indexOf("NL") < 0)
    $(newEl).append(set+":");
  if(is_Pin)
    //$(newEl).append('<input type="text" size="30">')
    $(newEl).append('<input type="password" pattern="\d*" maxlength="4" size="30" autocomplete="off">')
  else
    $(newEl).append('<input type="password" size="30"  autocomplete="off">');
  $(newEl).append('<input type="button" value="Ok">');
  
  var inp = $(newEl).find("input").get(0);
  if(elName)
    $(inp).attr('name', elName);
  if(currVal != undefined)
    $(inp).attr("placeholder", currVal);
  
  if(myAutosubmit)
	  $(inp).keyup(function() {if ($(inp).val().length >= myLength) { cmd($(inp).val()); $(inp).val(""); }});
  
  function addBlur() { if(cmd) $(inp).blur(function() { cmd($(inp).val()) }); $(inp).val(""); };
  if (myBlur)
	  addBlur();
  
  if (myButton){
	  var but = $(newEl).find("input").get(1);
	  $(but).click(function() { cmd($(inp).val()); $(inp).val(""); }); 
  }
  
  newEl.setValueFn = function(arg){ $(inp).attr("placeholder",arg) };

  return newEl;
}

/*
=pod

=begin html

  <li>passwordPin - shows a Password textfield. 
      </li>

=end html

=begin html_DE

  <li>passwordPin - zeigt ein Passwort-Eingabefeld</li>

=end html_DE

=cut
*/
