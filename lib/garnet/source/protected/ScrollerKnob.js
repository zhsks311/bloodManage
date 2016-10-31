(function (enyo, g, scope) {
	/**
	* _g.ScrollerKnob_ is a UI control that shows a circular thumb for a scroller.
	*
	* @class g.ScrollerKnob
	* @extends g.Arc
	* @private
	*/
	enyo.kind(
		/** @lends g.ScrollerKnob.prototype */ {


		/**
		* @private
		*/
		name: "g.ScrollerKnob",

		/**
		* @private
		*/
		events: {
			onChange: "",
			onKnobControlBegin: "",
			onKnobControlEnd: ""
		},

		/**
		* @private
		*/
		handlers: {
			onhold: "_eventHold",
			ondragstart: "_eventDragStart",
			ondrag: "_eventDrag",
			ondragfinish: "_eventDragFinish",
			onup: "_eventUp"
		},

		// properties for drag handling and scrolling

		/**
		* The X-axis center position of a scroller knob
		*
		* @private
		*/
		_centerX: 0,

		/**
		* The Y-axis center position of a scroller knob
		*
		* @private
		*/
		_centerY: 0,

		/**
		* Width of the ring area in which a dragging gesture takes place.
		* If a dragging gesture moves out of this ring area and towards the center of the screen,
		* the dragging gesture is recognized as complete.
		*
		* To drag the wheel, a new dragging needs to be started.
		*
		* Range: [1&ndash;Positive Number]
		*
		* Unit: pixel
		*
		* @type {Number}
		* @default  g.width * g.wheelGestureDraggingWidth
		* @private
		*/
		_widthDragging: g.width * g.wheelGestureDraggingWidth,

		/**
		* The square value of the radius of canceling area
		*
		* @private
		*/
		_cancelRadiusSquare: 0,

		/**
		* The maximum value of allowable scroll top
		*
		* @private
		*/
		_maxScrollTop: null,

		/**
		* The current scroll top
		*
		* @private
		*/
		_currentScrollTop: 0,

		/**
		* The scroll top value when dragging starts
		*
		* @private
		*/
		_dragFromScrollTop: 0,

		/**
		* The position of a scroller at the last doChange() call.
		*
		* @private
		*/
		_lastScrollTo: 0,

		/**
		* The last radian which is already calculated during dragging
		*
		* @private
		*/
		_lastRadian: 0,

		/**
		* The differnce in radians between the starting position of dragging and the current position
		* @private
		*/
		_radianDragged: 0,

		/**
		* An amount of height scrolled when a knob is rotate 360 degrees
		*
		* @private
		*/
		_heightPerRound: g.height * 7,

		/**
		* Indicates whether a scroller knob is tracking gesture or not.
		*
		* @private
		*/
		_isTracking: false,

		/**
		* Indicates whether a scroller knob is dragging or not.
		*
		* @private
		*/
		_isDragging: false,

		/**
		* Indicates whether a dragging is canceled or not
		*
		* @private
		*/
		_isCanceled: false,

		// properties for scroller knob UI

		/**
		* A period which a scroller knob is shown after scrolling of a scroller and dragging of a scroller knob
		*
		* @private
		*/
		_delayHideTime: 3000,

		/**
		* The biased position of a scroller knob to align the position
		*
		* @private
		*/
		_positionBase: 0.27, // in Radian

		/**
		* Indicates whether a scroller knob is showing or not.
		* For the performance, this component does not use 'display: none' style to hide.
		* Therefore this property replace 'showing' property for internal showing logic.
		*
		* @private
		*/
		_isShowing: false,

		/**
		* Indicates whether a scroller knob should be shown or not
		* If contents of a scroller is not greater than a screen, this flag is set to false.
		*
		* @private
		*/
		_knobEnabled: false,

		// common properties

		/**
		* The constant of 2 Pi.
		*
		* @private
		*/
		_constMaxRadian: Math.PI * 2,

		/**
		* The handle for requestAnimationFrame.
		*
		* @private
		*/
		_rafHandle: null,

		/**
		* The count for requestAnimationFrame subsampling.
		*
		* @private
		*/
		_rafSubSamplingCount: 2,

		/**
		* @private
		*/
		classes: "g-scrollerknob",

		/**
		* Contains the image for this ScrollerKnob.
		*
		* @private
		*/
		innerComponents: [
			{classes: "g-scrollerknob-grab", components: [
				{name: "scrollerknob", classes: "g-scrollerknob-visible"}
			]},
			{kind: "Signals", onvisibilitychange: "visibilitychanged"}
		],

		/**
		* Initializes internal components.
		*
		* @private
		*/
		initComponents: enyo.inherit(function(sup) {
			return function() {
				sup.apply(this, arguments);
				this.createComponents(this.innerComponents);
				enyo.dom.transform(this, {translateZ: 0});
				enyo.dom.transform(this, {rotateZ: (this._positionBase)+ "rad"});
				// before sync with a scroller, it is not certain to show this knob or not.
				this.hide();
			};
		}),

		/**
		* Initializes internal variables especially the size information.
		*
		* @private
		*/
		_initVariables: function() {
			this.calculateCenter();
			this._initVariables = undefined;
		},

		/**
		* Calculates internal variables especially the size information.
		*
		* @private
		*/
		calculateCenter: function() {
			var outBounds = this.getAbsoluteBounds();
			if (outBounds.width === 0 && outBounds.height === 0) {
				return;
			}
			var cancelRadius = outBounds.width / 2 - this._widthDragging;
			this._cancelRadiusSquare = cancelRadius * cancelRadius;
			this._centerX = outBounds.left + outBounds.width / 2;
			this._centerY = outBounds.top + outBounds.height / 2;
		},

		/**
		* For performance, this component does not use `display: none` style to hide.
		*
		* @private
		*/
		show: function() {
			if (!this._knobEnabled) {
				this.hide();
			} else {
				this.cancelDelayHide();
				enyo.dom.transform(this, {translateY: 0});
				this._isShowing = true;
				this.calculateCenter();
			}
		},

		/**
		* For performance, this component does not use `display: none` style to hide.
		*
		* @private
		*/
		hide: function() {
			enyo.dom.transform(this, {translateY: (g.height * 2) + "px"});
			this._isShowing = false;
		},

		/**
		* The event handler for enter event
		*
		* @private
		*/
		_eventHold: function() {
			if (this._knobEnabled) {
				this.calculateCenter();
				this.cancelDelayHide();
				this.$.scrollerknob.addClass("pressed");
				this._isTracking = true;
				enyo.Signals.send("onKnobDragStart");
				return true;
			}
			return false;
		},

		/**
		* The event handler for the dragstart event.
		*
		* @fires g.ScrollerKnob#onKnobControlBegin
		* @private
		*/
		_eventDragStart: function(inSender, inEvent) {
			if (this._knobEnabled && this._isTracking) {
				inEvent.preventDefault();
				if (this._initVariables) {
					this._initVariables();
				}
				this._dragFromScrollTop = this._currentScrollTop;
				this._lastRadian = this._computeRadian(this._getDistances(inEvent));
				this._radianDragged = 0;
				this._isDragging = true;
				this._isCanceled = false;
				this._rafSkipCount = this._rafSubSamplingCount || 1;
				this.cancelDelayHide();
				this.doKnobControlBegin();
				return true;
			}
			return false;
		},

		/**
		* The event handler for the drag event.
		*
		* @fires g.ScrollerKnob#onChange
		* @private
		*/
		_eventDrag: function(inSender, inEvent) {
			var distances, radian, radianDelta, scrollTop;
			if (this._isDragging) {
				distances = this._getDistances(inEvent);
				if (distances.radiusSquare < this._cancelRadiusSquare) {
					this._isDragging = false;
					this._isCanceled = true;
					this._isTracking = false;
					this.$.scrollerknob.removeClass("pressed");
					enyo.Signals.send("onKnobDragFinish");
				} else {
					radian = this._computeRadian(distances);
					radianDelta = radian - this._lastRadian;
					if (radianDelta > Math.PI) {
						radianDelta -= 2 * Math.PI;
					} else if (radianDelta < -Math.PI) {
						radianDelta += 2 * Math.PI;
					}
					this._radianDragged += radianDelta;
					this._lastRadian = radian;
					scrollTop = this._radianDragged * this._heightPerRound / this._constMaxRadian + this._dragFromScrollTop;

					if (this._maxScrollTop === null) {
						this._lastScrollTo = 0;
					} else if (Math.abs(scrollTop - this._lastScrollTo) > 10) {
						scrollTop = Math.max(0, Math.min(this._maxScrollTop, scrollTop));
						this._lastScrollTo = scrollTop;
					} else {
						return true;
					}

					if (this._rafHandle) {
						window.cancelAnimationFrame(this._rafHandle);
						this._rafHandle = null;
					}
					this._rafHandle = window.requestAnimationFrame(this.bindSafely(this._delayDoChange));
				}
				return true;
			}
			return false;
		},

		/**
		* Delays the `doChange()` method call.
		*
		* @private
		*/
		_delayDoChange: function () {
			this._rafSkipCount--;
			if (this._rafSkipCount > 0) {
				this._rafHandle = window.requestAnimationFrame(this.bindSafely(this._delayDoChange));
				return;
			}
			this.doChange({scrollTo: this._lastScrollTo});
			this._rafHandle = null;
			this._rafSkipCount = this._rafSubSamplingCount || 1;
		},

		/**
		* The event handler for the dragfinish event.
		*
		* @fires g.ScrollerKnob#onKnobControlEnd
		* @private
		*/
		_eventDragFinish: function(inSender, inEvent) {
			if (this._isDragging || this._isCanceled) {
				this._isDragging = false;
				this._isCanceled = false;
				this._isTracking = false;
				inEvent.preventTap();
				this.$.scrollerknob.removeClass("pressed");
				this.delayHide();
				this.doKnobControlEnd({scrollTo: this._lastScrollTo});
				enyo.Signals.send("onKnobDragFinish");
				return true;
			}
			return false;
		},

		/**
		* The event handler for the up event.
		*
		* @private
		*/
		_eventUp: function(inSender, inEvent) {
			if (this._knobEnabled) {
				this._isTracking = false;
				this.$.scrollerknob.removeClass("pressed");
				this.delayHide();
				enyo.Signals.send("onKnobDragFinish");
				return true;
			}
			return false;
		},

		/**
		* Cancels delay hide operation when scrolling starts.
		*
		* @private
		*/
		scrollStarted: function() {
			if (this._knobEnabled) {
				this.cancelDelayHide();
			}
		},

		/**
		* Moves this ScrollerKnob along with scrolling while the target is getting scrolled.
		*
		* @private
		*/
		scrolled: function(inScrollBounds) {
			if (this._knobEnabled) {
				this.move(inScrollBounds);
			}
		},

		/**
		* Hides this ScrollerKnob after a set time from the moment the scrolling stops.
		*
		* @private
		*/
		scrollStopped: function() {
			if (this._knobEnabled && !this._isDragging) {
				this.delayHide();
			}
		},

		/**
		* Syncs the status of this ScrollerKnob with the status of a scroller.
		*
		* @private
		*/
		scrollSync: function(inScrollBounds) {
			this._maxScrollTop = inScrollBounds.height - inScrollBounds.clientHeight * 4;
			if (this._maxScrollTop >= 0 && inScrollBounds.height !== 0) {
				this._knobEnabled = true;
				this.show();
				this.move(inScrollBounds);
				if (this._initVariables) {
					this._initVariables();
				}
				this.delayHide();
			} else {
				this._knobEnabled = false;
				this.hide();
			}
			return true;
		},

		/**
		* Moves this ScrollerKnob along with scrolling.
		*
		* @private
		*/
		move: function(inScrollBounds) {
			this._maxScrollTop = inScrollBounds.height - inScrollBounds.clientHeight;
			this._currentScrollTop = inScrollBounds.top;
			enyo.dom.transform(this, {rotateZ: (this._constMaxRadian * inScrollBounds.top / this._heightPerRound + this._positionBase)+ "rad"});
		},

		/**
		* Hides this ScrollerKnob after a set time.
		*
		* @private
		*/
		delayHide: function() {
			if (this._isShowing) {
				enyo.job(this.id + "hide", this.bindSafely("hide"), this._delayHideTime || 0);
			}
		},

		/**
		* Cancels delay hide operation.
		*
		* @private
		*/
		cancelDelayHide: function() {
			enyo.job.stop(this.id + "hide");
		},

		/**
		* Calculates the distance from the current position.
		*
		* @private
		*/
		_getDistances: function(inEvent) {
			var dx = inEvent.clientX - this._centerX;
			var dy = inEvent.clientY - this._centerY;
			return {dx: dx, dy: dy, radiusSquare: dx * dx + dy * dy};
		},

		/**
		* Computes radian value from the given distance information.
		*
		* @private
		*/
		_computeRadian: function(inDistances) {
			var radian = Math.acos(-inDistances.dy / Math.sqrt(inDistances.radiusSquare));
			if (inDistances.dx  < 0) {
				radian = this._constMaxRadian - radian;
			}
			return radian;
		},

		/**
		* @private
		*/
		visibilitychanged: function() {
			if (enyo.hidden) {
				this.cancelDelayHide();
			} else if (this._isShowing) {
				this.$.scrollerknob.removeClass("pressed");
				this.cancelDelayHide();
				this.delayHide();
				enyo.Signals.send("onKnobDragFinish");
			}
		}
	});

})(enyo, g, this);
