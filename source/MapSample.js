enyo.kind({
	codeText: "검색값",
	kind : "g.Panel",
	name: "g.sample.MapSample",
	// handler for drag finish which calls 'eventHandler' function when drag finished.
	handlers: {
		onSwipe: "eventHandler"
	},
	classes: "enyo-unselectable garnet main-view",
	components: [
		{id: "myMap", classes: "map-region"}
	],
	create: function() {
		this.inherited(arguments);
	},
	rendered: function() {
		this.inherited(arguments);

		var myPosX = 33.450701;
		var myPosY = 126.570667;

		this.showMap(myPosX, myPosY);
	},
	showMap: function(posx, posy) {

		var container = document.getElementById('myMap');
		var options = {
			center: new daum.maps.LatLng(posx, posy),
			level: 8
		};

		var map = new daum.maps.Map(container, options);


// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
		var zoomControl = new daum.maps.ZoomControl();
		map.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);

// 지도가 확대 또는 축소되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
		daum.maps.event.addListener(map, 'zoom_changed', function() {

			// 지도의 현재 레벨을 얻어옵니다
			var level = map.getLevel();

			var message = '현재 지도 레벨은 ' + level + ' 입니다';
			var resultDiv = document.getElementById('result');
			resultDiv.innerHTML = message;

		});

// ??? ??? ??u?? ????????
		var ps = new daum.maps.services.Places();
		console.log(this.codeText);
// ?????? ???? ???????
		ps.keywordSearch(this.codeText, placesSearchCB);

// ????? ??? ??? ?? ????? ?????? ????

		function placesSearchCB (status, data, pagination) {
			if (status === daum.maps.services.Status.OK) {

				// ????? ??? ????? ???????? ???? ?????? ???????????
				// LatLngBounds ??u?? ????? ???????
				var bounds = new daum.maps.LatLngBounds();

				for (var i=0; i<data.places.length; i++) {
					displayMarker(data.places[i]);
					bounds.extend(new daum.maps.LatLng(data.places[i].latitude, data.places[i].longitude));
				}

				// ????? ??? ????? ???????? ???? ?????? ????????
				map.setBounds(bounds);
			}
		}

		// ?????? ??��?? ?????? ???????
		function displayMarker(place) {

			// ??��?? ??????? ?????? ???????
			var marker = new daum.maps.Marker({
				map: map,
				position: new daum.maps.LatLng(place.latitude, place.longitude)
			});

			// ??��?? ????????? ???????
			daum.maps.event.addListener(marker, 'click', function() {
				// ??��?? ?????? ?????? ?????????�� ??????
				infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.title + '</div>');
				infowindow.open(map, marker);
			});
		}


	},
	eventHandler:function(inSender,inEvent)
	{
		if(inEvent.direction==="right")
		{
			this.owner.$.panels.selectPanelByName("buttonSample");
		}
	}

});