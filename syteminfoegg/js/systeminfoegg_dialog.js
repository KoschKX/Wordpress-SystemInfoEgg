var mailto=false;

var systeminfoegg_timeout = 0;
var systeminfoegg_hasstyle = false;
var systeminfoegg_shown = false;

var systeminfoegg_cartcount;
var systeminfoegg_carttotal;

function go(){

	systeminfoegg_vars['title'] = jQuery(location).attr('href');
	systeminfoegg_vars['page'] = jQuery(document).attr('title');

	//systeminfoegg_cartcount=systeminfoegg_vars._cartcount;
	//systeminfoegg_carttotal=systeminfoegg_vars._carttotal;
	systeminfoegg_cartcount=parseInt(jQuery('#mini-cart .cart-items').html());
	systeminfoegg_carttotal=jQuery('#mini-cart .total').html();

	/* CHECK CART CHANGE */
		if(jQuery('#mini-cart').length){	
			var observer = new MutationObserver(function( mutations ) {
			  	system_check_cart();
			});
			observer.observe(jQuery('#mini-cart')[0], { subtree: true, attributes: false, childList: true, characterData: false});
			//observer.disconnect();
		}


	console.log(systeminfoegg_vars);

	detect_system();
	system_show();

}

go();

function system_check_cart(){
	if(jQuery('#mini-cart').length){
	  	systeminfoegg_cartcount=parseInt(jQuery('#mini-cart .cart-items').html());
		systeminfoegg_carttotal=jQuery('#mini-cart .total .amount').text();

		jQuery('#system_egg').find('.sysicon-cart').remove();
		if(systeminfoegg_cartcount>0){
			jQuery('#system_egg').append('<i class="sysicon-cart"></i>');
		}
	}
}

function system_show(){
	jQuery('#system_egg').addClass('initialized');
}

function detect_system(){
	var systeminfoegg_arr=[];

	var obj = jQuery('html');
	jQuery(systeminfoegg_container).append('<div id="system_egg" style="display:none;"><a class="systeminfoegg_tray"></div></div>');
	var sys=jQuery('#system_egg .systeminfoegg_tray');

	jQuery('#system_egg a').on('click', function(e) {
		var systeminfoegg_str=jQuery('#system_egg').attr('data-systeminfo');
		show_systeminfoegg_dialog(systeminfoegg_str);
	});

	systeminfoegg_arr.push('Browser: '+detectBrowser(obj,sys));
	systeminfoegg_arr.push('OS: '+detectOS(obj,sys));
	systeminfoegg_arr.push('Device: '+detectDevice(obj,sys));

	systeminfoegg_network=detectNetwork(obj,sys);
	systeminfoegg_status=detectStatus(obj,sys);
	
	var systeminfoegg_str=systeminfoegg_arr.join('<br />');
	jQuery('#system_egg').attr('data-systeminfo',systeminfoegg_str);
}

function show_systeminfoegg_dialog(str){
	jQuery.confirm({
	    title: '-System Info-',
	    content: str,
	    buttons: {
	        Ok: {
	        	text: systeminfoegg_vars['button_okay'],
	        	action: function () {
	        	
	        	}
	    	},
  			Copy: {
  				text: systeminfoegg_vars['button_copy'],
  				action: function () {
		            var copy_results=systeminfoegg_copy(str);
					jQuery.confirm({
		        		title: '',
					    content: '<div style="text-align:center;">'+copy_results+'</div>',
					    buttons: {
					        Ok: function () {
					        	show_systeminfoegg_dialog(str);
					        }
					    }
					});
				}
	        },
	        Report: {
	        	text: systeminfoegg_vars['button_report'],
	        	action: function () {
	        		show_bug_form(str);
	        	}
	        },
	    }
	});
}

