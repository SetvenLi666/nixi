class FriendData {
	private static friendArray: string[] = [];
	private static friendsData: {} = {};

	public static update(obj: Object) {
		console.log("update friendData");
		console.log(obj);
		this.friendsData = obj;
		this.friendArray = [];
		if (!this.isEmpty(obj)) {
			obj[LoginData.sid] = {
				collected: ShowData.collected,
				nickname: ShowData.nickname,
				ondress: ClothesData.ondressCache,
				ornaments: ClothesData.ornamentsCache,
				reset: 0
			};

			this.friendArray = Object.keys(obj).sort(function (a, b) { return obj[b]["collected"] - obj[a]["collected"] });
			var length = this.friendArray.length;
			for (var i = 0; i < length; i++) {
				console.log(this.friendArray[i], obj[this.friendArray[i]]["collected"]);
			}
		}
	}

	private static isEmpty(obj: Object): boolean {
		for (var p in obj) {
			return false;
		}
		return true;
	}

	public static get friendsList(): string[] {
		return this.friendArray;
	}

	public static get friendsObj(): Object {
		return this.friendsData;
	}

	public static isFriend(other_id: string): boolean {
		if (this.friendArray.indexOf(other_id) >= 0) {
			return true;
		}

		return false;
	}
}