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



//Some global variables
// Timing for gallery looping
// normal 5 sec
var nextImageTiming = 5000;
//reference array derived from image links in webpage
var refArray = [];
//image array to be shown in Photo Lightbox
var plbImage = [];
// to determine whether to show overlay
var showOverlay = true;
//Opacity of overlay
var overlayOpacity = 80;
//to hold loop generated image id number
var idNumber = 0; 
// to hold Photo Lightbox image calculated width
var newwidth = 0;
// to hold Photo Lightbox image calculated height
var newheight = 0;
// to hold current image number shown in Photo Lightbox
var currentImageNo = 0;
// to hold timer id for gallery looping
var TimerId = 0;

// to hold next Image Id
var nextImageId;

var MarqueeTimer = 0;

//to get scrollbar position
function getOffset() {
    var pageY;
	var pageX;
	var offset = [];
    if (typeof(window.pageYOffset) == 'number') {
       pageY=window.pageYOffset;
	   pageX=window.pageXOffset;

    }
    else {
       pageY = document.documentElement.scrollTop;
	   pageX = document.documentElement.scrollLeft;

    }
    offset.push(pageX,pageY);
	return offset;
}


// to get width of webpage by finding the maximum scroll bar position
function getWebpageWidthHeight(){
	var xWithScroll;
	var yWithScroll;
	var webpageWH = [];
	
	if (window.innerHeight && window.scrollMaxY) {// Firefox
		xWithScroll = window.innerWidth + window.scrollMaxX;
		yWithScroll = window.innerHeight + window.scrollMaxY;
	} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
		xWithScroll = document.body.scrollWidth;
		yWithScroll = document.body.scrollHeight;
	} else if (document.documentElement && document.documentElement.scrollHeight > document.documentElement.offsetHeight){ // Explorer 6 strict mode
        xWithScroll = document.documentElement.scrollWidth;
		 yWithScroll= document.documentElement.scrollHeight;
	} else { // works in Explorer 6 Strict, Mozilla (not FF) and Safari
		xWithScroll = document.body.offsetWidth;
		yWithScroll = document.body.offsetHeight;
  	}
	
	webpageWH.push(xWithScroll,yWithScroll);
	return webpageWH;
}

//get monitor resolution
function getMonitorWidthHeight(){
	var viewportwidth;
	var viewportheight;
	var viewportWH = [];
 // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
    if (typeof window.innerWidth !== 'undefined'){
        viewportwidth = window.innerWidth;
		viewportheight = window.innerHeight;

 }
// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
else {
	if (typeof document.documentElement !== 'undefined'&& typeof document.documentElement.clientWidth !=='undefined' && document.documentElement.clientWidth!== 0){
       viewportwidth = document.documentElement.clientWidth;
	   viewportheight = document.documentElement.clientHeight;

      }
    }
	
viewportWH.push(viewportwidth,viewportheight);
return viewportWH;
}

//function to fade in image by controlling opacity
function fadeImage(id, opacStart, opacEnd, millisec, fps) {
    //speed for each frame
    var speed =  Math.ceil(fps*(millisec / 1000));
    var timer = 0;

    //determine the direction for the blending, if start and end are the same nothing happens
    if(opacStart > opacEnd) {
        for(i = opacStart; i >= opacEnd; i--) {
            setTimeout("setOpacity(" + i + ",'" + id + "')",(timer * speed));
            timer++;
        }
    } else if(opacStart < opacEnd) {
        for(i = opacStart; i <= opacEnd; i++)
            {
            setTimeout("setOpacity(" + i + ",'" + id + "')",(timer * speed));
            timer++;
			
        }
    }
}

//set the opacity for different browsers
//opacity from 0 to 100
//example setOpacity(100,'CurrentImage');
function setOpacity(opacity, id) {
    var object = document.getElementById(id).style;
    object.opacity = (opacity / 100);
    object.MozOpacity = (opacity / 100);
    object.KhtmlOpacity = (opacity / 100);
    object.filter = "alpha(opacity=" + opacity + ")";
} 

