class TalkComp extends eui.Component {
	public text: eui.Label;
	private content: string = "";

	public constructor(content: string) {
		super();

		this.skinName = "TalkCompSkin";
		this.content = content;
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		
		this.typerEffect(this.text, this.content);
	}

	private onExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
		egret.Tween.removeTweens(this);
	}

	private typerEffect(obj, content: string = "来啊，快活呀"): void {
		var self = this;
        var strArr: Array<any> = content.split("");
        var len: number = strArr.length;
        for (var i = 0; i < len; i++) {
            egret.setTimeout(function () {
                obj.appendText(strArr[Number(this)]);
                if (Number(this) >= len - 1) {
                    self.typerCallback();
                }
            }, i, 150 * i);
        }
    }

	private typerCallback() {
		var self = this;
		if (PlayerData.guide == 1) {
			CustomEventMgr.dispatchEventWith("Play Guide Animation", false);
		}
		egret.setTimeout(function () {
			var tw = egret.Tween.get(this);
			tw.to({ alpha: 0 }, 1500).call(function () {
				self.close();
			}, self);
		}, this, 5000);

	}

	private close() {
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}
}