/**
	_g.DataListSampleItem_ is a list item for data list.
*/
enyo.kind({
	name: "g.DataListSampleItem",
	kind: "g.Item",
	classes: "g-sample-datalist-item",
	handlers: {
		onItemDown: "itemDown"
	},
	published: {
		selected: false
	},
	components: [
		// {name: "iconUrl", kind: "g.IconButton", style: "margin-left: 38px;"},
		{name: "albumTitle", classes: "g-sample-datalist-item-title"},
		{name: "albumGenre", classes: "g-sample-datalist-item-genre"},
		{tag: "hr", style: "border: 0; color: #202328; height: 1px; background-color: #202328; bottom: 0;"}
	],
	bindings: [
		// {from: ".model.iconUrl", to: ".$.iconUrl.src"},
		{from: ".model.albumTitle", to: ".$.albumTitle.content"},
		{from: ".model.albumGenre", to: ".$.albumGenre.content"},
		{from: ".model.disabled", to: ".disabled"}
	],
	create: enyo.inherit(function(sup) {
		return function() {
			sup.apply(this, arguments);
			this.selectedChanged();
		};
	}),
	selectedChanged: function() {
		this.addRemoveClass("selected", this.selected);
	},
	disabledChanged: function() {
		this.addRemoveClass("disabled", this.disabled);
	},
	itemDown: function(inSender, inEvent) {
	}
});

/**
	_g.sample.DataListPanel_ is specilized _g.Panel_ contains a list.
	This panel has headerComponents and footerCompoents
*/
enyo.kind({
	name: "g.sample.DataListPanel",
	kind: "g.Panel",
	//* @protected
	// title: true,
	// titleContent: "Title",
	knob: true,
	components: [
		{
			name: "list",
			kind: "g.DataList",
			controlsPerPage: 4,
			style: "background-color: #000000;",
			headerComponents: [
				
			],
			components: [
				{kind: "g.DataListSampleItem", onlongpress: "showPopup"}
			],
			footerComponents: [
				
			]
		}
	],
	bindings: [
		{from: ".collection", to: ".$.list.collection"}
	]
});

/**
	DataListSample is main page.

**/
enyo.kind({
	name: "g.sample.DataListSample",
	components: [
		{name: "listPanel", kind: "g.sample.DataListPanel", style: "position: relative;"}
	],
	bindings: [
		{from: ".collection", to: ".$.listPanel.collection"}
	],
	create: enyo.inherit(function(sup) {
		return function() {
			sup.apply(this, arguments);
			this.collection = new enyo.Collection(this.data);
		};
	}),
	data: [
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Looooooooooooong Title", albumGenre: "Rock", disabled: true},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Marquez", albumGenre: "Pop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Barr", albumGenre: "Hiphop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Everett", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Crane", albumGenre: "Ballad"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Raymond", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Looooooooooooong Title", albumGenre: "Pop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Kristina", albumGenre: "Ballad"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Barbra", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Tracey", albumGenre: "Hiphop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Alejandra", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Marquez", albumGenre: "Pop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Barr", albumGenre: "Hiphop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Everett", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Crane", albumGenre: "Ballad"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Raymond", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Looooooooooooong Title", albumGenre: "Pop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Kristina", albumGenre: "Ballad"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Barbra", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Tracey", albumGenre: "Hiphop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Alejandra", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Marquez", albumGenre: "Pop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Barr", albumGenre: "Hiphop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Everett", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Looooooooooooong Title", albumGenre: "Ballad"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Raymond", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Petersen", albumGenre: "Pop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Kristina", albumGenre: "Ballad"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Barbra", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Looooooooooooong Title", albumGenre: "Hiphop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Alejandra", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Marquez", albumGenre: "Pop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Barr", albumGenre: "Hiphop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Everett", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Crane", albumGenre: "Ballad"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Raymond", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Petersen", albumGenre: "Pop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Kristina", albumGenre: "Ballad"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Barbra", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Tracey", albumGenre: "Hiphop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Alejandra", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Marquez", albumGenre: "Pop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Barr", albumGenre: "Hiphop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Everett", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Crane", albumGenre: "Ballad"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Raymond", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Petersen", albumGenre: "Pop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Kristina", albumGenre: "Ballad"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Barbra", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Tracey", albumGenre: "Hiphop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Alejandra", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Marquez", albumGenre: "Pop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Barr", albumGenre: "Hiphop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Everett", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Crane", albumGenre: "Ballad"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Raymond", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Petersen", albumGenre: "Pop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Kristina", albumGenre: "Ballad"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Barbra", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Tracey", albumGenre: "Hiphop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Alejandra", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Marquez", albumGenre: "Pop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Barr", albumGenre: "Hiphop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Everett", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Crane", albumGenre: "Ballad"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Raymond", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Petersen", albumGenre: "Pop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Kristina", albumGenre: "Ballad"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Barbra", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Tracey", albumGenre: "Hiphop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Alejandra", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Marquez", albumGenre: "Pop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Barr", albumGenre: "Hiphop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Everett", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Crane", albumGenre: "Ballad"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Raymond", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Petersen", albumGenre: "Pop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Kristina", albumGenre: "Ballad"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Barbra", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Tracey", albumGenre: "Hiphop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Alejandra", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Marquez", albumGenre: "Pop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Barr", albumGenre: "Hiphop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Everett", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Crane", albumGenre: "Ballad"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Raymond", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Petersen", albumGenre: "Pop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Kristina", albumGenre: "Ballad"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Barbra", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Tracey", albumGenre: "Hiphop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Alejandra", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Marquez", albumGenre: "Pop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Barr", albumGenre: "Hiphop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Everett", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Crane", albumGenre: "Ballad"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Raymond", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Petersen", albumGenre: "Pop"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Kristina", albumGenre: "Ballad"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Barbra", albumGenre: "Rock"},
		{iconUrl: "./assets/ic_dialog_alert.svg", albumTitle: "Tracey", albumGenre: "Hiphop"}
	]
});
