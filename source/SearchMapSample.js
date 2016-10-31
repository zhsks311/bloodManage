enyo.kind({
	name: "Sample.UI.SearchMapSample",
	kind: "g.Panel",
	events: {
		onResult: "",
		onSwipe: "eventHandler"
	},
	classes: "g-layout-absolute-wrapper",
	style: "border-radius: 50%; background-color: #FFFFFF;",
	components: [
		{kind: "g.Icon", src: "assets/house.svg", classes: "g-sample-icon-black-background-color", style: "font-size:80px; top:60px; margin-left:130px;"},
		{content: "헌혈의 집 찾기", style: " top:130px; font-size: 30px;  margin-left: 60px; color: #000000;"},
		{
			classes: "g-layout-absolute-center", style: "top:300px; width: 280px; height: 230px;",
			components: [
				{
					name: "btnFromAdr", kind: "g.Button", content: "주소로", ontap: "tapButton",
					style: "font-size:25px; left:40px; height:50px; margin-left: 40px; background-color: #FFD966; color: #000000; top: 10px"
				}
			]
		}
	],
	tapButton: function(inSender, inEvent) {
		this.doResult({msg: "&quot;" + inSender.name + "&quot; pressed."});

		if (inSender.name == "btnFromAdr") {
			console.log("btnFromAdr clicked");
			this.owner.$.panels.selectPanelByName("popupSample");
		}
		//else if (inSender.name == "btnFromMe") {
		//	this.owner.$.panels.selectPanelByName("mybloodSample");
		//	console.log("btn2 clicked");
		//}

	},
	eventHandler: function(inSender, inEvent) {
		if (inEvent.direction === "right") {
			this.owner.$.panels.selectPanelByName("buttonSample");
		}
	},
});

enyo.kind({
	name: "SearchHouse",
	classes: "enyo-unselectable garnet g-sample",
	components: [
		{content: "< Button Sample", classes: "g-sample-header", ontap: "goBack"},

		{content: "Buttons", classes: "g-sample-subheader"},
		{kind: "g.sample.ButtonPanel", style: "position: relative;", onResult: "result"},

		{style: "position: fixed; width: 100%; min-height: 160px; bottom: 0; z-index: 9999; background-color: #EDEDED; opacity: 0.8;", classes: "g-sample-result", components: [
			{content: "Result", classes: "g-sample-subheader"},
			{name: "result", allowHtml: true, content: "No button pressed yet.", classes: "g-sample-description"}
		]}
	],
	result: function(inSender, inEvent) {
		this.$.result.setContent(inEvent.msg);
	}
	//goBack: function(inSender, inEvent) {
	//	history.go(-1);
	//	return false;
	//}
});
