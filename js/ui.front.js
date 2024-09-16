//================================================================================ popup
var globalObj = this;
var multiplePop = true;
var popAlertState = false;
var topPopState = false;
var customSelectWrapState = false;
var customSelectGlobal = false;
var globalScroll = 0;
var isMobile;
var isIOS;
var popupInterval;
var popupIntervalStr;
var winH = $(window).height();
var lastWidth;
var lastScrollY;

(function(g){
	var fnCb; //◀추가:개별팝업에서 콜백함수를 셋팅할수 있는 함수 객체.
	var common = common || {};
	common = {
		popupOpen : function (url, jsParam, fnObj, jsURL){ //◀추가:jsParam(json 파라미터 객체), fnObj(콜백함수)
			lastWidth = $('body').outerWidth();
			if( $('body').hasClass('isMobile') == true ){
				mobileLock();
			}
			if(fnObj != undefined && fnObj != null && fnObj != ""){
				fnCb = fnObj; //◀추가:콜백함수 셋팅.
			}
			$('html, body').addClass('popOn');
			if( lastWidth != $(window).width() ){
				$('body').addClass('hasScroll');
			}
			$('.popWrap').removeClass('nowOpen');
			multiplePop = false;
			if( url.indexOf('/') != -1 ){
				var str = url + " .popContain";
				$("body").append('<div id=\''+url.substring(url.indexOf('/')+1, url.indexOf('.'))+'_cPopup\' class="popWrap nowOpen ajaxPop"></div>');
				$('.nowOpen').hide();
				$("body .ajaxPop.nowOpen").load(str, jsParam, function(){ //◀추가:jsParam 추가
					try{
						jexMl.asyncTranslateHtml( $("body .ajaxPop.nowOpen") );
					} catch(e){}
					$('.nowOpen').fadeIn('fast',function(){
						$('.nowOpen .titH2').attr("tabindex", -1).focus();
					});
					uiBind();
					$('.wrapper').attr('aria-hidden','true');
					$('.wrapper').attr('tabindex',-1);
					if( jsURL != undefined )$.getScript( jsURL ).done(function(){ cf_popfooter(); }).fail(function(){ cf_popfooter(); });
					popupIntervalStr = '.nowOpen';
					popupResize(popupIntervalStr);
					popupInterval = setInterval(popupResizeInterval, 1000);
				});
			} else {
				var str = url;
				var targetPop = $(str);
				targetPop.addClass('nowOpen');
				targetPop.fadeIn('fast',function(){
					$('.nowOpen .titH2').attr("tabindex", -1).focus();
				});
				$('.wrapper').attr('aria-hidden','true');
				$('.wrapper').attr('tabindex',-1);
				if( jsURL != undefined )$.getScript( jsURL ).done(function(){ cf_popfooter(); }).fail(function(){ cf_popfooter(); });
				popupResize(".nowOpen");
				popupIntervalStr = '.nowOpen';
				popupResize(popupIntervalStr);
				popupInterval = setInterval(popupResizeInterval, 1000);
			}
		},
		popupChange : function(url, jsParam, fnObj, jsURL, remove){
			multiplePop = true;
			if(fnObj != undefined && fnObj != null && fnObj != ""){
				fnCb = fnObj; //◀추가:콜백함수 셋팅.
			}
			$('body .popWrap.nowOpen').css('z-index',1100);
			var popH = $('body .popWrap.nowOpen .popCont').outerHeight();
			$('body .popWrap.nowOpen').addClass('loading');
			$('body .popWrap.nowOpen .popCont').css('min-height', popH);
			loadingInit( $('body .popWrap.nowOpen .popCont') );
			$('body .popWrap.nowOpen .popCont .loadingWrap').css('min-height', popH - 80);
			setTimeout(
				function (){ popupChange(url, jsParam, fnObj, jsURL, remove);
			},1000);
		},
		popupClose : function (mTime){
			fnCb = null;
			popClose(mTime);
		},
		callBack : function(aa){ //◀추가:개별팝업에서 콜백 함수 호출 할수 있도록 제공.
			fnCb(aa);
		},
		callBackNullClose : function (mTime){
			if(fnCb != undefined && fnCb != null && fnCb != ""){
				fnCb(null); //◀추가:콜백함수 셋팅.
			}
			fnCb = null;
			popClose(mTime);
		},
		setCallBack : function(pFn){ //◀추가:팝업 호출시 콜백 함수를 셋팅 할수 있도록 제공.
			fnCb = pFn;
		},
		popAlert: function (url, jsParam, fnObj, jsURL){ //◀추가:jsParam(json 파라미터 객체), fnObj(콜백함수)
			if( $('body').hasClass('isMobile') == true ){
				mobileLock();
			}
			lastWidth = $('body').outerWidth();
			if(fnObj != undefined && fnObj != null && fnObj != ""){
				fnCb = fnObj; //◀추가:콜백함수 셋팅.
			}
			if($('body').hasClass('popOn') == true ){
				popAlertState = true;
			} else {
				popAlertState = false;
				$('html, body').addClass('popOn');
				if( lastWidth != $(window).width() ){
					$('body').addClass('hasScroll');
				}
			}
			if( url.indexOf('/') != -1 ){
				var str = url + " .popContain";
				$("body").append('<div class="popWrap nowAlert ajaxPop mAlert"></div>');
				$('.mAlert').hide();
				$("body .popWrap.nowAlert").load(str, jsParam, function(){ //◀추가:jsParam 추가
					$('.nowAlert').fadeIn('fast', function(){
						$('.nowAlert .titH2').attr("tabindex", -1).focus();
					});
					uiBind();
					$('.wrapper').attr('aria-hidden','true');
					$('.wrapper').attr('tabindex',-1);
					if( jsURL != undefined )$.getScript( jsURL );
					$('.nowAlert .popContain').height($(window).height() - 60);
				});
			} else {
				var str = url;
				var targetPop = $(str);
				targetPop.addClass('nowAlert');
				targetPop.fadeIn('fast', function(){
					targetPop.find('.titH2').attr("tabindex", -1).focus();
				});
				$('.wrapper').attr('aria-hidden','true');
				$('.wrapper').attr('tabindex',-1);
				if( jsURL != undefined )$.getScript( jsURL );
				$('.nowAlert .popContain').height($(window).height() - 60);
			}
		},
		alertClose: function (){
			if( popAlertState == false ){
				if($('.nowAlert.ajaxPop').length > 0 ){
					$('body .nowAlert.ajaxPop').fadeOut(300, function(){
						$(this).remove();
						alertClose();
					});
				} else {
					$('body .nowAlert').fadeOut(300, function(){
						$(this).removeClass('nowAlert');
						alertClose();
					});
				}
			} else {
				$('body .nowAlert').fadeOut(300, function(){
					popAlertState = false;
					if($('.nowAlert.ajaxPop').length > 0 ){
						$('body .nowAlert.ajaxPop').fadeOut(300, function(){
							$(this).remove();
						});
					} else {
						$('body .nowAlert').fadeOut(300, function(){
							$(this).removeClass('nowAlert');
						});
					}
					if( $('body').hasClass('isMobile') == true ){
						mobileLockRelease();
					}
				});
			}
		}
	};
	g.common = common;
})(globalObj);

function popupChange(url, jsParam, fnObj, jsURL, remove){
	if( url.indexOf('/') != -1 ){
		var str = url + " .popContain";
		$("body").append('<div class="popWrap noBG ajaxPop"></div>');
		$('.popWrap.noBG.ajaxPop').hide();
		$('.popWrap.noBG.ajaxPop').css('z-index',1111);
		$("body .noBG.ajaxPop").load(str, jsParam ,function(){
			try{
				jexMl.asyncTranslateHtml( $("body .noBG.ajaxPop") );
			} catch(e){}
			$('.noBG').show();
			popWrapCtrl();
			uiBind();
			$('.wrapper').attr('aria-hidden','true');
			if(remove == true ){
				$('.popWrap.nowOpen').remove();
			} else {
				$('.popWrap.nowOpen').removeClass('nowOpen');
			}
			$('.popWrap.noBG').addClass('nowOpen');
			$('.nowOpen .titH2').attr("tabindex", -1).focus();
			$('.popWrap.noBG').removeClass('noBG');
			if( jsURL != undefined )$.getScript(  jsURL, function(){cf_popfooter();} );
			popupResize('.noBG');
		});
	} else {
		var str = url;
		var targetPop = $(str);
		targetPop.css('z-index',1111);
		targetPop.addClass('noBG');
		targetPop.show();
		popWrapCtrl();
		$('.wrapper').attr('aria-hidden','true');
		targetPop.find('.titH2').attr("tabindex", -1).focus();
		if(remove == true ){
			$('.popWrap.nowOpen').remove();
		} else {
			$('.popWrap.nowOpen').removeClass('nowOpen');
		}
		$('.popWrap.noBG').addClass('nowOpen');
		$('.popWrap.noBG').removeClass('noBG');
		if( jsURL != undefined )$.getScript(  jsURL, function(){cf_popfooter();} );
		popupResize(str+".noBG");
	}
}

function popWrapCtrl(){
	$('.popWrap.nowOpen').removeClass('loading');	
	$('.popWrap.nowOpen .loadingWrap').remove();	
	$('.popWrap.nowOpen').hide();	
}

function popupResizeInterval(){
	//console.log("popupResizeInterval : " + popupIntervalStr ); // 1차오픈용 20161208-박-console.log 막기
	if( $(popupIntervalStr + ' .scroll').hasClass('on') == false && $(popupIntervalStr + ' .scroll').hasClass('off') == false  ){
		popupResize(popupIntervalStr);
	}
	if(winH != $(window).height()){
		var checkNum = Math.abs( winH - $(window).height() );
		if( isIOS == true ){
			if(checkNum > 100){
				popupResize(popupIntervalStr);
				winH = $(window).height();
			}
		} else {
			winH = $(window).height();
			popupResize(popupIntervalStr);
		}
	}
}

function popupResize(str){
	//console.log("popupResize : " + str ); // 1차오픈용 20161208-박-console.log 막기
	if( $('.popWrap.nowOpen .popCont').hasClass('max') == true ){
		$('.popWrap.nowOpen .popContain').addClass('max');
	}
	if( $(str).is('.mAlert') == false ){
		$(str + ' .scroll').removeClass('on');
		$(str + ' .scroll').css('height','auto');
		var winH = $(window).height();
		try{
			var scrollPos = $(str + ' .scroll').position().top;
		} catch(error){
			scrollPos = 0;
		}
		var targetPX = $(str + ' .scroll').css('margin-top');
		if( targetPX != undefined ){
			var result = winH - scrollPos - 60 - 40 - Number( targetPX.replace('px','') );
		}
		$('.popWrap.nowOpen .popCont').css('min-height', 0);	

		var vGap = 60; // 60은 팝업과 검은색 Dimmed 영역의 위아래 합산된 마진,
		if($(window).width() < 768 ){
			var targetPX = $(str + ' .scroll').css('margin-top');
			if( targetPX != undefined ){
				result = winH - scrollPos - Number( targetPX.replace('px','') ) - 25;
			}
			vGap = 0;
			$('.popWrap.nowOpen .popCont').css('min-height', $(window).height());	
		} else {
			$('.popWrap.nowOpen .popCont').css('min-height', 0);	
		}
		if( $(str + ' .sticky').length > 0 ){
			result -= $(str + ' .sticky').outerHeight();
		}
		if( winH - vGap < $(str + ' .popup .popCont' ).outerHeight() ){
			try{
				if( $(str + ' .sticky').length > 0 ){
					var bottomH = $('.nowOpen .sticky').outerHeight();
				} else {
					bottomH = $('.nowOpen .popCont .btnArea').outerHeight();
				}
				if( $(window).width() >= 768 ){
					var maxH = $(window).height()- vGap - 40-40- $('.nowOpen .titH2').height() - bottomH - Number( targetPX.replace('px','') ); //  40은 위아래 패딩값
					if(result > maxH ){
						result = maxH;
					}
					$(str + ' .scroll').height(Math.floor(result));
				} 
				/*else {
					maxH = $(window).height()-25-25- $('.nowOpen .titH2').height() - bottomH - Number( targetPX.replace('px','') );// 25는 팝업 위아래 패딩값
				}*/
			} catch(e){}
			if( isMobile == false ){
				$(str + ' .scroll').addClass('on');
			} else {
				$(str + ' .scroll').addClass('off');
			}
		}
		if( isMobile == true && $('body').hasClass('popOn') == true ){
			$('body').css('height', $(window).height());
		}
		if( isMobile == true && $(window).width() < 768 && $(str + ' .scroll .tblScroll').length > 0 ){
			//console.log("모바일이면서 테블릿이 아니고 가로스크롤 테이블이 있는 경우");
			$('html').addClass('tblScllMode');
		}
	}
}

function alertClose(){
	$('.popWrap').attr('aria-hidden','true');
	$('.wrapper').removeAttr('tabindex');
	$('html, body').removeClass('popOn');
	$('body').removeClass('hasScroll');
	if( $('body').hasClass('isMobile') == true ){
		mobileLockRelease();
	}
}

function popClose(mTime){
	//console.log(">>>>>>>>>>>>>>popClose");
	clearInterval( popupInterval );
	if(mTime == null || mTime == undefined){
		mTime = 300;
	}
	$('body .nowOpen').fadeOut(mTime, function(){
		$('body .ajaxPop').remove(); 
		$('.popWrap').attr('aria-hidden','true');
		$('.wrapper').attr('aria-hidden','false');
		$('.wrapper').removeAttr('tabindex');
		$('.popWrap').removeClass('nowOpen');
		$('html, body').removeClass('popOn');
		$('body').removeClass('hasScroll');
		if( $('body').hasClass('isMobile') == true ){
			mobileLockRelease();
		}
	});
}

function popupMove(){
	$( ".popWrap" ).insertAfter( ".wrapper" );
}

function mobileLock(){
	lastScrollY = $('body').scrollTop();
	if(lastScrollY == 0){
		lastScrollY = $('html').scrollTop();
	}
	$('.wrapper').css('top', -lastScrollY );
}

function mobileLockRelease(){
	$('body').css('height','auto');
	$('.wrapper').css('top', 0 );
	$('html').removeClass('tblScllMode');
	$('html, body').scrollTop(lastScrollY);
}

