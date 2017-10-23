class MessageData {
	private static messageArray: {}[] = [];

	public static update(arr: {}[]) {
		console.log("messages update");
		if(arr == null) {
			return ;
		}
		this.messageArray = arr;
	}

	public static get messageListData() :{}[] {
		return this.messageArray;
	}
}