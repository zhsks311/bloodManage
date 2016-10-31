(function (enyo, g, scope) {
	/**
	* _g.PopupScrollStrategy_ is the ScrollStrategy for {@link g.ConfirmPopup}
	* to provide a header with an icon and a title.
	*
	* @class g.PopupScrollStrategy
	* @extends g.ScrollStrategy
	* @public
	*/
	enyo.kind(
		/** @lends g.PopupScrollStrategy.prototype */ {

		/**
		* @private
		*/
		name: "g.PopupScrollStrategy",

		/**
		* @private
		*/
		kind: "g.ScrollStrategy",

		published:
			/** @lends g.PopupScroller.prototype */ {

			/**
			* @private
			*/
			icon: false,

			/**
			* @private
			*/
			iconSrc: null,

			/**
			* @private
			*/
			title: false,

			/**
			* @private
			*/
			titleContent: ""
		},

		/**
		* @private
		*/
		controlParentName: "content",

		/**
		* @private
		*/
		bindings: [
			{from: ".iconSrc", to: ".$.icon.src"},
			{from: ".titleContent", to: ".$.title.content"}
		],

		/**
		* @method
		* @private
		*/
		initComponents: enyo.inherit(function (sup) {
			return function() {
				this.kindComponents = [
					{name: "clientContainer", classes: "enyo-touch-scroller", components: [
						{classes: "stretch-client", components: [
							{name: "client", components: [
								{name: "header", classes: "g-popup-scroller-header", components: [
									{name: "icon", kind: "enyo.Image", classes: "g-popup-scroller-header-icon"},
									{name: "title", classes: "g-popup-scroller-header-title"}
								]},
								{name: "content", classes: "g-popup-scroller-content", owner: this}
							]}
						]}
					]}
				];

				sup.apply(this, arguments);

				this.iconChanged();
				this.iconSrcChanged();
				this.titleChanged();
				this.titleContentChanged();
			};
		}),

		/**
		* @private
		*/
		iconChanged: function () {
			this.$.icon.setShowing(this.icon);
			this.adjustPosition();
		},

		/**
		* @private
		*/
		iconSrcChanged: function () {
			this.adjustPosition();
		},

		/**
		* @private
		*/
		titleChanged: function () {
			this.$.title.setShowing(this.title);
			this.adjustPosition();
		},

		/**
		* @private
		*/
		titleContentChanged: function () {
			this.adjustPosition();
		},

		/**
		* @private
		*/
		adjustPosition: function () {
			this.$.icon.addRemoveClass("g-popup-scroller-header-padding-icon-title", this.icon && this.title);
			this.$.icon.addRemoveClass("g-popup-scroller-header-padding-icon", this.icon && !this.title);
			this.$.title.addRemoveClass("g-popup-scroller-header-padding-title", !this.icon && this.title);
		}
	});

	/**
	* _g.PopupScroller_ is the scroller for {@link g.ConfirmPopup}.
	*
	* @class g.PopupScroller
	* @extends g.Scroller
	* @public
	*/
	enyo.kind(
		/** @lends g.PopupScroller.prototype */ {

		/**
		* @private
		*/
		name: "g.PopupScroller",

		/**
		* @private
		*/
		kind: "g.Scroller",

		/**
		* @private
		*/
		strategyKind: "g.PopupScrollStrategy",

		/**
		* @private
		*/
		published:
			/** @lends g.PopupScroller.prototype */ {

			/**
			* Indicates whether to show or hide an icon at the top of the Popup.
			*
			* Range: [`true`, `false`]
			*
			* - `true`: Show an icon.
			* - `false`: Hide an icon.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			icon: false,

			/**
			* URL of the icon image file.
			*
			* @type {String}
			* @default ""
			* @public
			*/
			iconSrc: "",

			/**
			* Indicates whether to show or hide a title in the Popup.
			*
			* Range: [`true`, `false`]
			*
			* - `true`: Show the title.
			* - `false`: Hide the title.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			title: false,

			/**
			* The title text of the Popup.
			*
			* @type {String}
			* @default ""
			* @public
			*/
			titleContent: ""
		},

		/**
		* @private
		*/
		classes: "g-popup-scroller",

		/**
		* @private
		*/
		bindings: [
			{from: ".icon", to: ".$.strategy.icon"},
			{from: ".iconSrc", to: ".$.strategy.iconSrc"},
			{from: ".title", to: ".$.strategy.title"},
			{from: ".titleContent", to: ".$.strategy.titleContent"}
		],

		/**
		* @private
		*/
		reflow: function(inSender, inEvent) {
			var sb = this.getScrollBounds(),
				footer = sb.height > 208;

			this.$.strategy.$.client.addRemoveClass("g-popup-scroller-footer-padding", footer);
			this.set("scrollIndicatorEnabled", footer);
		}
	});

})(enyo, g, this);
