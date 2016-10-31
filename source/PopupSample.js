enyo.kind({
    name: "g.sample.PopupSample",
    kind: "g.Panel",
    events: {
        onResult: ""
    },
    title: true,
    titleContent: "주소로 검색",
    components: [

        {style: "position: relative; background-color: #FFFFFF;", classes: "g-common-width-height-fit", components: [
            // {content:"주소로 검색", style:"position:absolute; top:30px;margin-left:100px; font-color:#FFFFFF;font-size:20px; background-color: #000000;"},
            {name: "pickerButton1", kind: "g.FormPickerButton", style: "top: 85px;", ontap: "showPopup", content: "도/특별/광역시"},
            {name: "pickerButton2", kind: "g.FormPickerButton", style: "top: 95px;", ontap: "showPopup", content: "시/군"},
            {name: "Submit", kind: "g.Button", ontap:"submit", style:"top:100px; margin-left:117px; background-color: #FFD966; color: #000000; height: 50px; font-size: 25px;", content:"확인"},
            {name: "PickerPop1", kind: "g.Popup", effect: "depth-transition", components: [
                {style: "background-color: #000000;position: relative;", classes: "g-common-width-height-fit g-layout-absolute-wrapper", components: [
                    {name: "pickerPanel1", kind: "g.PickerPanel", title: true, titleContent: "도/특별/광역시", ontap: "tapItem1"}
                ]}
            ]},
            {name: "PickerPop2", kind: "g.Popup", effect: "depth-transition", components: [
                {style: "background-color: #000000;position: relative;", classes: "g-common-width-height-fit g-layout-absolute-wrapper", components: [
                    {name: "pickerPanel2", kind: "g.PickerPanel", title: true, titleContent: "시 / 도", ontap: "tapItem2"}
                ]}
            ]}
        ]}

    ],
    bindings: [
        {from: ".collection1", to: ".$.pickerPanel1.collection"},
        {from: ".collection2", to: ".$.pickerPanel2.collection"}
    ],

    submit: function(inSender,inEvent)
    {
        this.owner.$.panels.selectPanelByName("mapSample");
        if(this.$.pickerButton1.content=="특별/광역시")
            this.owner.$.mapSample.codeText= this.$.pickerButton2.content + " 헌혈의 집";
        else
            this.owner.$.mapSample.codeText=this.$.pickerButton1.content + " " + this.$.pickerButton2.content + " 헌혈의 집";
        console.log(this.$.pickerButton1.content + " " + this.$.pickerButton2.content + " 헌혈의 집");
        this.owner.$.mapSample.showMap(31.4507011,16.170667);
    },
    create: enyo.inherit(function(sup) {
        return function() {
            sup.apply(this, arguments);
            this.collection1 = new enyo.Collection(this.data1);
            this.collection2 = new enyo.Collection(this.data2);
        };
    }),
    rendered: function() {
        // default index
        this.$.pickerPanel1.setIndex(0);
        this.$.pickerPanel2.setIndex(0);
        this.doResult({msg: "The item index #" + this.$.pickerPanel1.getIndex() + " is selected."});
        this.doResult({msg: "The item index #" + this.$.pickerPanel2.getIndex() + " is selected."});

    },
    showPopup: function(inSender, inEvent) {
        if (inSender.name === "pickerButton1") {
            this.$.PickerPop1.show();
        }
        else if (inSender.name === "pickerButton2") {
            this.$.PickerPop2.show();
            if(this.$.pickerButton1.content=="특별/광역시")
            {
                this.set("collection2",  new enyo.Collection(this.data2));
            }
            else if(this.$.pickerButton1.content=="강원도")
            {
                this.set("collection2",  new enyo.Collection(this.data3));
            }
            else if(this.$.pickerButton1.content=="경기도")
            {
                this.set("collection2",  new enyo.Collection(this.data4));
            }
            else if(this.$.pickerButton1.content=="경상남도")
            {
                this.set("collection2",  new enyo.Collection(this.data5));
            }
            else if(this.$.pickerButton1.content=="경상북도")
            {
                this.set("collection2",  new enyo.Collection(this.data6));
            }
            else if(this.$.pickerButton1.content=="전라남도")
            {
                this.set("collection2",  new enyo.Collection(this.data7));
            }
            else if(this.$.pickerButton1.content=="전라북도")
            {
                this.set("collection2",  new enyo.Collection(this.data8));
            }
            else if(this.$.pickerButton1.content=="충청남도")
            {
                this.set("collection2",  new enyo.Collection(this.data9));
            }
            else if(this.$.pickerButton1.content=="충청북도")
            {
                this.set("collection2",  new enyo.Collection(this.data10));
            }

        }
    },
    tapItem1: function(inSender, inEvent) {
        var index1 = this.$.pickerPanel1.getIndex();
        this.doResult({msg: "The item index #" + index1 + " is selected."});
        this.$.PickerPop1.hide();
        this.$.pickerButton1.setContent((this.data1[index1]).item);

    },
    tapItem2: function(inSender, inEvent) {

        if(this.$.pickerButton1.content=="특별/광역시")
        {
            var index2 = this.$.pickerPanel2.getIndex();
            this.doResult({msg: "The item index #" + index2 + " is selected."});
            this.$.PickerPop2.hide();
            this.$.pickerButton2.setContent((this.data2[index2]).item);
        }
        else if(this.$.pickerButton1.content=="강원도")
        {
            var index2 = this.$.pickerPanel2.getIndex();

            this.doResult({msg: "The item index #" + index2 + " is selected."});
            this.$.PickerPop2.hide();
            this.$.pickerButton2.setContent((this.data3[index2]).item);
        }
        else if(this.$.pickerButton1.content=="경기도")
        {
            var index2 = this.$.pickerPanel2.getIndex();

            this.doResult({msg: "The item index #" + index2 + " is selected."});
            this.$.PickerPop2.hide();
            this.$.pickerButton2.setContent((this.data4[index2]).item);
        }
        else if(this.$.pickerButton1.content=="경상남도")
        {
            var index2 = this.$.pickerPanel2.getIndex();

            this.doResult({msg: "The item index #" + index2 + " is selected."});
            this.$.PickerPop2.hide();
            this.$.pickerButton2.setContent((this.data5[index2]).item);
        }
        else if(this.$.pickerButton1.content=="경상북도")
        {
            var index2 = this.$.pickerPanel2.getIndex();

            this.doResult({msg: "The item index #" + index2 + " is selected."});
            this.$.PickerPop2.hide();
            this.$.pickerButton2.setContent((this.data6[index2]).item);
        }
        else if(this.$.pickerButton1.content=="전라남도")
        {
            var index2 = this.$.pickerPanel2.getIndex();

            this.doResult({msg: "The item index #" + index2 + " is selected."});
            this.$.PickerPop2.hide();
            this.$.pickerButton2.setContent((this.data7[index2]).item);
        }
        else if(this.$.pickerButton1.content=="전라북도")
        {
            var index2 = this.$.pickerPanel2.getIndex();

            this.doResult({msg: "The item index #" + index2 + " is selected."});
            this.$.PickerPop2.hide();
            this.$.pickerButton2.setContent((this.data8[index2]).item);
        }
        else if(this.$.pickerButton1.content=="충청남도")
        {
            var index2 = this.$.pickerPanel2.getIndex();

            this.doResult({msg: "The item index #" + index2 + " is selected."});
            this.$.PickerPop2.hide();
            this.$.pickerButton2.setContent((this.data9[index2]).item);
        }
        else if(this.$.pickerButton1.content=="충청북도")
        {
            var index2 = this.$.pickerPanel2.getIndex();

            this.doResult({msg: "The item index #" + index2 + " is selected."});
            this.$.PickerPop2.hide();
            this.$.pickerButton2.setContent((this.data10[index2]).item);
        }
    },
    data1: [
        {item: "특별/광역시"},
        {item: "강원도"},
        {item: "경기도"},
        {item: "경상남도"},
        {item: "경상북도"},
        {item: "전라남도"},
        {item: "전라북도"},
        {item: "충청남도"},
        {item: "충청북도"}
    ],
    data2:[
        {item: "서울특별시"},
        {item: "대전광역시"},
        {item: "광주광역시"},
        {item: "대구광역시"},
        {item: "부산광역시"},
        {item: "울산광역시"}
    ],
    data3:[
        {item: "춘천시"},
        {item: "원주시"},
        {item: "강릉시"}
    ],
    data4:[
        {item: "수원시"},
        {item: "성남시"},
        {item: "부천시"},
        {item: "고양시"},
        {item: "평택시"}
    ],
    data5:[
        {item: "진주시"},
        {item: "창원시"},
        {item: "김해시"}
    ]
    ,
    data6:[
        {item: "경산시"},
        {item: "포항시"},
        {item: "안동시"},
        {item: "구미시"}
    ],
    data7:[
        {item: "목포시"},
        {item: "순천시"},
        {item: "여수시"}
    ],
    data8:[
        {item: "익산시"},
        {item: "군산시"},
        {item: "전주시"},
        {item: "정읍시"}
    ],
    data9:[
        {item: "천안시"},
        {item: "공주시"}
    ],
    data10:[
        {item: "청주시"},
        {item: "충주시"}
    ]
});

enyo.kind({
    name: "g.sample.PickerPanelSample",
    classes: "enyo-unselectable garnet g-sample",
    components: [
        {content: "< PickerPanel Sample", classes: "g-sample-header", ontap: "goBack"},

        {content: "PickerPanel", classes: "g-sample-subheader"},
        {kind: "g.sample.PickerPanel", style: "position: relative;", onResult: "result"},

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