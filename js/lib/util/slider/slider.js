/**
 * ------------------------------------------
 * 滑块控制封装文件
 * @version  1.0.3
 * @author   susu(744276721@qq.com)
 * ------------------------------------------
 **/

define(function(require, exports) {
	var _parent, _min, _max, _width, _thum_with;
	require("../../../res/css/slider.css");

	function init(option) {
		_parent = option.parent;
		_min = option.min ? option.min : 0;
		_max = option.max ? option.max : 100;
		_width = option.width ? option.width : 160;
		_onchange = option.onChange;
		createUI();
		eventBind();
	}

	function createUI() {
		$(_parent).append('<div class="_slider"><div class="_mover"></div><div class="_cover"></div><div class="_traker"></div></div>').find("._slider").width(_width);
		_thum_width = $(_parent + " ._mover").width();
	}

	function eventBind() {
		$("body").on('mousedown', '._mover', function(event) {
			var X = event.pageX;
			var left = X - (+$("._mover").css("left").replace("px", ""));
			$(document).on('mousemove', function(event) {
				var moveX = event.pageX - left < 0 ? 0 : event.pageX - left;
				var moveX = moveX > $("._slider").width() - _thum_width ? $("._slider").width() - _thum_width : moveX;
				$("._mover").css({
					'left': moveX
				})
				$("._cover").width(moveX + _thum_width / 2).parent().css({
					"cursor": "default"
				});
				API.setValue(moveX);
				if (typeof(_onchange) == "function")
					_onchange.call(API);
			})
		}).on("mouseup", function() {
			$(document).off('mousemove');
		}).on('click', '._traker,._cover', function(event) {
			moveX = event.offsetX - _thum_width / 2;
			if (moveX < 0) moveX = 0;
			if (moveX > $("._slider").width() - _thum_width) moveX = $("._slider").width() - _thum_width;
			$("._mover").css({
				'left': moveX
			})
			$("._cover").width(moveX + _thum_width / 2).parent().css({
				"cursor": "default"
			});
			API.setValue(moveX);
			if (typeof(_onchange) == "function")
				_onchange.call(API);
		});
	}
	var API = (function() {
		return {
			value: 0,
			setValue: function(left) {
				this.value = Math.floor((_max - _min) * (left / (_width - _thum_width))) + _min;
			}
		}
	})();

	function setValue(value) {
		value=value<_min?_min:value;
		value=value>_max?_max:value;
		left = (value - _min) / (_max - _min) * (_width - _thum_width);
		$("._mover").css({
			'left': left
		})
		$("._cover").width(left + _thum_width / 2).parent().css({
			"cursor": "default"
		});
		API.value = value;
		if (typeof(_onchange) == "function")
			_onchange.call(API);
	}
	exports.init = init;
	exports.setValue = setValue;
});