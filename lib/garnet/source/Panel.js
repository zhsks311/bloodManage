(function (enyo, scope) {
	/**
	* Fired when the title of this panel is tapped.
	*
	* @event g.Panel#onTitleTap
	* @type {Object}
	* @property {Object} originalEvent - The original event fired from the title, which inherits
	* [enyo.Control]{@link http://enyojs.com/docs/latest/#/kind/enyo.Control} that fires the `ontap` event and
	* handles the event with ``` handlers:{ontap: "tap"} ```
	* @public
	*/

	/**
	* _g.Panel_ is an empty container control and is the default kind for controls
	* created inside a {@link g.PanelSet} container.
	* Typically, a {@link g.PanelSet} contains several instances of _g.Panel_.
	*
	* @class g.Panel
	* @public
	*/
	enyo.kind(
		/** @lends g.Panel.prototype */ {

		/**
		* @private
		*/
		name: 'g.Panel',

		/**
		* @private
		*/
		kind: 'enyo.Control',

		/**
		* @private
		* @lends g.Panel.prototype
		*/
		published:
			/** @lends g.Panel.prototype */ {

			/**
			* Indicates whether or not to show the commandBar.
			*
			* Range: [`true`, `false`]
			*
			* - `true`: Show the commandBar.
			* - `false`: Hide the commandBar.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			commandBar: true,

			/**
			* The title text of this Panel.
			*
			* @type {String}
			* @default ""
			* @public
			*/
			titleContent: '',

			/**
			* Indicates whether to show a title icon for this Panel.
			*
			* Range: [`true`, `false`]
			*
			* - `true`: Show the title icon.
			* - `false`: Hide the title icon.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			titleIcon: false,

			/**
			* Indicates whether to show a title for this Panel.
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
			* The text to be readout to describe what this Panel is for.
			* Note that this property is only effective when the
			* [titleContent]{@link g.Panel#titleContent} property is NOT defined.
			*
			* @type {String}
			* @default ""
			* @public
			*/
			accessibilityHint: '',

			/**
			* Indicates whether this Panel shows a knob.
			*
			* Range: [`true`, `false`]
			*
			* - `true`: Show the knob.
			* - `false`: Hide the knob.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			knob: false,

			/**
			* Indicates whether this Panel uses a wheel controller.
			*
			* Range: [`true`, `false`]
			*
			* - `true`: Show the wheel.
			* - `false`: Hide the wheel.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			wheel: false,

			/**
			* Indicates the time (in milliseconds) after which the wheel controller shall be automatically displayed
			* again after the `onScrollStop` event.
			*
			* @type {Number}
			* @default 300
			* @public
			*/
			wheelAutoShowTimeout: 300,

			/**
			* Indicates whether to enable browsing the Panels in a {@link g.PanelSet} by dragging or swiping.
			* If this property is `true`, Panel-browsing is effective. The default value is `true`.
			*
			* If panel browsing _is_ enabled and this panel _is_ inside a {@link g.PanelSet} container,
			* then the Panel behaves in the following ways:
			*
			* - When a Panel is dragged or swiped from left to right, the current Panel slides out of the screen rightwards
			* and the previous Panel slides into the screen from the left side of the screen.
			* - When a Panel is dragged or swiped from right to left, the current Panel slides out of the screen leftwards
			* and the next Panel slides into the screen from the right side of the screen.
			*
			* Range: [`true`, `false`]
			*
			* - `true`: Panels in a {@link g.PanelSet} are slidable by dragging or swiping.
			* - `false`: Panels in a {@link g.PanelSet} are not slidable by dragging or swiping.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			enablePanelMoveEvent: true,

			/**
			* Indicates whether {@link g.PanelSet} shall display a PageIndicator for this Panel or not.
			*
			* Range: [`true`, `false`]
			*
			* - `true`: {@link g.PanelSet} shows a PageIndicator for this Panel.
			* - `false`: {@link g.PanelSet} hides a PageIndicator for this Panel.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			pageIndicatorDisable: false,

			/**
			* Indicates whether {@link g.PanelSet} shall display a fade out background effect for
			* the PageIndicator used in this Panel.
			*
			* Range: [`true`, `false`]
			*
			* - `true`: {@link g.PanelSet} shows a fade out effect for the PageIndicator used in this Panel.
			* - `false`: {@link g.PanelSet} hides a fade out effect for the PageIndicator used in this Panel.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			pageIndicatorFadeOut: true
		},

		/**
		* @private
		*/
		events: {
			onTitleTap: '',
			onTitleClick: ''
		},

		/**
		* @private
		*/
		handlers: {
			/* from DataList */
			onDataAdded: 'dataUpdated',           // to title
			onDataRemoved: 'dataUpdated',         // to title
			/* from Scroller */
			onScrollStart: 'scrollStart',         // to title, knob, wheel
			onScroll: 'scroll',                   // to knob
			onScrollStop: 'scrollStop',           // to knob, wheel
			onScrollSync: 'scrollSync',           // to knob
			/* from PanelSet */
			onPreparePanelAnimation: "knobHide",  // to knob
			onStartPanelAnimation: "knobShow",    // to knob
			onEndPanelAnimation: "knobDelayHide", // to knob
			/* from Popup */
			onPopUpAnimationEnd: "knobShow",      // to knob
			/* Used directly */
			ondragfinish: "preventTap",
			onSwipe: "swiped",

			onRequestCreateCommandBarInScroller: 'createCommandBarInScroller'
		},
		/**
		* @private
		*/
		commandBarComponents: [],

		/**
		* @private
		*/
		_knobControlMode: false,

		/**
		* @private
		*/
		_wheelControlMode: false,

		/**
		* @private
		*/
		_verticalGestureTangent: 1, // or lower, Math.abs(dx / dy), tangent(45 degree)

		/**
		* @private
		*/
		_horizontalGestureTangent: 1, // or higher, Math.abs(dx / dy), tangent(45 degree)

		/**
		* @private
		*/
		_indexChar: null,

		/**
		* @private
		*/
		commandBarClientContainer: undefined,

		/**
		* @private
		*/
		classes: 'g-panel',

		/**
		* @private
		*/
		titleConfig: {name: 'title', kind: 'g.PanelTitle', ontap: 'titleTapped', onclick: "titleClicked"},
		pageIndicatorFadeoutConfig: {name: 'indicatorFadeout', classes: "g-panel-fadeout"},
		knobConfig: {name: 'knob', kind: 'g.ScrollerKnob', onChange: 'knobChange', onKnobControlBegin: 'knobControlBegin', onKnobControlEnd: 'knobControlEnd'},
		wheelConfig: {name: 'wheel', kind: 'g.WheelSectionListController', onChange: 'wheelChange', onWheelControlBegin: 'wheelControlBegin', onWheelControlEnd: 'wheelControlEnd'},
		commandBarConfig: {name: 'commandBar', kind: 'g.CommandBar'},

		/**
		* @private
		*/
		bindings: [
			{from: '.commandBar', to: '.$.commandBar.showing', transform: function(val) {
				if (this.$.commandBar === undefined) {
					return false;
				} else {
					return val;
				}
			}},
			{from: '.titleContent', to: '.$.title.content'},
			{from: '.titleIcon', to: '.$.title.icon'}
		],

		/**
		* @method
		* @private
		*/
		create: enyo.inherit(function(sup) {
			return function() {
				sup.apply(this, arguments);
				if (this.title) {
					this.createComponent(enyo.clone(this.titleConfig || {}), {owner:this});
				}

				this.createComponent(enyo.clone(this.pageIndicatorFadeoutConfig || {}), {owner:this});

				if (this.knob) {
					if (!this.$.knob) {
						this.createComponent(enyo.clone(this.knobConfig || {}), {owner:this});
					}
				}

				if (this.wheel) {
					this.createComponent(enyo.clone(this.wheelConfig || {}), {owner:this});
				}

				if (this.commandBar && this.commandBarComponents && this.commandBarComponents.length > 0) {
					var owner = this.hasOwnProperty('commandBarComponents') ? this.getInstanceOwner() : this,
						container = this.commandBarClientContainer ? this.commandBarClientContainer : this;

					container.createComponent(enyo.clone(this.commandBarConfig || {}), {owner:this});
					this.$.commandBar.createComponents(this.commandBarComponents, {owner: owner, preventDrag: true});
				}

				this.pageIndicatorFadeOutChanged();
			};
		}),

		createCommandBarInScroller: function(inSender, inEvent) {
			this.commandBarClientContainer = inEvent.originator.$.strategy && inEvent.originator.$.strategy.$.clientContainer;
		},

		/**
		* @private
		*/
		scrollStart: function(inSender, inEvent) {
			var originator = inEvent.originator;

			if (!this._knobControlMode && this.$.title instanceof g.PanelTitle) {
				if (inEvent.scrollBounds.height > g.height) {
					if (originator.vertical && originator.uy - originator.py > 0) {
						this.$.title.setShowAfterScrollStop(true);
					} else {
						this.$.title.setShowing(false);
					}
				}
			}
			if (this.$.knob && this.knob) {
				this.$.knob.scrollSync(inEvent.scrollBounds);
				this.$.knob.scrollStarted();
			}
			if (this.$.wheel && this.wheel && !this._wheelControlMode) {
				this.$.wheel.hideSectionList();
				this.stopJob('wheelAutoShow');
			}
		},

		/**
		* @private
		*/
		scroll: function(inSender, inEvent) {
			if (this.$.knob && this.knob) {
				this.$.knob.scrolled(inEvent.scrollBounds);
			}

			return true;
		},

		/**
		* @private
		*/
		scrollStop: function(inSender, inEvent) {
			if (!this._knobControlMode && this.$.title instanceof g.PanelTitle) {
				if (inEvent.scrollBounds.height > g.height) {
					this.$.title.scrollStop();
				}
			}
			if (this.$.wheel && this.wheel) {
				this.startJob('wheelAutoShow', '_showWheel', this.getWheelAutoShowTimeout());
			}
			if (this.$.knob && this.knob && this._knobControlMode === false) {
				this.$.knob.scrollStopped();
			}
		},

		/**
		* @private
		*/
		scrollSync: function(inSender, inEvent) {
			if (this.$.knob && this.knob) {
				this.$.knob.scrollSync(inEvent.scrollBounds);
			}

			return true;
		},

		/**
		* @private
		*/
		dataUpdated: function(inSender, inEvent) {
			if (this.title && !this._knobControlMode) {
				this.$.title.setShowing(true);
			}
		},

		/**
		* @private
		*/
		knobControlBegin: function(inSender, inEvent) {
			this._knobControlMode = true;
			this.waterfallDown('onKnobControlBegin', inSender, inEvent);
		},

		/**
		* @private
		*/
		knobControlEnd: function(inSender, inEvent) {
			this._knobControlMode = false;
			if (this.title && inEvent.scrollTo === 0) {
				this.$.title.setShowing(true);
			}
			this.waterfallDown('onKnobControlEnd', inSender, inEvent);
		},

		/**
		* @private
		*/
		wheelControlBegin: function(inSender, inEvent) {
			this._wheelControlMode = true;
		},

		/**
		* @private
		*/
		wheelControlEnd: function(inSender, inEvent) {
			this._wheelControlMode = false;
		},

		/**
		* @private
		*/
		_showWheel: function() {
			this.$.wheel.showSectionList();
		},

		/**
		* @private
		*/
		titleChanged: function() {
			if (this.$.title === undefined) {
				this.createComponent(enyo.clone(this.titleConfig || {}), {owner:this});
				this.$.title.render();
			}

			this.$.title[this.title ? "showDirect" : "hideDirect"](this.title);
			return true;
		},

		/**
		* @private
		*/
		titleContentChanged: function() {
			if (this.$.title !== undefined) {
				this.$.title.render();
			}
			return true;
		},

		/**
		* @private
		*/
		knobChange: function(inSender, inEvent) {
			if (this.title) {
				this.$.title.setShowing(false);
			}
			this.waterfallDown('onKnobDrag', {originator: inEvent.originator, scrollTo: inEvent.scrollTo});
			return true;
		},

		/**
		* @private
		*/
		wheelChange: function(inSender, inEvent) {
			var originator = inEvent.originator;

			this._indexChar = originator.get("sectionLabelList")[inEvent.sectionIndex];
			this.stopJob("jumpToIndex");
			this.startJob("jumpToIndex", this._jumpToIndex);

			return true;
		},

		/**
		* @private
		*/
		knobHide: function() {
			if (this.$.knob && this.knob) {
				this.$.knob.cancelDelayHide();
				this.$.knob.hide();
			}
		},

		/**
		* @private
		*/
		knobShow: function(inSender, inEvent) {
			if (this.$.knob && this.knob) {
				this.$.knob.cancelDelayHide();
				this.$.knob.show();
			}
		},

		/**
		* @private
		*/
		knobDelayHide: function() {
			if (this.$.knob && this.knob) {
				this.$.knob.delayHide();
			}
		},

		/**
		* @private
		*/
		pageIndicatorDisableChanged: function() {
			this.pageIndicatorFadeOutChanged();
		},

		/**
		* @private
		*/
		pageIndicatorFadeOutChanged: function() {
			this.addRemoveClass("g-panel-page-indicator-fade-out-disable", this.pageIndicatorDisable || !this.pageIndicatorFadeOut);
		},

		/**
		* @private
		*/
		_jumpToIndex: function () {
			this.waterfallDown('onWheelChange', {scrollTo: this._indexChar});
		},

		/**
		* @private
		*/
		_getMasterContainer: function() {
			return this.container;
		},

		/**
		* @private
		*/
		preventTap: function(inSender, inEvent) {
			inEvent.preventTap();
			return false;
		},

		/**
		* The event handler for the swipe event (`onSwipe`).
		*
		* @param {enyo.Component} inSender - The [enyo.Component]{@link http://enyojs.com/docs/latest/#/kind/enyo.Component} that most recently propagated the `event`.
		* @param {Object} inEvent - An `object` containing the event information.
		* @public
		*/
		swiped: function(inSender, inEvent) {
			var container = this._getMasterContainer();
			if (this.enablePanelMoveEvent && container && container._panelSetInherited === true && !inEvent._ComponentHandled) {
				switch (inEvent.direction) {
				case "up":    this._gestureUp();    break;
				case "down":  this._gestureDown();  break;
				case "left":  this._gestureLeft();  break;
				case "right": this._gestureRight(); break;
				}
				return true;
			}
			return false;
		},

		/**
		* Handles `tap` event on title, firing custom
		* [onTitleTap]{@link g.Panel#onTitleTap} event.
		*
		* @fires g.Panel#onTitleTap
		* @private
		*/
		titleTapped: function(inSender, inEvent) {
			this.doTitleTap({originalEvent: enyo.clone(inEvent, true)});
			if (this.titleIcon) {
				this.playFeedback(inSender, inEvent);
			}
		},

		/**
		* Plays the touch feedback sound when the title of this panel is tapped.
		*
		* @param {enyo.Component} inSender - The [enyo.Component]{@link http://enyojs.com/docs/latest/#/kind/enyo.Component} that most recently
		* propagated the `event`.
		* @param {Object} inEvent - An `object` containing
		* event information.
		* @public
		*/
		playFeedback: function(inSender, inEvent) {
			if (!inEvent || inEvent && !inEvent.preventSound) {
				g.playFeedback("touch");
				if (inEvent) {
					inEvent.preventSound = true;
				}
			}
		},

		/**
		* Handles `click` event on title, firing custom
		* [onTitleClick]{@link g.Panel#onTitleClick} event.
		*
		* @fires g.Panel#onTitleClick
		* @private
		*/
		titleClicked: function(inSender, inEvent) {
			this.doTitleClick({originalEvent: enyo.clone(inEvent, true)});
		},

		/**
		* @private
		*/
		_gestureUp: function() {
		},

		/**
		* @private
		*/
		_gestureDown: function() {
		},

		/**
		* @private
		*/
		_gestureLeft: function() {
			var container = this._getMasterContainer();
			if (container) {
				container.next();
			}
		},

		/**
		* @private
		*/
		_gestureRight: function() {
			var container = this._getMasterContainer();
			if (container) {
				container.previous();
			}
		}
	});

})(enyo, this);
