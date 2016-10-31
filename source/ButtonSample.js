enyo.kind({
	name: "Sample.UI.ButtonSample",
	kind: "g.Panel",
	classes: "enyo-unselectable garnet main-view",
	handlers: {
		onSwipe: "eventHandler"
	},
	components: [
		{
			name: "myGroup", components: [
			{style: "font-size: 20px; display: inline-block; margin-right: 20px; color: #FFFFFF;"},
			{
				name: "btn1",
				kind: "g.Button",
				content: "헌혈의집",
				ontap: "tapButton",
				style: "position:absolute; width:120px; height:60px; font-size:15px; top:70px; opacity:0;"
			},
			{style: "font-size: 20px; display: inline-block; margin-right: 10px; color: #FFFFFF;"},
			{
				name: "btn2",
				kind: "g.Button",
				content: "나의헌혈",
				ontap: "tapButton",
				style: "position:absolute; width:120px; height:60px; font-size:15px; top:70px; left:180px; opacity:0;"
			},
			{style: "font-size: 20px; display: inline-block; margin-right: 10px; color: #FFFFFF;"},
			{
				name: "btn3",
				kind: "g.Button",
				content: "내정보입력",
				ontap: "tapButton",
				style: "position:absolute; width:120px; height:60px; font-size:15px; top:190px; left:20px; opacity:0;"
			},
			{style: "font-size: 20px; display: inline-block; margin-right: 10px; color: #FFFFFF;"},
			{
				name: "btn4",
				kind: "g.Button",
				content: "헌혈정보",
				ontap: "tapButton",
				style: "position:absolute; width:120px; height:60px; font-size:15px; top:190px; left:180px; opacity:0;"
			},

			//{content: "Confirm Popup", style: "font-size: 25px; display: inline-block; margin-right: 10px; color: #FFFFFF;"},
			//{name: "btn2", kind: "g.Button", content: "click", ontap: "tapButton"},
		]
		},

	],
	create: function () {
		this.inherited(arguments);
	},
	rendered: function () {
		this.inherited(arguments);
	},
	tapButton: function (inSender, inEvent) {
		if (inSender.name == "btn1") {
			console.log("btn1 clicked");
			this.owner.$.panels.selectPanelByName("searchmapSample");
		} else if (inSender.name == "btn2") {
			this.owner.$.panels.selectPanelByName("mybloodSample");
			console.log("btn2 clicked");
			console.log("create : "+blood_date);
			this.owner.$.mybloodSample.bloodDonation_date = blood_date+"";
		} else if (inSender.name == "btn3") {
			console.log("btn3 clicked");
			this.owner.$.panels.selectPanelByName("spinnerSample");
		} else if (inSender.name == "btn4") {
			console.log("btn4 clicked");
			this.owner.$.panels.selectPanelByName("bloodinfoSample");
		}
	},
	showToastPopup: function (inSender, inEvent) {
		this.$.toast.setDuration(1500);
		this.$.toast.show();
	},
	// recognize drag right to close app
	eventHandler: function(inSender, inEvent) {
		if (inEvent.direction === "right") {
			this.owner.$.panels.selectPanelByName("buttonSample");
		}
	},
});

enyo.kind({
	name: "CustomPopup",
	kind: "g.Popup",
	style: "overflow: hidden;",
	popupEffect: true,
	onPopUpAnimationEnd: "popUpEnd",
	onPopDownAnimationEnd: "popDownEnd",
	components: [
		{
			classes: "g-common-width-height-fit", style: "overflow: hidden; margin-top: 30px", components: [
			{
				style: "width: 200px; margin: auto;",
				content: "Garnet is a UI library built for wearable devices and is based on Enyo."
			},
			{name: "button", kind: "g.Button", content: "OK!!!", ontap: "tapOK", style: "margin: 20px 0 70px;"}
		]
		}
	],
	tapOK: function () {
		this.hide();
	}
});
//
//enyo.kind({
//    name: "PanelSetSample",
//    kind: "g.panelset",
//    components: [
//        {
//            name: "panelSet",
//            effect: "depth-transition",
//            kind: "Sample.UI.PanelSetSample",
//        }
//    ]
//})