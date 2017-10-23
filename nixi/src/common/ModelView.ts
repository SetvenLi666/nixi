/**
 *
 * @author 
 *
 */
class ModelView extends eui.Component {
	private group: eui.Group;
	private group_2: eui.Group;

	//头发
    private _toufa: eui.Image;
	private _toufa_2: eui.Image;
	//外套
    private _waitao: eui.Image;
	private _waitao_2: eui.Image;
	private _waitao_3: eui.Image;
	//上衣
	private _shangyi: eui.Image;
    private _shangyi_2: eui.Image;
	//裤子
    private _kuzi: eui.Image;
	private _kuzi_2: eui.Image;
	//袜子
    private _wazi: eui.Image;
	//鞋子
    private _xiezi: eui.Image;
	//饰品
    private _shipin_maozi: eui.Image;         //帽子
	private _shipin_maozi_2: eui.Image;
	private _shipin_yanjing: eui.Image;       //眼镜
	private _shipin_erhuan: eui.Image;       //耳环
	private _shipin_xianglian: eui.Image;       //项链
	private _shipin_xianglian_2: eui.Image;
	private _shipin_shoutao: eui.Image;       //手套
	private _shipin_yaodai: eui.Image;       //腰带
	private _shipin_tuihuan: eui.Image;       //腿环
	private _shipin_jiaohuan: eui.Image;       //脚环
	private _shipin_xionghua: eui.Image;       //胸花
	//包
    private _bao: eui.Image;
	private _bao_2: eui.Image;
	private _bao_3: eui.Image;

	public constructor() {
		super();

		this.skinName = "ModelCompSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.group.width = DisplayMgr.stageW;
		this.group_2.width = Math.min(DisplayMgr.stageW, 852);
		this.initModelClothes();
		EventMgr.inst.addEventListener(CustomEvents.DressDown, this.dressDownClothes, this);
		EventMgr.inst.addEventListener(CustomEvents.ChangeClothes, this.changeClothes, this);
	}

	private initModelClothes() {
		// this._shipin_maozi_2 = new eui.Image();
		// this.addChild(this._shipin_maozi_2);

		// this._toufa_2 = new eui.Image("10009_png");
		// this.addChild(this._toufa_2);
		this._toufa_2.source = "10009_png";

		// this._waitao_2 = new eui.Image();
		// this.addChild(this._waitao_2);

		// this._bao_2 = new eui.Image();
		// this.addChild(this._bao_2);

		// this._shipin_xianglian_2 = new eui.Image();
		// this.addChild(this._shipin_xianglian_2);

		// this._shangyi_2 = new eui.Image();
		// this.addChild(this._shangyi_2);

		// this._kuzi_2 = new eui.Image();
		// this.addChild(this._kuzi_2);


		//上面是最里层
		// var body = new egret.Bitmap();
		// body.texture = RES.getRes("gj_man_png");
		// this.addChild(body);

		// var face = new egret.Bitmap();
		// face.texture = RES.getRes("gj_lian_png");
		// this.addChild(face);
		//下面是外层

		// this._wazi = new eui.Image();
		// this.addChild(this._wazi);

		// this._shipin_jiaohuan = new eui.Image();
		// this.addChild(this._shipin_jiaohuan);

		// this._xiezi = new eui.Image();
		// this.addChild(this._xiezi);

		// this._shipin_tuihuan = new eui.Image();
		// this.addChild(this._shipin_tuihuan);

		// this._kuzi = new eui.Image("40000_png");
		// this.addChild(this._kuzi);
		this._kuzi.source = "40000_png";

		// this._bao_3 = new eui.Image();
		// this.addChild(this._bao_3);

		// this._shipin_shoutao = new eui.Image();
		// this.addChild(this._shipin_shoutao);

		// this._shangyi = new eui.Image("30000_png");
		// this.addChild(this._shangyi);
		this._shangyi.source = "30000_png";

		// this._shipin_xianglian = new eui.Image();
		// this.addChild(this._shipin_xianglian);

		// this._shipin_yaodai = new eui.Image();
		// this.addChild(this._shipin_yaodai);

		// this._waitao = new eui.Image();
		// this.addChild(this._waitao);

		// this._bao = new eui.Image();
		// this.addChild(this._bao);

		// this._shipin_xionghua = new eui.Image();
		// this.addChild(this._shipin_xionghua);

		// this._shipin_yanjing = new eui.Image();
		// this.addChild(this._shipin_yanjing);

        // this._toufa = new eui.Image("10000_png");
		// this.addChild(this._toufa);
		this._toufa.source = "10000_png";

		// this._shipin_erhuan = new eui.Image();
		// this.addChild(this._shipin_erhuan);

		// this._shipin_maozi = new eui.Image();
		// this.addChild(this._shipin_maozi);
	}

