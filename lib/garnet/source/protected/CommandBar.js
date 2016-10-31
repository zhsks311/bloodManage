(function (enyo, scope) {
	/**
	* _g.CommandBar_ is a button or a button set composed of one or two buttons.
	* The position of this button/button set is always the bottom of the screen.
	*
	* @class g.CommandBar
	* @private
	*/
	enyo.kind(
		/** @lends g.CommandBar.prototype */ {

		/**
		* @private
		*/
		name: "g.CommandBar",

		/**
		* @private
		*/
		classes: "enyo-children-inline g-command-bar",

		/**
		* @private
		*/
		defaultKind: "g.IconButton",

		/**
		* @private
		*/
		handlers: {
			ontap: "preventSound"
		},

		/**
		* Prevents the touch feedback sound played when this CommandBar is tapped,
		* by setting the `inEvent.preventSound` property to `true`.
		*
		* @private
		*/
		preventSound: function(inSender, inEvent) {
			inEvent.preventSound = true;
		}
	});

})(enyo, this);
