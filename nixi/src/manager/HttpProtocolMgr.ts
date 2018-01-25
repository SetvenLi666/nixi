class HttpProtocolMgr {
    // Export --------------------------------------------------
    static easyLogin_900(channel: number, guid: string): egret.URLRequest {
        // {"channel":0,"type":1,"uuid":"810BCB5C-AE40-4FA5-B04B-63BF0210E4DD"}
        var data = {};
        data["uuid"] = guid;
        data["type"] = 1;
        data["channel"] = channel;
        var rtn = this.newRequest("900", JSON.stringify(data));
        // var header1: egret.URLRequestHeader = new egret.URLRequestHeader("pragma", "no-cache");
        // rtn.requestHeaders.push(header1);
        return rtn;
    }

    static gameLogin_902(skey: string): egret.URLRequest {
        var data = {};
        data["skey"] = skey;
        return this.newRequest("902", JSON.stringify(data));
    }

    static saveNickname_904(nickname: string): egret.URLRequest {
        var data = {};
        data["nickname"] = nickname;
        return this.newRequest("904", JSON.stringify(data));
    }

    static checkNews_910(): egret.URLRequest {
        return this.newRequest("910", JSON.stringify({}));
    }

    static reset_nickname_907(name: string) :egret.URLRequest {
        var data: {} = {};
        data["nickname"] = name;
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("907", JSON.stringify(data));
    }

    static update_guide_905(guide: number) {
        var data: {} = {};
        data["guide"] = guide;
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("905", JSON.stringify(data));
    }

    static before_send_shout_831() {
        var data: {} = {};
        data["id"] = 1;
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("831", JSON.stringify(data));
    }

    static competition_prepare_827() {
        var data: {} = {};
        data["id"] = 1;
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("827", JSON.stringify(data));
    }

    static competition_start_825() {
        var data: {} = {};
        data["id"] = 1;
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("825", JSON.stringify(data));
    }

    static competition_bless_823() {
        var data: {} = {};
        data["id"] = 1;
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("823", JSON.stringify(data));
    }

    static competition_search_opponent_821() {
        var data: {} = {};
        data["id"] = 1;
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("821", JSON.stringify(data));
    }

    static competition_info_820(full: boolean) {
        var data: {} = {};
        data["full"] = full;
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("820", JSON.stringify(data));
    }

    static delete_friend_813(id: string): egret.URLRequest {
        var data: {} = {};
        data["other"] = id;
        return this.newRequest("813", JSON.stringify(data));
    }

    static delete_paper_811(id: string): egret.URLRequest  {
        var data: {} = {};
        data["id"] = id;
        return this.newRequest("811", JSON.stringify(data));
    }

    static send_papar_809(other_id: string, text: string): egret.URLRequest  {
        var data: {} = {};
        data["other"] = other_id;
        data["contents"] = text;
        egret.log("=====");
        egret.log(JSON.stringify(data));
        return this.newRequest("809", JSON.stringify(data));
    }

    static all_paper_808(): egret.URLRequest  {
        return this.newRequest("808", "");
    }

    static take_energy_807() {
        var data: {} = {};
        data["param"] = 1;
        return this.newRequest("807", JSON.stringify(data));
    }

    static friendListData_806(): egret.URLRequest  {
        return this.newRequest("806", "");
    }

    static response_message_805(id: string, oper: number): egret.URLRequest  {
        var data: {} = {};
        data["id"] = id;
        data["oper"] = oper;
        return this.newRequest("805", JSON.stringify(data));
    }

    static all_messages_804(): egret.URLRequest  {
        return this.newRequest("804", "");
    }

    static send_message_803(other_id: string, type: number): egret.URLRequest  {
        var data: {} = {};
        data["other"] = other_id;
        data["type"] = type;
        data["openid"] = window["OPEN_DATA"].openid;
        data["openkey"] = window["OPEN_DATA"].openkey;
        data["platform"] = window["OPEN_DATA"].platform;
        data["friend_list"] = LoginData.friend_list;
        data["userip"] = LoginData.userip;
        data["qua"] = window["OPEN_DATA"].qua.meybeQua;
        return this.newRequest("803", JSON.stringify(data));
    }

    static strangerListData_802(): egret.URLRequest  {
        return this.newRequest("802", "");
    }

    static search_other_801(other_id: string) {
        var data: {} = {};
        data["other"] = other_id;
        return this.newRequest("801", JSON.stringify(data));
    }

    static social_info_800(): egret.URLRequest  {
        return this.newRequest("800", "");
    }

    static commit_game_707(game_id: string, score: number): egret.URLRequest  {
        var data: {} = {};
        data["id"] = game_id;
        data["score"] = score;
        data["extra"] = (new Date()).valueOf();
        return this.newRequest("707", JSON.stringify(data));
    }

    static change_house_705(id:string): egret.URLRequest  {
        var data: {} = {};
        data["id"] = id;
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("705", JSON.stringify(data));
    }

    static home_info_704(full: boolean): egret.URLRequest  {
        var data: {} = {};
        data["full"] = full;
        return this.newRequest("704", JSON.stringify(data));
    }

    static response_mail_701(id: number, oper: number): egret.URLRequest  {
        var data: {} = {};
        data["id"] = id;
        data["oper"] = oper;
        return this.newRequest("701", JSON.stringify(data));
    }

    static all_mails_700(): egret.URLRequest  {
        return this.newRequest("700", "");
    }

    static take_welfare_data_630() {
        return this.newRequest("630", "");
    }

    static take_welfare_reward_631(id: string) {
        var data: {} = {};
        data["id"] = id;
        return this.newRequest("631", JSON.stringify(data));
    }

    static take_welfare_progress_reward_633(id: string) {
        var data: {} = {};
        data["id"] = id;
        return this.newRequest("633", JSON.stringify(data));
    }

    static take_mystery_achv_615(category: string, id: string) {
        var data = {};
        data["category"] = category;
        data["id"] = id;
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("615", JSON.stringify(data));
    }

    static start_mystery_611(category: string) {
        var data = {};
        data["category"] = category;
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("611", JSON.stringify(data));
    }

    static fetch_mystery_info_610(full: boolean) {
        var data = {};
        data["full"] = full;
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("610", JSON.stringify(data));
    }

    static fetchMissionData_600(): egret.URLRequest {
        return this.newRequest("600", JSON.stringify({}));
    }

    static commit_mission_603(taskId: string): egret.URLRequest {
        var data = {};
        data["id"] = parseInt(taskId, 10);
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("603", JSON.stringify(data));
    }

    static commit_extra_mission_605(id: number, type: number, flag: number): egret.URLRequest {
        var data = {};
        data["id"] = id;
        data["type"] = type;
        data["flag"] = flag;
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("605", JSON.stringify(data));
    }

    static fetchStoryData_500(): egret.URLRequest {
        return this.newRequest("500", JSON.stringify({}));
    }

    static startStory_501(strIndex: string): egret.URLRequest {
        var data = {};
        data["id"] = strIndex;
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("501", JSON.stringify(data));
    }

    static commitStory_503(strIndex: string, flag: string): egret.URLRequest {
        var data = {};
        data["id"] = strIndex;
        data["flag"] = flag;
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("503", JSON.stringify(data));
    }

    static commit_story2_507(strIndex: string , flag: string): egret.URLRequest {
        var data = {};
        data["id"] = strIndex;
        data["flag"] = flag;
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("507", JSON.stringify(data));
    }

    static start_vipstory_509(id: string): egret.URLRequest {
        var data = {};
        data["id"] = id;
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("509", JSON.stringify(data));
    }

    static buy_vipstory_515(id: string): egret.URLRequest {
        var data = {};
        data["id"] = id;
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("515", JSON.stringify(data));
    }

    static fetchVipStoryData_504(): egret.URLRequest {
        return this.newRequest("504", JSON.stringify({}));
    }

    static save_competition_dress_405(dresses: Object, ornaments: Object): egret.URLRequest {
        var data = {};
        data["ondress"] = dresses;
        data["ornaments"] = ornaments;
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("405", JSON.stringify(data));
    }

    static new_save_dressed_403(dresses: Object, ornaments: Object): egret.URLRequest {
        var data = {};
        data["ondress"] = dresses;
        data["ornaments"] = ornaments;
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("403", JSON.stringify(data));
    }

    // static save_dress_401(dresses: Object, ornaments: Object): egret.URLRequest {
    //     var data = {};
    //     data["ondress"] = dresses;
    //     data["ornaments"] = ornaments;
    //     data["extra"] = CommonFunc.curTimeStamp();
    //     return this.newRequest("401", JSON.stringify(data));
    // }

    static fetchOwnClothesData_400(): egret.URLRequest  {
        return this.newRequest("400", "");
    }

    static take_shuangdan_reward_341(id: string) {
        var data: {} = {};
        data["id"] = id;
        return this.newRequest("341", JSON.stringify(data));
    }

    static take_shuangdanSign_info_340() {
        return this.newRequest("340", "");
    }

    static commit_daily_signin_323() {
        var data: {} = {};
        data["id"] = 1;
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("323", JSON.stringify(data));
    }

    static take_gift_333(channel: number, code: string) {
        var data:{} = {};
        data["channel"] = channel;
        data["code"] = code;
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("333", JSON.stringify(data));
    }

    static perform_signin7_313() {
        var data: {} = {};
        data["id"] = CommonFunc.curTimeStamp();
        return this.newRequest("313", JSON.stringify(data));
    }

    static signin7_info_312(full: boolean) {
        var data: {} = {};
        data["full"] = full;
        return this.newRequest("312", JSON.stringify(data));
    }

    static exchange_clothes_311(clothes_id: string) {
        var data: {} = {};
        data["id"] = clothes_id;
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("311", JSON.stringify(data));
    }

    static multiply_lottery_309() {
        var data: {} = {};
        data["id"] = 1;
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("309", JSON.stringify(data));
    }

    static single_lottery_307() {
        var data: {} = {};
        data["id"] = 1;
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("307", JSON.stringify(data));
    }

    static gashapon_info_306(full: boolean) {
        var data: {} = {};
        data["full"] = full;
        return this.newRequest("306", JSON.stringify(data));
    }

    static take_purchase_achievement_305(id: string) {
        var data: {} = {};
        data["id"] = id;
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("305", JSON.stringify(data)); 
    }

    static purchase_achievement_info_304(full: boolean) {
        var data: {} = {};
        data["full"] = full;
        return this.newRequest("304", JSON.stringify(data));
    }

    static perform_signin7_303(id: string) {
        var data: {} = {};
        data["id"] = id;
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("303", JSON.stringify(data));
    }

    static signin7_info_302(full: boolean): egret.URLRequest  {
        var data:{} = {};
        data["full"] = full;
        return this.newRequest("302", JSON.stringify(data));
    }

    static take_energy_reward_301(): egret.URLRequest  {
        var data: {} = {};
        data["id"] = 15;
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("301", JSON.stringify(data));
    }

    static rankListData_300(): egret.URLRequest  {
        return this.newRequest("300", "");
    }
    
    static cofferInfo_200(full: Boolean): egret.URLRequest {
        var data = {};
        data["full"] = full;
        return this.newRequest("200", JSON.stringify(data));
    }

    static collectCoin_201(): egret.URLRequest {
        return this.newRequest("201", JSON.stringify({}));
    }

    static taskeIncome_203(): egret.URLRequest {
        var data = {};
        data["id"] = Math.floor(Math.random() * 10);
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("203", JSON.stringify(data));
    }

    static take_company_reward_205(id: string): egret.URLRequest {
        var data = {};
        data["id"] = id; 
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("205", JSON.stringify(data));
    }

    static take_share_reward_175(type: string): egret.URLRequest {
        var data = {};
        data["type"] = type;
        return this.newRequest("175", JSON.stringify(data));
    }

    static take_guide_reward_174(): egret.URLRequest {
        return this.newRequest("174", "");
    }

    static update_clientmap_172(type: string, key: string, value: any): egret.URLRequest {
        var data = {};
        data["ope"] = type;
        data["key"] = key;
        data["value"] = value;
        return this.newRequest("172", JSON.stringify(data));
    }

    static take_daily_recharge_170(type: string): egret.URLRequest {
        var data = {};
        data["type"] = type;
        return this.newRequest("170", JSON.stringify(data));
    }

    static take_daily_gift_reward_169(id: string): egret.URLRequest  {
        var data = {};
        data["gift_id"] = parseInt(id);
        return this.newRequest("169", JSON.stringify(data));
    }

    static time_back_request_168(): egret.URLRequest {
        return this.newRequest("168", "");
    }

    static take_invite_reward_167(rank: number): egret.URLRequest {
        var data = {};
        data["rank"] = rank;
        return this.newRequest("167", JSON.stringify(data));
    }

    static post_inviter_sid_166(sid: string): egret.URLRequest {
        var data = {};
        data["inviter_sid"] = sid;
        data["figureurl"] = LoginData.playerFigureurl;
        return this.newRequest("166", JSON.stringify(data));
    }

    static take_invite_info_165(): egret.URLRequest {
        var data = {};
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("165", JSON.stringify(data));
    }

    static take_invite_share_reward_164(): egret.URLRequest {
        var data = {};
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("164", JSON.stringify(data));
    }

    static flash_sale_buying_161() {
        var data = {};
        data["id"] = CommonFunc.curTimeStamp();
        return this.newRequest("161", JSON.stringify(data));
    }

    static flash_sale_today_160() {
        return this.newRequest("160", JSON.stringify({}));
    }

    static take_monthly_card2_daily_reward_157() {
        var data = {};
        // data["id"] = 3; 
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("157", JSON.stringify(data));
    }

    static take_monthly_card1_daily_reward_153() {
        var data = {};
        data["id"] = 2; 
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("153", JSON.stringify(data));
    }

    static buy_monthly_card1_151() {
        var data = {};
        data["id"] = CommonFunc.curTimeStamp();
        return this.newRequest("151", JSON.stringify(data));
    }

    static verify_payment_results_121(order_id: string, product_id: string) {
        var data = {};
        data["order_id"] = order_id;
        data["product_id"] = product_id;
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("121", JSON.stringify(data));
    }

    static refresh_pay_info_116(product_id: string) {
        var data = {};
        data["product_id"] = product_id;
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("116", JSON.stringify(data));
    }

    static take_tujian_reward_115(id: string) {
        var data = {};
        data["id"] = id;
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("115", JSON.stringify(data));
    }

    static fetchTujianData_114() {
        var data = {};
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("114", JSON.stringify(data));
    }

    static take_free_30_reward_112() {
        var data = {};
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("112", JSON.stringify(data));
    }

    static take_free_6_reward_110() {
        var data = {};
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("110", JSON.stringify(data));
    }

    static take_invite_clothes_reward_108() {
        var data = {};
        data["extra"] = CommonFunc.curTimeStamp();
        return this.newRequest("108", JSON.stringify(data));
    }

    static take_timelimitDiscount_info_106(type: number) {
        var data = {};
        data["type"] = type;
        return this.newRequest("106", JSON.stringify(data));
    }

    static take_package_info_104() {
        return this.newRequest("104", "");
    }

    static exchange_coin_103() {
        var data: {} = {};
        data["id"] = CommonFunc.curTimeStamp();
        return this.newRequest("103", JSON.stringify(data));
    }

    static buy_energy_101() {
        var data: {} = {};
        data["id"] = CommonFunc.curTimeStamp();
        return this.newRequest("101", JSON.stringify(data));
    }

    static all_products_100() {
        return this.newRequest("100", "");
    }

    // Inner --------------------------------------------------
    static newRequest(cid: string, data:string): egret.URLRequest {
        // http://115.28.179.17:9765/account?sid=&cid=900&sign=7908da879675823edb2396e364248bad
        var url: string = null;
        if ("900" === cid) {
            url = ConstData.Conf.LoginAddr + "?sid=" + LoginData.sid + "&cid=" + cid + "&sign=" + this.generateSign(data);
        }
        else {
            url = LoginData.gameAddr + "?sid=" + LoginData.sid + "&cid=" + cid + "&sign=" + this.generateSign(data);
        }
        var rtn = new egret.URLRequest(url);
        rtn.method = egret.URLRequestMethod.POST;
        // var header: egret.URLRequestHeader = new egret.URLRequestHeader("Web-Scope", "mzplay");
        // rtn.requestHeaders.push(header);
        rtn.data = data;
        return rtn;
    }

    static generateSign(data: string): string {
        var origin = LoginData.sid + data + LoginData.skey;
        var rtn = MD5.hex_md5(origin);
        return rtn.toLowerCase();
    }
}