//================================================================================ PC GNB
var pcGnbOpen = false;
var delay=200, setTimeoutNavi, setTimeoutFocus;
function gnbInit(){
	//$('.mGnb .depth2, .mGnb .depth3, .mGnb .depth4').hide();
	for(var  i = 0 ; i < $('.gnb .menu li').length ; ++i ){
		if( $('.gnb .menu li:eq('+ i +') > div').length == 0 ){
			$('.gnb .menu li:eq('+ i +')').addClass('isLink');
		}
	}
	$('.gnb .menu > li  li > a').bind({
		'mouseover focus': function(e){
			$(this).parent().siblings().removeClass('on');
			$(this).parent().find('li').removeClass('on');
			$(this).parent().addClass('on');
			//clearTimeout(setTimeoutFocus);
			gnbHeightSet();
		},
		'click':function(e){
			if( isMobile == true && $(this).parent().hasClass('isLink') == false )e.preventDefault();
		}
	});
	$('.header .gnb .menu > li > a').bind({
		'mouseover focusin': function(e){
			clearTimeout(setTimeoutNavi);
			var target = $(this).parent();
			if( pcGnbOpen == false ){
				setTimeoutNavi = setTimeout( function(){oneDepthOver( target );}, delay);
			} else {
				oneDepthOver( target );
			}
		},
		'mouseout': function(e){
			clearTimeout(setTimeoutNavi);
		},
		'click':function(e){
			if( isMobile == true && $(this).parent().hasClass('isLink') == false )e.preventDefault();
		}
	});
	$('.header .navbarArea').bind({
		'mouseleave': function(e){
			$('.gnb .menu > li .depth2').hide();
			$('.gnb .menu > li').removeClass('on');
			$('.navbarArea').height(50);
			overflowScrollCtrl(50);
			pcGnbOpen = false;
		},
		/*'focusout': function(e){
			setTimeoutFocus = setTimeout( function(){ $('.header .navbarArea').trigger('mouseleave'); }, delay);
			
		}*/
	});
	var fistFocusEl = $('.branding').find('a').last();
	fistFocusEl.bind({
		'focusin' : function(){
			$('.gnb .menu > li .depth2').hide();
			$('.gnb .menu > li').removeClass('on');
			$('.navbarArea').height(50);
			overflowScrollCtrl(50);
			pcGnbOpen = false;
		}
	});
	var lastliEl = $('.header .menu > li:last-child > .depth2 > ul > li:last-child');
	lastliEl = lastliEl.find('> div:last-child > ul > li:last-child');
	if(lastliEl.hasClass('isLink') == false){
		lastliEl = lastliEl.find('> div:last-child > ul > li:last-child');
	}
	lastliEl.bind({
		'focusout': function(e){
			$('.gnb .menu > li .depth2').hide();
			$('.gnb .menu > li').removeClass('on');
			$('.navbarArea').height(50);
			overflowScrollCtrl(50);
			pcGnbOpen = false;
		}
	});
	
	// gnb 메뉴 닫기 버튼
	$('.gnb .btnImgGnbClose').bind({
		'click': function(){
			$('.gnb .menu > li .depth2').hide();
			$('.gnb .menu > li').removeClass('on');
			$('.navbarArea').height(50);
			overflowScrollCtrl(50);
			$('.gnb').removeClass('gnbOpen');
			pcGnbOpen = false;
		}
	});
	
	// Mobile
	$('.header .menuAll').bind({
		'click': function(e){
			globalScroll = $(window).scrollTop();
			$('.mGnb').addClass('ing');
			$('.mGnb').css( 'top', globalScroll );
			$('.menuWrap').scrollTop(0);
			$('.mGnb').show();
			$('.wrapper').attr('aria-hidden','true');
			setTimeout(function(){
				$('.mGnb').addClass('on');
			},10);
			setTimeout(function(){
				$('html, body').addClass('off');
				$('.mGnb').removeClass('ing');
				$('.mGnb').css( 'top', 0 );
				$('.mGnb').attr("tabindex", -1).focus();
			},500);
		}
	});
	$('.mGnb .close').bind({
		'click': function(e){
			$('.wrapper').attr('aria-hidden','false');
			$('html, body').removeClass('off');
			$('.mGnb').addClass('out');
			$('.mGnb').addClass('ing');
			$(window).scrollTop(globalScroll);
			$('.mGnb').css( 'top', globalScroll );
			setTimeout(function(){
				$('.mGnb').hide();
				$('.mGnb').removeClass('ing');
				$('.mGnb').removeClass('out');
				$('.mGnb').removeClass('on');
			},500);
		}
	});
}
function oneDepthOver(target){
	target.siblings().removeClass('on');
	$('.gnb .menu > li .depth2').hide();
	target.find('li').removeClass('on');
	target.find('li:eq(0)').addClass('on');
	if( pcGnbOpen == false ){
		target.find('.depth2').show();
	} else {
		target.find('.depth2').show();
	}
	target.addClass('on');
	pcGnbOpen = true;
	gnbHeightSet();
}

function gnbHeightSet(){
	var gnbH2 = $('.gnb .on .depth2').outerHeight() + 60;
	var gnbH3 = $('.gnb .on .depth2 .on .depth3').outerHeight() + 60;
	var gnbH4 = $('.gnb .on .depth2 .on .depth3 .on .depth4').outerHeight() + 60;
	var result = Math.max(gnbH2, gnbH3, gnbH4);
	$('.navbarArea').addClass('overAuto'); 
	if(result < 70){
		result=50; 
		$('.gnb').removeClass('gnbOpen');
		overflowScrollCtrl(result);
	} else {
		$('.gnb').addClass('gnbOpen');
	}
	$('.navbarArea').css('max-height', Number($(window).height()-50) );
	$('.navbarArea').height(result);
}

function overflowScrollCtrl(result){
	if(result == 50){
		$('.gnb').removeClass('gnbOpen');
		$('.navbarArea').removeClass('overAuto'); 
	}
}

//================================================================================ Mobile GNB
function mobileGnbMake(){
	var langBtn = $('.toplinks  .linkLanguage').clone(true);
	var topTitle = "HOME";
	if($('.header').hasClass('post') == true){
		topTitle = jexComMl("ui.front_J0002" ,"인터넷뱅킹");
	} else if( $('.header').hasClass('gold') == true ){
		topTitle = "Citi Gold";
	} else if( $('.header').hasClass('priority') == true ){
		topTitle = jexComMl("ui.front_J0049" ,"씨티 프라이어리티");
	} else if( $('.header').hasClass('business') == true ){
		topTitle = jexComMl("ui.front_J0050" ,"씨티비즈니스");
	}
	var mGnb =  '<div class="mGnb">'+
				'	<div class="head">'+
				'		<a href="#" class="topTitle">'+ topTitle +'</a>'+
				'		<button type="button" class="back"><span class="tit" aria-hidden="true"></span><span class="blind">'+jexComMl("ui.front_J0003" ,"1차메뉴로 돌아가기")+'</span></button>'+
				'	</div>'+
				'	<div class="gnbWrap">'+
				'		<div class="menuWrap original">'+
				'			<div class="foot">'+
				'				<ul class="siteMenu">'+
				'				</ul>'+
				'				<div class="icoArea">'+
				'					<ul>'+
				'						<li class="bank"><a href="#"></a></li>'+
				'						<li class="card"><a href="#"></a></li>'+
				'						<li class="atm"></li>'+
				'					</ul>'+
				'					<div class="lang"></div>'+
				'				</div>'+
				'			</div>'+
				'		</div>'+
				'		<div class="menuWrap ghost"></div>'+				
				'	</div>'+
				'	<button type="button" class="close"><img src="../../img/m/gnb_close.png" alt="'+jexComMl("ui.front_J0005" ,"닫기")+'"></button>'+
				'</div>';
	$('body').append(mGnb);
	$('.mGnb').addClass( $('.header').attr('class') );
	$('.mGnb .lang').append(langBtn);
	$('.mGnb .siteMenu').append( $('.header .toplinks >ul').html() );
	$('.mGnb').removeClass('header');
	$('.header .menu').clone().insertBefore($('.menuWrap .foot'));
}

function mobileGnbInit(){
	$('.mGnb .depth2, .mGnb .depth3, .mGnb .depth4').hide();
	for(var  i = 0 ; i < $('.mGnb .menu li').length ; ++i ){
		if( $('.mGnb .menu li:eq('+ i +') > div').length == 0 ){
			$('.mGnb .menu li:eq('+ i +')').addClass('isLink');
		}
	}
	$('.mGnb .menu > li > a, .mGnb .depth3 > ul > li > a').bind({
		'click': function(e){
			if($(this).parent().hasClass('isLink') == false){
				e.preventDefault();
				if( $(this).parent().hasClass('on') == false ){
					$('.mGnb .menu > li.on > div').slideUp();
					$('.mGnb .menu > li.on').removeClass('on');
					$(this).parent().addClass('on');
					$(this).next().slideDown();
				} else {
					$('.mGnb .menu > li.on > div').slideUp();
					$('.mGnb .menu > li.on').removeClass('on');
				}
			}
		}
	});
	
	$('.mGnb .menu .depth2 > ul > li > a').bind({
		'click': function(e){
			if($(this).parent().hasClass('isLink') == false ){
				e.preventDefault();
				$('.ghost').empty();
				$(this).next().find('> ul').clone(true).appendTo( ".ghost" );
				$('.mGnb .ghost > ul').show().addClass('menu');
				$('.mGnb').addClass("sub");
				$('.mGnb .head .back').text( $(this).text() );
				setTimeout(function(){
					$('.mGnb .ghost .menu:first-child > li:first-child ').attr("tabindex", -1).focus();
				},500);
			}
		}
	});
	
	$('.mGnb .head .back').bind({
		'click': function(e){
			$('.mGnb').removeClass("sub");
		}
	});
}

function mGnbFootMenuSetting(){
	var internetBank = $('.footer .internetBanking');
	var citiCard = $('.footer .creditCard');
	var atm = $('.footer .atm').html();
	var langBtn = $('.header .linkLanguage');
	if(internetBank.text() != ""){
		$('.mGnb .bank').find('a').text(internetBank.find('span').text());
		$('.mGnb .bank').find('a').attr('href', internetBank.find('a').first().attr('href'));
		$('.mGnb .card').find('a').text(citiCard.find('span').text());
		$('.mGnb .card').find('a').attr('href', citiCard.find('a').first().attr('href'));
		$('.mGnb .atm').append(atm);
	}
}

//================================================================================ PC LNB(권작성)
function lnbInit(){
	if( $('.lnbWrap').length  > 0 ){
		for(var  i = 0 ; i < $('.lnbWrap .lnbArea li').length ; ++i ){
			if( $('.lnbWrap .lnbArea li:eq('+ i +') > ul').length == 0 ){
				$('.lnbWrap .lnbArea li:eq('+ i +')').addClass('isLink');
			}else{
				$('.lnbWrap .lnbArea li:eq('+ i +')').addClass('sub').children('a').attr('role','button');
			}
		}
		$('.lnbWrap .lnbArea .lnbDepth2 > li > a').bind({
			'click': function(){
				if(!$(this).parent().hasClass('on')){
					$('.lnbArea .lnbDepth2 > li.on > ul').slideUp();
					$('.lnbArea .lnbDepth2 > li.on').removeClass('on');
					$('.lnbArea .lnbDepth2 > li > ul.lnbDepth3 > li.on > ul').slideUp();
					$('.lnbArea .lnbDepth2 > li > ul.lnbDepth3 > li.on').removeClass('on');
					$('.lnbArea .lnbDepth2 > li > ul.lnbDepth3 > li > ul.lnbDepth4 > li.on > ul').slideUp();
					$('.lnbArea .lnbDepth2 > li > ul.lnbDepth3 > li > ul.lnbDepth4 > li.on').removeClass('on');
					$(this).parent().addClass('on');
					$(this).next().slideDown();
				}else{
					$('.lnbArea .lnbDepth2 > li.on > ul').slideUp();
					$('.lnbArea .lnbDepth2 > li.on').removeClass('on');
					$('.lnbArea .lnbDepth2 > li.on').removeClass('on');
				}
			}
		});
		$('.lnbWrap .lnbArea .lnbDepth3 > li > a').bind({
			'click': function(){
				if(!$(this).parent().hasClass('on')){
					$('.lnbArea .lnbDepth3 > li.on > ul').slideUp();
					$('.lnbArea .lnbDepth3 > li.on').removeClass('on');
					$('.lnbArea .lnbDepth3 > li > ul.lnbDepth4 > li.on > ul').slideUp();
					$('.lnbArea .lnbDepth3 > li > ul.lnbDepth4 > li.on').removeClass('on');
					$(this).parent().addClass('on');
					$(this).next().slideDown();
				}else{
					$('.lnbArea .lnbDepth3 > li.on > ul').slideUp();
					$('.lnbArea .lnbDepth3 > li.on').removeClass('on');
				}
			}
		});
		$('.lnbWrap .lnbArea .lnbDepth4 > li > a').bind({
			'click': function(){
				if(!$(this).parent().hasClass('on')){
					$('.lnbArea .lnbDepth4 > li.on > ul').slideUp();
					$('.lnbArea .lnbDepth4 > li.on').removeClass('on');
					$(this).parent().addClass('on');
					$(this).next().slideDown();
				}else{
					$('.lnbArea .lnbDepth4 > li.on > ul').slideUp();
					$('.lnbArea .lnbDepth4 > li.on').removeClass('on');
				}
			}
		});
	}
}

function lnbLoad(_code){
	if( pubMode == true ){
		var code = 0;
		if($('.header').hasClass('business') == false && $('.header').hasClass('gold') == false ){
			var url = '../ajax/layout_lnb.html .lnbDepth2';
			$('.lnbArea').load(url,function(){
				lnbInit();
			});
		} else {
			
		}
		
	} else {
		lnbInit();
	}
}

//================================================================================ loading
function loadingInit( target, white ){
	if( white != "white" ){
		var str = '<div class="loadingWrap"><div class="loadingArea"><span class="img loading"></span><span class="message">'+jexComMl("ui.front_J0006" ,"잠시만 기다려주세요.")+'</span></div></div>';
	} else {
		str = '<div class="loadingWrap white"><div class="loadingArea"><span class="img loading"></span><span class="message">'+jexComMl("ui.front_J0006" ,"잠시만 기다려주세요.")+'</span></div></div>';
	}
	target.append(str);
}

function loadingRemove(){
	$('.loadingWrap').remove();
}

//================================================================================ INPUT init
function inputInit(target){
	var targetContain = "";
	if(target != null){
		 targetContain = target + " ";
	}
	for(var i = 0; i < $(targetContain + '.formWrap').length ; ++i ){
		if($(targetContain + '.formWrap').eq(i).hasClass('uiAct') == false ){
			$(targetContain + '.formWrap').eq(i).addClass('uiAct');
			var label = ".formWrap:eq("+i+") .txtIptLabel";
			var inputForm = ".formWrap:eq("+i+") > .formControl";
			if( $('.formWrap:eq('+i+') > input.formControl').attr('readonly') != null ){// input readonly 추가.
				$('.formWrap:eq('+i+')').addClass('hasValue');
			}
			if($('.formWrap:eq('+i+') > input.formControl').val() != ""){//value select or value input
				$('.formWrap:eq('+i+')').addClass('hasValue');
			} 
			
			if($(inputForm).hasClass('numPad') && isMobile == true ){
				if($(inputForm).attr("type") == "text"){ 
					$(inputForm).attr("type", "tel"); 
				}
			}
			
			//select
			if( $(inputForm).is('select') ){
				if( $(inputForm).prop('selectedIndex') == 0 && $(inputForm + ' option:eq(0)').attr('disabled') == undefined ){ 
					$(inputForm).parent().addClass('hasValue');
				} else if ($(inputForm).prop('selectedIndex') != 0){
					$(inputForm).parent().addClass('hasValue');
				} else {
					$(inputForm).parent().removeClass('hasValue');
				}
				if( $(label).find('.essential').length > 0){
					$(label).parent().addClass('hasEssent');
				}
			}
			// autoTip
			if( $(inputForm).parent().is('.autoTip')){
				$(inputForm).data('autoTip',true);
				$(inputForm).parent().next().find('.tipWrap').data('autoTip',true);
				if( $(inputForm).parent().next().find('.tipWrap').length == 0 ){
					$(inputForm).parent().next().next().find('.tipWrap').data('autoTip',true);
				}
			}
			// textarea를 제외한 요소
			if( $('.formWrap:eq('+i+') textarea').length == 0 ){
				$(label + ' +.formControl').attr('placeholder', $(label).text());
				var icon = $(label + ' .essential' ).clone();
				if($(label + ' .essential').length > 0) {
					$(label + ' +.formControl').attr('placeholder', "");
					$(label + ' .essential' ).remove();
					$(inputForm).parent().append('<span class="essenText" aria-hidden="true" role="presentation">' + $(label).text() + '<span class="essential"><span class="blind">'+jexComMl("ui.front_J0007" ,"필수입력")+'</span></span>' + '</span>');
				}
				$(label).append(icon);
				if( $(inputForm).data('placeholder') != null && $(inputForm).data('placeholder') != "" ){//placeholder 추가
					var placeholderTxt = $(inputForm).data('placeholder');
					$(label).append(' <span class="aid">('+placeholderTxt+')</span>');
					$(inputForm).parent().append('<span class="placeText" aria-hidden="true" role="presentation">' + placeholderTxt + '</span>');
				}
				// unit
				if( $('.formWrap:eq('+i+')').hasClass('unit') == true ){
					var	copyForm = $('.formWrap:eq('+i+')').clone();
					$('body').append(copyForm);
					copyForm.addClass('fakeVisible');
					/* 1차오픈용 20161207-권-임시로 테스트*/
					var paddingRight = copyForm.find('.unit').outerWidth();
					$('.formWrap:eq('+i+') .formControl').css('padding-right', paddingRight );
					if( $('.formWrap:eq('+i+') .placeText').closest('.row').length == 0 ){
						$('.formWrap:eq('+i+') .placeText').css('right', paddingRight + 2);
					} else {
						$('.formWrap:eq('+i+') .placeText').css('right', paddingRight + 10 + 2);
					}
					
					$('body .fakeVisible').remove();
				}
				if( $('.formWrap:eq('+i+')').hasClass('unitFront') == true ){
					copyForm = $('.formWrap:eq('+i+')').clone();
					$('body').append(copyForm);
					copyForm.addClass('fakeVisible');
					var paddingLeft = copyForm.find('.unit').outerWidth();
					$('.formWrap:eq('+i+') .formControl').css('padding-left', paddingLeft );
					if( $('.formWrap:eq('+i+') .placeText').closest('.row').length == 0 ){
						$('.formWrap:eq('+i+') .placeText').css('right', paddingRight + 2);
					} else {
						$('.formWrap:eq('+i+') .placeText').css('right', paddingRight + 10 + 2);
					}
					$('body .fakeVisible').remove();
				}
				//테스트위한 추가 스크립트 처리 2017-01-03(s)
				//$(inputForm).parent().addClass('hasValue');
				/*//테스트위한 주석처리 2017-01-03(s)*/
				$(inputForm).bind({
					'focusin':function(){
						$(this).parent().addClass('isFocused');
						if( $(this).data('autoTip') == true ){
							$(this).parent().next().find('.help').trigger('mouseover');
							$(this).parent().next().find('.tipWrap').addClass('on');
							$(this).parent().next().find('.tooltip').addClass('in');
							if( $(this).parent().next().find('.help').length == 0 && $(this).parent().next().find('.tipWrap').length == 0 && $(this).parent().next().find('.tooltip').length == 0 ){
								$(this).parent().next().next().find('.help').trigger('mouseover');
								$(this).parent().next().next().find('.tipWrap').addClass('on');
								$(this).parent().next().next().find('.tooltip').addClass('in');
							}
						}
					},
					'focusout change':function(){
						//selectbox
						if( $(this).is('select') ){
							if( $(this).prop('selectedIndex') == 0 && $(this).find("option:eq(0)").attr('disabled') == undefined ){ 
								$(this).parent().addClass('hasValue');
							} else if ($(this).prop('selectedIndex') != 0){
								$(this).parent().addClass('hasValue');
							} else {
								$(this).parent().removeClass('hasValue');
							}
						}
					},
					'focusout':function(){
						if( $(this).is('select') == false ){
							if($(this).val() != ""){//value select or value input
								$(this).parent().addClass('hasValue');
							} else {
								$(this).parent().removeClass('hasValue');
							}
						}
						$(this).parent().removeClass('isFocused');
						if( $(this).data('autoTip') == true ){
							$(this).parent().next().find('.tipWrap').removeClass('on');
							$(this).parent().next().find('.tooltip').removeClass('in');
							if( $(this).parent().next().find('.tipWrap').length == 0 && $(this).parent().next().find('.tooltip').length == 0 ){
								$(this).parent().next().next().find('.tipWrap').removeClass('on');
								$(this).parent().next().next().find('.tooltip').removeClass('in');
							}
						}
					},
					
					'change':function(){
						if( $(this).is('select') == false ){
							if($(this).val() != ""){//value select or value input
								$(this).parent().addClass('hasValue');
							} else {
								$(this).parent().removeClass('hasValue');
							}
						}
					}
					
				});
				$(inputForm).on('keyup', function () {
					if($(this).val() != ""){//value select or value input
						$(this).parent().addClass('hasValue');
					} else {
						$(this).parent().removeClass('hasValue');
					}
				});
				/*/ //테스트위한 주석처리 2017-01-03(e)
				/*
				$(inputForm).on('keyup', function () {
					if($(this).val() != ""){//value select or value input
						$(this).parent().addClass('hasValue');
					} else {
						$(this).parent().removeClass('hasValue');
					}
				})*/;
			} else {
				$(".formWrap:eq("+i+")").addClass('hasTextarea');
			}
		}
	}
	
	/*//테스트위한 주석처리 2017-01-03 (s)*/
	$('.ui-datepicker-trigger').prev().bind({
		'change':function(){
			if($(this).val() != ""){//value select or value input
				$(this).parent().addClass('hasValue');
			} else {
				$(this).parent().removeClass('hasValue');
			}
		}
	});
	//*///테스트위한 주석처리 2017-01-03(e)
	
	for(var i = 0; i < $('.formGroup').length ; ++i ){
		if($(".formGroup").eq(i).hasClass('uiAct') == false ){
			$(".formGroup").eq(i).addClass('uiAct');
			if( $(".formGroup:eq("+ i +") > .formWrap").length == 2 ){
				$(".formGroup").eq(i).addClass('two');
			}
		}
	}
}

