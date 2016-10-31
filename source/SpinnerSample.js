
enyo.kind({
	name: "Sample.UI.SpinnerSample",
	kind: "g.Panel",
	classes: "enyo-unselectable garnet main-view",
	events: {
		onResult: ""
	},
	handlers: {
		onCancel: "tapCancel",
		onOK: "tapOK",
		ontap: "tapOK",
		onSwipe: "eventHandler"
	},
	title: true,
	titleContent: "정보 입력",

	components: [
		// {kind: "g.Spinner", style: "position: relative; width: 100%; top: 30%;",
		//  content: "Connecting to the server"}
		{classes: "enyo-unselectable garnet main-view", style: "overflow: hidden; background-color:white !important;", components: [
			{kind: "g.Scroller", scrollIndicatorEnabled: true, style: "width: 320px; height: 320px; border-radius: 50%; background-color: #F6F6F6;", components: [
				{style: "width: 100%; height: 57px;"},

				{kind: "g.FormLabel", content: "> 헌혈 날짜", style: "color: #000000;"},
				{name: "datePickerButton", kind: "g.FormPickerButton", content: "None", ontap: "showDatePickerPopup"},

				{kind: "g.FormLabel", content: "> 헌혈 종류", style: "color: #000000;"},
				{name: "pickerPanelButtonWithcustomValue", kind: "g.FormPickerButton", content: "None", ontap: "showPickerPanelPopupWithcustomValue"},

				// {kind: "g.FormLabel", content: "_________________________", style: "color: #FF0000;"},



				{name: "btn4", kind: "g.Button", content: "+", style: "font-size: 40px; display: inline-block; margin-left: 130px; color: #FFE400;",ontap: "tapbutton"},


			]}
		]},

		{
			name: "datePickerPopup",
			kind: "g.Popup",
			style: "background-color: white;",
			effect: "depth-transition",
			components: [
				{
					name: "datePicker",
					kind: "g.DatePickerPanel"
				}
			]
		},

		{
			name: "pickerPanelPopup",
			kind: "g.Popup",
			effect: "depth-transition",
			components: [
				{style: "background-color: white !important; position: relative;", classes: "enyo-unselectable garnet main-view g-layout-absolute-wrapper", components: [
					{name: "pickerPanel", kind: "g.PickerPanel", title:true, titleContent: "PickerTitle", ontap: "hidePickerPanelPopup"}
				]}
			]
		},
		//------------------------------------------------------------------------------
		{
			name: "pickerPanelPopupWithcustomValue",
			kind: "g.Popup",
			effect: "depth-transition",
			style: "background-color: #ffffff !important; ",
			components: [
				{
					style: "background-color: #ffffff !important; position: relative;font-color:black;",
					classes: "enyo-unselectable garnet main-view g-layout-absolute-wrapper panel_back",
					components: [
						{style: "background-color: #ffffff !important;",
							name: "pickerPanelWithcustomValue",
							kind: "g.PickerPanel",
							classes:"panel_back",
							title:true,
							titleContent: "헌혈 종류",
							ontap: "hidePickerPanelPopupWithcustomValue"}
					]}
			]
		},
		//---------------------------------------------------------------------------
	],
	create: function() {
		this.inherited(arguments);
	},
	rendered: function() {
		this.inherited(arguments);
	},
	tapbutton: function (inSender, inEvent) {
		blood_date1 = this.$.datePickerButton.content;
		console.log("log : " + this.owner.blood_date);
		this.owner.setBlood_date(blood_date1);
		console.log("log : " + this.owner.blood_date);

		this.owner.setCounter(1);
		console.log("counter : "+this.owner.counter);





		this.owner.$.panels.selectPanelByName("buttonSample");

	},

	bindings: [

		{from: ".collection", to: ".$.pickerPanel.collection"},
		{from: ".collection", to: ".$.pickerPanelWithcustomValue.collection"},
		{from: ".collection", to: ".$.multiPickerPanel.collection"},
		{from: ".collection", to: ".$.multiPickerPanelWithcustomValue.collection"},
		//
		{from: ".$.timePicker.value", to: ".$.timePickerButton.content", transform: function(val) {
			var timestr;
			if (val.hour<10 && val.hour>0) {
				timestr = "0" + val.hour;
			} else if (val.hour===0) {
				timestr = "12";
			} else {
				timestr = val.hour;
			}
			timestr += ":";
			if (val.minute<10 && val.minute>=0) {
				timestr += "0";
			}
			timestr += val.minute;
			timestr += " ";
			timestr += val.meridiem;
			return timestr;
		}},
		{from: ".$.timePickerWithcustomValue.value", to: ".$.timePickerButtonWithcustomValue.content", transform: function(val) {
			var timestr;
			if (val.hour<10 && val.hour>0) {
				timestr = "0" + val.hour;
			} else if (val.hour===0) {
				timestr = "12";
			} else {
				timestr = val.hour;
			}
			timestr += ":";
			if (val.minute<10 && val.minute>=0) {
				timestr += "0";
			}
			timestr += val.minute;
			timestr += " ";
			timestr += val.meridiem;
			return timestr;
		}},
		{from: ".$.datePicker.value", to: ".$.datePickerButton.content", transform: function(val) {
			return (val.getYear() + 1900) + "/" + (val.getMonth() + 1) + "/" + val.getDate();
		}},
		{from: ".$.datePickerWithcustomValue.value", to: ".$.datePickerButtonWithcustomValue.content", transform: function(val) {
			return (val.getYear() + 1900) + "/" + (val.getMonth() + 1) + "/" + val.getDate();
		}},
		{from: ".$.pickerPanel.value", to: ".$.pickerPanelButton.content", transform: function(val) {
			var items = val,
				names = "None";
			if (items !== null && items !== undefined) {
				names = items.attributes.item;
			}

			return names;
		}},
		{from: ".$.pickerPanelWithcustomValue.value", to: ".$.pickerPanelButtonWithcustomValue.content", transform: function(val) {
			var items = val,
				names = "None";
			if (items !== null && items !== undefined) {
				names = items.attributes.item;
			}

			return names;
		}},
		{from: ".$.multiPickerPanel.value", to: ".$.multiPickerPanelButton.content", transform: function(val) {
			var items = val,
				names = "";
			if (items !== null && items !== undefined && items.length > 0) {
				for (var i=0; i<items.length; i++) {
					names += ", " + items[i].attributes.item;
				}
				names = names.slice(2);
			} else {
				names = "None";
			}

			return names;
		}},
		{from: ".$.multiPickerPanelWithcustomValue.value", to: ".$.multiPickerPanelButtonWithcustomValue.content", transform: function(val) {
			var items = val,
				names = "";
			if (items !== null && items !== undefined && items.length > 0) {
				for (var i=0; i<items.length; i++) {
					names += ", " + items[i].attributes.item;
				}
				names = names.slice(2);
			} else {
				names = "None";
			}

			return names;
		}}
	],

	create: enyo.inherit(function(sup) {
		return function() {
			sup.apply(this, arguments);
			this.collection = new enyo.Collection(this.data);

		};
	}),
	rendered: enyo.inherit(function(sup) {
		return function() {
			this.$.pickerPanelWithcustomValue.setIndex(0);
			//this.$.multiPickerPanelWithcustomValue.select(0);
			 //this.$.multiPickerPanelWithcustomValue.select(1);
			//this.$.multiPickerPanelWithcustomValue._onOK();
			sup.apply(this, arguments);
		};
	}),
	showTimePickerPopup: function() {
		this.$.timePickerPopup.show();
	},
	showTimePickerPopupWithcustomValue: function() {
		this.$.timePickerPopupWithcustomValue.show();
	},
	showDatePickerPopup: function() {
		this.$.datePickerPopup.show();
	},
	showDatePickerPopupWithcustomValue: function() {
		this.$.datePickerPopupWithcustomValue.show();
	},
	showPickerPanelPopup: function() {
		this.$.pickerPanelPopup.show();
	},
	showPickerPanelPopupWithcustomValue: function() {
		this.$.pickerPanelPopupWithcustomValue.show();
	},
	showMultiPickerPanelPopup: function() {
		this.$.multiPickerPanelPopup.show();
	},
	showMultiPickerPanelPopupWithcustomValue: function() {
		this.$.multiPickerPanelPopupWithcustomValue.show();
	},
	hidePickerPanelPopup: function() {
		this.$.pickerPanelPopup.hide();
	},
	hidePickerPanelPopupWithcustomValue: function(inSender, inEvent) {
		this.$.pickerPanelPopupWithcustomValue.hide();
		console.log(inEvent.index);
		blood_type1 =this.data[inEvent.index].item;
		if(blood_type1 === "전혈헌혈320mL"){
			blood_type1 = 320;
			waiting1=60;
		}else if(blood_type1 === "전혈헌혈400mL"){
			blood_type1 = 400;
			waiting1=60;
		}else if(blood_type1 === "혈소판헌혈400ml"){
			blood_type1 = 400;
			waiting1=14;
		}else if(blood_type1 === "혈장헌혈500ml"){
			blood_type1 = 500;
			waiting1=14;
		}
		this.owner.setWaiting(waiting1);
		this.owner.setBlood_type(blood_type1);
		this.$.pickerPanelButtonWithcustomValue.setContent(this.data[inEvent.index].item);

	},
	getSelectedFromMultiPickerPanle: function(selected) {
		var items = selected,
			names = "";
		if (items !== null && items !== undefined && items.length > 0) {
			for (var i=0; i<items.length; i++) {
				names += ", " + items[i].attributes.item;

			}
			names = names.slice(2);
		} else {
			names = "None";
		}
		return names;
	},
	tapOK: function(inSender, inEvent) {
		var items;
		if (inEvent.originator.name === "multiPickerPanel") {
			items = this.getSelectedFromMultiPickerPanle(this.$.multiPickerPanel.value);
			this.doResult({msg: items});
			this.hideMultiPickerPanelPopup();

		} else if (inEvent.originator.name === "multiPickerPanelWithcustomValue") {
			items = this.getSelectedFromMultiPickerPanle(this.$.multiPickerPanelWithcustomValue.value);
			this.doResult({msg: items});
			this.hideMultiPickerPanelPopupWithcustomValue();
		} else if (inEvent.originator.name === "datePicker") {
			this.doResult({msg: "Date is " + this.$.datePicker.getValue()});
			this.$.datePickerPopup.hide();
		} else if (inEvent.originator.name === "timePicker") {
			this.doResult({msg: "Time is " + this.$.timePicker.getHourValue() + " : " + this.$.timePicker.getMinuteValue() + " " + this.$.timePicker.getMeridiemValue()});
			this.$.timePickerPopup.hide();
		} else if (inEvent.originator.name === "datePickerWithcustomValue") {
			this.doResult({msg: "Date is " + this.$.datePickerWithcustomValue.getValue()});
			this.$.datePickerPopupWithcustomValue.hide();
		} else if (inEvent.originator.name === "timePickerWithcustomValue") {
			this.doResult({msg: "Time is " + this.$.timePickerWithcustomValue.getHourValue() + " : " + this.$.timePickerWithcustomValue.getMinuteValue() + " " + this.$.timePickerWithcustomValue.getMeridiemValue()});
			this.$.timePickerPopupWithcustomValue.hide();
		}
	},
	tapCancel: function(inSender, inEvent) {
		if (inEvent.originator.name === "multiPickerPanel") {
			this.hideMultiPickerPanelPopup();
		} else if (inEvent.originator.name === "multiPickerPanelWithcustomValue") {
			this.hideMultiPickerPanelPopupWithcustomValue();
		} else if (inEvent.originator.name === "datePicker") {
			this.doResult({msg: "Cancel!"});
			this.$.datePickerPopup.hide();
		} else if (inEvent.originator.name === "timePicker") {
			this.doResult({msg: "Cancel!"});
			this.$.timePickerPopup.hide();
		} else if (inEvent.originator.name === "datePickerWithcustomValue") {
			this.doResult({msg: "Cancel!"});
			this.$.datePickerPopupWithcustomValue.hide();
		} else if (inEvent.originator.name === "timePickerWithcustomValue") {
			this.doResult({msg: "Cancel!"});
			this.$.timePickerPopupWithcustomValue.hide();
		}
	},
	hideMultiPickerPanelPopup: function() {
		this.$.multiPickerPanelPopup.hide();
	},
	hideMultiPickerPanelPopupWithcustomValue: function() {
		this.$.multiPickerPanelPopupWithcustomValue.hide();
	},
	data: [
		{item: "전혈헌혈320mL" ,style:"font-size:10px !important;"},
		{item: "전혈헌혈400mL"},
		{item: "혈소판헌혈400ml"},
		{item: "혈장헌혈500ml"},
	],
	// recognize drag right to close app
	eventHandler: function(inSender, inEvent) {
		if (inEvent.direction === "right") {
			this.owner.$.panels.selectPanelByName("buttonSample");
		}
	}
});

enyo.kind({
	name: "g.sample.FormSample",
	classes: "enyo-unselectable garnet g-sample",
	components: [
		{content: "< Form Sample", classes: "g-sample-header", ontap: "goBack"},

		{content: "Form Picker Buttons / Form Buttons / Form Inputs", classes: "g-sample-subheader"},
		{kind: "g.sample.FormPanel", style: "position: relative;", onResult: "result"},

		{style: "position: fixed; width: 100%; min-height: 160px; bottom: 0; z-index: 9999; background-color: #EDEDED; opacity: 0.8;", classes: "g-sample-result", components: [
			{content: "Result", classes: "g-sample-subheader"},
			{name: "result", allowHtml: true, content: "No button pressed yet.", classes: "g-sample-description"}
		]}
	],
	result: function(inSender, inEvent) {
		this.$.result.setContent(inEvent.msg);
	},
	goBack: function(inSender, inEvent) {
		history.go(-1);
		return false;
	}
});