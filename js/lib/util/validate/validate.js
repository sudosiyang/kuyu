/**
 * ------------------------------------------
 * 表单验证封装实现文件
 * @version  1.3.2
 * @author   susu(744276721@qq.com)
 * ------------------------------------------
 **/
define(function(require, exports) {
	require("../tooltip/tip");
	var flag;
	exports.init = function() {
		$("form").on("click", ".tooltip", function() {
			$(this).prev().tooltip("destroy")
		});
		$('form input[type!=checkbox]:visible').focusout(function(event) {
			if (!$(this).parent().attr("v")) {
				//不为空
				if (!$(this).val()) {
					$(this).parent().tooltip({
						"title": "输入的内容不能为空"
					}).tooltip("show");
					flag = false;
					return;
				}
			}
			//长短
			if (!($(this).parent().attr("v") && !$(this).val().length)) {
				var max = $(this).parent().attr('max') ? $(this).parent().attr('max') : 99999;
				var min = $(this).parent().attr('min') ? $(this).parent().attr('min') : 0;
				if (max < $(this).val().length || min > $(this).val().length) {
					var title;
					if (max == min) {
						title = "请输入" + min + "个字符";
					} else {
						title = "请输入" + min + "~" + max + "个字符";
					}
					$(this).parent().tooltip({
						"title": title
					}).tooltip("show");
					flag = false;
					return;
				}

				//正则
				if ($(this).parent().attr('reg')) {
					var reg = new RegExp($(this).parent().attr('reg'), "g");
					if (!$(this).val().match(reg)) {
						$(this).parent().tooltip({
							"title": "您输入的内容不合法"
						}).tooltip('show');
						flag = false;
						return;
					}
				}
			}
		}).focusin(function(event) {
			$(this).parent().tooltip("destroy");
			flag = true;
		});

		$("form").submit(function(event) {
			if (flag) {
				$('input').focusout();
				if ($(".tooltip").length > 0) {
					return false;
				} else {
					$("input[type=submit]").val("正在提交...");
					flag = false;
				}
			} else {
				return false;
			};
		});
	}
});