<?php 
/*
Plugin Name: Photo Lightbox
Plugin URI: http://denzeldesigns.com
Version: 1.2
Description: Photo Lightbox is a lightbox styled image gallery written in Javascript. Updated to initiate at footer. Needs wp_head() wp_footer in theme to work. 
Author: Denzel Chia
Author URI: http://denzeldesigns.com
*/

/*  Copyright 2009  Denzel Chia 

    This file is part of Photo Lightbox.

    Photo Lightbox is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Photo Lightbox is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Photo Lightbox.  If not, see <http://www.gnu.org/licenses/>.

*/


function plbSetting(){
// use WP_PLUGIN_URL to construct path to images
$photolightbox_image_path = WP_PLUGIN_URL."/"."photo-lightbox/images/";
echo "\n<!---Photo Lightbox Javascript Global Variables -->\n";
echo "<script language=\"javascript\">\n";
//javascript global path to images settings
echo 'var pb_to_image = "';
echo $photolightbox_image_path;
echo '";';
echo "\n";
echo "</script>\n";

//end of settings

}

// add function to theme <head>
add_action('wp_head','plbSetting');


function plbinit(){
echo "\n<!---Photo Lightbox Javascript initiation -->\n";
echo "<script language=\"javascript\">\n";
echo "initiatePLB();\n";
echo "</script>\n";

//end of settings

}


add_action('wp_footer','plbinit');


//function to load Photo Lightbox javascript into theme <head>
function load_photolightbox_script(){
//register script
wp_register_script('photolightbox', plugins_url('photolightbox.js',__FILE__));
//load script
wp_enqueue_script('photolightbox', plugins_url('photolightbox.js',__FILE__));
} 

//add script to theme <head>
add_action('init', 'load_photolightbox_script');


?>