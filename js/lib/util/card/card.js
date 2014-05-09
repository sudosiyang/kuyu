define(function(require, exports) {
	require("../../../res/css/card.css");
	var Tool = require("../../base/util");
	var __target, __tip, __dataSource, __view = '<span class="__view" tabindex="-1"> <span class="__item">%%</span><b>▼</b>%%</span>';
	var __ul = "",
		__temp = "<li data-value='%%'>%%</li>";
	var __onChange;

	function init(option) {
		__target = option.target;
		__tip = option.tip;
		__onChange = option.onChange;
		createCard();
	}

	function createCard() {
		__dataSource = $.parseJSON($(__target).attr('data-source'));
		$.each(__dataSource, function(index, el) {
			__ul += Tool.stringCat(__temp, el, index);
		});
		__ul = "<ul class='__clist'>" + __ul + "</ul>"
		$(__target).append(Tool.stringCat(__view, __tip, __ul));
		eventBind();
	}

	function eventBind() {
		$(__target).on("click", "li", function(event) {
			event.preventDefault();
			var _value = $(this).attr('data-value'),
				_text = $(this).text();
			API.value = _value;
			$(__target).find('.__view').attr("data-value", _value).find(".__item").text(_text).parent().find("li").removeClass();
			$(this).addClass('__select').parent().slideUp();
			if ($.type(__onChange) == "function")
				__onChange.call(API);

		}).on("click", ".__item,b", function() {
			var _this = $(this).parent().find("ul");
			_this.slideToggle(function() {
				if (!_this.is(":hidden")) {
					_this.parent().focus();
				}
			});
		}).on("focusout", ".__view", function() {
			//失焦列表回弹
			$(__target).find("ul").slideUp();
		})
	}

	function setIndex(idx) {
		var i = 0;
		$.each(__dataSource, function(index, val) {
			if (i == idx) {
				$(__target).find('.__view').attr("data-value", val).find(".__item").text(index);
				API.value = val;
			}
			i++;
		});
		if ($.type(__onChange) == "function")
			__onChange.call(API);
	}
	var API = (function() {
		return {
			value: ""
		}
	})();

	exports.init = init;
	exports.setIndex = setIndex;
})