	public changeClothes(evt: CustomEvents) {
		var data = evt.data;
		egret.log("selectedID = " + data.id);
		switch (data.part) {
			case "1":
				this._toufa.source = data.layer1 + "_png";
				if (data.layer2 == "") {
					this._toufa_2.source = "";
				} else {
					this._toufa_2.source = data.layer2 + "_png";
				}
				break;
			case "2":
				this._waitao.source = data.layer1 + "_png";

				break;
			case "3":
				this._shangyi.source = data.layer1 + "_png";

				break;
			case "4":
				this._kuzi.source = data.layer1 + "_png";

				break;
			case "5":
				this._wazi.source = data.layer1 + "_png";

				break;
			case "6":
				this._xiezi.source = data.layer1 + "_png";

				break;
			case "7":
				switch (data.sub_part) {
					case "11":
						this._shipin_maozi.source = data.layer1 + "_png";
						if (data.layer2 == "") {
							this._shipin_maozi_2.source = "";
						} else {
							this._shipin_maozi_2.source = data.layer2 + "_png";
						}
						break;
					case "12":
						this._shipin_yanjing.source = data.layer1 + "_png";
						break;
					case "13":
						this._shipin_erhuan.source = data.layer1 + "_png";
						break;
					case "14":
						this._shipin_xianglian.source = data.layer1 + "_png";
						if (data.layer2 == "") {
							this._shipin_xianglian_2.source = "";
						} else {
							this._shipin_xianglian_2.source = data.layer2 + "_png";
						}
						break;
					case "15":
						this._shipin_shoutao.source = data.layer1 + "_png";
						break;
					case "16":
						this._shipin_yaodai.source = data.layer1 + "_png";
						break;
					case "17":
						this._shipin_tuihuan.source = data.layer1 + "_png";
						break;
					case "18":
						this._shipin_jiaohuan.source = data.layer1 + "_png";
						break;
					case "19":
						this._shipin_xionghua.source = data.layer1 + "_png";
						break;
				}

				break;
			case "8":
				this._bao.source = data.layer1 + "_png";
				if (data.layer2 == "") {
					this._bao_2.source = "";
				} else {
					this._bao_2.source = data.layer2 + "_png";
				}
				if (data.layer3 == "") {
					this._bao_3.source = "";
				} else {
					this._bao_2.source = data.layer3 + "_png";
					this._bao_3.source = data.layer2 + "_png";
				}

				break;
		}
	}

	private dressDownClothes(evt: CustomEvents) {
		var data = evt.data;
		switch (data.part) {
			case "1":
				this._toufa.source = "10000_png";
				this._toufa_2.source = "10009_png";
				break;
			case "2":
				this._waitao.source = "";
				this._waitao_2.source = "";
				break;
			case "3":
				this._shangyi.source = "30000_png";
				this._shangyi_2.source = "";
				break;
			case "4":
				this._kuzi.source = "40000_png";
				this._kuzi_2.source = "";
				break;
			case "5":
				this._wazi.source = "";
				break;
			case "6":
				this._xiezi.source = "";
				break;
			case "7":
				switch (data.sub_part) {
					case "11":
						this._shipin_maozi.source = "";
						this._shipin_maozi_2.source = "";
						break;
					case "12":
						this._shipin_yanjing.source = "";
						break;
					case "13":
						this._shipin_erhuan.source = "";
						break;
					case "14":
						this._shipin_xianglian.source = "";
						this._shipin_xianglian_2.source = "";
						break;
					case "15":
						this._shipin_shoutao.source = "";
						break;
					case "16":
						this._shipin_yaodai.source = "";
						break;
					case "17":
						this._shipin_tuihuan.source = "";
						break;
					case "18":
						this._shipin_jiaohuan.source = "";
						break;
					case "19":
						this._shipin_xionghua.source = "";
						break;
				}
				break;
			case "8":
				this._bao.source = "";
				this._bao_2.source = "";
				this._bao_3.source = "";
				break;
		}
	}
}
