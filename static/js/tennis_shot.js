$(document).ready(function() {
	//功能条操作
	functionBarOperation();
	//信息框操作
	infoFrameOperation();
	//表单操作
	formOperation();
	//获取当前坐标
	getCurPosition();
});

//信息框操作-->ready()
function infoFrameOperation() {
	//点击预约
	clickAppoint();

	//点击查看
	clickView();
}

//功能条操作-->ready()
function functionBarOperation() {
	//点击加号图标
	clickPlus();

	//点击查看地图跳转到地图页面
	clickMapView();

	//打开预约表单
	clickWriteAppoint();

	//查看天气
	clickWeather();
}

//功能框展开折叠-->ready()
function clickPlus() {
	$('div.plus').click(function() {
		var width = $('div.choose').css('width');
		var speed = 150;

		if (width == '0px') {
			iconShow('div.choose', '-205px', '-203px', '400px', '400px', speed);
			iconShow('div.appoint_0', '0px', '109px', '70px', '70px', speed);
			iconShow('div.appoint_1', '65px', '68px', '70px', '70px', speed);
			iconShow('div.appoint_2', '102px', '1px', '70px', '70px', speed);
		} else {
			iconShow('div.choose', '29px', '29px', '0px', '0px', speed);
			iconShow('div.appoint_0', '29px', '29px', '0px', '0px', speed);
			iconShow('div.appoint_1', '29px', '29px', '0px', '0px', speed);
			iconShow('div.appoint_2', '29px', '29px', '0px', '0px', speed);
		}
	});
}

//功能框展开折叠动画-->clickPlus()
function iconShow(name, lt, bm, wd, ht, speed) {
	$(name).animate({
		left: lt,
		bottom: bm,
		width: wd,
		height: ht,
	}, speed);
}

//跳转到地图页面-->ready()
function clickMapView() {
	$('div.appoint_0').click(function() {
		window.open('map', '_self');
	});
}

//点击Appoint按钮预约-->infoFrameOperation()
function clickAppoint() {
	$('div#aptment_apt').click(function() {
		appointDataOperation(this)
	});
}

//点击View按钮-->infoFrameOperation()
function clickView() {
	$('div#aptment_View').click(function() {
		var name = getClickName(this);
		$('form#form_view input').val(name);
		//终止提交表单
		var index = getIndexByName(name);
		if (DB.people[index].x == -1 || DB.people[index].y == -1) {
			tips('This person has no postion');
			return;
		}
		//提交表单
		$('form#form_view').submit();
	});
}

//获得当前坐标-->ready()
function getCurPosition() {
	var geolocation = new BMap.Geolocation();
	geolocation.getCurrentPosition(function(r){
		if(this.getStatus() == BMAP_STATUS_SUCCESS){
			DB.now[0] = r.point.lng;
			DB.now[1] = r.point.lat;
			tips("Get Position Success");
		}
	},{enableHighAccuracy: true});
}

//打开天气页面
function clickWeather() {
	$('div#weather_view').click(function() {
		window.location.href = 'weather';
	});
}


