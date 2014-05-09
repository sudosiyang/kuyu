/**
 * ------------------------------------------
 * 集合工具类
 * @version  1.3.1
 * @author   susu(744276721@qq.com)
 * ------------------------------------------
 **/
define(function(require, exports) {

	/******************************
	 * ajax提交
	 ******************************/

	exports.ajax = function(_url, _data, succeed, type) {
		var _type = _type ? _type : "json";
		$.ajax({
			url: _url,
			type: 'post',
			data: _data,
			dataType: _type
		}).done(function(e) {
			succeed(e);
		})
	}

	/******************************
	 * 表单验证
	 ******************************/
	exports.validate = function() {
		require.async("../util/validate/validate", function(v) {
			v.init();
		})
	}

	/******************************
	 * 复制到文字剪切板
	 ******************************/
	exports.copy = function(btn, text_con, a_fn) {
		//避免重复创建
		if ($(btn).next().attr("class") == "zclip") return false;

		var path = require.resolve("../util/copy/copy");
		var _path = path.split("lib/")[0] + '/res/copy.swf';
		//初始化
		require.async("../util/copy/copy", function() {
			$(btn).zclip({
				path: _path,
				copy: $(text_con).text(),
				afterCopy: a_fn
			});
		})

	}

	/******************************
	 * 格式化输出
	 ******************************/
	exports.stringCat = function() {
		var str = arguments[0];
		var arg = arguments,
			i = 0;
		return str.replace(/%%/g, function() {
			i++;
			return arg[i];
		})
	}

	/**
	 * 解析模版tpl。当data未传入时返回编译结果函数；当某个template需要多次解析时，建议保存编译结果函数，然后调用此函数来得到结果。
	 *
	 * @method parseTpl
	 * @grammar parseTpl(str, data)  ⇒ string
	 * @grammar parseTpl(str)  ⇒ Function
	 * @param {String} str 模板
	 * @param {Object} data 数据
	 * @example var str = "<p><%=name%></p>",
	 * obj = {name: 'ajean'};
	 * console.log($.parseTpl(str, data)); // => <p>ajean</p>
	 */

	exports.parseTpl = function(str, data) {
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
	};



	/******************************
	 * fileupload
	 ******************************/

	exports.uploadfile = function(_url, fileId, succeed, faild) {
		require.async("../util/ajax/ajaxupload", function() {
			$.ajaxFileUpload({
				url: _url,
				secureuri: false,
				fileElementId: fileId,
				dataType: 'json',
				success: function(data) {
					succeed(data);
				},
				error: function(data, status, e) {
					faild(data);
				}
			});
		});
	}
})