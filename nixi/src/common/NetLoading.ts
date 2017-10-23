class NetLoading {
	// Export --------------------------------------------------
	static showLoading() {
		if (this.inst === null) {
			this.init();
		}

		egret.MainContext.instance.stage.addChild(this.inst);
		// parent.addChild(this.inst);
	}

	static removeLoading() {
		var stage: egret.Stage = egret.MainContext.instance.stage;
		if (stage.contains(this.inst)) {
			this.inst.removeChildren();
			stage.removeChild(this.inst);
		}
	}

	// Event & Callback --------------------------------------------------
	static init() {
		var inst = new egret.DisplayObjectContainer();
		this.inst = inst;

		// mask
		var sceneMask = new egret.Shape();
        sceneMask.graphics.beginFill(0x000000);
        sceneMask.graphics.drawRect(0, 0, ConstData.Conf.MaskWidth, ConstData.Conf.MaskHeight);
        sceneMask.graphics.endFill();
        DisplayMgr.setCenter(sceneMask);
        sceneMask.touchEnabled = true;
		sceneMask.alpha = 0.2;
        inst.addChild(sceneMask);
		// sceneMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);

		var data = RES.getRes("netloading_json");
		var tex = RES.getRes("netloading_png");
		var mcf:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, tex);
		var movie = new egret.MovieClip(mcf.generateMovieClipData());
		DisplayMgr.set2Center(movie);
		inst.addChild(movie);
		movie.play(-1);
	}
	
	// Inner --------------------------------------------------
	static inst: egret.DisplayObjectContainer = null;

	// static onTap() {
	// 	console.log("tag loading ...");
		
	// }
}