function show_bug_form(str){
	jQuery.confirm({
		title: '<i class="sysicon-bug"></i>',
	    content: '<div style="text-align:center;">'+systeminfoegg_vars['messages_describe']+'</div><br /><br /><textarea id="bug_report"></textarea>',
	    buttons: {
	    	Cancel: {
	    		text: systeminfoegg_vars['button_cancel'],
	    		action: function () {
	    			show_systeminfoegg_dialog(str);
	    		}
	    	},
	        Send: {
	        	text: systeminfoegg_vars['button_send'],
	        	action: function () {
		        	var bug=jQuery('#bug_report').val();
		        	if(bug==''){
						jQuery.confirm({
			        		title: '',
						    content: '<div style="text-align:center;">'+systeminfoegg_vars['messages_required']+'</div>',
						    buttons: {
						        Ok: {
						        	text: systeminfoegg_vars['button_okay'],
						        	action: function () {
							        	show_bug_form(str);
							        }
						    	}
						    }
						});
			        }else{
			        	send_report(str,bug);
			        }
			    }
	        }
	    }
	});
}

function send_report(str,bug){
	
	var br='\r\n';
	if(mailto){
		var br='%0D%0A';
	}

	str=str.replaceAll('<br />',br);

	var user='-User-'+br+'Anonymous';
	if(systeminfoegg_vars['userid']!='0'){
		cart='Cart: empty';
		if(systeminfoegg_cartcount>0){
			cart='Cart: '+systeminfoegg_cartcount+' ['+systeminfoegg_carttotal+']';
		}
		user='-User-'+br+'Login: '+systeminfoegg_vars['userlogin']+' ['+systeminfoegg_vars['userid']+']'+br+'Name: '+systeminfoegg_vars['username']+br+'Email: '+systeminfoegg_vars['useremail']+br+'Status: '+ systeminfoegg_vars['status']+br+cart;
	}

	var network='-Network-'+br+systeminfoegg_network.replaceAll('<br />',br);

	var page='-Page-'+br+systeminfoegg_vars['title']+' ['+systeminfoegg_vars['page']+'](Wordpress '+systeminfoegg_vars['siteversion']+')';
	var sysinfo='-System Info-'+br+str;
	var issue='-Issue-'+br+bug;

	if(mailto){
		window.location.href = systeminfoegg_sanitize('mailto:'+systeminfoegg_vars['contact']+'?subject=Bug report ['+systeminfoegg_vars['sitename']+']&body='+user+br+br+page+br+br+sysinfo+br+br+network+br+br+issue+br+br);
	}else{
		var subject='Bug report ['+systeminfoegg_vars['sitename']+']';
		var message=user+br+br+page+br+br+sysinfo+br+br+network+br+br+issue+br+br;
		jQuery.ajax({
			type: "POST",
			url: systeminfoegg_vars.resfolder+"/php/send_report.php",
			data: { subject: subject, message: message }
		}).done(function( result ) {
			var end_message=systeminfoegg_vars['messages_thankyou'];
			if(result){
				end_message=result;
			}
			jQuery.confirm({
        		title: '',
			    content: '<div style="text-align:center;">'+end_message+'</div>',
			    buttons: {
			        Ok: {
			        	text: systeminfoegg_vars['button_okay'],
			        	action: function () {
			        	}
			    	}
			    }
			});
		});
	}
}

function detectOS(obj,sys,htmlClass=false){
	let out='';
	let os='';

	const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (os=='' && /windows phone/i.test(userAgent)) { os = "Windows Phone"; }
    if (os=='' && /windows/i.test(userAgent)) {  os = "Windows"; }
    if (os=='' && /macintosh|mac os x/i.test(userAgent)) { os = "MacOS"; }
    if (os=='' && /linux/i.test(userAgent)) { os = "Linux"; }
    if (os=='' && /android/i.test(userAgent)) { os = "Android"; }
    if (os=='' && /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) { os = "iOS"; }
	if (os==''){ os = "Unknown OS"};

	if(htmlClass){ obj.addClass(os); }

	if(os=='Windows Phone'){
		sys.append('<i class="sysicon-windows8"></i>');
	};
	if(os=='Windows'){
		sys.append('<i class="sysicon-windows8"></i>');
	};
	if(os=='MacOS'){
		sys.append('<i class="sysicon-appleinc"></i>');
	};
	if(os=='Linux'){
		sys.append('<i class="sysicon-tux"></i>');
	};
	if(os=='iOS'){
		sys.append('<i class="sysicon-ios"></i>');
	};
	if(os=='Android'){
		sys.append('<i class="sysicon-android"></i>');
	};

	return os;
}