//================================================================================ Secu KeyPad
function secKeyFocusIn(target){
	$('#'+target).parent().addClass('isFocused');
	$('.popWrap.nowOpen').addClass('keyPadInit');
}

function secKeyValueChk(target){
	if($('#'+target) != ""){//value select or value input
		$('#'+target).parent().addClass('hasValue');
	} else {
		$('#'+target).parent().removeClass('hasValue');
	}
	$('.popWrap.nowOpen').addClass('keyPadInit');
}

function secKeyFocusOut(target){
	$('#'+target).parent().removeClass('isFocused');
	if($('#'+target).val() != ""){//value select or value input
		$('#'+target).parent().addClass('hasValue');
	} else {
		$('#'+target).parent().removeClass('hasValue');
	}
	$('#'+target).parent().removeClass('isFocused');
	$('.popWrap.nowOpen').removeClass('keyPadInit');
}

//================================================================================ tooltip
function tipInit(){
	for(var  i = 0 ; i < $('.tipWrap').length ; ++i ){
		if( $('.tipWrap').eq(i).hasClass('uiAct') == false ){
			$('.tipWrap').eq(i).addClass('uiAct');
			$('.tipWrap:eq('+i+') > .help').bind({
				'click':function(e){
					e.preventDefault();
					if($(this).parent().hasClass('on') == false ){
						$(this).next().attr("tabindex", -1).focus();
						$(this).parent().addClass('on');
						$(this).next().addClass('in');
						if( isMobile == true ){
							if( $(window).width() >= 768 ){
								tipOpen( $(this) );
							} else {
								tipMobileOpen( $(this) );
							}
						}
					} else {
						//tipClose( $(this) ); // 테블릿 버그 위한 주석처리
					}
				},
				'mouseenter focusin':function(e){
					if( $(this).next().hasClass('in') == false ){
						if( $('.tipWrap.on').data('autoTip') != true ){
							$('.tipWrap').removeClass('on');
							$('.tipWrap .tooltip').removeClass('in');
						}
						if( $(window).width() >= 768 ){
							tipOpen( $(this) );
						} else {
							tipMobileOpen( $(this) );
						}
					}
				},
				'mouseleave focusout':function(e){
					if($(this).parent().hasClass('on') == false ){
						$(this).next().removeClass('in');
					}
				}
			});
			if(isMobile == true){
				$('.tipWrap:eq('+i+') > .help').unbind('mouseenter focusin');
			}
			$('.tipWrap:eq('+i+') .btnImgClose').bind({
				'click':function(e){
					e.preventDefault();
					tipClose( $(this) );
				}
			});
		}
	}
	
}

function NumInputTextToTel(target){ 
	//if(mobileOSCompatibilityCheck(4, 0, 99, 99)){ 
		//var numInputEl = $Element($$('.cs_exchangerate #num')[0]);
		var numInputEl = target;
		if(numInputEl.attr("type") == "text"){ 
			numInputEl.attr("type", "tel"); 
		}
		/*var num2InputEl = $Element($$('.cs_exchangerate #num2')[0]); 
		if(num2InputEl.attr("type") == "text"){ 
			num2InputEl.attr("type", "tel"); 
			} 
		//} */
	//}
}
function NumInputTelToText(target){ 
	//var numInputEl = $Element($$('.cs_exchangerate #num')[0]);
	var numInputEl = target;
	numInputEl.attr("type", "text"); 
}
function tipMobileOpen(target){
	target.next().addClass('in');
	target.parent().parent().addClass('bottom');
	var offset = target.offset();
	var posY = offset.top - $(window).scrollTop();
	var posX = offset.left - $(window).scrollLeft();
	target.next().css('left', -posX + 10);
	target.next().css('width', $(window).width()-20);
	if( target.parent().parent().prev().is('.formWrap')){
		target.next().css('margin-top', "5px");
		target.next().find('.arrow').css('left', posX - 13);
	} else {
		target.next().find('.arrow').css('left', posX - 10);
		target.next().css('margin-top', "-5px");
	}
	$('body').addClass('tipOpen');
}

function tipOpen(target){
	target.next().css('width', getWidth( target.next()) );
	var yPos = target.next().outerHeight();
	target.next().css('margin-top',-yPos*0.5);
	target.next().addClass('in');
	target.next().find('.arrow').removeAttr('style');
	var parent = target.closest( "table" );
	if($('body').hasClass('popOn') == true ){
		parent = target.closest( ".scroll" );
	}
	if(parent.length == 0){
		parent = target.closest( ".popCont" );
		if(parent.length == 0){
			getPosRect(target);
		} else {
			getPosRect(target, parent);
		}
	} else {
		getPosRect(target, parent);
	}
	$('body').addClass('tipOpen');
}

function tipClose(target){
	target.parent().parent().removeClass('on');
	target.parent().removeClass('in');
	$('body').removeClass('tipOpen');
}

function getWidth(target){
	var className = String( target.attr('class') );
	var num = className.indexOf("col_");
	if( $(window).width() >= 768 ){
		if( num > 0 ){
			var result = Number( className.substr(num + 4, 2) );
			var contWidth = $( "#content" ).outerWidth();
			if(contWidth > 988 ) contWidth = 988;
			var percent = 0.0833333 * result * contWidth;
			return percent;
		} else {
			//return 400; /*짤리는 문제 때문에 우선 주석처리하고 css로 해결해봄. 지켜봐야함*/
		}
	} else {
		return $(window).width();
	}
}

function getPosRect(target, $parent){
	var posArry = [];
	var parent = $('#content'); 
	var offset = target.offset();
	var posY = offset.top - $(window).scrollTop();
	var posX = offset.left - $(window).scrollLeft();
	if($parent != null) parent = $parent;
	var parentOffset = parent.offset();
	var parentPosY = parentOffset.top - $(window).scrollTop();
	var parentPosX = parentOffset.left - $(window).scrollLeft();
	var boxW = target.next().outerWidth();
	var boxH = target.next().outerHeight();
	
	function chkPos(){
		posArry = ['right','left','top','bottom'];
		var removeCode;
		// rightChk
		//console.log(posX + boxW) // 1차오픈용 20161208-박-console.log 막기
		//console.log(parent.outerWidth()) // 1차오픈용 20161208-박-console.log 막기
		if( posX + boxW > parentPosX + parent.outerWidth() ){
			//console.log("기본 체크 : 오른쪽에서 걸린다");
			removeCode = posArry.indexOf("right");
			if(removeCode > -1)posArry.splice(removeCode,1);
		} else {
			chkVPos("right");
		}
		//topChk
		if( $('.brandingArea').hasClass('fixed') == true  ){
			if( posY - boxH  < $('.navbarArea.sticky.fixed').height() ){
				//console.log("기본 체크 : 위쪽에서 걸린다");
				removeCode = posArry.indexOf("top");
				if(removeCode > -1)posArry.splice(removeCode,1);
			} else {
				chkHPos('top');
			}
		} else {
			if( posY - boxH - 30 < $('.header').height() ){
				//console.log("기본 체크 : 위쪽에서 걸린다");
				removeCode = posArry.indexOf("top");
				if(removeCode > -1)posArry.splice(removeCode,1);
				//console.log("탑지우는거냐?????");
				//console.log("?????????????????????" + posArry );
			} else {
				chkHPos('top');
			}
		}
		// leftChk
		if( posX - boxW -15 < parentPosX ){
			//console.log("기본 체크 : 왼쪽에서 걸린다");
			removeCode = posArry.indexOf("left");
			if(removeCode > -1)posArry.splice(removeCode,1);
		} else {
			chkVPos("left");
		}
		
		//bottomChk
		if( posY + boxH  > $(window).height() ){
			//console.log("기본 체크 : 아래쪽에서 걸린다");
			removeCode = posArry.indexOf("bottom");
			if(removeCode > -1)posArry.splice(removeCode,1);
			if(posArry.length == 0) posArry.push('right');
		} else {
			chkHPos("bottom");
		}
		
		/*
		if( posX - boxW*0.5  < parentPosX ){
			//console.log("아래쪽 왼쪽에서 걸린다");
			removeCode = posArry.indexOf("bottom");
			if(removeCode > -1)posArry.splice(removeCode,1);
			if(posArry.length == 0) posArry.push('right');
		}
		if( posX + boxW*0.5 > parentPosX + parent.outerWidth() ){
			removeCode = posArry.indexOf("bottom");
			if(removeCode > -1)posArry.splice(removeCode,1);
			if(posArry.length == 0) posArry.push('left');
		}*/
		return posArry[0];
	}
	
	function chkVPos(removeDirection){
		//console.log("chkVPos : " + removeDirection );
		if(parent.attr('id') == 'content'){
			var targetPos = $('.navbarArea.sticky.fixed').height();
		} else {
			targetPos = parentPosY;
		}
		if( $('.brandingArea').hasClass('fixed') == true  ){
			if( posY - boxH*0.5  < targetPos ){
				//console.log("vCheck : 위쪽에서 걸린다");
				removeCode = posArry.indexOf(removeDirection);
				if(removeCode > -1)posArry.splice(removeCode,1);
				var removeCode2 = posArry.indexOf("top");
				if(removeCode2 > -1)posArry.splice(removeCode2,1);
				if(posArry.length == 0) posArry.push(removeDirection);
			}
		} else {
			if( posY - boxH*0.5 < targetPos){
				//console.log("vCheck : 위쪽에서 걸린다");
				removeCode = posArry.indexOf(removeDirection);
				if(removeCode > -1)posArry.splice(removeCode,1);
				var removeCode2 = posArry.indexOf("top");
				if(removeCode2 > -1)posArry.splice(removeCode2,1);
				if(posArry.length == 0) posArry.push(removeDirection);
			}
		}
		if( posY + boxH*0.5  > $(window).height()){
			//console.log("vCheck : 아래에서 걸린다" + removeDirection );
			removeCode = posArry.indexOf(removeDirection);
			if(removeCode > -1)posArry.splice(removeCode,1);
			var removeCode2 = posArry.indexOf("bottom");
			if(removeCode2 > -1)posArry.splice(removeCode2,1);
			if(posArry.length == 0) posArry.push(removeDirection);
		}
		
	}
	function chkHPos(removeDirection){
		//console.log("chkHPos : " + removeDirection );
		if( posX + boxW*0.5 > parentPosX + parent.outerWidth() ){
			//console.log("chkHPos : 오른쪽에서 걸린다");
			removeCode = posArry.indexOf(removeDirection);
			if(removeCode > -1)posArry.splice(removeCode,1);
		} else {
			chkVPos("right");
		}
		if( posX - boxW*0.5 -15 < parentPosX ){
			//console.log("chkHPos : 왼쪽에서 걸린다");
			removeCode = posArry.indexOf(removeDirection);
			if(removeCode > -1)posArry.splice(removeCode,1);
		} else {
			chkVPos("left");
		}
	}
	
	function setTipLayout(type){
		if( type == "left" ){
			target.parent().parent().attr('class', 'tip');
			target.parent().parent().addClass('left');
			target.next().css('left', -boxW);
		} else if( type == "bottom" ){
			target.parent().parent().attr('class', 'tip');
			target.parent().parent().addClass('bottom');
			target.next().css('margin-top', 'auto');
			target.next().css('left', -boxW*0.5);
		} else if( type == "top" ){
			target.parent().parent().attr('class', 'tip');
			target.parent().parent().addClass('top');
			target.next().css('margin-top', 'auto');
			target.next().css('left', -boxW*0.5);
		} else if( type == "right" ){
			target.parent().parent().attr('class', 'tip');
			target.next().css('margin-top', -target.next().outerHeight()*0.5);
			target.next().css('left', 0);
		}
	}
	var code = chkPos();
	//console.log(posArry);
	setTipLayout(code);
}

if(!Array.indexOf){
	Array.prototype.indexOf = function(obj){
		for(var i=0; i<this.length; i++){
			if(this[i]==obj){
				return i;
			}
		}
		return -1;
	};
}

