class HistoryLog extends eui.Component implements  eui.UIComponent {
	// Export ----------------------------------------------
	public constructor() {
		super();
		this.skinName = "resource/skins/common/HistoryLogSkin.exml";
	}

	// Event && Callback -----------------------------------
	protected partAdded(partName:string,instance:any):void {
		super.partAdded(partName,instance);
	}

	protected childrenCreated():void {
		super.childrenCreated();
	}

	// Inner -----------------------------------------------
}