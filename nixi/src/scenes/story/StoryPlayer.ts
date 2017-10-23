class StoryPlayer extends eui.Component implements eui.UIComponent {
	// Export -------------------------------------------------
	public constructor() {
		super();
		this.skinName = "resource/skins/story/StoryPlayerSkin.exml";
	}

	public init(callback: Function, handler: Object) {
		this.plot = null;
		this.oldBgData = "";
		this.oldBody1Data = "";
		this.oldBody2Data = "";
		this.oldHead1Data = "";
		this.oldHead2Data = "";

		this.playCompleteCallback = callback;
		this.playCompleteHandler = handler;
	}

	public play(plot: {}) {
		this.plot = plot;

		this.playBg();
	}

	public fastPlay(plot: {}) {
		var self = this;
		self.plot = plot;
		if (self.plot["bg"] === "keep") { // keep

		}
		else {
			// self.bg.source = "bg_" + self.plot["bg"].split(".")[0] + "_png";
			self.bg.source = self.plot["bg"].split(".")[0] + "_png";
		}

		if (self.plot["zishi_1"] === "") { // disapper
			self.body1.source = "";
			self.head1.source = "";
			self.oldBody1Data = self.plot["zishi_1"];
			self.oldHead1Data = self.plot["head_1"];

		}
		else { // appear
			if (self.plot["zishi_1"] === self.oldBody1Data) { // 姿势不变，可能换脸
				// self.head1.source = "head_" + self.plot["head_1"];
				self.oldHead1Data = self.plot["head_1"];
				RES.getResAsync("head_" + self.plot["head_1"], function (data, key) {
					if (data) {
						self.head1.source = data;
					} else {
						self.head1.source = "";
					}
				}, this);
			}
			else {
				// self.body1.source = "body_" + self.plot["zishi_1"];
				// self.head1.source = "head_" + self.plot["head_1"];
				RES.getResAsync("body_" + self.plot["zishi_1"], function (data, key) {
					if (data) {
						self.body1.source = data;
					} else {
						self.body1.source = "";
					}
				}, this);

				RES.getResAsync("head_" + self.plot["head_1"], function (data, key) {
					if (data) {
						self.head1.source = data;
					} else {
						self.head1.source = "";
					}
				}, this);

				self.oldBody1Data = self.plot["zishi_1"];
				self.oldHead1Data = self.plot["head_1"];

				self.player1.alpha = 1;
			}
		}

		if (self.plot["zishi_2"] === "") { // disapper
			self.body2.source = "";
			self.head2.source = "";
			self.oldBody2Data = self.plot["zishi_2"];
			self.oldHead2Data = self.plot["head_2"];

		}
		else { // appear
			if (self.plot["zishi_2"] === self.oldBody2Data) { // 姿势不变，可能换脸
				// self.head2.source = "head_" + self.plot["head_2"];
				RES.getResAsync("head_" + self.plot["head_2"], function (data, key) {
					self.head2.source = data;
				}, this);
				self.oldHead2Data = self.plot["head_2"];

			}
			else {
				// self.body2.source = "body_" + self.plot["zishi_2"];
				// self.head2.source = "head_" + self.plot["head_2"];
				RES.getResAsync("body_" + self.plot["zishi_2"], function(data, key) {
					if(data) {
						self.body2.source = data;
					}else {
						self.body2.source = "";
					}
					
				}, this);

				RES.getResAsync("head_" + self.plot["head_2"], function(data, key) {
					if(data) {
						self.head2.source = data;
					}else {
						self.head2.source = "";
					}
				}, this);
				self.oldBody2Data = self.plot["zishi_2"];
				self.oldHead2Data = self.plot["head_2"];

				self.player2.alpha = 1;
			}
		}
	}

	// Event && Callback ---------------------------------------
	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}

	protected childrenCreated(): void {
		super.childrenCreated();
	}

	// Inner --------------------------------------------------
	public bg: eui.Image;
	private player1: eui.Group;
	private player2: eui.Group;
	private body1: eui.Image;
	private body2: eui.Image;
	private head1: eui.Image;
	private head2: eui.Image;

	private playCompleteCallback: Function;
	private playCompleteHandler: Object;

	private plot: {};
	private oldBgData: string;
	private oldBody1Data: string;
	private oldBody2Data: string;
	private oldHead1Data: string;
	private oldHead2Data: string;

	private playBg() {
		var self = this;

		if (self.plot["bg"] === "keep") { // keep
			self.oldBgData = self.plot["bg"];
			self.playPlayer1();
		}
		else {
			var newSource = self.plot["bg"].split(".")[0] + "_png";
			// var newSource = "";
			// RES.getResAsync(self.plot["bg"].split(".")[0] + "_png", function (data, key) {
			// 	if (data) {
			// 		newSource = data;
			// 	}else {
			// 		newSource = "1_png";
			// 	}
			// }, this);

			// egret.Tween.get(self.bg)
			// 	.to({ alpha: 0.1 }, 300)
			// 	.call(function () {
			// 		self.bg.source = newSource;
			// 	}).to({ alpha: 1 }, 500)
			// 	.call(function () {
			// 		self.oldBgData = self.plot["bg"];
			// 		self.playPlayer1();
			// 	})

			self.bg.source = newSource;
			self.oldBgData = self.plot["bg"];
			self.playPlayer1();
		}
	}

	private playPlayer1() {
		// 注意：在同一个plot中，某个位置的player只能消失，或者出现，不可同时消失并出现
		var self = this;
		if (self.plot["zishi_1"] === "") { // disapper
			if (self.oldBody1Data !== self.plot["zishi_1"]) {
				egret.Tween.get(self.player1)
					// .to({ alpha: 0 }, 200)
					.call(function () {		// 只消失，不更改 image source，也不修改oldData
						self.body1.source = "";
						self.head1.source = "";
						RES.getResAsync(self.plot["zishi_1"], function (data, key) {
							if (data) {
								self.oldBody1Data = data;
							} else {
								self.oldBody1Data = "";
							}
						}, this);
						if (RES.getRes(self.plot["head_1"])) {
							self.oldHead1Data = self.plot["head_1"];
						} else {
							self.oldHead1Data = "";
						}
						RES.getResAsync(self.plot["head_1"], function (data, key) {
							if (data) {
								self.oldHead1Data = data;
							} else {
								self.oldHead1Data = "";
							}
						}, this);

						self.playPlayer2();
					})
			}
			else {
				// 保持消失状态
				self.playPlayer2();
			}
		}
		else { // appear
			if (self.plot["zishi_1"] === self.oldBody1Data) { // 姿势不变，可能换脸
				// self.head1.source = "head_" + self.plot["head_1"];
				// self.oldHead1Data = self.plot["head_1"];
				RES.getResAsync("head_" + self.plot["head_1"], function (data, key) {
					if (data) {
						self.head1.source = data;
					} else {
						self.head1.source = "";
					}
				}, this);

				RES.getResAsync(self.plot["head_1"], function (data, key) {
					if (data) {
						self.oldHead1Data = data;
					} else {
						self.oldHead1Data = "";
					}
				}, this);

				self.playPlayer2();
			}
			else {
				// self.body1.source = "body_" + self.plot["zishi_1"];
				// self.head1.source = "head_" + self.plot["head_1"];
				RES.getResAsync("body_" + self.plot["zishi_1"], function (data, key) {
					if (data) {
						self.body1.source = data;
					} else {
						self.body1.source = "";
					}
				}, this);

				RES.getResAsync("head_" + self.plot["head_1"], function (data, key) {
					if (data) {
						self.head1.source = data;
					} else {
						self.head1.source = "";
					}
				}, this);

				// self.player1.alpha = 0;
				egret.Tween.get(self.player1)
					// .to({ alpha: 1 }, 200)
					.call(function () {
						self.oldBody1Data = self.plot["zishi_1"];
						self.oldHead1Data = self.plot["head_1"];
						// RES.getResAsync(self.plot["zishi_1"], function(data, key) {
						// 	if(data) {
						// 		self.oldBody1Data = data;
						// 	}else {
						// 		self.oldBody1Data = "";
						// 	}
						// }, this);

						// RES.getResAsync(self.plot["head_1"], function (data, key) {
						// 	if(data) {
						// 		self.oldHead1Data = data;
						// 	}else {
						// 		self.oldHead1Data = "";
						// 	}
						// }, this);

						self.playPlayer2();
					})
			}
		}
	}

	private playPlayer2() {
		// 注意：在同一个plot中，某个位置的player只能消失，或者出现，不可同时消失并出现
		var self = this;
		if (self.plot["zishi_2"] === "") { // disapper
			if (self.oldBody2Data !== self.plot["zishi_2"]) {
				egret.Tween.get(self.player2)
					// .to({ alpha: 0 }, 200)
					.call(function () {		// 只消失，不更改 image source，也不修改oldData
						self.body2.source = "";
						self.head2.source = "";
						self.oldBody2Data = self.plot["zishi_2"];
						self.oldHead2Data = self.plot["head_2"];

						self.playCompleteCallback.apply(self.playCompleteHandler, []);
					})
			}
			else {
				// 保持消失状态
				self.playCompleteCallback.apply(self.playCompleteHandler, []);
			}
		}
		else { // appear
			if (self.plot["zishi_2"] === self.oldBody2Data) { // 姿势不变，可能换脸
				// self.head2.source = "head_" + self.plot["head_2"];
				// self.oldHead2Data = self.plot["head_2"];
				RES.getResAsync("head_" + self.plot["head_2"], function (data, key) {
					if (data) {
						self.head2.source = data;
					} else {
						self.head2.source = "";
					}
				}, this);

				RES.getResAsync(self.plot["head_2"], function (data, key) {
					if (data) {
						self.oldHead2Data = data;
					} else {
						self.oldHead2Data = "";
					}

				}, this);

				self.playCompleteCallback.apply(self.playCompleteHandler, []);
			}
			else {
				// self.body2.source = "body_" + self.plot["zishi_2"];
				// self.head2.source = "head_" + self.plot["head_2"];
				RES.getResAsync("body_" + self.plot["zishi_2"], function (data, key) {
					if (data) {
						self.body2.source = data;
					} else {
						self.body2.source = "";
					}
				}, this);

				RES.getResAsync("head_" + self.plot["head_2"], function (data, key) {
					if (data) {
						self.head2.source = data;
					} else {
						self.head2.source = "";
					}
				}, this);

				// self.player2.alpha = 0;
				egret.Tween.get(self.player2)
					// .to({ alpha: 1 }, 200)
					.call(function () {
						self.oldBody2Data = self.plot["zishi_2"];
						self.oldHead2Data = self.plot["head_2"];


						self.playCompleteCallback.apply(self.playCompleteHandler, []);
					})
			}
		}
	}
}