function detectDevice(obj,sys,htmlClass=false){
	let out='';
	let dev='';

    if (dev=='' && /android/i.test(navigator.userAgent)) { if (/mobile/i.test(navigator.userAgent)) { dev = "Phone"; } else { dev = "Tablet";}}
    if (dev=='' && /iPad|Tablet/i.test(navigator.userAgent)) {dev = "Tablet";}
    if (dev=='' && /iPhone|iPod/i.test(navigator.userAgent)) {dev = "Phone";}
    const width = Math.max(window.screen.width, window.screen.height);
    if (dev=='' && width <= 767) { dev = "Phone"; } else if (dev=='' && width <= 1024) { dev = "Tablet"; } else { dev = "Desktop"; }
    if (dev==''){ dev = 'Uknown Device'; }
    
    if(htmlClass){ obj.addClass(dev); }

	if(dev=='Phone'){
		sys.append('<i class="sysicon-mobile"></i>');
	}else if(dev=='Tablet'){
		sys.append('<i class="sysicon-tablet"></i>');
	}else if(dev=='Desktop'){
		sys.append('<i class="sysicon-display"></i>');
	}
	return dev;
}


function detectBrowser(obj,sys){
	var out='';

	if(obj.hasClass('opera')||navigator.userAgent.toLowerCase().indexOf('opr') !== -1){
		sys.append('<i class="sysicon-opera"></i>');
		out='Opera';
	}else if(obj.hasClass('chrome')&&navigator.userAgent.toLowerCase().indexOf('edg') == -1){
		sys.append('<i class="sysicon-chrome"></i>');
		out='Chrome';
	}else if(obj.hasClass('chrome')&&navigator.userAgent.toLowerCase().indexOf('edg') !== -1){
		sys.append('<i class="sysicon-edge"></i>');
		out='Edge';
	}else if(obj.hasClass('gecko')){
		sys.append('<i class="sysicon-firefox"></i>');
		out='Firefox';
	}else if(obj.hasClass('msie')){
		sys.append('<i class="sysicon-IE"></i>');
		out='Internet Explorer';
	}else if(obj.hasClass('safari')){
		sys.append('<i class="sysicon-safari"></i>');
		out='Safari';
	}
	
	out+=' ['+navigator.userAgent+']';
	return out;
}

function detectStatus(obj,sys){
	var out='';
	if(systeminfoegg_vars['userid']=='0'){
		out='Anonymous';
		sys.append('<i class="sysicon-user-secret"></i>');
	}else{
		sys.append('<i class="sysicon-user"></i>');
		out='Logged in';
	}
	
	system_check_cart();

	return out;
}

function detectNetwork(obj,sys){
	if(navigator==undefined||navigator.connection==undefined){
		return 'Information unavailable';
	}

	var downlink=navigator.connection.downlink;
	var effective_type=navigator.connection.effectiveType;
	
	if(downlink>3){
		sys.append('<i class="sysicon-settings_ethernet"></i>');
	}else if(downlink>2){
		sys.append('<i class="sysicon-network_wifi"></i>');
	}else if(downlink>1){
		sys.append('<i class="sysicon-network_cell"></i>');
	}

	out='Downlink: '+downlink+'<br />'+'Effective Type: '+effective_type;

	return out;
}


function systeminfoegg_copy(text) {
	var result='';
	text = text.replace(/<br\s*\/?>/gi, "\r\n");
    if (window.clipboardData && window.clipboardData.setData) {
        result=window.clipboardData.setData("Text", text);
    }
    else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";
        document.body.appendChild(textarea);
        textarea.select();
        try {
        	result=systeminfoegg_vars['messages_copied'];
            document.execCommand("copy");
        }
        catch (ex) {
            result=console.warn(systeminfoegg_vars['messages_copy_failed'], ex);
            return false;
        }
        finally {
            document.body.removeChild(textarea);
        }
    }
    return result;
}

function systeminfoegg_sanitize(str) {
	return encodeURIComponent(str);
    //return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}



