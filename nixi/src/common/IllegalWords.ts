class IllegalWords {
	private static _blankWords: string[];
	private static _learnWords: string[];

	public static illegalWrods(str: string) {
		this._learnWords = str.split("、");
	}

	public static illegalWrods_Nonblank(str: string) {
		this._blankWords = str.split("、");
	}

	public static is_learnWords(text: string): boolean {
		var len = this._learnWords.length;
		for(var i = 0; i < len; i++) {
			if(this._learnWords[i] == text) {
				return true;
			}
		}
		return false;
	}

	public static is_blankWords(text: string): boolean {
		var len = this._blankWords.length;
		for(var i = 0; i < len; i++) {
			if(this._blankWords[i] == text) {
				return true;
			}
		}
		return false;
	}
}