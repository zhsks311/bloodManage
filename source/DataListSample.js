enyo.kind({
	name: "MyListItem",
	kind: "g.Item",
	allowHtml: true,
	classes: "g-sample-datalist-item",
	components: [
		{
			classes: "list-item",
			components: [
				{name: "nickname", classes: "g-sample-datalist-item-title"},
				{name: "phonenumber", classes: "g-sample-datalist-item-genre"},
			]
		},
		{tag: "hr", style: "border: 0; color: #202328; height: 1px; background-color: #202328; bottom: 0;"}
	],
	bindings: [
		{from: ".model.nickname", to: ".$.nickname.content"},
		{from: ".model.phonenumber", to: ".$.phonenumber.content"}
	]
});

enyo.kind({
	name: "Sample.UI.DataListSample",
	kind: "g.Panel",
	knob: true,
	classes: "enyo-unselectable garnet main-view",
	components: [
		{
			name: "mylist",
			kind: "g.DataList",
			controlsPerPage: 4,
			style: "background-color: #000000;",
			headerComponents: [
			],
			components: [
				{kind: "MyListItem"}
			],
			footerComponents: [
			],
			ontap:"menuItemTapped"
		}
	],
	data: [
		{nickname: "david", phonenumber: "010-1234-5678"},
		{nickname: "smith", phonenumber: "010-1234-5678"},
		{nickname: "john", phonenumber: "010-1234-5678"},
		{nickname: "david", phonenumber: "010-1234-5678"},
		{nickname: "smith", phonenumber: "010-1234-5678"},
		{nickname: "john", phonenumber: "010-1234-5678"},
		{nickname: "david", phonenumber: "010-1234-5678"},
		{nickname: "david", phonenumber: "010-1234-5678"},
		{nickname: "smith", phonenumber: "010-1234-5678"},
		{nickname: "john", phonenumber: "010-1234-5678"},
		{nickname: "david", phonenumber: "010-1234-5678"},
		{nickname: "smith", phonenumber: "010-1234-5678"},
		{nickname: "john", phonenumber: "010-1234-5678"},
		{nickname: "david", phonenumber: "010-1234-5678"},
		{nickname: "david", phonenumber: "010-1234-5678"},
		{nickname: "smith", phonenumber: "010-1234-5678"},
		{nickname: "john", phonenumber: "010-1234-5678"},
		{nickname: "david", phonenumber: "010-1234-5678"},
		{nickname: "smith", phonenumber: "010-1234-5678"},
		{nickname: "john", phonenumber: "010-1234-5678"},
		{nickname: "david", phonenumber: "010-1234-5678"},
		{nickname: "david", phonenumber: "010-1234-5678"},
		{nickname: "smith", phonenumber: "010-1234-5678"},
		{nickname: "john", phonenumber: "010-1234-5678"},
		{nickname: "david", phonenumber: "010-1234-5678"},
		{nickname: "smith", phonenumber: "010-1234-5678"},
		{nickname: "john", phonenumber: "010-1234-5678"},
		{nickname: "david", phonenumber: "010-1234-5678"},
		{nickname: "david", phonenumber: "010-1234-5678"},
		{nickname: "smith", phonenumber: "010-1234-5678"},
		{nickname: "john", phonenumber: "010-1234-5678"},
		{nickname: "david", phonenumber: "010-1234-5678"},
		{nickname: "smith", phonenumber: "010-1234-5678"},
		{nickname: "john", phonenumber: "010-1234-5678"},
		{nickname: "david", phonenumber: "010-1234-5678"},
		{nickname: "david", phonenumber: "010-1234-5678"},
		{nickname: "smith", phonenumber: "010-1234-5678"},
		{nickname: "john", phonenumber: "010-1234-5678"},
		{nickname: "david", phonenumber: "010-1234-5678"},
		{nickname: "smith", phonenumber: "010-1234-5678"},
		{nickname: "john", phonenumber: "010-1234-5678"},
		{nickname: "david", phonenumber: "010-1234-5678"},
	],
	bindings: [
		{from: ".myContact", to: ".$.mylist.collection"}
	],
	create: function() {
		this.inherited(arguments);
		this.myContact = new enyo.Collection(this.data);
	},
	rendered: function() {
		this.inherited(arguments);
	},
	menuItemTapped: function(inSender, inEvent) {
		console.log("menu clicked : " + inEvent.index);

		var rec = this.myContact.at(inEvent.index);
		this.myContact.remove(rec);
	}
});

