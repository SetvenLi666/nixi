class ConfigData {
	private static _mission: {}[] = [];

	public static initConfig(data: {}[]) {
		this._mission = data;
	}

	public static get mission(): {}[] {
		return this._mission;
	}

	public static mission_index_in_phase(mission: number, phase: number): number {
		var oldPhase: number = 0;
		var len = this._mission.length;
		for(var i = 0; i < len; i++) {
			if(this._mission[i]["phase"] < phase) {
				oldPhase += 1;
			}
		}

		return Math.max(mission - oldPhase, 0);
	}

	public static mission_count(phase: number) {
		var rtn: number = 0;
		var len = this._mission.length;
		for(var i = 0; i < len; i ++) {
			if(this._mission[i]["phase"] == phase) {
				rtn += 1;
			}
		}

		return rtn;
	}
}