/**
 *
 * @author 
 *
 */
class DisplayMgr {
	public static get stageW() : number{
	    return egret.MainContext.instance.stage.stageWidth;
	}
	
	public static get stageH() : number{
	    return egret.MainContext.instance.stage.stageHeight;
	}

	public static setCenter(spt:egret.DisplayObject) {
		spt.anchorOffsetX = spt.width * 0.5;
        spt.anchorOffsetY = spt.height * 0.5;
        spt.x = DisplayMgr.stageW * 0.5;
        spt.y = DisplayMgr.stageH * 0.5;
	}

	public static set2Center(spt:egret.DisplayObject) {
        spt.x = (DisplayMgr.stageW - spt.width) * 0.5;
		spt.y = (DisplayMgr.stageH - spt.height) * 0.5;
	}

	// public static createSceneMask(): egret.Shape {
	// 	var sceneMask = new egret.Shape();
    //     sceneMask.graphics.beginFill(0xff0000);
    //     sceneMask.graphics.drawRect(0, 0, ConstData.Conf.MaskWidth, ConstData.Conf.MaskHeight);
    //     sceneMask.graphics.endFill();
    //     sceneMask.touchEnabled = false;
	// 	DisplayMgr.setCenter(sceneMask);
    //     return sceneMask;
	// }

	public static createSceneMask(): eui.Rect {
		var sceneMask = new eui.Rect(ConstData.Conf.MaskWidth, ConstData.Conf.MaskHeight, 0xff0000);
        sceneMask.touchEnabled = false;
		DisplayMgr.setCenter(sceneMask);
        return sceneMask;
	}

	public static buttonScale(target, callback: Function = null, ratio=1.02) {
		if(!target.touchEnabled) {
			return;
		}
		target.touchEnabled = false;
		var rtn: egret.Tween = egret.Tween.get(target)
			.to({scaleX: ratio, scaleY: ratio}, 100)
			.to({scaleX: 1, scaleY: 1}, 50)
			.call(function () {
				if(callback !== null) {
					callback.apply(rtn);
					target.touchEnabled = true;
				}
			});
		// if (null !== callback) {
		// 	rtn.call(callback);
		// }
		return rtn;
	}

	// 灰度滤镜
    public static GrayFilter() {
        var colorMatrix = [
            0.3,0.6,0,0,0,
            0.3,0.6,0,0,0,
            0.3,0.6,0,0,0,
            0,0,0,1,0
        ];
        return new egret.ColorMatrixFilter(colorMatrix);
    }
}
