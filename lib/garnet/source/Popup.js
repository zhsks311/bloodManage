(function (enyo, g, scope) {
	/**
	* Fired when the Pop_Up_ animation is finished. The Pop_Up_ animation is the animation that
	* displays a popup.
	*
	* @event g.Popup#onPopUpAnimationEnd
	* @type {Object}
	* @property {Object} sender - The component that most recently propagated the event.
	* @property {Object} event - An object containing the event information.
	* @public
	*/

	/**
	* Fired when the Pop_Down_ animation is finished. The Pop_Down_ animation is the animation that
	* makes a popup disappear.
	*
	* @event g.Popup#onPopDownAnimationEnd
	* @type {Object}
	* @property {Object} sender - The component that most recently propagated the event.
	* @property {Object} event - An object containing the event information.
	* @public
	*/

	/**
	* _g.Popup_ is the basic popup control used to display content on top of other content.
	* Popups are initially hidden on creation; to make a popup display, call the
	* [show()]{@link http://enyojs.com/docs/latest/#/kind/enyo.Control:show} method.
	* To hide a visible popup, call the [hide()]{@link http://enyojs.com/docs/latest/#/kind/enyo.Control:hide}
	* method.
	*
	*
	* @class g.Popup
	* @extends enyo.Popup
	* @public
	*/
	enyo.kind(
		/** @lends g.Popup.prototype */ {

		/**
		* @private
		*/
		name: "g.Popup",

		/**
		* @private
		*/
		kind: "enyo.Popup",

		/**
		* @private
		*/
		published:
			/** @lends g.Popup.prototype */ {

			/**
			* Indicates whether to use popup animation effect.
			* If `true`, popup animation effect is used.
			* Popups that can have animation effect are: {@link g.Popup}, {@link g.ConfirmPopup}, {@link g.IconMenuPopup}
			* and {@link g.Toast}.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			popupEffect: true,

			/**
			* Name of the popup transition effect.
			* Popups that can have animation effect are: {@link g.Popup}, {@link g.ConfirmPopup}, {@link g.IconMenuPopup}
			* and {@link g.Toast}.
			*
			* Range: [`"scale-transition"`, `"depth-transition"`]
			*
			* @type {String}
			* @default "scale-transition"
			* @public
			*/
			effect: "scale-transition"
		},

		/**
		* @private
		*/
		events: {
			onPopUpAnimationEnd: "",
			onPopDownAnimationEnd: ""
		},

		/**
		* @private
		*/
		handlers: {
			onflick: "preventDrag",
			ondragstart: "startScrim",
			ondrop: "hideScrim",
			ondrag: "preventDrag",
			ondragfinish: "preventTap",
			ondragover: "preventDrag",
			ondragout: "preventDrag",
			onSwipe: "swiped",
			onhold: "preventEvent",
			onholdpulse: "preventEvent",
			ontap: "preventEvent",
			ondown: "preventEvent",
			onup: "preventEvent",
			onmove: "preventEvent",
			onenter: "preventEvent",
			onleave: "preventEvent",
			onrelease: "preventEvent",

			onDataAdded: "preventEvent",
			onDataRemoved: "preventEvent",
			onScrollStart: "preventEvent",
			onScroll: "preventEvent",
			onScrollStop: "preventEvent",
			onScrollSync: "preventEvent",
			onPopDownAnimationEnd: "refresh",
			onRequestCreateCommandBarInScroller: "requestCreateCommandBarInScroller"
		},

		/**
		* Indicates whether a scrim will appear when the dialog is modal.
		* Note that modal scrims are transparent, so they are invisible.
		*
		* Range: [`true`, `false`]
		*
		* @private
		*/
		scrimWhenModal: true,
		/**
		* Indicates whether or not to display a scrim when this popup is displayed. Scrim is displayed
		* when this popup is floating.
		*
		* @private
		*/
		scrim: false,

		/**
		* Optional class name to apply to the scrim. Be aware that the scrim
		* is a singleton and modifying this affects all the other popups.

		*
		* @private
		*/
		scrimClassName: "",

		/**
		* @private
		*/
		modal: true,

		/**
		* @private
		*/
		centered: true,

		/**
		* @private
		*/
		floating: true,

		/**
		* @private
		*/
		ignoreWheelControl: true,

		/**
		* @private
		*/
		defaultZ: 120,

		/**
		* Prevents the CircularThumb from being displayed.
		*
		* @private
		*/
		preventShowingThumb: true,

		/**
		* Popup scrim animation z-index.
		*
		* @private
		*/
		_scrimAnimationZ: undefined,

		/**
		* The scrim object.
		*
		* @private
		*/
		_animatedscrim: undefined,

		/**
		* Temporary storage object used to store the sup in the [showingChanged]{@link g.Popup#showingChanged} method.
		*
		* @private
		*/
		_supTemp: {},

		/**
		* Temporary storage object used to store the argument in the [showingChanged]{@link g.Popup#showingChanged} method.
		*
		* @private
		*/
		_supArgument: {},

		/**
		* Timer ID for closing this popup for the `"depth-transition"` animation effect.
		*
		* @private
		*/
		_depthTransitionTimerID: undefined,

		/**
		* Time delay for closing this popup for the `"depth-transition"` animation effect.
		*
		* @private
		*/
		_depthTransitionDelay : 400,


		/**
		* Indicates if PopUp animation is running. This property is used in the scrimAnimationEnded signal.
		*
		* @private
		*/
		_isPopupAnimRunning: false,

		/**
		* Indicates if PopDown animation is running. This property is used in the scrimAnimationEnded signal.
		*
		* @private
		*/
		_isPopdownAnimRunning: false,

		/**
		* Previous showing state.
		*
		* @private
		*/
		_prevShowingState: false,

		/**
		* @private
		*/
		classes: "g-popup enyo-unselectable",

		/**
		* @method
		* @private
		*/
		initComponents: enyo.inherit(function(sup) {
			return function() {
				var hasOwnProperty = this.hasOwnProperty("components");
				this.contentComponents = this.components || this.kindComponents;
				this.components = this.kindComponents = null;
				var owner = this.hasOwnProperty("components") ? this.getInstanceOwner() : this;
				this.createComponents(this.contentComponents, hasOwnProperty ? {owner: owner} : {owner: this});
				// Defining of the signal kind for the onkeyup and onScrimAnimationend
				if (this.effect === "scale-transition") {
					this.createComponent({kind: "Signals", onkeyup: "keyup", onScrimAnimationend: "scrimAnimationEnded"});
				}
				sup.apply(this, arguments);

				this.effectChanged();
			};
		}),

		/**
		* @method
		* @private
		*/
		destroy: enyo.inherit(function(sup) {
			return function() {
				this.hide();
				sup.apply(this, arguments);
				if (this._animatedscrim) {
					this._animatedscrim.destroy();
				}
			};
		}),

		/**
		* @method
		* @private
		*/
		showingChanged: enyo.inherit(function(sup) {
			return function() {
				this.clearPreviousAnimationStates();
				this._prevShowingState = this.showing;

				// Accessibility - Readout "alert" when popup occurs.
				if (this.showing && !(this instanceof g.Toast)) {
					enyo.readAlert(g.$L({key: "g_alert", value: "alert"}));
				}

				if (this.popupEffect && (this.effect === "scale-transition")) {
					this.ShowHideScaleTransition(sup, arguments);
				} else if (this.popupEffect && (this.effect === "depth-transition")) {
					this.ShowHideDepthTransition(sup, arguments);
				} else {
					sup.apply(this, arguments);
				}
				return;
			};
		}),

		/**
		* @method
		* @private
		*/
		effectChanged: function() {
			this.addRemoveClass("scale-transition", this.effect === "scale-transition");
			this.removeClass("g-popup-depth-transition");
			this.removeClass("g-popdown-depth-transition");
			this.removeGradualPopupHiding();
		},

		/**
		* @fires g.Popup#onPopUpAnimationEnd
		* @fires g.Popup#onPopDownAnimationEnd
		* @method
		* @private
		*/
		clearPreviousAnimationStates: function() {
			var currentShowing;
			if (this.popupEffect && (this._isPopupAnimRunning || this._isPopdownAnimRunning)) {
				currentShowing = this.showing;
				this.showing = this._prevShowingState;
				this.clearAnimation();
				if (this._isPopupAnimRunning) {
					if (this.effect === "scale-transition") {
						this._supTemp.apply(this, this._supArgument);
					}
					this.doPopUpAnimationEnd();
					this.waterfallDown("onPopUpAnimationEnd");
					this._isPopupAnimRunning = false;
				} else if (this._isPopdownAnimRunning) {
					if (this.effect === "depth-transition") {
						this._supTemp.apply(this, this._supArgument);
					}
					this.doPopDownAnimationEnd();
					this.waterfallDown("onPopDownAnimationEnd");
					this._isPopdownAnimRunning = false;
				}
				this.showing = currentShowing;
			}
		},

		/**
		* @method
		* @private
		*/
		clearAnimation: function() {
			var scrim;
			if (this.effect === "scale-transition") {
				scrim = this.getPopupScrimAnimation();
				scrim.removePopupScrimAnimationclass();
				scrim.removePopdownScrimAnimationclass();
				this.removeGradualPopupShowing();
				this.removeGradualPopupHiding();
			} else if (this.effect === "depth-transition") {
				this.removeClass("g-popup-depth-transition");
				this.removeClass("g-popdown-depth-transition");
				this.stopJob('popDownDepthtransitionEnd');
			}
		},

		/**
		* g-Popup animation
		*
		* @private
		*/
		ShowHideScaleTransition: function(sup, argument) {
			this._supTemp = sup;
			this._supArgument = argument;
			if (this.showing) {
				this._isPopupAnimRunning = true;
				this.removeGradualPopupShowing();
				this.removeGradualPopupHiding();
				this.showScrimAnimation(this.showing);
			} else {
				this._isPopdownAnimRunning = true;
				this.removeGradualPopupShowing();
				this.removeGradualPopupHiding();
				this.initiateHideScrimAnimation(this.showing);
			}
		},

		/**
		* Triggers showing or hiding the `"depth-transition"` animation effect for this popup.
		*
		* @private
		*/
		ShowHideDepthTransition : function(sup, argument) {
			this._supTemp = sup;
			this._supArgument = argument;
			if (this.showing) {
				this._isPopupAnimRunning = true;
				this.removeClass("g-popup-depth-transition");
				this.removeClass("g-popdown-depth-transition");
				this.stopJob('popupDepthtransitionEnd');
				sup.apply(this, argument);
				this.startJob('popupDepthtransitionEnd', this.popupDepthtransitionEnd, this._depthTransitionDelay);
				this.addClass("g-popup-depth-transition");
			} else {
				this._isPopdownAnimRunning = true;
				this.removeClass("g-popup-depth-transition");
				this.removeClass("g-popdown-depth-transition");
				this.stopJob('popDownDepthtransitionEnd');
				this.startJob('popDownDepthtransitionEnd', this.popDownDepthtransitionEnd, this._depthTransitionDelay);
				this.addClass("g-popdown-depth-transition");
			}
		},

		/**
		* Fires the [onPopUpAnimationEnd]{@link g.Popup#event:onPopUpAnimationEnd} event to
		* inform that the _PopUp_ animation with the `"depth-transition"` effect has ended.
		*
		* @fires g.Popup#onPopUpAnimationEnd
		* @private
		*/
		popupDepthtransitionEnd: function() {
			this._isPopupAnimRunning = false;
			this.doPopUpAnimationEnd();
			this.waterfallDown("onPopUpAnimationEnd");
		},

		/**
		* Fires the [onPopDownAnimationEnd]{@link g.Popup#event:onPopDownAnimationEnd} event to
		* inform that the _PopDown_ animation with the `"depth-transition"` effect has ended.
		*
		* @fires g.Popup#onPopDownAnimationEnd
		* @private
		*/
		popDownDepthtransitionEnd: function() {
			this._supTemp.apply(this, this._supArgument);
			this._isPopdownAnimRunning = false;
			this.doPopDownAnimationEnd();
			this.waterfallDown("onPopDownAnimationEnd");
		},

		/**
		* Signal handler for popup and popdown scrim animation end
		* Fires the callback events [onPopUpAnimationEnd]{@link g.Popup#event:onPopUpAnimationEnd} event
		* and [onPopDownAnimationEnd]{@link g.Popup#event:onPopDownAnimationEnd} event.
		*
		* @fires g.Popup#onPopUpAnimationEnd
		* @fires g.Popup#onPopDownAnimationEnd
		* @private
		*/
		scrimAnimationEnded: function(inSender, inEvent) {
			if (this._isPopupAnimRunning && inEvent.animationName === "pop-up") {
				this.addGradualPopupShowing();
				this._supTemp.apply(this, this._supArgument);
				this.hideScrimLayer();
				this._isPopupAnimRunning = false;
				this.doPopUpAnimationEnd();
				this.waterfallDown("onPopUpAnimationEnd");
			} else if (this._isPopdownAnimRunning && inEvent.animationName === "pop-down") {
				this._isPopdownAnimRunning = false;
				this.doPopDownAnimationEnd();
				this.waterfallDown("onPopDownAnimationEnd");
			}
		},

		/**
		* Adds the gradual popup showing animation.
		*
		* @private
		*/
		addGradualPopupShowing: function() {
			var childCount, i;
			childCount = this.children.length;
			for (i = 0; i < childCount; i++) {
				this.children[i].addClass("g-popup-gradual-showing");
			}
		},

		/**
		* Removes the gradual popup showing animation.
		*
		* @private
		*/
		removeGradualPopupShowing: function() {
			var childCount, i;
			childCount = this.children.length;
			for (i = 0; i < childCount; i++) {
				this.children[i].removeClass("g-popup-gradual-showing");
			}
		},

		/**
		* Adding gradual popdown hiding animation
		*
		* @private
		*/
		addGradualPopupHiding: function() {
			var childCount, i;
			childCount = this.children.length;
			for (i = 0; i < childCount; i++) {
				this.children[i].addClass("g-popdown-gradual-hiding");
			}
		},

		/**
		* Removing gradual popdown hiding animation
		*
		* @private
		*/
		removeGradualPopupHiding: function() {
			var childCount, i;
			childCount = this.children.length;
			for (i = 0; i < childCount; i++) {
				this.children[i].removeClass("g-popdown-gradual-hiding");
			}
		},

		/**
		* Show popup scrim with animation
		*
		* @private
		*/
		showScrimAnimation: function(inShow) {
			var scrim, i, backgroundColor;
			if (this.floating && inShow) {
				scrim = this.getPopupScrimAnimation();
				// move the scrimAnimation just above the normal popup
				i = enyo.Popup.highestZ;
				this._scrimAnimationZ = i;
				backgroundColor = this.getPopupBgColor(this.getStyle());
				scrim.showAtZIndexAnimation(this._scrimAnimationZ, this.effect, backgroundColor);
			}
		},

		/**
		* Hide popup scrim with animation
		*
		* @private
		*/
		hideScrimAnimation: function(inShow) {
			var scrim, i, backgroundColor;
			if (this.floating && !inShow) {
				scrim = this.getPopupScrimAnimation();
				// move the scrimAnimation just above the normal popup
				i = enyo.Popup.highestZ;
				this._supTemp.apply(this, this._supArgument);
				this._scrimAnimationZ = i;
				backgroundColor = this.getPopupBgColor(this.getStyle());
				scrim.hideAtZIndexAnimation(this._scrimAnimationZ, this.effect, backgroundColor);
			}
		},

		/**
		* supTemp for render
		*
		* @private
		*/
		supTemp: function() {
			this._supTemp.apply(this, this._supArgument);
		},

		/**
		* 'getPopupBgColor' gets popup background-color
		*
		* @private
		*/
		getPopupBgColor: function(bgcolr) {
			bgcolr = bgcolr.slice(bgcolr.search("background-color"));
			bgcolr = bgcolr.slice(0, bgcolr.search(";"));
			bgcolr = bgcolr.slice(bgcolr.search(":") + 1);

			return bgcolr;
		},

		/**
		* Initiates Hide popup scrim with animation and
		* Instead of calling hideScrimAnimation function inside webkit animation,
		* its called after gradual Popup Hiding Time of 250 milliseconds
		* Because is the app developer destroys the component before webkit animation end
		* then hideScrimAnimation function cant be handled.
		*
		* @private
		*/
		initiateHideScrimAnimation: function(inShow) {
			if (this.floating && !inShow) {
				this.addGradualPopupHiding();
				this.hideScrimAnimation();
			}
		},

		/**
		* Hide popup scrim layer
		*
		* @private
		*/
		hideScrimLayer: function() {
			var scrim;
			if (this.floating && (this._scrimAnimationZ !== undefined)) {
				scrim = this.getPopupScrimAnimation();
				scrim.hideAtZIndex(this._scrimAnimationZ);
			}
		},

		/**
		* Making Singleton g.scrimAnimation for gpopup
		*
		* @private
		*/
		getPopupScrimAnimation: function() {
			if (this._animatedscrim === undefined) {
				this._animatedscrim = new g.PopupScrimAnimator({floating: true});
			}
			return this._animatedscrim;
		},

		/**
		* @private
		*/
		preventDrag: function() {
			return true;
		},

		/**
		* @private
		*/
		preventEvent: function() {
			return true;
		},

		/**
		* @private
		*/
		preventTap: function(inSender, inEvent) {
			inEvent.preventTap();
			return true;
		},

		/**
		* @private
		*/
		swiped: function(inSender, inEvent) {
			if (inEvent.direction === "right") { // close this popup
				this.hide();
				return true;
			}
			return true;
		},

		/**
		* @private
		*/
		keyup: function(inSender, inEvent) {
			if (this.showing && this.autoDismiss && (inEvent.keyCode == 27 /* escape */ || inEvent.keyIdentifier == "Wearable_F2" /* hw back */)) {
				this.hide();
				inEvent.closedByKey = true;
			}
		},

		/**
		* @fires g.Popup#onPopupRefresh
		*
		* @private
		*/
		refresh: function() {
			this.waterfallDown("onPopupRefresh", {type: "onPopupRefresh"});
		},

		/**
		* @private
		*/
		requestCreateCommandBarInScroller: function() {
			return true;
		}
	});

})(enyo, g, this);
