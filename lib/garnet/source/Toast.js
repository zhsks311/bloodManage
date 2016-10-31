(function (enyo, g, scope) {
	/**
	* _g.Toast_ is a popup with a message that disappears after being
	* displayed just for two seconds.
	*
	* @class g.Toast
	* @extends g.Popup
	* @public
	*/
	enyo.kind(
		/** @lends g.Toast.prototype */ {

		/**
		* @private
		*/
		name: "g.Toast",

		/**
		* @private
		*/
		kind: "g.Popup",

		/**
		* @private
		*/
		published:
			/** @lends g.Toast.prototype */ {

			/**
			* Showing time of the toast
			*
			* Range: [0&ndash;Positive Integer]
			*
			* @type {Number}
			* @default 2000
			* @public
			*/
			duration: 2000
		},

		/**
		* @private
		*/
		classes: "g-toast",

		/**
		* Indicates whether to hide this toast when the HOME key is pressed.
		*
		* Range: [`true`, `false`]
		*
		* - `true`: This Toast closes when the HOME key is pressed.
		* - `false`: This Toast does not close when the HOME key is pressed.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		closedByHomeKey: true,

		/**
		* @private
		*/
		tools: [
			{classes: "g-toast-container", components: [
				{name: "client", classes: "g-toast-client"}
			]},
			{kind: "Signals", onvisibilitychange: "visibilityChanged"}
		],

		/**
		* @private
		*/
		bindings: [
			{from: ".content", to: ".$.client.content"},
			{from: ".allowHtml", to: ".$.client.allowHtml"}
		],

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
		* @method
		* @private
		*/
		showingChanged: enyo.inherit(function(sup) {
			return function() {
				sup.apply(this, arguments);

				if (this.showing) {

					// Accessibility - When toast popup occurs, it reads content of toast popup.
					enyo.readAlert(this.getContent());

					this.startJob("hideToast", this.hideToast, this.duration);
				} else {
					this.stopJob("hideToast");
				}
			};
		}),

		/**
		* @private
		*/
		visibilityChanged: function() {
			if (this.showing && this.closedByHomeKey && enyo.hidden /*when the app is closing*/) {
				this.hide();
			}
		},

		/**
		* @private
		*/
		hideToast:function() {
			this.hide();
		}
	});

})(enyo, g, this);
