// global flex object
var flex;
initFlex();

var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

// check if viewport metatag is set, otherwise create it
var metaViewport = document.querySelector("meta[name=viewport]");
if (metaViewport == null) {
	metaViewport=document.createElement('meta');
	metaViewport.name = "viewport";
	document.getElementsByTagName('head')[0].appendChild(metaViewport);
}
// check if viewport metatag has correct content
if (metaViewport.getAttribute("content") !== "width=device-width, initial-scale=1.0")
	metaViewport.content = "width=device-width, initial-scale=1.0";
if (isSafari) // avoid auto zoom in Safari
	metaViewport.content = "width=device-width, initial-scale=1.0, maximum-scale=1";

if(window.jQuery) {
	$(document).ready(function() {
		var loadingContent = $('<div>').append(flex.content.icons.fhem_logo).append($('<div>').html('LOADING'));
		$('<div>',{id: 'loadingOverlay'}).append(loadingContent).appendTo('body');
		flex.content.initSVGCallback();
	});
	$(window).load(flex.helper.getFingerprint);
} else {
  // FLOORPLAN compatibility
  loadScript("pgm2/jquery.min.js", function() {
    loadScript("pgm2/jquery-ui.min.js", function() {
			flex.content.initSVGCallback();
			flex.helper.getFingerprint();
    }, true);
  }, true);
}

