var mailto=false;

var systeminfoegg_target;
var systeminfoegg_container;
var systeminfoegg_delay;
var systeminfoegg_sitename;
var systeminfoegg_siteversion;
var systeminfoegg_title;
var systeminfoegg_page;
var systeminfoegg_contact;
var systeminfoegg_userid;

var systeminfoegg_status;
var systeminfoegg_network;


var systeminfoegg_timeout = 0;
var systeminfoegg_hasstyle = false;
var systeminfoegg_shown = false;


function go(){

	systeminfoegg_sitename=systeminfoegg_vars['sitename'];
	systeminfoegg_siteversion=systeminfoegg_vars['siteversion'];
	systeminfoegg_contact=systeminfoegg_vars['setup_siteversion'];

	systeminfoegg_page=jQuery(location).attr('href');
	systeminfoegg_title=jQuery(document).attr('title');

	systeminfoegg_userid=systeminfoegg_vars['userid'];
	systeminfoegg_userlogin=systeminfoegg_vars['userlogin'];
	systeminfoegg_username=systeminfoegg_vars['username'];
	systeminfoegg_useremail=systeminfoegg_vars['useremail'];

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

	systeminfoegg_button_okay=systeminfoegg_vars['button_okay'];
	systeminfoegg_button_cancel=systeminfoegg_vars['button_cancel'];
	systeminfoegg_button_send=systeminfoegg_vars['button_send'];
	systeminfoegg_button_copy=systeminfoegg_vars['button_copy'];
	systeminfoegg_button_report=systeminfoegg_vars['button_report'];

	systeminfoegg_message_thankyou=systeminfoegg_vars['message_thankyou'];
	systeminfoegg_message_describe=systeminfoegg_vars['message_describe'];
	systeminfoegg_message_required=systeminfoegg_vars['message_required'];
	systeminfoegg_message_copied=systeminfoegg_vars['message_copied'];
	systeminfoegg_message_copyfailed=systeminfoegg_vars['message_copy_failed'];

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
		//alert(systeminfoegg_copy());
		show_systeminfoegg_dialog(systeminfoegg_str);

		//jQuery('#system_egg').removeClass('visible');
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
	        	text: systeminfoegg_button_okay,
	        	action: function () {
	        	
	        	}
	    	},
  			Copy: {
  				text: systeminfoegg_button_copy,
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
	        	text: systeminfoegg_button_report,
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
	    content: '<div style="text-align:center;">'+systeminfoegg_message_describe+'</div><br /><br /><textarea id="bug_report"></textarea>',
	    buttons: {
	    	Cancel: {
	    		text: systeminfoegg_button_cancel,
	    		action: function () {
	    			show_systeminfoegg_dialog(str);
	    		}
	    	},
	        Send: {
	        	text: systeminfoegg_button_send,
	        	action: function () {
		        	var bug=jQuery('#bug_report').val();
		        	if(bug==''){
						jQuery.confirm({
			        		title: '',
						    content: '<div style="text-align:center;">'+systeminfoegg_message_required+'</div>',
						    buttons: {
						        Ok: {
						        	text: systeminfoegg_button_okay,
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
	if(systeminfoegg_userid!='0'){
		cart='Cart: empty';
		if(systeminfoegg_cartcount>0){
			cart='Cart: '+systeminfoegg_cartcount+' ['+systeminfoegg_carttotal+']';
		}
		user='-User-'+br+'Login: '+systeminfoegg_userlogin+' ['+systeminfoegg_userid+']'+br+'Name: '+systeminfoegg_username+br+'Email: '+systeminfoegg_useremail+br+'Status: '+ systeminfoegg_status+br+cart;
	}

	var network='-Network-'+br+systeminfoegg_network.replaceAll('<br />',br);

	var page='-Page-'+br+systeminfoegg_title+' ['+systeminfoegg_page+'](Wordpress '+systeminfoegg_siteversion+')';
	var sysinfo='-System Info-'+br+str;
	var issue='-Issue-'+br+bug;

	if(mailto){
		window.location.href = systeminfoegg_sanitize('mailto:'+systeminfoegg_contact+'?subject=Bug report ['+systeminfoegg_sitename+']&body='+user+br+br+page+br+br+sysinfo+br+br+network+br+br+issue+br+br);
	}else{
		var subject='Bug report ['+systeminfoegg_sitename+']';
		var message=user+br+br+page+br+br+sysinfo+br+br+network+br+br+issue+br+br;
		jQuery.ajax({
			type: "POST",
			url: systeminfoegg_vars.resfolder+"/php/send_report.php",
			data: { subject: subject, message: message }
		}).done(function( result ) {
			var end_message=systeminfoegg_message_thankyou;
			if(result){
				end_message=result;
			}
			jQuery.confirm({
        		title: '',
			    content: '<div style="text-align:center;">'+end_message+'</div>',
			    buttons: {
			        Ok: {
			        	text: systeminfoegg_button_okay,
			        	action: function () {
			        	}
			    	}
			    }
			});
		});
	}
}

function detectOS(obj,sys){
	var out='';
	if(obj.hasClass('win')){
		sys.append('<i class="sysicon-windows8"></i>');
		out='Windows';
	};
	if(obj.hasClass('mac')){
		sys.append('<i class="sysicon-appleinc"></i>');
		out='Mac OS';
	};
	if(obj.hasClass('linux')&&navigator.userAgent.indexOf('Android') == -1){
		sys.append('<i class="sysicon-tux"></i>');
		out='Linux';
	};
	if(obj.hasClass('ios')){
		sys.append('<i class="sysicon-ios"></i>');
		out='iOS';
	};
	if(obj.hasClass('linux')&&navigator.userAgent.indexOf('Android') !== -1){
		sys.append('<i class="sysicon-android"></i>');
		out='Android';
	};
	return out;
}

function detectDevice(obj,sys){
	var out='';
	if(obj.hasClass('mobile')){
		sys.append('<i class="sysicon-mobile"></i>');
		out='Mobile';
	}else if(!obj.hasClass('no-touch')){
		sys.append('<i class="sysicon-tablet"></i>');
		out='Tablet';
	}else{
		sys.append('<i class="sysicon-display"></i>');
		out='Desktop';
	}
	return out;
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
	if(systeminfoegg_userid=='0'){
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
        	result=systeminfoegg_message_copied;
            document.execCommand("copy");
        }
        catch (ex) {
            result=console.warn(systeminfoegg_message_copyfailed, ex);
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