//================================================================================ tabMenu
var tabWArry = ["100%","50%","33.3%","25%","20%","16.6%","14.2%","12.5%","11.1%","10%"];
function tabMake(){
	$('.innerTab').addClass('tab');
	for(var i = 0; i < $('.tab').length ; ++i ){
		if($('.tab').eq(i).hasClass('uiAct') == false ){
			$('.tab').eq(i).addClass('uiAct');
			if($('.tab').eq(i).find('> ul > li').length > 2){
				$('.tab').eq(i).addClass('selectUI');
				$('.tab').eq(i).find('> ul').addClass('hiddenMb');
				if($('.tab').eq(i).hasClass("innerTab") == false){
					$('.tab').eq(i).find('> ul > li').css('width',tabWArry[ $('.tab').eq(i).find('> ul > li').length - 1 ] );
					if( isMobile == true && $('.tab').eq(i).find('> ul > li.remove').length > 0 ){
						$('.tab').eq(i).find('> ul > li').css('width',tabWArry[ $('.tab').eq(i).find('> ul > li').length - $('.tab').eq(i).find('> ul > li.remove').length - 1 ] );
						$('.tab').eq(i).find('> ul > li.remove').hide();
						$('.tab').eq(i).find('> ul > li:not(.remove)').first().addClass("first");
					}
				}
				var tabSelect = '<div class="formWrap nonLabel visibleMb">'+
				'					<label for="tabmenu'+ i +'" class="txtIptLabel">'+jexComMl("ui.front_J0008" ,"탭메뉴 타이틀")+'</label>'+
				'					<select id="tabmenu'+ i +'" class="formControl">';
				for( var j = 0 ; j < $('.tab').eq(i).find('> ul > li').length ; ++j ){
					var itemEl = $('.tab:eq('+ i +') > ul > li:eq('+ j +')');
					if(itemEl.hasClass('on') == false ){
						var opt = '<option value="">'+ itemEl.find('> *').text() +'</option>';
						if( isMobile == true && itemEl.hasClass('remove') ) opt = '<option value="" class="hiddenTM">'+ itemEl.find('> *').text() +'</option>';
					} else {
						opt = '<option value="" selected="selected" >'+ itemEl.find('> *').text() +'</option>';
						if( isMobile == true && itemEl.hasClass('remove') ) opt = '<option value="" selected="selected" class="hiddenTM">'+ itemEl.find('> *').text() +'</option>';
					}
					
					tabSelect += opt;
				}
				if( $('.tab').eq(i).find('> ul > li > a').length > 0 ){
					tabSelect += '</select><a href="#" class="btnType1 tabLink">'+jexComMl("ui.front_J0009" ,"선택")+'</a></div>';
				} else {
					tabSelect += '</select><button type="button" class="btnType1 tabSelect">'+jexComMl("ui.front_J0009" ,"선택")+'</button></div>';
				}
				$('.tab').eq(i).append(tabSelect);
			} else {
				$('.tab').eq(i).find('>ul').show();
			}
			// 2중탭 구조 잡기
			if( $('.tab').eq(i).hasClass('selectUI') ){
				if( $('.tab').eq(i).prev().is('.tab') || $('.tab').eq(i).parent().closest('.tab').length > 0 || $('.tab').eq(i).closest('.tabContain').find('> .innerTab').length > 0 ){
					$('.tab').eq(i).addClass('grayBg');
				}
			}
			
			// 2중탭일 경우 다이렉트 이벤트로 수정
			if( $('.tab').eq(i).hasClass('grayBg') == true ){
				$('#tabmenu'+ i).bind({
					'change':function(){
						var code = $(this).prop('selectedIndex');
						$(this).next().trigger('click');
					}
				})	;
			}
			
		}
	}
	
	$('.tabSelect').bind({
		'click':function(e){
			e.preventDefault();
			$(this).parent().prev().find('li').removeClass('on');
			var code = $(this).parent().find('select').prop('selectedIndex');
			$(this).parent().prev().find('li:eq('+ code +')').trigger('click');
		}
	});
	$('.tabLink').bind({
		'click':function(e){
			var code = $(this).prev().prop('selectedIndex');
			var href = $(this).parent().prev().find('li:eq('+ code +') > a').attr('href');
			$(this).attr('href',href);
			$(this).parent().prev().find('li:eq('+ code +') > a').trigger('click');
			window.location.href = href;
		}
	});
	tabInit();
}
function tabInit(){
	for(var i = 0; i < $('.tabContain').length ; ++i ){
		var target = $('.tabContain').eq(i);
		if(target.hasClass('uiAct') == false ){
			target.addClass('uiAct');
			var tab = target.find('.tab > ul');
			if(tab.find('a').length == 0 ){ // 정상적인 탭기능
				if( tab.find("> li > *").is('span') ){
					for(var j = 0 ; j < tab.find("> li").length ; ++j ){
						var target = tab.find("> li:eq("+j+") > span");
						var attributes = target.prop('attributes');
						target.replaceWith("<button>"+ target.html() +"</button>");
						$.each(attributes, function(){
							tab.find("> li:eq("+j+") > button").attr(this.name, this.value);
						});
					}
					if(tab.find('> *.on').length == 0 ){
						var idx =  tab.find('> *.on').index();
						$(target).find('> .tabContents').hide();
						$(target).find('> .tabContents').eq(idx).show();
						if( $(target).find('> .tabContents').length == 1 ){
							$(target).find('> .tabContents').eq(0).show();
						}
					}
				}
				$(".tabContain").eq(i).find("> .tab > ul > *").bind({
					'click':function(e){
						e.preventDefault();
						tabClickEvt($(this));
					},
					/* 2017-01-03 테스트를 위한 주석처리 (s)*/
					'keypress':function(e){
						if(e.keyCode == 13){
							$(this).trigger('click');
						}
					}//*/ //* 2017-01-03 테스트를 위한 주석처리 (e)
				});
				if(tab.find('> *.on').length == 0 ){
					for( j = 0 ; j < tab.find('> *').length ; ++j ){
						tabMultilineSet(tab.find('> *').eq(j));
					}
					tab.find('> *').eq(0).addClass('on');
					$(target).find('> .tabContents').hide();
					$(target).find('> .tabContents').eq(0).show();
				} else {
					var idx =  tab.find('> *.on').index();
					tabClickEvt( $(".tabContain").eq(i).find("> .tab > ul > *:eq("+idx+")") );
				}
			} else { // 디자인만 탭기능 - 링크
				$(target).find('> .tabContents').show();
				if(tab.find('> *.on').length == 0 ){
					$(target).find('> .tabContents').hide();
					$(target).find('> .tabContents').eq(0).show();
				} else {
					var idx =  tab.find('> *.on').index();
					$(target).find('> .tabContents').hide();
					$(target).find('> .tabContents').eq(idx).show();
					if( $(target).find('> .tabContents').length == 1 ){
						$(target).find('> .tabContents').eq(0).show();
					}
				}
			}
		} 
	}
}

function tabClickEvt(target){
	var $contain = $(target).parent().parent().parent();
	$contain.find('> .tab > ul > *').removeClass('on');
	$(target).addClass('on');
	var idx = $contain.find('> .tab > *').children().index(target);
	$(target).parent().next().find('option').prop("selected", false);
	$(target).parent().next().find('option').attr("selected", false);
	$(target).parent().next().find('option').eq(idx).prop("selected", true);
	$(target).parent().next().find('option').eq(idx).attr("selected", true);
	$contain.find('> .tabContents').hide();
	$contain.find('> .tabContents').eq(idx).show();
	setBoxMinH();
}

function tabMultilineSet(target){
	var hasBr = target.find('br');
	if(hasBr != null || hasBr != undefined){
		hasBr.parent().parent().addClass('multi');
	}
}

//================================================================================ quickGroup
function quickGroupMake(){
	for( var i = 0 ; i < $('.quickGroup').length ; ++i ){
		var quickTarget = $('.quickGroup').eq(i); 
		if($('.quickGroup').eq(i).hasClass('uiAct') == false ){
			quickTarget.addClass('uiAct');
			if( quickTarget.closest('.popWrap').length == 0 && quickTarget.closest('.goodsArea').length == 0 && quickTarget.closest('.noticeWrap').length == 0 && quickTarget.closest('.loginBox').length == 0 && quickTarget.closest('.nonDirect').length == 0  ){
				quickTarget.wrap('<div class="quickConArea"></div>');
				quickTarget.parent().prepend('<strong class="titH2" data-jex-ml="">'+jexComMl("ui.front_J0010" ,"관련 서비스 가기")+'</strong>');
			}
			quickSelectMake( quickTarget, i );
		} else {
			if( $('.quickGroup').eq(i).find('li').length + 1 != $('.quickGroup').eq(i).next().find('option').length ){
				 if( $('.quickGroup').eq(i).next().is('.formWrap , .visibleMb') == true ){
					 $('.quickGroup').eq(i).next().remove();
				 }
				 if( quickTarget.closest('.popWrap').length == 0 && quickTarget.closest('.goodsArea').length == 0 && quickTarget.closest('.noticeWrap').length == 0 && quickTarget.closest('.loginBox').length == 0 && quickTarget.closest('.nonDirect').length == 0  ){
					 quickSelectMake($('.quickGroup').eq(i), i);
				 }
			}
		}
	}
}
function quickSelectMake( _quickTarget, num ){
	var quickTarget = _quickTarget;
	if( quickTarget.find('li').length > 2 ){
		quickTarget.addClass('hiddenMb');				
		if($('.quickGroup').parent().hasClass('buttonGroup') == true){
			var groupTit = $('.quickGroup').parent().find('.tit').text();
			var quickSelect =   '<div class="formWrap visibleMb hasValue">'+
			'	<label for="quickSlt'+num+'" class="txtIptLabel" data-jex-ml="">'+groupTit+'</label>'+
			'	<select id="quickSlt'+num+'" class="formControl">'+
			'	</select>'+
			'</div>'; 
		}else{
			var quickSelect =   '<div class="formWrap visibleMb nonLabel">'+
			'	<label for="quickSlt'+num+'" class="txtIptLabel" data-jex-ml="">'+jexComMl("ui.front_J0011" ,"빠른메뉴")+'</label>'+
			'	<select id="quickSlt'+num+'" class="formControl">'+
			'		<option value="" disabled="" selected="" data-jex-ml="">'+jexComMl("ui.front_J0011" ,"빠른메뉴")+'</option>'+
			'	</select>'+
			'</div>';
		}
		
		$(quickSelect).insertAfter( quickTarget );
		for( var j = 0 ; j < quickTarget.children('li').length ; ++j ){
			var txt = quickTarget.children('li').eq(j).children('a').text();
			var url = quickTarget.children('li').eq(j).children('a').attr('href');
			quickTarget.next().find('select#quickSlt'+ num ).append('<option value="'+url+'" data-jex-ml="">'+txt+'</option>');
		}
		$('#quickSlt'+num).bind({
			'change':function(){
				var code = $(this).prop('selectedIndex') - 1;
				var tabEl = $(this).closest('.formWrap').prev(); 
				tabEl.find('li:eq('+code+') a').trigger('click');
				console.log("tabEl.find('li:eq('+code+') a') : " + tabEl.find('li:eq('+code+') a').text() );
				var href = tabEl.find('li:eq('+code+') a').attr('href');
				window.location.href = href;
			}
		});
	} else if( quickTarget.children('li').length == 1 ){
		quickTarget.children('li').addClass('single');
	}
}

//================================================================================ 진행단계
function progSet(){
	$('.progIndicator').show(); 
	$('.progIndicator > ol > li:last-child').addClass('last');
	for( var i = 0 ; i < $('.progIndicator').length ; ++i ){
		if( $('.progIndicator:eq('+i+') > ol > li').length == 3 ){
			$('.progIndicator:eq('+i+') > ol').addClass('total3');
		} else if( $('.progIndicator:eq('+i+') > ol > li').length == 4 ){
			$('.progIndicator:eq('+i+') > ol').addClass('total4');
		} else if( $('.progIndicator:eq('+i+') > ol > li').length == 5 ){
			$('.progIndicator:eq('+i+') > ol').addClass('total5');
		}
		var targetStep = '.progIndicator:eq('+i+') > ol';
		for( var j = 0 ; j < $(targetStep + ' > li').length ; ++j ){
			$(targetStep + '> li:eq('+j+') .blind').remove();
			if($(targetStep + '> li:eq('+j+')').hasClass('active') ){
				$(targetStep + '> li:eq('+j+')').append('<em class="blind" data-jex-ml="">'+jexComMl("ui.front_J0012" ,"진행중")+'</em>');
				$(targetStep + '> li:eq('+j+')').attr('role','text');
			}
			if($(targetStep + '> li:eq('+j+')').hasClass('finished') ){
				$(targetStep + '> li:eq('+j+')').append('<em class="blind" data-jex-ml="">'+jexComMl("ui.front_J0013" ,"완료")+'</em>');
				$(targetStep + '> li:eq('+j+')').attr('role','text');
			}
		}
	}
	
}

//================================================================================ progress bar
function progressBarMove(){
	var wid = 0;
	var act = setInterval(function(){frame();},1000);

	function frame(){
		if (wid >= 100) {
			clearInterval(act);
		}else{
			wid++; 
			$('.progressBarTime').html(parseInt(60 - wid));
			if($('.progressBarTime').text() == 0){
				clearInterval(act);
			}
		}	
	}
	var progVal = $('.progressBarPercent').text();
	$('.progressBar.percent').css('width',progVal + '%');
}

//================================================================================ accordion
//아코디언 메뉴
function accordionAdd(){
	for(var i = 0; i < $('.accordion').length ; ++i ){
		if($(".accordion").eq(i).parent().parent().hasClass('uiAct') == false ){
			$('.accordion').eq(i).parent().parent().addClass('uiAct');
			if($(".accordion").eq(i).parent().parent().parent().hasClass('qnaList') == true){
				var accoTit = $('.accordion').eq(i).parent().parent();
				if( accoTit.length > 0 ){
					accoTit.find('.wrap').css('cursor','pointer');
				}
			}else{
				var accoTit = $('.accordion').eq(i).parent().find('.tit'); 
				if( accoTit.length > 0 ){
					accoTit.css('cursor','pointer');
				}
			}
			if( accoTit.length > 0 ){
				if( accoTit.find('> a').length == 0 && $('.overviewBank').length == 0 ){
					accoTit.bind({
						'click':function(e){
							e.preventDefault();
							$(this).closest('.wrap').find(' > .accordion').trigger('click');
						}
					});
				} 
			}
			$('.accordion').eq(i).bind({
				'click':function(e){
					e.preventDefault();
					if($(this).parent().parent().hasClass('on')){
						$(this).parent().parent().removeClass('on');
						if( $(this).parent().next().is('.accoContents') ){
							$(this).parent().next().slideUp();
							$(this).parent().next().attr('aria-hidden', true);
						} else {
							$(this).parent().parent().find('.accoContents').slideUp();
							$(this).parent().parent().find('.accoContents').attr('aria-hidden', true);
						}
						var spanTxt = jexComMl("ui.front_J0014" ,"펼치기");
						$(this).find('span').text(spanTxt);
					} else {
						$(this).parent().parent().addClass('on');
						if( $(this).parent().next().is('.accoContents') ){
							$(this).parent().next().slideDown();
							$(this).parent().next().attr('aria-hidden', false);
						} else {
							$(this).parent().parent().find('.accoContents').slideDown();
							$(this).parent().parent().find('.accoContents').attr('aria-hidden', false);
						}
						spanTxt = jexComMl("ui.front_J0015" ,"접기");
						$(this).find('span').text(spanTxt);
					}
				}
			});
		}
	}
	
	for(i = 0; i < $('.detailAccordion').length ; ++i ){
		if($(".detailAccordion").eq(i).parent().hasClass('uiAct') == false ){
			$(".detailAccordion").eq(i).parent().addClass('uiAct');
			var winW = $(window).width();
			if(winW <= 988){
				if($(".detailAccordion").eq(i).parent().hasClass('searchWrap') == true){
					$(".detailAccordion").eq(i).parent().removeClass('on');
					$(".detailAccordion").eq(i).parent().find('.accoContents').hide();
				}
			}else{
				if($(".detailAccordion").eq(i).parent().hasClass('searchWrap') == true){
					$(".detailAccordion").eq(i).parent().addClass('on');
					$(".detailAccordion").eq(i).parent().find('.accoContents').show();
				}
			}
			$(".detailAccordion").eq(i).bind({
				'click':function(e){
					e.preventDefault();
					var txt = $(this).text();
					if($(".detailAccordion").eq(i).parent().hasClass('searchWrap') == true){ //이벤트페이지 일경우
						if($(this).parent().hasClass('on')){
							var spanTxt = jexComMl("ui.front_J0016" ,"검색 열기");
							$(this).text(spanTxt);
						} else{
							spanTxt = jexComMl("ui.front_J0017" ,"검색 닫기");
							$(this).text(spanTxt);
						}
					}else{
						var closeTxt = " " + jexComMl("ui.front_J0018" ,"닫기");
						if($(this).parent().hasClass('on')){
							var filterTxt = txt.replace(" 닫기", "");
							filterTxt = txt.replace(closeTxt, "");
							$(this).text(filterTxt);
						} else{
							$(this).text(txt+closeTxt);
						}
					}
					
					if($(this).parent().hasClass('on')){
						$(this).parent().removeClass('on');
						$(this).parent().find('.accoContents').slideUp();
						
					} else {
						$(this).parent().addClass('on');
						
						$(this).parent().find('.accoContents').slideDown(function(){
							// unit
							if( $('.formWrap').hasClass('unit') == true && $('.formWrap').hasClass('uiAct') == false ){
								$('.formWrap .formControl').css('padding-right', $('.formWrap .unit').outerWidth());	
							}
							if( $('.formWrap').hasClass('unitFront') == true && $('.formWrap').hasClass('uiAct') == false ){
								$('.formWrap .formControl').css('padding-left', $('.formWrap .unit').outerWidth());							
							}
							
						});
						
						//inputSlider
						for(var k = 0; k < $('.accoContents > .inputSlider').length ; ++k ){
							var unitW = $('.accoContents > .inputSlider').eq(k).find('span.unit').outerWidth();
							$('.accoContents > .inputSlider').eq(k).find('input').css('paddingRight',unitW + 'px');
						}
					}
					
				}
			});
		}
	}
	
	for(var i = 0; i < $('.comboWrap').length ; ++i ){
		if( $('.comboWrap:eq('+i+')').hasClass('uiAct') == false ){
			$('.comboWrap:eq('+i+')').addClass('uiAct');
			$('.comboWrap:eq('+i+') .comboContents').attr('aria-hidden', true);
			$('.comboWrap:eq('+i+') .combo').bind({
				'click':function(e){
					e.preventDefault();
					if($(this).parent().parent().hasClass('on')){
						$(this).parent().parent().removeClass('on');
						$(this).parent().parent().parent().find('.comboContents').slideUp();
						$(this).parent().parent().parent().find('.comboContents').attr('aria-hidden', true);
					} else {
						$(this).parent().parent().addClass('on');
						$(this).parent().parent().parent().find('.comboContents').slideDown();
						$(this).parent().parent().parent().find('.comboContents').attr('aria-hidden', false);
					}
				}
			});
		}
	}
	
	//.terms.acco (약관동의)일 경우 이벤트 빼기	
	//for( i = 0 ; i < $('.terms.acco').length ; ++i ){
	//	$('.terms.acco').find('> li .accordion').unbind();
	//}
}

