class ChatBar extends eui.Component {
	public msgNum: eui.Label;
	public nickname: eui.Label;
	public chat: eui.Label;

	public chatMask: eui.Rect;

	public num: number = 0;
	private chatIndex: number = -1;
	private nextBool: boolean = true;

	private timer: egret.Timer;
	private newChatIndex: number;

	public constructor() {
		super();

		this.skinName = "ChatBarSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		// this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		CustomEventMgr.addEventListener("UPDATE_SCROLLER_VIEW", this.updateChatBar, this);

		this.visible = false;
		this.chat.mask = this.chatMask;

		this.timer = new egret.Timer(2000, 0);
		this.timer.addEventListener(egret.TimerEvent.TIMER, this.displayNewChat, this);
		this.timer.start();
	}

	private onExit() {
		CustomEventMgr.removeEventListener("UPDATE_SCROLLER_VIEW", this.updateChatBar, this);
		this.timer.stop();
		this.timer.reset();
	}

	private updateChatBar(evt: egret.Event) {
		if(evt.data["channel"] && evt.data["channel"] == 1) {
			if(!ChatData.isOpen) {
				this.visible = true;
			}

			this.num++;
			this.num = Math.min(99, this.num);
			this.msgNum.text = this.num + "";
		}
	}

	private displayNewChat() {
		if (ChatData.len == 0 || ChatData.curIndex == ChatData.len) {
			
		} else {

			if(ChatData.msg.getItemAt(ChatData.curIndex)["channel"] && ChatData.msg.getItemAt(ChatData.curIndex)["channel"] == 1) {
			
			egret.Tween.removeTweens(this.chat);
			this.nickname.text = ChatData.msg.getItemAt(ChatData.curIndex)["name"] + ": ";
			this.chat.text = ChatData.msg.getItemAt(ChatData.curIndex)["chat"];
			this.chatMask.width = this.width - 35 - 40 - this.nickname.width;
			
			// console.log(this.nickname.text);
			// console.log(this.chat.text);
			// console.log(this.chatMask.width);

			this.chat.alpha = 1;
			if (this.chat.width > this.chatMask.width) {
				this.chat.x = this.chatMask.x + this.chatMask.width / 2;
				var tw = egret.Tween.get(this.chat);
				var dis = this.chat.width - this.chatMask.width / 2;
				var endX = this.chat.x - dis;
				var self = this;
				tw.to({ x: endX }, dis / 0.05);
			} else {
				this.chat.x = 40 + this.nickname.width;
				var self = this;
				var tw = egret.Tween.get(this.chat);
				tw.to({ alpha: 0.5 }, 200)
					.to({ alpha: 1 }, 200)
					.to({ alpha: 0.5 }, 200)
					.to({ alpha: 1 }, 200);
			};
			}

			ChatData.curIndex = ChatData.curIndex + 1;
		}
	}

	private onTouch() {
		this.num = 0;
		this.chatIndex = -1;

		this.visible = false;

		var chatPanel = new ChatPanel();
		DisplayMgr.set2Center(chatPanel);
		this.stage.addChild(chatPanel);
	}
}