$(document).ready(function() {
	// $.getScript('http://61.4.185.48:81/g/', function() {
	// 	getWeatherXML();
	// });

	$.getScript('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js', function(){
	    var id = getCityId(remote_ip_info);
	    getWeatherXML(id);
	});

	//点击homePage返回主页
	clickHomePage();

	//确定早晚背景
	setBackground();
});
// 根据省份名和城市名获取id
function getCityId(remote_ip_info) {
	for(var i in cityCode.zone) {
		if (cityCode.zone[i].name == remote_ip_info.province) {
			for(var j in cityCode.zone[i].zone) {
				if (cityCode.zone[i].zone[j].name == remote_ip_info.city) {
					for(var k in cityCode.zone[i].zone[j].zone) {
						if (cityCode.zone[i].zone[j].zone[k].name == remote_ip_info.city) {
							return(cityCode.zone[i].zone[j].zone[k].code);
						}
					}
				}
			}
		}
	}
}

//获取XML并操作-->ready()
function getWeatherXML(id) {
	url = 'http://wthrcdn.etouch.cn/WeatherApi?citykey=' + id;
	$.get(url, function (data) {
  		fillFrame(data);
	})
}


//信息填充-->getWeatherXML()
function fillFrame(data) {
	//上部分填充
	fillHeadFrame(data);

	//下部分填充
	fillFooterFrame(data);
}

// 晴转多云 雾 雨夹雪 雷阵雨  大雨 中雨 暴雨 大雪  中雪  雨 冰雹 
//晴 多云 小雨 霾 阴 小雪
//上部分框架填充-->fillFrame()
function fillHeadFrame(data) {
	var root = $(data);
	//城市
	var city = root.find('city').text();
	$('p.city').text(city);
	//实时温度
	var tmpr = root.find('wendu').text();
	$('p.tmpr').text(tmpr + '℃');
	//实时风力
	var wind = root.find('fengli:first').text();
	$('p.wind').text('风力:' + wind);
	//日期
	var d = new Date();
	var month = d.getMonth() + 1;
	var date = d.getDate();
	$('p.today').text(month + '月' + date + '日');
	//更新时间
	var updateTime = root.find('updatetime').text();
	$('p.update').text('更新时间 ' + updateTime);
	//今日天气状况(DN)
	var weather = root.find('weather:first');
	var state = weather.find('day').find('type').text();
	$('p.state').text(state);
	//填充温度范围(DN)
	fillTemperatureRange(weather[0], 'p.rangetmp', 1);

}

//下部分框架填充-->fillFrame()
function fillFooterFrame(data) {
	var root = $(data).find('forecast');
	root.find('weather').each(function(i) {
		//过滤今日
		if (i == 0)
			return;
		//填充温度范围(DN)
		fillTemperatureRange(this, 'p.temperature', i);
		//填充日期(DN)
		fillDate(this, i);

	});
}

//填充温度范围-->fillFooterFrame() & fillHeadFrame()
function fillTemperatureRange(obj, target, i) {
		var hightmp = $(obj).find('high').text().replace(/[^\d]+/, '');
		var lowtmp = $(obj).find('low').text().replace(/[^\d]+/, '');
		$(target)[i - 1].innerHTML = parseInt(hightmp) + '/' + lowtmp;
}

//填充日期-->fillFooterFrame()
function fillDate(obj, i) {
	var d = new Date();
	month = d.getMonth() + 1;
	var temp = $(obj).find('date').text().split('日');
	//填充p.date
	var date = month + '月' + temp[0] + '日';
	$('p.date')[i - 1].innerHTML = date;
	//填充p.week
	var week = '周' + temp[1][2];
	$('p.week')[i - 1].innerHTML = week;
}

//点击homePage返回主页-->ready()
function clickHomePage() {
	$('div.homePage').click(function() {
		window.location.href = '/';
	});
}

//确定早晚背景-->ready()
function setBackground() {
	var d = new Date();
	var hour = d.getHours();

	if (hour > 6 & hour < 18) {
		//白天
		var bgImage = 'static/img/weather/day/weatherBgDay.png';
		var bgColor = '#4181DB';
	} else {
		//晚上
		var bgImage = 'static/img/weather/night/weatherBgNight.png';
		var bgColor = '#120e11';
	}

	$('body').css({
		backgroundImage: 'url(' + bgImage + ')',
		backgroundColor: bgColor,
	});
}