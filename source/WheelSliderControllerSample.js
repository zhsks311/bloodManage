enyo.kind({
	name: "Sample.UI.WheelSliderControllerSample",
	kind: "g.Panel",
	classes: "enyo-unselectable garnet main-view",
	components: [
		{
			name: "wheelSlider",
			kind: "g.WheelSliderController",
			style: "position: relative; border-radius: 50%; background-color: #000000;",
			onStopSliderAnimation: "stopDigitAnimation",
			minimumValue: 0,
			maximumValue: 360,
			stepValue: 10,
			value: 90,
			onChange: "changeEventHandler",
			onChanging: "changingEventHandler",
			components: [
				{name: "sampleValue", content: "30", style: "display: block; width: 100%; margin-top: 60px; height: 99px; text-align: center; font-weight: 400; font-size: 100px;"},
				{style:"margin-top: 15px;", components: [
					{name: "cancel", kind: "g.IconButton", ontap: "tapCancel", classes: "wheel-slider-cancel-image"},
					{name: "ok", kind: "g.IconButton", ontap: "tapOK", classes: "wheel-slider-ok-image"}
				]}
			],

		},
	],
	bindings: [
		{from: ".$.wheelSlider.value", to: ".$.sampleValue.content"}
	],
	create: function() {
		this.inherited(arguments);
	},
	rendered: function() {
		this.inherited(arguments);
	},
	changingEventHandler: function(inSender, inEvent) {
		console.log("changing inEvent.value : " + inEvent.value);
	},
	changeEventHandler: function(inSender, inEvent) {
		console.log("change inEvent.value : " + inEvent.value);
	},
	tapOK: function() {
		console.log("OK!");
	},
	tapCancel: function() {
		console.log("Cancel!!");
	}
});