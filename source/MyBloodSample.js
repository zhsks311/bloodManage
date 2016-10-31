enyo.kind({
    name: "Sample.UI.MyBloodSample",
    kind: "g.Panel",
    bloodDonation_counter : 0,
    bloodDonation_volume : 0,
    handlers: {
        onSwipe: "eventHandler"
    },
    style: "position: relative; border-radius: 50%; background-color: #FFFFFF;",
    components: [


        {name: "arc1", kind: "g.Arc", color: "#DB0000", width: 24, diameter: 310},

        {name: "arc2", kind: "g.Arc", color: "#FAF07D", width: 24, diameter: 310},

        {name: "arc3", kind: "g.Arc", color: "#bbbbbb", width: 24, diameter: 310},



        {kind: "g.FormLabel", style: "margin-top: 80px; margin-right: 80px; margin-left: 90px; color: #000000; font-size: 25px", content: "헌혈 가능 날짜"},
        {name : "dday",kind: "g.FormLabel", style: "margin-top: -15px; margin-right: 40px; margin-left: 30px; color: #000000; font-size: 100px", content: "D- 60"},


        {name: "popupBtn", kind: "g.Button", style: "position: absolute; top: 220px; left: 90px; right: 50px; width: 130px; font-size: 22px; height: 45px", ontap: "showPopup", content: "세부내역"},

        {
            name: "popup",
            kind: "g.Popup",
            style: "overflow: hidden;",
            popupEffect: true,
            onPopUpAnimationEnd: "popUpEnd",
            onPopDownAnimationEnd: "popDownEnd",
            onHide: "hidePopup",
            components: [
                {classes: "g-common-width-height-fit", style: "overflow: hidden;", components: [
                    {
                        name: "scroller",
                        kind: "g.Scroller",
                        scrollIndicatorEnabled: true,
                        classes: "enyo-fit garnet g-layout-text-center",
                        components: [
                            { style: "padding: 0 0 0; height: 400px; background-color:white", components: [
                                //		{kind: "enyo.Image", src: "assets/ic_warning.svg", style: "margin-right: 3px;"},
                                { content: "", style: "font-size: 40px; height: 30px ; font-weight: 400; color: #111111; background-color: #FFA7A7"},
                                { content: "헌혈 내역", style: "font-size: 22px; height: 40px ; font-weight: 800; color: #111111; background-color: #FFA7A7"},
                                { name: "kkk", style: "position: absolute; top: 90px; left: 35px; font-size: 20px; color:black", content: "> 최근 헌혈 일 : "},
                            {name : "times1",style: "position: absolute; top: 120px; left: 35px; font-size: 20px; color:black", content: "> 총 봉사 시간 : 4시간"},
                                { name : "aaa", style: "position: absolute; top: 150px; left: 35px; font-size: 20px; color:black", content: "> 총 헌혈 횟수 :"},
                                { name : "ttt", style: "position: absolute; top: 180px; left: 35px; font-size: 20px; color:black; text-align:left", content: "> 총 헌혈 양 : "},
                                {name: "button", kind: "g.Button", content: "확인", ontap: "tapOK", style: "margin: 160px 0 70px; width: 100px; height: 45px"}
                            ]},

                        ]
                    }
                ]}
            ],

        },
    ],
    bindings: [
        {from:".owner.blood_date", to:".bloodDonation_date"},
        {from:".owner.blood_type", to:".bloodDonation_type"},
        {from:".owner.counter", to:".bloodDonation_counter"},
        {from:".owner.waiting", to:".bloodDonation_waiting"}
    ],
    showPopup: function(inSender, inEvent) {
        if (inSender.name === "popupBtn") {
            this.$.popup.show();
        } else if (inSender.name === "customPopupBtn") {
            this.$.customPopup.show();
        }

    },
    hidePopup: function(inSender, inEvent) {
        if (this.okTapped) {
            this.doResult({msg: "Popup is hidden by OK button"});
            this.okTapped = false;
        } else {
            this.doResult({msg: "Popup is hidden by flick"});
        }
    },
    tapOK: function(inSender, inEvent) {
        this.okTapped = true;
        this.$.popup.hide();
    },
    popUpEnd: function(inSender, inEvent) {
        // Function to be handled after PopUp Animation End
    },
    popDownEnd: function(inSender, inEvent) {
        // Function to be handled after PopDown Animation End
    },
    // recognize drag right to close app
    eventHandler: function(inSender, inEvent) {
        if (inEvent.direction === "right") {
            this.owner.$.panels.selectPanelByName("buttonSample");
        }
    },
    bloodDonation_dateChanged: function () {
      console.log("changed : "+this.bloodDonation_date);

        this.bloodDonation_counter=this.bloodDonation_counter+1;
        red = this.bloodDonation_counter * 0.124;

        if (red <= 3.72) {
            this.$.arc1.draw(0,red);
            this.$.arc3.draw(red,3.72);
            this.$.arc2.draw(3.72,6.2);
        }
        else if (red > 3.72 && red <= 6.2) {
            this.$.arc1.draw(0,red);
            this.$.arc2.draw(red,6.2);
        }
        else {
            red = 1;
            this.$.arc1.draw(0,red);
            this.$.arc3.draw(red,3.72);
            this.$.arc2.draw(3.72,6.2);

        }

        this.$.kkk.setContent("> 최근 헌혈 일 : " + this.bloodDonation_date);
        this.$.aaa.setContent("> 총 헌혈 횟수 : " + this.bloodDonation_counter);
        this.$.times1.setContent("> 총 봉사 시간 : "+ this.bloodDonation_counter*4 + "시간");
        this.$.dday.setContent("D - " + this.bloodDonation_waiting );
    },
    bloodDonation_typeChanged: function () {
        console.log(this.bloodDonation_type);
        this.bloodDonation_volume=this.bloodDonation_volume+this.bloodDonation_type;
        this.$.ttt.setContent("> 총 헌혈 양 : " + this.bloodDonation_volume+"ml");
    },

    create: enyo.inherit(function(sup) {
        return function() {

            sup.apply(this, arguments);



            //
            //this.$.arc1.draw(0,2.1);
            //this.$.arc3.draw(2.1,4.3);
            //this.$.arc2.draw(4.3,6.2);
        };
    })
});

//enyo.kind({
//    name: "g.sample.ArcSample",
//    classes: "enyo-unselectable garnet g-sample",
//    components: [
//        {content: "< Arc Sample", classes: "g-sample-header", ontap: "goBack"},
//
//        {content: "Arc", classes: "g-sample-subheader"},
//        {kind: "g.sample.ArcPanel"}
//    ]
//});
