 SOHU_AD = {};
 SOHU_AD.utils = (function($) {//工具模块
	var defaults = {
		src: null,//源
		name: null,
		width: null,
		height:null,
		wmode: "transparent",
		allowScriptAccess: "always",
		link: null,//连接地址
		id: null//div的ID
	},
	opt,
	addContent = function(options) {//添加flash或者图片
		opt = $.extend(defaults, options);
		if(opt.flash) {
		 	var sohuFlash2 = new sohuFlash(opt.src, opt.name, opt.width, opt.height,"7");
    		sohuFlash2.addParam("quality", "high");
    		sohuFlash2.addParam("wmode",opt.wmode);
   			sohuFlash2.addParam("allowScriptAccess", opt.allowScriptAccess);
   	 		sohuFlash2.addVariable("clickthru",escape(opt.link));
    		sohuFlash2.write(opt.id);
		} else {
			var $wrap =  $('#' + opt.id);
			$wrap.css( "background", 'url("' + opt.src + '") no-repeat 50% 0' )
				.bind( "click", function() {
					window.open(opt.link, 'newwindow');			
				});
		}
		return this;
	};
	return {
		addContent: addContent
	};
})(jQuery);
SOHU_AD	.dcad = (function() {//广告模块
	var dcads = [null, null, null, null, null],
		timer,//定时器
		index = 2,//初始显示的广告
		len = 5,//所有广告总和
		$lb_menu = $(".menuC ul > li");
	function _init(options) {
		dcads = options;
		var offset = $lb_menu.eq(0).offset();
		$('<div id = "ad_wrap"></div>').css({//广告容器
			position: 'absolute',
			top: offset.top,
			left: offset.left - 150,
			'z-index': 1000,
			width: '150px',
			height: '300px'
		})	.appendTo($('body')).hide();
		$('<div id = "flash_wrap"></div>').css({//内容容器
			position: 'absolute',
			width: '150px',
			height: '280px'
		})	.appendTo($('#ad_wrap'));
		$('<div id = "close_wrap"><span id = "ad_close">&#20851;&#38381;</span></div>').css({//关闭容器
			position: 'absolute',
			top: 280,
			'z-index': 1001,
			width: '150px',
			height: '20px'
		}).appendTo($("#ad_wrap"));
		changeContent(index);
		return this;
	}
	function autoPlay() {//自动播放函数
		//console.log("autoplay");
		timer = setInterval(function() {//定时
			do {
				index++; 
				if(index >= len) index = 0;	
			} while (dcads[index] == null)
			changeContent(index);
			//console.log("autoplay" + index);
		}, 5000);	
	}
	function changeContent(num) {//改变要加载的内容
		//console.log(num);
		$("#ad_wrap").show();	
		$('#flash_wrap').empty();
		var settings = {
					flash:dcads[num].flash,
					src: dcads[num].src,
					name: 'dcad_flash',
					width: 150,
					height: 280,
					link:dcads[num].link,
					id: 'flash_wrap'
			};
		SOHU_AD.utils.addContent(settings);
		index = num;//设置index为正在加载的图片
	}
	function tt(index) {//闭包实现index保存
		return function() {
			changeContent(index);	//滑动过后-自动播放
			clearInterval (timer);
			autoPlay();
		};
	}
	function show() {//显示
		$("#ad_wrap").show();		
	}
	function control() {//控制
		for(index = 0; index < len; index++) {//循环绑定事件
			if(dcads[index]) {
				var afterMouse = tt(index);
				$lb_menu.eq(index).bind("mouseover",  afterMouse);					
			}
		}
		autoPlay();//开始自动播放
		$("#ad_close").css({//关闭按钮
			cursor: 'pointer',
			float: 'right'
		}).bind("click", function() {
			console.log(timer);
			clearInterval(timer);
			$("#ad_wrap").hide();
			console.log(timer);
		});
	}
	function hide() {//隐藏
		$("#ad_wrap").hide();
		clearInterval(timer);
	}
	return {
		init: _init,
		show: show,
		control: control,
		hide: hide
	};
})(jQuery);