function tableDetail(){
	for(var i = 0; i < $('tr td .btnDetail').length ; ++i ){
		if($("td .btnDetail").eq(i).hasClass('uiAct') == false ){
			$("td .btnDetail").eq(i).addClass('uiAct');
			
			$("td .btnDetail").eq(i).bind({
				'click':function(e){
					e.preventDefault();
					var target = $(this).closest('tr');
					target.siblings().find('.detailCon').slideUp(0);
					var spanTxt = jexComMl("ui.front_J0019" ,"접힘");
					target.siblings().find('.on .btnDetail .blind').text(spanTxt);
					target.siblings().removeClass('on');
					if( target.hasClass('on') ){
						target.removeClass('on');
						$(this).next().slideUp(0);
						spanTxt = jexComMl("ui.front_J0020" ,"펼침");
						$(this).find('.blind').text(spanTxt);
					} else {
						target.addClass('on');
						$(this).next().slideDown(0);
						spanTxt = jexComMl("ui.front_J0019" ,"접힘");
						$(this).find('.blind').text(spanTxt);
					}
				}
			});
			
		}
	}
}
//자세히보기 아코디언
function detailAuto(){
	$('.btnDetail.auto').next('.detailCon').hide();
	$('.btnDetail.auto').bind({
		'click':function(){
			if($(this).hasClass('on') == false){
				$(this).next().slideDown();
				$(this).addClass('on');
				$(this).find('.arrowDown').removeClass('arrowDown').addClass('arrowUp');
				var spanTxt = jexComMl("ui.front_J0019" ,"접힘");
				$(this).find('.blind').text(spanTxt);
			}else{
				$(this).next().slideUp();
				$(this).removeClass('on');
				$(this).find('.arrowUp').removeClass('arrowUp').addClass('arrowDown');
				spanTxt = jexComMl("ui.front_J0020" ,"펼침");
				$(this).find('.blind').text(spanTxt);
			}
		}
	});
}
//권 추가 카드>카드신청>신용카드>카드한눈에보기
function crdCompare(){
	$('.crdCompare .search').click(function(){
		if($(this).parent().hasClass('on')){
			$(this).next('div').slideUp('300',function(){
				$(this).parent().removeClass('on');
			});
		}else{
			$(this).next('div').slideDown('300',function(){
				$(this).parent().addClass('on');
			});
		}
	});
}

//================================================================================ stepArea
var resizeTimeout;
function stepAreaInit(){
	for(var i = 0; i < $('.conDivArea').length ; ++i ){
		if( $('.conDivArea').eq(i).hasClass('uiAct') == false ){
			$('.conDivArea').eq(i).addClass('uiAct');
			var targetEl = $('.conDivArea').eq(i);
			if( targetEl.find('.heiValue').length > 0 ){
				$('.conDivArea').eq(i).addClass('resizeEnabled');
			}
		}
	}
	if( $('.conDivArea.resizeEnabled .heiValue').length > 0 ){
		$(window).resize(function(){
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout( function(){setBoxMinH();},500);
		});
		setBoxMinH();
	}
}
function setBoxMinH(){
	for( var i = 0 ; i < $('.conDivArea.resizeEnabled .heiValue').length ; ++i ){
		var colNum = 0;
		var liArry = [];
		var liArryH = [];
		var defCnt = 1;
		var maxH = 0;
		var targetEl =$('.conDivArea.resizeEnabled:eq('+i+') .heiValue');
		
		if( targetEl.hasClass('div2') ){
			colNum = 2;
		} else if( targetEl.hasClass('div3') ){
			colNum = 3;
		} else if( targetEl.hasClass('div4') ){
			colNum = 4;
			if($('.wrapper').width() <= 1024 ){
				colNum = 2;
			}
		}
		
		if( targetEl.hasClass('landList') ){
			if($('.wrapper').width() < 988 ){
				colNum = 2;
			}
		}
		
		$('.conDivArea.resizeEnabled:eq('+i+') .heiValue > * > .block').css('min-height',0);
		for( var j = 0 ; j < $('.conDivArea.resizeEnabled:eq('+i+') .heiValue > *').length ; ++j ){
			liArry.push( $('.conDivArea.resizeEnabled:eq('+i+') .heiValue > *:eq('+j+') > .block') );
			liArryH.push( $('.conDivArea.resizeEnabled:eq('+i+') .heiValue > *:eq('+j+') > .block').outerHeight() );
			if( $('.conDivArea.resizeEnabled:eq('+i+') .heiValue > *:eq('+j+')').hasClass('full') == false ){
				if( (j+defCnt)%colNum == 0 || j == $('.conDivArea.resizeEnabled:eq('+i+') .heiValue > *').length - 1 ){
					maxH = Math.max.apply(null, liArryH ) + 3;
					for( var k = 0 ; k < liArry.length ; ++k ){ 
						$(liArry[k]).css( 'min-height', Math.ceil( maxH ) );
					}
					liArry = [];
					liArryH = [];
				}
			} else {
				defCnt++;
				liArry = [];
				liArryH = [];
			}
		}
		
		if( $('.lnbWrap').length > 0 ){
			if(colNum == 2){
				var oddType = targetEl.find(' > *').length%2;
				if(oddType != 0 ){
					targetEl.find(' > *:last-child').addClass('full');
				} else {
					targetEl.find(' > *:last-child').removeClass('full');
				}
			}
		}
	}
}

//================================================================================ Terms
function termsAdd(){
	/*for( i = 0 ; i < $('.terms.acco').length ; ++i ){
		if( $('.terms.acco').eq(i).hasClass('uiAct') == false ){
			$('.terms.acco').eq(i).addClass('uiAct');
			$('.terms.acco > li').addClass('on');
			$('.terms.acco > li > .accoContents').slideDown(0);
			$('.terms.acco').eq(i).find('li .termsAgree input').bind({
				'change':function(e){
					if($(this).prop('checked') == true ){
						var target = $(this).closest('li.on');
						target.find('button.accordion').trigger('click');
					}
				}
			})
		}
	}*/
}


//================================================================================ btnSwap
function btnSwap(){
	for( i = 0 ; i < $('.btnArea').length ; ++i ){
		if( $('.btnArea').eq(i).hasClass('uiAct') == false ){
			$('.btnArea').eq(i).addClass('uiAct');
			var num = $('.btnArea:eq('+ i +') > .btnType2').length;
			for( j = 0 ; j < num ; ++j ){
				var btn = $('.btnArea:eq('+ i +') > .btnType2:eq('+j+')').clone(true).addClass("visibleMb");
				$('.btnArea:eq('+ i +') > .btnType2:eq('+j+')').addClass('hiddenMb');
				$('.btnArea:eq('+ i +')').append(btn);
			}
		}
	}
	
}

//================================================================================ Dropdown
var setTimeDrop;
var dropDownDelay = 500;
//dropDown 컨트롤
function dropDownCtrl(){
	if( isMobile == true ){
		dropDownDelay = 0;
	} 
	for(var i = 0; i < $('.dropDownWrap').length ; ++i ){
		if($('.dropDownWrap').eq(i).hasClass('uiAct') == false ){
			$('.dropDownWrap').eq(i).addClass('uiAct');
			$('.dropDownWrap:eq('+i+') .dropDownCtrl').bind({
				'mouseenter focus click': function(e) {
					e.preventDefault();
					var offset = $(this).offset();
					var posX = offset.left - $(window).scrollLeft();
					
					if( posX + $(this).width() + 30 < 220){
						$(this).addClass('leftAlign');
					}
					
					if( $(this).parent().hasClass('on') == false ){
						clearTimeout(setTimeDrop);
						$('.dropDownWrap').removeClass('on');
						$(this).parent().addClass('on');
						$(this).closest( ".accoContents" ).addClass('overV');
						$(this).closest( ".conDivBox" ).addClass('overV');
						$(this).closest( ".conDivArea" ).addClass('overV');
					} else {
						clearTimeout(setTimeDrop);
						$('.dropDownWrap').removeClass('on');
						dropDownRemove( $(this) );
					}
				}
			});
			$('.dropDownWrap:eq('+i+')').bind('mouseleave', function() {
				var target = $(this);
				setTimeDrop = setTimeout( function(){dropDownRemove( target );}, dropDownDelay);
			});
			$('.dropDown').bind('mouseover', function() {
				clearTimeout(setTimeDrop);
			});
			if($('.dropDownWrap:eq('+i+') .dropDown li:last-child').children('ul') == null){
				$('.dropDownWrap:eq('+i+') .dropDown li:last-child a').on('focusout', function() {
					$(this).parents('.dropDownWrap').removeClass('on');
				});
			}else{
				$('.dropDownWrap:eq('+i+') .dropDown li:last-child ul li:last-child a').on('focusout', function() {
					$(this).parents('.dropDownWrap').removeClass('on');
				});
			}
			$('.dropDown ul li').find('button.tit').bind({
				'click':function(){
					if($(this).parent().hasClass('on')){
						$(this).parent().removeClass('on');
					}else{
						$(this).parent().addClass('on').siblings().removeClass('on');
					}	
				}
			});
		}
	}
}

function dropDownRemove(target){
	target.removeClass('on');
	$('.dropDownCtrl').removeClass('leftAlign');
	$( ".accoContents" ).removeClass('overV');
	$( ".conDivBox" ).removeClass('overV');
	$( ".conDivArea" ).removeClass('overV');
}

function navEtcDropDownCtrl(){
	$('.navEtc .dropDownWrap .dropDownCtrl').bind({
		'mouseover click':function(e){
			navEtcHeightSet();
		}
	});
}

function navEtcHeightSet(){
	var minH = $(window).height() - 200;
	if( $(window).width() <= 768 ){
		minH = $(window).height() - 150;
	}
	if( $('.header .navbarArea').hasClass('fixed') == true ){
		minH = $(window).height() - 100;
	}
	$('.navEtc .dropDownWrap .dropDown').css('max-height', minH );
}

//================================================================================ Date Picker
//datepicker
function datepicker(){
	var month1 = jexComMl("ui.front_J0021" ,'1월');
	var month2 = jexComMl("ui.front_J0022" ,'2월');
	var month3 = jexComMl("ui.front_J0023" ,'3월');
	var month4 = jexComMl("ui.front_J0024" ,'4월');
	var month5 = jexComMl("ui.front_J0025" ,'5월');
	var month6 = jexComMl("ui.front_J0026" ,'6월');
	var month7 = jexComMl("ui.front_J0027" ,'7월');
	var month8 = jexComMl("ui.front_J0028" ,'8월');
	var month9 = jexComMl("ui.front_J0029" ,'9월');
	var month10 = jexComMl("ui.front_J0030" ,'10월');
	var month11 = jexComMl("ui.front_J0031" ,'11월');
	var month12 = jexComMl("ui.front_J0032" ,'12월');
	
	var week1 = jexComMl("ui.front_J0033" ,'일');
	var week2 = jexComMl("ui.front_J0034" ,'월');
	var week3 = jexComMl("ui.front_J0035" ,'화');
	var week4 = jexComMl("ui.front_J0036" ,'수');
	var week5 = jexComMl("ui.front_J0037" ,'목');
	var week6 = jexComMl("ui.front_J0038" ,'금');
	var week7 = jexComMl("ui.front_J0039" ,'토');
	
	var year = jexComMl("ui.front_J0040" ,'년');
	var prevMonth = jexComMl("ui.front_J0041" ,'이전 달');
	var nextMonth = jexComMl("ui.front_J0042" ,'다음 달');
	
	for(var i = 0; i < $('.datepicker').length ; ++i ){
		if( $('.datepicker').eq(i).hasClass('uiAct') == false ){
			$('.datepicker').eq(i).addClass('uiAct');
			$('.datepicker').eq(i).datepicker({
				showOn: "button",
				buttonImage: "../../img/common/btnImg_calendar.png",
				buttonImageOnly: true,
				buttonText: "Select date",
				 
				dateFormat : 'yy-mm-dd',
				prevText : prevMonth,
				nextText : nextMonth,
				monthNames : [ month1, month2, month3, month4, month5, month6, month7, month8, month9, month10, month11, month12 ],
				monthNamesShort : [ month1, month2, month3, month4, month5, month6, month7, month8, month9, month10, month11, month12 ],
				dayNames : [ week1, week2, week3, week4, week5, week6, week7 ],
				dayNamesShort : [ week1, week2, week3, week4, week5, week6, week7 ],
				dayNamesMin : [ week1, week2, week3, week4, week5, week6, week7 ],
				showMonthAfterYear : true,
				changeMonth : false,
				changeYear : false,
				yearSuffix : year
			});
		}
		if( isMobile == true ){
			$('.datepicker').eq(i).attr('type', 'date');
			$('.datepicker').eq(i).next().css('pointer-events','none');
		} 
	}
}

//================================================================================ 폰트 사이즈 조절
var nowFontSize = 4;
var fontSizeArry = [0.8, 0.85, 0.9, 0.95, 1, 1.05, 1.10, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4, 1.45];
function fontSizeInit(){
	$('.fontSizeBtn button').bind({
		'click':function(e){
			//console.log($(this).attr('class')); // 1차오픈용 20161208-박-console.log 막기
			if($(this).hasClass('btnImgPlus')){
				nowFontSize++;
				if( nowFontSize > fontSizeArry.length -1)nowFontSize = fontSizeArry.length - 1;
			} else {
				nowFontSize--;
				if( nowFontSize < 0)nowFontSize = 0;
			}
			bodyScaleSet();
		}
	});
}
function bodyScaleSet(){
	if( fontSizeArry[nowFontSize] < 1 ){
		$('body').addClass('centerOrigin');
	} else {
		$('body').removeClass('centerOrigin');
	}
	$('body').css({transform:'scale('+fontSizeArry[nowFontSize]+')'});
	if(fontSizeArry[nowFontSize] == 1){
		$('body').css({transform:'none'});
	}
	
	setTimeout(function(){
		var bodyW = $(window).width() * fontSizeArry[nowFontSize] ;
		var conW = $('#content').outerWidth() * fontSizeArry[nowFontSize];
		//console.log( bodyW  +", "+ conW ); // 1차오픈용 20161208-박-console.log 막기
		//console.log((bodyW - conW ) * 0.5 ); // 1차오픈용 20161208-박-console.log 막기
		$(window).scrollLeft( (bodyW - $(window).width()) * 0.5 );
	},0);
}


