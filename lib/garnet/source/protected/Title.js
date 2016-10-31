(function (enyo, scope) {
	/**
	* _g.Title_ is a title component for [g.Panel]{@link g.Panel}.
	*
	* @class g.Title
	* @private
	*/
	enyo.kind(
		/** @lends g.Title.prototype */ {

		/**
		* @private
		*/
		name: "g.Title",

		/**
		* @private
		*/
		published:
			/** @lends g.Title.prototype */ {

			/**
			* Icon image displayed on the left side of the title text.
			* This property is used only when this title is used for the [g.MenuScroller's]{@link g.MenuScroller] title.
			*
			* Range: [`true`, `false`]
			*
			* - `true`: The icon is displayed.
			* - `false`: The icon is hidden.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			icon: false
		},

		/**
		* @private
		*/
		classes: "g-title",

		/**
		* @private
		*/
		ignoreWheelControl: true,

		/**
		* @private
		*/
		components: [
			{name: 'content', classes: 'g-title-content'}
		],

		/**
		* @private
		*/
		bindings: [
			{from: '.content', to: '.$.content.content'}
		],

		/**
		* @private
		*/
		iconChanged: function() {
			this.addRemoveClass('g-title-icon', this.icon);
		}
	});

})(enyo, this);
