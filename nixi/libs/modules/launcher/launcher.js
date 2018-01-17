
var sdk = {
	data: {},

	init: function () {
		// var reg = new RegExp("(^|&)" + "token" + "=([^&]*)(&|$)", "i");
		// var r = window.location.search.substr(1).match(reg);
		var _openid = "";
		var _access_token = "";
		var _gameid = "";
		var _nowtime = "";
		var _nickname = "";
		var _gender = "";
		var _portrait = "";
		var _invitor = "";
		var _sign = "";

		var hrf = window.location.search;

		var o_reg = new RegExp("(^|&)" + "open_id" + "=([^&]*)(&|$)", "i");
		var o = hrf.substr(1).match(o_reg);
		if (o != null) {
			_openid = unescape(o[2]);
		}

		var at_reg = new RegExp("(^|&)" + "access_token" + "=([^&]*)(&|$)", "i");
		var at = hrf.substr(1).match(at_reg);
		if (at != null) {
			_access_token = unescape(at[2]);
		}

		var g_reg = new RegExp("(^|&)" + "gameid" + "=([^&]*)(&|$)", "i");
		var g = hrf.substr(1).match(g_reg);
		if (g != null) {
			_gameid = unescape(g[2]);
		}

		var t_reg = new RegExp("(^|&)" + "nowtime" + "=([^&]*)(&|$)", "i");
		var t = hrf.substr(1).match(t_reg);
		if (t != null) {
			_nowtime = unescape(t[2])
		}

		var n_reg = new RegExp("(^|&)" + "nickname" + "=([^&]*)(&|$)", "i");
		var n = hrf.substr(1).match(n_reg);
		if (n != null) {
			_nickname = unescape(n[2])
		}

		var gd_reg = new RegExp("(^|&)" + "gender" + "=([^&]*)(&|$)", "i");
		var gd = hrf.substr(1).match(gd_reg);
		if (gd != null) {
			_gender = unescape(gd[2])
		}

		var p_reg = new RegExp("(^|&)" + "portrait" + "=([^&]*)(&|$)", "i");
		var p = hrf.substr(1).match(p_reg);
		if (p != null) {
			_portrait = unescape(p[2])
		}

		var i_reg = new RegExp("(^|&)" + "invitor" + "=([^&]*)(&|$)", "i");
		var i = hrf.substr(1).match(i_reg);
		if (i != null) {
			_invitor = unescape(i[2])
		}

		var s_reg = new RegExp("(^|&)" + "sign" + "=([^&]*)(&|$)", "i");
		var s = hrf.substr(1).match(s_reg);
		if (s != null) {
			_sign = unescape(s[2]);
		}

		sdk.data = {
			open_id: _openid,
			access_token: _access_token
		};
		console.log(sdk.data);
		$.post("https://nixi-weiduan-game.mzplay1.cn:9765/kuaikan/login", sdk.data, function (info) {
			var result = JSON.parse(info);
			console.log(result);
			if (result["result"] == "SUCCESS") {
				window.UUID = result["uid"];
				egret.runEgret({renderMode:"webgl"});
			} else {
				console.log(result["message"]);
			}
		});
	}
}
