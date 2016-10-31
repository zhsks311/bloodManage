(function (enyo, g, scope) {
	/**
	* Fired when an item of this list gets removed.
	*
	* @event g.DataList#onDataRemoved
	* @type {Object}
	* @property {Object} sender - The [component]{@link http://enyojs.com/docs/latest/#/kind/enyo.Component} that most recently
	*	propagated the event.
	* @property {Object} event - An object containing the event information.
	* @public
	*/

	/**
	* Fired when an item is added to this list.
	*
	* @event g.DataList#onDataAdded
	* @type {Object}
	* @property {Object} sender - The [component]{@link http://enyojs.com/docs/latest/#/kind/enyo.Component} that most recently
	*	propagated the event.
	* @property {Object} event - An object containing the event information.
	* @public
	*/

	/**
	* Fired when an item of this list gets changed.
	*
	* @event g.DataList#onChange
	* @type {Object}
	* @property {Object} sender - The [component]{@link http://enyojs.com/docs/latest/#/kind/enyo.Component} that most recently
	*	propagated the event.
	* @property {Object} event - An object containing event information.
	* @public
	*/

	/**
	* _g.DataList_ is an [enyo.DataList]{@link http://enyojs.com/docs/latest/#/kind/enyo.DataList} in Garnet style.
	* It uses [g.Scroller]{@link g.Scroller} as its default scroller.
	*
	* @class g.DataList
	* @extends enyo.DataList
	* @public
	*/
	enyo.kind(
		/** @lends g.DataList.prototype */ {

		/**
		* @private
		*/
		name: "g.DataList",

		/**
		* @private
		*/
		kind: "enyo.DataList",

		/**
		* @private
		*/
		noDefer: true,

		/**
		* @private
		*/
		handlers: {
			onLayerEffectStart: "disableScrolling",
			onLayerEffectEnd: "enableScrolling",
			onKnobDrag: "knobDrag",
			onWheelChange: "wheelChange",
			onScrollStop: "scrollStop",
			ontap: "playFeedback",
			onflick: "flickHandler",
			onKnobControlBegin: "knobControlBegin",
			onKnobControlEnd: "knobControlEnd"
		},

		/**
		* @private
		*/
		events: {
			onDataRemoved: "",
			onDataAdded: "",
			onChange: ""
		},

		/**
		* @private
		*/
		selection: false,

		/**
		* Indicates whether the bottom of this list, with cards, has been reached.
		*
		* @private
		*/
		_overScrollBottomCard: false,

		/**
		* @private
		*/
		defaultStateV: undefined, // defaultStateV stores default Vertical state of scroller

		/**
		* @private
		*/
		defaultStateH: undefined, // defaultStateH stores default Horizontal state of scroller

		/**
		* @private
		*/
		renderDelay: 0,

		/**
		* @private
		*/
		classes: "g-data-list",

		/**
		* `headerComponents` is the `components` placed at the top of this list.
		*
		* @public
		*/
		headerComponents: [{classes: "g-data-list-header-comp", ontap: "preventSound"}],

		/**
		* `footerComponents` is the `components` placed at the bottom of this list.
		*
		* @public
		*/
		footerComponents: [{classes: "g-data-list-footer-comp", ontap: "preventSound"}],

		/**
		* Indicates whether this list uses cards. If `true`, this list uses cards.
		*
		* Range: [`true`, `false`]
		*
		* - `true`: This list uses cards.
		* - `false`: This list does not use cards.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		cards: false,

		/**
		* Indicates whether to display gradient(s) at the top and/or bottom of the list
		* to indicate the presence of more contents to scroll.
		*
		* Range: [`true`, `false`]
		*
		* - `true`: Scroll indicators are displayed.
		* - `false`: Scroll indicators are not displayed.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		scrollIndicatorEnabled: false,

		/**
		* @private
		*/
		itemHeight: g.height,

		/**
		* Checkes for singleFlick.
		*
		* Range: [`true`, `false`]
		*
		* - `true`: singleFlick is activated.
		* - `false`: singleFlick is not activated.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		singleFlick: false,

		/**
		* _g.DataList_ places its item rows inside a [g.Scroller]{@link g.Scroller}.
		* Any configurable options of [g.Scroller]{@link g.Scroller} may be placed in this property.
		* The option values will be set on this DataList's scroller accordingly.
		* If no options are specified, the default settings of [g.Scroller]{@link g.Scroller} is used.
		*
		* @type {Object}
		* @default {kind: "g.Scroller", maxHeight: "320px"}
		* @public
		*/
		scrollerOptions: {
			kind: "g.Scroller",
			maxHeight: "320px"
		},

		/**
		* Makes the title displayed when the `collection.empty()` method is called.
		*
		* @fires g.DataList#onDataRemoved
		* @private
		*/
		bindings: [
			{from: ".collection.length", to: ".length", transform: function(val) {
				this._modelChanged = true;
				if (val===0) {
					this.doDataRemoved();
				}
				return val;
			}}
		],

		/**
		* @method
		* @private
		*/
		create: enyo.inherit(function(sup) {
			return function() {
				this.containerOptions = {
					name: "scroller",
					kind: "g.Scroller",
					horizontal: "hidden",
					vertical: "scroll",
					canGenerate: false,
					scrollIndicatorEnabled: this.scrollIndicatorEnabled,
					classes: "enyo-fit enyo-data-list-scroller",
					components: [
						{name: "header"},
						{name: "active", classes: "active", components: [
							{name: "page1", classes: "page page1"},
							{name: "page2", classes: "page page2"},
							{name: "buffer", classes: "buffer"}
						]},
						{name: "footer"}
					]
				};

				this.controlsPerPage = this.controlsPerPage || 8;

				sup.apply(this, arguments);
				// FIXME: Need to determine whether headerComponents was passed on the instance or kind to get the ownership correct
				if (this.cards) {
					if (this.hasOwnProperty("headerComponents")) {
						this.$.header.createComponents(this.headerComponents, {owner: this.getInstanceOwner()});
					}
					if (this.hasOwnProperty("footerComponents")) {
						this.$.footer.createComponents(this.footerComponents, {owner: this.getInstanceOwner()});
					}
					this.$.scroller.getStrategy().$.scrollMath.kFrictionDamping = 0.80;
					this.$.scroller.getStrategy().$.scrollMath.kFlickScalar = 40;
					this.$.scroller.getStrategy().$.scrollMath.kSpringDamping = 0.2;
					this.singleFlick = true;
					this.waterfallDown('onSyncSingleFlick', {syncSingleFlick: this.singleFlick});
				} else {
					if (this.headerComponents) {
						var ownerH = this.hasOwnProperty("headerComponents") ? this.getInstanceOwner() : this;
						this.$.header.createComponents(this.headerComponents, {owner: ownerH});
					}
					if (this.footerComponents) {
						var ownerF = this.hasOwnProperty("footerComponents") ? this.getInstanceOwner() : this;
						this.$.footer.createComponents(this.footerComponents, {owner: ownerF});
					}
					this.$.scroller.getStrategy().$.scrollMath.kFrictionDamping = 0.96;
					this.$.scroller.getStrategy().$.scrollMath.kFlickScalar = 40;
					this.storePreviousScrollerSates();
				}				
			};
		}),

		/**
		* @method
		* @private
		*/
		initComponents: enyo.inherit(function(sup) {
			return function() {
				this.createComponent({kind: "Signals", onvisibilitychange: "visibilityChanged"});
				sup.apply(this, arguments);
			};
		}),

		/**
		* @method
		* @private
		*/
		showingChanged: enyo.inherit(function(sup) {
			return function() {
				if (!this.showing) {
					this.$.scroller.hide();
				}
				sup.apply(this, arguments);
				if (this.showing) {
					this.$.scroller.show();
					this.syncScroll();
				}
			};
		}),

		/**
		* Overridden to call a method of the delegate strategy.
		*
		* @method
		* @fires g.DataList#onDataAdded
		* @private
		*/
		modelsAdded: enyo.inherit(function(sup) {
			return function() {
				sup.apply(this, arguments);
				this.doDataAdded();
				this.syncScroll();
			};
		}),

		/**
		* Overridden to call a method of the delegate strategy.
		*
		* @method
		* @fires g.DataList#onDataRemoved
		* @private
		*/
		modelsRemoved: enyo.inherit(function(sup) {
			return function() {
				sup.apply(this, arguments);
				this.doDataRemoved();
				this.syncScroll();
			};
		}),

		/**
		* Completely resets the current list by scrolling the list to the top
		* of the scrollable region and regenerating all of its children. This is typically necessary
		* only at the initialization of this list or if the entire dataset has been swiped out.
		*
		* @method
		* @public
		*/
		reset: enyo.inherit(function(sup) {
			return function() {
				sup.apply(this, arguments);
				this.syncScroll();
			};
		}),

		/**
		* Jumps to the top of this list.
		*
		* @method
		* @public
		*/
		jumpToTop: function() {
			this.$.scroller.setScrollTop(0);
		},

		/**
		* Blocks the feedback sound played from the header/footer
		* components of this list by setting the `inEvent.preventSound` property to `true`.
		*
		* @private
		*/
		preventSound: function(inSender, inEvent) {
			inEvent.preventSound = true;
		},

		/**
		* Plays the touch feedback sound when this list is tapped.
		*
		* @param {enyo.Component} inSender - The [enyo.Component]{@link http://enyojs.com/docs/latest/#/kind/enyo.Component} that most recently
		* propagated the `event`.
		* @param {Object} inEvent - An `object` containing the
		* event information.
		* @public
		*/
		playFeedback: function(inSender, inEvent) {
			if (!inEvent || inEvent && !inEvent.preventSound && inEvent.originator.kind !== "g.Scroller") {
				g.playFeedback("touch");
				if (inEvent) {
					inEvent.preventSound = true;
				}
			}
		},

		/**
		* @private
		*/
		scrollTo: function(inY) {
			this.$.scroller.scrollTo(0, inY);
		},

		/**
		* @private
		*/
		getScrollTop: function() {
			return this.$.scroller.getScrollTop();
		},

		/**
		* @private
		*/
		setScrollTop: function(inValue) {
			return this.$.scroller.setScrollTop(inValue);
		},

		/**
		* @private
		*/
		scrollToPage: function(inPage) {
			this.$.scroller.scrollTo(0, inPage * this.$.scroller.getClientHeight());
		},

		/**
		* Stores the default state of the scroller.
		*
		* @private
		*/
		storePreviousScrollerSates: function() {
			this.defaultStateV =  this.defaultStateV || {};
			this.defaultStateH =  this.defaultStateH || {};
			this.defaultStateV = this.$.scroller.getVertical();
			this.defaultStateH = this.$.scroller.getHorizontal();
		},

		/**
		* Disables the scroller when the list elements are animating.
		*
		* @private
		*/
		disableScrolling: function(inSender, inEvent) {
			this.$.scroller.setVertical("hidden");
			this.$.scroller.setHorizontal("hidden");

			// prevent propagation
			return true;
		},

		/**
		* Enables the scroller in its default state once the list elements
		* have stopped animating.
		*
		* @private
		*/
		enableScrolling: function(inSender, inEvent) {
			this.$.scroller.setVertical(this.defaultStateV);
			this.$.scroller.setHorizontal(this.defaultStateH);

			// prevent propagation
			return true;
		},

	 	/**
		* Retreives the index characater to scroll to when an event
		* from {@link g.WheelSectionListController} is received.
		*
		* @private
		*/
		wheelChange: function(inSender, inEvent) {
			this.scrollToChar(inEvent.scrollTo);
			return true;
		},

		/**
		* Sets the scroll position based on list item content.
		*
		* @private
		*/
		scrollToChar: function(inChar) {
			var len = this.collection ? this.collection.length: 0;

			if (inChar.match(/^[A-Z]/)) {
				for (var i = 0; i < len; i++) {
					if ((this.data().at(i).attributes.title)[0] >= inChar) {
						this.$.scroller.setScrollTop((i+1)*this.childSize);
						break;
					}
				}
			} else if (inChar == "#") {
				this.$.scroller.setScrollTop(0);
			} else if (inChar == " ") {
				this.$.scroller.setScrollTop((len - 1)*this.childSize);
			} else {
				// FIXME : Not implemented for A-Z
			}

			return true;
		},

	 	/**
		* Traps the Enyo-generated [onScroll]{@link http://enyojs.com/docs/latest/#/kind/enyo.Scroller:onScroll}
		* event to let the delegate handle it.
		*
		* @method
		* @private
		*/
		didScroll: enyo.inherit(function(sup) {
			return function(inSender, inEvent) {
				sup.apply(this, arguments);
				return false;
			};
		}),

	 	/**
		* Syncs the scroller and makes the scroller bubble the `onScrollSync` event.
		*
		* @private
		*/
		didRender: function() {
			this.$.scroller.didRender();
		},

		/**
		* @private
		*/
		syncScroll: function() {
			this.$.scroller.sendScrollSyncEvent();
		},

		/**
		* Sets the scroll position when an event from {link g.ScrollerKnob} is received.
		*
		* @private
		*/
		knobDrag: function(inSender, inEvent) {
			if (this.cards) {
				this.scrollTo(inEvent.scrollTo);
			} else {
				this.setScrollTop(inEvent.scrollTo);
			}
			return true;
		},

		/**
		* @private
		*/
		roundInt: function(value, increment) {

			var remain = value % increment;
			var roundvalue = increment / 2;
			var result;

			// round up
			if (remain >= roundvalue) {
				result = value - remain;
				result += increment;

			// round down
			} else {
				result = value - remain;
			}

			return result;
		},

		/**
		* @private
		*/
		roundCardList: function() {
			if (this.cards && !this._knobControlMode) {
				var scrollBounds = this.$.scroller.getScrollBounds();
				var hackHeight = (this.itemHeight - 1);
				var divisible = scrollBounds.top % this.itemHeight;
				if (scrollBounds.top >= (scrollBounds.maxTop - this.itemHeight)) {
					this._overScrollBottomCard = true;
				} else {
					this._overScrollBottomCard = false;
				}
				if ((Math.abs(divisible) < 1) || (Math.abs(divisible - hackHeight) < 1)) {
					var itemSelected = (Math.abs(divisible - hackHeight) < 1) ? (scrollBounds.top + 1) : scrollBounds.top;
					var itemIndex = Math.round(itemSelected / this.itemHeight);
					this.fireChangeEvent(itemIndex);
				} else {
					var roundedInt = this.roundInt(this.getScrollTop(), this.itemHeight);
					this.scrollTo(roundedInt);
				}
			}
		},

		/**
		* @private
		*/
		scrollStop: function(inSender, inEvent) {
			this.roundCardList();
		},

		/**
		* @private
		*/
		getPositionToScroll: function(value, increment, isNext) {
			var remain = value % increment,
				result;

			if (isNext) {
				result = value - remain + increment;
			} else {
				result = value - remain;
			}

			return result;
		},

		/**
		* Scrolls to the next item in this list.
		*
		* @private
		*/
		cardNext: function() {
			var maxtop = (this.collection.length - 1) * this.itemHeight,
				roundedInt = this.getPositionToScroll(Math.min(this.getScrollTop(), maxtop), this.itemHeight, true);
			this.scrollTo(roundedInt);
		},

		/**
		* Scrolls to the previous item in this list.
		*
		* @private
		*/
		cardPrev: function() {
			var roundedInt = this.getPositionToScroll(Math.max(this.getScrollTop(), 0), this.itemHeight, false);
			this.scrollTo(roundedInt);
		},

		/**
		* Handling the flick event to prevent multiple cards and explicitly calling cardNext() and cardPrev() APIs
		*
		* @private
		*/
		flickHandler: function(inSender, inEvent) {
			if (this.singleFlick) {
				if (Math.abs(inEvent.yVelocity) > Math.abs(inEvent.xVelocity)) {
					if (inEvent.yVelocity > 0) {
						this.cardPrev();
					} else {
						this.cardNext();
					}
					return true;
				}
			}
		},

		/**
		* @private
		*/
		knobControlBegin: function(inSender, inEvent) {
			this._knobControlMode = true;
		},

		/**
		* @private
		*/
		knobControlEnd: function(inSender, inEvent) {
			this._knobControlMode = false;
			this.roundCardList();
		},

		/**
		* @private
		*/
		visibilityChanged: function() {
			if (this.showing && enyo.hidden /*when the app is suspending*/) {
				this.$.scroller.getStrategy().$.scrollMath.dragging = false;
				this._knobControlMode = false;
				this.roundCardList();
			}
		},

		/**
		* Fires the `onChange` event.
		*
		* @fires g.DataList#onChange
		* @private
		*/
		fireChangeEvent: function(inItemIndex) {
			this.doChange({
				name: this.name,
				index: inItemIndex
			});
		}
	});

})(enyo, g, this);

