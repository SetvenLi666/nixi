module CommonFunc {
	export function Guid() {
	    return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	        return v.toString(16);
	    });
	}

	export function Rand(num: number) {
		var today = new Date();
		var seed = today.getTime();
		return Seed(seed) * num;
	}

	export function simpleCloneObj(obj: any) {
		var temp = JSON.stringify(obj);
		return JSON.parse(temp);
	}

	export function curTimeStamp(): number {
		return new Date().getTime();
	}

	// -------------------------------------------------------------

	function Seed(seed: number){
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280.0;
	};


}