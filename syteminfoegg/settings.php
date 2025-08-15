<?php  
			
	$systeminfoegg_sections=[
		'setup',
		'buttons',
		'messages'
	];

	$systeminfoegg_blend_modes=[
		'color','color-burn',
		'color-dodge','darken',
		'difference','exclusion',
		'hard-light','hue',
		'lighten',
		'luminosity',
		'multiply',
		'normal',
		'overlay',
		'plus-lighter',
		'saturation',
		'screen',
		'soft-light'
	];
	$systeminfoegg_blend_modes_str=implode(',',$systeminfoegg_blend_modes);

	$systeminfoegg_prefix = 'systeminfoegg_';
    $systeminfoegg_options = [
        'setup|admin_email|Admin Email|text|none',
        'setup|target|Target|text|none',
        'setup|container|Container|text|none',
        'setup|delay|Delay|number:0,10000|1',

        'buttons|okay|Okay Button|text|Okay',
        'buttons|cancel|Cancel Button|text|Cancel',
        'buttons|send|Send Button|text|Send',
        'buttons|copy|Copy Button|text|Copy',
        'buttons|report|Report Button|text|Report',

        'messages|thankyou|Thank You.|text|Thank you. The report has been sent.',
        'messages|error|Error|text|An error has occurred. The report has been sent.',
        'messages|describe|Describe|text|Please describe the issue.',
        'messages|required|Required|text|A description is required.',
        'messages|copied|Copied|text|System information copied to clipboard.',
        'messages|copy_failed|Copy Failed|text|Failed to copy to clipboard.',
    ];

	function systeminfoegg_add_options(){
		global $systeminfoegg_options, $systeminfoegg_prefix;
		foreach ($systeminfoegg_options as $option) {
			$gp=systeminfoegg_get_option_group($option);
			$op=systeminfoegg_get_option_name($option);
			$df=systeminfoegg_get_option_default($option);
	        register_setting('sitefx-options',$systeminfoegg_prefix.$gp.'_'.$op, array('type' => 'string', 'show_in_rest' => true, 'sanitize_callback' => 'sanitize_text_field',));
	        if($df=='none'){$df=='';}
	        add_option($systeminfoegg_prefix.$gp.'_'.$op, $df);
	    }
	}
	  
	function systeminfoegg_register_settings(){
		add_action( 'admin_init', 'systeminfoegg_add_options');
		add_action( 'rest_api_init', 'systeminfoegg_add_options' );
	}

	function systeminfoegg_update_settings() {
		global $systeminfoegg_options, $systeminfoegg_prefix;
	    foreach ($systeminfoegg_options as $option) {
	    	$gp=systeminfoegg_get_option_group($option);
	    	$op=systeminfoegg_get_option_name($option);
	        if(isset($_POST[$systeminfoegg_prefix.$gp.'_'.$op])){
	     		update_option($systeminfoegg_prefix.$gp.'_'.$op, $_POST[$systeminfoegg_prefix.$gp.'_'.$op]);
	    	}
	    }
    	wp_send_json_success('Settings saved!');
	}

	function systeminfoegg_reset_settings(){
		global $systeminfoegg_options, $systeminfoegg_prefix;
		foreach ($systeminfoegg_options as $option) {
			$gp=systeminfoegg_get_option_group($option);
			$op=systeminfoegg_get_option_name($option);
			$df=systeminfoegg_get_option_default($option);
	        update_option($systeminfoegg_prefix.$gp.'_'.$op, $df);
	    }
	    wp_send_json_success('Settings reset!');
	}


	function systeminfoegg_get_option_group($option){
		return explode("|", $option)[0];
	}
	function systeminfoegg_get_option_name($option){
		return explode("|", $option)[1];
	}
	function systeminfoegg_get_option_label($option){
		return explode("|", $option)[2];
	}
	function systeminfoegg_get_option_type($option){
		return explode("|", $option)[3];
	}
	function systeminfoegg_get_option_default($option){
		return explode("|", $option)[4];
	}

	function systeminfoegg_get_options(){
		global $systeminfoegg_options, $systeminfoegg_prefix;
		$out_options=[];
		foreach ($systeminfoegg_options as $index => $option) {
			$gp=systeminfoegg_get_option_group($option);
			$op=systeminfoegg_get_option_name($option);
			$out_options[$gp.'_'.$op]=get_option($systeminfoegg_prefix.$gp.'_'.$op);
		}
	    return $out_options;
	}
	function systeminfoegg_get_section_options($pfx){
		global $systeminfoegg_options, $systeminfoegg_prefix;
		$out_options=[];
		foreach ($systeminfoegg_options as $index => $option) {
			$gp=systeminfoegg_get_option_group($option);
		    $op=systeminfoegg_get_option_name($option);
		    if($gp==$pfx){
		    	$out_options[$gp.'_'.$op]=get_option($systeminfoegg_prefix.$gp.'_'.$op);
		    }
	    }
	    return $out_options;
	}

	add_action('wp_ajax_systeminfoegg_reset_settings', 'systeminfoegg_reset_settings');
	add_action('wp_ajax_systeminfoegg_update_settings', 'systeminfoegg_update_settings');
	add_action('wp_ajax_nopriv_save_systeminfoegg_update_settings', 'systeminfoegg_update_settings');