/**
* Overload the vertical delegate to scroll with due regard to headerComponent of g.DataList.
*
* @private
*/
(function (enyo, g) {
	var p = g.DataList.delegates.vertical = enyo.clone(enyo.DataList.delegates.vertical);
	enyo.kind.extendMethods(p, {
		/**
		* Recalculates the buffer size based on the current metrics for the given list. This
		* may not be completely accurate until the final page is scrolled into view.
		*
		* @private
		*/
		adjustBuffer: function (list) {
			var pc = this.pageCount(list),
				ds = this.defaultPageSize(list),
				bs = 0, sp = list.psizeProp, ss = list.ssizeProp,
				n = list.$.buffer.node || list.$.buffer.hasNode(), p,
				rest = list.collection.length % list.controlsPerPage,
				itemHeight = list.fixedChildSize || list.childSize || 100;
			if (n) {
				if (pc !== 0) {
					for (var i=0; i<pc; ++i) {
						p = list.metrics.pages[i];
						bs += (i === pc - 1 && rest > 0 && (list._modelChanged || !(p && p[sp]))) ? itemHeight * rest : (p && p[sp]) || ds;
					}
				}
				list._modelChanged = false;
				list.bufferSize = bs;
				n.style[sp] = bs + 'px';
				n.style[ss] = this[ss](list) + 'px';
				list.$.scroller.remeasure();
			}
		},

		/**
		* @private
		*/
		setScrollThreshold: function (list) {
			var threshold = list.scrollThreshold || (list.scrollThreshold={}),
				metrics   = list.metrics.pages,
				pos       = this.pagesByPosition(list),
				firstIdx  = pos.firstPage.index,
				lastIdx   = pos.lastPage.index,
				count     = this.pageCount(list)-1,
				lowerProp = list.lowerProp,
				upperProp = list.upperProp,
				fn        = upperProp == 'top'? this.height: this.width,
				headerNode = (list.$.header ? list.$.header.hasNode() : null),
				headerSize = (headerNode ? headerNode.clientHeight : 0);
			// now to update the properties the scroller will use to determine
			// when we need to be notified of position changes requiring paging
			if (firstIdx === 0) {
				threshold[upperProp] = undefined;
			} else {
				threshold[upperProp] = metrics[firstIdx][upperProp] + headerSize;
			}
			if (lastIdx >= count) {
				threshold[lowerProp] = undefined;
			} else {
				threshold[lowerProp] = (metrics[lastIdx][lowerProp] - fn.call(this, list) + headerSize) ;
			}
			if (list.usingScrollListener) {
				list.$.scroller.setScrollThreshold(threshold);
			}
		},

		/**
		* Determines which two pages to generate, based on the given
		* target scroll position.
		*
		* @private
		*/
		assignPageIndices: function (list, targetPos) {
			var index1, index2, bias,
				pc = this.pageCount(list),
				last = Math.max(0, pc - 1),
				currentPos = this.getScrollPosition(list),
				headerNode = (list.$.header ? list.$.header.hasNode() : null),
				headerSize = (headerNode ? headerNode.clientHeight : 0);

			// If no target position was specified, use the current position
			if (typeof targetPos == 'undefined') {
				targetPos = currentPos;
			}

			// Make sure the target position is in-bounds
			targetPos = Math.max(0, Math.min(targetPos, list.bufferSize) - headerSize);

			// First, we find the target page (the one that covers the target position)
			index1 = Math.floor(targetPos / this.defaultPageSize(list));
			index1 = Math.min(index1, last);

			// Our list always generates two pages worth of content, so -- now that we have
			// our target page -- we need to pick either the preceding page or the following
			// page to generate as well. To help us decide, we first determine how our
			// target position relates to our current position. If we know which direction
			// we're moving in, it's generally better to render the page that lies between
			// our current position and our target position, in case we are about to scroll
			// "lazily" to an element near the edge of our target page. If we don't have any
			// information to work with, we arbitrarily favor the following page.
			bias = (targetPos > currentPos) ? -1 : 1;

			// Now we know everything we need to choose our second page...
			index2 =
				// If our target page is the first page (index == 0), there is no preceding
				// page -- so we choose the following page (index == 1). Note that our
				// our target page will always be (index == 0) if the list is empty or has
				// only one page worth of content. Picking (index == 1) for our second page
				// in these cases is fine, though the page won't contain any elements.
				(index1 === 0) ? 1 :
				// If target page is the last page, there is no following page -- so we choose
				// the preceding page.
				(index1 === last) ? index1 - 1 :
				// In all other cases, we pick a page using our previously determined bias.
				index1 + bias;

			list.$.page1.index = index1;
			list.$.page2.index = index2;
		}
	}, true);
})(enyo, g);
