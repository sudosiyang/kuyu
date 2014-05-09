/**
 * ------------------------------------------
 * 表格渲染 模板实现
 * @version  1.2
 * @author   susu(744276721@qq.com)
 * ------------------------------------------
 **/
define(function(require, exports) {

	require("../../../res/css/item.css");

	var data, item_array, parent, per_item, pager_position, _display_num,
		temp = "";

	function init(option) {
		parent = option.parent;
		data = option.data;
		item_array = option.item;
		if (option.pager) {
			per_item = option.per_item ? option.per_item : 4;
			pager_position = option.pager_position ? option.pager_position : "bot";
			_display_num = option.display_num ? option.display_num : 5;
		}
		render();
	}

	function render() {
		temp = "";
		var header = "",
			index = 1,
			content = "";
		$.each(item_array, function(i, val) {
			header += stringCat("<div class='col%% t-l'>%%</div>", index, val);
			temp += stringCat("<div class='col%% t-l'><%=%% %></div>", index++, i);
		});
		$(parent).append("<div class='m-item m-hd'>" + header + "</div><div class='m-content'></div>");
		temp = "<div class='m-item m-con'>" + temp + "</div>";
		if (!per_item) {
			$.each(data, function(i, val) {
				content += parseTpl(temp, val);
			});
			$(parent).find(".m-content").append(content);
		} else {
			require.async("../pager/page", function(t) {
				if (pager_position && pager_position != "pre") {
					$(parent).after("<div class='_pager'></div>");
				} else {
					$(parent).before("<div class='_pager'></div>");
				}
				getPerData(1);
				//分页插件依赖，初始化
				t.init({
					parent: "._pager",
					item: per_item,
					total: data.length,
					display_num: _display_num,
					selectChange: function() {
						getPerData(this.current);
					}
				});
			});
		}
	}

	//获取每页的渲染数据
	function getPerData(page) {
		var t = "";
		for (var i = (page - 1) * per_item; i < page * per_item; i++) {
			if (data[i])
				t += parseTpl(temp, data[i]);
		}
		$(parent).find(".m-content").empty().append(t);
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

			/* jsbint evil:true */
			func = new Function('obj', tmpl);

		return data ? func(data) : func;
	}

	function stringCat() {
		var str = arguments[0];
		var arg = arguments,
			i = 0;
		return str.replace(/%%/g, function() {
			i++;
			return arg[i];
		});
	}
	exports.init = init;
});