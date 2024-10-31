=== Photo Lightbox ===
Contributors: denzel_chia
Donate link: http://denzeldesigns.com/wordpress-plugins/photo-lightbox/
Author link: http://denzeldesigns.com/wordpress-plugins/photo-lightbox/
Tags:photo lightbox, photo, lightbox, Lightbox, Photo, photo gallery, image gallery, javascript image gallery, javascript lightbox, javascript photo gallery, javascript photo lightbox
Requires at least:2.7.1
Tested up to: 2.9.2
Stable tag:1.2

== Description ==

Active Development has stopped for this plugin. Please use other lightbox plugin.

== Changelog ==

=1.2=

* Rewrited path to plugin javascript script using WordPress defined WP_PLUGIN_URL

* Loaded Javascript Initiation in wp_footer(), instead of onload event. This will allow Photo lightbox to work before web page finish loading.

* needs wp_footer() in WordPress Theme to work.

= 1.1 =

* Included auto left scroll marquee for long image title. 

* function to hide flash video during Photo Lightbox activation, so as to prevent certain flash video without wmode=transparent to show above images.
 
* Included css line-height for text, in order to overwrite line-height set by themes causing the text to shift down.

* photolightbox.js Minified and reduce from 30kb to 20kb. Loads much faster now.



== Installation ==

1. Deactivate any other javascript image gallery or lightboxes before installation. Because there could be conflict in scripts.

2. Install through the Add New option under Plugins in your WordPress Admin or Upload `photo-lightbox` to the `/wp-content/plugins/` directory and unzip

3. Activate the plugin through the 'Plugins' menu in WordPress

4. Go to your blog post or page, remember as in all javascript lightbox, please wait for webpage to be fully loaded.

5. Click on any thumbnail or image link and image will be shown in Photo Lightbox.



==Setting Up==

1. All images that have a link to source image in your server will be automatically included in Photo Lightbox.

2. Image links without rel attribute will be automatically included as a single image and not a grouped image.

3. To enter image rel and title attribute. After inserting thumbnail or image using image uploader. Click on the thumbnail and select edit image icon,
   a window will pop up. Ensure Link URL is link to image, select advance settings and key in link rel and title under Advance Link Settings. Click update when done.
   Title longer than the title box of Photo Lightbox Console, will be cropped.

4. To group image links or show images as a set, key in identical rel attribute for all images. No standard prefix needed. 
   Example rel='group1' for all images intended to be grouped in group1 and rel='animals' for all images of animals within the same post.

5. Thumbnails inserted by WordPress Gallery shortcode that are linked to Image files will be treated as single images, as we are unable to add in rel attribute to image link.

6. Thumbnails inserted by WordPress Gallery shortcode that are linked to attachment page will not be included in Photo Lightbox, because they are not image links,
   however the attachement image within the WordPress Gallery (image.php) may be included in Photo Lightbox, 
   depending on whether the image template codes the attachement image as an image link.

7. Enter exclude in link rel (rel='exclude'). To exclude any thumbnail or image link from Photo Lightbox.



==Navigations==

1. Click on next or previous arrow to show next or previous image. (In the case of grouped images)

2. Click on Opaque Black Overlay or Close icon to close Photo Lightbox.

3. Click on pause icon to pause image, a pause message will be shown in right hand side status box.

4. click on play icon will immediately show next image, in the event of last image shown, Photo Lightbox will close itself.

5. The Photo Lightbox console will show image count and image title (if there is any).


== Frequently Asked Questions ==

1. Why is Photo Lightbox not working ?

Please check that there is a wp_head(); template tag in your theme header.php.

Please check that there is a wp_footer(); template tag in your theme footer.php.

2. Why is error message shown ?

Photo Lightbox will show error message in the event that it fails to load an image from the server, due to image broken link, or image missing from server or server connection error.

3. Why does photo Lightbox closes before showing image ?

Photo Lightbox timeout may have occur before image gets fully loaded. Sorry for any inconvenience, Please click on image again.

4. Why is image out of monitor screen ?

User could be using a netbook or sub notebook with a small screen. User should select view in fullscreen from their web browser setting. Browsing in fullscreen mode should not have cropped image.

5. Why is Photo Lightbox behaving weirdly?

User may have clicked on controls too rapidly, causing script timeouts to overlap or delayed. However, this is unlikely to happen.



== Screenshots ==

1. Photo Lightbox




