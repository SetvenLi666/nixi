/**
 *
 * @author 
 *
 */
class DataMgr {
    public static curTaskId: string = null;
    
    public static checkNews() {
		var request: egret.URLRequest = HttpProtocolMgr.checkNews_910();
		HttpMgr.postRequest(request);
    }
}
