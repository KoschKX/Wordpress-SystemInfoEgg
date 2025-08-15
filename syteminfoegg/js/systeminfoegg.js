var systeminfoegg_target;
var systeminfoegg_container;
var systeminfoegg_delay;
var systeminfoegg_resfolder;

jQuery(document).ready(function() {

	systeminfoegg_target=systeminfoegg_vars['setup_target'];
	systeminfoegg_container=systeminfoegg_vars['setup_container'];
	systeminfoegg_delay=parseInt(systeminfoegg_vars['setup_delay']);

	systeminfoegg_resfolder=systeminfoegg_vars['resfolder'];

	jQuery(systeminfoegg_target).addClass('sysinfo_target');

	system_egg();
})

var systeminfoegg_timeout = 0;
var systeminfoegg_hasstyle = false;
var systeminfoegg_shown = false;

function system_egg(){
	var systeminfoegg_clicked=false;

	if(jQuery('html').hasClass('mobile')){
		jQuery(systeminfoegg_target).on('touchmove',function() {

            system_egg_load();

			jQuery("html, body").animate({ scrollTop: jQuery(document).height() }, 0);
        });
	}else{
		jQuery(systeminfoegg_target).on('mousedown', function(e) {
			var obj=jQuery(this);

		    systeminfoegg_timeout = setTimeout(function(){
		    	systeminfoegg_clicked=true;
		    }, systeminfoegg_delay*1000, obj,e);
		})
		jQuery(systeminfoegg_target).on('mouseup mouseleave click', function(e) {
			e.preventDefault();
			var obj=jQuery(this);
			if(systeminfoegg_clicked){
				obj.addClass('click_block');

				system_egg_load();

				jQuery("html, body").animate({ scrollTop: jQuery(document).height() }, 0);

				setTimeout(function(){
					obj.removeClass('click_block');
					obj.unbind('mousedown mouseup mouseleave click');
				},1000,obj);
			}
		  	clearTimeout(systeminfoegg_timeout);
		});
	}
}

function system_egg_load(){
	if(!systeminfoegg_hasstyle){

		if(!checkIfIncluded(systeminfoegg_resfolder+'/css/systeminfo-icons.css')){
			jQuery('<link>')
			.appendTo('head')
			.attr({
			      type: 'text/css',
			      rel: 'stylesheet',
			      href: systeminfoegg_resfolder+'/css/systeminfo-icons.css'
			});
		}

		if(!checkIfIncluded(systeminfoegg_resfolder+'/css/systeminfoegg.css')){
			jQuery('<link>')
			.appendTo('head')
			.attr({
			      type: 'text/css',
			      rel: 'stylesheet',
			      href: systeminfoegg_resfolder+'/css/systeminfoegg.css'
			});
		}

		/* DIALOG ASSETS */

			if(!checkIfIncluded(systeminfoegg_resfolder+'/css/lib/jquery-confirm.min.css')){
				jQuery('<link>')
				.appendTo('head')
				.attr({
				      type: 'text/css',
				      rel: 'stylesheet',
				      href: systeminfoegg_resfolder+'/css/lib/jquery-confirm.min.css'
				});
			}

			if(!checkIfIncluded(systeminfoegg_resfolder+'/js/lib/jquery-confirm.min.js')){
				jQuery('<script>')
				.appendTo('head')
				.attr({
				      type: 'text/javascript',
				      src: systeminfoegg_resfolder+'/js/lib/jquery-confirm.min.js'
				});
			}

		/* DIALOG SCRIPT */

			if(!checkIfIncluded(systeminfoegg_resfolder+'/js/systeminfoegg_dialog.js')){
				jQuery('<script>')
				.appendTo('head')
				.attr({
				      type: 'text/javascript',
				      src: systeminfoegg_resfolder+'/js/systeminfoegg_dialog.js'
				});
			}

		systeminfoegg_hasstyle=true;
	}
}


function checkIfIncluded(file) {
    var links = document.getElementsByTagName("link");
    for(var i = 0; i < links.length; i++) {
        if (links[i].href.substr(-file.length) == file)
            return true;
    }

    var scripts = document.getElementsByTagName("script");
    for(var i = 0; i < scripts.length; i++) {
        if (scripts[i].src.substr(-file.length) == file)
            return true;
    }

    return false;
}
