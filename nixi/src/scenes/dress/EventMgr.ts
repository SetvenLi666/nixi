class EventMgr extends egret.EventDispatcher{
	private static _instance: EventMgr = null;
	public static get inst(): EventMgr{
		if(EventMgr._instance == null) {
			EventMgr._instance = new EventMgr();
		}
		return EventMgr._instance;
	}

	public constructor() {
		super();
	}
}