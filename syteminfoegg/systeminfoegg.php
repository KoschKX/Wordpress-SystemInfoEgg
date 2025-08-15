<?php
/**
 * Blank Slate
 *
 * @package           systeminfoegg
 * @author            Gary Angelone
 * @copyright         Copyright 2019-2020 by Gary Angelone - All rights reserved.
 * @license           GPL2.0-or-later
 *
 * @wordpress-plugin
 * Plugin Name:       System Info Egg
 * Plugin URI:        
 * Description:       Easter Egg for showing user's system info.
 * Version:           1.2.1
 * Requires PHP:      5.3
 * Requires at least: 4.7
 * Author:            Gary Angelone
 * Author URI:        
 * Text Domain:       systeminfoegg
 * Domain Path:       /languages
 * License:           GPL V2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 */

require __DIR__ . '/functions.php';
require __DIR__ . '/setup.php';
require __DIR__ . '/settings.php';

add_action( 'plugins_loaded', 'systeminfoegg_bootstrap' );