function initFlex () {
	if (flex) return;
	flex = {};
		
	flex.colorPreset = {
		default: {
			bright: {
				HeaderBG:           '#2E5E87',
				HeaderIcon:         '#FFF',
				HeaderText:         '#FFF',
				HeaderBorder:       '#2E5E87',
				MenuBG:             '#000',
				MenuBorder:         '#2E5E87',
				MenuIcon:           '#FFF',
				MenuIconBG:			'#2E5E87',
				MenuRoomIcon:       '#FFF',
				MenuText:           '#FFF',
				MenuHoverLink:      '#2E5E87',
				MainBG:             '#EEE',
				TableHeaderBG:      '#2E5E87',
				TableHeaderText:    '#FFF',
				TableBorder:        '#2E5E87',
				TableOdd:           '#EEE',
				TableEven:          '#DDD',
				TableText:          '#000',
				TableLink:          '#000',
				TableLinkFirstCol:  '#000',
				TableHoverRow:      '#AAA',
				TableHoverLink:     '#2E5E87',
				TableNewEvent:      '#F00',
				TableIcon:          '#2E5E87',
				TableShadow:        '#000',
				SetGetAttrBG:       '#CCC',
				SubmitButtonBG:     '#2E5E87',
				SubmitButtonBorder: '#2E5E87',
				SubmitButtonText:   '#FFF',
				WidgetBorder:       '#2E5E87',
				WidgetText:         '#000',
				WidgetHighlight:    '#2E5E87',
				LogDate:            '#000',
				LogTime:            '#000',
				LogVerbose0:        '#000',
				LogVerbose1:        '#F00',
				LogVerbose2:        '#FFA500',
				LogVerbose3:        '#008000',
				LogVerbose4:        '#1E90FF',
				LogVerbose5:        '#00F',
				plotBG:             '#EEE',
				plotBGgradient:     '#EEE',
				plotBorder:         '#2E5E87',
				plotText:           '#000',
				plotGrid:           '#555',
				plotMarker:         '#F00',
				plotLine0:          '#F00',
				plotLine1:          '#0F0',
				plotLine2:          '#00F',
				plotLine3:          '#F0F',
				plotLine4:          '#A52A2A',
				plotLine5:          '#000',
				plotLine6:          '#808000',
				plotLine7:          '#808080',
				plotLine8:          '#FF0',
				plotLinePasted:     '#000' },
			dark: {
				HeaderBG:			"#1D3B54",
				HeaderIcon:			"#FFF",
				HeaderText:			"#FFF",
				HeaderBorder:		"#1D3B54",
				MenuBG:				"#000",
				MenuBorder:			"#1D3B54",
				MenuIcon:			"#FFF",
				MenuIconBG:			"#1D3B54",
				MenuRoomIcon:		"#FFF",
				MenuText:			"#FFF",
				MenuHoverLink:		"#3771A1",
				MainBG:				"#000",
				TableHeaderBG:		"#1D3B54",
				TableHeaderText:	"#FFF",
				TableBorder:		"#1D3B54",
				TableOdd:			"#000",
				TableEven:			"#0C141B",
				TableText:			"#FFF",
				TableLink:			"#FFF",
				TableLinkFirstCol:	"#FFF",
				TableHoverRow:		"#142e42",
				TableHoverLink:		"#3771A1",
				TableNewEvent:		"#F00",
				TableIcon:			"#1D3B54",
				TableShadow:		"#4399db",
				SetGetAttrBG:		"#000000",
				SubmitButtonBG:		"#1D3B54",
				SubmitButtonBorder:	"#1D3B54",
				SubmitButtonText:	"#FFF",
				WidgetBorder:		"#1D3B54",
				WidgetText:			"#FFF",
				WidgetHighlight:	"#1D3B54",
				LogDate:			"#1D3B54",
				LogTime:			"#1D3B54",
				LogVerbose0:		"#FFF",
				LogVerbose1:		"#F00",
				LogVerbose2:		"#FFA500",
				LogVerbose3:		"#0F0",
				LogVerbose4:		"#1E90FF",
				LogVerbose5:		"#1D3B54",
				plotBG:				"#000",
				plotBGgradient:     "#000",
				plotBorder:			"#1D3B54",
				plotText:			"#FFF",
				plotGrid:			"#555",
				plotMarker:			"#F00",
				plotLine0:          '#9c0000',
				plotLine1:          '#005c00',
				plotLine2:          '#3771A1',
				plotLine3:          '#870087',
				plotLine4:          '#942626',
				plotLine5:          '#AAA',
				plotLine6:          '#808000',
				plotLine7:          '#808080',
				plotLine8:          '#4f4f00',
				plotLinePasted:     '#AAA' },
			black: {
				HeaderBG:           '#000',
				HeaderIcon:         '#FFF',
				HeaderText:         '#AAA',
				HeaderBorder:       '#222',
				MenuBG:             '#000',
				MenuBorder:         '#222',
				MenuIcon:           '#FFF',
				MenuIconBG:			'#000',
				MenuRoomIcon:       '#FFF',
				MenuText:           '#AAA',
				MenuHoverLink:      '#FFF',
				MainBG:             '#000',
				TableHeaderBG:      '#222',
				TableHeaderText:    '#AAA',
				TableBorder:        '#222',
				TableOdd:           '#000',
				TableEven:          '#101010',
				TableText:          '#AAA',
				TableLink:          '#AAA',
				TableLinkFirstCol:  '#AAA',
				TableHoverRow:      '#222',
				TableHoverLink:     '#FFF',
				TableNewEvent:      '#F00',
				TableIcon:          '#FFF',
				TableShadow:        '#FFF',
				SetGetAttrBG:       '#000',
				SubmitButtonBG:     '#444',
				SubmitButtonBorder: '#444',
				SubmitButtonText:   '#AAA',
				WidgetBorder:       '#444',
				WidgetText:         '#AAA',
				WidgetHighlight:    '#FFF',
				LogDate:            '#AAA',
				LogTime:            '#AAA',
				LogVerbose0:        '#AAA',
				LogVerbose1:        '#F00',
				LogVerbose2:        '#FFA500',
				LogVerbose3:        '#008000',
				LogVerbose4:        '#1E90FF',
				LogVerbose5:        '#00F',
				plotBG:             '#000',
				plotBGgradient:     '#000',
				plotBorder:         '#222',
				plotText:           '#AAA',
				plotGrid:           '#999',
				plotMarker:         '#F00',
				plotLine0:          '#9c0000',
				plotLine1:          '#005c00',
				plotLine2:          '#3771A1',
				plotLine3:          '#870087',
				plotLine4:          '#942626',
				plotLine5:          '#AAA',
				plotLine6:          '#808000',
				plotLine7:          '#808080',
				plotLine8:          '#4f4f00',
				plotLinePasted:     '#AAA' },
			fhem: {
				HeaderBG:           '#FFFFE7',
				HeaderIcon:         '#278727',
				HeaderText:         '#000',
				HeaderBorder:       '#FFFFE7',
				MenuBG:             '#D7FFFF',
				MenuBorder:         '#FFFFE7',
				MenuIcon:           '#278727',
				MenuIconBG:			'#D7FFFF',
				MenuRoomIcon:       '#278727',
				MenuText:           '#278727',
				MenuHoverLink:      '#80DDDD',
				MainBG:             '#FFFFE7',
				TableHeaderBG:      '#E0E0C8',
				TableHeaderText:    '#000',
				TableBorder:        '#FFFFE7',
				TableOdd:           '#F0F0D8',
				TableEven:          '#F8F8E0',
				TableText:          '#278727',
				TableLink:          '#278727',
				TableLinkFirstCol:  '#278727',
				TableHoverRow:      '#E0E0C8',
				TableHoverLink:     '#278727',
				TableNewEvent:      '#F00',
				TableIcon:          '#278727',
				TableShadow:        '#000',
				SetGetAttrBG:       '#FFFFE7',
				SubmitButtonBG:     '#FFFFE7',
				SubmitButtonBorder: '#555',
				SubmitButtonText:   '#000',
				WidgetBorder:       '#555',
				WidgetText:         '#000',
				WidgetHighlight:    '#278727',
				LogDate:            '#278727',
				LogTime:            '#278727',
				LogVerbose0:        '#000',
				LogVerbose1:        '#F00',
				LogVerbose2:        '#FFA500',
				LogVerbose3:        '#008000',
				LogVerbose4:        '#1E90FF',
				LogVerbose5:        '#00F',
				plotBG:             '#FFFFE7',
				plotBGgradient:     '#FFFFE7',
				plotBorder:         '#555',
				plotText:           '#000',
				plotGrid:           '#555',
				plotMarker:         '#F00',
				plotLine0:          '#F00',
				plotLine1:          '#0F0',
				plotLine2:          '#00F',
				plotLine3:          '#F0F',
				plotLine4:          '#A52A2A',
				plotLine5:          '#000',
				plotLine6:          '#808000',
				plotLine7:          '#808080',
				plotLine8:          '#FF0',
				plotLinePasted:     '#000' }
		},
		load: function(name) {
			var changed = false;
			if (flex.settings.local.currentStyle != name) {
				flex.settings.local.currentStyle = name;
				if (flex.colorPreset.default.hasOwnProperty(name))
					flex.settings.local.color = $.extend({},flex.colorPreset.default[name]);
				else if (flex.settings.global.flex.colorPreset.hasOwnProperty(name))
					flex.settings.local.color = $.extend({},flex.settings.global.flex.colorPreset[name]);
				flex.settings.check();
				changed = true;
			}
			return changed;
		},
		apply: function (name) {
			flex.colorPreset.load(name);
			flex.settings.save(true);
			flex.settings.apply();
			flex.settings.createHTML();
		},
		applyDaytimeStyle: function(force) {
			if (!flex.sunset || force) {
				flex.helper.getLocation(
					function(lat,lon) {
						flex.sunset  = SunriseSunsetJS.getSunset(lat, lon);
						flex.sunrise = SunriseSunsetJS.getSunrise(lat, lon);
						flex.endOfDay = new Date((new Date()).setHours(23,59,59,999));
						var now = new Date();
						flex.isDay = flex.sunrise <= now && now <= flex.sunset;
						var changed;
						if (flex.isDay)
							changed = flex.colorPreset.load(flex.settings.local.dayStyle);
						else
							changed = flex.colorPreset.load(flex.settings.local.nightStyle);
						if (changed) {
							flex.settings.save(true,true);
							flex.settings.apply();
						}
					},
					function(error) {
						flex.settings.local.enableDayTimeStyle = false;
						flex.settings.save(true);
						flex.settings.createHTML();
						FW_okDialog("Error: cannot determine location. Daytime styles will be disabled.");
					});
			}
			if (flex.settings.local.enableDayTimeStyle)
				setTimeout(function() {
					var now = new Date();
					var isDay = flex.sunrise <= now && now <= flex.sunset;
					flex.colorPreset.applyDaytimeStyle(isDay != flex.isDay || flex.endOfDay < now);
				},60000); //check every minute
		},
		save: function (name) {
			if (name) name = name.trim();
			
			//Not allowed: empty name / overwrite default styles
			if (!name || flex.colorPreset.default.hasOwnProperty(name) || name == 'unsaved')
				return false;
			
			flex.settings.local.currentStyle = name;
			flex.settings.global.flex.devices[flex.fingerprint].currentStyle = name;
			flex.settings.global.flex.colorPreset[name] = $.extend({},flex.settings.local.color);
			flex.cmd("attr "+flex.webName+" styleData "+JSON.stringify(flex.settings.global, undefined, 1));
			if (!$('option[value="'+name+'"]').length)
				$('<option>', {value: name}).text(name).appendTo($('#flexStylePresets')).prop('selected',true);
			FW_errmsg('Preset saved', 2000);
			
			$('#flexStylePresets>option[value="unsaved"]').remove();
			
			return true;
		},
		delete: function(names) {
			names = names.split(',');
			for (var ii=0; ii<names.length; ii++) {
				var name = names[ii];
				name = name.trim();
				if (!name) return false;
				delete flex.settings.global.flex.colorPreset[name];
				$('option[value="'+name+'"]').remove();
				if (name == flex.settings.local.currentStyle) {
					flex.settings.local.currentStyle = 'unsaved';
					$('<option>', {value: flex.settings.local.currentStyle}).text(flex.settings.local.currentStyle).appendTo($('#flexStylePresets')).prop('selected',true);
				}
			}
			flex.cmd("attr "+flex.webName+" styleData "+JSON.stringify(flex.settings.global, undefined, 1));
			FW_errmsg('Preset(s) deleted', 2000);
			return true;
		},
		import: function() {
			var n = "flexImportStylePreset";
			$("body").append(
				'<div id="'+n+'">'+
				'<input placeholder="Enter preset name" style="margin-bottom: 1em;"/>'+
				'<textarea placeholder="Paste style preset (json)" rows="20" cols="90" style="width:99%; word-break: break-all;";/>'+
				'</div>');
			var inp = $("#"+n+" input");
			var ta = $("#"+n+" textarea");

			$("#"+n).dialog({
			dialogClass:"no-close", modal:true, width:"auto", closeOnEscape:true, 
			title:"Import flex color preset",
			maxWidth:$(window).width()*0.9, maxHeight:$(window).height()*0.9,
			buttons: [
			{text:"Save",click:function(){ 
				var stylename = inp.val().trim();
				if (!stylename) return alert("Enter valid style name");;
				if (flex.colorPreset.default.hasOwnProperty(stylename))
					return alert("Not allowed to overwrite default styles. Enter different style name");
				var overwrite;
				if (flex.settings.global.flex.colorPreset.hasOwnProperty(stylename)){
					overwrite = confirm('Existing Style with name '+stylename+'. Overwrite?')
					if (!overwrite) return;
				}
				var d;
				try { d=JSON.parse(ta.val()); } catch(e){ return alert("Invalid style preset"); }
				flex.settings.global.flex.colorPreset[stylename] = d;
				flex.cmd("attr "+flex.webName+" styleData "+JSON.stringify(flex.settings.global, undefined, 1));
				if (!overwrite)
					$('<option>', {value: stylename}).text(stylename).appendTo($('#flexStylePresets'));
				FW_errmsg('Preset imported', 2000);
			}},
			{text:"Close", click:function(){ $(this).remove(); }},
			],
			close:function(){ $("#"+n).remove(); }
			});
			
		},
		export: function() {
			FW_okDialog(JSON.stringify(flex.settings.local.color));
		},
		getSimplePreset: function () {
			var colors = {
				HeaderBG:           flex.colorPreset.simple.Accent,
				HeaderIcon:         flex.colorPreset.simple.HeaderText,
				HeaderText:         flex.colorPreset.simple.HeaderText,
				HeaderBorder:       flex.colorPreset.simple.Accent,
				MenuBG:             flex.colorPreset.simple.MenuBackground,
				MenuBorder:         flex.colorPreset.simple.Accent,
				MenuIcon:           flex.colorPreset.simple.HeaderText,
				MenuIconBG:         flex.colorPreset.simple.Accent,
				MenuRoomIcon:       flex.colorPreset.simple.MenuText,
				MenuText:           flex.colorPreset.simple.MenuText,
				MenuHoverLink:      flex.colorPreset.simple.Accent,
				MainBG:             flex.colorPreset.simple.Background,
				TableHeaderBG:      flex.colorPreset.simple.Accent,
				TableHeaderText:    flex.colorPreset.simple.HeaderText,
				TableBorder:        flex.colorPreset.simple.Accent,
				TableOdd:           flex.colorPreset.simple.Background,
				TableEven:          flex.helper.mixColors(flex.colorPreset.simple.Background,flex.colorPreset.simple.Accent,0.3),
				TableText:          flex.colorPreset.simple.Text,
				TableLink:			flex.colorPreset.simple.Text,
				TableLinkFirstCol:  flex.colorPreset.simple.Text,
				TableHoverRow:      flex.helper.mixColors(flex.colorPreset.simple.Background,flex.colorPreset.simple.Accent,0.7),
				TableHoverLink:     flex.colorPreset.simple.Accent,
				TableNewEvent:      '#F00',
				TableIcon:          flex.colorPreset.simple.Accent,
				TableShadow:		flex.colorPreset.simple.Text,
				SetGetAttrBG:       flex.helper.shiftColor(flex.colorPreset.simple.Background,'#333'),
				SubmitButtonBG:     flex.colorPreset.simple.Accent,
				SubmitButtonBorder: flex.colorPreset.simple.Accent,
				SubmitButtonText:   flex.colorPreset.simple.HeaderText,
				WidgetBorder:       flex.colorPreset.simple.Accent,
				WidgetText:         flex.colorPreset.simple.Text,
				WidgetHighlight:    flex.colorPreset.simple.Accent,
				LogDate:            flex.colorPreset.simple.Text,
				LogTime:            flex.colorPreset.simple.Text,
				LogVerbose0:        flex.colorPreset.simple.Text,
				LogVerbose1:        '#F00',
				LogVerbose2:        '#FFA500',
				LogVerbose3:        '#0F0',
				LogVerbose4:        '#1E90FF',
				LogVerbose5:        '#00F',
				plotBG:             flex.colorPreset.simple.Background,
				plotBGgradient:     flex.colorPreset.simple.Background,
				plotBorder:         flex.colorPreset.simple.Accent,
				plotText:           flex.colorPreset.simple.Text,
				plotGrid:           '#555',
				plotMarker:         '#F00',
				plotLine0:          '#F00',
				plotLine1:          '#0F0',
				plotLine2:          '#00F',
				plotLine3:          '#F0F',
				plotLine4:          '#A52A2A',
				plotLine5:          '#000',
				plotLine6:          '#808000',
				plotLine7:          '#808080',
				plotLine8:          '#FF0',
				plotLinePasted:     '#000' };
			return colors;
		},
		setSimpleColors: function() {
			if (flex.settings.local.color) {
				flex.colorPreset.simple = {
					Background: 	flex.settings.local.color.MainBG,
					Text: 			flex.settings.local.color.TableText,
					HeaderText: 	flex.settings.local.color.HeaderText,
					MenuBackground: flex.settings.local.color.MenuBG,
					MenuText: 		flex.settings.local.color.MenuText,
					Accent: 		flex.settings.local.color.WidgetHighlight
				};
			}
		}
	}
		
	flex.settings = {
		default: {
			color: flex.colorPreset.default.bright,
			title: 'fhem',
			myUtilsFileName: '99_myUtils.pm',
			plotMinWidth: '250px',
			plotMaxWidth: '100%',
			fontFamily: 'Arial',
			showClock: true,
			showLogoButton: false,
			showRebootButton: true,
			showUpdateButton: true,
			showUpdateCheckButton: true,
			showRereadIconsButton: false,
			showRawInputButton: true,
			showSaveButton: true,
			showRoomDeviceName: true,
			showMenuAlways: true,
			showFirstColBold: true,
			enableCommandHistory: true,
			enableDeviceSearch: true,
			hideWebcmdOnSmallScreen: false,
			colorOptionsDetailed: false,
			multiColumnLayout: 'dual',
			enableAnimations: false,
			improvePerformance: false,
			enableLogLineWrap: true,
			enableRoundedEdges: true,
			enableTableShadow: false,
			showRoomIconsRight: false,
			enableCodeMirror: true,
			enableDayTimeStyle: false,
			enableExperimental: false,
			dayStyle: 'bright',
			nightStyle: 'dark',
			currentStyle: 'unsaved',
			newSettings: {}
		},
		beta: {
			scalePage: '1',
			enableTableBehaviour: false
		},
		defaultFonts: ['Arial','Georgia','Tahoma','Times New Roman'],
		description: {
			EN: {
				fontFamily:                 ["Font-family","Chose your preferred font-family. Also allows to use any Google font (fonts.google.com). Some fonts may cause style issues."],
				title: 						["Title","Arbitrary string which will be shown in the header (showRoomDeviceName has priority)."],
				myUtilsFileName: 			["myUtils filename","Filename of a perl module which can be reloaded using the corresponding menu button. If empty, the button will be hidden.<br/>ex: 99_myUtils.pm"],
				plotMinWidth: 				["Minimal plot width","Minimum SVGPlot width. Can be any CSS size (including unit!).<br/>ex: 250px"],
				plotMaxWidth: 				["Maximal plot width","Maximum SVGPlot width. Can be any CSS size (including unit!).<br/>ex: 100% or 800px"],
				scalePage: 					["Zoom page factor","Kindly note: values not equal 1 will cause some position errors (like for menu/group sorting), therefore it is highly recommended to use browser zoom function, if available. Allows to scale the complete page within the range of 70% to 150%. Doesn't work with Firefox at all.<br/>ex: 1.1"],
				showClock: 					["Show clock","Show FHEM time as a digital clock in the header."],
				showRebootButton: 			["Reboot button","Show button in the menu header to reboot Fhem."],
				showUpdateButton: 			["Update button","Show button in the menu header to update Fhem."],
				showUpdateCheckButton: 		["Update check button","Show button in the menu header to show latest Fhem updates."],
				showRereadIconsButton: 		["Reread icons","Show button in the menu header to reread Fhem icons."],
				showSaveButton: 			["Save button","Show button in the menu header to save latest changes."],
				showRoomDeviceName: 		["Show room/device name","Depending if in a room view or device view, the corresponding room/device name will be shown in the header."],
				showRawInputButton: 		["Raw input button","Show button right to the menu button which opens a raw Fhem code input field."],
				showMenuAlways: 			["Show menu always","If disabled, the menu will also be hidden in desktop view (display width &gt;900px)."],
				showFirstColBold:			["First column bold","If enabled, text in first column will have bold font-weight."],
				enableCommandHistory: 		["Command history","Enables a command history feature. While focusing the commandline, previous commands can be selected using up/down arrow keys."],
				enableDeviceSearch: 		["Device search","Allows to search Fhem devices using the commandline. A minimum of 3 characters is required. Devices can be selected using up/down arrow keys."],
				hideWebcmdOnSmallScreen: 	["Hide webcmd on small screens","If enabled, all webcmds (sliders, inputs, selects, etc.) will be hidden if display width &le;900px."],
				multiColumnLayout: 		    ["Multi column layout","Allows to distribute device-groups in multiple columns, whereby the distribution will be as equal as possible for dual layout. For the custom layout the groups can be distributed in up to three columns using drag'n'drop'."],
				hiddenGroups:               ["Hidden groups","Shows a list of hidden groups and allows to restore them."],
				enableAnimations: 			["Enable animations","Enables several animations, like sliding in/out the menu. Can reduce performance on weak hardware"],
				improvePerformance: 		["Improve performance","If enabled, the executing time of some (not that important) javascript stylings will be limited to 500ms. Only relevant for rooms with many devices and when using weak hardware."],
				enableLogLineWrap: 			["Wrap log lines","If enabled, the log/eventmonitor will wrap each line in order that no horizontal scrolling is required."],
				enableRoundedEdges: 		["Rounded edges","If enabled, edges of tables/widgets/buttons will be rounded."],
				enableTableShadow: 			["Table shadow","If enabled, a shadow will be added to each table."],
				showRoomIconsRight: 		["Room icons right-aligned","If enabled, the room icons in the menu will be on the right side."],
				enableCodeMirror: 			["Code highlighting","If enabled, code inputs (like raw input) will use code highlighting."],
				showLogoButton: 			["Show logo","Shows the FHEM logo in the menu header which acts as a home button."],
				"Save/delete settings": 	["Save/delete settings","Global: for all terminals<br>Local: for the current terminal"],
				"Sort menu entries": 		["Sortable menu entries","Allows to sort all menu entries using drag'n'drop. It is required to click on 'save' afterwards."],
				"Additional CSS": 			["Additional CSS code","Simple helper to set additional CSS code, which will be stored in the Css-attribute of the FHEMWEB device."],
				"Need help / found bug?": 	["Need help / found Bug?","I can't test everything and FHEM is modular, that's why bugs can happen. Please report bugs and help to get the stlyle better."],
				"Settings general":			["General"],
				"Settings header":			["Header / commandline"],
				"Settings menu":			["Menu"],
				"Settings layout":			["Layout"],
				"Settings other":			["Others"],
				"Settings color":			["Colors"],
				"Other styles":				["Other styles"],
				Presets: 					["Presets","Allows to select/save/export/import style presets."],
				"Color options": 			["Complexity","Colors can be defined using a simple or detailed scheme."],
				Background:					["Background",""],
				Text:						["Text",""],
				HeaderText:					["Header text",""],
				MenuBackground:				["Menu background",""],
				MenuText:					["Menu text",""],
				Accent:						["Accent",""],
				"Buy me a beer":            ["You like flex?","The style is and remains free of charge. But there are many hours of work in it, so I am happy about a beer :)"],
				enableDayTimeStyle:         ["Daytime change","Allows to select different presets for day/night. Asks for location access, with fallback to IP location! Will overwrite your current color preset, save it as a preset before!"],
				dayStyle:					["Day style","Style which will be shown during daytime."],
				nightStyle:					["Night style","Style which will be shown during nighttime."],
				"WARNING":					["Note: these settings can cause issues, read the tooltips!"],
				enableExperimental:			["Experimental settings","Enable additional settings which can be erroneous."],
				deviceID:					["Device ID","Device ID of your current terminal. Used for terminal-specific settings."],
				enableTableBehaviour:     ["Preserve table behaviour","If enabled, groups will preserve the table behaviour as long as one webcmd wraps."]
			},
			DE: {
				fontFamily:                 ["Schriftart","Wähle eine bevorzugte Schriftart. Es ist auch möglich eine beliebige Google Schriftart zu verwenden (fonts.google.com). Einige Schriftarten können das Layout verzerren."],
				title: 						["Titel","Beliebiger Text welcher in der Kopfzeile angezeigt wird (Raum-/Gerätename haben Vorrang)."],
				myUtilsFileName: 			["myUtils Dateiname","Dateiname von einem Perl-Modul, welches dann über den entsprechenden Menü Button neu geladen werden kann. Wenn kein Dateiname gesetzt ist, wird der Button ausgeblendet.<br/>z.B. 99_myUtils.pm"],
				plotMinWidth: 				["Minimale Plot Breite","Kann jede gültige CSS Größe sein (inklusive Einheit!).<br/>z.B. 250px"],
				plotMaxWidth: 				["Maximale Plot Breite","Kann jede gültige CSS Größe sein (inklusive Einheit!).<br/>z.B. 100% or 800px"],
				scalePage: 					["Zoom Faktor","Bitte beachten: Werte ungleich 1 verursachen teilweise Positionsprobleme, z.B. bei der Menü/Gruppen Sortierung, daher ist dringend empfholen die Browser Zoom Funktion zu verwenden, sofern verfügbar. Die Funktion erlaubt es die ganze Seite im Bereich von 70% bis 150% zu skalieren. Funktioniert nicht mit Firefox.<br/>z.B. 1.1"],
				showClock: 					["Uhr anzeigen","Zeigt die FHEM Zeit in der Kopfzeile an."],
				showRebootButton: 			["Neustart Button","Zeigt einen Button zum Neustarten von FHEM im Menü an."],
				showUpdateButton: 			["Update Button","Zeigt einen Button zum Updatan von FHEM im Menü an."],
				showUpdateCheckButton: 		["Update-Prüfen Button","Zeigt einen Button zum Überprüfen von Updates im Menü an."],
				showRereadIconsButton: 		["Reread icons Buttons","Zeigt einen Button zum erneuten Einlesen von Icons im Menü an."],
				showSaveButton: 			["Speichern Button","Zeigt einen Button zum Speichern der letzten FHEM Änderungen im Menü an."],
				showRoomDeviceName: 		["Raum-/Gerätename anzeigen","In einem Raum bzw. der Geräteübersicht wird der Raumname/Gerätename in der Kopfzeile angezeigt."],
				showRawInputButton: 		["Raw-Input Button","Zeigt einen Button in der Kopfzeile um Raw FHEM-Code einzugeben."],
				showMenuAlways: 			["Menü immer anzeigen","Wenn deaktiviert, wird das Menü auch im Desktop-Modus ausgeblendet."],
				showFirstColBold:			["Erste Spalte fett","Wenn aktiviert, wird der Text in der ersten Spalte immer fett dargestellt."],
				enableCommandHistory: 		["Befehlsverlauf","Fügt der Befehlseingabe einen Verlauf hinzu. Den Befehlsverlauf kann man mit den hoch/runter Tasten durchgehen."],
				enableDeviceSearch: 		["Gerätesuche","Erlaubt die Suche von FHEM-Geräten in der Befehlseingabe. Es müssen mindestens 3 Zeichen eingegeben werden. Geräte können durch die hoch/runter Tasten ausgewählt werden."],
				hideWebcmdOnSmallScreen: 	["Webcmds ausblenden","Blendet alle Webcmds (sliders, inputs, selects, etc.) auf kleinen Bildschirmen aus."],
				multiColumnLayout: 		    ["Mehrspalten Layout","Erlaubt es Geräte-Gruppen in mehrere Spalten aufzuteilen, wobei die Aufteilung für das dual-Layout so gleichmäßig wie möglich ist. Für das custom-Layout kann die Aufteilung per Drag'n'Drop vorgenommen werden."],
				hiddenGroups:               ["Ausgeblendete Gruppen","Zeigt alle ausgeblendeten Gruppen an und ermöglicht diese wieder anzuzeigen."],
				enableAnimations: 			["Animationen aktivieren","Aktiviert Animationen, z.B. das Ein-/Ausblenden des Menüs. Kann die Performance auf schwacher Hardware reduzieren."],
				improvePerformance: 		["Performance verbessern","Wenn aktiviert, werden bestimmte (nicht so wichtige) Javascript Stylings nach 500ms abgebrochen. Dies ist nur für Räume mit vielen Geräten relevant bzw. auf schwacher Hardware."],
				enableLogLineWrap: 			["Log-Zeilen umbrechen","Zeilen im Log/Eventmonitor werden umgebrochen, sodass kein horizontales Scrollen nötig ist."],
				enableRoundedEdges: 		["Abgerundete Ecken","Die Ecken von Tabellen/Widgets/Buttons usw. werden abgerundet."],
				enableTableShadow: 			["Tabellen Schatten","Zeigt einen Schatten unterhalb jeder Tabelle an."],
				showRoomIconsRight: 		["Raum-Icons rechtsbündig","Wenn aktiviert, dann werden Raum-Icons rechtsbündig angezeigt"],
				enableCodeMirror: 			["Code Hervorhebung","Wenn aktiviert, wird der Code in Code-Eingabe Feldern (wie Raw Input) farblich hervorgehoben."],
				showLogoButton: 			["Logo anzeigen","Zeigt das Fhem Logo im Menü an, welches als Home Button dient."],
				"Save/delete settings": 	["Einstellungen speichern/löschen","Global: Für alle Endgeräte<br>Lokal: Nur für das aktuelle Endgerät"],
				"Sort menu entries": 		["Sortierbare Menüeinträge","Erlaubt es alle Menüeinträge zu sortieren. Nach dem Sortieren muss gespeichert werden."],
				"Additional CSS": 			["Zusätzlicher CSS Code","Öffnet ein Eingabefeld für zusätzlichen CSS Code."],
				"Need help / found bug?": 	["Fehler gefunden? Hilfe nötig?","Ich kann nicht alles testen, vor allem weil FHEM modular ist, daher sind Fehler nicht auszuschließen. Bitte berichte Fehler und trage dazu bei den Style besser zu machen."],
				"Settings general":			["Allgemein"],
				"Settings header":			["Kopfzeile / Eingabefeld"],
				"Settings menu":			["Menü"],
				"Settings layout":			["Layout"],
				"Settings other":			["Anderes"],
				"Settings color":			["Farben"],
				"Other styles":				["Andere Styles"],
				Presets: 					["Voreinstellungen","Erlaubt es Voreinstellungen auszuwählen sowie zu speichern, löschen, exportieren und importieren."],
				"Color options": 			["Komplexität","Farben können nach einem einfachen oder detaillierten Schema definiert werden."],
				Background:					["Hintergrund",""],
				Text:						["Text",""],
				HeaderText:					["Kopfzeilen Text",""],
				MenuBackground:				["Menü Hintergrund",""],
				MenuText:					["Menü Text",""],
				Accent:						["Akzent",""],
				"Buy me a beer":            ["Gefällt dir flex?","Der Style ist und bleibt kostenlos. Es stecken aber viele Stunden Arbeit darin, daher freue ich mich über ein Motivations-Bier :)"],
				enableDayTimeStyle:         ["Tageszeiten Wechsel","Erlaubt es verschiedene Styles für Tag/Nacht auszuwählen. Fragt nach Standort Zugriff, anderenfalls wird IP Positionierung verwendet! Dies wird die aktuelle Voreinstellung überschreiben, zuvor als Preset speichern!"],
				dayStyle:					["Tag Style","Style der bei Tag angezeigt wird."],
				nightStyle:					["Nacht Style","Style der bei Nacht angezeigt wird."],
				"WARNING":					["Hinweis: diese Einstellungen können zu Problemen führen, siehe entsprechendes Infosymbol!"],
				enableExperimental:			["Experimentelle Funktionen","Zeigt zusätzliche Funktionen an die fehlerhaft sein können."],
				deviceID:					["Endgerät ID","ID welche für die Endgerät-spezifischen Einstellungen verwendet wird."],
				enableTableBehaviour:     ["Tabellen-Verhalten beibehalten","Wenn aktiviert, dann wird bei Gruppen das Tabellen-Verhalten so lange beibehalten bis ein Webcmd in eine neue Zeile rutscht."]
			}
		},
		check: function() {
			// find new settings and delete unused settings
			var validKeys = Object.keys($.extend({},flex.settings.default,flex.settings.beta));
			if (Object.keys(flex.settings.local).length) {
				if (flex.settings.local.enableExperimental)
					flex.settings.local.newSettings = $.extend({},flex.settings.default,flex.settings.beta);
				else {
					flex.settings.local.newSettings = $.extend({},flex.settings.default);
					flex.settings.local = $.extend({},flex.settings.local, flex.settings.beta); // use default beta settings
				}
			}
			for (key in flex.settings.local) {
				if (!validKeys.includes(key))
					delete flex.settings.local[key];
				delete flex.settings.local.newSettings[key];
			}
			
			// get missing colors
			if (flex.settings.local.color) {
				flex.colorPreset.setSimpleColors();
				flex.settings.local.color = $.extend({},flex.colorPreset.getSimplePreset(),flex.settings.local.color);
			}
			flex.settings.local = $.extend(true,{},flex.settings.default,flex.settings.beta,flex.settings.local);
			
			// check if daytime styles exist
			if (!flex.colorPreset.default.hasOwnProperty(flex.settings.local.dayStyle) && !flex.settings.global.flex.colorPreset.hasOwnProperty(flex.settings.local.dayStyle))
				flex.settings.local.dayStyle = flex.settings.default.dayStyle;
			if (!flex.colorPreset.default.hasOwnProperty(flex.settings.local.nightStyle) && !flex.settings.global.flex.colorPreset.hasOwnProperty(flex.settings.local.nightStyle))
				flex.settings.local.nightStyle = flex.settings.default.nightStyle;
				
			
			/**** Global settings ****/
			var globalSettings = {colorPreset: {}, menuOrder: {}};
			flex.settings.global.flex = $.extend({},globalSettings,flex.settings.global.flex);
			
			flex.colorPreset.setSimpleColors();
			
			// fix chrome offset when scaling page
			flex.offsetScale = (flex.browser.isFirefox) ? 1 : flex.settings.local.scalePage;
		},
		load: function() {
			// Log fingerprint
			flex.log('Fingerprint: '+flex.fingerprint);
			// General information
			flex.helper.gatherInformations();
			
			flex.settings.global = $("body").attr("data-styleData");
			if (flex.settings.global){
				try { flex.settings.global=JSON.parse(flex.settings.global); } catch(e){ flex.settings.global = undefined; }
			}
			if (!flex.settings.global)
				flex.settings.global = {};
			if (!flex.settings.global.flex)
				flex.settings.global.flex = {};
			if (!flex.settings.global.flex.devices)
				flex.settings.global.flex.devices = {};
			flex.settings.local = $.extend({},flex.settings.global.flex,flex.settings.global.flex.devices[flex.fingerprint]);
			
			
			if (!flex.settings.global.flex.devices[flex.fingerprint])
				flex.settings.local.currentStyle = 'bright';
			
			flex.settings.check();
		},
		save: function(local,silent) {
			if (local) {
				flex.settings.global.flex.devices[flex.fingerprint] = $.extend({},flex.settings.local);
				if (!silent) FW_errmsg('Settings saved locally', 2000);
			}
			else {
				delete flex.settings.global.flex.devices[flex.fingerprint];
				flex.settings.global.flex = $.extend({},flex.settings.global.flex,flex.settings.local);
				if (!silent) FW_errmsg('Settings saved globally', 2000);
			}
			flex.cmd("attr "+flex.webName+" styleData "+JSON.stringify(flex.settings.global, undefined, 1));
		},
		delete: function(local) {
			if (local) {
				delete flex.settings.global.flex.devices[flex.fingerprint];
				FW_errmsg('Local settings deleted', 2000);
			} else {
				delete flex.settings.global.flex;
				$('body').removeAttr('data-styledata');
				FW_errmsg('Global settings deleted', 2000);
			}
			flex.cmd("attr "+flex.webName+" styleData "+JSON.stringify(flex.settings.global, undefined, 1));
			flex.settings.load()
			flex.settings.apply();
			flex.menu.refresh();
			flex.header.refresh();
			flex.settings.createHTML();
		},
		change: function(desc,state) {
			if (desc.startsWith('color.')) {
				if (flex.settings.local.colorOptionsDetailed)
					flex.settings.local.color[desc.replace('color.','')] = state;
				else {
					flex.colorPreset.simple[desc.replace('color.','')] = state;
					flex.settings.local.color = flex.colorPreset.getSimplePreset();
				}
				
				if (flex.settings.local.currentStyle != 'unsaved') {
					flex.settings.local.currentStyle = 'unsaved';
					var select = $('#flexStylePresets');
					$('<option>', {value: flex.settings.local.currentStyle}).text(flex.settings.local.currentStyle).appendTo(select);
					select.find('>option[value="'+flex.settings.local.currentStyle+'"]').first().prop('selected',true);
				}
			} else
				flex.settings.local[desc] = state;
			
			// save settings locally
			flex.settings.save(true);
			
			flex.menu.refresh();
			flex.header.refresh();
			flex.settings.apply();
			if (flex.settings.local.enableDayTimeStyle)
				flex.colorPreset.applyDaytimeStyle(true);
			
			if (desc.match(/(colorOptionsDetailed|enableDayTimeStyle|enableExperimental)/))
				flex.settings.createHTML();
		},
		apply: function() {
			// Update CSS
			$("head style#flex_css").remove();
			style = "<style id='flex_css'>"+flex.settings.getCSS()+"</style>";
			if($("head style#fhemweb_css").length)
				$("head style#fhemweb_css").before(style);
			else
				$("head").append(style);
			
			// Update plot colors
			flex.content.updatePlotColors();
			
			// Hide menu always?
			$("#menuScrollArea, #content, #hdr, #contentOverlay").toggleClass('hideAlways', !flex.settings.local.showMenuAlways);
			
			// add transition effect
			if (flex.settings.local.enableAnimations)
				setTimeout(function(){$("#menuScrollArea, #content, #hdr, body.commandref #right").css('transition','0.5s');},500);
		},
		createHTML: function() {
			if ($('.fileList.styles').length) {
				if (!flex.language) {
					$.ajax({
						url: flex.fhemPath + '?cmd=jsonlist2%20global&XHR=1&fwcsrf='+flex.fwcsrf,
						success: function (data) {
							if (typeof data.Results[0] !== "object") {flex.language = 'EN'; return;}
							flex.language = data.Results[0].Attributes.language || 'EN'
						},
						async: false
					});
				}
				
				var rowCounter = 0;
				var addRow = function () {
					var parent = arguments[0];
					var desc = arguments[1];
					var settingsTitle = desc;
					var tooltipId = "tooltip_"+desc.replace(/[\s/\\?]/g,'_');
					var tooltipmsg;
					if (flex.settings.description[flex.language] && flex.settings.description[flex.language][desc]) {
						settingsTitle = flex.settings.description[flex.language][desc][0];
						tooltipmsg = flex.settings.description[flex.language][desc][1];
					}
					var row = $('<tr>').addClass((++rowCounter%2 ? "even":"odd")).appendTo(parent);
					if (tooltipmsg) {
						var tooltip = $(flex.content.icons.info).attr('class','tooltipicon').css('cursor','help')
											.mouseover(function (e) {
												var topOffset = ($(this).offset().top-$(this).height()-$('#'+tooltipId).height());
												$('#'+tooltipId).toggleClass('bottom',topOffset<0);
												if (topOffset<0) {
													topOffset = $(this).offset().top+$(this).height();
												}
												$('#'+tooltipId).css('top',topOffset + 'px')
																 .css('left',($(this).offset().left-52) + 'px').css('visibility','visible').css('opacity','1');
											}).mouseleave(function(e) {$('#'+tooltipId).css('visibility','hidden').css('opacity','0')});
						$('<span>',{id: tooltipId}).addClass('tooltiptext').html(tooltipmsg).appendTo($('body'));
						$('<td>').html(settingsTitle+" ").append(tooltip).appendTo(row);
					} else
						$('<td>').text(settingsTitle).appendTo(row);
					if (flex.settings.local.newSettings.hasOwnProperty(desc)) {
						row.find('>td').append($('<div class="newSetting">new</div>'));
					}
					for (i=2; i < arguments.length; i++)
						if (arguments[i])
							arguments[i].appendTo(row).wrap('<td></td>');
				}

				var createTable = function(title,id) {
					if (flex.settings.description[flex.language] && flex.settings.description[flex.language][title]) {
						title = flex.settings.description[flex.language][title][0];
					}
					if (!$('#'+id).length)
						$('<div class="flexSettings fileList">'+title+'</div><table id="'+id+'" class="block wide fileList"><tbody></tbody></table><br>').insertBefore($('.fileList.styles'));
					else
						$('#'+id+' > tbody').empty();
					return $('#'+id+' > tbody');
				}
				
				var createSettings = function(table,settings) {
					for (ii=0; ii<settings.length; ii++) {
						desc = settings[ii];
						//text field
						if (!desc.match(/^(color|show|hide|enable|disable|scale|improve)/)) {
							addRow(table,desc,
								$('<input>',{id: desc, type: "text", value: flex.settings.local[desc]})
									.keyup(function() {flex.settings.change($(this).attr('id'),$(this).val());}));
						}
						//number field
						if (desc.match(/^scale/) && !flex.browser.isFirefox) {
							addRow(table,desc,
								$('<input>',{id: desc, type: "number", step: "0.1", min: 0.7, max: 1.5, value: flex.settings.local[desc]})
									.keyup(function(e) {
										var value = Math.min(Math.max($(this).val(),0.7),1.5);
										flex.settings.change($(this).attr('id'),value);
									}));
						}
						//boolean field
						if (desc.match(/^(show|hide|enable|disable|improve)/)) {
							addRow(table,desc,
								$('<input>',{id: desc, type: "checkbox", style: "cursor: pointer;"})
									.prop('checked', flex.settings.local[desc])
									.change(function() {flex.settings.change($(this).attr('id'),$(this).prop('checked')==true );}),
								(desc !== "enableCommandHistory") ? undefined :
								$('<button>',{id: 'clearCmdHistory', style: "cursor: pointer;"})
									.click(function() {Cookies.remove('fhemCmdHistory');})
									.text('clear'));
						}
					}
				}
				
				var createColorPicker = function (parent,desc) {
					addRow(parent,desc,$('<div>').attr('id',desc));
					FW_replaceWidget('#'+desc, desc, ["colorpicker","RGB"], (flex.settings.local.colorOptionsDetailed) ? flex.settings.local.color[desc].replace('#','') : flex.colorPreset.simple[desc].replace('#',''), undefined, "rgb",undefined,
						function (value) { 
							flex.settings.change('color.'+desc,'#'+value);
						});
				}
				
				var createPresetSelect = function(title,elemid,selected) {
					var select = createSelect(title,elemid,Object.keys(flex.colorPreset.default).concat(Object.keys(flex.settings.global.flex.colorPreset)));
					if (selected == 'unsaved')
						$('<option>', {value: selected}).text(selected).appendTo(select);
					select.find('>option[value="'+selected+'"]').first().prop('selected',true);
					return select;
				}
				
				var createSelect = function(title,elemid,elements) {
					var select = $('<select>',{ id: elemid });
					if (title)
						$('<option>').text('-- '+title+' --').prop('disabled',true).appendTo(select);
					
					for (var ii=0; ii<elements.length; ii++)
						$('<option>', {value: elements[ii]}).text(elements[ii]).appendTo(select);
					
					return select;
				}
				
				var createMultiSelect = function(title,elemid,elements,radio,free,callback) {
					var select = $('<div>', {id: elemid});
					
					var table = $('<table>').appendTo(select);
					for (var ii=0; ii<elements.length; ii++) {
						var elemname = elements[ii].replace(/\s/g,'_');
						$('<tr>'
							+'<td><div class="checkbox"><input name="'+elemid+'" value="'+elements[ii]+'" id="'+elemid+'_'+elemname+'" type="'+(radio?"radio":"checkbox")+'"/></div></td>'
							+'<td><label for="'+elemid+'_'+elemname+'">'+elements[ii]+'</label></td>'
						  +'</tr>').appendTo(table);
					}
					
					if (free)
						$('<input id="'+elemid+'_free" placeholder="input name"/>').appendTo(select)
							.on('input',function(){
								if (radio) select.find('input:checked').prop('checked',false);
								select.find('#error').remove()});
					
					
					select.find('input[type=radio]')
						.on('input',function() {
							if (radio) select.find('#'+elemid+'_free').val('');
							select.find('#error').remove()});
					
					select.dialog({ modal:true, closeOnEscape:false, maxHeight:$(window).height()*3/4, title: title,
									buttons:[
										{ text:"Cancel", click:function(){ select.remove(); }},
										{ text:"OK", click:function(){
												var res=[];
												select.find('input:checked').each(function(){
													res.push($(this).attr('value'));
												});
												
												if (select.find('#'+elemid+'_free').val()) {
													if (select.find('#'+elemid+'_free').val().match(/,/)) {
														if (!select.find('#error').length)
															$('<div id="error" class="changed">Name not allowed!</div>').prependTo(select);
														return;
													}
													res.push(select.find('#'+elemid+'_free').val());
												}
												
												if (callback(radio ? res[res.length-1] : res.join()))
													select.remove();
												else {
													if (!select.find('#error').length)
														$('<div id="error" class="changed">Name not allowed!</div>').prependTo(select);
												}
											}}]
					});
					return select;
				}
				
				/********************
					  General
				********************/
				var tableGeneral = createTable('Settings general','flexGeneral');
				// save/delete buttons
				addRow(tableGeneral,'Save/delete settings',
					$('<button>',{id: 'saveGlobal', style: "cursor: pointer;"})
						.click(function() {flex.settings.save(false);})
						.text('Save global'),
					$('<button>',{id: 'deleteGlobal', style: "cursor: pointer;"})
						.click(function() {flex.settings.delete(false);})
						.text('Delete global'),
					$('<button>',{id: 'deleteLocal', style: "cursor: pointer;"})
						.click(function() {flex.settings.delete(true);})
						.text('Delete local')
				);
				addRow(tableGeneral,'Need help / found bug?',
					$('<a>',{href: 'https://forum.fhem.de/index.php/topic,101749.0.html', target: '_blank'})
						.text('flex thread'));
				addRow(tableGeneral,'Buy me a beer',
					$('<a>',{href: 'https://paypal.me/pools/c/8gUXHjxlDP', target: '_blank'})
						.text('Paypal.me'));
				addRow(tableGeneral,'deviceID',
					$('<div>').text(flex.fingerprint));
						
						
				
				/********************
					Header settings
				********************/
				var tableHeaderSettings = createTable('Settings header','flexHeaderSettings');
				createSettings(tableHeaderSettings,["title","showClock","showRawInputButton","showRoomDeviceName","enableCommandHistory","enableDeviceSearch"]);
				
				/********************
					Menu settings
				********************/
				var tableMenuSettings = createTable('Settings menu','flexMenuSettings');
				addRow(tableMenuSettings,'Sort menu entries',
					$('<a>',{id: 'editMenuEntries'})
						.click(function(){
							flex.menu.makeSortable($(this).text() == 'edit');
							$(this).text($(this).text() == 'edit' ? 'save' : 'edit');})
						.text('edit'),
					$('<a>',{id: 'resetMenuOrder'})
						.click(function() {flex.menu.resetSortOrder()})
						.text('reset'));
				createSettings(tableMenuSettings,["showMenuAlways","showRoomIconsRight","showLogoButton","showRebootButton","showUpdateButton","showUpdateCheckButton","showRereadIconsButton","showSaveButton","myUtilsFileName"]);
				
				/********************
					Layout settings
				********************/
				var tableLayoutSettings = createTable('Settings layout','flexLayoutSettings');
				var possibleFonts = flex.settings.defaultFonts.concat(flex.settings.local.fontFamily).concat('- Google font -').filter(function (value, index, self) { return self.indexOf(value) === index; });
				var fontFamily = createSelect('','flexFontFamily',possibleFonts)
					.change(function() {
						if ($(this).val() == '- Google font -') {
							createMultiSelect('Enter Google font name','googleFont',[],true,true,function(fontName){
								if (!fontName.trim()) return false;
								flex.settings.change('fontFamily',fontName);
								$('<option>', {value: fontName}).text(fontName).prop('selected',true).insertBefore($('#flexFontFamily').children().last());
								return true;
							}).prepend($('<a>',{href: 'https://fonts.google.com', target: '_blank'}).text('Browse Google fonts').css('padding','3px').css('display','block'));
							$(this).find('>option[value="'+flex.settings.local.fontFamily+'"]').first().prop('selected',true);
						} else {
							flex.settings.change('fontFamily',$(this).val());
						}
					});
				fontFamily.find('>option[value="'+flex.settings.local.fontFamily+'"]').first().prop('selected',true);
				addRow(tableLayoutSettings,'fontFamily',fontFamily);
				var columnlayout = createSelect('','flexMultiColumnLayout',['single','dual','custom']).change(function() {flex.settings.change('multiColumnLayout',$(this).val())});
				columnlayout.find('>option[value="'+flex.settings.local.multiColumnLayout+'"]').first().prop('selected',true);
				addRow(tableLayoutSettings,'multiColumnLayout',columnlayout);
				addRow(tableLayoutSettings,'hiddenGroups',
						$('<a>',{ id: 'hiddenGroups'})
							.click(function() {
								if (flex.hiddenGroups.length)
									createMultiSelect('Restore hidden groups','flexHiddenGroups',flex.hiddenGroups,false,false,
										function(groups) {
											if (groups) {
												groups = groups.split(',');
												for (var ii=0;ii<groups.length;ii++)
													flex.hiddenGroups = flex.hiddenGroups.filter(group => group != groups[ii]);
												
												if (flex.hiddenGroups.length)
													flex.cmd('attr '+flex.webName+' hiddengroup '+flex.hiddenGroups.join());
												else
													flex.cmd('deleteattr '+flex.webName+' hiddengroup');
											} 
											return true;
										});
							})
							.html('restore'));
				createSettings(tableLayoutSettings,["showFirstColBold","hideWebcmdOnSmallScreen","enableRoundedEdges","enableTableShadow","enableLogLineWrap","plotMinWidth","plotMaxWidth"]);
				
				/********************
					Other settings
				********************/
				var tableOtherSettings = createTable('Settings other','flexOtherSettings');
				createSettings(tableOtherSettings,["enableAnimations","improvePerformance","enableCodeMirror","enableExperimental"]);
				addRow(tableOtherSettings,'Additional CSS',
					$('<a>',{ id: 'additionalCss', style: "cursor: pointer;"})
						.click(function() {flex.settings.additionalCss();})
						.text('edit'));
						
				/********************
			    Experimental settings
				********************/
				var tableBetaSettings = createTable('enableExperimental','flexBetaSettings');
				addRow(tableBetaSettings,'WARNING');
				createSettings(tableBetaSettings,["scalePage","enableTableBehaviour"]);
				tableBetaSettings.closest('.group').css('display',flex.settings.local.enableExperimental?'':'none');
				tableBetaSettings.parent().toggleClass('hidden',!flex.settings.local.enableExperimental);
							
				/********************
				     Room settings
				********************/
				/*if (!$('#flexRoomSettings').length)
					$('<div class="flexSettings fileList">Flex room settings</div><table id="flexRoomSettings" class="block wide fileList"><tbody></tbody></table><br>').insertBefore($('.fileList.styles'));
				else
					$('#flexRoomSettings > tbody').empty();
				var tableRooms = $('#flexRoomSettings > tbody');
				
				flex.groupnames = {};
				var roomlist = $('<select>',{ id: 'flexRoomSelect' });//.change(function() {flex.colorPreset.apply($(this).val())});
				$('<option>').text('-- select room --').prop('disabled',true).prop('selected',true).appendTo(roomlist);
				$('#menu .room a[href*="room="]').each(function() { 
					var roomname = decodeURIComponent($(this).attr('href').replace(/.*room=/,''));
					$('<option>', {value: roomname}).text(roomname).appendTo(roomlist);
				});
				addRow(tableRooms,'Room','',roomlist);*/
				
				
				/********************
					Color settings
				********************/
				var tableColors = createTable('Settings color','flexColorSettings');
								
				// daytime color settings
				if (flex.settings.local.enableDayTimeStyle) {
					createSettings(tableColors,["enableDayTimeStyle"]);
					var daypresets = createPresetSelect('','flexDayStylePresets',flex.settings.local.dayStyle).change(function() {flex.settings.change('dayStyle',$(this).val())});
					//daypresets.find('>option[value="'+flex.settings.local.dayStyle+'"]').first().prop('selected',true);
					addRow(tableColors,'dayStyle',daypresets);
					var nightpresets = createPresetSelect('','flexNightStylePresets',flex.settings.local.nightStyle).change(function() {flex.settings.change('nightStyle',$(this).val())});
					//nightpresets.find('>option[value="'+flex.settings.local.nightStyle+'"]').first().prop('selected',true);
					addRow(tableColors,'nightStyle',nightpresets);
				} 
				// normol color settings
				else {
					var presets = createPresetSelect('','flexStylePresets',flex.settings.local.currentStyle).change(function() {flex.colorPreset.apply($(this).val())});
					//presets.children().first().prop('selected',true);
					addRow(tableColors,'Presets',presets, 
						$('<a>',{ id: 'savePreset', style: "cursor: pointer;", title: "save preset"})
							.click(function() {
								createMultiSelect('Save Preset','flexSavePreset',Object.keys(flex.settings.global.flex.colorPreset),true,true,flex.colorPreset.save);
							})
							.html(flex.content.icons.fhem_save), 
						$('<a>',{ id: 'deletePreset', style: "cursor: pointer;", title: "delete preset"})
							.click(function() {
								if (Object.keys(flex.settings.global.flex.colorPreset).length)
									createMultiSelect('Delete Presets','flexDeletePreset',Object.keys(flex.settings.global.flex.colorPreset),false,false,flex.colorPreset.delete);
							})
							.html(flex.content.icons.message_garbage), 
						$('<a>',{ id: 'exportPreset', style: "cursor: pointer;", title: "export preset"})
							.click(function() {flex.colorPreset.export();})
							.html(flex.content.icons.export), 
						$('<a>',{ id: 'importPreset', style: "cursor: pointer;", title: "import preset"})
							.click(function() {flex.colorPreset.import();})
							.html(flex.content.icons.import));
					createSettings(tableColors,["enableDayTimeStyle"]);
					addRow(tableColors,'Color options',
						$('<a>',{ id: 'simpleColors', style: "cursor: pointer;"})
							.click(function() {flex.settings.change('colorOptionsDetailed',false);})
							.text('simple'), 
						$('<a>',{ id: 'detailedColors', style: "cursor: pointer;"})
							.click(function() {flex.settings.change('colorOptionsDetailed',true);})
							.text('detailed'));
					// color pickers
					if (flex.settings.local.colorOptionsDetailed)
						for (desc in flex.settings.local.color)
							createColorPicker(tableColors,desc);
					else {
						flex.colorPreset.setSimpleColors();
						for (desc in flex.colorPreset.simple)
							createColorPicker(tableColors,desc);
					}
				}
				
				// clear "NEW" indicators
				if (Object.keys(flex.settings.local.newSettings).length) {
					flex.settings.local.newSettings = {};
					flex.settings.save(true);
				}
					
				flex.content.check();
			}
		},
		getCSS: function() {
			var css = '';
			// required to style selects in Safari
			if (flex.browser.isSafari)
				css = css + 'select {-moz-appearance: none; -webkit-appearance: none; appearance: none; }';
			
			css = css + 'body > :not(script) { display:initial; }';
			
			//FontList
			$('head > #flexFont').remove();
			if (!flex.settings.defaultFonts.includes(flex.settings.local.fontFamily))
				$('<link id="flexFont" href="https://fonts.googleapis.com/css?family='+flex.settings.local.fontFamily+'" rel="stylesheet">').appendTo($('head'));
			css = css + '* {font-family: "'+flex.settings.local.fontFamily+'", "Lato", sans-serif;}';
			
			//zoom
			css = css + 'body { zoom: '+flex.settings.local.scalePage*100+'%;}';
			css = css + '.CodeMirror { zoom: '+1/flex.settings.local.scalePage*100+'%;}';
			//header
			css = css + '#hdr, #hdr input { background: '+flex.settings.local.color.HeaderBG+'; }';
			css = css + '#hdr svg { fill: '+flex.settings.local.color.HeaderIcon+'; }';
			css = css + '#hdr { border-bottom: 1px solid '+flex.settings.local.color.HeaderBorder+'; }';
			css = css + '#hdr #cmdInput input, #hdr #cmdInput input::placeholder { color: '+flex.settings.local.color.HeaderText+'; }';
			//menu
			if (flex.settings.local.showRoomIconsRight)
				css = css + '#menu a > .icon { float: right; margin-right: 0;}';
			css = css + '#menuScrollArea { background-color: '+flex.settings.local.color.MenuBG+';}';
			css = css + '#menuIcons { background-color: '+flex.settings.local.color.MenuIconBG+';}';
			css = css + '#menuIcons { border-bottom: 1px solid '+flex.settings.local.color.MenuBorder+';}';
			css = css + '#menuScrollArea {border-right: 1px solid '+flex.settings.local.color.MenuBorder+';}';
			css = css + '#menu > table > tbody > tr:nth-child(n+2) .room { border-top: 1px solid '+flex.settings.local.color.MenuBorder+';}';
			css = css + '#menu, #menu a { color: '+flex.settings.local.color.MenuText+'; }';
			css = css + ".menuTree.closed > td > div > div { background-image: url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 1792 1792\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\""+encodeURIComponent(flex.settings.local.color.MenuText)+"\" d=\"M1171 960q0 13-10 23l-466 466q-10 10-23 10t-23-10l-50-50q-10-10-10-23t10-23l393-393-393-393q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l466 466q10 10 10 23z\"/></svg>')!important; } .menuTree.open > td > div > div {	background-image: url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 1792 1792\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\""+encodeURIComponent(flex.settings.local.color.MenuText)+"\" d=\"M1171 960q0 13-10 23l-466 466q-10 10-23 10t-23-10l-50-50q-10-10-10-23t10-23l393-393-393-393q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l466 466q10 10 10 23z\" transform=\"rotate(90,896,896)\"/></svg>')!important;}";
			css = css + '#menu svg { fill: '+flex.settings.local.color.MenuRoomIcon+'; }';
			css = css + '#menuIcons svg, #menuIcons svg path, #menuIcons .closebtn { fill: '+flex.settings.local.color.MenuIcon+'; color: '+flex.settings.local.color.MenuIcon+'; }';
			css = css + '#menu a:hover, #menu .sel a, #menu a:hover svg, #menu a:hover svg path, #menu .sel svg, #menu .sel svg path{ color: '+flex.settings.local.color.MenuHoverLink+'; fill: '+flex.settings.local.color.MenuHoverLink+'; }'
			//dashboard
			css = css + '.dashboard_tab.ui-state-default.ui-state-active {background-color: '+flex.settings.local.color.TableHeaderText+'!important; }';
			css = css + '.dashboard_tab.ui-state-default.ui-state-active a, .dashboard_tab.ui-state-default:not(.ui-state-active) a:hover {color: '+flex.settings.local.color.TableHeaderBG+'!important;}';
			css = css + '.dashboard_tab.ui-state-default:not(.ui-state-active) {background-color: '+flex.settings.local.color.TableHeaderBG+'!important; }';
			css = css + '.dashboard_tab.ui-state-default:not(.ui-state-active) a, .dashboard_tab.ui-state-default:not(.ui-state-active) a:hover {color: '+flex.settings.local.color.TableHeaderText+'!important;}';
			//main content
			css = css + 'body, input {background-color: '+flex.settings.local.color.MainBG+';}';
			css = css + '#content .group .groupHeader, .ui-dialog-titlebar, .ui-widget-header { background: '+flex.settings.local.color.TableHeaderBG+'; }'
			css = css + '#content .group .groupHeader, #content .group .groupHeader a, #content .group .groupHeader a:hover, .ui-dialog-title,.ui-widget-header,.ui-widget-header a, .ui-widget-header a:hover { color: '+flex.settings.local.color.TableHeaderText+'; }';
			css = css + '#content .group .groupContent, .SVGlabel[data-name=svgZoomControl], #fwmenu, .ui-dialog, #ZWDongleNrSVG:not(:empty) { border: 1px solid '+flex.settings.local.color.TableBorder+'; }';
			//css = css + '#content .block .devType, #content .block .makeTable > span:first-child, #content .block div.fileList { border-bottom: 1px solid '+flex.settings.local.color.TableBorder+'; }';
			css = css + '.group .groupHeader, .group .groupContent, .makeSelect[cmd=set], .makeSelect[cmd=get], .makeSelect[cmd=attr], #devSpecHelp, div.detLink, #rawDef, .ui-widget-content, #content .deviceWrapHelper.edit:empty, #content iframe, .ui-widget-header, #dashboard .dashboard_widget, #content > :not(.roomoverview) .block { border: 1px solid '+flex.settings.local.color.TableBorder+'; }';
			css = css + '.odd, .odd select, .odd input, .internals > tbody > tr:not(.odd):not(.even), textarea, #devSpecHelp, .SVGlabel[data-name=svgZoomControl], #fwmenu, .ui-widget input, .ui-widget select, .ui-widget, .ui-widget-content, div.detLink, #rawDef, .odd textarea, #sliderValueHelper, #ZWDongleNrSVG:not(:empty), #content .deviceWrapHelper.edit:empty { background: '+flex.settings.local.color.TableOdd+'; }';
			css = css + '.even, .even select, .even input, .event textarea { background: '+flex.settings.local.color.TableEven+'; }';
			css = css + '#content, #fwmenu, .ui-widget select, .ui-widget input, textarea, .odd select, .even select, .odd input, .even input, .makeSelect select, .makeSelect input, .ui-widget-content, #content .block .devType, #content .block .makeTable > span:first-child, #content .block div.fileList, #sliderValueHelper { color: '+flex.settings.local.color.TableText+'; }';
			css = css + '#content a, .SVGlabel:not([data-name=svgZoomControl]) a:after, .ui-widget-content a, body.commandref #right a, #devSpecHelp a, #content .block .devType a, #content .block .devType a:hover { color: '+flex.settings.local.color.TableLink+'; fill: '+flex.settings.local.color.TableLink+'; }';
			css = css + '#content .scrollable > table > tbody > tr > td:first-child a, #dashboard .dashboard_content > table > tbody > tr > td:first-child a { color: '+flex.settings.local.color.TableLinkFirstCol+'; fill: '+flex.settings.local.color.TableLinkFirstCol+'; }';
			css = css + '#content a:hover, #content .scrollable > table > tbody > tr > td:first-child a:hover, #dashboard .dashboard_content > table > tbody > tr > td:first-child a:hover, .SVGlabel:not([data-name=svgZoomControl]) a:hover::after, .ui-widget-content a:hover, body.commandref #right a:hover, #devSpecHelp a:hover, .ui-state-hover, .ui-widget-content .ui-state-hover, .ui-widget-header .ui-state-hover, .ui-state-focus, .ui-widget-content .ui-state-focus, .ui-widget-header .ui-state-focus { color: '+flex.settings.local.color.TableHoverLink+'; }';
			css = css + '.changed, .newSetting { color: '+flex.settings.local.color.TableNewEvent+'; }';
			css = css + '#content .icon svg, #content .block svg, .SVGlabel[data-name=svgZoomControl] svg { fill: '+flex.settings.local.color.TableIcon+'; }';
			css = css + '.odd:hover, .odd > td:hover, .even:hover, .even > td:hover { background: '+flex.settings.local.color.TableHoverRow+'; }';
			if (!flex.settings.local.showFirstColBold)
				css = css + '.odd > td:nth-child(1):not(.containsTable), .even > td:nth-child(1):not(.containsTable) { font-weight: normal; }';
			// GET/SET/ATTR
			css = css + '.makeSelect select, .makeSelect select option, .makeSelect input, .makeSelect[cmd=set], .makeSelect[cmd=get], .makeSelect[cmd=attr] { background-color: '+flex.settings.local.color.SetGetAttrBG+'; }';
			// Submit-Button
			css = css + 'input[type=submit],input[type=button],#addRegexpPart,#eventReset, button.ui-button, button { color: '+flex.settings.local.color.SubmitButtonText+'; background:'+flex.settings.local.color.SubmitButtonBG+'; border: 1px solid '+flex.settings.local.color.SubmitButtonBorder+';}';
			css = css + '.ui-dialog button.ui-button, .ui-dialog button { color: '+flex.settings.local.color.SubmitButtonText+'!important; background:'+flex.settings.local.color.SubmitButtonBG+'!important; border: 1px solid '+flex.settings.local.color.SubmitButtonBorder+'!important;}';
			// Widgets
			css = css + '.handle, input, select { color: '+flex.settings.local.color.WidgetText+'; }';
			css = css + '.handle, .slider, input, select, textarea, a#eventFilter, #content .handle:before, #sliderValueHelper { border: 1px solid '+flex.settings.local.color.WidgetBorder+'; }';
			css = css + '.colorpicker_widget[informid]:not([title]):not([tabindex]):not(.colorpicker) { border: 1px solid '+flex.settings.local.color.WidgetBorder+'!important; }';
			css = css + 'input:focus, select:focus, textarea:focus, button:focus { outline: none; box-shadow: 0 0 0 2px '+flex.settings.local.color.WidgetBorder+'; }';
			// slider handel
			css = css + '#content .handle { box-shadow: inset 0px 0px 0px 0.3em '+flex.settings.local.color.WidgetHighlight+'; }'
			css = css + '#sliderValueHelper:after { border-color: '+flex.settings.local.color.WidgetHighlight+' transparent transparent transparent; }';
			// ZW SVG
			css = css + 'svg.zw_nr line.col_link { stroke: '+flex.settings.local.color.WidgetHighlight+'; }';
			css = css + 'svg.zw_nr .zwArrowHead { fill: '+flex.settings.local.color.WidgetHighlight+'; }';
			css = css + 'svg.zw_nr rect.zwBox { stroke: '+flex.settings.local.color.TableBorder+'; }';
			// checkbox
			css = css + 'input[type="checkbox"],input[type="radio"] {background-color: '+flex.settings.local.color.TableOdd+';}';
			css = css + 'input[type="checkbox"]:checked, input[type="radio"]:checked {box-shadow: inset 0px 0px 0px 2px '+flex.settings.local.color.TableOdd+'; background-color: '+flex.settings.local.color.WidgetHighlight+';}';
			// Log / Eventmonitor
			if (!flex.settings.local.enableLogLineWrap)
				css = css + '#content > pre.log > span, #content div#console > span {white-space: nowrap!important;}';
			css = css + '#content > pre > span > span.date, #content div#console > span > span.date { color: '+flex.settings.local.color.LogDate+'; }';
			css = css + '#content > pre > span > span.time, #content div#console > span > span.time { color: '+flex.settings.local.color.LogTime+'; }';
			css = css + '#content > pre > span > span.verbose0, #content div#console > span > span.verbose0 { color: '+flex.settings.local.color.LogVerbose0+'; }';
			css = css + '#content > pre > span > span.verbose1, #content div#console > span > span.verbose1 { color: '+flex.settings.local.color.LogVerbose1+'; }';
			css = css + '#content > pre > span > span.verbose2, #content div#console > span > span.verbose2 { color: '+flex.settings.local.color.LogVerbose2+'; }';
			css = css + '#content > pre > span > span.verbose3, #content div#console > span > span.verbose3 { color: '+flex.settings.local.color.LogVerbose3+'; }';
			css = css + '#content > pre > span > span.verbose4, #content div#console > span > span.verbose4 { color: '+flex.settings.local.color.LogVerbose4+'; }';
			css = css + '#content > pre > span > span.verbose5, #content div#console > span > span.verbose5 { color: '+flex.settings.local.color.LogVerbose5+'; }';
			// border radius
			if (flex.settings.local.enableRoundedEdges) {
				css = css + '.group .groupHeader{ border-top-left-radius: 7px; border-top-right-radius: 7px; }';
				css = css + '.group .groupContent { border-top-right-radius: 7px; border-bottom-right-radius: 7px; border-bottom-left-radius: 7px; }';
				css = css + '.scrollable > table > tbody > tr:first-child > td.containsTable { border-top-right-radius: 6px!important; }';
				css = css + '.scrollable > table > tbody > tr:last-child > td.containsTable { border-bottom-right-radius: 6px!important; border-bottom-left-radius: 6px!important; }';
				//css = css + '#dashboard .dashboard_content { border-bottom-right-radius: 7px; border-bottom-left-radius: 7px; }';
				css = css + '.makeSelect, .detLink, .SVGlabel[data-name=svgZoomControl], #fwmenu, .ui-dialog, .group.other .groupContent, .group .groupHeader.contentHidden, #devSpecHelp, #rawDef, #ZWDongleNrSVG:not(:empty), #content .deviceWrapHelper.edit:empty, #content iframe, .ui-tabs-nav, #dashboard .dashboard_widget, #content > :not(.roomoverview) .block { border-radius: 7px!important; }';
				css = css + '.group .groupContent .scrollable { border-top-right-radius: 6px; border-bottom-right-radius: 6px; border-bottom-left-radius: 6px; }';
				css = css + '#content > :not(.roomoverview) .block tr:first-child td:first-child { border-top-left-radius: 6px; }';
				css = css + '#content > :not(.roomoverview) .block tr:first-child td:last-child { border-top-right-radius: 6px; }';
				css = css + '#content > :not(.roomoverview) .block tr:last-child td:first-child { border-bottom-left-radius: 6px; }';
				css = css + '#content > :not(.roomoverview) .block tr:last-child td:last-child { border-bottom-right-radius: 6px; }';
				css = css + '.group.other .groupContent .scrollable { border-radius: 6px!important; }';
				css = css + '.slider, .slider .handle, input, select, button, .ui-button, .ui-button, textarea, #eventFilter, .dashboard_tab, .dashboard-button { border-radius: 3px!important; }';
			}
			
			//
			if (flex.settings.local.hideWebcmdOnSmallScreen) {
				css = css + '@media all and (max-width: 500px) {.roomoverview .odd > td:nth-child(n+3), .roomoverview .even > td:nth-child(n+3) {display:none!important;}}';
				css = css + '@media all and (max-width: 900px) {.roomoverview .odd > td.wrapped:nth-child(n+3), .roomoverview .even > td.wrapped:nth-child(n+3) {display:none!important;}}';
			}
			
			if (flex.settings.local.enableTableShadow) {
				var rgb = flex.helper.hexToRGB(flex.settings.local.color.TableShadow);
				css = css + '.makeSelect,.detLink,table.group { box-shadow: 0px 12px 10px -8px rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+',0.4); } table.group { margin-bottom: 15px !important; }';
			}
			
			return css;
		},
		getPlotColors: function() {
			/**** CSS ****/
			var css = '';
			//general
			css = css + 'text.legend { cursor:pointer; } text.copy, text.paste { text-decoration:underline; stroke:none; cursor:pointer;} path.SVGplot, rect.SVGplot, polyline.SVGplot { stroke:black; fill:none; } .SVGplot.l0fill { fill:url(#gr_0); } .SVGplot.l1fill { fill:url(#gr_1); } .SVGplot.l2fill { fill:url(#gr_2); } .SVGplot.l3fill { fill:url(#gr_3); } .SVGplot.l4fill { fill:url(#gr_4); } .SVGplot.l5fill { fill:url(#gr_5); } .SVGplot.l6fill { fill:url(#gr_6); } .SVGplot.l7fill { fill:url(#gr_7); } .SVGplot.l8fill { fill:url(#gr_8); } .SVGplot.l0dot, .SVGplot.l1dot, .SVGplot.l2dot, .SVGplot.l3dot, .SVGplot.l4dot, .SVGplot.l5dot, .SVGplot.l6dot, .SVGplot.l7dot, .SVGplot.l8dot  { stroke-dasharray:2,4; } .SVGplot.l0fill_stripe { fill:url(#gr0_stripe);} .SVGplot.l1fill_stripe { fill:url(#gr1_stripe);} .SVGplot.l2fill_stripe { fill:url(#gr2_stripe);} .SVGplot.l3fill_stripe { fill:url(#gr3_stripe);} .SVGplot.l4fill_stripe { fill:url(#gr4_stripe);} .SVGplot.l5fill_stripe { fill:url(#gr5_stripe);} .SVGplot.l6fill_stripe { fill:url(#gr6_stripe);} .SVGplot.l7fill_stripe { fill:url(#gr7_stripe);} .SVGplot.l8fill_stripe { fill:url(#gr8_stripe);} .SVGplot.l0fill_gyr    { fill:url(#gr0_gyr);} .SVGplot.l1fill_gyr { fill:url(#gr1_gyr);} .SVGplot.l2fill_gyr { fill:url(#gr2_gyr);} .SVGplot.l3fill_gyr { fill:url(#gr3_gyr);} .SVGplot.l4fill_gyr { fill:url(#gr4_gyr);} .SVGplot.l5fill_gyr { fill:url(#gr5_gyr);} .SVGplot.l6fill_gyr { fill:url(#gr6_gyr);} .SVGplot.l7fill_gyr { fill:url(#gr7_gyr);} .SVGplot.l8fill_gyr { fill:url(#gr8_gyr);} text.SVGplot.l0, text.SVGplot.l1, text.SVGplot.l2, text.SVGplot.l3, text.SVGplot.l4, text.SVGplot.l5, text.SVGplot.l6, text.SVGplot.l7, text.SVGplot.l8, text.SVGplot.l0fill, text.SVGplot.l1fill, text.SVGplot.l2fill, text.SVGplot.l3fill, text.SVGplot.l4fill, text.SVGplot.l5fill, text.SVGplot.l6fill, text.SVGplot.l7fill, text.SVGplot.l8fill, text.SVGplot.l0dot, text.SVGplot.l1dot, text.SVGplot.l2dot, text.SVGplot.l3dot, text.SVGplot.l4dot, text.SVGplot.l5dot, text.SVGplot.l6dot, text.SVGplot.l7dot, text.SVGplot.l8dot, text.SVGplot.l0fill_stripe, text.SVGplot.l1fill_stripe, text.SVGplot.l2fill_stripe, text.SVGplot.l3fill_stripe, text.SVGplot.l4fill_stripe, text.SVGplot.l5fill_stripe, text.SVGplot.l6fill_stripe, text.SVGplot.l7fill_stripe, text.SVGplot.l8fill_stripe, text.SVGplot.l0fill_gyr, text.SVGplot.l1fill_gyr, text.SVGplot.l2fill_gyr, text.SVGplot.l3fill_gyr, text.SVGplot.l4fill_gyr, text.SVGplot.l5fill_gyr, text.SVGplot.l6fill_gyr, text.SVGplot.l7fill_gyr, text.SVGplot.l8fill_gyr { stroke:none; }';
			//background and border
			css = css + '.background, .border { fill:url(#gr_bg); }';
			css = css + '.border  { stroke: '+flex.settings.local.color.plotBorder+'; }';
			//text (title and axes)
			css = css + 'text {font-family: "'+flex.settings.local.fontFamily+'", "Lato", sans-serif; font-weight: normal; font-size:0.8em; stroke:none!important;}';
			css = css + 'text.title, text.ylabel, text.y2label { fill:'+flex.settings.local.color.plotText+'!important; }';
			css = css + 'text.ylabel[transform], text.y2label[transform] { font-size: 0.9em}';
			css = css + 'g > text.ylabel, g > text.y2label { font-size: 0.8em}';
			css = css + 'text.title { font-weight: bold; font-size:1em; }';
			css = css + 'text.legend { font-size: 0.8em; cursor:pointer; }';
			//marker
			css = css + 'circle#svgmarker { fill:'+flex.settings.local.color.plotMarker+'; opacity:0.5; }';
			css = css + 'div#svgmarker { color:'+flex.settings.local.color.plotMarker+'; position: absolute; }';
			//grid
			css = css + '.vgrid, .hgrid { stroke:'+flex.settings.local.color.plotGrid+'; stroke-dasharray:2,6; }';
			//lines
			css = css + '.pasted  { stroke:'+flex.settings.local.color.plotLinePasted+'; stroke-dasharray:1,1; }';
			css = css + '.SVGplot.l0,.SVGplot.l0fill,.SVGplot.l0dot,.SVGplot.l0fill_stripe,.SVGplot.l0fill_gyr { stroke:'+flex.settings.local.color.plotLine0+'; }';
			css = css + '.SVGplot.l1,.SVGplot.l1fill,.SVGplot.l1dot,.SVGplot.l1fill_stripe,.SVGplot.l1fill_gyr { stroke:'+flex.settings.local.color.plotLine1+'; }';
			css = css + '.SVGplot.l2,.SVGplot.l2fill,.SVGplot.l2dot,.SVGplot.l2fill_stripe,.SVGplot.l2fill_gyr { stroke:'+flex.settings.local.color.plotLine2+'; }';
			css = css + '.SVGplot.l3,.SVGplot.l3fill,.SVGplot.l3dot,.SVGplot.l3fill_stripe,.SVGplot.l3fill_gyr { stroke:'+flex.settings.local.color.plotLine3+'; }';
			css = css + '.SVGplot.l4,.SVGplot.l4fill,.SVGplot.l4dot,.SVGplot.l4fill_stripe,.SVGplot.l4fill_gyr { stroke:'+flex.settings.local.color.plotLine4+'; }';
			css = css + '.SVGplot.l5,.SVGplot.l5fill,.SVGplot.l5dot,.SVGplot.l5fill_stripe,.SVGplot.l5fill_gyr { stroke:'+flex.settings.local.color.plotLine5+'; }';
			css = css + '.SVGplot.l6,.SVGplot.l6fill,.SVGplot.l6dot,.SVGplot.l6fill_stripe,.SVGplot.l6fill_gyr { stroke:'+flex.settings.local.color.plotLine6+'; }';
			css = css + '.SVGplot.l7,.SVGplot.l7fill,.SVGplot.l7dot,.SVGplot.l7fill_stripe,.SVGplot.l7fill_gyr { stroke:'+flex.settings.local.color.plotLine7+'; }';
			css = css + '.SVGplot.l8,.SVGplot.l8fill,.SVGplot.l8dot,.SVGplot.l8fill_stripe,.SVGplot.l8fill_gyr { stroke:'+flex.settings.local.color.plotLine8+'; }';
			css = css + '.SVGplot.l0dot,.SVGplot.l1dot,.SVGplot.l2dot,.SVGplot.l3dot,.SVGplot.l4dot,.SVGplot.l5dot,.SVGplot.l6dot,.SVGplot.l7dot,.SVGplot.l8dot {stroke-dasharray:2,4;}';
			css = css + 'path.SVGplot, rect.SVGplot, polyline.SVGplot { stroke:black; fill:none; }';
			// text
			css = css + 'text.SVGplot.l0,text.SVGplot.l0fill,text.SVGplot.l0fill_stripe,text.SVGplot.l0dot,text.SVGplot.l0fill_gyr { fill:'+flex.settings.local.color.plotLine0+'; }';
			css = css + 'text.SVGplot.l1,text.SVGplot.l1fill,text.SVGplot.l1fill_stripe,text.SVGplot.l1dot,text.SVGplot.l1fill_gyr { fill:'+flex.settings.local.color.plotLine1+'; }';
			css = css + 'text.SVGplot.l2,text.SVGplot.l2fill,text.SVGplot.l2fill_stripe,text.SVGplot.l2dot,text.SVGplot.l2fill_gyr { fill:'+flex.settings.local.color.plotLine2+'; }';
			css = css + 'text.SVGplot.l3,text.SVGplot.l3fill,text.SVGplot.l3fill_stripe,text.SVGplot.l3dot,text.SVGplot.l3fill_gyr { fill:'+flex.settings.local.color.plotLine3+'; }';
			css = css + 'text.SVGplot.l4,text.SVGplot.l4fill,text.SVGplot.l4fill_stripe,text.SVGplot.l4dot,text.SVGplot.l4fill_gyr { fill:'+flex.settings.local.color.plotLine4+'; }';
			css = css + 'text.SVGplot.l5,text.SVGplot.l5fill,text.SVGplot.l5fill_stripe,text.SVGplot.l5dot,text.SVGplot.l5fill_gyr { fill:'+flex.settings.local.color.plotLine5+'; }';
			css = css + 'text.SVGplot.l6,text.SVGplot.l6fill,text.SVGplot.l6fill_stripe,text.SVGplot.l6dot,text.SVGplot.l6fill_gyr { fill:'+flex.settings.local.color.plotLine6+'; }';
			css = css + 'text.SVGplot.l7,text.SVGplot.l7fill,text.SVGplot.l7fill_stripe,text.SVGplot.l7dot,text.SVGplot.l7fill_gyr { fill:'+flex.settings.local.color.plotLine7+'; }';
			css = css + 'text.SVGplot.l8,text.SVGplot.l8fill,text.SVGplot.l8fill_stripe,text.SVGplot.l8dot,text.SVGplot.l8fill_gyr { fill:'+flex.settings.local.color.plotLine8+'; }';
			
			var defs = '';
			defs += '<linearGradient id="gr_bg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:'+flex.settings.local.color.plotBGgradient+'; stop-opacity:1"/><stop offset="100%" style="stop-color:'+flex.settings.local.color.plotBG+'; stop-opacity:1"/></linearGradient>';
			for (var ii=0;ii<=8; ii++) {
				defs += '<linearGradient id="gr_'+ii+'" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:'+flex.settings.local.color["plotLine"+ii]+'; stop-opacity:.3"/><stop offset="100%" style="stop-color:'+flex.settings.local.color["plotLine"+ii]+'; stop-opacity:.6"/></linearGradient>';
				defs += '<pattern id="gr'+ii+'_stripe" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(-45 2 2)"><path d="M -1,2 l 6,0" stroke="'+flex.settings.local.color["plotLine"+ii]+'" stroke-width="0.5"/></pattern>';
				defs += '<linearGradient id="gr'+ii+'_gyr" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:'+flex.settings.local.color["plotLine"+ii]+'; stop-opacity:.6"/><stop offset= "50%" style="stop-color:'+flex.helper.shiftColor(flex.settings.local.color["plotLine"+ii],'#050')+'; stop-opacity:.6"/><stop offset="100%" style="stop-color:'+flex.helper.shiftColor(flex.settings.local.color["plotLine"+ii],'#055')+'; stop-opacity:.6"/></linearGradient>';
			}
			return {css: css, defs: defs};
		},
		additionalCss: function() {
			var n = "flexImportAdditionalCss";
			$("body").append(
				'<div id="'+n+'">'+
				'<textarea placeholder="Enter valid CSS code" rows="20" cols="90" style="width:99%; word-break: break-all;";/>'+
				'</div>');
			var ta = $("#"+n+" textarea");
			
			flex.cmd('jsonlist2 '+flex.webName,function(data) {
				if (typeof data.Results[0] !== "object") return;
				var cssattr = data.Results[0].Attributes.Css;
				if (cssattr) ta.val(cssattr);
			});

			$("#"+n).dialog({
				dialogClass:"no-close", modal:true, width:"auto", closeOnEscape:true, 
				title:"Additional CSS",
				maxWidth:$(window).width()*0.9, maxHeight:$(window).height()*0.9,
				buttons: [
				{text:"Save",click:function(){ 
					if (ta.val())
						flex.cmd('attr '+flex.webName+' Css '+ta.val().replace(/;/g,';;'));
					else
						flex.cmd('deleteattr '+flex.webName+' Css');
					$(this).remove();
					FW_errmsg('Additional CSS saved', 2000);
				}},
				{text:"Close", click:function(){ $(this).remove(); }},
				],
				close:function(){ $("#"+n).remove(); }
			});
		}
	}
	
	flex.menu = {
		init: function() {
			flex.menu.refresh();
			flex.menu.sort();
			// check if menu should be shown or hidden
			if(window.matchMedia('(max-width: 900px)').matches || !flex.settings.local.showMenuAlways) flex.menu.hide();
			else flex.menu.show();
			
			$('#contentOverlay').css('display','block');
			
			// rename "Select style"
			$('.menu_Select_style span').text('Style settings');
			if (Object.keys(flex.settings.local.newSettings).length)
				$('.menu_Select_style span').append($('<div class="newSetting">new</div>').css('display','inline'));
			// link commandref to external commandref
			$('#menu a[href*="commandref"]').off("click").attr('href','https://fhem.de/commandref_DE.html');
			// delete space between room icon and room name
			$('#menu a > .icon').parent().contents().filter(function() {return this.nodeType == 3}).each(function(){this.nodeValue = ''});
		},
		show: function() {
			$("#menuScrollArea, #content, #hdr, #contentOverlay").removeClass("hidden");
			if (!$("#menuScrollArea").hasClass('hideAlways') && !window.matchMedia('(max-width: 900px)').matches)
				setTimeout(flex.content.check, 500);
		},
		hide: function() {
			$("#menuScrollArea, #content, #hdr, #contentOverlay").addClass("hidden");
			if (!$("#menuScrollArea").hasClass('hideAlways') && !window.matchMedia('(max-width: 900px)').matches)
				setTimeout(flex.content.check, 500);
		},
		refresh: function() {
			// menu icons will be added to roomBlock1
			var menuIcons = $('#menuIcons');
			if (!menuIcons.length)
				menuIcons = $('<div>',{id: 'menuIcons'}).prependTo($('#menuScrollArea'));
			
			// Logo
			if (!menuIcons.find('#logo').length) {
				$('#logo').parent().appendTo(menuIcons);
				if (!$('#menuIcons #logo').html())
					$('#menuIcons #logo').html(flex.content.icons.fhem_logo).attr('title','Home');
			}
			// restart icon
			if (!menuIcons.children('#iconFhemRestart').length)
				$('<a>',{id: "iconFhemRestart", style: "cursor: pointer;", title: 'restart'})
					.click(function() {flex.cmd('shutdown restart');})
					.html(flex.content.icons.fhem_restart)
					.appendTo(menuIcons);
			// update icon
			if (!menuIcons.children('#iconFhemUpdate').length)
				$('<a>',{id: "iconFhemUpdate", href: flex.fhemPath+'?cmd=update&fwcsrf='+flex.fwcsrf, title: 'update'})
					.html(flex.content.icons.fhem_update)
					.appendTo(menuIcons);
			// update check
			if (!menuIcons.children('#iconFhemUpdateCheck').length)
				$('<a>',{id: "iconFhemUpdateCheck", href: flex.fhemPath+'?cmd=update+check&fwcsrf='+flex.fwcsrf, title: 'update check'})
					.html(flex.content.icons.fhem_update_check)
					.appendTo(menuIcons);
			// reread icons
			if (!menuIcons.children('#iconFhemRereadIcons').length)
				$('<a>',{id: "iconFhemRereadIcons", style: "cursor: pointer;", title: 'reread icons'})
					.click(function() {flex.cmd('set '+flex.webName+' rereadicons');})
					.html(flex.content.icons.reread_icons)
					.appendTo(menuIcons);
			// reload myUtils
			if (!menuIcons.children('#iconFhemReloadMyUtils').length)
				$('<a>',{id: "iconFhemReloadMyUtils", style: "cursor: pointer;", title: 'reload '+flex.settings.local.myUtilsFileName})
					.click(function() {flex.cmd('reload '+flex.settings.local.myUtilsFileName);})
					.html(flex.content.icons.reload_my)
					.appendTo(menuIcons);
			// "close menu" button
			if (!menuIcons.children('.closebtn').length)
				$("<div class='closebtn' title='Close menu'>&times;</div>")
					.click(flex.menu.hide)
					.appendTo(menuIcons);
			
			if ($('.roomBlock1').length==1){
				if ($('.roomBlock1 .menu_Save_config').length==1) {
					// move save icons to #menuIcons
					var menu_Save_config = $('.menu_Save_config')
					menu_Save_config.appendTo(menuIcons);
					$('.roomBlock1').parent().parent().remove();
					// load save icon instead of text "Save config"
					var fhem_save = menu_Save_config.find('a:nth-child(1)');
					fhem_save.html(flex.content.icons.fhem_save)
							 .attr('title', 'save config')
							 .css('display', 'inline-block');
					// load save check icon instead of text "?"
					var fhem_save_check = menu_Save_config.find('a:nth-child(2)');
					fhem_save_check.html(flex.content.icons.fhem_save_check)
								   .attr('title', 'save check')
								   .css('display','inline-block');
				} else {
					$('#menu table.room').each(function(index) {
						$(this).removeClass('roomBlock'+(index+1));
						$(this).addClass('roomBlock'+(index+2));
					});
				}
			}
			
			
			// show icons or not?
			menuIcons.children('#iconFhemRestart')      .css('display',(flex.settings.local.showRebootButton)       ? 'inline-block' : 'none');
			menuIcons.children('#iconFhemUpdate')       .css('display',(flex.settings.local.showUpdateButton)       ? 'inline-block' : 'none');
			menuIcons.children('#iconFhemUpdateCheck')  .css('display',(flex.settings.local.showUpdateCheckButton)  ? 'inline-block' : 'none');
			menuIcons.children('#iconFhemRereadIcons')  .css('display',(flex.settings.local.showRereadIconsButton)  ? 'inline-block' : 'none');
			menuIcons.children('#iconFhemReloadMyUtils').css('display',(flex.settings.local.myUtilsFileName !== '') ? 'inline-block' : 'none');
			menuIcons.children('.menu_Save_config')     .css('display',(flex.settings.local.showSaveButton)         ? 'inline-block' : 'none');
			menuIcons.find('#logo').parent()   			.css('display',(flex.settings.local.showLogoButton)         ? 'inline-block' : 'none');
		},
		makeSortable: function(enable) {
			if (enable) {
				if (!$('.room').last().find('tr').length == 0) {
					$('<tr><td><table class="room roomBlock'+($(".room").length+2)+'"><tbody></tbody></table></td></tr>').appendTo('#menu > table > tbody');
				}
				$('<span>',{style: "display: inline-block; position: absolute; right: 0; padding: 0; padding-right: 5px; width: auto;"})
					.addClass('icon').addClass('icon-move')
					.html(flex.content.icons.draggable)
					.insertAfter($( '.room > tbody > tr a' ));
				
				// hide menu tree indicator
				$('tr.menuTree[data-nxt] div div').css('visibility','hidden');
				$('tr.menuTree.closed').trigger('click');
					
				$('.room a').css('pointer-events','none').css('display','inline-block');
				
				var sortSubrooms = function(father) {
					$('tr[data-mtree="'+father.attr('data-nxt')+'"]').insertAfter(father);
					$('tr[data-mtree="'+father.attr('data-nxt')+'"][data-nxt]').each(function() {
						sortSubrooms($(this));
					});
				}
				
				var isFatherASibling = function(elem,me) {
					if (!elem.length) return false;
					var parent = $('tr[data-nxt="'+elem.attr("data-mtree")+'"]');
					return parent.attr('data-mtree')==me.attr('data-mtree') || isFatherASibling(parent,me);
				}
				
				$( ".room > tbody" ).sortable({
					connectWith: '.room > tbody',
					handle: '.icon.icon-move',
					axis: 'y',
					opacity: 0.8,
					tolerance: "pointer",
					start: function(e,ui) {
						var draggedItem = $(ui.item);
						$('tr.menuTree.closed').trigger('click'); // required, outherwise can't find correct spot after room-group
						if (draggedItem.hasClass('menuTree') && draggedItem.attr('data-nxt') && draggedItem.hasClass('open'))
							draggedItem.trigger('click');
					},
					stop: function(e,ui) {
						$('tr.menuTree.closed').trigger('click');
					},
					update: function(e,ui) {
						var draggedItem = $(ui.item);
						if ((draggedItem.hasClass('menuTree') && !draggedItem.hasClass('level0')
								&& !(draggedItem.attr('data-mtree') == draggedItem.prev().attr('data-nxt') // always after the parent
									|| draggedItem.attr('data-mtree') == draggedItem.next().attr('data-mtree') // always before a sibling
									|| (draggedItem.attr('data-mtree') == draggedItem.prev().attr('data-mtree') && !draggedItem.prev().attr('data-nxt')) // after a sibling which has no childs
									|| isFatherASibling(draggedItem.prev(),draggedItem) && !isFatherASibling(draggedItem.next(),draggedItem))) // after a descendant of a sibling, but not before a descendant of a sibling
							|| (!draggedItem.hasClass('menuTree') && draggedItem.next().attr('data-mtree'))) {
							$( this ).sortable( "cancel" );
							return;
						}
						if (draggedItem.hasClass('menuTree') && draggedItem.attr('data-nxt')) {
							sortSubrooms(draggedItem);
						}
					}
				}).sortable( "enable" ).disableSelection();
				flex.menu.show();
			} else {
				while ($('.room').last().find('tr').length == 0)
					$('.room').last().closest('tr').remove();
				
				flex.settings.global.flex.menuOrder = {};
				$('.room').each(function (){
					flex.settings.global.flex.menuOrder[this.classList[1]] = $('.'+this.classList[1]+' > tbody').sortable('toArray');
					if ($('.'+this.classList[1]).find('tr').length == 0)
						$('.'+this.classList[1]).css('display','none');
				});
				flex.cmd("attr "+flex.webName+" styleData "+JSON.stringify(flex.settings.global, undefined, 1));
				$(".room > tbody").sortable( "disable" );
				$(".room > tbody > tr a + span").remove();
				$(".room a").removeAttr('style');
				$('tr.menuTree[data-nxt] div div').css('visibility','visible');
				$($('tr.menuTree.open').get().reverse()).trigger('click');
				FW_errmsg('Menu order saved', 2000);
			}
		},
		sort: function() {
			$( ".room > tbody > tr" ).each(function(index){
				var id = $(this).find('div')[0].className.replace('menu_','') || $(this).find('span').text().replace(/\s/g,'_') || $(this).find('a[href="#"]').text().replace(/\s/g,'_') ;
				$(this).attr('id',$(this).parent().parent()[0].classList[1] + '_' + id);
			});
			
			//TODO: currently it is required to reorder if a new roomBlock (like Dashboard) was appended to the menu
			if (flex.settings.global.flex.menuOrder) {
				var knownrooms = [];
				for (roomblock in flex.settings.global.flex.menuOrder) {
					knownrooms = knownrooms.concat(flex.settings.global.flex.menuOrder[roomblock]);
					if (!$('.'+roomblock).length) 
						$('<table>').addClass('room').addClass(roomblock).append($('<tbody>')).wrap('<td>').parent().wrap('<tr>').parent().appendTo('#menu > table > tbody');
					$.each(flex.settings.global.flex.menuOrder[roomblock], function (i, e) {
						$('#' + e).appendTo('.'+roomblock+'>tbody');
					});
					$.each(flex.settings.global.flex.menuOrder[roomblock], function (i, e) {
						$('#' + e).insertAfter('.'+roomblock+'>tbody>tr:eq(' + i + ')');
					});
					if ($('.'+roomblock).find('tr').length == 0)
						$('.'+roomblock).css('display','none');
				}
				$('.menuTree:not(.level0)').each(function() {
					if (!knownrooms.includes($(this).attr('id'))) {
						$(this).insertAfter($('.menuTree[data-nxt="'+$(this).attr('data-mtree')+'"],.menuTree[data-mtree="'+$(this).attr('data-mtree')+'"]').last());
						flex.log($(this).attr('id'));
					}
				});
			}
		},
		resetSortOrder: function() {
			flex.settings.global.flex.menuOrder = {};
			flex.cmd("attr "+flex.webName+" styleData "+JSON.stringify(flex.settings.global, undefined, 1),function() {location.reload()});
		}
	}
	
	flex.header = {
		init: function() {
			// raw-input button
			$("<div id='rawBtn'></div>")
				.prependTo($("#hdr form"))
				.html(flex.content.icons.raw_button)
				.click(function(){ f18_textInput() })
				.attr('title', 'Raw FHEM-code input');
				
			// menu button
			$("<div id='menuBtn'></div>")
				.prependTo($("#hdr form"))
				.html(flex.content.icons.menu_button)
				.click(function() {
					if ($('#menuScrollArea').hasClass('hidden')) {
						$(this).attr('title', 'Open menu');
						flex.menu.show();
					} else {
						$(this).attr('title', 'Close menu');
						flex.menu.hide();
					}
				})
				.attr('title', 'Show menu');
			// wrap cmd-input
			$('#hdr input[name=cmd]').wrap("<div id='cmdInput'></div>");
			// enable autocomplete
			if (flex.settings.local.enableDeviceSearch)
				flex.header.enableDeviceSearch();
			if (flex.settings.local.enableCommandHistory)
				flex.header.enableCommandHistory();
			
			flex.header.refreshPlaceholder();
			flex.header.refresh();
		},
		refresh: function() {
			$("#rawBtn").css('display',(flex.settings.local.showRawInputButton) ? 'inline-block' : 'none');
		},
		refreshPlaceholder: function(uselocaltime) {
			// default placeholder text
			var msg = flex.settings.local.title;
			if ($('#errmsg').length == 1)
				msg = $('#errmsg')[0].innerText;
			else if (flex.device && flex.settings.local.showRoomDeviceName)
				msg = flex.device;
			else if (flex.room && flex.settings.local.showRoomDeviceName)
				msg = flex.room;
			if (flex.settings.local.showClock) {
				if ($('#errmsg').length == 1 && msg.match(/connection/i)){
					flex.fhemSyncTime = undefined;
					flex.currentTime = undefined;
				}
				if ((!flex.fhemSyncTime || (flex.currentTime-flex.fhemSyncTime) >= 60) && !msg.match(/connection/i) && !flex.fhemSyncTimeWait) {
					flex.cmd('{time()}',function(data) {
						flex.fhemSyncTime = parseFloat(data); 
						flex.currentTime = flex.fhemSyncTime;
						flex.fhemSyncTimeWait = false;
					});
					flex.fhemSyncTimeWait = true;
				}
				
				// current time
				if (flex.currentTime) {
					flex.currentTime = flex.currentTime + 0.5;
					d = new Date(flex.currentTime*1000);
				} else
					d = new Date();
				nhour = d.getHours();
				nmin = d.getMinutes();
				nsec = d.getSeconds();
				if (nhour <= 9) nhour='0'+nhour;
				if (nmin <= 9) nmin='0'+nmin;
				if (nsec <= 9) nsec='0'+nsec;
				var timestring = nhour + ':' + nmin + ':' + nsec;
				
				if (msg !== '')
					msg = msg+' // '+timestring;
				else
					msg = timestring;
			}
			$('.maininput').attr("placeholder", msg);
			// refresh once a second
			setTimeout(function(){flex.header.refreshPlaceholder();}, 500);
		},
		enableDeviceSearch: function() {
			flex.cmd('list .*',function(data){
				var defs = data.split('\n');
					jQuery.ui.autocomplete.prototype._resizeMenu = function () {
					  var ul = this.menu.element;
					  ul.outerWidth(this.element.outerWidth());
					}
					flex.autocompleteDefs = defs;
					// Modifyed version of Phill/ThoTo
					// https://forum.fhem.de/index.php/topic,82442.0.html
					$("#hdr input[name=cmd]").attr('autocomplete','off').autocomplete({ source: defs, minLength: 3,	autoFocus: false, select: function(event, ui) {
						if (ui.item) location.href = flex.fhemPath+'?detail=' + ui.item.value; }});
			});
		},
		enableCommandHistory: function() {
			// modifyed version of FHEMAN
			// https://forum.fhem.de/index.php?topic=68945.0
			$.widget('ngn.inputHistory', {
				_create: function() {
					var s, _this = this;
					this.h0 = (s = Cookies.get('fhemCmdHistory')) ? s.split('\n') : [];
					this.h = this.h0.concat(['']);
					this.i = this.h0.length;
					return this.element.keydown(function(e) {
						var key = e.which || e.keyCode; // keyCode detection
						var ctrl = e.ctrlKey ? e.ctrlKey : ((key === 17) ? true : false); // ctrl detection
						if (key == 13 && ctrl) return _this.ctrlenter();
						else if (key == 13)    return _this.enter();
						else if (key == 38)    return _this.up();
						else if (key == 40)    return _this.down();
					});
				},
				up: function() {
					if (flex.settings.local.enableDeviceSearch)
						$( "#hdr input[name=cmd]" ).one( "autocompleteopen", function(e) {$(this).autocomplete( "close" )} );
					if (this.i > 0) {
						this.h[this.i--] = this.element.val();
						this.element.val(this.h[this.i]);
					}
					this._trigger('up');
					return false;
				},
				down: function() {
					if (flex.settings.local.enableDeviceSearch)
						$( "#hdr input[name=cmd]" ).one( "autocompleteopen", function(e) {$(this).autocomplete( "close" )} );
					if (this.i < this.h0.length) {
						this.h[this.i++] = this.element.val();
						this.element.val(this.h[this.i]);
					}
					this._trigger('down');
					return false;
				},
				ctrlenter: function() {
					var v;
					v = this.element.val();
					if (v.length > 0 && v[0] != '{') v = '{' + v;
					if (v.length > 0 && v[v.length-1] != '}')  v += '}';
					this.element.val(v);
					this._trigger('enter');
					return false;
				},
				enter: function() {
					var v;
					this._trigger('enter');
					if (this.i < this.h0.length) this.h[this.i] = this.h0[this.i];
					v = this.element.val();
					if (this.i >= 0 && this.i >= this.h0.length - 1 && this.h0[this.h0.length - 1] === v) {
						this.h[this.h0.length] = '';
					} else {
						while (this.h0.length >= 50) {
							this.h.shift();
							this.h0.shift();
						}
						if (!flex.settings.local.enableDeviceSearch || !flex.autocompleteDefs || !flex.autocompleteDefs.find(function(el) { return el.toLowerCase().startsWith(v.toLowerCase()) })) {
							this.h[this.h0.length] = v;
							this.h.push('');
							this.h0.push(v);
							Cookies.set('fhemCmdHistory',this.h0.join('\n'));
						}
					}
					this.i = this.h0.length;
				}
			});
			$('#hdr input.maininput').attr('autocomplete','off').inputHistory();
		}
	}
	
	flex.content = {
		init: function() {
			// make fhem web-app capable
			$('head').append(
				'<meta name="mobile-web-app-capable" content="yes">'+
				'<meta name="apple-mobile-web-app-capable" content="yes">'+
				'<link rel="apple-touch-icon" href="'+flex.fhemPath+'/images/default/fhemicon_ios.png">');
			// determine touch device
			if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))
				$("body").addClass('touch');
			// add content overlay
			$('<div>',{id: 'contentOverlay'}).click(flex.menu.hide).appendTo($('body'));
			
			flex.settings.createHTML();
			flex.content.modifyFileLists();
			flex.content.modifyEditFiles();
			flex.content.modifyDeviceDetails();
			flex.content.modifyGroups();
			flex.content.modifyLogs();
			flex.content.modifyEventMonitor();
			flex.content.modifyPlots();
			flex.content.applyStyleFixes();
			
			
			
			// load codemirror
			if (flex.settings.local.enableCodeMirror)
				loadScript("codemirror/fhem_codemirror.js");
			
			// listen for DOM changes -> check content
			$('.makeSelect select[id]').change(flex.content.check);
			$(window).on('resizeEnd',function(e) {
				flex.content.checkAbort = true;
				flex.content.check();
			});
			$(window).resize(function(e) {
				if(this.resizeTO) clearTimeout(this.resizeTO);
				this.resizeTO = setTimeout(function() {
					$(this).trigger('resizeEnd');
				}, 250);
			});
		},
		initSVGCallback: function() {
			flex.content.plots = [];
			if(typeof svgCallback != "undefined") {
				svgCallback.flex = function(svg) {
					if(!svg || !svg.getAttribute("data-origin")) return;
					flex.content.plots.push(svg);
				}
			}
		},
		modifyEventMonitor: function() {
			if ($("div#console").length) {
				$('#content').contents().slice(0,3).appendTo($('<span>').prependTo('#content'));
				$('#content').contents().filter(function() {return (this.nodeType == 1 && this.nodeName !== 'DIV') || this.nodeType == 3}).appendTo($('<div>',{id: "eventMonitorFiler"}).prependTo('#content'));
				var enableAutoScroll = true;
				var isAutoScroll = false;
				$(window).on('touchmove scroll',function(e){
					if (!isAutoScroll) enableAutoScroll = false;
					isAutoScroll = false;
					var maxScrollTop = $('html')[0].scrollHeight-window.outerHeight;
					if ($(window).scrollTop() > maxScrollTop - 10) {
						enableAutoScroll = true;
					}
				});
				$("div#console").on('DOMNodeInserted', function(e) {
					if (e.target.nodeName == 'BR') {
						$('div#console').contents().filter(function() {return this.nodeType == 3 && !this.nodeValue.match(/^\s*$/)}).wrap('<span>').parent().each(function() {
							$(this).html($(this).html()
								.replace(/(&nbsp;|[\r+\n])/gi,' ').replace(/^\s*/g,'')
								.replace(/^\d{4}[-\.](1[012]|0?[1-9])[-\.](3[01]|[12][0-9]|0?[1-9])/g, "<span class=\"date\">$&</span>")
								.replace(/(span>\s*)(\d{2}:\d{2}:\d{2})(\.\d{3})?/g, "$1<span class=\"time\">$2$3</span>"));
						});
						//$(e.target).remove();
						if (enableAutoScroll) {
							isAutoScroll = true;
							$(window).scrollTop($('html')[0].scrollHeight);
						}
					} else if (e.target.nodeName == 'DIV' && e.target.className == 'fhemlog') {
						$('<br>').insertAfter($(e.target));
						$(e.target).replaceWith($('<span>').html($(e.target).text()
							.replace(/^\d{4}[-\.](1[012]|0?[1-9])[-\.](3[01]|[12][0-9]|0?[1-9])/g, "<span class=\"date\">$&</span>")
							.replace(/(span>\s*)(\d{2}:\d{2}:\d{2})(\.\d{3})?/g, "$1<span class=\"time\">$2$3</span>")
							.replace(/(span>\s*)([0-5])\s?:/g, "$1<span class=\"verbose$2\">$2:</span> ")));
					} else {
						$('div#console').contents().filter(function() {return this.nodeType == 3 && this.nodeValue == '[""]\n'}).each(function() {this.nodeValue = ''});
					}
				});
			}
		},
		modifyLogs: function() {
			if ($('#content > pre').length) {
				if (($('#content > pre').text().match(/\n/g) || []).length <= 5000) {
					$('#content > pre').html($('#content > pre').html().replace(/\r?\n/g,'<br/>')).contents().filter(function() {return this.nodeType == 3 && !this.nodeValue.match(/^\s*$/)}).wrap('<span>');
					//$('#content > pre > br').remove();
					$('#content > pre > span').each(function() {
						$(this).html($(this).text()
								.replace(/^\d{4}[-\.](1[012]|0?[1-9])[-\.](3[01]|[12][0-9]|0?[1-9])/, "<span class=\"date\">$&</span>")
								.replace(/(span>\s*)(\d{2}:\d{2}:\d{2})(\.\d{3})?/, "$1<span class=\"time\">$2$3</span>")
								.replace(/(span>\s*)([0-5])\s?:/, "$1<span class=\"verbose$2\">$2:</span> "));
					});
				}
			}
		},
		modifyFileLists: function() {
			// file lists / styles
			if ($('div.fileList').length) {
				var wrapper = $('<div>').addClass('deviceWrapHelper').appendTo($('div.fileList').parent());
				$('div.fileList').each(function() {
					$(this).addClass('groupHeader');
					$(this).wrap('<table class="group fileGroup"><tbody><tr><td></td></tr></tbody></table>');
					if ($(this).closest('table').next().hasClass('hidden'))
						$(this).closest('table').css('display','none');
					$(this).closest('table').next().wrap('<tr><td><div class="groupContent"><div class="scrollable"></div></div></td></tr>').closest('tr').appendTo($(this).closest('table').find('>tbody'));
					$(this).closest('table').appendTo(wrapper);
				});
				
				if ($('.fileList.styles.groupHeader').length)
					flex.content.makeGroupsCollapsable($('.fileList.styles.groupHeader').text(flex.settings.description[flex.language]['Other styles'][0]).closest('.group'));
			}
		},
		modifyEditFiles: function() {
			if (flex.helper.urlParam('cmd') && flex.helper.urlParam('cmd').startsWith('style edit') && $('input.saveName').length) {
				$('#content').addClass('editFiles');
				$('input[name=save],input[name=saveAs],input[name=saveName]').appendTo($('<div>',{id: 'editFilesHeader'}).appendTo('#content > form'));
				$('textarea[name=data]').removeAttr('cols').removeAttr('rows').appendTo($('<div>',{id: 'editFilesData'}).appendTo('#content > form'));
				$('#content > form > br').remove();
				$('#content > form').contents().filter(function() {return this.nodeType == 3}).remove();
			}
		},
		makeGroupsCollapsable: function(groups) {
			$(groups).each(function () {
				$(this).find('.groupHeader').css('cursor','pointer').on('click',function(){
						var content = $(this).closest('tr').next().find('> td > .groupContent');
						content.css('display',(content.css('display') == 'none') ? 'table':'none');
						$(this).toggleClass('contentHidden',(content.css('display') == 'none'));
				});
				if (!$(this).find('.groupContent > .scrollable > table').hasClass('open'))
					$(this).find('.groupHeader').trigger('click');
			});
		},
		modifyDeviceDetails: function() {
			// device details
			if (flex.device) {
				$('.col3').contents().filter(function() {return this.nodeType == 3 && !this.nodeValue.match(/^\s*$/)}).wrap('<div class="webCmdLabel">');
				
				$('#content > table:first-child > tbody > tr > td').contents().filter(function() {return this.nodeType == 3 && !this.nodeValue.match(/^\W*$/)}).wrap('<span>');
				$('table.assoc').parent().addClass('assoc');
				var wrapper = $('<div>').addClass('deviceWrapHelper').appendTo($('#content > table:first-child > tbody > tr:first-child > td:first-child'));
				$('#content > table > tbody > tr > td > div.makeSelect,div.makeTable.internals,div.makeTable.readings,div.makeTable.attributes,div.makeTable.assoc').appendTo(wrapper);
				var wrapper2 = $('<div>').addClass('deviceSettings').insertBefore(wrapper);
				$('#content > table:first-child > tbody > tr > td > :not(.deviceWrapHelper)').appendTo(wrapper2);
				
				$('div.makeTable').each(function() {
					$(this).find('> table').wrap('<table class="group"><tbody><tr><td><div class="groupContent"><div class="scrollable"></div></div></td></tr></tbody></table>');
					$(this).find('> span:first-child').addClass('groupHeader').prependTo($(this).find('> table.group > tbody')).wrap('<tr><td></td></tr>');
					if ($(this).find('.groupContent .col1').length)
						$(this).find('> table.group').addClass('deviceGroup');
					$(this).find('.groupContent tr > td > table, .groupContent tr > td > iframe').parent().addClass('containsTable');
					$(this).find('.groupContent tr > td > div > table').parent().parent().addClass('containsTable');
				});		
				$('.deviceSettings div.makeTable:not(#ddtable) .scrollable > table').wrap('<table><tbody><tr><td></td></tr></tbody></table>');
				//$('.deviceSettings div.makeTable:not(#ddtable) > table').addClass('other');
				
				
				$('.deviceSettings div.devType').each(function() {
					$(this).addClass('groupHeader');
					$(this).closest('table').addClass('group');
					$(this).closest('tr').next().find('> td > *').wrapAll('<div class="groupContent"><div class="scrollable"><table><tbody><tr><td></td></tr></tbody></table></div></div>');
					$(this).closest('table').find('.groupContent tr > td > div > table, .groupContent tr > td > iframe').parent().addClass('containsTable');
					$(this).closest('table').find('.groupContent tr > td > div > table').parent().parent().addClass('containsTable');
				});
				
				$('.deviceWrapHelper > .makeSelect[cmd=attr]').prependTo('div.makeTable.attributes');
				$('.deviceSettings > table:not(.group)').wrap('<table class="group other"><tbody><tr><td><div class="groupContent"><div class="scrollable"><table><tbody><tr><td></td></tr></tbody></table></div></div></td></tr></tbody></table>');
				
				$("table.attributes .dname > a").click(function() {
					setTimeout(flex.content.check,50);
					flex.helper.scrollToElement('.makeSelect[cmd=attr]');
				});
				
				//$(".detLink.devSpecHelp").click(function() {setTimeout(function(){if ($('#devSpecHelp').length) flex.helper.scrollToElement('#devSpecHelp')},300)});
				//$(".detLink.rawDef").click(function() {setTimeout(function(){if ($('#rawDef').length) flex.helper.scrollToElement('#rawDef')},300)});
				$("<div>", {id: "detLinkWrapper"}).insertBefore('.detLink.iconFor').append($('.detLink'));
				$(".detLink.devSpecHelp > a, .detLink.rawDef > a").removeAttr('href');
			}
		},
		modifyGroups: function() {
			// room overview
			if (flex.room) {
				$('.roomoverview').slice(1).removeClass('roomoverview');
				$('.col3').contents().filter(function() {return this.nodeType == 3 && !this.nodeValue.match(/^\s*$/)}).wrap('<div class="webCmdLabel">');
				
				var addDeviceGroupToWrapper = function(group,wrapper) {
					group.addClass('groupHeader');
					group.closest('tr').next().wrap('<table class="group"><tbody></tbody></table>').find('> td > table').wrap('<div class="groupContent"><div class="scrollable"></div></div>');
					group.closest('tr').prependTo(group.closest('tr').next());
					if (group.closest('table').find('.groupContent .col1').length)
						group.closest('table').addClass('deviceGroup');
					group.closest('table').find('.groupContent tr > td > table, .groupContent tr > td > iframe').parent().addClass('containsTable');
					group.closest('table').find('.groupContent tr > td > div > table').parent().parent().addClass('containsTable');
					group.closest('table').appendTo(wrapper);
				}
				
				if (flex.settings.local.multiColumnLayout == "custom" && $('.roomoverview table.column').length)
					$('.roomoverview table.column').each(function() {
						var wrapper = $('<div>').addClass('deviceWrapHelper').appendTo($('.roomoverview'));
						$(this).find('> tbody > tr.devTypeTr div.devType').each(function(){
							addDeviceGroupToWrapper($(this),wrapper);
						});
					});
				else {
					var wrapper = $('<div>').addClass('deviceWrapHelper').appendTo($('.roomoverview'));
					$('.roomoverview > tbody > tr.devTypeTr div.devType, .roomoverview table.column > tbody > tr.devTypeTr div.devType').each(function() {
						addDeviceGroupToWrapper($(this),wrapper);
					});
				}
				$('#content > table:nth-child(n+2) > tbody > tr:first-child div.devType').each(function() {
					$(this).addClass('groupHeader');
					$(this).closest('table').addClass('group');
					$(this).closest('tr').next().find('> td > *').wrapAll('<div class="groupContent"><div class="scrollable"><table><tbody><tr><td></td></tr></tbody></table></div></div>');
					$(this).closest('table').find('.groupContent tr > td > table, .groupContent tr > td > iframe').parent().addClass('containsTable');
					$(this).closest('table').find('.groupContent tr > td > div > table').parent().parent().addClass('containsTable');
				});
				$('.roomoverview > tbody').remove();
				$('#content > table:nth-child(n+2):not(.group)').wrap('<table class="group other"><tbody><tr><td><div class="groupContent"><div class="scrollable"><table><tbody><tr><td></td></tr></tbody></table></div></div></td></tr></tbody></table>');
				//$('#content > table:nth-child(n+2).group').appendTo(wrapper);
				
				if (flex.room != 'all') {
					while (flex.settings.local.multiColumnLayout == "custom" && $( ".deviceWrapHelper" ).length < 5)
						$('<div>').addClass('deviceWrapHelper empty').appendTo($('.roomoverview'))
					
					var presstimer = null;
					var active = false;
					$( ".deviceWrapHelper > .group .groupHeader" ).css('cursor','pointer').attr('title','long press to start edit mode')
						.on("mousedown touchstart", function(e) {
							if (e.type === "click" && e.button !== 0)
								return;
							if (presstimer === null) {
								active = true;
								presstimer = setTimeout(function() {
									flex.content.makeGroupsSortable();
								}, 700);
							}
						})
						.on("mouseout touchend touchleave touchcancel click", function(e){
							if (presstimer !== null) {
								active = false;
								clearTimeout(presstimer);
								presstimer = null;
							}
						})
						.on("touchmove",function(e) {
							if (active) {
								var x = e.originalEvent.touches[0].clientX;
								var y = e.originalEvent.touches[0].clientY;
								var rect = this.getBoundingClientRect();
								if (!(rect.left < x && x < rect.right && rect.top < y && y < rect.bottom))
									$(this).trigger('touchleave');
							}
						});
					$(window).scroll(function(e) {
						$( ".deviceWrapHelper > .group .groupHeader" ).trigger('touchleave');
					});
				}
			}
		},
		modifyPlots: function() {
			var preparePlot = function(svg) {
				var plotid = $(svg).attr('id').replace(/^SVGPLOT_/,'');
				var colors = flex.settings.getPlotColors();
				$(svg).css('display','block').attr("viewBox", function() {
					var viewbox;
					// plotEmbed 1
					if ($(this).attr("width")) {
						viewbox = "0 0 "+$(this).attr("width").replace('px','')+" "+$(this).attr("height").replace('px','');
						$(this).attr('width','100%');
						this.removeAttribute('height');
						$('embed[name="'+plotid+'"]').parent()
								.css('min-width',flex.settings.local.plotMinWidth)
								.css('max-width',flex.settings.local.plotMaxWidth);
					} else { //plotEmbed 0
						viewbox = "0 0 "+$(this).css("width").replace('px','')+" "+$(this).css("height").replace('px','');
						$(this).css('width','100%').css('height','unset')
							.css('min-width',flex.settings.local.plotMinWidth)
							.css('max-width',flex.settings.local.plotMaxWidth);
					}
					return viewbox;
				});
				if (!flex.settings.local.enableRoundedEdges)
					$(svg).find('rect.border').attr('rx',0).attr('ry', 0);
				$(svg).find("defs > linearGradient").parent().html(colors.defs);
				$(svg).find("> style").first().text(colors.css);
			}
			$('div.SVGplot > embed').wrap('<div>');
			$('div.SVGplot').parent().each(function(){if ($(this).is('td')) $(this).addClass('containsPlot')});
			if(typeof svgCallback != "undefined" && !flex.content.plots.length) {
				svgCallback.flex2 = preparePlot;
			} else {
				flex.content.plots.forEach(preparePlot);
			}
		},
		updatePlotColors: function() {
			if (flex.content.plots) {
				var colors = flex.settings.getPlotColors();
				flex.content.plots.forEach(function(svg) {
					$(svg).find("defs > linearGradient").parent().html(colors.defs);
					$(svg).find("> style").first().text(colors.css);
				});
			}
		},
		applyStyleFixes: function() {
			// fix leaflet map
			$('.leaflet-container').closest('td').addClass('containsMap').closest('table').addClass('containsMap');
			if (typeof Karte !== 'undefined') {
				var zoomToMarkers = function() {
				  var markers = [];
				  Karte.eachLayer( function(layer) {
					if(layer instanceof L.Marker) {
					  if(Karte.getBounds().contains(layer.getLatLng())) {
						markers.push(layer);
					  }
					}
				  });
				  var bounds = L.featureGroup(markers).getBounds();
				  if (bounds.isValid())
					  Karte.fitBounds(bounds);
				}
				setTimeout(Karte._onResize,500);
				setTimeout(zoomToMarkers,1000);
			}
			
			// fix readingsgroup colspan
			if ($('table.readingsGroup').length) {
				$('table.readingsGroup').each(function(){
					var numCols = [];
					$(this).find('>tbody>tr').each(function(index){
						numCols.push($(this).find('> td:not([colspan])').length);
						$(this).find('> td[colspan]').each(function(){numCols[index] += parseInt($(this).attr('colspan'))});
					});
					var maxCols = Math.max.apply(Math,numCols);
					$(this).find('>tbody>tr').each(function(index){
						var colspan = maxCols-numCols[index]+1;
						if ($(this).find('>td:last-child').attr('colspan'))
							colspan += (parseInt($(this).find('>td:last-child').attr('colspan')) - 1);
						$(this).find('>td:last-child').attr('colspan',colspan);
					});
				});
			}
			
			//separate multiple colorpicker_widgets within one cell
			$('.colorpicker_widget').each(function() {
				if ($(this).children('div').length > 1) {
					$(this).children('br').remove();
				}
			});
		},
		applyStyleFixesAfter: function() {
			// codemirror not working with CSS columns
			/*$('#content .deviceWrapHelper.dualCol #DEFa').off('click').click(function(){
				var old = $('#edit').css('display');
				$('#edit').css('display', old=='none' ? 'block' : 'none');
				$('#disp').css('display', old=='none' ? 'none' : 'block');
			});*/
			
			// modify sliders
			if ($('.handle').length) {
				$('<div>',{id: "sliderValueHelper"}).appendTo('body');
				$('.handle').each(function() {
					$(this).on('touchstart',function() { $('#sliderValueHelper').addClass('touch').css('display','block'); });
					$(this).on('mousedown mouseover',function() { $('#sliderValueHelper').removeClass('touch').css('display','block'); });
					$(this).on('mousedown mousemove touchstart touchmove',function() {
						$('#sliderValueHelper').text($(this).text());
						var margin = $('#sliderValueHelper').width()/2-$(this).width()/2;
						$('#sliderValueHelper').css('left',($(this).offset().left-margin-2) + 'px')
											   .css('top',($(this).offset().top-(2.3*$(this).height())) + 'px');;
					});
					$(this).on('touchend mouseup mouseleave',function() { $('#sliderValueHelper').css('display','none'); });
				});
			}
		},
		retainScrollPosition: function(elem) {
			$(window).unload(function() {
				window.history.replaceState({scrollPosition: $(elem).scrollTop()},'',window.location.href.replace(window.location.origin,''));
			});
			if (history.state) {
				setTimeout(function(){$(elem).scrollTop(history.state.scrollPosition)},300);
			}
		},
		check: function() {
			if (!flex.checkingWrapStatus) {
				flex.log('checkWrapped');
				flex.checkingWrapStatus = true;
				flex.content.checkAbort = false;
				
				if (flex.settings.local.enableTableBehaviour) {
					$('.group.deviceGroup .scrollable > table > tbody > tr ').addClass('table');
					$('.group.deviceGroup .scrollable > table').addClass('isTable');
					$('.group.deviceGroup .scrollable').each(function() {
						if ($(this).isScrollable()) {
							$(this).find('> table > tbody > tr').removeClass('table');
							$(this).find('> table').removeClass('isTable');
						}
					});
				}
				
				if (flex.settings.local.multiColumnLayout == "single" || (flex.settings.local.multiColumnLayout == "dual" && $('.deviceWrapHelper > *').length == 1)) {
					$('.deviceWrapHelper').addClass('singleCol').removeClass('dualCol').removeClass('customCol');
				} else if (flex.settings.local.multiColumnLayout == "dual" || (flex.room == 'all' && flex.settings.local.multiColumnLayout == "custom")) {
					$('.deviceWrapHelper').removeClass('singleCol').addClass('dualCol').removeClass('customCol');
				} else if (flex.settings.local.multiColumnLayout == "custom") {
					$('.deviceWrapHelper').removeClass('singleCol').removeClass('dualCol').addClass('customCol');
				}
				
				if ($('.deviceGroup, #flexColorSettings').first().width() <= 450) {
					if ($('.wraphelper').length == 0)
						$('<td>').addClass('wraphelper').insertAfter($('.deviceGroup .scrollable > table > tbody > tr > td:nth-child(2), #flexColorSettings tr:first-child > td:nth-child(2)'));
				} else
					$('.wraphelper').remove();
				
				// check if flex items have wrapped, required to set different width
				var def = '.group.deviceGroup .groupContent > div > table > tbody > tr'
						 +',.group.fileGroup .groupContent > div > table > tbody > tr'
						 +',.readings .group .groupContent > div > table > tbody > tr'
						 +',.attributes .group .groupContent > div > table > tbody > tr'
						 +',.internals .group .groupContent > div > table > tbody > tr'
						 +',.assoc .group .groupContent > div > table > tbody > tr'
						 +',table.groupContent > tbody > tr';
				var t0 = performance.now();
				$(def).each(function() {
					if (flex.content.checkAbort) return false;
					$(this).children('td:nth-child(n+2)').removeClass('wrapped').each(function() {
						if (flex.content.checkAbort) return false;
						// check if top-offset is larger than parent -> wrapped
						if (($(this)[0].offsetTop-$(this).parent()[0].offsetTop)>0) {
							$(this).addClass('wrapped');
							$(this).nextAll().addClass('wrapped');
							return false;
						}
					});
					var tdelta = performance.now() - t0;
					if (tdelta > 500 && flex.settings.local.improvePerformance) {
						flex.log('checkWrapped aborted');
						return false;
					}
				});
				$('.makeSelect form > *').each(function() {
					if (flex.content.checkAbort) return false;
					$(this).removeClass('wrapped');
					if (($(this)[0].offsetTop-$(this).parent()[0].offsetTop)>0)
						$(this).addClass('wrapped');
				});
				//flex.log('checkWrapped duration: '+(performance.now() - t0)+'ms');
				
				flex.checkingWrapStatus = false;
			}
		},
		makeGroupsSortable: function() {
			$( ".deviceWrapHelper > .group .groupHeader" )
				.off("mousedown touchstart mouseout touchend touchleave touchcancel touchmove click")
				.attr('title','Hold and drag to reorder group')
				.each(function(){
					var groupname = $(this).text();
					$(this).attr('groupname',groupname);
					$('<div class="hideGroup" title="Hide group">×</div>').appendTo($(this)).click(function() {
						flex.hiddenGroups.push(groupname);
						flex.cmd('attr '+flex.webName+' hiddengroup '+flex.hiddenGroups.join());
						$(this).closest('.group').remove();
						if (flex.hiddenGroups.length == 1)
							alert('Group "'+groupname+'" is hidden from all rooms. Hidden groups can be restored in the settings.');
					});
				});
			$( ".deviceWrapHelper" ).sortable({
				delay: 150,
				handle: '.groupHeader',
				connectWith: '.deviceWrapHelper',
				opacity: 0.8,
				cursor: 'grabbing',
				tolerance: "pointer",
				start: function(e,ui) {
					$( ".deviceWrapHelper:empty" ).addClass('empty');
					if (!flex.groupOrder) {
						flex.cmd('jsonlist2 '+flex.webName,function(data) {
							if (typeof data.Results[0] !== "object") return;
							var column = data.Results[0].Attributes.column;
							if (column) {
								var rooms = column.split(' ');
								flex.groupOrder = {};
								for (var ii=0;ii<rooms.length;ii++) {
									var temp = rooms[ii].split(':');
									flex.groupOrder[temp[0].replace(" ","%20")] = temp[1];
								}
							}
						});
					}
					$( ".deviceWrapHelper:not(:empty)" ).addClass('edit');
					$( ".deviceWrapHelper:empty" ).first().addClass('edit');
				},
				stop: function(e,ui) {
					$( ".deviceWrapHelper" ).removeClass('edit');
					flex.content.check();
				},
				update: function(e,ui) {
					
					var groupOrder = '';
					$( ".deviceWrapHelper:not(:empty)" ).each(function(index) {
						var colOrder = [];
						$(this).removeClass('empty');
						$(this).find(".groupHeader").each(function() {
							var groupname = $(this).attr('groupname').replace(/\s/g,'\\s');
							colOrder.push(groupname);
						});
						if (index > 0)
							groupOrder += '|'
						groupOrder += colOrder.join();
					});
					$( ".deviceWrapHelper:not(:empty)" ).removeClass('empty');
					$( ".deviceWrapHelper:empty" ).insertAfter($( ".deviceWrapHelper" ).last()).addClass('empty');
					if (!flex.groupOrder) flex.groupOrder = {};
					flex.groupOrder[flex.room.replace(" ","%20")] = groupOrder+',.*';
					var columndata = '';
					for (room in flex.groupOrder)
						columndata += room+':'+flex.groupOrder[room]+' ';
					//flex.log('attr '+flex.webName+' column '+columndata);
					flex.cmd('attr '+flex.webName+' column '+columndata);
					FW_errmsg('Group order saved', 2000);
				}
			}).sortable( "enable" ).disableSelection();
		},
		icons: {
			fhem_save: '<svg viewBox="0 0 611.923 611.923" xmlns="http://www.w3.org/2000/svg"><path d="M606.157,120.824L489.908,4.575c-2.46-2.46-6.612-4.152-10.764-4.152H434.32H175.988H40.672   C18.222,0.423,0,18.721,0,41.095v529.734c0,22.45,18.298,40.672,40.672,40.672h86.341h368.661h75.577   c22.45,0,40.672-18.299,40.672-40.672V131.665C611.077,128.359,609.463,124.207,606.157,120.824z M419.328,31.177v136.162   c0,0.846-0.846,0.846-0.846,0.846h-42.363V31.177H419.328z M344.596,31.177v137.008H192.595c-0.846,0-0.846-0.846-0.846-0.846   V31.177H344.596z M141.929,580.9V390.688c0-35.674,29.062-64.737,64.737-64.737h208.434c35.674,0,64.737,29.062,64.737,64.737   v190.135H141.929V580.9z M580.401,570.905c0,4.997-4.152,9.995-9.995,9.995h-59.816V390.688c0-52.281-43.209-95.49-95.49-95.49   H207.511c-52.281,0-95.49,43.209-95.49,95.49v190.135H40.595c-4.997,0-9.995-4.152-9.995-9.995V41.095   c0-4.997,4.152-9.995,9.995-9.995h120.401v136.162c0,17.453,14.147,31.523,31.523,31.523h225.886   c17.453,0,31.523-14.147,31.523-31.523V31.177h23.219l107.1,107.1L580.401,570.905L580.401,570.905z M422.634,490.33   c0,8.304-6.612,14.916-14.916,14.916H217.506c-8.304,0-14.916-6.612-14.916-14.916c0-8.303,6.612-14.916,14.916-14.916h189.289   C415.945,475.415,422.634,482.027,422.634,490.33z M422.634,410.678c0,8.303-6.612,14.916-14.916,14.916H217.506   c-8.304,0-14.916-6.612-14.916-14.916s6.612-14.916,14.916-14.916h189.289C415.945,394.84,422.634,401.529,422.634,410.678z"/></svg>',
			fhem_save_check: '<svg viewBox="0 0 611.923 611.923" xmlns="http://www.w3.org/2000/svg"><path d="M606.157,120.824L489.908,4.575c-2.46-2.46-6.612-4.152-10.764-4.152H434.32H175.988H40.672   C18.222,0.423,0,18.721,0,41.095v529.734c0,22.45,18.298,40.672,40.672,40.672h86.341h368.661h75.577   c22.45,0,40.672-18.299,40.672-40.672V131.665C611.077,128.359,609.463,124.207,606.157,120.824z M419.328,31.177v136.162   c0,0.846-0.846,0.846-0.846,0.846h-42.363V31.177H419.328z M344.596,31.177v137.008H192.595c-0.846,0-0.846-0.846-0.846-0.846   V31.177H344.596z M141.929,580.9V390.688c0-35.674,29.062-64.737,64.737-64.737h208.434c35.674,0,64.737,29.062,64.737,64.737   v190.135H141.929V580.9z M580.401,570.905c0,4.997-4.152,9.995-9.995,9.995h-59.816V390.688c0-52.281-43.209-95.49-95.49-95.49   H207.511c-52.281,0-95.49,43.209-95.49,95.49v190.135H40.595c-4.997,0-9.995-4.152-9.995-9.995V41.095   c0-4.997,4.152-9.995,9.995-9.995h120.401v136.162c0,17.453,14.147,31.523,31.523,31.523h225.886   c17.453,0,31.523-14.147,31.523-31.523V31.177h23.219l107.1,107.1L580.401,570.905L580.401,570.905z M422.634,490.33   c0,8.304-6.612,14.916-14.916,14.916H217.506c-8.304,0-14.916-6.612-14.916-14.916c0-8.303,6.612-14.916,14.916-14.916h189.289   C415.945,475.415,422.634,482.027,422.634,490.33z M422.634,410.678c0,8.303-6.612,14.916-14.916,14.916H217.506   c-8.304,0-14.916-6.612-14.916-14.916s6.612-14.916,14.916-14.916h189.289C415.945,394.84,422.634,401.529,422.634,410.678z"/><path style="fill:#ff0000;fill-opacity:1" d="m 427.98662,183.39874 q 0,24.65821 -7.32422,43.70117 -7.08008,18.79883 -20.26367,32.71485 -13.1836,13.91601 -31.73828,24.90234 -18.31055,10.98633 -41.50391,20.01953 v 55.66407 h -85.9375 v -82.27539 q 17.33398,-4.63868 31.25,-9.52149 14.16016,-4.88281 29.54102,-15.86914 14.40429,-9.76562 22.46093,-22.70508 8.30078,-12.93945 8.30078,-29.29687 0,-24.41407 -15.86914,-34.66797 -15.625,-10.49805 -44.18945,-10.49805 -17.57812,0 -39.79492,7.56836 -21.97266,7.56836 -40.2832,19.53125 h -9.76563 v -74.46289 q 15.625,-6.5918 48.0957,-13.671875 32.47071,-7.324219 65.91797,-7.324219 60.30274,0 95.70313,26.611324 35.40039,26.61133 35.40039,69.58008 z m -93.99414,274.65821 h -98.63282 v -64.45313 h 98.63282 z"/></svg>',
			reload_my: '<svg viewBox="0 0 400 399.999" xmlns="http://www.w3.org/2000/svg"><path d="m 301.75738,175.2197 -33.5083,55.72509 v 35.15625 h -23.4375 V 232.04343 L 210.75396,175.2197 h 26.61133 l 19.65332,35.15625 18.98193,-35.15625 z M 198.669,266.10104 h -23.31543 v -60.85205 l -16.8457,39.48975 h -16.17432 l -16.8457,-39.48975 v 60.85205 H 103.39312 V 175.2197 h 27.22168 l 20.44678,45.59326 20.38574,-45.59326 H 198.669 Z M 361.796,209.654 c -7.887,0 -14.279,6.393 -14.279,14.275 0,81.342 -66.172,147.518 -147.519,147.518 -81.342,0 -147.515,-66.176 -147.515,-147.518 0,-76.521 58.575,-139.585 133.239,-146.796 v 32.863 c 0,5.099 2.725,9.812 7.137,12.362 2.21,1.274 4.677,1.914 7.139,1.914 2.466,0 4.927,-0.639 7.136,-1.914 l 82.904,-47.857 c 4.42,-2.548 7.137,-7.26 7.137,-12.361 0,-5.1 -2.717,-9.815 -7.137,-12.363 L 207.134,1.913 c -4.418,-2.551 -9.855,-2.551 -14.275,0 -4.412,2.548 -7.137,7.264 -7.137,12.363 v 34.212 c -90.426,7.298 -161.791,83.167 -161.791,175.44 0,97.085 78.984,176.07 176.066,176.07 97.088,0 176.071,-78.985 176.071,-176.07 0,-7.881 -6.389,-14.274 -14.272,-14.274 z"/></svg>',
			reread_icons: '<svg viewBox="0 0 400 399.999" xmlns="http://www.w3.org/2000/svg"><path d="m 326.70757,220.69089 q 0,21.72851 -12.45117,34.5459 -12.45117,12.75634 -34.42383,12.75634 -21.91162,0 -34.36279,-12.75634 -12.45117,-12.81739 -12.45117,-34.5459 0,-21.91162 12.45117,-34.60694 12.45117,-12.75634 34.36279,-12.75634 21.85059,0 34.3628,12.75634 12.5122,12.69532 12.5122,34.60694 z m -31.06689,23.01025 q 3.41797,-4.15039 5.06592,-9.76562 1.64795,-5.67627 1.64795,-13.30567 0,-8.17871 -1.89209,-13.91601 -1.89209,-5.73731 -4.94385,-9.27735 -3.11279,-3.66211 -7.20215,-5.31006 -4.02832,-1.64794 -8.42285,-1.64794 -4.45557,0 -8.42285,1.58691 -3.90625,1.58691 -7.20215,5.24902 -3.05176,3.41797 -5.00488,9.46045 -1.89209,5.98145 -1.89209,13.91602 0,8.11767 1.83105,13.85498 1.89209,5.67627 4.94385,9.27734 3.05176,3.60108 7.14111,5.31006 4.08936,1.70898 8.60596,1.70898 4.5166,0 8.60596,-1.70898 4.08935,-1.77002 7.14111,-5.43213 z m -106.81153,24.16992 q -10.13183,0 -18.73779,-2.99072 -8.54492,-2.99072 -14.70947,-8.91113 -6.16455,-5.92041 -9.58252,-14.77051 -3.35693,-8.8501 -3.35693,-20.44678 0,-10.80322 3.23486,-19.59228 3.23486,-8.78907 9.39941,-15.07569 5.92041,-6.04248 14.64844,-9.33838 8.78906,-3.29589 19.16504,-3.29589 5.7373,0 10.31494,0.67138 4.63867,0.61035 8.54492,1.64795 4.08936,1.15967 7.38526,2.62451 3.35693,1.40381 5.85937,2.62452 v 22.03369 h -2.68554 q -1.70899,-1.46485 -4.3335,-3.47901 -2.56348,-2.01416 -5.85938,-3.96728 -3.35693,-1.95313 -7.26318,-3.2959 -3.90625,-1.34277 -8.36182,-1.34277 -4.94384,0 -9.39941,1.58691 -4.45557,1.52588 -8.23975,5.12695 -3.60107,3.47901 -5.85937,9.21631 -2.19727,5.73731 -2.19727,13.91602 0,8.54492 2.38037,14.28222 2.44141,5.73731 6.10352,9.03321 3.72314,3.35693 8.30078,4.82177 4.57764,1.40381 9.0332,1.40381 4.27247,0 8.42286,-1.28173 4.21142,-1.28174 7.75146,-3.47901 2.99072,-1.77002 5.5542,-3.78418 2.56348,-2.01416 4.21143,-3.479 h 2.4414 v 21.72851 q -3.41797,1.52588 -6.53076,2.86866 -3.11279,1.34277 -6.53076,2.31933 -4.45557,1.28174 -8.36182,1.95313 -3.90625,0.67138 -10.74219,0.67138 z m -60.30273,-1.77002 H 75.303764 V 249.98776 H 90.196342 V 191.33298 H 75.303764 V 175.2197 h 53.222656 v 16.11328 h -14.89258 v 58.65478 h 14.89258 z M 361.796,209.654 c -7.887,0 -14.279,6.393 -14.279,14.275 0,81.342 -66.172,147.518 -147.519,147.518 -81.342,0 -147.515,-66.176 -147.515,-147.518 0,-76.521 58.575,-139.585 133.239,-146.796 v 32.863 c 0,5.099 2.725,9.812 7.137,12.362 2.21,1.274 4.677,1.914 7.139,1.914 2.466,0 4.927,-0.639 7.136,-1.914 l 82.904,-47.857 c 4.42,-2.548 7.137,-7.26 7.137,-12.361 0,-5.1 -2.717,-9.815 -7.137,-12.363 L 207.134,1.913 c -4.418,-2.551 -9.855,-2.551 -14.275,0 -4.412,2.548 -7.137,7.264 -7.137,12.363 v 34.212 c -90.426,7.298 -161.791,83.167 -161.791,175.44 0,97.085 78.984,176.07 176.066,176.07 97.088,0 176.071,-78.985 176.071,-176.07 0,-7.881 -6.389,-14.274 -14.272,-14.274 z"/></svg>',
			fhem_logo: '<svg viewBox="0 0 580 580" xmlns="http://www.w3.org/2000/svg"><path d="m 497.34946,573.72711 q 0,0.78125 -0.46875,1.40625 -0.39062,0.625 -1.5625,1.01563 -1.09375,0.39062 -2.96875,0.625 -1.875,0.23437 -4.76562,0.23437 -2.8125,0 -4.6875,-0.23437 -1.875,-0.23438 -2.96875,-0.625 -1.09375,-0.39063 -1.5625,-1.01563 -0.46875,-0.625 -0.46875,-1.40625 v -82.26562 h -0.15625 l -29.29688,82.1875 q -0.3125,1.01562 -1.01562,1.71875 -0.70313,0.625 -1.95313,1.01562 -1.17187,0.39063 -3.04687,0.46875 -1.875,0.15625 -4.53125,0.15625 -2.65625,0 -4.53125,-0.23437 -1.875,-0.15625 -3.125,-0.54688 -1.17188,-0.46875 -1.875,-1.09375 -0.70313,-0.625 -0.9375,-1.48437 l -28.28125,-82.1875 h -0.15625 v 82.26562 q 0,0.78125 -0.46875,1.40625 -0.39063,0.625 -1.5625,1.01563 -1.17188,0.39062 -3.04688,0.625 -1.79687,0.23437 -4.6875,0.23437 -2.8125,0 -4.6875,-0.23437 -1.875,-0.23438 -3.04687,-0.625 -1.09375,-0.39063 -1.5625,-1.01563 -0.39063,-0.625 -0.39063,-1.40625 v -90.07812 q 0,-3.98438 2.10938,-6.09375 2.10937,-2.10938 5.625,-2.10938 h 13.4375 q 3.59375,0 6.17187,0.625 2.57813,0.54688 4.45313,1.95313 1.875,1.32812 3.125,3.59375 1.25,2.1875 2.1875,5.46875 l 21.875,60.23437 h 0.3125 l 22.65625,-60.07812 q 1.01562,-3.28125 2.1875,-5.54688 1.25,-2.26562 2.8125,-3.67187 1.64062,-1.40625 3.82812,-1.95313 2.1875,-0.625 5.07813,-0.625 h 13.82812 q 2.10938,0 3.59375,0.54688 1.5625,0.54687 2.5,1.64062 1.01563,1.01563 1.48438,2.57813 0.54687,1.48437 0.54687,3.4375 z m -148.01562,-5.23437 q 0,2.26562 -0.23438,3.82812 -0.15625,1.48438 -0.54687,2.42188 -0.39063,0.9375 -1.01563,1.40625 -0.54687,0.39062 -1.25,0.39062 h -50.78125 q -2.57812,0 -4.375,-1.48437 -1.71875,-1.5625 -1.71875,-5 v -88.125 q 0,-3.4375 1.71875,-4.92188 1.79688,-1.5625 4.375,-1.5625 h 50.46875 q 0.70313,0 1.25,0.39063 0.54688,0.39062 0.9375,1.40625 0.39063,0.9375 0.54688,2.5 0.23437,1.48437 0.23437,3.82812 0,2.1875 -0.23437,3.75 -0.15625,1.48438 -0.54688,2.42188 -0.39062,0.9375 -0.9375,1.40625 -0.54687,0.39062 -1.25,0.39062 h -36.09375 v 24.6875 h 30.54688 q 0.70312,0 1.25,0.46875 0.625,0.39063 1.01562,1.32813 0.39063,0.85937 0.54688,2.42187 0.23437,1.48438 0.23437,3.67188 0,2.26562 -0.23437,3.75 -0.15625,1.48437 -0.54688,2.42187 -0.39062,0.85938 -1.01562,1.25 -0.54688,0.39063 -1.25,0.39063 h -30.54688 v 28.51562 h 36.40625 q 0.70313,0 1.25,0.46875 0.625,0.39063 1.01563,1.32813 0.39062,0.9375 0.54687,2.5 0.23438,1.48437 0.23438,3.75 z m -93.95313,5.23437 q 0,0.78125 -0.54687,1.40625 -0.46875,0.625 -1.64063,1.01563 -1.17187,0.39062 -3.125,0.625 -1.95312,0.23437 -4.92187,0.23437 -3.04688,0 -5.07813,-0.23437 -1.95312,-0.23438 -3.125,-0.625 -1.09375,-0.39063 -1.64062,-1.01563 -0.46875,-0.625 -0.46875,-1.40625 v -40.85937 h -37.8125 v 40.85937 q 0,0.78125 -0.46875,1.40625 -0.46875,0.625 -1.64063,1.01563 -1.17187,0.39062 -3.125,0.625 -1.95312,0.23437 -5,0.23437 -2.96875,0 -5,-0.23437 -1.95312,-0.23438 -3.125,-0.625 -1.17187,-0.39063 -1.71875,-1.01563 -0.46875,-0.625 -0.46875,-1.40625 v -95.46875 q 0,-0.78125 0.46875,-1.40625 0.54688,-0.625 1.71875,-1.01562 1.17188,-0.39063 3.125,-0.625 2.03125,-0.23438 5,-0.23438 3.04688,0 5,0.23438 1.95313,0.23437 3.125,0.625 1.17188,0.39062 1.64063,1.01562 0.46875,0.625 0.46875,1.40625 v 37.10938 h 37.8125 v -37.10938 q 0,-0.78125 0.46875,-1.40625 0.54687,-0.625 1.64062,-1.01562 1.17188,-0.39063 3.125,-0.625 2.03125,-0.23438 5.07813,-0.23438 2.96875,0 4.92187,0.23438 1.95313,0.23437 3.125,0.625 1.17188,0.39062 1.64063,1.01562 0.54687,0.625 0.54687,1.40625 z m -107.625,-89.84375 q 0,2.34375 -0.23437,3.98438 -0.15625,1.5625 -0.625,2.5 -0.39063,0.9375 -0.9375,1.40625 -0.54688,0.46875 -1.25,0.46875 h -33.04688 v 27.1875 h 31.01563 q 0.70312,0 1.25,0.39062 0.54687,0.39063 0.9375,1.32813 0.46875,0.9375 0.625,2.5 0.23437,1.5625 0.23437,3.90625 0,2.34375 -0.23437,3.90625 -0.15625,1.5625 -0.625,2.57812 -0.39063,1.01563 -0.9375,1.48438 -0.54688,0.39062 -1.25,0.39062 h -31.01563 v 37.65625 q 0,0.85938 -0.46875,1.48438 -0.46875,0.625 -1.71875,1.09375 -1.17187,0.39062 -3.125,0.625 -1.95312,0.23437 -5,0.23437 -2.968746,0 -4.999996,-0.23437 -1.953125,-0.23438 -3.125,-0.625 -1.171875,-0.46875 -1.71875,-1.09375 -0.46875,-0.625 -0.46875,-1.48438 v -91.64062 q 0,-3.4375 1.71875,-4.92188 1.796875,-1.5625 4.375,-1.5625 h 47.578126 q 0.70312,0 1.25,0.46875 0.54687,0.39063 0.9375,1.40625 0.46875,0.9375 0.625,2.57813 0.23437,1.64062 0.23437,3.98437 z M 334.11914,0.12304688 C 323.04594,0.28629523 295.32986,12.109652 204.7793,54.115234 136.90197,85.602905 81.406508,113.71939 81.332031,116.6582 c -0.07442,2.93642 2.683776,10.79306 6.13086,17.45899 6.639647,12.83966 16.921279,15.38887 31.212889,7.74023 7.5655,-4.04892 8.00979,-3.3503 5.9082,9.24414 -5.87717,35.22077 -26.955074,218.9775 -26.955074,234.99024 0,12.23557 1.979534,18.82737 6.134764,20.42187 245.06231,31.49787 100.7038,12.49011 240.69727,31.32813 107.71114,13.41736 115.71658,13.91038 120.46679,7.41406 2.79859,-3.8273 12.18051,-64.25241 20.84961,-134.27734 l 15.76172,-127.31836 10.15821,7.99023 c 5.5869,4.39465 12.54837,7.99023 15.46875,7.99023 6.11593,10e-6 22.33789,-19.26863 22.33789,-26.5332 0,-5.96826 -197.66583,-167.0685734 -211.52344,-172.39452938 -1.03727,-0.39865909 -2.27944,-0.61316494 -3.86133,-0.58984374 z m -5.37109,43.52343712 67.24414,54.222657 c 38.0278,30.663999 81.05469,66.115199 81.05469,69.962889 -10e-6,3.74209 -20.6879,146.92696 -28.59571,210.46289 -1.0925,8.47252 -3.9833,50.89389 -20.05664,40.875 -16.66494,-0.46822 -291.92607,-26.76355 -301.82031,-36.27734 -13.15381,-12.64803 25.7536,-249.56769 26.72461,-259.375 0.30872,-3.11804 50.61177,-25.603888 92.63086,-43.869142 z M 266.76617,345.7819 c -41.9322,-13.65946 -70.54722,-49.21372 -70.54722,-87.65517 0,-17.12736 0.51475,-17.89237 11.2047,-16.65223 9.7161,1.12715 5.001,3.67203 7.62554,19.15528 4.4671,26.35332 21.00992,48.20403 42.90779,59.47307 50.48959,25.98284 121.33367,4.96051 130.90277,-38.60732 2.27014,-10.33586 -1.02999,-16.12743 8.97541,-16.12743 14.16682,0 13.87223,8.08445 3.91622,31.91253 -14.25796,34.12411 -40.8295,49.51627 -86.68893,51.51336 -18.95317,0.82538 -37.36236,0.54964 -48.29628,-3.01209 z m 99.08592,-155.90812 c -19.85794,-10.49665 -23.65922,-9.38355 -19.25326,-20.9495 3.45938,-9.08112 7.77389,-4.26462 31.72624,7.96198 16.56383,8.45509 23.5553,8.39399 22.52408,15.69571 -1.79495,12.70935 -11.77027,9.56919 -34.99706,-2.70819 z m -138.63821,-8.23614 c -1.62649,-1.62649 -2.23924,-4.04007 -2.23924,-9.22486 0,-7.5879 4.78197,-6.59414 18.5877,-10.31164 30.82717,-8.30089 36.7093,-11.0912 38.14774,1.36912 1.12477,9.74321 -6.20012,8.69131 -19.97841,12.30515 -31.55919,8.27749 -31.61844,8.76157 -34.51779,5.86223 z"/></svg>',
			fhem_update: '<svg viewBox="0 0 580 580" xmlns="http://www.w3.org/2000/svg"><path d="m 66.152344,477.72852 c -18.513979,0 -35.710938,14.13868 -35.710938,33.55859 v 29.55664 c 0,19.41991 17.196959,33.55859 35.710938,33.55859 H 347.33398 v -0.002 -32.92383 H 240.85938 V 510.6543 H 522.0625 c 2.8107,0 2.78711,1.10658 2.78711,0.63281 v 29.55664 c 0,-0.47378 0.0233,0.63281 -2.78711,0.63281 l -174.72656,0.002 -0.002,32.92187 174.72852,0.002 c 18.51395,1.9e-4 35.72852,-14.1387 35.72852,-33.55859 v -29.55664 c 0,-19.41989 -17.21457,-33.55859 -35.72852,-33.55859 z M 227.21388,181.63764 c -1.62649,-1.62649 -2.23924,-4.04007 -2.23924,-9.22486 0,-7.5879 4.78197,-6.59414 18.5877,-10.31164 30.82717,-8.30089 36.7093,-11.0912 38.14774,1.36912 1.12477,9.74321 -6.20012,8.69131 -19.97841,12.30515 -31.55919,8.27749 -31.61844,8.76157 -34.51779,5.86223 z m 138.63821,8.23614 c -19.85794,-10.49665 -23.65922,-9.38355 -19.25326,-20.9495 3.45938,-9.08112 7.77389,-4.26462 31.72624,7.96198 16.56383,8.45509 23.5553,8.39399 22.52408,15.69571 -1.79495,12.70935 -11.77027,9.56919 -34.99706,-2.70819 z M 266.76617,345.7819 c -41.9322,-13.65946 -70.54722,-49.21372 -70.54722,-87.65517 0,-17.12736 0.51475,-17.89237 11.2047,-16.65223 9.7161,1.12715 5.001,3.67203 7.62554,19.15528 4.4671,26.35332 21.00992,48.20403 42.90779,59.47307 50.48959,25.98284 121.33367,4.96051 130.90277,-38.60732 2.27014,-10.33586 -1.02999,-16.12743 8.97541,-16.12743 14.16682,0 13.87223,8.08445 3.91622,31.91253 -14.25796,34.12411 -40.8295,49.51627 -86.68893,51.51336 -18.95317,0.82538 -37.36236,0.54964 -48.29628,-3.01209 z m 181.68587,32.51383 c 7.90781,-63.53593 28.59394,-206.72144 28.59394,-210.46353 0,-3.84769 -43.02608,-39.29831 -81.05388,-69.962309 L 328.74816,43.647242 245.92951,79.64763 c -42.01909,18.265255 -92.32125,40.75248 -92.62997,43.87052 -0.97101,9.80731 -39.87928,246.72561 -26.72547,259.37364 9.89424,9.51379 285.15543,35.8103 301.82037,36.27852 16.07334,10.01889 18.9651,-32.40206 20.0576,-40.87458 z m -344.68841,28.2183 c -4.155232,-1.5945 -6.135607,-8.18591 -6.135607,-20.42148 0,-16.01274 21.079537,-199.77085 26.956707,-234.99162 2.10159,-12.59444 1.65569,-13.29182 -5.90981,-9.2429 -14.29161,7.64864 -24.571646,5.09916 -31.211293,-7.7405 C 84.016543,127.4516 81.257085,119.59514 81.331505,116.65872 81.405982,113.71991 136.90234,85.603734 204.77967,54.116063 308.26603,6.1096827 329.68235,-2.4766341 337.98053,0.71263864 351.83814,6.0385946 549.50313,167.13938 549.50313,173.10764 c 0,7.26457 -16.22199,26.53317 -22.33792,26.53317 -2.92038,0 -9.88086,-3.59562 -15.46776,-7.99027 l -10.15799,-7.99027 -15.76198,127.31806 c -8.6691,70.02493 -18.05173,130.44946 -20.85032,134.27676 -4.75021,6.49632 -12.75531,6.00369 -120.46645,-7.41367 -139.99347,-18.83802 4.36523,0.17048 -240.69708,-31.32739 z"/></svg>',
			fhem_update_check: '<svg viewBox="0 0 468 468" xmlns="http://www.w3.org/2000/svg"><path d="m 262.50148,231.56171 h -52.88086 v -7.17774 q 0,-12.01172 4.83399,-21.24023 4.83398,-9.375 20.36132,-23.73047 l 9.375,-8.49609 q 8.34961,-7.61719 12.15821,-14.35547 3.95507,-6.73828 3.95507,-13.47657 0,-10.2539 -7.03125,-15.96679 -7.03125,-5.85938 -19.6289,-5.85938 -11.86524,0 -25.63477,4.98047 -13.76953,4.83399 -28.71093,14.50195 V 94.7453 q 17.7246,-6.152343 32.37304,-9.082031 14.64844,-2.929687 28.27149,-2.929687 35.74218,0 54.49218,14.648437 18.75,14.501951 18.75,42.480471 0,14.35547 -5.71289,25.78125 -5.71289,11.27929 -19.48242,24.3164 l -9.375,8.34961 q -9.96094,9.08203 -13.03711,14.64844 -3.07617,5.41992 -3.07617,12.01172 z m -52.88086,21.67968 h 52.88086 v 52.14844 H 209.62062 Z M 52.921875,382.18282 c -14.811183,0 -28.56875,11.31094 -28.56875,26.84687 V 432.675 c 0,15.53593 13.757567,26.84687 28.56875,26.84687 H 277.86718 v -0.002 -26.33906 H 192.6875 V 408.52344 H 417.65 c 2.24856,0 2.22969,0.88526 2.22969,0.50625 V 432.675 c 0,-0.37902 0.0186,0.50625 -2.22969,0.50625 l -139.78125,0.002 -0.002,26.33749 139.78282,0.002 c 14.81116,1.5e-4 28.58282,-11.31096 28.58282,-26.84687 v -23.64531 c 0,-15.53591 -13.77166,-26.84687 -28.58282,-26.84687 z M 358.76163,302.63658 c 6.32625,-50.82874 22.87516,-165.37715 22.87516,-168.37082 0,-3.07815 -34.42087,-31.43865 -64.84311,-55.969847 L 262.99853,34.917794 196.74361,63.718104 C 163.12834,78.330308 122.8866,96.320086 122.63963,98.814522 121.86282,106.66037 90.736205,296.195 101.25925,306.31343 c 7.9154,7.61103 228.12435,28.64824 241.4563,29.02282 12.85868,8.01511 15.17208,-25.92165 16.04608,-32.69967 z M 83.010902,325.21122 c -3.324183,-1.2756 -4.908484,-6.54873 -4.908484,-16.33718 0,-12.81019 16.863627,-159.81668 21.565366,-187.99329 1.681276,-10.07556 1.324546,-10.63347 -4.727846,-7.39432 -11.433291,6.11891 -19.657319,4.07932 -24.969037,-6.19241 C 67.213234,101.96128 65.005668,95.67611 65.065204,93.326974 65.124786,90.975926 109.52187,68.482987 163.82374,43.29285 246.61283,4.8877462 263.74588,-1.9813073 270.38442,0.57011092 281.47051,4.8308757 439.6025,133.7115 439.6025,138.48612 c 0,5.81165 -12.97759,21.22653 -17.87033,21.22653 -2.33631,0 -7.90469,-2.8765 -12.37421,-6.39222 l -8.12639,-6.39222 -12.60958,101.85445 c -6.93528,56.01995 -14.44139,104.35957 -16.68026,107.42141 -3.80017,5.19706 -10.20425,4.80296 -96.37316,-5.93093 -111.99478,-15.07042 3.49218,0.13638 -192.557668,-25.06192 z"/></svg>',
			fhem_restart: '<svg viewBox="0 0 468 468" xmlns="http://www.w3.org/2000/svg"><path d="M 28.699094,123.76564 C 90.589444,12.606476 155.68111,12.077856 156.31376,12.761996 c 6.88313,41.38028 6.92061,36.88113 6.92061,36.88113 -41.7943,15.26911 -78.176696,46.62509 -99.237296,90.447414 -42.12116,87.64458 -14.90766,210.64661 70.508686,251.6969 l 16.68081,-33.97897 67.38275,99.97796 -116.03856,-0.11269 15.31268,-33.45269 C 17.781334,363.26642 -30.391766,229.89673 28.699094,123.76564 Z M 443.63875,350.1535 C 381.7484,461.31266 316.65673,461.84128 316.02408,461.15714 c -6.88313,-41.38028 -6.92061,-36.88113 -6.92061,-36.88113 41.7943,-15.26911 78.1767,-46.62509 99.2373,-90.44741 42.12116,-87.64458 14.90766,-210.64661 -70.50869,-251.696902 L 321.15127,116.11067 253.76852,16.13271 369.80708,16.245401 354.4944,49.698092 C 454.55651,110.65273 502.72961,244.02241 443.63875,350.1535 Z M 185.51169,193.827 c -1.07278,-1.07278 -1.47693,-2.66469 -1.47693,-6.08441 0,-5.00474 3.15403,-4.34929 12.25985,-6.80123 20.33259,-5.475 24.21226,-7.31539 25.16101,0.90303 0.74186,6.42631 -4.0894,5.73251 -13.17712,8.11608 -20.81541,5.45956 -20.85449,5.77885 -22.76681,3.86653 z m 91.44127,5.4323 c -13.09766,-6.92325 -15.60486,-6.18909 -12.69883,-13.81761 2.28169,-5.98961 5.12741,-2.81281 20.9256,5.25146 10.92496,5.5767 15.53631,5.5364 14.85615,10.35238 -1.18389,8.38268 -7.76329,6.31153 -23.08292,-1.78623 z M 211.5991,302.09123 c -27.65712,-9.00933 -46.53066,-32.45977 -46.53066,-57.8145 0,-11.29665 0.33952,-11.80123 7.39026,-10.98328 6.40842,0.74344 3.2985,2.42196 5.02956,12.6342 2.94635,17.3818 13.85746,31.79382 28.30058,39.22651 33.3013,17.13744 80.02776,3.27179 86.33922,-25.46413 1.49731,-6.8172 -0.67935,-10.63713 5.91989,-10.63713 9.34398,0 9.14967,5.33224 2.58301,21.04847 -9.40409,22.50715 -26.92981,32.65932 -57.1772,33.97654 -12.5009,0.54439 -24.643,0.36252 -31.85466,-1.98668 z m 119.8341,21.44506 c 5.21574,-41.90623 18.85964,-136.34674 18.85964,-138.81491 0,-2.53781 -28.37861,-25.91989 -53.46051,-46.14486 l -44.35192,-35.7635 -54.62449,23.74468 c -27.71443,12.04717 -60.89211,26.87902 -61.09572,28.93558 -0.64045,6.46858 -26.30309,162.7322 -17.62726,171.07443 6.52592,6.27499 188.07927,23.61931 199.07092,23.92813 10.60146,6.60814 12.50876,-21.37134 13.22934,-26.95955 z m -227.34529,18.61188 c -2.74065,-1.05168 -4.04684,-5.39916 -4.04684,-13.46935 0,-10.56148 13.90337,-131.76236 17.77977,-154.99284 1.38614,-8.30688 1.09203,-8.76685 -3.89792,-6.09631 -9.42628,5.04479 -16.206661,3.36324 -20.585957,-5.10539 -2.273584,-4.39663 -4.093633,-9.5785 -4.044548,-11.51526 0.04912,-1.93835 36.652715,-20.48286 81.422405,-41.25111 68.25624,-31.663447 82.38175,-37.326703 87.85496,-35.223163 9.14003,3.512828 139.51344,109.769673 139.51344,113.706153 0,4.79147 -10.6995,17.50041 -14.73336,17.50041 -1.9262,0 -6.5171,-2.37155 -10.20204,-5.27012 l -6.69988,-5.27013 -10.39609,83.97486 c -5.71786,46.18617 -11.90633,86.04023 -13.75219,88.56459 -3.13309,4.28477 -8.41299,3.95985 -79.45576,-4.88981 -92.33515,-12.42494 2.87916,0.11244 -158.75599,-20.66253 z"/></svg>',
			menu_button: '<svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1664 1344v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45z"/></svg>',
			raw_button: '<svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M 1302,839 V 939 c 0,19 -15,37 -36,37 H 993 v 277 c 0,19 -15,37 -36,37 H 856 c -20,0 -36,-15 -36,-37 V 977 H 546 c -20,0 -36,-15 -36,-37 V 839 c 0,-19 15,-37 36,-37 H 818 V 521 c 0,-19 15,-37 36,-37 h 97 c 20,0 36,15 36,37 V 798 H 1261 c 20,0 36,15 36,37 z M 1600,331 V 1447 c 0,83 -65,151 -148,151 H 360 C 277,1600 212,1532 212,1448 V 331 C 212,246 277,180 360,180 H 1450 c 81,0 147,66 147,151 z M 1450,1428 V 350 c 0,-8 -7,-17 -17,-17 H 379 c -9,0 -17,7 -17,17 V 1428 c 0,8 7,17 17,17 H 1431 c 9,0 17,-7 17,-17 z"/></svg>',
			message_garbage: '<svg viewBox="0 0 850 850" xmlns="http://www.w3.org/2000/svg"><path d="M 327.53711,0.78320312 C 317.4992,0.75646054 297.47606,4.7952298 236.0625,17.279297 c -77.02779,15.815592 -82.006,17.281657 -89.03516,25.189453 -6.44339,7.614915 -7.03072,10.250814 -5.27343,26.066406 0.87864,9.957966 2.63698,21.964289 3.51562,26.650391 l 1.75781,9.080073 -65.021481,13.47266 c -74.3918598,15.52271 -79.0761715,17.86576 -79.0761715,39.2461 0,14.64406 10.2497655,28.99483 22.5507815,31.33789 C 30.16657,189.20091 132.38201,168.99356 267.10742,140.87695 523.96436,86.986787 515.4707,89.329644 515.4707,68.242188 c 0,-12.008135 -6.73664,-26.067631 -14.35156,-30.167969 -9.3722,-4.978983 -23.13636,-3.513907 -80.83398,8.787109 -30.45966,6.44339 -56.23278,10.542619 -57.4043,9.371094 -0.87864,-1.171525 -3.22327,-9.957875 -5.27344,-19.330078 C 353.79996,16.40065 348.23522,6.7371449 337.98438,2.9296875 334.59793,1.6483316 332.09979,0.79535884 327.53711,0.78320312 Z M 321.29102,32.509766 c 1.75728,0 4.68607,6.443941 6.44336,14.9375 2.05016,8.200677 2.3434,16.107771 1.17187,17.279296 -1.46441,0.878645 -35.14674,8.787604 -75.27148,16.988282 -55.0617,11.422372 -73.51225,14.350776 -75.26954,11.714844 -2.34305,-3.807458 -6.7358,-28.996444 -4.97851,-30.167969 0.87864,-0.878644 141.46091,-29.873309 147.9043,-30.751953 z M 143.88281,240.69336 c -90.651348,0 -104.490245,1.1543 -111.080076,4.44922 -5.271864,2.63593 -13.179045,9.3708 -17.572265,14.93554 -7.6149151,10.25085 -7.908116,11.42214 -7.6152346,51.54688 0.2928813,57.99051 32.8027916,484.71895 39.5390626,518.10742 4.39322,21.38034 13.764281,30.1668 35.4375,32.80274 8.493559,0.87864 94.307963,1.46467 190.373043,0.8789 l 174.5586,-0.8789 7.61328,-7.0293 c 11.42237,-10.54373 16.10838,-30.16616 19.33008,-76.44141 1.75728,-23.4305 3.51588,-48.3264 4.39453,-55.64843 4.39322,-37.7817 30.75195,-402.41858 30.75195,-424.0918 0,-22.25898 -4.9781,-36.60888 -16.69336,-48.03125 l -9.95898,-9.66602 -220.2461,-0.58593 c -49.86304,-0.21967 -88.61491,-0.34766 -118.83203,-0.34766 z M 63.847656,298.73828 H 257.73633 451.62305 l -1.75782,18.16016 c -1.17152,10.25084 -6.44306,82.88493 -12.00781,161.96289 -5.56474,78.78508 -13.47193,181.87922 -17.57226,228.74023 -4.10034,47.1539 -7.32227,87.5711 -7.32227,90.20703 0,4.10034 -14.64352,4.68555 -155.22656,4.68555 -130.62508,0 -155.22852,-0.58503 -155.22852,-4.09961 0,-2.34305 -3.806171,-50.6693 -8.785154,-107.48828 C 89.036555,633.79439 81.127508,530.40906 76.441406,461.28906 71.462423,391.87619 66.776994,327.14928 65.605469,316.89844 Z m 313.970704,29.67578 c -3.88247,-0.11262 -7.34249,1.20518 -13.76758,4.00586 -4.97898,2.05017 -10.83655,7.03044 -12.88672,10.83789 -4.39322,8.20068 -17.86605,410.03227 -14.05859,419.99024 6.15051,16.69423 35.14642,21.67389 48.0332,8.78711 3.80746,-3.80746 7.6155,-10.25114 8.49414,-14.0586 0.87865,-3.51457 4.39354,-96.64996 7.61524,-206.48047 6.73627,-221.71117 7.32235,-213.51177 -12.00782,-220.24804 -5.12542,-1.7939 -8.40218,-2.74639 -11.42187,-2.83399 z m -120.52148,0.0156 c -3.66102,0.0366 -7.32211,1.3543 -13.32618,3.99023 -4.97898,2.05017 -10.54349,6.73729 -12.30078,9.95899 -2.34305,4.10033 -3.22248,67.06935 -2.63672,214.38867 l 0.87891,208.23828 8.20117,7.0293 c 9.07932,7.61491 26.94455,9.66426 37.48828,3.80664 13.47254,-7.02916 13.76519,-8.78629 12.30078,-222.00391 -0.87864,-135.89694 -2.34241,-203.55253 -4.39257,-209.41016 -2.05017,-4.97898 -7.0291,-9.95773 -12.88672,-12.30078 -6.00407,-2.48949 -9.66516,-3.73387 -13.32617,-3.69726 z m -121.9961,0.68164 c -2.84465,0.0695 -5.53513,0.56426 -7.89648,1.55273 -14.64407,6.44339 -17.28108,13.17945 -16.69532,45.10352 2.34306,108.95186 12.88742,381.0369 15.23047,386.89453 6.44339,17.28 35.14456,22.55262 48.32422,9.08008 6.73627,-6.44339 7.32227,-9.37179 7.32227,-31.33789 0,-53.59729 -12.5925,-387.77528 -14.93555,-393.92578 -3.80746,-9.99458 -19.02278,-17.66837 -31.34961,-17.36719 z"/></svg>',
			info: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M 16,0 C 7.163,0 0,7.163 0,16 0,24.837 7.163,32 16,32 24.837,32 32,24.837 32,16 32,7.163 24.837,0 16,0 Z m 0,29 C 8.82,29 3,23.18 3,16 3,8.82 8.82,3 16,3 c 7.18,0 13,5.82 13,13 0,7.18 -5.82,13 -13,13 z m 4,-5 h -8 v -2 h 2 v -6 h -2 v -2 h 6 v 8 h 2 z M 14,9.5 C 14,8.675 14.675,8 15.5,8 h 1 C 17.325,8 18,8.675 18,9.5 v 1 c 0,0.825 -0.675,1.5 -1.5,1.5 h -1 C 14.675,12 14,11.325 14,10.5 Z"/></svg>',
			import: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m 19.935547,6.7871094 -12.0000001,7.9999996 12.0000001,8 v -6 c 8,0 12,-4.99 12,-9.9999996 0,0 -1.838,5.9999996 -12,5.9999996 z M 0.00195313,8 V 28 H 26.001953 v -8.394531 l -0.002,0.002 v -2.09375 c -1.026741,0.599331 -2.307487,0.900166 -4,1.125 v 4.386719 h 0.002 V 24 H 22 4 V 12 H 7.9335938 L 13.828125,8 Z"/></svg>',
			export: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M8 20c0 0 1.838-6 12-6v6l12-8-12-8v6c-8 0-12 4.99-12 10zM22 24h-18v-12h3.934c0.315-0.372 0.654-0.729 1.015-1.068 1.374-1.287 3.018-2.27 4.879-2.932h-13.827v20h26v-8.395l-4 2.667v1.728z"/></svg>',
			draggable: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m 16.023438,1.2128906 -3.976563,6.9492188 3.503906,-0.015625 -0.0098,-2.3066406 1.001953,-0.00586 0.0098,2.3085937 3.50586,-0.015625 z m 0.529296,6.9296875 -1.001953,0.00391 0.02734,5.9296876 c 0.163443,-0.04313 0.33088,-0.07422 0.507813,-0.07422 0.171255,5e-6 0.335441,0.02786 0.49414,0.06836 z m 0.02734,5.9277339 0.0078,1.976563 -0.0078,1.894531 c 0.865984,-0.220932 1.509739,-1.001063 1.509766,-1.935547 2.6e-5,-0.934483 -0.643794,-1.714565 -1.509766,-1.935547 z m 0,3.871094 c -0.158702,0.04049 -0.322885,0.06836 -0.49414,0.06836 -0.176933,-5e-6 -0.344373,-0.03108 -0.507813,-0.07422 l -0.02734,5.876953 1.001953,0.0039 z m -0.02734,5.875 -0.0098,2.308594 -1.001953,-0.0059 0.0098,-2.306641 -3.503906,-0.01563 3.974609,6.949219 4.03711,-6.914063 z m -0.974609,-5.880859 0.0078,-1.890625 -0.0078,-1.96875 c -0.85799,0.226395 -1.494115,1.000881 -1.494141,1.929687 -2.7e-5,0.928806 0.636164,1.703243 1.494141,1.929688 z"/></svg>'
		}
	}
	
	flex.helper = {
		urlParam: function(name){
			var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
			if (results==null) return null;
			return decodeURI(results[1]) || 0;
		},
		hexToRGB: function(color) {
			var rgb;
			if (color.length <= 4)
				rgb = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(color);
			else
				rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
			rgb = rgb.slice(1,rgb.length);
			for (i=0;i<rgb.length; i++)
				rgb[i] = parseInt((rgb[i].length==2) ? rgb[i] : rgb[i]+rgb[i],16);
			return rgb;
		},
		shiftColor: function(color, color2) {
			var rgb = flex.helper.hexToRGB(color);
			var rgb2 = flex.helper.hexToRGB(color2);
			var hex = ['FF','FF','FF'];
			var whitecounter = 0;
			for (i=0;i<rgb.length; i++) {
				hex[i]=Math.min(255,rgb[i]+rgb2[i]).toString(16);
				if (hex[i] == 'ff') whitecounter++;
				hex[i]=(hex[i].length==2) ? hex[i] : '0'+hex[i];
			}
			if (whitecounter > 1)
				for (i=0;i<rgb.length; i++) {
					hex[i]=Math.min(255,rgb[i]-rgb2[i]).toString(16);
					hex[i]=(hex[i].length==2) ? hex[i] : '0'+hex[i];
				}
			return '#'+hex.join('');
		},
		mixColors: function(color, color2, ratio) {
			var rgb = flex.helper.hexToRGB(color);
			var rgb2 = flex.helper.hexToRGB(color2);
			var hex = ['FF','FF','FF'];
			for (i=0;i<rgb.length; i++) {
				hex[i]=Math.min(255,Math.floor((rgb[i]+(rgb2[i]*ratio))/(1+ratio))).toString(16);
				hex[i]=(hex[i].length==2) ? hex[i] : '0'+hex[i];
			}
			return '#'+hex.join('');
		},
		gatherInformations: function() {
			flex.fhemPath = $('head').attr('root');
			flex.webName = $("body").attr("data-webName");
			flex.fwcsrf = $('body').attr('fwcsrf');
			flex.room  = flex.helper.urlParam("room") || $('#content').attr('room');
			flex.device = flex.helper.urlParam("detail");
			flex.cmd('jsonlist2 '+flex.webName,function(data){
				if (typeof data.Results[0] !== "object") return;
				if (data.Results[0].Attributes.hiddengroup)
					flex.hiddenGroups = data.Results[0].Attributes.hiddengroup.split(',');
				else flex.hiddenGroups = [];})
		},
		scrollToElement: function(elem) {
			var position = ($(elem).oldOffset().top-$('#content').oldOffset().top-10)*flex.offsetScale;
			$(window).scrollTop(position);
			//$('html').animate({scrollTop: position},500);
		},
		getFixedOffset: function(elem) {
			return $(elem).offset().top-$(window).scrollTop();
		},
		fixJqueryFunctions: function() {
			/* FIXES WHEN USING ZOOM */
			// fix scrollTop()
			$.fn.oldScrollTop = $.fn.scrollTop;
			$.fn.scrollTop = function () {
				var c = $.fn.oldScrollTop.apply(this, arguments);
				return c/flex.offsetScale;
			};
			// fix offset()
			$.fn.oldOffset = $.fn.offset;
			$.fn.offset = function () {
				var c = $.fn.oldOffset.apply(this, arguments);
				if (!c) return c;
				if (flex.browser.isSafari) // safari seem to report correct offset
					return c;
				else
					return {
						left: c.left,
						top: c.top+(1-flex.offsetScale)*$(window).scrollTop() // only required for top offset
					};
			};
			$.fn.oldPosition = $.fn.position;
			$.fn.position = function () {
				var c = $.fn.oldPosition.apply(this, arguments);
				if (!c) return c;
				return {
					left: c.left,
					top: c.top*flex.offsetScale
				};
			};
			$.fn.oldVal = $.fn.val;
			$.fn.val = function(){
				var v=$.fn.oldVal.apply(this, arguments);
				flex.test = arguments;
				if(arguments.length>0) // fire change event when setting value
					$(this).trigger('valuechange');
				return v;
			};
			$.fn.isHScrollable = function () {
				return this[0].scrollWidth > this[0].clientWidth;
			};

			$.fn.isVScrollable = function () {
				return this[0].scrollHeight > this[0].clientHeight;
			};

			$.fn.isScrollable = function () {
				return this[0].scrollWidth > this[0].clientWidth || this[0].scrollHeight > this[0].clientHeight;
			};
			
			// fix for case-sensitive attribute
			$.attrHooks['viewbox'] = {
				set: function(elem, value, name) {
					elem.setAttributeNS(null, 'viewBox', value + '');
					return value;}};
		},
		getLocation: function(callback,error) {
			// real location
			navigator.geolocation.getCurrentPosition(function(position) {
				callback(position.coords.latitude, position.coords.longitude);
			}, function(err) { // fallback to IP location
				$.ajax('http://ipapi.co/json').then(
					function success(response) {
						callback(response.latitude,response.longitude);
					},
					function fail() { //fallback to fhem location
						$.ajax(flex.fhemPath + '?cmd=jsonlist2%20global&XHR=1&fwcsrf='+flex.fwcsrf).then(
							function success (data) {
								if (data.Results[0].Attributes.latitude && data.Results[0].Attributes.longitude)
									callback(data.Results[0].Attributes.latitude, data.Results[0].Attributes.longitude);
								else
									if (error) error();
							},
							function fail() {
								if (error) error();
							}
						);
					}
				);
			});
		},
		getFingerprint: function(force) {
			flex.fingerprint = Cookies.get('flexFingerprint');
			if (!flex.fingerprint || force) {
				var callback = function(components) {
					var values = components.map(function (component) { return component.value });
					flex.components = components;
					flex.fingerprint = Fingerprint2.x64hash128(values.join(''), 31);
					Cookies.set('flexFingerprint',flex.fingerprint);
					flex.init();
				}
				var options = {excludes: {adBlock: true, enumerateDevices: true, userAgent: true, screenResolution: true, availableScreenResolution: true, pixelRatio: true, plugins: true,touchSupport: true}};
				/*if (window.requestIdleCallback) {
					requestIdleCallback(function () {Fingerprint2.get(options,callback);})
				} else {
					setTimeout(function () {Fingerprint2.get(options,callback);}, 500);
				}*/
				Fingerprint2.get(options,callback);
			} else {
				flex.init();
			} 
		}
	}
		
	flex.cmd = function(command,success) {
		this.log('executing command: '+command);
		return $.post(this.fhemPath,{cmd: command, fwcsrf: this.fwcsrf, XHR: 1},success);
	}
	
	flex.log = function(msg) {
		log('flex > '+msg);
	}
	
	flex.browser = {
		// Opera 8.0+
		isOpera: (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0,
		// Firefox 1.0+
		isFirefox: typeof InstallTrigger !== 'undefined',
		// Safari 3.0+ "[object HTMLElementConstructor]" 
		isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
		// Internet Explorer 6-11
		isIE: /*@cc_on!@*/false || !!document.documentMode,
		// Edge 20+
		isEdge: !(/*@cc_on!@*/false || !!document.documentMode) && !!window.StyleMedia,
		// Chrome 1 - 71
		isChrome: !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)
	}
	
	flex.init = function() {
		try {
			// load settings
			flex.settings.load();
			// fix jquery functions when using zoom
			flex.helper.fixJqueryFunctions();
			// modify DOM
			flex.content.init();
			flex.header.init();
			flex.menu.init();
			// show page
			$('#loadingOverlay').remove();
			// apply current settings
			flex.settings.apply();
			flex.content.check();
			flex.content.applyStyleFixesAfter();
			// applay daytime style
			if (flex.settings.local.enableDayTimeStyle)
				flex.colorPreset.applyDaytimeStyle();
			
			if (flex.helper.urlParam('pos'))
				setTimeout(function(){flex.helper.scrollToElement('.SVGlabel[data-name=svgZoomControl]')},200);
			
			// if table behaviour is enabled, it is required to check content twice.
			if (flex.settings.local.enableTableBehaviour)
				flex.content.check();
		} catch(e) {
			$('body').css('display','block');
			//return FW_okDialog(e);
		}
	}
}

