(function (enyo, g, scope) {
	/**
	* _g.ButtonIconBase_ is the base kind for various types of menu items.
	* It is the base kind for {@link g.MenuItem}, {@link g.MenuCkeckbox}, and {@link g.MenuToggleIconButton}.
	*
	* @class g.MenuItemBase
	* @extends enyo.Item
	* @private
	*/
	enyo.kind(
		/** @lends g.MenuItemBase.prototype */ {

		/**
		* @private
		*/
		name: "g.MenuItemBase",

		/**
		* @private
		*/
		kind: "g.Item",

		/**
		* @private
		*/
		classes: "g-menu-scroller-item",

		/**
		* @method
		* @private
		*/
		create: enyo.inherit(function(sup) {
			return function() {
				this.components = undefined;
				sup.apply(this, arguments);

				this.createComponents(this.tools);
			};
		}),

		/**
		* @private
		*/
		handlers: {
			ontap: "playFeedback"
		},

		/**
		* Plays the touch feedback sound when this menu item is tapped.
		*
		* @param {enyo.Component} inSender - The [enyo.Component]{@link http://enyojs.com/docs/latest/#/kind/enyo.Component} that most recently propagated the `event`.
		* @param {Object} inEvent - An `object` containing event information.
		* @public
		*/
		playFeedback: function(inSender, inEvent) {
			if (!inEvent || inEvent && !inEvent.preventSound) {
				g.playFeedback("touch");
				if (inEvent) {
					inEvent.preventSound = true;
				}
			}
		}
	});

})(enyo, g, this);
