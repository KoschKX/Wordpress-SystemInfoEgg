<?php  


	function systeminfoegg_setup(){
		add_action( 'wp_enqueue_scripts', function() {
			global $user, $systeminfoegg_sections, $systeminfoegg_options, $systeminfoegg_prefix;
			
			$user = wp_get_current_user();
			$user_id = get_current_user_id();

			$systeminfoegg_target=get_option('systeminfoegg_setup_target');
			if($systeminfoegg_target!=null&&$systeminfoegg_target!=''){ 
				$resfolder=plugin_dir_url( __FILE__ );
		    	
		    	wp_enqueue_script('systeminfoegg-script', $resfolder.'/js/systeminfoegg.js', array('jquery'), '', true);
				
				$section_options=[];

				$section_options=systeminfoegg_get_options();

				$section_options['resfolder']= $resfolder;

				$section_options['target'] = get_option('systeminfoegg_target');
				$section_options['container'] = get_option('systeminfoegg_container');
				$section_options['delay'] = get_option('systeminfoegg_delay');
				$section_options['sitename'] = get_bloginfo('name');
				$section_options['siteversion'] = get_bloginfo('version');

				$section_options['userid'] = $user_id;
				$section_options['username'] = $user->first_name.' '.$user->last_name;
				$section_options['userlogin'] = $user->user_login;
				$section_options['useremail'] = $user->user_email;

		    	wp_localize_script('systeminfoegg-script', 'systeminfoegg_vars', $section_options);

			}
		});
	}