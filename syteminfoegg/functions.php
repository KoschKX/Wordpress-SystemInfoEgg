<?php

if ( ! function_exists( 'systeminfoegg_bootstrap' ) ) {

	/**
	 * Initialize the plugin.
	 */

	function systeminfoegg_settings_page(){
		require __DIR__ . '/pages/admin.php';
	}

	function systeminfoegg_bootstrap() {

		load_plugin_textdomain( 'systeminfoegg', false, __DIR__ . '/languages' );

		systeminfoegg_register_admin_page();

		systeminfoegg_register_settings();

		systeminfoegg_setup();
		
	}
}

if ( ! function_exists( 'systeminfoegg_register_admin_page' ) ) {

	/**
	 * Register the admin page.
	 */
	function systeminfoegg_register_admin_page() {
		add_action("admin_menu", "systeminfoegg_options_submenu");
		function systeminfoegg_options_submenu() {
		  add_submenu_page(
		        'options-general.php',
		        'System Info Egg Settings',
		        esc_html__( 'System Info Egg', 'systeminfoegg' ),
		        'administrator',
		        'systeminfoegg-options',
		        'systeminfoegg_settings_page');
		}
	}
	
}

if ( ! function_exists( 'wp_body_open' ) ) {

	/**
	 * Add wp_body_open() template tag if it doesn't exist (WP versions less than 5.2).
	 */
	function wp_body_open() {
		/**
		 * Triggered after the opening body tag.
		 *
		 * @since 5.2.0
		 */
		do_action( 'wp_body_open' );
	}
}