// Raw code input: taken from original f18 style, thanks Rudi :)
function f18_textInput() {
  var n = "FW_mainTextInput";
  var aCM = typeof AddCodeMirror == 'function';
  $("body").append(
  '<div id="'+n+'">'+
  '<textarea rows="20" cols="90" style="width:99%;'+(aCM?'opacity:0;':'')+'"/>'+
  '</div>');
  var ta = $("#"+n+" textarea");
  if(aCM)
    AddCodeMirror(ta, function(cm) { 
      cm.on("change", function(){ ta.val(cm.getValue()) } );
    });

  $("#"+n).dialog({
    dialogClass:"no-close", modal:true, width:"auto", closeOnEscape:true, 
	title:"Raw FHEM-code input",
    maxWidth:$(window).width()*0.9, maxHeight:$(window).height()*0.9,
    buttons: [
    {text:"Execute",click:function(){ FW_execRawDef( ta.val()) }},
    {text:"Close", click:function(){ $(this).remove(); }},
    ],
    close:function(){ $("#"+n).remove(); }
  });
}

/*! js-cookie v2.2.0 | MIT */
!function(e){var n=!1;if("function"==typeof define&&define.amd&&(define(e),n=!0),"object"==typeof exports&&(module.exports=e(),n=!0),!n){var o=window.Cookies,t=window.Cookies=e();t.noConflict=function(){return window.Cookies=o,t}}}(function(){function e(){for(var e=0,n={};e<arguments.length;e++){var o=arguments[e];for(var t in o)n[t]=o[t]}return n}function n(o){function t(n,r,i){var c;if("undefined"!=typeof document){if(arguments.length>1){if("number"==typeof(i=e({path:"/"},t.defaults,i)).expires){var a=new Date;a.setMilliseconds(a.getMilliseconds()+864e5*i.expires),i.expires=a}i.expires=i.expires?i.expires.toUTCString():"";try{c=JSON.stringify(r),/^[\{\[]/.test(c)&&(r=c)}catch(e){}r=o.write?o.write(r,n):encodeURIComponent(r+"").replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),n=(n=(n=encodeURIComponent(n+"")).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent)).replace(/[\(\)]/g,escape);var s="";for(var f in i)i[f]&&(s+="; "+f,!0!==i[f]&&(s+="="+i[f]));return document.cookie=n+"="+r+s}n||(c={});for(var p=document.cookie?document.cookie.split("; "):[],d=/(%[0-9A-Z]{2})+/g,u=0;u<p.length;u++){var l=p[u].split("="),C=l.slice(1).join("=");this.json||'"'!==C.charAt(0)||(C=C.slice(1,-1));try{var m=l[0].replace(d,decodeURIComponent);if(C=o.read?o.read(C,m):o(C,m)||C.replace(d,decodeURIComponent),this.json)try{C=JSON.parse(C)}catch(e){}if(n===m){c=C;break}n||(c[m]=C)}catch(e){}}return c}}return t.set=t,t.get=function(e){return t.call(t,e)},t.getJSON=function(){return t.apply({json:!0},[].slice.call(arguments))},t.defaults={},t.remove=function(n,o){t(n,"",e(o,{expires:-1}))},t.withConverter=n,t}return n(function(){})});
/*!
 * jQuery UI Touch Punch 0.2.3
 *
 * Copyright 2011-2014, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */
