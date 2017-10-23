class MailData {
	private static mailList: {}[] = [];

	public static initMailData(arr: {}[]) {
		this.mailList = arr;
	}

	public static get mailArray() : {}[] {
		return this.mailList;
	}
}