function hideFlashVideo(){
	var FVObject = document.getElementsByTagName("object");
	for (i = 0; i < FVObject.length; i++) {
		FVObject[i].style.visibility = "hidden";
	}

	var FVEmbed = document.getElementsByTagName("embed");
	for (i = 0; i < FVEmbed.length; i++) {
		FVEmbed[i].style.visibility = "hidden";
	}

}


function showFlashVideo(){
	var FVObject = document.getElementsByTagName("object");
	for (i = 0; i < FVObject.length; i++) {
		FVObject[i].style.visibility = "visible";
	}

	var FVEmbed = document.getElementsByTagName("embed");
	for (i = 0; i < FVEmbed.length; i++) {
		FVEmbed[i].style.visibility = "visible";
	}

}

	
//function to preload close, ajaxloader.gif and overlay.png
function preloadPhotoLightBoxImages(){
	  preloadPLBImg = new Image();
      // set image url
      PLBImg_url = [];
      PLBImg_url[0] = "'+pb_to_image+'console.png";
	  PLBImg_url[1] = "'+pb_to_image+'bgoverlay.png";
	  PLBImg_url[2] = "'+pb_to_image+'ajaxloader.gif";
	  PLBImg_url[3] = "'+pb_to_image+'prev.png";
	  PLBImg_url[4] = "'+pb_to_image+'next.png";
	  PLBImg_url[5] = "'+pb_to_image+'pause.png";
	  PLBImg_url[6] = "'+pb_to_image+'play.png";
	  for(i=0; i<7; i++){
      preloadPLBImg.src = PLBImg_url[i];
      }
	
	}


//create some reuseable code

//document.getElementById(div) shortcut
function elem(div){
	var d = document.getElementById(div);
	return d;
	}
//Css styling functions
function style(div){
	this.div = elem(div);
	}
//margin	
style.prototype.setMargin = function(margin){
	this.mar = margin;
	this.div.style.margin = this.mar;
	return this.div.style.margin;
	};
//padding	
style.prototype.setPadding = function(padding){
	this.pad = padding;
	this.div.style.padding = this.pad;
	return this.div.style.padding;
	};
//width	
style.prototype.setWidth = function(width){
	this.wid = width;
	this.div.style.width = this.wid;
	return this.div.style.width;
	};
//height	
style.prototype.setHeight = function(height){
	this.hei = height;
	this.div.style.height = this.hei;
	return this.div.style.height;
	};
//background
style.prototype.setBackground = function(background){
	this.bac = background;
	this.div.style.background = this.bac;
	return this.div.style.background;
	};
//Zindex
style.prototype.setZindex = function(zindex){
	this.zin = zindex;
	this.div.style.zIndex = this.zin;
	return this.div.style.zIndex;
	};
//color
style.prototype.setColor = function(color){
	this.col = color;
	this.div.style.color = this.col;
	return this.div.style.color;
	};
//fontSize
style.prototype.setFontsize = function(fontsize){
	this.fon = fontsize;
	this.div.style.fontSize = this.fon;
	return this.div.style.fontSize;
	};
//textAlign
style.prototype.setTextalign = function(textalign){
	this.tex = textalign;
	this.div.style.textAlign = this.tex;
	return this.div.style.textAlign;
	};
//fontFamily
style.prototype.setFontfamily = function(fontfamily){
	this.fon = fontfamily;
	this.div.style.fontFamily = this.fon;
	return this.div.style.fontFamily;
	};
//cursor
style.prototype.setCursor = function(cursor){
	this.cur = cursor;
	this.div.style.cursor = this.cur;
	return this.div.style.cursor;
	};
//position
style.prototype.setPosition = function(position){
	this.pos = position;
	this.div.style.position = this.pos;
	return this.div.style.position;
	};
//left
style.prototype.setLeft = function(left){
	var monitorWidth = getMonitorWidthHeight();
	var xoffset = getOffset();
	var absoluteLeft = (monitorWidth[0]/2+xoffset[0]);
	this.lef = left;
	this.div.style.left = absoluteLeft + this.lef + "px";
	return this.div.style.left;
	};
