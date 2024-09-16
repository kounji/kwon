function fullVisualChange(){
	var imgURL = $('.fullVisual .bgImg .imgCont').css('background-image');
	var imgType = ".jpg";
	var startStr = imgURL.indexOf("http");
	var endStr = imgURL.indexOf(".jpg");
	if(endStr == -1){
		startStr = imgURL.indexOf("(");
		endStr = imgURL.indexOf(".png");
		imgType = ".png";
	}
	var resultIMG = imgURL.substr(startStr, endStr-5) +imgType;
	$('.landType2 .bgImg').append('<img src="'+resultIMG+'" alt="">');
}

$(document).ready(function(){
	fullVisualChange();
});