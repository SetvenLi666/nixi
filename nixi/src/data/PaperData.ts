class PaperData {
	private static paperArray: {}[] = [];
	
	public static initPaperData(arr: {}[]) {
		this.paperArray = arr;
	}

	public static delete_paper(id: number) {
		var length = this.paperArray.length;
		for(var i = length - 1; i >= 0; i--) {
			if(id == this.paperArray[i]["id"]) {
				this.paperArray.splice(i, 1);
			}
		}
	}

	public static get paperListData() :{}[] {
		return this.paperArray;
	}
	
}