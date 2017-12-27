declare var KJSDK: {
	/** 初始化接口
	 * 	var initdata= {
		'title':shareTitle, //分享标题
		'desc':shareContent, //游戏提供分享描述
		'imgUrl':shareImgUrl //分享图片链接
		};
		KJSDK.init(initdata);
	 */
	init(obj: any): void;

	/** 支付接口
	 * 	var paydata= {
		'fee':fee, //游戏方提供的支付金额（单位：元）
		'extra':extra, //游戏方提供的透传参数
		'openid':openid //用户id
		'paySuccess'：paySuccess //充值成功的回调函数
		'payFail':payFail //充值失败的回调函数
		};
		KJSDK.pay(paydata);
	 */
	pay(obj: any): void

	/** 分享接口
	 * 	var sharedata= {
		'title':shareTitle, //分享标题
		'desc':shareContent, //游戏提供分享描述
		'imgUrl':shareImgUrl //分享图片链接
		'gameid':gameid//游戏id
		'shareSuccess':shareSuccess//分享成功回调函数
		'shareCancel':shareCancel//分享失败回调函数
		};
		KJSDK.share(sharedata);
	 */
	share(obj: any): void
}