//top
style.prototype.setTop = function(top){
	var yoffset = getOffset();
	var absoluteTop = yoffset[1];
	this.top = top;
	this.div.style.top = absoluteTop + this.top + "px";
	return this.div.style.top;
	};
//display elements
style.prototype.setDisplay = function(display){
	this.dis = display;
	this.div.style.display = this.dis;
	return this.div.style.display;
	};
//overflow
style.prototype.setOverflow = function(of){
	this.of = of;
	this.div.style.overflow = this.of;
	return this.div.style.overflow;
	};	
	
//hide elements
function hideElements(div){
	 for (i = 0;i < div.length;i++){
	 document.getElementById(div[i]).style.display = 'none';
	 }
}

//create elements
function createElem(elementName){
	var e = document.createElement(elementName);
		//set id Attribute
		e.id = elementName;
		//append div as child of document
		document.body.appendChild(e);
	
}
//create link 
function createLink(elementName){
	var plink = document.createElement("a");
		//set id Attribute
		plink.id = elementName;
		//append div as child of document
		document.body.appendChild(plink);
	
}

//function to create elements
function createPLBElements(){
		//Create Overlay Element
	    var wh = getWebpageWidthHeight();
	    var arrayoffset = getOffset();
		var overlaywidth = (wh[0] + arrayoffset[0]) + "px";
		var overlayheight = (wh[1] + arrayoffset[1]) + "px";
		createElem('TranslucentOverlay');
		var TO = new style("TranslucentOverlay");
		TO.setPosition('absolute');
		TO.setBackground("#000000");
		TO.setWidth(overlaywidth);
		TO.setHeight(overlayheight);
		TO.setDisplay('none');
		TO.setMargin('0px');
		TO.setPadding('0px');
		TO.setZindex('9980');
		elem("TranslucentOverlay").style.top = '0px';
		elem("TranslucentOverlay").style.left = '0px';
		setOpacity(0,'TranslucentOverlay');
		
	//Create Loading status image	
	    createElem('loadingimage');
		var lo = new style('loadingimage');
		lo.setZindex('9991');
		lo.setMargin('0px');
		lo.setPadding('0px');
		lo.setDisplay('none');
		lo.setWidth('75px');
		lo.setHeight('16px');
		lo.setFontsize('14px');
		lo.setTextalign('center');
		lo.setColor('#FFA500');
		lo.setFontfamily('Verdana');
		elem('loadingimage').style.lineHeight='1.2em';
		
		
	 //create console div to hold console image, <div id="console"></div>
		createElem('console');
		var Co = new style('console');
		Co.setBackground("url("+pb_to_image+"console.png)");
		Co.setZindex('9989');
		Co.setMargin('0px');
		Co.setPadding('0px');
		Co.setDisplay('none');
		Co.setWidth('766px');
		Co.setHeight('71px');

		
	//create ImageTitle div to hold image title <div id="ImageTitle"></div>
		createElem('ImageTitle');
		var Itt = new style('ImageTitle');
		Itt.setZindex('9990');
		Itt.setColor('#FFA500');
		Itt.setMargin('0px');
		Itt.setPadding('0px 2px 0px 2px');
		Itt.setDisplay('none');
	    Itt.setTextalign('center');
		Itt.setFontfamily('Verdana');
		Itt.setFontsize('12px');
		Itt.setWidth('305px');
		Itt.setHeight('16px');
		elem('ImageTitle').style.lineHeight='1.2em';

		
					
   //create ImageTargetDiv to hold CurrentImg <div id="ImageTargetDiv"></div>
		createElem('ImageTargetDiv');
		var ITD = new style("ImageTargetDiv");
		ITD.setDisplay('none');
		ITD.setZindex('9999');
		ITD.setMargin('0px');
		ITD.setPadding('8px');

		
	//create close <div id="close"></div>
        createElem('close');
		var C = new style('close');
		C.setZindex('9990');
		C.setMargin('0px');
		C.setPadding('0px 2px 0px 2px');
		C.setTextalign('center');
		C.setDisplay('none');
		C.setCursor('pointer');
		C.setWidth('40px');
		C.setHeight('43px');
		
    //create image counter div to hold image count, example 1 of 10 <div id="ImageCounter"></div>
		createElem('ImageCounter');
		var IC = new style('ImageCounter');
		IC.setZindex('9990');
		IC.setColor('#FFA500');
		IC.setMargin('0px');
		IC.setPadding('0px 2px 0px 2px');
		IC.setDisplay('none');
		IC.setTextalign('center');
		IC.setFontfamily('Verdana');
		IC.setFontsize('12px');
		elem('ImageCounter').style.lineHeight='1.2em';
		
    //create next image link! <a href="#" id="nextImageLink" onclick=".......">Next</a>
		createLink('nextImageLink');
		var nIL = new style('nextImageLink');
		nIL.setZindex('9990');
		nIL.setMargin('0px');
		nIL.setPadding('0px');
		nIL.setBackground("url("+pb_to_image+"next.png)");
     	nIL.setDisplay('none');
		nIL.setWidth('32px');
		nIL.setHeight('17px');
		
	// create previous image link! <a href="#" id="prevImageLink" onclick=".......">Prev</a>
		createLink('prevImageLink');
		var pIL = new style('prevImageLink');
		pIL.setZindex('9990');
		pIL.setMargin('0px');
		pIL.setPadding('0px');
		pIL.setBackground("url("+pb_to_image+"prev.png)");
		pIL.setDisplay('none');
		pIL.setWidth('32px');
		pIL.setHeight('17px');
		
	//create play <div id="pause"></div>
		createElem('pause');
		var pau = new style('pause');
		pau.setZindex('9990');
		pau.setMargin('0px');
		pau.setPadding('0px');
		pau.setBackground("url("+pb_to_image+"pause.png)");
		pau.setTextalign('center');
		pau.setDisplay('none');
		pau.setCursor('pointer');
		pau.setWidth('49px');
		pau.setHeight('49px');
		
		//create play <div id="play"></div>
		createElem('play');
		var pla = new style('play');
		pla.setZindex('9990');
		pla.setMargin('0px');
		pla.setPadding('0px');
		pla.setBackground("url("+pb_to_image+"play.png)");
		pla.setTextalign('center');
		pla.setDisplay('none');
		pla.setCursor('pointer');
		pla.setWidth('49px');
		pla.setHeight('49px');
		
		
	    //create info <div id="info"></div>
		createElem('info');
		var inf = new style('info');
		inf.setZindex('9990');
		inf.setMargin('0px');
		inf.setPadding('0px 2px 0px 2px');
		inf.setTextalign('center');
		inf.setDisplay('none');
		inf.setCursor('pointer');
		inf.setWidth('15px');
		inf.setHeight('15px');
		
		
	 //create infotext <div id="infotext"></div>
		createElem('infotext');
		var inft = new style('infotext');
		inft.setZindex('9990');
		inft.setMargin('0px');
		inft.setPadding('0px 2px 0px 2px');
		inft.setTextalign('center');
		inft.setDisplay('none');
		inft.setCursor('pointer');
		inft.setColor('#ffffff');
		inft.setFontsize('12px');
		inft.setFontfamily('Verdana');
		elem('infotext').innerHTML = 'Photo Lightbox by Denzel Designs';
		
		
}
//Marquee
var delayscroll=1000; //Specify initial delay before marquee starts to scroll on page (1000 = 1 seconds)
var marqueespeed=2;//Specify marquee scroll speed (lowest speed is 1)

