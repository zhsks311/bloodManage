(function (enyo, g, scope) {
	/**
	* _g.FlipScrollMath_ inherits
	* [enyo.ScrollMath]{@link http://enyojs.com/docs/latest/#/kind/enyo.ScrollMath}.
	* and implements a scrolling dynamics simulation for a flipping list.
	* _g.FlipScrollMath_ is a helper kind used by other scroller kinds, such as {@link g.FlipScrollStrategy}.
	*
	* _g.FlipScrollMath_ is not typically created in application code.
	*
	* @class g.FlipScrollMath
	* @extends enyo.ScrollMath
	* @private
	*/
	enyo.kind(
		/** @lends g.FlipScrollMath.prototype */ {

		/**
		* @private
		*/
		name: "g.FlipScrollMath",

		/**
		* @private
		*/
		kind: "enyo.ScrollMath",

		/**
		* One unit of time for simulation.
		*
		* @private
		*/
		frame: 10,

		/**
		* @private
		*/
		kFrictionDamping : 0.92,

		/**
		* @private
		*/
		kFlickScalar : 15,

		/**
		* Flag to enable or disable single flick set from g.DataFlipCardList
		*
		* @type {Boolean}
		* @default false
		* @private
		*/
		singleFlick : false,

		/**
		* The scroller which contains {@link g.FlipScrollStrategy} and {@link g.FlipScrollMath}
		*
		* @type {Object}
		* @default null
		* @private
		*/
		scroller : null,

		/**
		* @private
		*/
		handlers: {
			onSyncSingleFlick: "syncSingleFlick"
		},

		/**
		* Syncing whether singleFlick is set to true or false
		*
		* @private
		*/
		syncSingleFlick: function(inSender, inEvent) {
			this.singleFlick = inEvent.syncSingleFlick;
			this.scroller = inEvent.scroller;
		},

		/**
		* @private
		*/
		drag: function(e) {
			if (this.scroller && (this.scroller.hasClass("stretched") || this.scroller.hasClass("compressed"))) {
				return;
			}
			if (this.dragging) {
				var dy = this.vertical ? e.pageY - this.my : 0;
				this.uy = dy + this.py;
				// Provides resistance against dragging into overscroll
				this.uy = this.boundaryDamping(this.uy, this.topBoundary, this.bottomBoundary, this.kDragDamping);
				var dx = this.horizontal ? e.pageX - this.mx : 0;
				this.ux = dx + this.px;
				// Provides resistance against dragging into overscroll
				this.ux = this.boundaryDamping(this.ux, this.leftBoundary, this.rightBoundary, this.kDragDamping);
				this.start();
				// If user has called scroll to and suddenly start dragging
				// Then drag event has to overrite the scroll to event
				// If we doesn't set it undefined here at end of scroll it will assign end value
				this.endX = undefined;
				this.endY = undefined;
				return true;
			}
		},

		/**
		* If singleFlick is true then, flick is handled in g.FlipScrollMath itself
		* If singleFlick is false then, flick is handled in enyo.scrollMath
		*
		* @private
		*/
		flick: enyo.inherit(function (sup) {
			return function() {
				if (this.singleFlick) {
					if (this.vertical) {
						this.y = this.y0;
					}
					if (this.horizontal) {
						this.x = this.x0;
					}
					this.start();
				} else {
					sup.apply(this, arguments);
				}
			};
		}),

		/*
		* Resets the Math scroller with initial values and also updates the thumb.
		*
		* @private
		*/
		reset: function() {
			// initialize the scrolling, It is required to update the thumb position
			this.scrollTo(0, 0);
			// reset the scroller values
			this.x0 = this.x = this.y0 = this.y = 0;
		},

		/*
		* Sets the given values to the Math Scroller and updates the thumb generally used when user uses
		* `scrollToIndex()` call from a List.
		* Immediate scroller setting is required as it cannot be set via DOM scrolling as all elements are stacked.
		*
		* @private
		*/
		fastSetvalue: function(x, y) {
			// initialize the scrolling, It is required to update the thumb position
			this.scrollTo(x, y);
			// set the scroller values
			this.x0 = this.x = -x;
			this.y0 = this.y = -y;
		}
	});

})(enyo, g, this);
