	(function (enyo, g, scope) {

	/**
	* _g.MenuScroller_ is a Panel that contains {@link g.MenuItem}s as its items.
	* Should items be composed of more than simply a text, other components can
	* be used as its items, as shown in the example below.
	*
	* @class g.MenuScroller
	* @extends g.Panel
	* @public
	* @example
	*	{kind: "g.MenuScroller",
	*	 components: [
	*		{name: "item", kind: "g.MenuToggleIconButton", content: "Wifi", ...},
	*		{name: "item2", kind: "g.MenuCheckbox", content: "This is a long check item", ontap: "onItemSelected"},
	*		{name: "item3", kind: "g.MenuToggleIconButton", content: "Edit", ontap: "onItemSelected"},
	*	]}
	*/
	enyo.kind(
		/** @lends g.MenuScroller.prototype */ {

		/**
		* @private
		*/
		name: "g.MenuScroller",

		/**
		* @private
		*/
		kind: "g.Scroller",

		/**
		* @private
		*/
		classes: "g-menu-scroller"
	});

})(enyo, g, this);
