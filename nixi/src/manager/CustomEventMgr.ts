class CustomEventMgr {
	// Export --------------------------------------------------
	static addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void {
		this._dispatcher.addEventListener(type, listener, thisObject, useCapture, priority);
	}

	static once(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void {
		this._dispatcher.once(type, listener, thisObject, useCapture, priority);
	}

	static dispatchEventWith(type: string, bubbles?: boolean, data?: any): boolean {
		return this._dispatcher.dispatchEventWith(type, bubbles, data);
	}

	static removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void {
		return this._dispatcher.removeEventListener(type, listener, thisObject, useCapture);
	}

	// Event & Callback --------------------------------------------------

	// Inner --------------------------------------------------
	static _dispatcher: egret.EventDispatcher = new egret.EventDispatcher();
}