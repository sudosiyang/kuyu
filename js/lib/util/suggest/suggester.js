/**
 * ------------------------------------------
 * 建议提示工具
 * @version  0.3.1
 * @author   susu(744276721@qq.com)
 * ------------------------------------------
 **/
define(function(require, exports) {
	require("../../../res/css/suggester.css");

	var parent, array, current = 0;

	function init(option) {
		parent = option.target;
		array = option.suggest;
		$(parent).after("<div class='_sug'></div>");
		$("._sug").hide();
		ui_event();
	}

	//数据渲染
	function render(data) {
		var html = "";
		if (data) {
			data=data.split("@")[0];
			$.each(array, function(i) {
				if (i != current) {
					html += "<div class='itm' attr=" + i + ">" + data + array[i] + "</div>";
				} else {
					html += "<div class='itm selected' attr=" + i + ">" + data + array[i] + "</div>";
				}
			});
		}
		$("._sug").empty().append(html).show();
	}

	function ui_event() {
		$("body").on('mouseenter', '._sug div', function(event) {
			current = $(this).attr("attr");
			$("._sug div").removeClass('selected').eq(current).addClass('selected');
		}).on('mouseleave', '._sug div', function(event) {
			current = $(this).attr("attr");
			$("._sug div").removeClass('selected').eq(current).addClass('selected');
		}).on('click', '._sug div', function(event) {
			$(parent).val($(this).text());
			$("._sug").hide();
		});
		$(parent).focusin(function(event) {
			var _this = $(this);
			$("body").on('keyup', function(event) {
				switch (event.keyCode) {
					case 38:
						//up
						up();
						break;
					case 40:
						//down
						down();
						break;
					case 13:
						//enter
						enter();
						break;
					default:
						render(_this.val());
				}
			});
		}).focusout(function(event) {
			$("body").off('keyup');
			setTimeout(function() {
				$("._sug").hide();
			},500);
		});

	}

	function up() {
		if (current == 0) {
			current = array.length - 1;
		} else {
			current--;
		}
		$("._sug div").removeClass('selected').eq(current).addClass('selected');
	}

	function down() {
		if (current == array.length - 1) {
			current = 0;
		} else {
			current++;
		}
		$("._sug div").removeClass('selected').eq(current).addClass('selected');
	}

	function enter() {
		$(parent).val($("._sug .selected").text());
		$("._sug").hide();
	}

	exports.init = init;
})