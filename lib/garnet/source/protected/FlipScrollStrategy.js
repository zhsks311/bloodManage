(function (enyo, g, scope) {
	/**
	* _g.FlipScrollStrategy_ inherits {@link g.ScrollStrategy}.
	* _g.FlipScrollStrategy_ is mainly for handling scroller paging for
	* {@link g.Scroller} and {@link g.DataList}.
	*
	* @class g.FlipScrollStrategy
	* @extends g.ScrollStrategy
	* @private
	*/

	enyo.kind(
		/** @lends g.FlipScrollStrategy.prototype */ {

		/**
		* @private
		*/
		name: "g.FlipScrollStrategy",

		/**
		* @private
		*/
		kind: "g.ScrollStrategy",

		/**
		* @private
		*/
		tools: [{
			name: "scrollMath",
			kind: "g.FlipScrollMath",
			onScrollStart: "scrollMathStart",
			onScroll: "scrollMathScroll",
			onScrollStop: "scrollMathStop"
		}],

		/**
		* Virtual scroller's top value.
		* As flip scroll strategy is defined for FlipDataList,
		* no DOM operation like tranforming in y or x direction can be performed.
		* All data elements are stacked so a virtual scroller needs to be maintained.
		*
		* @private
		*/
		virtualScrollTop: 0,

		/**
		* virtual scroller left value
		*
		* @private
		*/
		virtualScrollLeft: 0,

		/**
		* As scroller is virtual the list height is not maintined in DOM.
		* We need to maintain in variable for paging calculation and bound calculations.
		* scroller height
		*
		* @private
		*/
		scrollHeight: 0,

		/**
		* Scroller width.
		*
		* @private
		*/
		scrollWidth: 0,

		/**
		* @private
		*/
		fixedChildSize: g.height,

		/**
		* Gets the scroll top value.
		*
		* @returns {Number} The vertical scroll position in pixels.
		* @public
		*/
		getScrollTop: function() {
			return this.virtualScrollTop;
		},

		/**
		* Gets the value of scrollLeft.
		*
		* @returns {Number} The horizontal scroll position in pixels.
		* @public
		*/
		getScrollLeft: function() {
			return this.virtualScrollLeft;
		},

		/**
		* Sets the left scroll position within the scroller.
		*
		* @param  {Number} inLeft - Sets the left scroll position within the scroller
		* @public
		*/
		setScrollLeft: function(inLeft) {
			this.scrollTo(inLeft, null);
		},

		/**
		* Scrolls a list to the given item in the given list.
		*
		* @param {enyo.Control} inControl - The control to make visible in viewport.
		* @param {Boolean} inAlignWithTop - If `true`, the node is aligned with the top
		* of this scroller.
		* @public
		*/
		scrollIntoView: function(inControl, inAlignWithTop) {
			this.stop();
			var n = inControl;
			while (n && n.parent && (n.parent.name != "page1") && (n.parent.name != "page2")) {
				n = n.parent;
			}
			if (n.index >= 0) {
				this.scrollTo(null, (n.index * this.fixedChildSize));
			}
		},

		/**
		* Returns the index of the list item to which the given node belongs to.
		* The index information is added to the list item node while paging.
		*
		* @private
		*/
		findParentListItemIndex: function(inNode) {
			if (!inNode) {
				return;
			}
			var n = inNode;
			var parentisPage1 = n.parentNode.classList.contains("page1");
			var parentisPage2 = n.parentNode.classList.contains("page2");
			while (n && n.parentNode && !parentisPage1 && !parentisPage2) {
				n = n.parentNode;
				parentisPage1 = n.parentNode.classList.contains("page1");
				parentisPage2 = n.parentNode.classList.contains("page2");
			}
			if ((parentisPage1 || parentisPage2) && (n.index)) {
				return n.index;
			}
			return;
		},

		/**
		* Informs whether the given node is focused or not.
		*
		* @returns {Boolean} - The focus state of the given node.
		* @private
		*/
		isInView: function(inNode) {
			if (!inNode) {
				return false;
			}
			var itemIndex = this.findParentListItemIndex(inNode);
			if (itemIndex) {
				var elementTopValue = itemIndex * this.fixedChildSize;
				if (Math.abs(this.virtualScrollTop - elementTopValue) < 0.5) {
					return true;
				}
			}
			return false;
		},

		/**
		* Flips to the given node.
		*
		* @param {Node} inNode - The node to make visible in this scroller's viewport.
		* @param {Boolean} inAlignWithTop - If `true`, the node is aligned with the top of this
		*	scroller.
		* @public
		*/
		scrollToNode: function(inNode, inAlignWithTop) {
			if (!inNode) {
				return;
			}
			var itemIndex = this.findParentListItemIndex(inNode);
			if (itemIndex) {
				this.scrollTo(null, (itemIndex * this.fixedChildSize));
			}
		},

		/**
		* Upadates the top and left position of the Scroller.
		*
		* @private
		*/
		effectScroll: function(inX, inY) {
			this.scrollLeft = this.virtualScrollLeft = inX;
			this.scrollTop = this.virtualScrollTop = inY;
			this.effectOverscroll(inX !== null ? Math.round(inX) : inX, inY !== null ? Math.round(inY) : inY);
		},

		/**
		* Checks for overscroll and takes action.
		*
		* @private
		*/
		effectOverscroll: function(inX, inY) {
			var x = "0",
				y = "0";
			if (inY !== null && Math.abs(inY - this.virtualScrollTop) > 1) {
				y = (this.virtualScrollTop - inY);
			}
			if (inX !== null && Math.abs(inX - this.virtualScrollLeft) > 1) {
				x = (this.virtualScrollLeft - inX);
			}
			if (!this.transform) {
				//adjust top/left if browser can't handle translations
				this.$.client.setBounds({
					left: x + "px",
					top: y + "px"
				});
			}
		},

		/**
		* Gets scroller width and height.
		*
		* @private
		*/
		getScrollSize: function() {
			return {
				width: this.scrollWidth,
				height: this.scrollHeight
			};
		},

		/**
		* Sets the height of the scroller.
		*
		* @param  {Number} maxTop -  The height of the Scroller.
		* @public
		*/
		setScrollHeight: function(maxTop) {
			this.scrollHeight = maxTop;
		},

		/**
		* Sets the width of the Scroller.
		*
		* @param  {Number} maxLeft - The width of the Scroller.
		* @public
		*/
		setScrollWidth: function(maxLeft) {
			this.scrollWidth = maxLeft;
		}
	});

})(enyo, g, this);