//================================================================================ tableMake
function cssInsert(){
	if( oldIE == false ){
		var style = (function() {
			// Create the <style> tag
			var style = document.createElement("style");
			// WebKit hack
			style.appendChild(document.createTextNode(""));
			// Add the <style> element to the page
			document.head.appendChild(style);
			return style;
		})();
		var perStr, i = 101;
		while (i--) {
			perStr += "[data-width='" + i + "%'] {width:" + i + "%}";
		}
		style.innerHTML = "@media screen and (max-width:987px) {"+perStr+"}";
	}
}

// 레이아웃테이블
function layoutTable(){
	for( var i = 0 ; i < $('table.layout').length ; ++i ){
		$('table.layout:eq('+ i +')').addClass('tblAct');
		if( $('table.layout:eq('+ i +')').hasClass('rp') == false ){
			if( $('table.layout:eq('+ i +') tr:eq(0) > td').length > 3 || $('table.layout:eq('+ i +') tr:eq(0) > td:last-child').attr('colspan') != undefined ){
				$('table.layout:eq('+ i +')').addClass('rp');
				/* 1차오픈용 20161202-권-맥에서 data-width값을 가져오지못함
				if( $('table.layout:eq('+ i +') colgroup col').eq(0).css('width') != undefined ) {
					var width1 = $('table.layout:eq('+ i +') colgroup col').eq(0).css('width').replace("%","") * 2;
					if($('table.layout:eq('+ i +') colgroup col').eq(1).length > 0 ){
						var width2 = $('table.layout:eq('+ i +') colgroup col').eq(1).css('width').replace("%","") * 2;
					} else {
						width2 = width1;
					}
				} else {
					width1 = $('table.layout:eq('+ i +') colgroup col').eq(0).attr('width').replace("%","") * 2;
					if($('table.layout:eq('+ i +') colgroup col').eq(1).length > 0 ){
						width2 = $('table.layout:eq('+ i +') colgroup col').eq(1).attr('width').replace("%","") * 2;
					} else {
						width2 = width1;
					}
				}
			  
				$('table.layout:eq('+ i +') td:nth-child(1), table.layout:eq('+ i +') th:nth-child(1)').attr('data-width', width1 + "%" );
				$('table.layout:eq('+ i +') td:nth-child(2), table.layout:eq('+ i +') th:nth-child(2)').attr('data-width', width2 + "%" );
				$('table.layout:eq('+ i +') td:nth-child(3), table.layout:eq('+ i +') th:nth-child(3)').attr('data-width', width1 + "%" );
				$('table.layout:eq('+ i +') td:nth-child(4), table.layout:eq('+ i +') th:nth-child(4)').attr('data-width', width2 + "%" );
				*/
				$('table.layout:eq('+ i +') td:nth-child(1), table.layout:eq('+ i +') th:nth-child(1)').attr('data-width', "50%" );
				$('table.layout:eq('+ i +') td:nth-child(2), table.layout:eq('+ i +') th:nth-child(2)').attr('data-width', "50%" );
				$('table.layout:eq('+ i +') td:nth-child(3), table.layout:eq('+ i +') th:nth-child(3)').attr('data-width', "50%" );
				$('table.layout:eq('+ i +') td:nth-child(4), table.layout:eq('+ i +') th:nth-child(4)').attr('data-width', "50%" );
				for(var j = 0 ; j < $('table.layout:eq('+ i +') tr').length ; ++j ){
					$('<td class="border visibleTM" aria-hidden="true"></td>').insertBefore( ('table.layout:eq('+ i +') tr:eq('+j+') td:nth-child(3)'));
				}
			}
		} 
	}
}

// 기본테이블
function basicTable(){
	for( var k = 0 ; k < $('.tableX').length ; ++k ){
		$('.tableX').eq(k).addClass('off');
		$('.tableX').eq(k).addClass('tblAct');
		firstTDPaddingInit( $('.tableX').eq(k) );
		if( $('.tableX').eq(k).hasClass('rp') == false && $('.tableX').eq(k).data('type') != undefined ){
			$('.tableX').eq(k).addClass('rp');
			$('.tableX').eq(k).addClass('hiddenTM');
			var type = $('.tableX').eq(k).data('type');
			var table = $('.tableX').eq(k);
			if( table.data('title') != undefined ) var titInit = table.data('title');
			if( table.data('left-idx') != undefined ) var leftIdx = table.data('left-idx');
			if( table.find('.btnDetail').length == 0 ){
				if( type == "tableX" ){// 기본형
					var startTD = endTD = topTitle = accoUse = accoIdx = onlyInput = loanSum = cardSum = dummyInit = undefined;
					if( table.data('start') != undefined ) startTD = table.data('start');
					if( table.data('end') != undefined ) endTD = table.data('end');
					if( table.data('topTitle') != undefined ) topTitle = table.data('topTitle');
					if( table.data('accoUse') != undefined ) accoUse = table.data('accoUse');
					if( table.data('accoIdx') != undefined ) accoIdx = table.data('accoIdx');
					if( table.data('onlyInput') != undefined ) onlyInput = table.data('onlyInput');
					if( table.data('loanSum') != undefined ) loanSum = table.data('loanSum');//대출 조회 합계 쪽
					if( table.data('cardSum') != undefined ) cardSum = table.data('cardSum');//카드 조회 합계 쪽
					if( table.data('dummyInit') != undefined ) dummyInit = table.data('dummyInit');//카드 조회 합계 쪽
					var mTable = mTableX( table, titInit, startTD, endTD, topTitle, onlyInput, dummyInit );
					if( accoUse == true ){
						mTableXForceAcco( mTable, accoIdx );
					}
					if( loanSum == true ){
						mTableXLoanSum( mTable );
					}
					if( cardSum == true ){
						mTableXCardSum( mTable );
					}
				} else if( type == "sideAlign" ){// 좌우로 나뉘는 형태
					var startTD = layout = undefined;
					if( table.data('start') != undefined ) startTD = table.data('start');
					if( table.data('layout') != undefined ) layout = table.data('layout');
					mSideAlign( table, titInit, leftIdx, startTD, layout );
				} else if( type == "notice" ){// 공지사항 있는 경우
					var startTD = endTD = undefined;
					if( table.data('start') != undefined ) startTD = table.data('start');
					if( table.data('end') != undefined ) endTD = table.data('end');
					mTableNoti( table, titInit, startTD, endTD );
				} else if( type == "sideTopTable" ){// 양사이드 TD가 제일 위로 올라가고 아래는 기본형
					var titInit = undefined;
					if( table.data('title') != undefined ) titInit = table.data('title');
					mSideTopTable(table, titInit);
				} else if( type == "paymentList" ){//결제내역리스트
					var titInit = undefined;
					if( table.data('title') != undefined ) titInit = table.data('title');
					mPaymentList(table, titInit);
				} else if( type == "orderTitle" ){
					mOrderTable(table);
				} else if( type == "crdLon" ){
					mCardLon(table);
				} else if( type == "fundPrd" ){
					mFundPrd(table);
				} else if( type == "priority" ){
					mPriority(table);
				} else if( type == "business" ){
					mBusiness(table);
				} else if( type == "gold" ){
					mGold(table);
				} else if( type == "inputDoc"){
					mInputDoc(table);
				}
			} else {//상세보기 있는 경우
				if(type == "tableX"){
					var startTD = endTD = topTitle = accoUse = accoIdx = undefined;
					if( table.data('start') != undefined ) var startTD = table.data('start');
					if( table.data('end') != undefined ) var endTD = table.data('end');
					if( table.data('topTitle') != undefined ) var topTitle = table.data('topTitle');
					if( table.data('accoUse') != undefined ) var accoUse = table.data('accoUse');
					if( table.data('accoIdx') != undefined ) var accoIdx = table.data('accoIdx');
					mTableX_detail( table, titInit, startTD, endTD, topTitle );
				} else if(type == "sideAlign"){
					mSideAlign_detail( table, titInit, leftIdx );
				}
			}
		} 
	}
	for( var k = 0 ; k < $('.tblCrdCompare').length ; ++k ){
		$('.tblCrdCompare').eq(k).addClass('tblAct');
		if( $('.tblCrdCompare').eq(k).hasClass('rp') == false && $('.tblCrdCompare').eq(k).data('type') != undefined ){
			var type = $('.tblCrdCompare').eq(k).data('type');
			var table = $('.tblCrdCompare').eq(k);
			$('.tblCrdCompare').eq(k).addClass('rp');
			$('.tblCrdCompare').eq(k).addClass('hiddenTM');
			
			if( type == "cardBenefit" ){
				mCardBenefit(table);
			}
		}
	}
}

// 테이블정렬
function tableSort(){
	/* 정렬 기능 간소화 
	for(var i = 0 ; i < $('table thead .links.arrowUp').length ; ++i ){
		var table = $('table thead .links').eq(i).closest( "table" );
		if( table.hasClass('uiSort') == false ){
			table.addClass('uiSort');
			table.find('thead .links.arrowUp').bind({
				'mousedown':function(){
					if( $(this).hasClass('arrowUp') == true){
						$(this).removeClass('arrowUp').addClass('arrowDown');
					} else {
						$(this).removeClass('arrowDown').addClass('arrowUp');
					}
				}
			})
		}
	}
	*/
	/* 정렬기능 삭제 
	for(var i = 0 ; i < $('table thead .links.arrowUp').length ; ++i ){
		var table = $('table thead .links.arrowUp').eq(i).closest( "table" );
		if( table.hasClass('uiSort') == false ){
			table.addClass('uiSort');
			var headers = {};
			for( var j = 0 ; j < table.find('thead th').length ; ++j ){
				var dateType = false;
				if(table.find('thead th:eq('+j+')').data('sorter') != null){
					dateType = true;
				}
				if( table.find('thead th:eq('+ j +') .links.arrowUp').length == 0 ){
					//var data = {'sorter':false}
					headers[String(j)] = {'sorter':false};
				} else {
					if(dateType == true){
						headers[String(j)] = {'sorter':'shortDate'};
					}
				}
				var th = table.find('thead th:eq('+ j +')');
				if(th.find('button').length > 0 ){
					th.addClass('noPd');
					th.bind({
						'click':function(){
							$(this).addClass('noPd');
							$(this).find('button').addClass('on');
						}
					});
				}
				//$(th+':before').hide();
			}
			table.tablesorter({headers : headers});			
		}
	}*/
}

// 확장되는 테이블
function tableExtend(){
	for(var i = 0 ; i < $('table.extend').length ; ++i ){
		var table = $('table.extend').eq(i);
		var btn = table.next().find('.btnType1');
		var targetLine = table.data('def-line');
		if( table.hasClass('uiExt') == false ){
			table.addClass('uiExt');
			for( var j = 0 ; j < table.find('tr').length ; ++j ){
				if( j >= targetLine ){
					table.find('tr').eq(j).addClass('none');
				}
			}
		}
		$(btn).bind({
			'click':function(e){
				e.preventDefault();
				var enTxt1 = jexComMl("ui.front_J0043" ,'보기');
				var enTxt2 = jexComMl("ui.front_J0044" ,'닫기');
				if( $(this).parent().prev().hasClass('true') == false){
					$(this).parent().prev().addClass('true');
					var str = $(this).text();
					str = str.replace(enTxt1,enTxt2);
					$(this).text(str);
				} else {
					$(this).parent().prev().removeClass('true');
					str = $(this).text();
					str = str.replace(enTxt2,enTxt1);
					$(this).text(str);
				}
			}
		});
		
	}
}

function firstTDPaddingInit(target){
	var rowCnt = 0;
	for(var i = 0 ; i < target.find('tr').length ; ++i ){
		//console.log(rowCnt) // 1차오픈용 20161208-박-console.log 막기
		var td = target.find('tr:eq('+rowCnt+') > *:first-child ').addClass('first');
		if( target.find('tr:eq('+rowCnt+') > *:first-child ').attr('rowspan') != undefined ){
			rowCnt += Number( target.find('tr:eq('+rowCnt+') > *:first-child ').attr('rowspan') );
		} else {
			rowCnt++;
		}
	}
	target.removeClass('off');
}

//================================================================================ tblScrollInit
function tblScrollInit(){
	for(var i = 0; i < $('.tblScroll').length ; ++i ){
		var tableScroll = $('.tblScroll').eq(i);
		console.log("tblScrollInit : " + tableScroll.length );
		if( tableScroll.hasClass('tblScrollInit') == false ){
			tableScroll.addClass('tblScrollInit');
			if( tableScroll.parent().hasClass('scrollX') == false ){
				tableScroll.wrap('<div class="scrollX"></div>');
			} 
			if(tableScroll.parent().hasClass('scrollX') == true){
				//setting
				tableScroll.parent().wrap('<div class="tblSlideWrap"></div>');
				tableScroll.parent().parent().append(
				'<div class="control-nav">'+
				'	<button type="button" class="btnPrev">'+jexComMl("ui.front_J0045" ,'이전')+'</button>'+
				'	<button type="button" class="btnNext">'+jexComMl("ui.front_J0046" ,'다음')+'</button>'+
				'</div>');
				
				var targetW = tableScroll.width();
				var targetWrapW = tableScroll.parent().width();
				var scrollPos = tableScroll.parent().scrollLeft();
				var scrollPosEnd = targetW - targetWrapW;
				
				//resize
				$(window).resize(function(){
					scrollXresize();
				});
				
				//control nav show/hidden	
				if(targetW > targetWrapW){
					tableScroll.parent().parent().find('.control-nav').addClass('active');
					
				}else{
					tableScroll.parent().parent().find('.control-nav').removeClass('active');
				}
				
				//button show/hidden
				tableScroll.parent().parent().find('> .control-nav .btnPrev').addClass('disabled');
				tableScroll.parent().scroll(function(){
					var targetW = $(this).find('.tblScroll').width();
					var targetWrapW = $(this).width();
					var scrollPos = $(this).scrollLeft();
					var scrollPosEnd = targetW - targetWrapW;
					
					if(scrollPos == 0){
						$(this).parent().find('> .control-nav .btnPrev').addClass('disabled');
						$(this).parent().find('> .control-nav .btnNext').removeClass('disabled');
					}else if(scrollPos < scrollPosEnd && scrollPos > 0){
						$(this).parent().find('> .control-nav .btnPrev').removeClass('disabled');
						$(this).parent().find('> .control-nav .btnNext').removeClass('disabled');
					}else if(scrollPos == scrollPosEnd && scrollPos > 0){
						$(this).parent().find('> .control-nav .btnPrev').removeClass('disabled');
						$(this).parent().find('> .control-nav .btnNext').addClass('disabled');
					}
				});
				
				//next btn
				tableScroll.parent().parent().find('> .control-nav .btnNext').bind({
					'click':function(e){
						e.preventDefault();
						var scrollTarget = $(this).parent().prev();
						var scrollPos = scrollTarget.scrollLeft() + 250;
						scrollTarget.animate({scrollLeft: scrollPos },300);
					}
				});
				
				//prev btn
				tableScroll.parent().parent().find('> .control-nav .btnPrev').bind({
					'click':function(e){
						e.preventDefault();
						var scrollTarget = $(this).parent().prev();
						var scrollPos = scrollTarget.scrollLeft() - 250;
						scrollTarget.animate({scrollLeft: scrollPos },300);
					}
				});
			}
		}
	}
	scrollXresize();
}
// tblscroll resize
function scrollXresize(){
	for( var i = 0 ; i < $('.tblScroll').length ; ++i ){
		var targetW = $('.tblScroll').eq(i).width();
		var targetWrapW = $('.tblScroll').eq(i).parent().width();
		var scrollPosEnd = targetW - targetWrapW;
		
		if(targetW > targetWrapW){
			$('.tblScroll').eq(i).parent().parent().find('.control-nav').addClass('active');
		}else{
			$('.tblScroll').eq(i).parent().parent().find('.control-nav').removeClass('active');
		}
		
		$('.tblScroll').eq(i).parent().scroll(function(){
			var targetW = $(this).find('.tblScroll').width();
			var targetWrapW = $(this).width();
			var scrollPos = $(this).scrollLeft();
			var scrollPosEnd = targetW - targetWrapW;
			
			if(scrollPos == 0){
				$(this).parent().find('> .control-nav .btnPrev').addClass('disabled');
				$(this).parent().find('> .control-nav .btnNext').removeClass('disabled');							
			}else if(scrollPos < scrollPosEnd && scrollPos > 0){
				$(this).parent().find('> .control-nav .btnPrev').removeClass('disabled');
				$(this).parent().find('> .control-nav .btnNext').removeClass('disabled');
			}else if(scrollPos == scrollPosEnd && scrollPos > 0){
				$(this).parent().find('> .control-nav .btnPrev').removeClass('disabled');
				$(this).parent().find('> .control-nav .btnNext').addClass('disabled');
			}
		});
	}
}
//================================================================================ ErrorMasege Add
function errorMsg(_target, _msg){
	var targetArry = _target;
	var msgArry = _msg;
	for( var i = 0 ; i < targetArry.length ; ++i ){
		$(targetArry[i] + ' .formControl').addClass('error');
		var str = '<span class="msg">'+ msgArry[i] + '</span>';
		$(targetArry[i]).append(str);
		$(targetArry[i] + ' .msg').insertAfter($(targetArry[i] + ' .formControl'));
		
	} 
}