!function(a){function f(a,b){if(!(a.originalEvent.touches.length>1)){a.preventDefault();var c=a.originalEvent.changedTouches[0],d=document.createEvent("MouseEvents");d.initMouseEvent(b,!0,!0,window,1,c.screenX,c.screenY,c.clientX,c.clientY,!1,!1,!1,!1,0,null),a.target.dispatchEvent(d)}}if(a.support.touch="ontouchend"in document,a.support.touch){var e,b=a.ui.mouse.prototype,c=b._mouseInit,d=b._mouseDestroy;b._touchStart=function(a){var b=this;!e&&b._mouseCapture(a.originalEvent.changedTouches[0])&&(e=!0,b._touchMoved=!1,f(a,"mouseover"),f(a,"mousemove"),f(a,"mousedown"))},b._touchMove=function(a){e&&(this._touchMoved=!0,f(a,"mousemove"))},b._touchEnd=function(a){e&&(f(a,"mouseup"),f(a,"mouseout"),this._touchMoved||f(a,"click"),e=!1)},b._mouseInit=function(){var b=this;b.element.bind({touchstart:a.proxy(b,"_touchStart"),touchmove:a.proxy(b,"_touchMove"),touchend:a.proxy(b,"_touchEnd")}),c.call(b)},b._mouseDestroy=function(){var b=this;b.element.unbind({touchstart:a.proxy(b,"_touchStart"),touchmove:a.proxy(b,"_touchMove"),touchend:a.proxy(b,"_touchEnd")}),d.call(b)}}}(jQuery);
/*! By Matt Kane (@ascorbic). Copyright © 2012 Triggertrap Ltd. All Rights Reserved. 
 * https://github.com/udivankin/sunrise-sunset
 */
