
var sdk = {
	data: {},

	init: function () {
		// var reg = new RegExp("(^|&)" + "token" + "=([^&]*)(&|$)", "i");
		// var r = window.location.search.substr(1).match(reg);

		kkH5sdk.getUserInfo({
			appId: 1140,
			success: function (res) {
				if (res["code"] == 200 && res["message"] == "ok") {
					// var data = "";
					// data = "open_id=" + res["data"]["open_id"] + "&access_token=" + res["data"]["access_token"];
					sdk.data = {
						open_id: res["data"]["open_id"],
						access_token: res["data"]["access_token"]
					};
					console.log(sdk.data);
					$.post("https://nixi-weiduan-game.mzplay1.cn:9765/kuaikan/login", sdk.data, function (info) {
						var result = JSON.parse(info);
						console.log(result);
						if (result["result"] == "SUCCESS") {
							window.UUID = result["uid"];
							egret.runEgret({ renderMode: "webgl" });
						} else {
							console.log(result["message"]);
						}
					});
				}
			},
			fail: function (res) {
				console.log("getUserInfo fail" + JSON.stringify(res));
				kkH5sdk.callLogin({
					success: function () {
						sdk.init();
					},
					fail: function () {
						console.log(data);
						console.log("fail");
					}
				});
			}
		});

		// sdk.data = {
		// 	open_id: _openid,
		// 	access_token: _access_token
		// };
		// console.log(sdk.data);
		// $.post("https://nixi-weiduan-game.mzplay1.cn:9765/kuaikan/login", sdk.data, function (info) {
		// 	var result = JSON.parse(info);
		// 	console.log(result);
		// 	if (result["result"] == "SUCCESS") {
		// 		window.UUID = result["uid"];
		// 		egret.runEgret({renderMode:"webgl"});
		// 	} else {
		// 		console.log(result["message"]);
		// 	}
		// });
		// }
	}
}