function removeError(_target){
	var targetArry = _target;
	for( var i = 0 ; i < targetArry.length ; ++i ){
		$(targetArry[i] + ' .formControl').removeClass('error');
		$(targetArry[i] + ' .msg').remove();
	} 
}
function removeErrorAll(){
	$('.formWrap .formControl').removeClass('error');
	$('.formWrap .msg').remove();
}


//================================================================================ fullVisualMove
function fullVisualMove(){
	$('.fullVisual').insertBefore($('#content'));
	$('.fullVisual').parent().find('.locationArea').addClass("visual");
	if($('.fullVisual').hasClass('landType2') == true ){
		var imgURL = $('.fullVisual .bgImg .imgCont').css('background-image');
		var imgType = ".jpg";
		var startStr = imgURL.indexOf("http");
		var endStr = imgURL.indexOf(".jpg");
		if(endStr == -1){
			startStr = imgURL.indexOf("(");
			endStr = imgURL.indexOf(".png");
			imgType = ".png";
		}
		var resultIMG = imgURL.substr(startStr, endStr-5) + "_m" +imgType;
		$('.landType2 .bgImg .imgCont').append('<img class="visibleMb" src="'+resultIMG+'" alt="">');
	}
}

//================================================================================ slideInit
function slideInit(target, $auto, $loop){
	var swiper;
	if( $(target).find('> .slideList > li').length  > 1){
		var slide = $(target);
		var _loop = $loop;
		var _auto = $auto;
		if($loop == null )_loop = true;
		if($auto == null )_auto = 0;
		$(target).addClass('swiper-container');
		$(target).find('> .slideList').addClass('swiper-wrapper');
		$(target).find('> .slideList > li').addClass('swiper-slide');
		$(target).find('.swiper-control').append(
		'<a href="#none" class="btnPrev">'+jexComMl("ui.front_J0045" ,'이전')+'</a>'+
		'<a href="#none" class="btnNext">'+jexComMl("ui.front_J0046" ,'다음')+'</a>'+
		'<div class="swiper-pagination"></div>'+
		'<div class="swiper-nav">'+
		'	<a href="#none" class="btnPlay">'+jexComMl("ui.front_J0047" ,'시작')+'</a>'+
		'	<a href="#none" class="btnStop">'+jexComMl("ui.front_J0048" ,'정지')+'</a>'+
		'</div>');
		
		swiper = new Swiper(target, {
			effect:'fade',
			pagination: target +' .swiper-control .swiper-pagination',
			paginationClickable: true,
			loop: _loop,
			autoplay: _auto,
			followFinger: false,
			nextButton:target + ' .swiper-control .btnNext',
			prevButton:target +' .swiper-control .btnPrev',
			touchEventsTarget : target + ' container',
			onSlideChangeStart : function(){
				var slideHeight = $(target).find('.swiper-slide-active div').height();
				$(target).css('height',slideHeight + 'px');
				$(target).find('.swiper-wrapper').css('height',slideHeight + 'px');
			},
			paginationBulletRender : function(){
				return '<a href="#none" class="swiper-pagination-bullet"></a>';
			}
		});
		
		$(window).resize(function(){
			var slideHeight = $(target).find('.swiper-slide-active div').height();
			$(target).css('height',slideHeight + 'px');
			$(target).find('.swiper-wrapper').css('height',slideHeight + 'px');
		});
		
		$(target).find('> .swiper-control > .swiper-nav > .btnPlay').bind({
			'click':function(e){
				e.preventDefault();
				swiper.startAutoplay();
				$(target).find('> .swiper-control > .swiper-nav > .btnStop').css('display','block');
				$(this).css('display','none');
			}
		});
		$(target).find('> .swiper-control > .swiper-nav > .btnStop').bind({
			'click':function(e){
				e.preventDefault();
				swiper.stopAutoplay();
				$(target).find('> .swiper-control > .swiper-nav > .btnPlay').css('display','block');
				$(this).css('display','none');
			}
		});
		
		$(target).find('> .swiper-control > .swiper-pagination > .swiper-pagination-bullet').bind({
			'click':function(e){
				e.preventDefault();
				swiper.stopAutoplay();
				$(target).find('> .swiper-control > .swiper-nav > .btnPlay').css('display','block');
				$(target).find('> .swiper-control > .swiper-nav > .btnStop').css('display','none');
			}
		});
		
	} else {
		$(target).find('.swiper-control').remove();
	}
	
	return swiper;
	
}
// 씨티카드몰 
function cardSlideInit(target, $auto, $loop){
	var swiper;
	if( $(target).find('> .slideList > li').length  > 1){
		var slide = $(target);
		var _loop = $loop;
		var _auto = $auto;
		if($loop == null )_loop = true;
		if($auto == null )_auto = 0;
		$(target).addClass('swiper-container');
		$(target).find('> .slideList').addClass('swiper-wrapper');
		$(target).find('> .slideList > li').addClass('swiper-slide');
		$(target).find('.swiper-control').append(
		'<a href="#none" class="btnPrev">'+jexComMl("ui.front_J0045" ,'이전')+'</a>'+
		'<a href="#none" class="btnNext">'+jexComMl("ui.front_J0046" ,'다음')+'</a>'+
		'<div class="swiper-pagination"></div>'+
		'<div class="swiper-nav">'+
		'	<a href="#none" class="btnPlay">'+jexComMl("ui.front_J0047" ,'시작')+'</a>'+
		'	<a href="#none" class="btnStop">'+jexComMl("ui.front_J0048" ,'정지')+'</a>'+
		'</div>');
		
		//카드몰_PC
		swiper = new Swiper(target, {
			effect:'slide',
			pagination: target +' .swiper-control .swiper-pagination',
			paginationClickable: true,
			loop: _loop,
			autoplay: _auto,
			followFinger: false,
			slidesPerView: 2,//PC일경우 2개 보여줌
			spaceBetween: 20,//PC일경우 간격20px
			nextButton:target + ' .swiper-control .btnNext',
			prevButton:target +' .swiper-control .btnPrev',
			touchEventsTarget : target + ' container',
			onSlideChangeStart : function(){
				var slideHeight = $(target).find('.swiper-slide-active div').height();
				$(target).css('height',slideHeight + 'px');
				$(target).find('.swiper-wrapper').css('height',slideHeight + 'px');
			},
			paginationBulletRender : function(){
				return '<a href="#none" class="swiper-pagination-bullet"></a>';
			},
			breakpoints:{
				//window width
				768:{
					slidesPerView:1,
					spaceBetween:0
				}
			}
		});
		
		
		$(target).find('> .swiper-control .btnPlay').bind({
			'click':function(e){
				e.preventDefault();
				swiper.startAutoplay();
				$(target).find('> .swiper-control .btnStop').css('display','block');
				$(this).css('display','none');
			}
		});
		$(target).find('> .swiper-control .btnStop').bind({
			'click':function(e){
				e.preventDefault();
				swiper.stopAutoplay();
				$(target).find('> .swiper-control .btnPlay').css('display','block');
				$(this).css('display','none');
			}
		});	
		$(target).find('> .swiper-control > .swiper-pagination > .swiper-pagination-bullet').bind({
			'click':function(e){
				e.preventDefault();
				swiper.stopAutoplay();
				$(target).find('> .swiper-control > .swiper-nav > .btnPlay').css('display','block');
				$(target).find('> .swiper-control > .swiper-nav > .btnStop').css('display','none');
			}
		});
		$(target).find('> .swiper-wrapper .swiper-slide a').bind({
			'mouseover focusIn':function(e){
				e.preventDefault();
				swiper.stopAutoplay();
			},
			'mouseleave focusOut': function(e){
				e.preventDefault();
				swiper.startAutoplay();
			}
		});
	} else {
		$(target).find('.swiper-control').remove();
	}

	return swiper;
}
//================================================================================ footerDropdown
function footerDropdownInit(){
	if($('.footer').hasClass('uiAct') == false && $('.footer .quicklinksArea1').length > 0 ){
		$('.footer').addClass('uiAct');
		$('.quicklinksArea1').find('.btnImgToggle').bind({
			'click':function(){
				if($('.quicklinksArea1').hasClass('tbMotion')){
					if($(this).parent().parent().hasClass('on')){
						$(this).parent().parent().parent().find('.cont').slideUp();
						$(this).parent().parent().removeClass('on').siblings('li').removeClass('on');
						$(this).parent().parent().parent().parent().removeClass('on');
						var spanTxt = jexComMl("ui.front_J0014" ,"펼치기");
						$(this).find('.blind').text(spanTxt);
						$(this).parent().parent().siblings().find('.blind').text(spanTxt);
					}else{
						$(this).parent().parent().parent().parent().siblings().find('.cont').slideUp();
						$(this).parent().parent().parent().parent().siblings().removeClass('on');
						$(this).parent().parent().parent().parent().siblings().find('li').removeClass('on');
						$(this).parent().parent().parent().find('.cont').slideDown();
						$(this).parent().parent().addClass('on').siblings('li').addClass('on');
						$(this).parent().parent().parent().parent().addClass('on');
						spanTxt = jexComMl("ui.front_J0015" ,"접기");
						$(this).find('.blind').text(spanTxt);
						$(this).parent().parent().siblings().find('.blind').text(spanTxt);
						spanTxt = jexComMl("ui.front_J0014" ,"펼치기");
						$(this).parent().parent().parent().parent().siblings().find('.blind').text(spanTxt);
					};
				}else if($('.quicklinksArea1').hasClass('mbMotion')){
					if($(this).parent().parent().hasClass('on')){
						$(this).parent().next().slideUp();
						$(this).parent().parent().removeClass('on');
						var spanTxt = jexComMl("ui.front_J0014" ,"펼치기");
						$(this).find('.blind').text(spanTxt);
					}else{
						$(this).parent().parent().siblings().find('.cont').slideUp();
						$(this).parent().parent().siblings('li').removeClass('on');	
						$(this).parent().parent().parent().parent().siblings().find('.cont').slideUp();
						$(this).parent().parent().parent().parent().siblings().find('li').removeClass('on');	
						$(this).parent().next().slideDown();
						$(this).parent().parent().addClass('on');
						spanTxt = jexComMl("ui.front_J0015" ,"접기");
						$(this).find('.blind').text(spanTxt);
						spanTxt = jexComMl("ui.front_J0014" ,"펼치기");
						$(this).parent().parent().siblings().find('.blind').text(spanTxt);
						$(this).parent().parent().parent().parent().siblings().find('.blind').text(spanTxt);
					}
				}
				
			}
		});	
	}
	footerDropdownDef();
}

function footerDropdownDef(){
	//mobile set
	footerW = $('.footer').width();
	if(footerW < 768){
		$('.quicklinksArea1').addClass('mbMotion').removeClass('tbMotion').removeClass('pcMotion');	
	//tablet set
	} else if(footerW >= 768 && footerW < 988){
		$('.quicklinksArea1').addClass('tbMotion').removeClass('mbMotion').removeClass('pcMotion');
	//PC set
	} else {
		$('.quicklinksArea1').addClass('pcMotion').removeClass('mbMotion').removeClass('tbMotion');
	}
	
	$('.quicklinksArea1.pcMotion .cont').show();
	$('.quicklinksArea1.tbMotion > div, .quicklinksArea1.tbMotion .quickList > li').removeClass('on');
	$('.quicklinksArea1.tbMotion .cont').hide();
	$('.quicklinksArea1.mbMotion > div, .quicklinksArea1.mbMotion .quickList > li').removeClass('on');
	$('.quicklinksArea1.mbMotion .cont').hide();
	
}

//================================================================================ inputSlider
function inputSlider(){
	$('.inputSlider').each(function(){
		var sliderRangeBox = $(this).find('.sliderRangeBox');
		var sliderInput = $(this).find('.sliderInput');
		var sliderVal = sliderInput.attr('value');
		var sliderMin = sliderInput.data('min');
		var sliderMax = sliderInput.data('max');
		var sliderRange = sliderInput.data('range');
		var sliderStep = sliderInput.data('step');

		sliderRangeBox.slider({
			range:sliderRange,
			step:sliderStep,
			min:sliderMin,
			max:sliderMax,
			value:sliderVal,
			slide: function(e,ui) {
				sliderInput.val(ui.value);
			},
			create:function(){
			
			}
		});
		sliderInput.keyup(function() {
			sliderRangeBox.slider('value', $(this).val());
		});
		
	});
}

//================================================================================ navEtcLayer
function navEtcLayer(){
	$('.btnImgSearch').click(function(){
		$('.srchArea').show().attr('tabindex','0');
		if(isMobile == true){
			$('body').addClass('srchOn');
		}
	});
	$('.srchArea .btnImgClose').click(function(){
		$('.srchArea').hide();
		$('.btnImgSearch').focus();
		if(isMobile == true){
			$('body').removeClass('srchOn');
		}
	});
	
}

//================================================================================ selectLayerCtrl
function selectLayerCtrl(){
	//전체상품보기 레이어
	for( var i = 0 ; i < $('.selectLayerWrap').length ; ++i ){
		if(  $('.selectLayerWrap').eq(i).hasClass('uiAct') == false ){
			$('.selectLayerWrap').eq(i).addClass('uiAct');
			$('.selectLayerWrap').eq(i).bind({
				'focusin':function(){
					$(this).siblings().removeClass('on');
					$(this).parent().siblings().find('.selectLayerCtrl').removeClass('on');	
				}
			});
		}
	}
	for( var i = 0 ; i < $('.selectLayerCtrl').length ; ++i ){
		if( $('.selectLayerCtrl').eq(i).hasClass('uiAct') == false ){
			$('.selectLayerCtrl').eq(i).addClass('uiAct');
			$('.selectLayerCtrl').eq(i).attr('tabindex','0');
			$('.selectLayerCtrl').eq(i).parent().find('.selectLayerUI').attr('tabindex','0');
			$('.selectLayerCtrl').eq(i).bind({
				'click':function(){
					if($(this).hasClass('on') == true){
						//console.log("selectLayerCtrl hasClass : " + "on"); // 1차오픈용 20161208-박-console.log 막기
						$(this).parent().removeClass('on');
						$(this).removeClass('on');
						customSelectGlobal = false;
						bodyAddBind(false, $(this));
					}else{
						//console.log("selectLayerCtrl hasClass : " + "off"); // 1차오픈용 20161208-박-console.log 막기
						$(this).parent().siblings().removeClass('on');
						$(this).parent().addClass('on');	
						$(this).parent().siblings().find('.selectLayerCtrl').removeClass('on');	
						$(this).addClass('on');	
						customSelectGlobal = true;
						bodyAddBind(true, $(this));
					}	
				},
				'keydown':function(e){
					if(e.keyCode == 13){
						if($(this).hasClass('on') == true){
							$(this).parent().removeClass('on');
							$(this).removeClass('on');
							bodyAddBind(false, $(this));
						}else{
							$(this).parent().siblings().removeClass('on');
							$(this).parent().addClass('on');	
							$(this).parent().siblings().find('.selectLayerCtrl').removeClass('on');	
							$(this).addClass('on');	
							bodyAddBind(true, $(this));
						}	
					}
				} 
			});
		}
	}
	if( $('.selectLayerWrap').length > 0 ){
		var lastEl;
		var lastSelectWrap = $('.selectLayerWrap').last().find('.selectLayer');
		if( lastSelectWrap.find('input').length > 0 )lastEl = lastSelectWrap.find('input').last();
		if( lastSelectWrap.find('a').length > 0 )lastEl = lastSelectWrap.find('a').last();
		if( lastSelectWrap.find('button').length > 0 )lastEl = lastSelectWrap.find('button').last();
		lastEl.bind({
			'focusout': function(){
				if( customSelectWrapState == false ){
					//console.log("customSelectWrapState : " + customSelectWrapState ); // 1차오픈용 20161208-박-console.log 막기
					$(this).closest('.selectLayerWrap').removeClass('on');
					$(this).closest('.selectLayerWrap').find('.selectLayerCtrl').removeClass('on');
				}
			}
		});
		if( lastEl.attr('type') == 'radio' || lastEl.attr('type') == 'checkbox' ){
			lastEl.next().bind({
				'click':function(){
					customSelectWrapState = true;
					setTimeout(function(){customSelectWrapState = false;}, 1000);
				}
			});
		} 
	}
}

