$(document).ready(function() {
	//地图操作
	mapOperation();
	//信息框操作
	infoFrameOperation();
	//功能条操作
	functionBarOperation();
	//表单操作
	formOperation();
});

//地图操作-->ready()
function mapOperation() {
	var map = new BMap.Map("locateMap");

	//初始地图
	initialLocation(map);

	//创建当前点并移动到指定点
	userLocationSet(map);

	//约球点
	createPersonPoint(map);
}

//初始化地图-->mapOperation()
function initialLocation(map) {
	//地图初始点
	var x = 116.404;
	var y = 39.915;
	var point = new BMap.Point(x, y);
	map.centerAndZoom(point, 14);
	map.addControl(new BMap.MapTypeControl());
	map.setCurrentCity("北京");
	map.enableScrollWheelZoom(true);

	//创建控制条
	var navigationControl = new BMap.NavigationControl({
    	anchor: BMAP_ANCHOR_TOP_LEFT,
    	type: BMAP_NAVIGATION_CONTROL_LARGE,
    	enableGeolocation: true,
  	});
  	map.addControl(navigationControl);
}

//设置并移动到当前位置-->mapOperation()
function userLocationSet(map) {
	//获取view的坐标
	var pos = $('p.position').text().split(';')

	//单个信息查看
	if (pos.length > 1) {
		var viewPoint = new BMap.Point(pos[0], pos[1]);
		map.panTo(viewPoint);
	}
	var geolocation = new BMap.Geolocation();
	geolocation.getCurrentPosition(function(r){
		if(this.getStatus() == BMAP_STATUS_SUCCESS){
			var mk = new BMap.Marker(r.point);
			map.addOverlay(mk);
			if (pos.length == 1)
				map.panTo(r.point);
			DB.now[0] = r.point.lng;
			DB.now[1] = r.point.lat;
		}
		else {
			tips('failed'+this.getStatus())
		}
	},{enableHighAccuracy: true});
}

//创建约球点-->mapOperation()
function createPersonPoint(map) {
	//获取view的坐标
	var pos = $('p.position').text().split(';')
	var mark = true;
	if (pos.length == 1)
		mark = false;
	// if (DB.people.length != DB.count) {alert("Count与People数不等！")；}
	for (var i= 0; i < DB.count; ++i) {
		//创建点
		//无法获取坐标的用户不显示在图上
		if (DB.people[i].x == -1 || DB.people[i].y== -1 || (mark && !(DB.people[i].x == pos[0] && DB.people[i].y == pos[1])))
			continue;
		var pt = new BMap.Point(DB.people[i].x, DB.people[i].y);
		var myIcon = new BMap.Icon("static/img/tenIcon.png",new BMap.Size(68,39));
		var iconMarker = new BMap.Marker(pt, {icon:myIcon});
		map.addOverlay(iconMarker);
		//创建信息框
		iconMarker.addEventListener("click",showInfo);
	}
}

//信息框操作-->ready()
function infoFrameOperation() {
	//点击关闭信息框
	clickBack();
	//预约
	clickAppoint();
}

//点击Appoint 预约-->infoFrameOperation()
function clickAppoint() {
	$('div#aptment_apt').click(function() {
		var name = appointDataOperation(this);
		frontEndAddOne(name)
		$('div.layout').fadeToggle(500);
		$('div.appointment').fadeToggle(500);
	});
}

//前端预约人数加1-->clickAppoint()
function frontEndAddOne(name) {
	var temp = DB.people;
	for (var i = 0; i < temp.length; ++i) {
		if (name == temp[i].name) {
			temp[i].appoint_people++;
			break;
		}
	}
}

//显示信息框 图层-->mapOperation()
function showInfo() {
	$('div.layout').fadeToggle(500);
	$('div.appointment').fadeToggle(500);
	var p = this.getPosition();
	//读取对应信息
	var info = getInfoByPos(p.lng, p.lat);
	//填充信息
	fillInFrame(info);
}

//点击Back 关闭信息框 图层-->infoFrameOperation
function clickBack() {
	$('div#aptment_back').click(function() {
		$('div.layout').fadeToggle(500);
		$('div.appointment').fadeToggle(500);
	});
}

//根据坐标返回对应点信息-->showInfo()
function getInfoByPos(x, y) {
	var temp = DB.people;
	for (var i = 0; i < temp.length; ++i) {
		if (x == temp[i].x && y == temp[i].y)
			return [temp[i].name, temp[i].time, temp[i].location, temp[i].NTRP, temp[i].information, temp[i].appoint_people];
	}
}

//填充对应点信息-->showInfo()
//todo:中文显示乱码
function fillInFrame(infoArray) {
	var groupP = $('div.appointment')[0].getElementsByTagName('p');
	for (var j = 0; j < groupP.length; ++j) { 
		groupP[j].innerHTML = infoArray[j]; //"STRING"
	}  
}

//功能条操作-->ready()
function functionBarOperation() {
	//功能框展开与折叠
	clickExtend();
	//返回主页面
	clickPageBack();
	//打开预约表单
	clickWriteAppoint();
}

//功能框展开与折叠-->functionBarOperation()
function clickExtend() {
	$('div.extend').click(function() {
		var width = $('div.function_bar').css('width');
		if (width == '75px') {
			var width = '0px';
			funcBarAnimate('div.function_bar', width);
			funcBarAnimate('div.function_bar_up', width);
		} else {
			var width = '75px';
			funcBarAnimate('div.function_bar', width);
			funcBarAnimate('div.function_bar_up', width);
		}
	});
}

//功能框展开与折叠动画效果-->clickExtend()
function funcBarAnimate(name, width) {
	$(name).animate({
		'width': width,
	}, 200);
}

//返回主页面-->functionBarOperation()
function clickPageBack() {
	$('div.pageBack').click(function() {
		window.location.href = '/';
	});
}
