
jQuery( document ).ready(function() {
  jQuery('#submit').click(function() {
	  	save();

      jQuery("#kosch_message").html('');
      jQuery("#loader").html('Performing. . .');

      toggleLoading(true);
	});

	jQuery('#reset').click(function() {
			if (confirm("Are you sure?")) {
				jQuery("#kosch_message").html('');
	      jQuery("#loader").html('Performing. . .');

	      toggleLoading(true);

			  reset();
			}
	});

  if(typeof jQuery('.systeminfoegg #main').attr('style') !== 'undefined' && jQuery('.systeminfoegg #main').attr('style') !== false){
		jQuery('.systeminfoegg #main').attr('style',jQuery('.systeminfoegg #main').attr('style').replace('visibility:hidden;',''));
	}
	jQuery('.systeminfoegg #main').addClass('initialized');
});

function reset(){

	var data = new Object();
	data['action'] = 'systeminfoegg_reset_settings';

	jQuery.ajax({
	    url: ajaxurl,
	    type: "POST",
	    data: data,
	    success: function(response) {
	        if (response.success) {
	            jQuery("#kosch_message").html('<div class="message success">'+ response.data +'</div>');
	            location.reload();
	        } else {
	            jQuery("#kosch_message").html('<div class="message error">Error: ' + response.data + '</div>');
	            console.error('Something went wrong:', response.data);
	        }
	        toggleLoading(false);
	    },
	    error: function(xhr, status, error) {
	        jQuery("#kosch_message").html('<div class="message error">Error: ' + error + '</div>');
	        console.error('AJAX error:', error);  
	        console.error('AJAX status:', status);  
	        console.error('AJAX xhr:', xhr); 
	        toggleLoading(false);
	    }
	});
}

function save(){

	var data = new Object();

	data['action'] = 'systeminfoegg_update_settings';
	Object.keys(adminOptions).forEach(key => {
	    var obj = jQuery('#' + key+'_control');
	    if (obj && obj.length) {
	        switch (obj.attr('type')) {
	            case 'text':
	                data[key] = obj.val();
	                break;
	            case 'number':
	                data[key] = obj.val();
	                break;
	            case 'checkbox':
	                data[key] = obj.is(':checked') ? 'true' : 'false' ;
	                break;
	            case 'radio':
	                data[key] = obj.is(':checked') ? 'true' : 'false' ;
	                break;
							case 'color':
	                data[key] = obj.val();
	                break;
	            case 'select':
	                data[key] = obj.val()+":"+obj.attr('data-options');
	                break;
	            case 'textarea':
					    		data[key] = obj.val();
					    		break;
					    case 'range':
					    		data[key] = obj.val();
					    		break;
	            default:
	                break;
	        }
	    }
	});

	console.log(data);

	jQuery.ajax({
	    url: ajaxurl,
	    type: "POST",
	    data: data,
	    success: function(response) {
	        if (response.success) {
	            jQuery("#kosch_message").html('<div class="message success">'+ response.data +'</div>');
	        } else {
	            jQuery("#kosch_message").html('<div class="message error">Error: ' + response.data + '</div>');
	            console.error('Something went wrong:', response.data);
	        }
	        toggleLoading(false);
	    },
	    error: function(xhr, status, error) {
	        jQuery("#kosch_message").html('<div class="message error">Error: ' + error + '</div>');
	        console.error('AJAX error:', error);  
	        console.error('AJAX status:', status);  
	        console.error('AJAX xhr:', xhr); 
	        toggleLoading(false);
	    }
	});
}

function toggleLoading(toggle){
    if(toggle){
      jQuery("#content_wrap").addClass("loading");
    }else{
      jQuery("#content_wrap").removeClass("loading");
    }
}

function capitalize(word) {
   return jQuery.camelCase("-" + word);
}