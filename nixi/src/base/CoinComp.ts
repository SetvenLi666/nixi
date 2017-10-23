/**
 *
 * @author 
 *
 */
class CoinComp extends eui.Component{
    public coin_bar: eui.Image;
    public label_coin: eui.Label;
    
    public constructor() {
        super();

        egret.log("CoinComp constructor");
        this.skinName = "CoinBarSkin";
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
    }

    private addStage() {
    }

    protected createChildren() {
        super.createChildren();
    }

    protected childrenCreated() {
        super.childrenCreated();
    }
}