function bodyAddBind(state,_target){
	//console.log("bodyAddBind"); // 1차오픈용 20161208-박-console.log 막기
	if(state == true){
		$('body').bind({
			'mousedown':function(e){
				if( $(e.target).hasClass('selectLayerCtrl', 'on') == true ){
					return false;
				}
				if( $(e.target).closest('.selectLayerUI').length == 0 ){
					//console.log("selectLayerUI") // 1차오픈용 20161208-박-console.log 막기
					$('.selectLayerCtrl.on').removeClass('on');
					$('.selectLayerWrap.on').removeClass('on');
					customSelectWrapState = false;
					$('body').unbind('mousedown');
					return false;
				}
			}
		});
	} else {
		$('body').unbind('mousedown');
	}
}
//================================================================================ telFocus
function telFocus(){
	//PC에서 a 속성값이 tel일경우 포커스안가게하기
	if(isMobile == false){
		for(var i=0; i < $('a').length; i++){
			if( $('a').eq(i).attr('href') != undefined ){
				if($('a').eq(i).attr('href').substr(0,3) == 'tel'){
					$('a').eq(i).attr('tabindex','-1');
					$('a').eq(i).bind({
						'click':function(e){
							e.preventDefault();
						},
						'focus':function(){
							$('a').eq(i).blur();
						}
					});
				}
			} 
		}
	}
}
//================================================================================ anchorInit
function anchorInit(){
	var gap = 53;
	if( $('#content').hasClass('business') == true ){
		gap = 0;
	}
	//은행소개 직원만족 한페이지에서만 사용
	$('.anchorList ul li a').click(function(){
		$(this).parent().addClass('on').siblings().removeClass('on');
		$('html,body').animate({scrollTop:$(this.hash).offset().top - gap},500);
	});
}
//================================================================================ 권 추가 etc
function etcInit(){
	//랜딩페이지 하단 영역 안내/알림
	$('.landAreaBlock .icoList').each(function(){
		var icoLi = $(this).find('li').length;
		$(this).find('li').css('width',(100/icoLi) + '%');
	});
	//접근성-포커스 tabindex 
	$('.scrollY, .termsBox').each(function(){
		if($(this).attr('tabindex') == null){
			$(this).attr('tabindex','-1'); 
		}
	});
	
	
	//전체메인 noticeList on/off
	$('.noticeList ul li').click(function(){
		$(this).addClass('on').siblings().removeClass('on');
	});
	
	//popupZone close
	if( $('.popupZone').length > 0 ){
		topPopState = true;
		$('.popupZone .btnClose').click(function(){
			$('.popupZone').css('min-height',0);
			$('.popupZone').slideUp(300,function(){$('.popupZone').remove(); topPopState = false; targetHeader = 98; });
		});
		if(topPopState == true){
			targetHeader += $('.popupZone').outerHeight(); 
		}
	};
	
	//채팅상담모듈
	if($('.scroll').hasClass('chatType') == true ){	
		if($(window).width() > 987 ){
			$('.chatScroll').css('height','auto');		
			var winH = $(window).height();
			var scrollPos = $(' .scroll').position().top;
			var result = winH - scrollPos - 60 - 40 - 309 - Number( $(' .scroll').css('margin-top').replace('px','') );		
			$('.chatScroll').height(result);
		}
	}	
	
	//카드비교하기 탭모션(모바일,태블릿버전)
	$('.crdCompareMb ul li').click(function(){
		$(this).addClass('on').siblings().removeClass('on');
	});
	
	//고객센터 퀵그룹
	$('.quickSearchWrap .quickGroup li a').click(function(){
		$(this).parent().addClass('on').siblings().removeClass('on');
	});
	
	//selectStar _ 로그아웃시 별점 선택하기
	$( ".selectStar label" ).bind({
		'click':function(e){
			var contain = $(this).closest('.selectStar');
			var idx = contain.find('label').index(this); 
			for(var i=0 ; i < contain.find('label').length ; ++i ){
				if( i <= idx){
					contain.find('label').eq(i).addClass('on');
				} else {
					contain.find('label').eq(i).removeClass('on');
				}
			}
		}
	});
	
	//씨티직장인신용대출 _ 금리변동주시 선택(모바일은 없음)
	$('.selTerm .selTermList ul li span label').bind({	
		'click':function(e){
			$(this).parent().parent().addClass('active');
			$(this).parent().parent().removeClass('finished');
			$(this).addClass('on');
			if($(this).parent().parent().prevAll().hasClass('active') == true){
				$(this).parent().parent().prevAll().removeClass('active').addClass('finished');
				$(this).parent().parent().prevAll().find('label').removeClass('on');
			}
			if($(this).parent().parent().nextAll().hasClass('active') == true){
				$(this).parent().parent().nextAll().removeClass('active').removeClass('finished');
				$(this).parent().parent().nextAll().find('label').removeClass('on');
			}
		}
	});
	
	//내공과금 달력 _날짜클릭시 상세일정 레이어 show/hidden
	/*
	$('.calendarWrap .calendarArea .tblCalendar tbody td .dayWrap .day').click(function(){
		$('.calendarWrap .detailArea .layerDetailCont').addClass('viewOn');
	});
	$('.calendarWrap .detailArea .layerDetailCont .btnClose').click(function(){
		$('.calendarWrap .detailArea .layerDetailCont').removeClass('viewOn');
	})
	*/
}

//================================================================================ 카드비쥬얼 블러 처리
function visualBlurInit(){
	if( $('.crdGoodsArea').length > 0 ){
		if(pubMode == false){
			var stackURL = "/js/common/stackblur.js";
		} else {
			stackURL = "../../js/stackblur.js";
		}
		if(isMobile == false){
			$.getScript(stackURL).done( function(){
				if( $('body').hasClass('ie7') == false || $('body').hasClass('ie8') == false ){
					stackBlurImage("blurVisual","canvas", 15);
					$('#canvas').removeAttr('style');
					blurResizeAdd();
				}
			}).fail( function (){
				console.log("stackblur load fail");
			});
		} else {
			$('.bgWrap').css('background-image', 'url('+$('#blurVisual').attr('src')+')' );
			$('.bgWrap').css('background-position', 'center' );
			$('.bgWrap').css('background-size','200% auto');
		}
	}
}

var blurTimeout;
function blurResizeAdd(){
	blurResize();
	$(window).resize(function(){
		clearTimeout(blurTimeout);
		blurTimeout = setTimeout(function(){
			blurResize();
		},100); 
	});
}

function blurResize(){
	if( $('.crdGoodsArea .bgWrap').height() / $('.crdGoodsArea .bgWrap').width() < 0.63 ){
		$('.crdGoodsArea .bgWrap').removeClass('vMode');
		$('#canvas').css( 'min-width', 0);
		$('#canvas').css( 'min-height', $('.bgWrap img').outerHeight());
		$('#canvas').css('left',"auto");
		var targetMargin = ( $('.crdGoodsArea .bgWrap').height() - $('#canvas').height() ) * 0.5;
		$('#canvas').css('top', targetMargin );
	} else {
		$('.crdGoodsArea .bgWrap').addClass('vMode');
		$('#canvas').css( 'min-width', $('.bgWrap img').outerWidth());
		$('#canvas').css( 'min-height', 0);
		$('#canvas').css('top',"auto");
		var targetMargin = ( $('.crdGoodsArea .bgWrap').width() - $('#canvas').width() ) * 0.5;
		$('#canvas').css('left', targetMargin );
		
	}
	
}

//================================================================================ 모바일과 PC 레이아웃 달라서 생기는 딜레이 보강
function layoutEtc(){
	$('.mHidden').addClass('on');
}

//================================================================================ URL 분기처리
function reDirectionURL(pcURL, mobileURL, target){
	if(isMobile == false){
		if(target != "_self"){
			window.open(pcURL);
		} else {
			window.location.replace(pcURL);
		}
	} else {
		if(target != "_self"){
			window.open(mobileURL);
		} else {
			window.location.replace(mobileURL);
		}
	}
}

//================================================================================ Parameter
function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function tabForceMove(){
	var tabCode = getParameterByName('tab');
	if(tabCode != null || tabCode != ""){
		$('.tabContain:eq(0) > .tab > ul > li:eq('+tabCode+')').trigger('click');
	}
}

function tabForceMove2(tabCode){
	$(".tabContain").eq(0).find("> .tab > ul > li").eq(tabCode).trigger('click');
}

//================================================================================ Mobile Check
function checkMobileDevice() {
	var mobileKeyWords = new Array('Android', 'iPhone', 'iPad', 'iPod', 'BlackBerry', 'Windows CE', 'SAMSUNG', 'LG', 'MOT', 'SonyEricsson');
	for (var info in mobileKeyWords) {
		if(navigator.userAgent.match(mobileKeyWords[info]) != null) {
			return true;
		}
	}
	return false;
}

//================================================================================ IOS Check
function checkIOSDevice() {
	var mobileKeyWords = new Array('iPhone', 'iPad', 'iPod');
	for (var info in mobileKeyWords) {
		if(navigator.userAgent.match(mobileKeyWords[info]) != null) {
			return true;
		}
	}
	return false;
}
//================================================================================ BrowserCheck
var ieV = get_version_of_IE();
var oldIE = false;
var ie8 = false;
function get_version_of_IE () { 
	var word; 
	var version = "N/A"; 
	var agent = navigator.userAgent.toLowerCase(); 
	var name = navigator.appName; 
	// IE old version ( IE 10 or Lower ) 
	if ( name == "Microsoft Internet Explorer" ) word = "msie "; 
	else { 
		// IE 11 
		if ( agent.search("trident") > -1 ) word = "trident/.*rv:"; 
		// Microsoft Edge  
		else if ( agent.search("edge/") > -1 ) word = "edge/"; 
	} 
	var reg = new RegExp( word + "([0-9]{1,})(\\.{0,}[0-9]{0,1})" ); 
	if (  reg.exec( agent ) != null  ) version = RegExp.$1 + RegExp.$2; 
	return version; 
}

if(ieV == "8.0" || ieV == "9.0"){
	oldIE = true;	
}
if(ieV == "8.0") {
	ie8 = true;
}

//================================================================================ ie8 script
function ie8Init(){
	//console.log("IE8");
}

function oldIESetting(){
	//console.log("IE8, IE9 공통");
}

//================================================================================ uiBind & Basic Setting
var pubMode = false;

function setting(){
	if( pubMode == true ){
		if($('.header').length > 0 ){
			if($('body').hasClass('noLoad') == false ){
				if($('.header').hasClass('premium') == true ){
					var url = '../ajax/layout_crdPrem.html header > *';
				} else if($('.header').hasClass('post') == true ) {
					url = '../ajax/layout_post.html header > *';
				} else if($('.header').hasClass('mall') == true ) {
					url = '../ajax/layout_crdMall.html header > *';
				} else if($('.header').hasClass('priority') == true ) {
					url = '../ajax/layout_priority.html header > *';
				} else if($('.header').hasClass('business') == true ) {
					url = '../ajax/layout_business.html header > *';
				} else if($('.header').hasClass('gold') == true ) {
					url = '../ajax/layout_gold.html header > *';
				} else {
					url = '../ajax/layout_pre.html header > *';
				}
				$('.header').load(url,function(){
					onLoadFunction();
				});
			} else {
				onLoadFunction();
			}
			if($('.header').hasClass('mall') == false ) {
				$('.footer').load('../ajax/layout_pre.html footer > *',function(){
					footerDropdownInit();
					mGnbFootMenuSetting();
					telFocus();
				});
			} else if($('.header').hasClass('mall') == true ) {
				$('.footer').load('../ajax/layout_crdMall.html footer > *',function(){
					footerDropdownInit();
					mGnbFootMenuSetting();
					telFocus();
				});
			}
		} else {
			onLoadFunction();
		}
	} else {
		onLoadFunction();
	}
}

function onLoadFunction(){
	$('body').addClass('ready');
	fontSizeInit();
	resizeEvent();
	mobileGnbMake();
	mobileGnbInit();
	gnbInit();
	navEtcDropDownCtrl();
	addGnbStiky();
	uiBind();
	tabForceMove();
	//권추가
	lnbLoad();
	fullVisualMove();
	visualBlurInit();
	crdCompare();
	etcInit();
	footerDropdownInit();
	navEtcLayer();
	detailAuto();
	progressBarMove();
	popupMove();
	mGnbFootMenuSetting();
	telFocus();
	anchorInit();
}

function uiBind(){
	//cssInsert();
	tableSort();
	basicTable();
	tableDetail();
	tableExtend();
	tabMake();
	progSet();
	datepicker();
	inputInit();
	selectLayerCtrl();
	accordionAdd();
	dropDownCtrl();
	tipInit();
	termsAdd();
	btnSwap();
	quickGroupMake();
	layoutTable();
	inputSlider();
	stepAreaInit();
	setTimeout(function(){
		tblScrollInit();
	},100);
	
	try{
		popupResize(".nowOpen");
	} catch(e){
		
	}
}


//================================================================================ Resize & Sticky
var footerW = $('.footer').width();
var targetHeader = 98;
$(window).resize(function(){
	if( isMobile == false ){
		resizeEvent();
	}
	if( isMobile == true && footerW != $('.footer').width() ){
		footerDropdownDef();
	}
});
$(window).on("orientationchange",function(){
	resizeEvent();
});

function addGnbStiky(){
	var sticky = $('.header .sticky'),
		scroll = $(window).scrollTop();
	if (scroll >= targetHeader){
		sticky.addClass('fixed');
		sticky.prev().addClass('fixed');
	} else {
		sticky.removeClass('fixed');
		sticky.prev().removeClass('fixed');
	}
}

function resizeEvent(){
	var winW = $(window).width(); 
	if( winW <= 768){
		targetHeader = 53;
		$('#content').focus();
		$('.gnb .menu > li.on').trigger('mouseout');
	} else {
		targetHeader = 98;
		if(topPopState==true){
			try{
				targetHeader += $('.popupZone').ourterHeight(); 
			} catch(e){}
		}
		if($('.mGnb').is(':visible')){
			$('.mGnb .close').trigger('click');
		}
	}
	if( $('body').hasClass('popOn') ){
		popupResize('.popWrap.nowOpen');
	};
	if( footerW != $('.footer').width() ){
		footerDropdownDef();
		//console.log("footerDropdownDef"); // 1차오픈용 20161208-박-console.log 막기
	}
	
	if(winW <= 988){
		if($(".detailAccordion").parent().hasClass('searchWrap') == true){
			$(".detailAccordion").parent().removeClass('on');
			$(".detailAccordion").parent().find('.accoContents').hide();
			var spanTxt = jexComMl("ui.front_J0016" ,'검색 열기');
			$(".detailAccordion").text(spanTxt);
		}
	}else{
		if($(".detailAccordion").parent().hasClass('searchWrap') == true){
			$(".detailAccordion").parent().addClass('on');
			$(".detailAccordion").parent().find('.accoContents').show();
			var spanTxt = jexComMl("ui.front_J0017" ,'검색 닫기');
			$(".detailAccordion").text(spanTxt);
		}
	}
	navEtcHeightSet();
}

$(window).scroll(function(){
	/*if($(window).width() <= 768){
		targetHeader = 53;
	} 속도개선사항으로 주석처리*/
	if( $('body').hasClass('popOn') == false ){
		addGnbStiky();
	}
});

//================================================================================ 실행함수
$(document).ready(function(){
	if(oldIE == true )oldIESetting();
	if(ie8 == true ){
		ie8Init();
		isMobile = false;
		isIOS = false;
	} else {
		isMobile = checkMobileDevice();
		isIOS = checkIOSDevice();
		if(isIOS)$('body').addClass('ios');
		if(isMobile)$('body').addClass('isMobile');
		layoutEtc();
	}
	
	$.getScript( "../../js/common/pubMode.js")
	.done( function(){
		setting();
	})
	.fail( function (){
		$.getScript( "../../js/pubMode.js")
		.done( function(){
			setting();
		})
		.fail( function (){
			setting();
		});
	});
});

