class Prompt {
	static showPrompt(parent: egret.DisplayObjectContainer, text: string) {
		var sn = `
			<e:Skin xmlns:e="http://ns.egret.com/eui">
				<e:Group id="container" horizontalCenter="0">
					<e:Image source="prompt_bar_png" x="0" y="0"/>
					<e:Label text="${text}" left="0" right="0" bottom="0" top="0" textAlign="center" textColor="0x715966" verticalAlign="middle" size="32" bold="true"/>
				</e:Group>
			</e:Skin>
		`
		var prompt: eui.Component = new eui.Component();
		prompt.skinName = sn;
		prompt.width = DisplayMgr.stageW;
		prompt.height = DisplayMgr.stageH;
		prompt["container"].y = DisplayMgr.stageH * 0.7;
		// prompt.touchEnabled = false;
		// prompt.touchChildren = false;
		parent.addChild(prompt);

		egret.Tween.get(prompt).to({y: -DisplayMgr.stageH * 0.1}, 1000, egret.Ease.backOut).wait(800).to({alpha: 0}, 300).call(function () {
			if (parent.contains(prompt)) {
				parent.removeChild(prompt);
			}
			prompt = null;
		});
	}
	
}