<?php
	global $wp;

	require_once($_SERVER['DOCUMENT_ROOT']. "/wp-load.php");


	$to=get_bloginfo('admin_email');
	if(get_option('systeminfoegg_email')){
		$to=get_option('systeminfoegg_email');
	}

	$subject='';
	if(isset($_POST['subject'])){
		$subject=$_POST['subject'];
	}

	$message='';
	if(isset($_POST['message'])){
		$message=$_POST['message'];
	}

	$headers='';

	wp_mail($to, $subject, $message, $headers);
