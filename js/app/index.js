define(function(require) {
	require("../lib/base/jquery");
	require("../lib/util/unslider/unslider")
	var scrollspy = require("../lib/util/navagator/scrollspy");
	var header = require("../lib/util/navagator/headroom");
	var x = scrollspy.init({
		parent: "body",
		target: ".m-nav"
	});
	$(".m-nav").on("activate", function(e) {

	});

	
	$(".nav li").hover(function(e) {
		var index = $.inArray($(e.target)[0], $.makeArray($(".nav li a")));
		var active = $.inArray($(".nav .active")[0], $.makeArray($(".nav li")));
		if ($(".u-animate").is(":hidden")) {
			$(".u-animate").css({
				"left": 100 * active
			}).show().stop().animate({
				left: 100 * index
			});
		} else {
			$(".u-animate").stop().animate({
				left: 100 * index
			});
		}
	},function(e){
		var active = $.inArray($(".nav .active")[0], $.makeArray($(".nav li")))
		$(".u-animate").stop().animate({
				left: 100 * active
			},function(){
				$(".u-animate").hide();
			});
	})


	var slidey = $(".banner").unslider({
		speed: 500, //  动效执行时间
		delay: 3000, // 轮询时间 
		complete: function() {}, //  每次滑动特效后执行函数
		keys: true, //  支持左右按键
		dots: true, //  点导航
		fluid: false //  是否支持响应式网页
	});

	var data = slidey.data('unslider');
	$(".u-next").click(function(event) {
		data.next();
	}).next().click(function(event) {
		data.prev();
	});

	$(".m-nav a").click(function(e) {

		var href = $(this).attr("href");
		if (!$(href)) {
			return;
		}
		e.preventDefault();
		var pos = $(href).offset().top;
		$("html,body").animate({
			scrollTop: pos
		}, 500);
		return false;
	});
	var xx = new header.Headroom($(".m-header")[0], {
		onPin: function() {
			$(".m-header").animate({
				"margin-top": 0
			});
		},
		onUnpin: function() {
			$(".m-header").animate({
				"margin-top": -120
			});
		}
	}).init();
})