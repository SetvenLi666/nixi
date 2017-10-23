		
(function () {
	
	var launcher = function () {
		quwanwansdk.getLoginInfo({
			game_id: 2490,
			server_id: 0,
			callFunc: function (response) {
				console.log(response);
				var data = { uid: response.uid, user_name: response.user_name, sid: response.sid };
				$.post("http://nixi.yunlookgame.cn:9765/h5meitu/login", data, function (result) {
					if (result == "SUCCESS") {
						console.log(result);
						window.UUID = "meitu_h5_" + data.uid;
						egret.runEgret({renderMode:"webgl", audioType:0});
					}
				});
			}
		});
	};	
	
	window.launcher = launcher;
})();