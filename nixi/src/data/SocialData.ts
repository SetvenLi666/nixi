class SocialData {
	private static energy_token: number = 0;
	private static energy_receive: string[] = [];
	private static energy_send: string[] = [];
	private static friends: string[] = [];
	private static requesters: string[] = [];

	public static update(obj: Object) {
		console.log("social update");
		if(obj == null) {
			console.log("obj is null");
			return ;
		}
		this.energy_token = obj["energy_token"];
		this.energy_receive = obj["energy_receive"];
		this.energy_send = obj["energy_send"];
		this.requesters = obj["requesters"];
		this.friends = obj["friends"];
	}

	public static init_friends(obj: Object) {
		
	}

	public static get energyToken() :number {
		return this.energy_token;
	}

	public static get energyReceiveList() :string[] {
		return this.energy_receive;
	}

	public static get energy_could_take() :number {
		return this.energy_receive.length;
	}

	public static get energySend() :string[] {
		return this.energy_send;
	}

	public static get friendsList() :string[] {
		return this.friends;
	}

	public static get requestersList() :string[] {
		return this.requesters;
	}
}