var SunriseSunsetJS=function(t){"use strict";var n=90.8333,e=15,a=36e5;function r(t){return Math.sin(2*t*Math.PI/360)}function u(t){return 360*Math.acos(t)/(2*Math.PI)}function i(t){return Math.cos(2*t*Math.PI/360)}function h(t,n){var e=t%n;return e<0?e+n:e}function o(t,n,o,M,c){var f,g,s=function(t){return Math.ceil((t.getTime()-new Date(t.getFullYear(),0,1).getTime())/864e5)}(c),l=n/e,v=o?s+(6-l)/24:s+(18-l)/24,D=.9856*v-3.289,I=h(D+1.916*r(D)+.02*r(2*D)+282.634,360),P=.91764*(f=I,Math.tan(2*f*Math.PI/360));g=h(g=360/(2*Math.PI)*Math.atan(P),360),g+=90*Math.floor(I/90)-90*Math.floor(g/90),g/=e;var S,w=.39782*r(I),T=i((S=w,360*Math.asin(S)/(2*Math.PI))),d=(i(M)-w*r(t))/(T*i(t)),m=h((o?360-u(d):u(d))/e+g-.06571*v-6.622-n/e,24),F=Date.UTC(c.getFullYear(),c.getMonth(),c.getDate());return new Date(F+m*a)}return t.getSunrise=function(t,e){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:new Date;return o(t,e,!0,n,a)},t.getSunset=function(t,e){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:new Date;return o(t,e,!1,n,a)},t}({});

