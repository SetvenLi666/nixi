class WebSocketMagr {
	private static webSocket: egret.WebSocket;
	private static isConnected: boolean = false;
	public static connect() {
		if(!this.isConnected) {
			this.webSocket = new egret.WebSocket();
			this.webSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
			this.webSocket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
			this.webSocket.connectByUrl(ConstData.Conf.webSocketAdd);
			this.isConnected = true;
		}
	}

	private static onReceiveMessage(evt: egret.Event) {
		var msg = this.webSocket.readUTF();
		ChatData.updateMsgArray(JSON.parse(msg));
	}

	private static onSocketOpen() {
		console.log("websocket 连接成功");
	}

	public static send(content: string, channel: number) {
		var data: {} = {};
		data["name"] = ShowData.nickname;
		data["chat"] = content;
		data["id"] = LoginData.sid;
		data["channel"] = channel;
		this.webSocket.writeUTF(JSON.stringify(data));
	}
}