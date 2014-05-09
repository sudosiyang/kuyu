/**
 * ------------------------------------------
 * 窗口控件
 * @version  2.0.3
 * @author   susu(744276721@qq.com)
 * ------------------------------------------
 **/
 
define(function(require, exports) {
	/*!Extend jquery.js*/
	/**
	 * @title 标题内容
	 * @content 如果传入的是HTMLElement类型，
				如果是隐藏元素会给其设置display:block以显示该元素，
				其他属性与绑定的事件都会完整保留
	 * @ok 	确定按钮回调函数。
			函数如果返回false将阻止对话框关闭；函数this指针指向内部api；
			如果传入true表示只显示有关闭功能的按钮
	 * @okVal "确定按钮"文字
	 * @cancel 取消按钮回调函数。
			   函数如果返回false将阻止对话框关闭；函数this指针指向内部api；如果传入true表示只显示有关闭功能的按钮
			   对话框标题栏的关闭按钮其实就是取消按钮，只不过视觉不同罢了，点击同样触发cancel事件
	 * @cancelVal "取消按钮"文字
	 * @copy  复制按钮，复制文字
	 * @copy_target 复制目标默认.textarea
	 * @width   设置消息内容宽度，可以带单位。一般不需要设置此，对话框框架会自己适应内容。
				如果设置为百分值单位，将会以根据浏览器可视范围作为基准，此时如果浏览器窗口大小被改变其也会进行相应的调整
	 * @height  设置消息内容高度，可以带单位。不建议设置此，而应该让内容自己撑开高度。
				如果设置为百分值单位，将会以根据浏览器可视范围作为基准，此时如果浏览器窗口大小被改变其也会进行相应的调整
	 * @drag  是否允许用户拖动位置
	 * @time 设置对话框显示时间。以毫秒为单位
	 */



	require("../../../res/css/xbox.css");
	var tool = require("../../base/util")
	var template = '<div class="tetequ-box"><div class="ui-mask"></div><div class="ui-box"><a href="" class="box-close">x</a><div class="box-content"><div class="box-title"><h2 class="box-title-name"></h2></div><div class="box-body"></div><div class="box-footer clearfix"></div></div></div></div>';
	var _width, _height, _top, _left, option, id;

	function dialog(_option) {
		option = _option;
		create();
		rander();
		createBtn();
		eventBind();
	}

	function createBtn() {

		if (option.cancel) {
			$(".box-footer").append(tool.stringCat('<a class="box-cancle">%%</a>', option.cancelVal || '取消')).show();
		}
		if (option.copy) {
			$(".box-footer").append(tool.stringCat('<a class="box-copy" data-trigger="" data-placement="left" data-original-title="复制成功"">%%</a>', '复制')).show();
			if (typeof(option.copy) == "function") {
				var _target = option.copy_target ? option.copy_target : ".textarea";
				tool.copy(".box-footer a.box-copy", ".box-body " + _target, function() {
					option.copy.call(api);
				});
			}
		}
		if (option.ok) {
			$(".box-footer").append(tool.stringCat('<a class="box-ok">%%</a>', option.okVal || '确定')).show();
		}
	}

	function create() {
		$('body').append(template);
	}

	function htmlEncode(str) {
		var div = document.createElement("div");
		div.appendChild(document.createTextNode(str));
		return div.innerHTML;
	}

	function rander() {
		if (option.title) {
			$(".box-title").show().find(".box-title-name").text(option.title);
		}
		if (option.content) {
			if (typeof(option.content) == "string") {
				$(".box-body").append(htmlEncode(option.content));
			}
			if (typeof(option.content) == "object") {
				$(".box-body").append(option.content.clone(true).show());
			}
		}
		if (option.drag) {
			$(".box-title").css({
				"cursor": "move"
			})
			$("body").on('mousedown', '.box-title', function(event) {
				var X = event.pageX;
				var Y = event.pageY;
				var left = X - (+$(".ui-box").css("left").replace("px", ""));
				var top = Y - (+$(".ui-box").css("top").replace("px", ""));
				$(document).on('mousemove', function(event) {
					var moveX = event.pageX - left < 0 ? 0 : event.pageX - left;
					var moveY = event.pageY - top < 0 ? 0 : event.pageY - top;
					$(".ui-box").css({
						'left': moveX,
						'top': moveY
					})
				});
			}).on("mouseup", '.box-title', function() {
				$(document).off('mousemove');
			});
		}


		//位置初始化
		_width = option.width ? option.width : '';
		_height = option.height ? option.height : '';

		$(".box-content").css({
			width: _width,
			height: _height
		});
		_top = ($(window).height() - $(".ui-box").height()) / 2 + ($('body').scrollTop() || $('html').scrollTop()); //垂直居中
		_left = ($(window).width() - $(".ui-box").width()) / 2;
		id = option.id || "box-" + Math.floor(Math.random() * 1000);
		$(".ui-box").css({
			top: _top,
			left: _left
		}).parent(".tetequ-box").attr('id', id);

		//时间
		if (option.time) {
			api.time(option.time);
		};
	}

	//对外接口
	var flag;
	var api = (function() {
		return {
			close: function() {
				var $selecter = "#" + id + " a";
				$(".tetequ-box").remove();
				$("body").off("keyup").off("click", $selecter).off('mousedown', '.box-title');
			},
			time: function(val) {
				var _this = this;
				setTimeout(function() {
					_this.close();
				}, val);
			},
			tip: function() {
				require.async("../tooltip/tip", function() {
					flag = setInterval(function() {
						if ($.fn.tooltip) {
							$(".box-copy").tooltip("show");
							clearInterval(flag);
						}
					}, 100);
				});

			}
		}
	})();


	function eventBind() {
		var $selecter = "#" + id + " a";
		$("body").on('click', '.box-close', function(event) {
			event.preventDefault();
			api.close();
		}).on("keyup", function(e) {
			if (e.keyCode==27) {
				api.close();
			}
		}).on('click', $selecter, function(event) {
			event.preventDefault();
			switch ($(this).attr("class")) {
				//取消的判定是否为函数
				case "box-cancle":
					if (typeof(option.cancel) == "function") {
						option.cancel.call(api);
					} else {
						if (option.cancel) api.close();
					}
					break;
					//确定的回调
				case "box-ok":
					option.ok.call(api);
			}
		});
	}
	exports.dialog = dialog;
});