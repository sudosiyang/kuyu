define(function(require, exports) {
	function init(option){
		return new ScrollSpy($(option.parent),{target:option.target});
	}

	function ScrollSpy(element, options) {
		var href
		var process = $.proxy(this.process, this)

		this.$element = $(element).is('body') ? $(window) : $(element)
		this.$body = $('body')
		this.$scrollElement = this.$element.on('scroll', process)
		this.options = $.extend({}, ScrollSpy.DEFAULTS, options)
		this.selector = (this.options.target || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
			|| '') + ' .nav li > a'
		this.offsets = $([])
		this.targets = $([])
		this.activeTarget = null

		this.refresh()
		this.process()
	}

	ScrollSpy.DEFAULTS = {
		offset: 10
	}
	ScrollSpy.prototype.refresh = function() {
		var offsetMethod = this.$element[0] == window ? 'offset' : 'position'

		this.offsets = $([])
		this.targets = $([])

		var self = this
		var $targets = this.$body
			.find(this.selector)
			.map(function() {
				var $el = $(this)
				var href = $el.data('target') || $el.attr('href')
				var $href = /^#\w/.test(href) && $(href)

				return ($href && $href.length && [
					[$href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href]
				]) || null
			})
			.sort(function(a, b) {
				return a[0] - b[0]
			})
			.each(function() {
				self.offsets.push(this[0])
				self.targets.push(this[1])
			})
	}

	ScrollSpy.prototype.process = function() {
		var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
		var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
		var maxScroll = scrollHeight - this.$scrollElement.height()
		var offsets = this.offsets
		var targets = this.targets
		var activeTarget = this.activeTarget
		var i

		if (scrollTop >= maxScroll) {
			return activeTarget != (i = targets.last()[0]) && this.activate(i)
		}

		for (i = offsets.length; i--;) {
			activeTarget != targets[i] && scrollTop >= offsets[i] && (!offsets[i + 1] || scrollTop <= offsets[i + 1]) && this.activate(targets[i])
		}
	}

	ScrollSpy.prototype.activate = function(target) {
		this.activeTarget = target

		$(this.selector)
			.parents('.active')
			.removeClass('active')

		var selector = this.selector + '[data-target="' + target + '"],' + this.selector + '[href="' + target + '"]'

		var active = $(selector)
			.parents('li')
			.addClass('active')

		if (active.parent('.dropdown-menu').length) {
			active = active
				.closest('li.dropdown')
				.addClass('active')
		}
		
		active.trigger('activate')
	}
	exports.init=init;
})