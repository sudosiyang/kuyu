/**
 * ------------------------------------------
 * 分页控件实现文件
 * @version  1.2.1
 * @author   susu(744276721@qq.com)
 * ------------------------------------------
 **/
define(function(require, exports) {
	require("../../../res/css/pager.css");
	var total, parent, current, per_item, display_num,
		fn;
	var templ = "<div class='autoPager'><a class='pre'>上一页</a><%=item%><a class='next'>下一页</a></div>";

	function init(option) {
		total = option.total;
		parent = option.parent;
		current = option.current ? option.current : 1;
		per_item = option.item ? option.item : 10;
		fn = option.selectChange;
		display_num=option.display_num?option.display_num:7;
		drawLink();
		linkClick();
	}
	/**
	 *  计算最大页数
	 */
	function numPages() {
		return Math.ceil(total / per_item);
	}

	function parseTpl(str, data) {
		var tmpl = 'var __p=[];' + 'with(obj||{}){__p.push(\'' +
			str.replace(/\\/g, '\\\\')
			.replace(/'/g, '\\\'')
			.replace(/<%=([\s\S]+?)%>/g, function(match, code) {
				return '\',' + code.replace(/\\'/, '\'') + ',\'';
			})
			.replace(/<%([\s\S]+?)%>/g, function(match, code) {
				return '\');' + code.replace(/\\'/, '\'')
					.replace(/[\r\n\t]/g, ' ') + '__p.push(\'';
			})
			.replace(/\r/g, '\\r')
			.replace(/\n/g, '\\n')
			.replace(/\t/g, '\\t') +
			'\');}return __p.join("");',
			func = new Function('obj', tmpl);

		return data ? func(data) : func;
	};

	//对外接口
	var API=(function(){
		return{
			current:"1",
			setCurrent:function(_current){
				this.current=_current;
			}
		}
	})();
	function render(data){
		total=data;
		drawLink();
	}

	function current(num){
		current=num;
		API.current=num;
		drawLink();
	}

	function linkClick() {
		$("body").on('click', parent+' .autoPager a', function(event) {
			event.preventDefault();
			if($(this).hasClass('current')) return;
			if (!isNaN($(this).text())) {
				current = $(this).text();
			} else {
				if ($(this).hasClass('disable')) return;
				if ($(this).hasClass('pre')) {
					current--;
				} else {
					current++;
				}
			}
			API.setCurrent(current);
			drawLink();
			fn.call(API);
		});
	}
	//绘制
	function drawLink() {
		var temp = "";
		$(parent).empty();
		if (numPages() <= 1) return;
		//小于显示数量
		if (numPages() < display_num) {

			for (var i = 1; i <= numPages(); i++) {
				if (current == i) {
					temp += '<a class="current">' + i + '</a>';
				} else {
					temp += '<a>' + i + '</a>';
				}
			};
		} else {
			//剩余页少于显示页
			if (numPages() - current < display_num) {
				var te=[];
				for (var i = numPages(); i > numPages() - display_num; i--) {
					if (current == i) {
						te.push ('<a class="current">' + i + '</a>');
					} else {
						te.push( '<a>' + i + '</a>');
					}
				}
				temp=te.reverse().join("");
			} else {
				var hf_num = Math.ceil(display_num / 2);
				var pre = [],
					next = "";
				if (current >= hf_num) {

					for (var i = 1; i < hf_num; i++) {
						pre.push('<a>' + (+current - i) + '</a>');
						next += '<a>' + (+current + i) + '</a>';
					}

				} else {
					for (var i = +current + 1; i <= display_num; i++) {
						next += '<a>' + i + '</a>';
					}
					for (var j = (+current - 1); j >= 1; j--) {
						pre.push('<a>' + j + '</a>');
					}
				}
				temp = pre.reverse().join("") + '<a class="current">' + current + '</a>' + next;
			}

		}
		$(parent).append(parseTpl(templ, {
			"item": temp
		}));
		if (current == 1) {
			$(parent).find(".pre").addClass('disable');
		}
		if (current == numPages()) {
			$(parent).find(".next").addClass('disable');
		}
	}
	exports.init = init;
	exports.render=render;
	exports.current=current;

});