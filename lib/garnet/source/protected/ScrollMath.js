(function (enyo, scope) {
	/**
	* _g.ScrollMath_ implements a scrolling dynamics simulation. It is a
	* helper kind that extends [enyo.ScrollMath]{@link http://enyojs.com/docs/latest/#/kind/enyo.ScrollMath} and is
	* used by other [enyo.Scroller]{@link http://enyojs.com/docs/latest/#/kind/enyo.Scroller} kinds, such as
	* [enyo.TouchScrollStrategy]{@link http://enyojs.com/docs/latest/#/kind/enyo.TouchScrollStrategy}.
	*
	* _g.ScrollMath_ is not typically created in _application_ code.
	*
	* @class g.ScrollMath
	* @extends enyo.ScrollMath
	* @private
	*/
	enyo.kind(
		/** @lends g.ScrollMath.prototype */ {

		/**
		* @private
		*/
		name: 'g.ScrollMath',

		/**
		* @private
		*/
		kind: 'enyo.ScrollMath',

		/**
		* Flag to enable or disable single flick set from g.DataList
		*
		* @type {Boolean}
		* @default false
		* @private
		*/
		singleFlick : false,

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
		},

		/**
		* @private
		*/
		drag: function (e) {
			if (this.dragging) {
				this.uy = e.pageY - this.my + this.py;

				// provides resistance against dragging into overscroll
				this.uy = this.boundaryDamping(this.uy, this.topBoundary, this.bottomBoundary, this.kDragDamping);
				this.ux = this.px;

				// provides resistance against dragging into overscroll
				this.ux = this.boundaryDamping(this.ux, this.leftBoundary, this.rightBoundary, this.kDragDamping);
				this.start();
				return true;
			}
		},

		/**
		* If singleFlick is true then, flick is handled in g.ScrollMath itself
		* If singleFlick is false then, flick is handled in enyo.scrollMath
		*
		* @private
		*/
		flick: enyo.inherit(function (sup) {
			return function() {
				if (!this.singleFlick) {
					sup.apply(this, arguments);
				}
			};
		})
	});

})(enyo, this);