/*! Fingerprintjs2 2.1.0 | MIT 
 * https://github.com/Valve/fingerprintjs2 */
!function(e,t,n){"use strict";"undefined"!=typeof window&&"function"==typeof define&&define.amd?define(n):"undefined"!=typeof module&&module.exports?module.exports=n():t.exports?t.exports=n():t.Fingerprint2=n()}(0,this,function(){"use strict";var e=function(e,t){e=[e[0]>>>16,65535&e[0],e[1]>>>16,65535&e[1]],t=[t[0]>>>16,65535&t[0],t[1]>>>16,65535&t[1]];var n=[0,0,0,0];return n[3]+=e[3]+t[3],n[2]+=n[3]>>>16,n[3]&=65535,n[2]+=e[2]+t[2],n[1]+=n[2]>>>16,n[2]&=65535,n[1]+=e[1]+t[1],n[0]+=n[1]>>>16,n[1]&=65535,n[0]+=e[0]+t[0],n[0]&=65535,[n[0]<<16|n[1],n[2]<<16|n[3]]},t=function(e,t){e=[e[0]>>>16,65535&e[0],e[1]>>>16,65535&e[1]],t=[t[0]>>>16,65535&t[0],t[1]>>>16,65535&t[1]];var n=[0,0,0,0];return n[3]+=e[3]*t[3],n[2]+=n[3]>>>16,n[3]&=65535,n[2]+=e[2]*t[3],n[1]+=n[2]>>>16,n[2]&=65535,n[2]+=e[3]*t[2],n[1]+=n[2]>>>16,n[2]&=65535,n[1]+=e[1]*t[3],n[0]+=n[1]>>>16,n[1]&=65535,n[1]+=e[2]*t[2],n[0]+=n[1]>>>16,n[1]&=65535,n[1]+=e[3]*t[1],n[0]+=n[1]>>>16,n[1]&=65535,n[0]+=e[0]*t[3]+e[1]*t[2]+e[2]*t[1]+e[3]*t[0],n[0]&=65535,[n[0]<<16|n[1],n[2]<<16|n[3]]},n=function(e,t){return 32===(t%=64)?[e[1],e[0]]:t<32?[e[0]<<t|e[1]>>>32-t,e[1]<<t|e[0]>>>32-t]:(t-=32,[e[1]<<t|e[0]>>>32-t,e[0]<<t|e[1]>>>32-t])},a=function(e,t){return 0===(t%=64)?e:t<32?[e[0]<<t|e[1]>>>32-t,e[1]<<t]:[e[1]<<t-32,0]},r=function(e,t){return[e[0]^t[0],e[1]^t[1]]},i=function(e){return e=r(e,[0,e[0]>>>1]),e=t(e,[4283543511,3981806797]),e=r(e,[0,e[0]>>>1]),e=t(e,[3301882366,444984403]),e=r(e,[0,e[0]>>>1])},o=function(o,l){l=l||0;for(var s=(o=o||"").length%16,c=o.length-s,u=[0,l],d=[0,l],g=[0,0],f=[0,0],h=[2277735313,289559509],m=[1291169091,658871167],p=0;p<c;p+=16)g=[255&o.charCodeAt(p+4)|(255&o.charCodeAt(p+5))<<8|(255&o.charCodeAt(p+6))<<16|(255&o.charCodeAt(p+7))<<24,255&o.charCodeAt(p)|(255&o.charCodeAt(p+1))<<8|(255&o.charCodeAt(p+2))<<16|(255&o.charCodeAt(p+3))<<24],f=[255&o.charCodeAt(p+12)|(255&o.charCodeAt(p+13))<<8|(255&o.charCodeAt(p+14))<<16|(255&o.charCodeAt(p+15))<<24,255&o.charCodeAt(p+8)|(255&o.charCodeAt(p+9))<<8|(255&o.charCodeAt(p+10))<<16|(255&o.charCodeAt(p+11))<<24],g=t(g,h),g=n(g,31),g=t(g,m),u=r(u,g),u=n(u,27),u=e(u,d),u=e(t(u,[0,5]),[0,1390208809]),f=t(f,m),f=n(f,33),f=t(f,h),d=r(d,f),d=n(d,31),d=e(d,u),d=e(t(d,[0,5]),[0,944331445]);switch(g=[0,0],f=[0,0],s){case 15:f=r(f,a([0,o.charCodeAt(p+14)],48));case 14:f=r(f,a([0,o.charCodeAt(p+13)],40));case 13:f=r(f,a([0,o.charCodeAt(p+12)],32));case 12:f=r(f,a([0,o.charCodeAt(p+11)],24));case 11:f=r(f,a([0,o.charCodeAt(p+10)],16));case 10:f=r(f,a([0,o.charCodeAt(p+9)],8));case 9:f=r(f,[0,o.charCodeAt(p+8)]),f=t(f,m),f=n(f,33),f=t(f,h),d=r(d,f);case 8:g=r(g,a([0,o.charCodeAt(p+7)],56));case 7:g=r(g,a([0,o.charCodeAt(p+6)],48));case 6:g=r(g,a([0,o.charCodeAt(p+5)],40));case 5:g=r(g,a([0,o.charCodeAt(p+4)],32));case 4:g=r(g,a([0,o.charCodeAt(p+3)],24));case 3:g=r(g,a([0,o.charCodeAt(p+2)],16));case 2:g=r(g,a([0,o.charCodeAt(p+1)],8));case 1:g=r(g,[0,o.charCodeAt(p)]),g=t(g,h),g=n(g,31),g=t(g,m),u=r(u,g)}return u=r(u,[0,o.length]),d=r(d,[0,o.length]),u=e(u,d),d=e(d,u),u=i(u),d=i(d),u=e(u,d),d=e(d,u),("00000000"+(u[0]>>>0).toString(16)).slice(-8)+("00000000"+(u[1]>>>0).toString(16)).slice(-8)+("00000000"+(d[0]>>>0).toString(16)).slice(-8)+("00000000"+(d[1]>>>0).toString(16)).slice(-8)},l={preprocessor:null,audio:{timeout:1e3,excludeIOS11:!0},fonts:{swfContainerId:"fingerprintjs2",swfPath:"flash/compiled/FontList.swf",userDefinedFonts:[],extendedJsFonts:!1},screen:{detectScreenOrientation:!0},plugins:{sortPluginsFor:[/palemoon/i],excludeIE:!1},extraComponents:[],excludes:{enumerateDevices:!0,pixelRatio:!0,doNotTrack:!0,fontsFlash:!0},NOT_AVAILABLE:"not available",ERROR:"error",EXCLUDED:"excluded"},s=function(e,t){if(Array.prototype.forEach&&e.forEach===Array.prototype.forEach)e.forEach(t);else if(e.length===+e.length)for(var n=0,a=e.length;n<a;n++)t(e[n],n,e);else for(var r in e)e.hasOwnProperty(r)&&t(e[r],r,e)},c=function(e,t){var n=[];return null==e?n:Array.prototype.map&&e.map===Array.prototype.map?e.map(t):(s(e,function(e,a,r){n.push(t(e,a,r))}),n)},u=function(){return navigator.mediaDevices&&navigator.mediaDevices.enumerateDevices},d=function(e){var t=[window.screen.width,window.screen.height];return e.screen.detectScreenOrientation&&t.sort().reverse(),t},g=function(e){if(window.screen.availWidth&&window.screen.availHeight){var t=[window.screen.availHeight,window.screen.availWidth];return e.screen.detectScreenOrientation&&t.sort().reverse(),t}return e.NOT_AVAILABLE},f=function(e){if(null==navigator.plugins)return e.NOT_AVAILABLE;for(var t=[],n=0,a=navigator.plugins.length;n<a;n++)navigator.plugins[n]&&t.push(navigator.plugins[n]);return m(e)&&(t=t.sort(function(e,t){return e.name>t.name?1:e.name<t.name?-1:0})),c(t,function(e){var t=c(e,function(e){return[e.type,e.suffixes]});return[e.name,e.description,t]})},h=function(e){var t=[];if(Object.getOwnPropertyDescriptor&&Object.getOwnPropertyDescriptor(window,"ActiveXObject")||"ActiveXObject"in window){t=c(["AcroPDF.PDF","Adodb.Stream","AgControl.AgControl","DevalVRXCtrl.DevalVRXCtrl.1","MacromediaFlashPaper.MacromediaFlashPaper","Msxml2.DOMDocument","Msxml2.XMLHTTP","PDF.PdfCtrl","QuickTime.QuickTime","QuickTimeCheckObject.QuickTimeCheck.1","RealPlayer","RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)","RealVideo.RealVideo(tm) ActiveX Control (32-bit)","Scripting.Dictionary","SWCtl.SWCtl","Shell.UIHelper","ShockwaveFlash.ShockwaveFlash","Skype.Detection","TDCCtl.TDCCtl","WMPlayer.OCX","rmocx.RealPlayer G2 Control","rmocx.RealPlayer G2 Control.1"],function(t){try{return new window.ActiveXObject(t),t}catch(t){return e.ERROR}})}else t.push(e.NOT_AVAILABLE);return navigator.plugins&&(t=t.concat(f(e))),t},m=function(e){for(var t=!1,n=0,a=e.plugins.sortPluginsFor.length;n<a;n++){var r=e.plugins.sortPluginsFor[n];if(navigator.userAgent.match(r)){t=!0;break}}return t},p=function(e){try{return!!window.sessionStorage}catch(t){return e.ERROR}},T=function(e){try{return!!window.localStorage}catch(t){return e.ERROR}},v=function(e){try{return!!window.indexedDB}catch(t){return e.ERROR}},A=function(e){return navigator.hardwareConcurrency?navigator.hardwareConcurrency:e.NOT_AVAILABLE},S=function(e){return navigator.cpuClass||e.NOT_AVAILABLE},C=function(e){return navigator.platform?navigator.platform:e.NOT_AVAILABLE},B=function(e){return navigator.doNotTrack?navigator.doNotTrack:navigator.msDoNotTrack?navigator.msDoNotTrack:window.doNotTrack?window.doNotTrack:e.NOT_AVAILABLE},w=function(){var e,t=0;void 0!==navigator.maxTouchPoints?t=navigator.maxTouchPoints:void 0!==navigator.msMaxTouchPoints&&(t=navigator.msMaxTouchPoints);try{document.createEvent("TouchEvent"),e=!0}catch(t){e=!1}return[t,e,"ontouchstart"in window]},y=function(e){var t=[],n=document.createElement("canvas");n.width=2e3,n.height=200,n.style.display="inline";var a=n.getContext("2d");return a.rect(0,0,10,10),a.rect(2,2,6,6),t.push("canvas winding:"+(!1===a.isPointInPath(5,5,"evenodd")?"yes":"no")),a.textBaseline="alphabetic",a.fillStyle="#f60",a.fillRect(125,1,62,20),a.fillStyle="#069",e.dontUseFakeFontInCanvas?a.font="11pt Arial":a.font="11pt no-real-font-123",a.fillText("Cwm fjordbank glyphs vext quiz, 😃",2,15),a.fillStyle="rgba(102, 204, 0, 0.2)",a.font="18pt Arial",a.fillText("Cwm fjordbank glyphs vext quiz, 😃",4,45),a.globalCompositeOperation="multiply",a.fillStyle="rgb(255,0,255)",a.beginPath(),a.arc(50,50,50,0,2*Math.PI,!0),a.closePath(),a.fill(),a.fillStyle="rgb(0,255,255)",a.beginPath(),a.arc(100,50,50,0,2*Math.PI,!0),a.closePath(),a.fill(),a.fillStyle="rgb(255,255,0)",a.beginPath(),a.arc(75,100,50,0,2*Math.PI,!0),a.closePath(),a.fill(),a.fillStyle="rgb(255,0,255)",a.arc(75,75,75,0,2*Math.PI,!0),a.arc(75,75,25,0,2*Math.PI,!0),a.fill("evenodd"),n.toDataURL&&t.push("canvas fp:"+n.toDataURL()),t},E=function(){var e,t=function(t){return e.clearColor(0,0,0,1),e.enable(e.DEPTH_TEST),e.depthFunc(e.LEQUAL),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),"["+t[0]+", "+t[1]+"]"};if(!(e=F()))return null;var n=[],a=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,a);var r=new Float32Array([-.2,-.9,0,.4,-.26,0,0,.732134444,0]);e.bufferData(e.ARRAY_BUFFER,r,e.STATIC_DRAW),a.itemSize=3,a.numItems=3;var i=e.createProgram(),o=e.createShader(e.VERTEX_SHADER);e.shaderSource(o,"attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}"),e.compileShader(o);var l=e.createShader(e.FRAGMENT_SHADER);e.shaderSource(l,"precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}"),e.compileShader(l),e.attachShader(i,o),e.attachShader(i,l),e.linkProgram(i),e.useProgram(i),i.vertexPosAttrib=e.getAttribLocation(i,"attrVertex"),i.offsetUniform=e.getUniformLocation(i,"uniformOffset"),e.enableVertexAttribArray(i.vertexPosArray),e.vertexAttribPointer(i.vertexPosAttrib,a.itemSize,e.FLOAT,!1,0,0),e.uniform2f(i.offsetUniform,1,1),e.drawArrays(e.TRIANGLE_STRIP,0,a.numItems);try{n.push(e.canvas.toDataURL())}catch(e){}n.push("extensions:"+(e.getSupportedExtensions()||[]).join(";")),n.push("webgl aliased line width range:"+t(e.getParameter(e.ALIASED_LINE_WIDTH_RANGE))),n.push("webgl aliased point size range:"+t(e.getParameter(e.ALIASED_POINT_SIZE_RANGE))),n.push("webgl alpha bits:"+e.getParameter(e.ALPHA_BITS)),n.push("webgl antialiasing:"+(e.getContextAttributes().antialias?"yes":"no")),n.push("webgl blue bits:"+e.getParameter(e.BLUE_BITS)),n.push("webgl depth bits:"+e.getParameter(e.DEPTH_BITS)),n.push("webgl green bits:"+e.getParameter(e.GREEN_BITS)),n.push("webgl max anisotropy:"+function(e){var t=e.getExtension("EXT_texture_filter_anisotropic")||e.getExtension("WEBKIT_EXT_texture_filter_anisotropic")||e.getExtension("MOZ_EXT_texture_filter_anisotropic");if(t){var n=e.getParameter(t.MAX_TEXTURE_MAX_ANISOTROPY_EXT);return 0===n&&(n=2),n}return null}(e)),n.push("webgl max combined texture image units:"+e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS)),n.push("webgl max cube map texture size:"+e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE)),n.push("webgl max fragment uniform vectors:"+e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS)),n.push("webgl max render buffer size:"+e.getParameter(e.MAX_RENDERBUFFER_SIZE)),n.push("webgl max texture image units:"+e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS)),n.push("webgl max texture size:"+e.getParameter(e.MAX_TEXTURE_SIZE)),n.push("webgl max varying vectors:"+e.getParameter(e.MAX_VARYING_VECTORS)),n.push("webgl max vertex attribs:"+e.getParameter(e.MAX_VERTEX_ATTRIBS)),n.push("webgl max vertex texture image units:"+e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS)),n.push("webgl max vertex uniform vectors:"+e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS)),n.push("webgl max viewport dims:"+t(e.getParameter(e.MAX_VIEWPORT_DIMS))),n.push("webgl red bits:"+e.getParameter(e.RED_BITS)),n.push("webgl renderer:"+e.getParameter(e.RENDERER)),n.push("webgl shading language version:"+e.getParameter(e.SHADING_LANGUAGE_VERSION)),n.push("webgl stencil bits:"+e.getParameter(e.STENCIL_BITS)),n.push("webgl vendor:"+e.getParameter(e.VENDOR)),n.push("webgl version:"+e.getParameter(e.VERSION));try{var c=e.getExtension("WEBGL_debug_renderer_info");c&&(n.push("webgl unmasked vendor:"+e.getParameter(c.UNMASKED_VENDOR_WEBGL)),n.push("webgl unmasked renderer:"+e.getParameter(c.UNMASKED_RENDERER_WEBGL)))}catch(e){}return e.getShaderPrecisionFormat?(s(["FLOAT","INT"],function(t){s(["VERTEX","FRAGMENT"],function(a){s(["HIGH","MEDIUM","LOW"],function(r){s(["precision","rangeMin","rangeMax"],function(i){var o=e.getShaderPrecisionFormat(e[a+"_SHADER"],e[r+"_"+t])[i];"precision"!==i&&(i="precision "+i);var l=["webgl ",a.toLowerCase()," shader ",r.toLowerCase()," ",t.toLowerCase()," ",i,":",o].join("");n.push(l)})})})}),n):n},M=function(){try{var e=F(),t=e.getExtension("WEBGL_debug_renderer_info");return e.getParameter(t.UNMASKED_VENDOR_WEBGL)+"~"+e.getParameter(t.UNMASKED_RENDERER_WEBGL)}catch(e){return null}},x=function(){var e=document.createElement("div");e.innerHTML="&nbsp;",e.className="adsbox";var t=!1;try{document.body.appendChild(e),t=0===document.getElementsByClassName("adsbox")[0].offsetHeight,document.body.removeChild(e)}catch(e){t=!1}return t},O=function(){if(void 0!==navigator.languages)try{if(navigator.languages[0].substr(0,2)!==navigator.language.substr(0,2))return!0}catch(e){return!0}return!1},b=function(){return window.screen.width<window.screen.availWidth||window.screen.height<window.screen.availHeight},P=function(){var e,t=navigator.userAgent.toLowerCase(),n=navigator.oscpu,a=navigator.platform.toLowerCase();if(e=t.indexOf("windows phone")>=0?"Windows Phone":t.indexOf("win")>=0?"Windows":t.indexOf("android")>=0?"Android":t.indexOf("linux")>=0||t.indexOf("cros")>=0?"Linux":t.indexOf("iphone")>=0||t.indexOf("ipad")>=0?"iOS":t.indexOf("mac")>=0?"Mac":"Other",("ontouchstart"in window||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0)&&"Windows Phone"!==e&&"Android"!==e&&"iOS"!==e&&"Other"!==e)return!0;if(void 0!==n){if((n=n.toLowerCase()).indexOf("win")>=0&&"Windows"!==e&&"Windows Phone"!==e)return!0;if(n.indexOf("linux")>=0&&"Linux"!==e&&"Android"!==e)return!0;if(n.indexOf("mac")>=0&&"Mac"!==e&&"iOS"!==e)return!0;if((-1===n.indexOf("win")&&-1===n.indexOf("linux")&&-1===n.indexOf("mac"))!=("Other"===e))return!0}return a.indexOf("win")>=0&&"Windows"!==e&&"Windows Phone"!==e||((a.indexOf("linux")>=0||a.indexOf("android")>=0||a.indexOf("pike")>=0)&&"Linux"!==e&&"Android"!==e||((a.indexOf("mac")>=0||a.indexOf("ipad")>=0||a.indexOf("ipod")>=0||a.indexOf("iphone")>=0)&&"Mac"!==e&&"iOS"!==e||((a.indexOf("win")<0&&a.indexOf("linux")<0&&a.indexOf("mac")<0&&a.indexOf("iphone")<0&&a.indexOf("ipad")<0)!==("Other"===e)||void 0===navigator.plugins&&"Windows"!==e&&"Windows Phone"!==e)))},L=function(){var e,t=navigator.userAgent.toLowerCase(),n=navigator.productSub;if(("Chrome"===(e=t.indexOf("firefox")>=0?"Firefox":t.indexOf("opera")>=0||t.indexOf("opr")>=0?"Opera":t.indexOf("chrome")>=0?"Chrome":t.indexOf("safari")>=0?"Safari":t.indexOf("trident")>=0?"Internet Explorer":"Other")||"Safari"===e||"Opera"===e)&&"20030107"!==n)return!0;var a,r=eval.toString().length;if(37===r&&"Safari"!==e&&"Firefox"!==e&&"Other"!==e)return!0;if(39===r&&"Internet Explorer"!==e&&"Other"!==e)return!0;if(33===r&&"Chrome"!==e&&"Opera"!==e&&"Other"!==e)return!0;try{throw"a"}catch(e){try{e.toSource(),a=!0}catch(e){a=!1}}return a&&"Firefox"!==e&&"Other"!==e},I=function(){var e=document.createElement("canvas");return!(!e.getContext||!e.getContext("2d"))},k=function(){if(!I())return!1;var e=F();return!!window.WebGLRenderingContext&&!!e},R=function(){return"Microsoft Internet Explorer"===navigator.appName||!("Netscape"!==navigator.appName||!/Trident/.test(navigator.userAgent))},D=function(){return void 0!==window.swfobject},_=function(){return window.swfobject.hasFlashPlayerVersion("9.0.0")},N=function(e,t){window.___fp_swf_loaded=function(t){e(t)};var n=t.fonts.swfContainerId;!function(e){var t=document.createElement("div");t.setAttribute("id",e.fonts.swfContainerId),document.body.appendChild(t)}();var a={onReady:"___fp_swf_loaded"};window.swfobject.embedSWF(t.fonts.swfPath,n,"1","1","9.0.0",!1,a,{allowScriptAccess:"always",menu:"false"},{})},F=function(){var e=document.createElement("canvas"),t=null;try{t=e.getContext("webgl")||e.getContext("experimental-webgl")}catch(e){}return t||(t=null),t},G=[{key:"userAgent",getData:function(e){e(navigator.userAgent)}},{key:"webdriver",getData:function(e,t){e(null==navigator.webdriver?t.NOT_AVAILABLE:navigator.webdriver)}},{key:"language",getData:function(e,t){e(navigator.language||navigator.userLanguage||navigator.browserLanguage||navigator.systemLanguage||t.NOT_AVAILABLE)}},{key:"colorDepth",getData:function(e,t){e(window.screen.colorDepth||t.NOT_AVAILABLE)}},{key:"deviceMemory",getData:function(e,t){e(navigator.deviceMemory||t.NOT_AVAILABLE)}},{key:"pixelRatio",getData:function(e,t){e(window.devicePixelRatio||t.NOT_AVAILABLE)}},{key:"hardwareConcurrency",getData:function(e,t){e(A(t))}},{key:"screenResolution",getData:function(e,t){e(d(t))}},{key:"availableScreenResolution",getData:function(e,t){e(g(t))}},{key:"timezoneOffset",getData:function(e){e((new Date).getTimezoneOffset())}},{key:"timezone",getData:function(e,t){window.Intl&&window.Intl.DateTimeFormat?e((new window.Intl.DateTimeFormat).resolvedOptions().timeZone):e(t.NOT_AVAILABLE)}},{key:"sessionStorage",getData:function(e,t){e(p(t))}},{key:"localStorage",getData:function(e,t){e(T(t))}},{key:"indexedDb",getData:function(e,t){e(v(t))}},{key:"addBehavior",getData:function(e){e(!(!document.body||!document.body.addBehavior))}},{key:"openDatabase",getData:function(e){e(!!window.openDatabase)}},{key:"cpuClass",getData:function(e,t){e(S(t))}},{key:"platform",getData:function(e,t){e(C(t))}},{key:"doNotTrack",getData:function(e,t){e(B(t))}},{key:"plugins",getData:function(e,t){R()?t.plugins.excludeIE?e(t.EXCLUDED):e(h(t)):e(f(t))}},{key:"canvas",getData:function(e,t){I()?e(y(t)):e(t.NOT_AVAILABLE)}},{key:"webgl",getData:function(e,t){k()?e(E()):e(t.NOT_AVAILABLE)}},{key:"webglVendorAndRenderer",getData:function(e){k()?e(M()):e()}},{key:"adBlock",getData:function(e){e(x())}},{key:"hasLiedLanguages",getData:function(e){e(O())}},{key:"hasLiedResolution",getData:function(e){e(b())}},{key:"hasLiedOs",getData:function(e){e(P())}},{key:"hasLiedBrowser",getData:function(e){e(L())}},{key:"touchSupport",getData:function(e){e(w())}},{key:"fonts",getData:function(e,t){var n=["monospace","sans-serif","serif"],a=["Andale Mono","Arial","Arial Black","Arial Hebrew","Arial MT","Arial Narrow","Arial Rounded MT Bold","Arial Unicode MS","Bitstream Vera Sans Mono","Book Antiqua","Bookman Old Style","Calibri","Cambria","Cambria Math","Century","Century Gothic","Century Schoolbook","Comic Sans","Comic Sans MS","Consolas","Courier","Courier New","Geneva","Georgia","Helvetica","Helvetica Neue","Impact","Lucida Bright","Lucida Calligraphy","Lucida Console","Lucida Fax","LUCIDA GRANDE","Lucida Handwriting","Lucida Sans","Lucida Sans Typewriter","Lucida Sans Unicode","Microsoft Sans Serif","Monaco","Monotype Corsiva","MS Gothic","MS Outlook","MS PGothic","MS Reference Sans Serif","MS Sans Serif","MS Serif","MYRIAD","MYRIAD PRO","Palatino","Palatino Linotype","Segoe Print","Segoe Script","Segoe UI","Segoe UI Light","Segoe UI Semibold","Segoe UI Symbol","Tahoma","Times","Times New Roman","Times New Roman PS","Trebuchet MS","Verdana","Wingdings","Wingdings 2","Wingdings 3"];t.fonts.extendedJsFonts&&(a=a.concat(["Abadi MT Condensed Light","Academy Engraved LET","ADOBE CASLON PRO","Adobe Garamond","ADOBE GARAMOND PRO","Agency FB","Aharoni","Albertus Extra Bold","Albertus Medium","Algerian","Amazone BT","American Typewriter","American Typewriter Condensed","AmerType Md BT","Andalus","Angsana New","AngsanaUPC","Antique Olive","Aparajita","Apple Chancery","Apple Color Emoji","Apple SD Gothic Neo","Arabic Typesetting","ARCHER","ARNO PRO","Arrus BT","Aurora Cn BT","AvantGarde Bk BT","AvantGarde Md BT","AVENIR","Ayuthaya","Bandy","Bangla Sangam MN","Bank Gothic","BankGothic Md BT","Baskerville","Baskerville Old Face","Batang","BatangChe","Bauer Bodoni","Bauhaus 93","Bazooka","Bell MT","Bembo","Benguiat Bk BT","Berlin Sans FB","Berlin Sans FB Demi","Bernard MT Condensed","BernhardFashion BT","BernhardMod BT","Big Caslon","BinnerD","Blackadder ITC","BlairMdITC TT","Bodoni 72","Bodoni 72 Oldstyle","Bodoni 72 Smallcaps","Bodoni MT","Bodoni MT Black","Bodoni MT Condensed","Bodoni MT Poster Compressed","Bookshelf Symbol 7","Boulder","Bradley Hand","Bradley Hand ITC","Bremen Bd BT","Britannic Bold","Broadway","Browallia New","BrowalliaUPC","Brush Script MT","Californian FB","Calisto MT","Calligrapher","Candara","CaslonOpnface BT","Castellar","Centaur","Cezanne","CG Omega","CG Times","Chalkboard","Chalkboard SE","Chalkduster","Charlesworth","Charter Bd BT","Charter BT","Chaucer","ChelthmITC Bk BT","Chiller","Clarendon","Clarendon Condensed","CloisterBlack BT","Cochin","Colonna MT","Constantia","Cooper Black","Copperplate","Copperplate Gothic","Copperplate Gothic Bold","Copperplate Gothic Light","CopperplGoth Bd BT","Corbel","Cordia New","CordiaUPC","Cornerstone","Coronet","Cuckoo","Curlz MT","DaunPenh","Dauphin","David","DB LCD Temp","DELICIOUS","Denmark","DFKai-SB","Didot","DilleniaUPC","DIN","DokChampa","Dotum","DotumChe","Ebrima","Edwardian Script ITC","Elephant","English 111 Vivace BT","Engravers MT","EngraversGothic BT","Eras Bold ITC","Eras Demi ITC","Eras Light ITC","Eras Medium ITC","EucrosiaUPC","Euphemia","Euphemia UCAS","EUROSTILE","Exotc350 Bd BT","FangSong","Felix Titling","Fixedsys","FONTIN","Footlight MT Light","Forte","FrankRuehl","Fransiscan","Freefrm721 Blk BT","FreesiaUPC","Freestyle Script","French Script MT","FrnkGothITC Bk BT","Fruitger","FRUTIGER","Futura","Futura Bk BT","Futura Lt BT","Futura Md BT","Futura ZBlk BT","FuturaBlack BT","Gabriola","Galliard BT","Gautami","Geeza Pro","Geometr231 BT","Geometr231 Hv BT","Geometr231 Lt BT","GeoSlab 703 Lt BT","GeoSlab 703 XBd BT","Gigi","Gill Sans","Gill Sans MT","Gill Sans MT Condensed","Gill Sans MT Ext Condensed Bold","Gill Sans Ultra Bold","Gill Sans Ultra Bold Condensed","Gisha","Gloucester MT Extra Condensed","GOTHAM","GOTHAM BOLD","Goudy Old Style","Goudy Stout","GoudyHandtooled BT","GoudyOLSt BT","Gujarati Sangam MN","Gulim","GulimChe","Gungsuh","GungsuhChe","Gurmukhi MN","Haettenschweiler","Harlow Solid Italic","Harrington","Heather","Heiti SC","Heiti TC","HELV","Herald","High Tower Text","Hiragino Kaku Gothic ProN","Hiragino Mincho ProN","Hoefler Text","Humanst 521 Cn BT","Humanst521 BT","Humanst521 Lt BT","Imprint MT Shadow","Incised901 Bd BT","Incised901 BT","Incised901 Lt BT","INCONSOLATA","Informal Roman","Informal011 BT","INTERSTATE","IrisUPC","Iskoola Pota","JasmineUPC","Jazz LET","Jenson","Jester","Jokerman","Juice ITC","Kabel Bk BT","Kabel Ult BT","Kailasa","KaiTi","Kalinga","Kannada Sangam MN","Kartika","Kaufmann Bd BT","Kaufmann BT","Khmer UI","KodchiangUPC","Kokila","Korinna BT","Kristen ITC","Krungthep","Kunstler Script","Lao UI","Latha","Leelawadee","Letter Gothic","Levenim MT","LilyUPC","Lithograph","Lithograph Light","Long Island","Lydian BT","Magneto","Maiandra GD","Malayalam Sangam MN","Malgun Gothic","Mangal","Marigold","Marion","Marker Felt","Market","Marlett","Matisse ITC","Matura MT Script Capitals","Meiryo","Meiryo UI","Microsoft Himalaya","Microsoft JhengHei","Microsoft New Tai Lue","Microsoft PhagsPa","Microsoft Tai Le","Microsoft Uighur","Microsoft YaHei","Microsoft Yi Baiti","MingLiU","MingLiU_HKSCS","MingLiU_HKSCS-ExtB","MingLiU-ExtB","Minion","Minion Pro","Miriam","Miriam Fixed","Mistral","Modern","Modern No. 20","Mona Lisa Solid ITC TT","Mongolian Baiti","MONO","MoolBoran","Mrs Eaves","MS LineDraw","MS Mincho","MS PMincho","MS Reference Specialty","MS UI Gothic","MT Extra","MUSEO","MV Boli","Nadeem","Narkisim","NEVIS","News Gothic","News GothicMT","NewsGoth BT","Niagara Engraved","Niagara Solid","Noteworthy","NSimSun","Nyala","OCR A Extended","Old Century","Old English Text MT","Onyx","Onyx BT","OPTIMA","Oriya Sangam MN","OSAKA","OzHandicraft BT","Palace Script MT","Papyrus","Parchment","Party LET","Pegasus","Perpetua","Perpetua Titling MT","PetitaBold","Pickwick","Plantagenet Cherokee","Playbill","PMingLiU","PMingLiU-ExtB","Poor Richard","Poster","PosterBodoni BT","PRINCETOWN LET","Pristina","PTBarnum BT","Pythagoras","Raavi","Rage Italic","Ravie","Ribbon131 Bd BT","Rockwell","Rockwell Condensed","Rockwell Extra Bold","Rod","Roman","Sakkal Majalla","Santa Fe LET","Savoye LET","Sceptre","Script","Script MT Bold","SCRIPTINA","Serifa","Serifa BT","Serifa Th BT","ShelleyVolante BT","Sherwood","Shonar Bangla","Showcard Gothic","Shruti","Signboard","SILKSCREEN","SimHei","Simplified Arabic","Simplified Arabic Fixed","SimSun","SimSun-ExtB","Sinhala Sangam MN","Sketch Rockwell","Skia","Small Fonts","Snap ITC","Snell Roundhand","Socket","Souvenir Lt BT","Staccato222 BT","Steamer","Stencil","Storybook","Styllo","Subway","Swis721 BlkEx BT","Swiss911 XCm BT","Sylfaen","Synchro LET","System","Tamil Sangam MN","Technical","Teletype","Telugu Sangam MN","Tempus Sans ITC","Terminal","Thonburi","Traditional Arabic","Trajan","TRAJAN PRO","Tristan","Tubular","Tunga","Tw Cen MT","Tw Cen MT Condensed","Tw Cen MT Condensed Extra Bold","TypoUpright BT","Unicorn","Univers","Univers CE 55 Medium","Univers Condensed","Utsaah","Vagabond","Vani","Vijaya","Viner Hand ITC","VisualUI","Vivaldi","Vladimir Script","Vrinda","Westminster","WHITNEY","Wide Latin","ZapfEllipt BT","ZapfHumnst BT","ZapfHumnst Dm BT","Zapfino","Zurich BlkEx BT","Zurich Ex BT","ZWAdobeF"]));a=(a=a.concat(t.fonts.userDefinedFonts)).filter(function(e,t){return a.indexOf(e)===t});var r=document.getElementsByTagName("body")[0],i=document.createElement("div"),o=document.createElement("div"),l={},s={},c=function(){var e=document.createElement("span");return e.style.position="absolute",e.style.left="-9999px",e.style.fontSize="72px",e.style.fontStyle="normal",e.style.fontWeight="normal",e.style.letterSpacing="normal",e.style.lineBreak="auto",e.style.lineHeight="normal",e.style.textTransform="none",e.style.textAlign="left",e.style.textDecoration="none",e.style.textShadow="none",e.style.whiteSpace="normal",e.style.wordBreak="normal",e.style.wordSpacing="normal",e.innerHTML="mmmmmmmmmmlli",e},u=function(e,t){var n=c();return n.style.fontFamily="'"+e+"',"+t,n},d=function(e){for(var t=!1,a=0;a<n.length;a++)if(t=e[a].offsetWidth!==l[n[a]]||e[a].offsetHeight!==s[n[a]])return t;return t},g=function(){for(var e=[],t=0,a=n.length;t<a;t++){var r=c();r.style.fontFamily=n[t],i.appendChild(r),e.push(r)}return e}();r.appendChild(i);for(var f=0,h=n.length;f<h;f++)l[n[f]]=g[f].offsetWidth,s[n[f]]=g[f].offsetHeight;var m=function(){for(var e={},t=0,r=a.length;t<r;t++){for(var i=[],l=0,s=n.length;l<s;l++){var c=u(a[t],n[l]);o.appendChild(c),i.push(c)}e[a[t]]=i}return e}();r.appendChild(o);for(var p=[],T=0,v=a.length;T<v;T++)d(m[a[T]])&&p.push(a[T]);r.removeChild(o),r.removeChild(i),e(p)},pauseBefore:!0},{key:"fontsFlash",getData:function(e,t){return D()?_()?t.fonts.swfPath?void N(function(t){e(t)},t):e("missing options.fonts.swfPath"):e("flash not installed"):e("swf object not loaded")},pauseBefore:!0},{key:"audio",getData:function(e,t){var n=t.audio;if(n.excludeIOS11&&navigator.userAgent.match(/OS 11.+Version\/11.+Safari/))return e(t.EXCLUDED);var a=window.OfflineAudioContext||window.webkitOfflineAudioContext;if(null==a)return e(t.NOT_AVAILABLE);var r=new a(1,44100,44100),i=r.createOscillator();i.type="triangle",i.frequency.setValueAtTime(1e4,r.currentTime);var o=r.createDynamicsCompressor();s([["threshold",-50],["knee",40],["ratio",12],["reduction",-20],["attack",0],["release",.25]],function(e){void 0!==o[e[0]]&&"function"==typeof o[e[0]].setValueAtTime&&o[e[0]].setValueAtTime(e[1],r.currentTime)}),i.connect(o),o.connect(r.destination),i.start(0),r.startRendering();var l=setTimeout(function(){return console.warn('Audio fingerprint timed out. Please report bug at https://github.com/Valve/fingerprintjs2 with your user agent: "'+navigator.userAgent+'".'),r.oncomplete=function(){},r=null,e("audioTimeout")},n.timeout);r.oncomplete=function(t){var n;try{clearTimeout(l),n=t.renderedBuffer.getChannelData(0).slice(4500,5e3).reduce(function(e,t){return e+Math.abs(t)},0).toString(),i.disconnect(),o.disconnect()}catch(t){return void e(t)}e(n)}}},{key:"enumerateDevices",getData:function(e,t){if(!u())return e(t.NOT_AVAILABLE);navigator.mediaDevices.enumerateDevices().then(function(t){e(t.map(function(e){return"id="+e.deviceId+";gid="+e.groupId+";"+e.kind+";"+e.label}))}).catch(function(t){e(t)})}}],U=function(e){throw new Error("'new Fingerprint()' is deprecated, see https://github.com/Valve/fingerprintjs2#upgrade-guide-from-182-to-200")};return U.get=function(e,t){t?e||(e={}):(t=e,e={}),function(e,t){if(null==t)return e;var n,a;for(a in t)null==(n=t[a])||Object.prototype.hasOwnProperty.call(e,a)||(e[a]=n)}(e,l),e.components=e.extraComponents.concat(G);var n={data:[],addPreprocessedComponent:function(t,a){"function"==typeof e.preprocessor&&(a=e.preprocessor(t,a)),n.data.push({key:t,value:a})}},a=-1,r=function(i){if((a+=1)>=e.components.length)t(n.data);else{var o=e.components[a];if(e.excludes[o.key])r(!1);else{if(!i&&o.pauseBefore)return a-=1,void setTimeout(function(){r(!0)},1);try{o.getData(function(e){n.addPreprocessedComponent(o.key,e),r(!1)},e)}catch(e){n.addPreprocessedComponent(o.key,String(e)),r(!1)}}}};r(!1)},U.getPromise=function(e){return new Promise(function(t,n){U.get(e,t)})},U.getV18=function(e,t){return null==t&&(t=e,e={}),U.get(e,function(n){for(var a=[],r=0;r<n.length;r++){var i=n[r];if(i.value===(e.NOT_AVAILABLE||"not available"))a.push({key:i.key,value:"unknown"});else if("plugins"===i.key)a.push({key:"plugins",value:c(i.value,function(e){var t=c(e[2],function(e){return e.join?e.join("~"):e}).join(",");return[e[0],e[1],t].join("::")})});else if(-1!==["canvas","webgl"].indexOf(i.key))a.push({key:i.key,value:i.value.join("~")});else if(-1!==["sessionStorage","localStorage","indexedDb","addBehavior","openDatabase"].indexOf(i.key)){if(!i.value)continue;a.push({key:i.key,value:1})}else i.value?a.push(i.value.join?{key:i.key,value:i.value.join(";")}:i):a.push({key:i.key,value:i.value})}var l=o(c(a,function(e){return e.value}).join("~~~"),31);t(l,a)})},U.x64hash128=o,U.VERSION="2.1.0",U});