function scrollmarquee(){
          if (parseInt(marquee.style.left)>(marqueeWidth*(-1)+8)){
              marquee.style.left=parseInt(marquee.style.left)-marqueespeed+"px";
             }
              else{
             marquee.style.left=parseInt(marqueeContainerWidth)+"px";
             }
    }

function initializemarquee(){
			marquee=document.getElementById("MarqueeText");
			marquee.style.left = '0px' ;
			marqueeWidth=marquee.offsetWidth;
			marqueeContainerWidth=document.getElementById("MarqueeContainer").offsetWidth;

            setTimeout('MarqueeTimer=setInterval("scrollmarquee()",100)', delayscroll);
    }


// function to hide overlay and some images that are delayed by timeout
function hideOverlay(){
	var elementArray = [];
	elementArray.push('TranslucentOverlay','loadingimage','pause','play');
    hideElements(elementArray);

	}

//function to hide photolightbox
function hidePLBox(){
     //clear setTimeout
	 clearTimeout(TimerId);
	 clearTimeout(MarqueeTimer);
	 fadeImage('TranslucentOverlay', overlayOpacity, 0, 100, 10);
     setTimeout(hideOverlay,100);
     var elements = [];
	 elements.push("close","ImageCounter","ImageTargetDiv","nextImageLink","prevImageLink","console","ImageTitle","loadingimage","pause","play","info");
     hideElements(elements);
	 showFlashVideo();
	 elem('ImageTargetDiv').innerHTML = "";//remove Photo Lightbox image
	
	
}//end of hidePLBox

