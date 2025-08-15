<?php
	global $systeminfoegg_options, $systeminfoegg_prefix;
	wp_enqueue_script('admin-script', plugin_dir_url( __FILE__ ) . '../js/admin.js');
	wp_enqueue_style('admin-style', plugin_dir_url( __FILE__ ) . '../css/admin.css');

	$scriptvars=[]; $optionvars=[];
	$scriptvars['pluginsUrl'] = plugin_dir_url( __FILE__ ).'../';
	$scriptvars['options_prefix'] = $systeminfoegg_prefix;
	$scriptvars['options_length'] = count($systeminfoegg_options);
	foreach ($systeminfoegg_options as $index => $option) {
		$gp=systeminfoegg_get_option_group($option);
	    $op=systeminfoegg_get_option_name($option);
	    $tp=systeminfoegg_get_option_type($option);
	    $lb=systeminfoegg_get_option_label($option);
       	$optionvars[$systeminfoegg_prefix.$gp.'_'.$op] = get_option($systeminfoegg_prefix.$gp.'_'.$op).'|'.$tp.'|'.$lb;
    }
	wp_localize_script('admin-script', 'adminVars', $scriptvars );
	wp_localize_script('admin-script', 'adminOptions', $optionvars );
	
	$systeminfoegg_plugin_options = get_option('plugin_options');
?>

<div class="wrap systeminfoegg">
	<h1><?php esc_html_e( 'System Info Egg', 'systeminfoegg' ); ?></h1>
	<div id="content_wrap" style="text-align:center;">
		<div id="main" style="visibility:hidden;">
			<div id="controls">

				<?php
					global $systeminfoegg_options, $systeminfoegg_prefix;

					$groups=[];
					foreach ($systeminfoegg_options as $index => $option) {
						$gp=systeminfoegg_get_option_group($option);
						if(!in_array($gp, $groups)){
							array_push($groups,$gp);
						}
					};

					foreach ($groups as $index => $group) {
						$grp = $systeminfoegg_prefix.$group;

						echo '<section id="'.$grp.'">';
							echo '<h1 class="title">'.$group.'</h1>';

								foreach ($systeminfoegg_options as $index => $option) {
									$gp=systeminfoegg_get_option_group($option);
									if($group!=$gp){continue;}

				    				$op=systeminfoegg_get_option_name($option);
				    				$tp=systeminfoegg_get_option_type($option);
				    				$lb=systeminfoegg_get_option_label($option);

				    				$opt=$systeminfoegg_prefix.$gp.'_'.$op;
				    				$val=get_option($opt);

				    				echo '<div class="control" id="'.$opt.'">';

				    					$control='';
				    					$label='';

				    					$tp_opts=[];
				    					if(str_contains($tp,':')){
				    						$stp=explode(':',$tp);
				    						if(count($stp)>1){
				    							$tp_opts=explode(",",$stp[1]);
				    							$tp=$stp[0];
				    						}
				    					}

										switch ($tp) {
											case "text":
												$label.='<label for="'.$opt.'">'.$lb.': </label>';
										        $control.='<input type="'.$tp.'" id="'.$opt.'_control" name="'.$opt.'" value="'.$val.'" />';
										        break;
										    case "number":
												$label.='<label for="'.$opt.'">'.$lb.': </label>';
												$min=''; $max='';
												if(count($tp_opts)>0){$min='min="'.$tp_opts[0].'"';};
												if(count($tp_opts)>1){$max='max="'.$tp_opts[1].'"';};
										        $control.='<input type="'.$tp.'" id="'.$opt.'_control" name="'.$opt.'" value="'.$val.'" '.$min.' '.$max.' />';
										        break;
										    case "checkbox":
										    	$label.='<label for="'.$opt.'_control">'.$lb.': </label>';
										        $control.='<input type="'.$tp.'" id="'.$opt.'_control" name="'.$opt.'" value="1" ';
										        if($val=='true'){
										        	$control.=' checked="checked" ';
										        }
										        $control.=' />';
										        break;
										    case "radio":
										    	$label.='<label for="'.$opt.'_control">'.$lb.': </label>';
										        $control.='<input type="'.$tp.'" id="'.$opt.'_control" name="'.$opt.'" value="1" ';
										        if($val=='true'){
										        	$control.=' checked="checked" ';
										        }
										        $control.=' />';
										        break;
										    case "range":
										    	$label.='<label for="'.$opt.'_control">'.$lb.': </label>';
										    	$control.='<input type="'.$tp.'" id="'.$opt.'_control" name="'.$opt.'" value="'.$val.'" min="0" max="100" oninput="document.getElementById(\''.$opt.'_range_val'.'\').innerText = this.value;" />';
										        $control.='<span id="'.$opt.'_range_val'.'" class="range_value">'.$val.'</span>';
										        // $control.='<button id="'.$opt.'_toggle" >#</button>';
										        break;
										    case "color":
										    	$label.='<label for="'.$opt.'_control">'.$lb.': </label>';
										    	$control.='<input type="'.$tp.'" id="'.$opt.'_control" name="'.$opt.'" value="'.$val.'" />';
										        break;
										    case "select":
										    	$label='<label for="'.$opt.'_control">'.$lb.': </label>';
										        $control.='<select type="'.$tp.'" id="'.$opt.'_control" name="'.$opt.'" data-options="'.implode(',',$tp_opts).'" >';
										        	if(count($tp_opts)>0){
											        	foreach ($tp_opts as $index => $v) {
											        		if($v==$val){$sel='selected';}else{$sel='';}
											        		$control.='<option value="'.$v.'" '.$sel.'>'.$v.'</option>';
											        	}
											        }
										        $control.='</select>';
										        break;
										    default:
										        break;
										}

										echo $label;
										echo $control;

									echo '</div>';
									echo '<br />';
								}

						echo '</section>';
					}
				?>
				<br/>
				<div style="clear: both;"></div>
				<div class="spacer"></div>
				<div class="control full center" id="buttons"><input type="submit" id="reset" value="reset" /><input type="submit" id="submit" value="save" /></div>
			</div>
			<div id="loader" style="display:none;"></div>
			<div id="kosch_message"></div>
		</div>
	</div>
</div>


