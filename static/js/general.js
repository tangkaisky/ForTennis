//右下角出现提示-->tennis_shot.js[clickAppoint()] & appoint.js[clickAppoint() & clickFormWrite()]
function tips(info) {
	var fadeTime = 200;
	$('div.tips').text(info);
	setTimeout(function() {
		$('div.tips').fadeToggle(fadeTime);
	}, 200);
	setTimeout(function() {
		$('div.tips').fadeToggle(fadeTime);
	}, 800);
}

//点击Appoint按钮预约-->tennis_shot.js[clickAppoint()] & appoint.js[clickAppoint()]
function appointDataOperation(obj) {
	//获取对应名字，并+1预约人数
	var name = infoDataOperation(obj)
	//发送数据到服务端
	$.ajax({
	   type: "POST",  
	   url: "/", 
	   data: {'nameAdd':name},
	   success: function() {
	   		//提示成功
	   		tips('Appoint Success');
	   },
	   error: function() {
	   		//提示失败
	   		tips('Appoint Failure');
	   }
	});
	return name
}

//获取预约的名字并返回，预约人数加1-->appointDataOperation()
function infoDataOperation(obj) {
	//获取名字
	var name = getClickName(obj);
	//人数操作
	var div = $(obj).parent();
	var number = Number(div.find('p#appoint_number').text()) + 1;
	div.find('p#appoint_number').text(number);
	return name
}

//获取姓名-->tennis_shot.js[clickView()] & infoDataOperation()
function getClickName(obj) {
	var div = $(obj).parent();
	return div.find('p#name').text();
}



////打开预约表单-->appoint.js[functionBarOperation()]
function clickWriteAppoint() {
	$('div#write_appoint').click(function() {
		$('div.form').fadeToggle(500);
		$('div.layout').fadeToggle(500);
	});
}

//表单操作-->appoint.js[ready()]
function formOperation() {
	//取消表单
	clickFormBack();
	//提交表单
	clickFormWrite();
}

//取消表单-->formOperation()
function clickFormBack() {
	$('div#form_back').click(function() {
		$('div.form').fadeToggle(500);
		$('div.layout').fadeToggle(500);
	});
}

//提交表单-->formOperation()
function clickFormWrite() {
	$('div#form_write').click(function(r) {
		//获取当前用户的表单信息
		var temp = getInfoForm();
		$('div.form').fadeToggle(500);
		$('div.layout').fadeToggle(500);
		//发送数据到服务端
		$.ajax({
		   type: "POST",  
		   url: "/", 
		   data: temp,
		   success: function() {
		   		//提示成功
		   		window.location.href = '/'
		   },
		   error: function() {
		   		//提示失败
		   		tips('Write Failure');
		   }
		});
	});
}

//获取当前用户的表单信息,返回类-->clickFormWrite()
function getInfoForm() {
	var name = $('input#form_name').val();
	var time = $('input#form_time').val();
	var location = $('input#form_location').val();
	var ntrp = $('select#form_ntrp').val();
	var information = $('input#form_infomation').val();
	return {
		'name':name,
		'time':time,
		'location':location,
		'NTRP':ntrp,
		'information':information,
		'appoint_people':0,
		'x':DB.now[0],
		'y':DB.now[1],
	}
}


//根据Name返回对应信息的下标-->appoint.js[clickAppoint()] & tennis_shot.js[clickView()]
function getIndexByName(name) {
	var temp = DB.people;
	for (var i = 0; i < temp.length; ++i) {
		if (name == temp[i].name)
			return i;
	}
}