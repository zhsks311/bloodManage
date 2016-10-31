enyo.kind({
	name: "Sample.UI.PanelSetSample",
	kind: "g.Panel",
	classes: "enyo-unselectable garnet main-view",
	components: [
		{
			name: "panelSet",
			kind: "g.PanelSet",
			pageIndicator: true,
			// effect: "depth-transition",
			effect: "move-transition",
			style: "position: relative; background-color: #000000;",
			components: [
				{kind: "g.Panel", name: "panel1", style: "background-color: black;", components: [
					{content: "Text 1", style: "padding-top: 23px; text-align: center;"},
					{content: "Text 2", style: "text-align: center;"},
					{content: "Text 3", style: "text-align: center;"}
				]},
				{kind: "g.Panel", name: "panel2", style: "background-color: black;", components: [
					{content: "Day 1", style: "padding-top: 23px; text-align: center;"},
					{content: "Day 2", style: "text-align: center;"},
					{content: "Day 3", style: "text-align: center;"},
					{content: "Day 4", style: "text-align: center;"},
					{content: "Day 5", style: "text-align: center;"}
				]}
			]
		}
	],
	create: function() {
		this.inherited(arguments);
	},
	rendered: function() {
		this.inherited(arguments);
	},
});