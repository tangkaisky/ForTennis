$.getScript('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js', function(){
    console.log(remote_ip_info);
    var id = getCityId(remote_ip_info);
});

function getCityId(remote_ip_info) {
	for(var i in cityCode.zone) {
		if (cityCode.zone[i].name == remote_ip_info.province) {
			// console.log('I am in.');
			// console.log(remote_ip_info.city);
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