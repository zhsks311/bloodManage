(function (enyo, g, scope) {
	/**
	* _g.DataFlipCardList_ is an [enyo.DataList]{@link http://enyojs.com/docs/latest/#/kind/enyo.DataList}
	* in Garnet style. It uses [g.Scroller]{@link g.Scroller} as its default scroller.
	*
	* @class g.DataFlipCardList
	* @extends enyo.DataList
	* @public
	*/
	enyo.kind(
		/** @lends g.DataFlipCardList.prototype */ {

		/**
		* @private
		*/
		name: "g.DataFlipCardList",

		/**
		* @private
		*/
		kind: "enyo.DataList",

		/**
		* @private
		*/
		published: {
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
			* @private
			*/
			singleFlick : false
		},

		/**
		* @private
		*/
		noDefer: true,

		/**
		* @private
		*/
		handlers: {
			ondragstart: "scrollStart",
			onScrollStop: "scrollStop",
			onKnobControlBegin: "scrollStart",
			onKnobControlEnd: "scrollStop",
			onKnobDrag: "knobDrag",
			ontap: "playFeedback",
			onStartPanelAnimation: "resetFlipList",
			onPopupRefresh: "resetFlipList",
			ondown: "down",
			onflick: "flickHandler"
		},

		/**
		* @private
		*/
		events: {
			onChange: "",
			onSyncSingleFlick: ""
		},

		/**
		* Performance can be improved if a [list]{@link http://enyojs.com/docs/latest/#/kind/enyo.DataList} needs
		* not to guess the size of its items. In case where all items have a fixed height or width
		* (depending on the orientation of the [list]{@link http://enyojs.com/docs/latest/#/kind/enyo.DataList})
		* you may explicitly define the height or width value for the [list]{@link http://enyojs.com/docs/latest/#/kind/enyo.DataList} to use
		* and bypass much of its guesswork.
		* This value is a number that will be interpreted in pixels and applied to the primary size
		* depending on the [orientation]{@link http://enyojs.com/docs/latest/#/kind/enyo.DataList:orientation} property:
		* if `"vertical"` the value is interpreted as the _height_ and if `"horizontal"`, the value is interpreted as the _width_.
		* Note: This value is not applied to the children via the CSS of [list]{@link http://enyojs.com/docs/latest/#/kind/enyo.DataList}.
		*
		* @type {Number}
		* @default 320
		* @private
		*/
		fixedChildSize: 320,

		/**
		* All of the CSS class(es) related to this class.
		*
		* @private
		*/
		classes: "g-data-list",

		/**
		* The value of the current index.
		*
		* @private
		*/
		_currentIndex: 0,

		/**
		* All the animating elements in this list shall have the maximum z-Index value.
		* This property is the maximum z value an animating element should have.
		*
		* @private
		*/
		_focusZIndex: 0,

		/**
		* This is typically handled automatically, but some platforms may benefit from having a
		* larger or smaller value for this property. If there is a number here, it will be multiplied by the
		* available viewport size (depending on orientation) to determine the minimum page size. The
		* page size is directly related to the number of [controls]{@link http://enyojs.com/docs/latest/#/kind/enyo.Control}
		* that are generated at any given time (and that subsequently need updating) whenever paging occurs.
		* This number may be any rational number greater than `1.2`.
		*
		* @type {Number}
		* @default 1.2
		* @private
		*/
		pageSizeMultiplier: 6,

		/**
		* Margin of page threshold. If set to 2, then page threshold value is set to two elements
		* before the end/top element. This enables sparing time for triggering paging before reaching the page end.
		*
		* @private
		*/
		PageBoundMarginePerItem: 2,


		/**
		* This holds the data, such as `index` ,`zvalue`, of the lastly focused element.
		* This property is required as the z value of focus index is set to max (_focusZIndex+1).
		*
		* @private
		*/
		_lastFocusElement: {
			index: 0,
			zvalue: "",
			applied: true
		},

		/**
		* Stores the original value of the `selection` property.
		*
		* @private
		*/
		_listSelection: false,

		/**
		* Indicates whether the scroller has jumped to a certain index using the
		* [scrollToIndex()]{@link g.DataFlipCardList#scrollToIndex} method.
		*
		* @private
		*/
		_scrollJumping: undefined,

		/**
		* Indicates whether the onchange event has been triggered already or not.
		*
		* @private
		*/
		_onChangeTriggered: false,

		/**
		* Stores the argument of the [scrollToIndex()]{g.DataFlipCardList#scrollToIndext} method call.
		*
		* @private
		*/
		_scrollToIndex: -1,

		/**
		* Stores the index of the latest [flipNext()]{@link g.DataFlipCardList#flipNext} method call.
		*
		* @private
		*/
		_lastFlipNextIndex: -1,

		/**
		* Stores the index of the latest [flipPrev()]{@link g.DataFlipCardList#flipPrev} method call.
		*
		* @private
		*/
		_lastFlipPrevIndex: Infinity,

		/**
		* @private
		*/
		itemHeight: g.height,

		/**
		* @method
		* @private
		*/
		create: enyo.inherit(function(sup) {
			return function() {
				this.containerOptions = {
					name: "scroller",
					kind: "g.Scroller",
					strategyKind: "g.FlipScrollStrategy",
					horizontal: "hidden",
					vertical: "scroll",
					canGenerate: false,
					preventDragPropagation: false,
					classes: "enyo-fit enyo-data-list-scroller",
					components: [{
						name: "active",
						classes: "active",
						components: [{
							name: "page1",
							classes: "page page1"
						}, {
							name: "page2",
							classes: "page page2"
						}, {
							name: "buffer",
							classes: "buffer"
						}]
					}]
				};
				this.controlsPerPage = this.controlsPerPage || 6;
				this._listSelection = this.selection;
				sup.apply(this, arguments);
				this.waterfallDown('onSyncSingleFlick', {syncSingleFlick: this.singleFlick, scroller: this.$.scroller});
			};
		}),

		/**
		* Triggered when the scrolling stops.
		*
		* @private
		*/
		scrollStop: function(inSender, inEvent) {
			if (this._flipReset) {
				this._flipReset = false;
			}
			var topVal = this.$.scroller.getScrollBounds().top;

			this._scrollToIndex = -1;
			var divisible = topVal % this.itemHeight;

			if ((Math.abs(divisible) < 1) || (Math.abs(divisible - this.itemHeight) < 1)) {
				var itemSelected = (Math.abs(divisible - this.itemHeight) < 1) ? (topVal + 1) : topVal;
				var itemIndex = Math.round(itemSelected / this.itemHeight);
				this._lastFocusElement.applied && !itemIndex && this.flipEnd(0);
				if (this._lastFocusElement.applied && (itemIndex == (this.collection.length - 1))) {
					this.flipEnd(itemIndex);
				}
				if (this._scrollJumping) {
					this._scrollJumping = false;
					this.delegate.refresh(this);
					this.flipEnd(itemIndex);
				}
				if (!this._onChangeTriggered) {
					this.doChange({
						name: this.name,
						index: itemIndex
					});
				}
			} else {
				var roundedInt = this.roundInt(this.$.scroller.getScrollTop(), this.itemHeight);
				this.$.scroller.scrollTo(0, roundedInt);
			}
			this._onChangeTriggered = false;
		},

		/**
		* Prevents other events like flicking and swiping while list scrolling is in action.
		*
		* @private
		*/
		down: function(inSender, inEvent) {
			var roundedInt, itemIndex;
			if (this.$.scroller.$.strategy.isScrolling()) {
				roundedInt = this.roundInt(this.$.scroller.getScrollTop(), this.itemHeight);
				this.$.scroller.setScrollTop(roundedInt);
				itemIndex = this.$.scroller.getScrollTop() / this.itemHeight;
				this.flipEnd(itemIndex);
				this.doChange({
					name: this.name,
					index: itemIndex
				});
				this._onChangeTriggered = true;
			}
		},

		/**
		* Resets the z-index of the lastly focused element to its original value and
		* also resets the overflow style of the frontchild to hidden.
		*
		* @private
		*/
		_resetOverflow: function() {
			var y;
			if (!this._lastFocusElement.applied) {
				y = this.childForIndex(this._lastFocusElement.index);
				if (y) {
					y.addStyles(this._lastFocusElement.zvalue);
					y.$.frontchild.applyStyle("overflow", "hidden");
				}
				this._lastFocusElement.applied = true;
			}
		},

		/**
		* Resets this FlipCardList on the AppResume event.
		*
		* @private
		*/
		resetFlipList: function(inSender, inEvent) {
			if ((inEvent.effect === "depth-transition" && inEvent.direction === "next") || inEvent.type ==="onPopupRefresh") {
				this.scrollToIndex(0);
			}
		},
		/**
		* Sets the scroll position when an event from {link g.ScrollerKnob} is received.
		*
		* @private
		*/
		knobDrag: function(inSender, inEvent) {
			this.$.scroller.setScrollTop(inEvent.scrollTo);
			return true;
		},

		/**
		* Plays the touch feedback sound when this list is tapped.
		*
		* @param {enyo.Component} inSender - The [enyo.Component]{@link http://enyojs.com/docs/latest/#/kind/enyo.Component} that most recently propagated the `event`.
		* @param {Object} inEvent - An object containing event information.
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
		* Resets the last value holders for the [flipNext()]{@link g.DataFlipCardList#flipNext}
		* method and [flipPrev()]{@link g.DataFlipCardList#flipPrev} method.
		*
		* @private
		*/
		scrollStart: function(inSender, inEvent) {
			this._lastFlipNextIndex = -1;
			this._lastFlipPrevIndex = Infinity;

		},

		/**
		* Handling the flick event to prevent multiple flips and explicitly calling flipNext() and flipPrev() APIs
		*
		* @private
		*/
		flickHandler: function(inSender, inEvent) {
			if (this.singleFlick) {
				if ((inEvent.xVelocity > -1) && (inEvent.xVelocity < 1)) {
					if (inEvent.yVelocity > 0) {
						this.flipPrev();
					} else {
						this.flipNext();
					}
					return true;
				}
			}
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
		* Performs the actual flipping animation based on the
		* scroll top value.
		*
		* @private
		*/
		flip: function(inSender, inEvent) {
			// To prevent selection while animating
			this.selection = false;
			var currTop = inEvent.scrollBounds.top, yDir = inEvent.scrollBounds.yDir;
			var style, flipCompletely;
			if (this._currentIndex === -1 || !this.childForIndex(this._currentIndex) || this.childForIndex(this._currentIndex).$.child === undefined) {
				flipCompletely = false;
			} else {
				style = this.childForIndex(this._currentIndex).$.child.getStyle();
				flipCompletely = style.indexOf("0deg") != -1 || style.indexOf("180deg") != -1;
			}
			// Prevent animations on reset
			// Called first time with top 0 so no action to take
			var maxtop = (this.collection.length - 1) * this.fixedChildSize;
			if (((currTop === 0) && (yDir === 0)) || ((maxtop === currTop) && ((yDir === 1)||(yDir === 0))) && flipCompletely) {
				return;
			}

			if (this._currentIndex !== this.collection.length) {
				this._resetOverflow();
			}
			// Variable use to check if we have to increse focusZindex to next level
			var v, w, y, z,
				setZindex = false;
			var listItem = this.childForIndex(this._currentIndex);
			// Check if need to increase/decrease current focus index
			if ((yDir === 1) && ((currTop - ((this._currentIndex + 1) * this.fixedChildSize)) >= 0)) {
				listItem && listItem.$.child.applyStyle("-webkit-transform", "rotateX(180deg)");
				this._currentIndex++;
				setZindex = true;
			} else if ((yDir === -1) && ((((this._currentIndex + 1) * this.fixedChildSize) - currTop) >= this.fixedChildSize)) {
				if (listItem) {
					listItem.$.child.applyStyle("-webkit-transform", "rotateX(0)");
				}
				this._currentIndex--;
				setZindex = true;
			}

			y = this.childForIndex(this._currentIndex);
			w = this.childForIndex(this._currentIndex + 1);
			v = this.childForIndex(this._currentIndex - 1);

			if (v && y && yDir === 1) {
				v.$.backchild.addRemoveClass("selected", this.isSelected(y.model));
			}
			if (y && w && yDir === -1) {
				y.$.backchild.addRemoveClass("selected", this.isSelected(w.model));
			}
			if (y !== undefined) {
				if (setZindex) {
					y.applyStyle("z-index", this._focusZIndex++);
				}

				z = ((currTop - (this.fixedChildSize * this._currentIndex)) * 180) / (this.fixedChildSize);
				if ((z !== 0)&&(!this._flipReset)) {
					y.$.child.applyStyle("-webkit-transform", "rotateX(" + z + "deg)");
				}
			}
		},

		/**
		* Triggered as elements in this list gets scrolled.
		*
		* @private
		*/
		didScroll: function(inSender, inEvent) {
			if (this.hasRendered && this.collection) {
				if (this.heightNeedsUpdate || this.widthNeedsUpdate) {
					// Assign this here so that if for any reason it needs to
					// it can reset it
					this.heightNeedsUpdate = this.widthNeedsUpdate = false;
					this.refresh();
				}
				this.delegate.didScroll(this, inEvent);
			}
			// start element flip animations
			this.flip(inSender, inEvent);
			return false;
		},

		/**
		* Syncs the scroller and makes the scroller to bubble the `onScrollSync` event.
		*
		* @private
		*/
		didRender: function() {
			this.$.scroller.didRender();
		},

		/**
		* Creates the background object as the 0th object of list item.
		*
		* @private
		*/
		setBackground: function() {
			var comp, i, nb, bgbinding = [],
				c = this.components[0],
				arrayLength = this.finalBindingArr.length,
				active = this.$.active;
			if (!active.$.bgElem) {
				for (i = 0; i < arrayLength; i++) {
					nb = new enyo.Binding({
						from: c.bindings[i].from,
						to: this.finalBindingArr[i].to,
						transform: this.finalBindingArr[i].transform,
						oneWay: false
					});
					bgbinding.push(nb);
				}
				comp = this.$.active.createComponent({
					name: "bgElem",
					bindings: bgbinding
				}, {
					owner: this.$.active
				});
				comp.createComponent(c, {
					owner: comp
				});
			} else {
				comp = active.$.bgElem;
			}
			comp.set("model", this.collection.at(0));
			comp.addClass("g-data-flip-card-child-back-container");
			comp.render();
			// To avoid border box replacements of background
			comp.applyStyle("border");
		},

		/**
		* Called when this list stops scrolling and an element is in focus.
		*
		* @private
		*/
		flipEnd: function(itemIndex) {
			var x, len;
			len = this.collection ? this.collection.length : 0;
			if (itemIndex >= 0 && itemIndex < len) {
				if (this._currentIndex != itemIndex) {
					this._currentIndex = itemIndex;
					this.delegate._arrangeZindex(this,this.pages[0], this.pages[1]);
				}
				x = this.childForIndex(itemIndex);
				this.selection = this._listSelection;
				// Make focus element full
				x.$.frontchild.applyStyle("overflow", "visible");
				this._lastFocusElement.index = itemIndex;
				// Make focus elements z index to max
				this._lastFocusElement.zvalue = x.getStyle();
				this._lastFocusElement.applied = false;
			}
		},

		/**
		* Gives the index of the top element in the stack.
		*
		* @private
		*/
		_getTopIndex: function() {
			var index = this.$.scroller.getScrollTop() / this.fixedChildSize,
				modulas = index % 1, deltaTollerance = 0.01;
			index += ((1 - modulas < deltaTollerance) ? (1 - modulas) : ( - modulas));
			return index;
		},

		/**
		* Gives the current Index of element while elements are animating
		*
		* @public
		*/
		getCurrentIndex: function() {
			this.$.scroller.stop(true);
			var topVal = this.$.scroller.getScrollBounds().top;
			var divisible = topVal % this.itemHeight;
			var itemSelected = (Math.abs(divisible - this.itemHeight) < 1) ? (topVal + 1) : topVal;
			return Math.round(itemSelected / this.itemHeight);
		},

		/**
		* Scrolls the list to the given index.
		*
		* @param  {Number} index - Index of the card to which this list shall scroll to.
		* @public
		*/
		scrollToIndex: function(idx) {
			if (this.hasRendered && this.collection) {
				this._lastFlipNextIndex = -1;
				this._lastFlipPrevIndex = Infinity;
				var len = this.collection ? this.collection.length : 0;
				if (idx >= 0 && idx < len) {
					this._scrollToIndex = idx;
					if (this.get('absoluteShowing')) {
						this.delegate.scrollToIndex(this, idx);
					} else {
						this._addToShowingQueue('scrollToIndex', function() {
							this.delegate.scrollToIndex(this, idx);
						});
					}
				}
			}
		},

		/**
		* Scrolls to the next item in this list with flipping animation.
		*
		* @private
		*/
		flipNext: function() {
			var topvalue, topIndex = this._getTopIndex();
			if (this.$.scroller.hasClass("stretched") || this.$.scroller.hasClass("compressed")) {
				return;
			}
			if (this.hasRendered && this.collection) {
				this._lastFlipPrevIndex = Infinity;
				if (this._lastFlipNextIndex >= (topIndex + 1)) {
					topvalue = (this._lastFlipNextIndex + 1) * this.fixedChildSize;
					this._lastFlipNextIndex = this._lastFlipNextIndex + 1;
				} else {
					topvalue = (topIndex + 1) * this.fixedChildSize;
					this._lastFlipNextIndex = (topIndex < (this.collection.length - 1)) ? (topIndex + 1) : -1;
				}
				this.$.scroller.scrollTo(0, topvalue);
			}
		},

		/**
		* Scrolls to the previous item in this list with flipping animation.
		*
		* @private
		*/
		flipPrev: function() {
			var index, topvalue;
			if (this.$.scroller.hasClass("stretched") || this.$.scroller.hasClass("compressed")) {
				return;
			}
			if (this.hasRendered && this.collection) {
				this._lastFlipNextIndex = -1;
				index = Math.max(0, Math.round((this.$.scroller.getScrollTop() / this.fixedChildSize) - 1));
				if (this._lastFlipPrevIndex <= index) {
					topvalue = (this._lastFlipPrevIndex - 1) * this.fixedChildSize;
					this._lastFlipPrevIndex = ((this._lastFlipPrevIndex - 1) === 0) ? Infinity: (this._lastFlipPrevIndex - 1);
				} else {
					topvalue = index * this.fixedChildSize;
					this._lastFlipPrevIndex = (index === 0) ? Infinity : index;
				}
				this.$.scroller.scrollTo(0, topvalue);
			}
		}

	});

	/**
	* Overridden the delegate strategy to incorporate measurements for our scrollers
	* when they are visible.
	*
	* @private
	*/
	(function(enyo, g) {
		var p = g.DataFlipCardList.delegates.vertical = enyo.clone(enyo.DataList.delegates.vertical);
		enyo.kind.extendMethods(p, {
			/**
			* Sets the Scroller bounds.
			*
			* @private
			*/
			_setScrollerBounds: function(list) {
				var scroller, currentScrollTop, maxScrollTop;
				scroller = list.$.scroller;
				currentScrollTop = list.$.scroller.getScrollTop();
				maxScrollTop = list.collection.length * list.fixedChildSize;
				scroller.$.strategy.setScrollHeight(maxScrollTop);
				scroller.$.strategy.setScrollWidth(list.fixedChildSize);

				if (currentScrollTop > maxScrollTop) {
					list.$.scroller.setScrollTop(maxScrollTop);
				}
			},

			/**
			* Resets the page content and the pages to their original positions.
			*
			* @private
			*/
			reset: function(list) {
				var scroller = list.$.scroller,
					strategy = scroller.$.strategy;
				list._lastFocusElement.applied = true;
				list._flipReset =  true;
				list._currentIndex = 0;
				// Go ahead and reset the page content and the pages to their original positions
				this._setScrollerBounds(list);
				for (var i = 0, p;
					(p = list.pages[i]); ++i) {
					this.generatePage(list, p, i, list.pages[i - 1]);
				}
				// adjust page positions
				this.adjustPagePositions(list);
				list._flipReset =  false;
				// now update the buffer
				this.adjustBuffer(list);
				list.hasReset = true;
				// resetting the scrollmath inorder to avoid flip animation when it is resetting
				// scrollMath.reset() will reset the scroller to 0, 0 & update the thumb.
				strategy.$.scrollMath.reset();
				list.setBackground();
				// calling flipEnd(0) to make 1st list Item fully visible since fireChangeEvent() is not called for 1st element on load in dataList
				list.flipEnd(0);
				list.scrollToIndex(0);
			},

			/**
			* @private
			*/
			refresh: function(list) {
				this._setScrollerBounds(list);
				if (list._scrollToIndex !== -1) {
					list._currentIndex = list._scrollToIndex;
					list._scrollToIndex = -1;
				} else {
					list._currentIndex =  list._getTopIndex();
				}

				list._lastFocusElement.applied = true;
				list._flipReset =  true;
				if (!list.hasReset) {
					return this.reset(list);
				}
				var pageCount = Math.max(this.pageCount(list) - 1, 0),
					firstIndex = list.$.page1.index,
					secondIndex = list.$.page2.index;
				if (firstIndex > pageCount) {
					firstIndex = pageCount;
					secondIndex = (firstIndex > 0) ? firstIndex - 1 : firstIndex + 1;
				}
				if (secondIndex > pageCount) {
					if ((firstIndex + 1) > pageCount && (firstIndex - 1) >= 0) {
						secondIndex = firstIndex - 1;
					} else {
						secondIndex = firstIndex + 1;
					}
				}
				list.$.page1.index = firstIndex;
				list.$.page2.index = secondIndex;
				// update according to their current indices
				for (var i = 0, p;
					(p = list.pages[i]); ++i) {
					this.generatePage(list, p, p.index, list.pages[i - 1]);
				}
				// adjust their positions in case they've changed at all
				this.adjustPagePositions(list);
				list._flipReset =  false;
				// to handle the case of deleting the last element from collection and updating
				if (list.collection.length === list._currentIndex) {
					list._currentIndex--;
					list.scrollToIndex(list._currentIndex);
				}
				list.flipEnd(Math.max(0, list._currentIndex));
				// now update the buffer
				this.adjustBuffer(list);
				list.setBackground();
			},

			/**
			* Adjusts page position.
			*
			* @private
			*/
			adjustPagePositions: function(list) {
				for (var i = 0, p;
					(p = list.pages[i]); ++i) {
					var pi = p.index,
						cp = this.pagePosition(list, p.index),
						mx = list.metrics.pages[pi] || (list.metrics.pages[pi] = {}),
						pp = list.posProp,
						up = list.upperProp,
						lp = list.lowerProp,
						sp = list.psizeProp;
					p.node.style[pp] = 0 + "px";
					p[up] = mx[up] = cp;
					p[lp] = mx[lp] = (mx[sp] + cp);
				}
				this.setScrollThreshold(list);
			},

			/**
			* Calls the [generatePage()]{@link g.DataFlipCardList#generatePage} method if required.
			*
			* @private
			*/
			scrollHandler: function(list, bounds) {
				var last = this.pageCount(list) - 1,
					pos = this.pagesByPosition(list);
				if ((bounds.xDir === 1 || bounds.yDir === 1) && pos.lastPage.index !== (last)) {
					list._lastFocusElement.applied = true;
					list._flipReset = true;
					this.generatePage(list, pos.firstPage, pos.lastPage.index + 1, pos.lastPage);
					this.adjustPagePositions(list);
					this.adjustBuffer(list);
					list._flipReset = false;
					// Note that the reference to the page positions has been udpated by
					// another method so we trust the actual pages
					list.triggerEvent("paging", {
						start: pos.firstPage.start,
						end: pos.lastPage.end,
						action: "scroll"
					});
				} else if ((bounds.xDir === -1 || bounds.yDir === -1) && pos.firstPage.index !== 0) {
					list._lastFocusElement.applied = true;
					list._flipReset = true;
					this.generatePage(list, pos.lastPage, pos.firstPage.index - 1, pos.firstPage);
					this.adjustPagePositions(list);
					list._flipReset = false;
					// Note that the reference to the page positions has been udpated by
					// another method so we trust the actual pages
					list.triggerEvent("paging", {
						start: pos.firstPage.start,
						end: pos.lastPage.end,
						action: "scroll"
					});
				}
			},

			/**
			* Overridden to set scrollbound threshold to optimize it for DataFlipCardList.
			*
			* @private
			*/
			setScrollThreshold: function(list) {
				var threshold = list.scrollThreshold || (list.scrollThreshold = {}),
					metrics = list.metrics.pages,
					pos = this.pagesByPosition(list),
					firstIdx = pos.firstPage.index,
					lastIdx = pos.lastPage.index,
					count = this.pageCount(list) - 1,
					lowerProp = list.lowerProp,
					upperProp = list.upperProp,
					fn = upperProp == "top" ? this.height : this.width;
				// Now to update the properties the scroller will use to determine
				// when we need to be notified of position changes requiring paging
				if (firstIdx === 0) {
					threshold[upperProp] = undefined;
				} else {
					threshold[upperProp] = (metrics[firstIdx][upperProp] + this.childSize(list) * list.PageBoundMarginePerItem);
				}
				if (lastIdx >= count) {
					threshold[lowerProp] = undefined;
				} else {
					threshold[lowerProp] = (metrics[lastIdx][lowerProp] - fn(list) - this.childSize(list) * list.PageBoundMarginePerItem);
				}
				if (list.usingScrollListener) {
					list.$.scroller.setScrollThreshold(threshold);
				}
			},

			/**
			* Overridden to give virtual page height.
			*
			* @private
			*/
			pageHeight: function(list, page) {
				var h = (page.end - page.start + 1) * list.fixedChildSize;
				var m = list.metrics.pages[page.index];
				var len = list.collection ? list.collection.length : 0;
				if (h === 0 && len && page.node.children.length) {
					list.heightNeedsUpdate = true;
					// attempt to reuse the last known height for this page
					h = m ? m.height : 0;
				}
				return h;
			},

			/**
			* Overriding models added because flip list item is not single item as data list item
			* Any flip list item is dependent on its previous and next item while models added
			*
			* @private
			*/
			modelsAdded: function (list, props) {
				// If the list has not already reset
				if (!list.hasReset) return this.reset(list);

				var cpp = this.controlsPerPage(list),
					end = Math.max(list.$.page1.start, list.$.page2.start) + cpp;

				if (props.index <= (end + 1)) this.refresh(list);
				else {
					// We still need to ensure that the metrics are updated so it knows it can scroll
					// past the boundaries of the current pages (potentially)
					this._setScrollerBounds(list);
					this.adjustBuffer(list);
					this.adjustPagePositions(list);
				}
			},

			/**
			* Overriding models Removed because flip list item is not single item as data list item
			* Any flip list item is dependent on its previous and next item while models removed
			*
			* @private
			*/
			modelsRemoved: function (list, props) {

				// If the list has not already reset
				if (!list.hasReset) return this.reset(list);

				var pg1 = list.$.page1,
					pg2 = list.$.page2,
					lastIdx = Math.max(pg1.end, pg2.end);

				// Props.models is removed modelList and the lowest index among removed models
				if (props.models.low <= (lastIdx + 1)) {
					this.refresh(list);
				}
			},

			/**
			* Arranges the z-index for element.
			*
			* @private
			*/
			_arrangeZindex: function(list, page, currentPage) {

				if (page&&currentPage) {

					// Total number of items in each page
					var i = 0,
						perPageItems = this.controlsPerPage(list),
						resetFocusZIndex = perPageItems * list.pages.length + 1,
						pos = {},
						alllistitems = [];
					// Find first page
					pos.firstPage = currentPage ? ((currentPage.start < page.start) ? currentPage : page) : page;
					// Find Last Page
					pos.lastPage = currentPage ? ((currentPage.start < page.start) ? page : currentPage) : undefined;

					if (pos.firstPage) {
						alllistitems = alllistitems.concat(pos.firstPage.children.slice(0, pos.firstPage.end - pos.firstPage.start + 1));
					}
					if (pos.lastPage) {
						alllistitems = alllistitems.concat(pos.lastPage.children.slice(0, pos.lastPage.end - pos.lastPage.start + 1));
					}

					if(!((list._currentIndex < pos.lastPage.end) && (list._currentIndex > pos.firstPage.start))) {
						if (!list._scrollJumping) {
							list._currentIndex = list._getTopIndex();
						}
					}

					// Arrange all element z index order
					var listItem,
						maxBeforeIndex = list._currentIndex - pos.firstPage.start,
						max = (perPageItems * list.pages.length) + maxBeforeIndex,
						pagelength = page.end - page.start + 1,
						pagechildlength = page.children.length;

					for (i = 0; i < alllistitems.length; ++i) {
						listItem = alllistitems[i];
						if (listItem) {
							listItem.flippedNext = false;
							listItem.flippedPrev = false;
							if (i < maxBeforeIndex) {
								//before
								listItem.applyStyle("z-index", i + 1);
								listItem.flippedNext = true;
								listItem.$.child.applyStyle("-webkit-transform", "rotateX(180deg)");
							} else {
								//after
								listItem.applyStyle("z-index", (max - i));
								listItem.$.child.applyStyle("-webkit-transform", "rotateX(0deg)");
							}
						}
					}

					if (pagelength < pagechildlength) {
						for (i = pagelength; i < pagechildlength; ++i) {
							listItem = page.children[i];
							if (listItem) {
								listItem.applyStyle("z-index", 0);
								listItem.$.child.applyStyle("-webkit-transform", "rotateX(0deg)");
								listItem.flippedNext = true;
								listItem.flippedPrev = true;
							}
						}
					}
					list._focusZIndex = resetFocusZIndex;
				}
			},

			/**
			* Assigns an index to the item nodes.
			*
			* @private
			*/
			_assignNodeIndex: function(list, page) {
				var i, listItem,
					len = list.collection.length,
					pageEnd = page.end;
				for (i = page.start; i <= pageEnd && i < len; ++i) {
					listItem = page.children[i - page.start];
					if (listItem.hasNode()) {
						listItem.node.index = listItem.node.index || {};
						listItem.node.index = listItem.index;
					}
				}
			},
			/**
			* Attempts to scroll this list to the given index.
			* Overridden to make scroll work on DataFlipCardList as
			* DataFlipCardList does not suppot DOM scroll.
			*
			* @param {enyo.DataList} list - The [list]{@link http://enyojs.com/docs/latest/#/kind/enyo.DataList} to perform this action on.
			* @param {Number} i - The index to scroll the list to.
			* @private
			*/
			scrollToIndex: function (list, i) {
				// first see if the child is already available to scroll to
				var c = this.childForIndex(list, i),
					j = i, p;
				list._scrollJumping = true;

				// but we also need the page so we can find its position
				p = this.pageForIndex(list, j);

				// if there is no page then the index is bad
				if (p < 0 || p > this.pageCount(list)) { return; }
				// if there isn't one, then we know we need to go ahead and
				// update, otherwise we should be able to use the scroller's
				// own methods to find it
				if (c) {
					//default enyo list does som scroll to move to perticulat item in list.
					//in case of DataFlipCardList we cant use DOM scroll so we need to scroll
					//as per UI requirement it should not aniamte in scrolltToIndex function
					//so we are putting element in focus using arrangeZindex function and fast scoll to function.
					var scroller = list.$.scroller,
					strategy = scroller.$.strategy;

					if (list._scrollToIndex !== -1) {
						list._currentIndex = list._scrollToIndex;
						list._scrollToIndex = -1;
					}
					this._arrangeZindex(list,list.pages[0],list.pages[1]);
					var scrollAfterRenderDelay  =  function() {
						strategy.$.scrollMath.fastSetvalue(0, (i * list.fixedChildSize));
					};

					//_arrangeZindex function set style propperty like rotation and z index on list items.
					// which is time taking process so we need to give delay equal to render delay
					// so that after style is applied we can update scroller and trigger firechage event
					// which will notify app that list is scroll to perticulat index.
					// this is done to avoid flicker.
					list.startJob('scrollAfterRenderDelay', scrollAfterRenderDelay, list.renderDelay);

				} else {
					// we do this to ensure we trigger the paging event when necessary
					this.resetToPosition(list, this.pagePosition(list, p));
					// now retry the original logic until we have this right
					enyo.asyncMethod(function () {
						list._flipReset = true;
						list.scrollToIndex(i);
					});
				}
			},

			didResize: function (list) {
				var prevCPP = list.controlsPerPage;
				var j = list._currentIndex;
				var perPage = this.controlsPerPage(list);
				if (j && ((j % perPage) === 0)) {
					j--;
				}
				var p = this.pageForIndex(list, j);

				list._updateBounds = true;
				this.updateBounds(list);
				// Need to update our controlsPerPage value immediately,
				// before any cached metrics are used
				this.controlsPerPage(list);
				if (prevCPP !== list.controlsPerPage) {
					// since we are now using a different number of controls per page,
					// we need to invalidate our cached page metrics
					list.metrics.pages = {};
				}
				this.resetToPosition(list, this.pagePosition(list, p));
			},

			/**
			* @private
			*/
			generate: function (list) {
				if (list._scrollToIndex !== -1) {
					list._currentIndex = list._scrollToIndex;
					list._scrollToIndex = -1;
				} else {
					list._currentIndex =  list._getTopIndex();
				}

				list._lastFocusElement.applied = true;
				list._flipReset =  true;
				for (var i=0, p; (p=list.pages[i]); ++i) {
					this.generatePage(list, p, p.index,list.pages[i - 1]);
				}
				this.adjustPagePositions(list);
				this.adjustBuffer(list);
				list._flipReset =  false;
			},

			/**
			* Overridden to add extra model for back copy.
			*
			* @private
			*/
			generatePage: function(list, page, index, currentPage) {
				list.selection = list._listSelection;
				// in case it hasn't been set we ensure it is marked correctly
				page.index = index;
				// the collection of data with records to use
				var data = list.collection,
					// the metrics for the entire list
					metrics = list.metrics,
					// controls per page
					perPage = this.controlsPerPage(list),
					// placeholder for the control we're going to update
					view, viewBack;

				// the first index for this generated page
				page.start = perPage * index;
				// the last index for this generated page
				page.end = Math.min((data.length - 1), (page.start + perPage) - 1);

				if (page.start < 0) {
					page.start = null;
				}
				if (page.end < 0) {
					page.end = null;
				}

				// if generating a control we need to use the correct page as the control parent
				list.controlParent = page;
				for (var i = page.start; i <= page.end && i < data.length; ++i) {

					view = (page.children[i - page.start] || list.createComponent({}));
					viewBack = page.children[i - page.start - 1];
					// disable notifications until all properties to be updated
					// have been
					view.teardownRender();
					view.stopNotifications();
					view.set("model", data.at(i));
					view.set("model1", data.at(i + 1));
					view.set("index", i);
					view.set("selected", list.isSelected(view.model));
					// Removing the last focussed element's overflow property on reset
					if (list._flipReset) {
						view.$.frontchild.applyStyle("overflow");
					}
					if (viewBack) {
						viewBack.$.backchild.addRemoveClass("selected", list.isSelected(view.model));
					}
					view.startNotifications();

					view.canGenerate = true;
				}
				// if there are any controls that need to be hidden we do that now
				for (i = (i - page.start); i < page.children.length; ++i) {
					view = page.children[i];
					view.teardownRender();
					view.canGenerate = false;
				}
				// update the entire page at once - this removes old nodes and updates
				// to the correct ones
				page.applyStyle("top", 0);

				this._arrangeZindex(list, page, currentPage);
				page.render();
				this._assignNodeIndex(list, page);
				// now to update the metrics
				metrics = metrics.pages[index] || (metrics.pages[index] = {});
				metrics.height = this.pageHeight(list, page);
				metrics.width = this.pageWidth(list, page);
				// update the childSize value now that we have measurements
				this.childSize(list);
			}

		}, true);
	})(enyo, g);

	/**
	* List item container for DataFlipCardList
	*
	* @private
	*/
	enyo.kind(
		/** @lends g.DataFlipCardListItemContainer.prototype */ {

		/**
		* @private
		*/
		name: "g.DataFlipCardListItemContainer",

		/**
		* @private
		*/
		_listItemsComponents:"",

		/**
		* @method
		* @private
		*/
		create: enyo.inherit(function(sup) {
			return function() {
				sup.apply(this, arguments);
				this.createComponents(this._listItemsComponents, {
					owner: this
				});
			};
		})
	});

	/**
	* DataFlipCardList Item Wrapper
	*
	* @private
	*/
	enyo.kind(
		/** @lends g.DataFlipCardListItemWrapper.prototype */ {

		/**
		* @private
		*/
		name: "g.DataFlipCardListItemWrapper",

		/**
		* @method
		* @private
		*/
		rendered: enyo.inherit(function(sup) {
			return function() {
				sup.apply(this, arguments);
				//adding classes after element render to improve loading time
				//it will do all calculation after elements are loaded
				this.owner.addClass("g-data-flip-card-stage");
				this.owner.$.child.addClass("g-data-flip-card-child");
				this.owner.$.backchild.addClass("g-data-flip-card-child-back");
				this.owner.$.frontchild.addClass("g-data-flip-card-child-front");
				this.owner.$.frontContainer.addClass("g-data-flip-card-child-front-container");
				this.owner.$.backContainer.addClass("g-data-flip-card-child-back-container");
			};
		})
	});

	/**
	* Overridden the `RepeaterChildSupport`'s `createClientComponents()` method
	* to create modified component structure required for flip animation.
	*
	* Modified component structure:
	* listItem
	*	|
	*	-> child
	*		|
	*		-->backChild
	*			|
	*			--->backContainer
	*					|
	*					---->incomponents
	*		-->frontChild
	*			|
	*			--->frontContainer
	*					|
	*					---->incomponents
	*
	* @private
	*/
	enyo.RepeaterChildSupport.createClientComponents = enyo.inherit(function() {
		return function(incomponents) {

			if (g.DataFlipCardList.prototype.isPrototypeOf(this.repeater)) {
				var childWrapper, i, m, len,
					nb, fromval, toval,
					frontChildWrapper = {},
					backChildWrapper = {},
					bindingLen = this.bindings.length;
				this.bindings.originalBindings = this.bindings.originalBindings || [];
				//rearrage bind as listItem is wrppend in new structure
				if (!this.repeater.bindingDone) {
					this.repeater.finalBindingArr = this.repeater.finalBindingArr || [];
					for (i = 0; i < bindingLen; i++) {
						if (!this.bindings.bindingDone) {
							this.repeater.finalBindingArr.push(new enyo.Binding(this.bindings[i]));
							this.bindings.originalBindings.push(new enyo.Binding(this.bindings[i]));
							this.repeater.finalBindingArr[i].from = "." + this.bindings[i].from.split(".").pop();
							this.bindings[i].transform = undefined;
							this.bindings[i].to = ".$.frontContainer." + this.bindings[i].from.split(".").pop();
						} else if (this.bindings.originalBindings[i]) {
							this.repeater.finalBindingArr.push(this.bindings.originalBindings[i]);
							this.repeater.finalBindingArr[i].from = "." + this.bindings[i].from.split(".").pop();
							this.bindings[i].transform = undefined;
							this.bindings[i].to = ".$.frontContainer." + this.bindings[i].from.split(".").pop();
						}
					}
					this.repeater.bindingDone = this.repeater.bindingDone || false;
					this.repeater.bindingDone = true;
					len = this.bindings.length;
					if (!this.bindings.bindingDone) {
						for (m = 0; m < len; m++) {
							this.bindings[m].oneWay = false;
							fromval = this.bindings[m].from;
							toval = this.bindings[m].to;
							nb = new enyo.Binding({
								from: fromval.replace('model', 'model1'),
								to: toval,
								oneWay: false
							});
							this.bindings.push(nb);
						}
						len = this.bindings.length;
						for (i = bindingLen; i < len; i++) {
							this.bindings[i].to = ".$.backContainer." + this.bindings[i].from.split(".").pop();
						}
					}
				}
				this.bindings.bindingDone = true;
				backChildWrapper.name = "backchild";
				frontChildWrapper.name = "frontchild";
				//actual list item container
				frontChildWrapper.components = [{
					name: "frontContainer",
					kind: "g.DataFlipCardListItemContainer",
					_listItemsComponents: incomponents,
					bindings: this.repeater.finalBindingArr
				}];
				backChildWrapper.components = [{
					name: "backContainer",
					kind: "g.DataFlipCardListItemContainer",
					_listItemsComponents: incomponents,
					bindings: this.repeater.finalBindingArr
				}];
				childWrapper = {
					name: "child",
					kind:"g.DataFlipCardListItemWrapper",
					components: [backChildWrapper, frontChildWrapper]
				};
				this.createComponents([childWrapper], {
					owner: this
				});
			} else {
				this.createComponents(incomponents, {
					owner: this
				});
			}
		};
	});

})(enyo, g, this);
