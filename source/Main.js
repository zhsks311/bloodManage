enyo.kind({
	name: "Sample.UI.MainList",
	published: {
		blood_date : 0,
		blood_type : 0,
		counter:0,
		waiting : 0
	},
	classes: "enyo-unselectable garnet main-view",
	components: [
		{
			name: "panels",
			kind: "g.PanelSet",
			fit: true,
			pageIndicator: false,
			effect: "depth-transition",
			components: [
				{name: "buttonSample",kind: "Sample.UI.ButtonSample",style: " background-image:url('./assets/menuhome.png');"},
				{name: "searchmapSample", kind: "Sample.UI.SearchMapSample"},
				{name: "mybloodSample", kind: "Sample.UI.MyBloodSample"},
				{name: "spinnerSample", kind: "Sample.UI.SpinnerSample"},
				//{name: "injectbloodSample", kind: "Sample.UI.InjectBloodSample"},
				{name: "bloodinfoSample", kind: "Sample.UI.BloodInfoSample",style: " background-image:url('./assets/online2.png');"},
				{name: "popupSample", kind: "g.sample.PopupSample"},
				{name: "mapSample", kind: "g.sample.MapSample"}



			]
		}
	],
	create: function () {
		this.inherited(arguments);
	},
	rendered: function () {
		this.inherited(arguments);
	},
});


// After Enyo framework loaded, a callback function specified by enyo.ready() is called.
// This sample app does not require any device API, sample app is launched when Enyo loaded.
enyo.ready(function () {
	new Sample.UI.MainList().renderInto(document.body);
});
