class PhaseComp extends eui.Component{
	public phase: eui.Label;
	public phaseBar: eui.ProgressBar;

	public constructor() {
		super();

		this.skinName = "PhaseBarSkin";

		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.phase.text = PlayerData.phase + "";
		this.phaseBar.maximum = ConfigData.mission_count(PlayerData.phase);
		this.phaseBar.minimum = 0;
		this.phaseBar.value = ConfigData.mission_index_in_phase(PlayerData.mission, PlayerData.phase);
	}
}