/**
 * ------------------------------------------
 * 建议提示工具
 * @version  0.3.1
 * @author   susu(744276721@qq.com)
 * ------------------------------------------
 **/
define(function(require, exports) {
	require("../../../res/css/suggester.css");

	var parent, array = [],
		current = 0,
		key = [],onChange;

	function init(option) {
		parent = option.target;
		onChange=option.onChange;
		var data = $.parseJSON($(parent).attr("data-source"));
		$.each(data, function(index, val) {
			array.push(index);
			key.push(val);
		});
		$(parent).after("<div class='_sug " + parent.substr(1) + "_s" + "'></div>");
		$("._sug").hide();
		ui_event();
	}

	//数据渲染
	function render(data) {
		var html = "";
		if (data) {
			var i = 0;
			$.each(array, function(index, val) {
				if (new RegExp(data).test(val)) {
					if (i != +current) {
						html += "<div class='itm' attr="+i+">" + val + "</div>";
					} else {
						html += "<div class='itm selected' attr="+i+">" + val + "</div>";
					}
					i++;
				}

			});
			if (html) {
				$(parent + "_s").empty().append(html).show();
			}else{
				$(parent + "_s").empty().hide();
			}
		}

	}

	function ui_event() {
		$("body").on('mouseenter', parent + '_s div', function(event) {
			current = $(this).attr("attr");
			$("._sug div").removeClass('selected').eq(current).addClass('selected');
		}).on('mouseleave', parent + '_s div', function(event) {
			current = $(this).attr("attr");
			$("._sug div").removeClass('selected').eq(current).addClass('selected');
		}).on('click', parent + '_s div', function(event) {
			$(parent).val($(this).text());
			API.setKey($(this).text());
			onChange.call(API);
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
						enter(event);
						break;
					default:
						render(_this.val());
				}
			});
		}).focusout(function(event) {
			$("body").off('keyup');
			setTimeout(function() {
				$("._sug").hide();
			}, 500);
		});

	}

	function up() {
		if (current == 0) {
			current = array.length - 1;
		} else {
			current--;
		}
		$(parent + "_s div").removeClass('selected').eq(current).addClass('selected');
	}

	function down() {
		if (current == array.length - 1) {
			current = 0;
		} else {
			current++;
		}
		$(parent + "_s div").removeClass('selected').eq(current).addClass('selected');
	}

	function enter(event) {
		event.preventDefault();
		$(parent).val($(parent + "_s .selected").text());
		API.setKey($(parent + "_s .selected").text());
		onChange.call(API);
		$("._sug").hide();
	}
    var API=(function(){
    	return {
    		key:"",
    		setKey:function(val){
    			var _key=key[$.inArray(val, array)];
    			this.key=_key;
    		}
    	}
    })()
	exports.init = init;
})