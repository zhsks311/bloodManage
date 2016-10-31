enyo.kind({
	name: "Sample.UI.BloodInfoSample",
	kind: "g.Panel",
	handlers: {
		onSwipe: "eventHandler"
	},
	classes: "enyo-unselectable garnet main-view",
		components: [
			{name: "myGroup", components: [
				{ style: "font-size: 20px; display: inline-block; margin-right: 20px; color: #FFFFFF;"},
				{name: "btn1", kind: "g.Button", content: "전자문진하러가기", ontap: "gotoURL", style:"position:absolute; width:280px; height:280px; font-size:15px; top:20px; left:20px; opacity:0;"},

			]},
			{name: "toast", kind: "g.Toast", allowHtml: true, content: "Toast<br><br>Saved"},
			{name: "customPopup", kind: "CustomPopup1"}
		],
			create: function() {
		this.inherited(arguments);
	},
	rendered: function() {
		this.inherited(arguments);
	},
	tapButton: function(inSender, inEvent) {
		if(inSender.name == "btn1") {
			console.log("btn1 clicked");
			this.onlineQuestion();
		}
	},
	showToastPopup: function(inSender, inEvent) {
		this.$.toast.setDuration(1500);
		this.$.toast.show();
	},
	onlineQuestion: function () {
		location.replace("http://www.bloodinfo.net/emi_bldqualify.do?action=emiPopup");
	},
	// recognize drag right to close app
	eventHandler: function(inSender, inEvent) {
		if (inEvent.direction === "right") {
			this.owner.$.panels.selectPanelByName("buttonSample");
		}
	},
	gotoURL: function() {
		var sendingMessage = {
			"peerIntent": {
				"action": "android.intent.action.VIEW",
				"data": "http://www.bloodinfo.net/emi_bldqualify.do?action=emiPopup"
			}
		}
		var request = new enyo.ServiceRequest({
			service: "palm://com.lge.watchmanager",
			method: "startActivityOnPeer",
			params: sendingMessage
		});
		request.release = enyo.bind(this, this.release, request);
		request.response(this, this.callbackSuccess);
		request.error(this, this.callbackFailure);
		request.go(sendingMessage);
	},
	callbackFailure: function(inEvent) {
		console.log("연결실패");
	},
	callbackSuccess: function(inEvent) {
		console.log("연결성공 휴대폰을 확인하세요.");
	},
	release: function(inEvent) {
	}
});

enyo.kind({
	name: "CustomPopup1",
	kind: "g.Popup",
	style: "overflow: hidden;",
	popupEffect: true,
	onPopUpAnimationEnd: "popUpEnd",
	onPopDownAnimationEnd: "popDownEnd",
	components: [
		{classes: "g-common-width-height-fit", style: "overflow: hidden; margin-top: 30px", components: [
			{style: "width: 200px; margin: auto;", content: "Garnet is a UI library built for wearable devices and is based on Enyo."},
			{name: "button", kind: "g.Button", content: "OK!!!", ontap: "tapOK", style: "margin: 20px 0 70px;"}
		]}
	],
	tapOK: function() {
		this.hide();
	}
});

enyo.kind({
	name:"PanelSetSample1",
	kind:"g.panelset",
	components:[
		{
			name:"panelSet",
			effect: "depth-transition",
			kind: "Sample.UI.PanelSetSample",
		}
	]
})