//function call by to loop through images
function nextImage(){
	//check if next image id is null, hide all divs and clear timer
	if( document.getElementById(nextImageId)===null ){
	            //hide Photo lightbox and clear timer
	     		hidePLBox();

		}else{
          //clear timer
		  clearTimeout(TimerId);
		  clearTimeout(MarqueeTimer);
		  // show next image
		  showimage(nextImageId);
	
	}//end else
}//end 
	

	
//function to start finding image links in webpage to assign to reference Array

function searchImageLinks(){

    var count = 0;
    //find all links in webpage (HTML a tag) and assign to var linksInWebpage
	var linksInWebpage = document.getElementsByTagName("a");  
	
	//loop through links In Webpage
	for (i = 0; i < linksInWebpage.length; i++) {
		// if links In Webpage got attribute of href, which is the link address
		if (linksInWebpage[i].getAttribute("href")) {
			//use regular express to search through link address for an image file extension, and pick up matched image links, discarding other links.
			if (linksInWebpage[i].getAttribute("href").search(/(.*)\.(jpg|jpeg|gif|png|bmp|tif|tiff)/gi) != -1) {
		           //exclude images with rel='exclude'
				   if(linksInWebpage[i].getAttribute("rel")!= "exclude"){
					 //assign matched links to reference array
		             refArray[count] = linksInWebpage[i];
					 //increase reference array index
					 count++;
					  // onclick event to sort images into groups or single
					  linksInWebpage[i].onclick = function (event){
						  groupLinks(this);
						  hideFlashVideo();
						  return false;
						  };//end event
					  
		          }
		
			}
		}
	}
}//end of searchImageLinks()

function groupLinks(Obj){
	// reset id number
	idNumber = 0;
	
	//remove all ids from reference array of links, if there is any
	var ID; 
	for(f=0;f<refArray.length;f++){
	ID = (f)+'image';	
	if(elem(ID)!==null){
    		plbImage[f].removeAttribute('id');
 	      }
	}
	
	
	var ObjRel = Obj.getAttribute('rel');
	
	//test for links without rel attribute
	//arrange as single image
	if(ObjRel === null){

	plbImage[0] = Obj;
	plbImage[0].setAttribute('id','0image');
	var selectedImageId = plbImage[0].id;
	idNumber++;
	showimage(selectedImageId);
	
	 if(showOverlay === true){
     //show Overlay
                            elem('TranslucentOverlay').style.display = "block";
							setOpacity(0,'TranslucentOverlay');
                            fadeImage('TranslucentOverlay', 0, overlayOpacity, 100, 15);
								 
                             }

	return false;
   }//end if
   
   //check for grouped image
   var ObjRel2 = Obj.getAttribute('rel');
   if(ObjRel2 !== null){

	   var count2 = 0;
	   for(v=0;v<refArray.length;v++){
	     if(Obj.getAttribute('rel')==refArray[v].getAttribute('rel')){
	plbImage[count2] = refArray[v];
	//set in id for links
	plbImage[count2].setAttribute('id', idNumber+'image');
  				 count2++;
				 idNumber++;
		 
		 }
	   }//end for
	   
	     var selectedImagId = Obj.getAttribute('id');
		 showimage(selectedImagId);
   }//end if

 if(showOverlay === true){
//show Overlay
                            elem('TranslucentOverlay').style.display = "block";
							setOpacity(0,'TranslucentOverlay');
                            fadeImage('TranslucentOverlay', 0, overlayOpacity, 100, 15);
							elem('loadingimage').style.display = "block";
							
									 
 }

}//end function groupLinks

			
			
// function to show image object
function showimage(selectedImageId){
		 
		 
		 //show all divs and reset Positions
		 
		 //Image Target Div
		 elem('ImageTargetDiv').style.display = 'block';
		 
		 //loading image
		 var load = new style('loadingimage');
		 load.setPosition('absolute');
		 load.setDisplay('block');
		 load.setTop(+42); 
		 load.setLeft(+258);
		 //assign loading image to div
		 elem('loadingimage').innerHTML = '<img src="'+pb_to_image+'ajaxloader.gif" alt="loading" />';

		 
		 //console
		 var cons = new style('console');
		 cons.setDisplay('block');
		 cons.setPosition('absolute');
		 cons.setTop(+15); 
		 cons.setLeft(-393);


		 //image title
		 var Ig = new style('ImageTitle');
		 Ig.setDisplay('block');
		 Ig.setPosition('absolute');
		 Ig.setTop(+42); 
		 Ig.setLeft(-265);


		 //close
	     var clos = new style('close');
		 clos.setDisplay('block');
		 clos.setPosition('absolute');
		 clos.setTop(+28); 
		 clos.setLeft(+205);

		 
		 //counter
		 var Icount = new style('ImageCounter');
	     Icount.setDisplay('block');
		 Icount.setPosition('absolute');
		 Icount.setTop(+42); 
		 Icount.setLeft(-350);

	
		 //next link
		 var nextL = new style('nextImageLink');
		 nextL.setDisplay('block');
		 nextL.setPosition('absolute');
		 nextL.setTop(+42);
		 nextL.setLeft(+160);


		 //previous link
		 var prevL = new style('prevImageLink');
		 prevL.setDisplay('block');
		 prevL.setPosition('absolute');
		 prevL.setTop(+42);
		 prevL.setLeft(+60);

		 
		 //pause button
	     var paus = new style('pause');
		 paus.setDisplay('block');
		 paus.setPosition('absolute');
		 paus.setTop(+26);
		 paus.setLeft(+103);

		 
		 
		 //play button
	     var play = new style('play');
		 //do not display, only display by onclick pause div to prevent extra timer
		 play.setPosition('absolute');
		 play.setTop(+26); 
		 play.setLeft(+103);

		 
		 //info
		 var inf = new style('info');
		 inf.setDisplay('block');
		 inf.setPosition('absolute');
		 inf.setTop(+42);
		 inf.setLeft(+346);

		 
		 
		  //infotext
		 var inft = new style('infotext');
		 //do not display, will only display by mouseover info div
		 inft.setPosition('absolute');
		 inft.setTop(+84);
		 inft.setLeft(+165);


				 

//pause button control onclick event to clear time out to stop looping
	
	elem('pause').onclick = function (event) {
		//reset timer
	    clearTimeout(TimerId);
		elem('loadingimage').style.display="block";
		elem('loadingimage').innerHTML = 'Pause';
		//enable play after click
		elem('play').style.display = 'block';
		elem('pause').style.display = 'none';
	
	};
	
 
//play button control onclick event to start looping
	
	elem('play').onclick = function (event) {
		//reset timer
		clearTimeout(TimerId);
 	    //call nextImage to  start loop
		nextImage();
		elem('loadingimage').style.display="block";
	    elem('loadingimage').innerHTML = 'Play';
        //disable play after click to prevent user double click setting off extra timer
	    elem('play').style.display = 'none';
		elem('pause').style.display = 'block';
		
	};
	
	  
      
   //declare var imageIdNumber
   var imageIdNumber;
   //assign id of selectedImageId to imageIdNumber
   imageIdNumber = selectedImageId;

   //convert imageIdNumber which is in the form of 1image to integer 1 and assign to var imageIdNumberInteger
   //for testing and calculation of next and previous links
   var imageIdNumberInteger = parseInt(imageIdNumber);
   currentImageNo = imageIdNumberInteger;
 
  
  //get title of image
   var imageTitleText = elem(selectedImageId).getAttribute("title");

   if(imageTitleText === null){
	   elem('ImageTitle').innerHTML = 'No Title';
      }else{
	   var text = '<div id="MarqueeContainer" style="position:relative;width:305px;height:16px;overflow:hidden;text-align:center">';
	   text +='<div id="MarqueeText" style="width:100%;position:absolute;white-space:nowrap;text-align:center">';
	   text += imageTitleText;
	   text += '</div></div>';
       elem('ImageTitle').innerHTML = text;
   }


   //start loading current Image
   //create an image
    var preloadCurrentImg = new Image();

   //check for preload error, if error, there is probably a broken link
   preloadCurrentImg.onerror = function (event){
   //tell user broken link! and disable previous and next image links
    var ta = new style("ImageTargetDiv");
	 ta.setPosition('absolute');
	 ta.setTop(+100);
	 ta.setLeft(-250); 
     elem('ImageTargetDiv').innerHTML = "Error loading image, may be due to one of the following reasons;<br/><br/>1) Broken link<br/>2) Missing image from server<br/>3) Server connection error";
	 ta.setColor('#ffffff');
    elem('ImageCounter').innerHTML = '0 of 0';
    var hideElemArray = [];
	hideElemArray.push('nextImageLink','prevImageLink');
    hideElements(hideElemArray);

   
};

   
   //preload current image
	preloadCurrentImg.onload=function(){
         
		    // get actual width and height of image from preloading, for re-calculation
            var actualwidth = preloadCurrentImg.width;
			var actualheight = preloadCurrentImg.height;
			
		    //using 0.7 which is 70% of monitor view port height as new image height 
		    //- fixed for all images so as not to overflow view port(monitor)
			var monitorWidthHeight = getMonitorWidthHeight();
	    	newheight = (monitorWidthHeight[1]*0.7);
             
			//reduce width according to reduce height to maintain aspect ratio
			newwidth = (newheight/actualheight)*actualwidth;
			
			//check new width to ensure not more than 80% monitor width
			//if more than, set it to 80% monitor width
			if(newwidth>(monitorWidthHeight[0]*0.8)){
				newwidth = monitorWidthHeight[0]*0.8;
				
			}
			
	
    //reposition ImageTargetDiv	
	 var targ = new style("ImageTargetDiv");
	 targ.setPosition('absolute');
	 targ.setTop(+100);
	 var xxoffset = getOffset();
	 elem("ImageTargetDiv").style.left = ((monitorWidthHeight[0]-newwidth)/2+xxoffset[0]-26)+"px"; 

			
	 //create Photo Light Box image object
	 var CurrentImg = new Image();
  
     //set id, not sure it works or not?
	 CurrentImg.id = 'CurrentImage';

	//construct back image id from currentImageNo (example int 1 to string 1image)
	 var CurrentImageID = (currentImageNo)+"image";
	
	// use Current image id to get url and assign to imagelink
	 var imageLink = elem(CurrentImageID).href;
		
	//assign image width
	 var imageWidth = newwidth;
	
	//create structure of CurrentImg (Photo Lightbox Image)
	CurrentImg = '<img src="'+imageLink+'" id="CurrentImage" width="'+imageWidth+'" alt="" />';

	//insert CurrentImg into ImageTargetDiv using .innerHTML
	elem('ImageTargetDiv').innerHTML = CurrentImg;
	
	//Styles CurrentImage
	var CI = new style('CurrentImage');
	//hide Photo Lightbox image, display later using effects
	CI.setDisplay('none');
	//add translucent background
	CI.setBackground("url("+pb_to_image+"bgoverlay.png)");
	//margin and padding
	CI.setPadding('10px');
	
	//calculate count to be insert into image counter
	//currentImageNo is an array index, which starts from 0 for first image, therefore add 1 to show actual image number
	//example 1 of 15
	var count = currentImageNo+1;
	elem('ImageCounter').innerHTML = count;
	elem('ImageCounter').innerHTML += ' of ';
	elem('ImageCounter').innerHTML += idNumber;// get from global var idNumber as total number of images


    //constuction next image link Id
	nextImageId = (currentImageNo+1)+'image';

    //check link, if not null, build link, if null hide link
	if(elem(nextImageId)!==null){
	
	//using next image id to get next link in plbImage and assign its href attribute to nextImageLink
	//remember all links in plbImage are assigned with id of 0image 1image to ....image.
	elem('nextImageLink').href = elem(nextImageId).getAttribute("href");
				
	//preload next Image
	preloadNextImage = new Image();
	preloadNextImage.src = elem('nextImageLink').href;
	
	//onclick event to show next image 
	elem('nextImageLink').onclick = function (event) {
			  //clear timer
			  clearTimeout(TimerId);clearTimeout(MarqueeTimer);
	    //disable play after click to prevent user double click setting off extra timer
	    elem('play').style.display = 'none';
		elem('pause').style.display = 'block';
					 //show image after finishing effects
					showimage(nextImageId);
					return false;
				
	    };//end of onclick event
	}
	else{ 
         //if next image link is null, hide the link <div>
		 elem('nextImageLink').style.display = 'none';

	}

	
	//constuction previous image link Id
	var prevImageId = (currentImageNo-1)+'image';
	
	//check link, if not null build link, if null hide link
	if(elem(prevImageId)!==null){
    //using prev image id to get previous link in plbImage and assign its href attribute to prevImageLink
    elem('prevImageLink').href = elem(prevImageId).getAttribute("href");
				
	//preload previous Image
	preloadPrevImage = new Image();
	preloadPrevImage.src = elem('prevImageLink').href;
	
	//onclick event to show previous image 
	elem('prevImageLink').onclick = function (event) {
		    //clear timer
			 clearTimeout(TimerId); clearTimeout(MarqueeTimer);

     //disable play after click to prevent user double click setting off extra timer
	    elem('play').style.display = 'none';
		elem('pause').style.display = 'block';
			//show previous image after finishing effects	
	    	  showimage(prevImageId);
		      return false;
			  
		};//end of onclick event
				
	}
	
	else{ 
	//if previous image link is null, hide link
	elem('prevImageLink').style.display = 'none';
	
	}

    //show Photo Lightbox image
setOpacity(0,'CurrentImage');
elem('CurrentImage').style.display = "block";
elem('loadingimage').style.display = "none";
fadeImage('CurrentImage', 0, 100, 500, 15);

    //test image title length to determine whether to scroll left
var m = elem('MarqueeText').innerHTML;
    if(m.length>46){
      initializemarquee();
      }




};//end of preloadCurrentImg.onload=function()


	//preload image url	
	var preloadImageId = (currentImageNo)+"image";
	preloadCurrentImg.src  = elem(preloadImageId).href;

        
		//check overlay true or false.
        if(showOverlay === true){
			
			//onlick event for overlay, once click hide all divs
			elem("TranslucentOverlay").onclick = function (event) { 

				//hide Photo lightbox and clear timer
	     		hidePLBox();
				 
                 
			     };
	         }
			 
			 
			 
	     //onclick event to hide <div>, and hide Overlay
	       elem('close').onclick = function (event) { 
              
				 //hide Photo lightbox and clear timer
	     		hidePLBox();		 
				 
		    };//end of onclick event

         //mouseover event to show info text
	       elem('info').onmouseover = function (event) { 
	             
				  elem('infotext').style.display = 'block';	 
				 
		    };//end of mouseover event
		
		
		 //mouseout event to hide info text
	       elem('info').onmouseout = function (event) { 
	             
				  elem('infotext').style.display = 'none';	 
				 
		    };//end of mouseout event



  // timer for looping images
  TimerId = setTimeout(nextImage,nextImageTiming);


	  
}//end of function showimage()


//function to initiate Photo Lightbox script
function initiatePLB() {
searchImageLinks();
createPLBElements();	
//console.png, ajaxloader.gif and overlay.png
preloadPhotoLightBoxImages();
}

//onload event to fire initiatePLB(); after webpage has fully loaded.
//window.onload = initiatePLB; 


