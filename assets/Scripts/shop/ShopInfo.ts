import UIManager from "../UIManager";

const {ccclass, property} = cc._decorator;
import GlobalData = require("../global/GlobalData");
import date = require('date-and-time');
import StartScreenManager from "../StartScreenManager";
import GameManager from "../GameManager";
import FBGlobal from "../FBGlobal";
import Common, {AudioEffectID, SHOP_EVENT, ToolType} from "../Common";

const DlgNameConfig = {
    "CoinFailDlg": 0,
};


@ccclass
export default class ShopInfo extends cc.Component {

    @property(cc.Button)
    btnDailyAds: cc.Button = null;

    @property(cc.Button)
    btnRowCoin: cc.Button = null;

    @property(cc.Button)
    btnColumnCoin: cc.Button = null;

    @property(cc.Button)
    btnX2Coin: cc.Button = null;

    @property(cc.Button)
    btnRowAds: cc.Button = null;

    @property(cc.Button)
    btnColumnAds: cc.Button = null;

    @property(cc.Button)
    btnX2Ads: cc.Button = null;

    @property(cc.Button)
    btnPlay: cc.Button = null;

    @property(cc.Button)
    btnClose: cc.Button = null;

    @property(cc.Label)
    lblTotalCoin: cc.Label = null;

    @property(cc.Label)
    lblTodayReceive: cc.Label = null;

    @property(cc.Node)
    uiRoot: cc.Node = null;

    @property(cc.Prefab)
    dlgPrefabsList: cc.Prefab[] = [];


    static _ins: ShopInfo;


    static get instance(): ShopInfo {
        return this._ins || new ShopInfo;
    }

    totalCoin: number;

    onLoad() {
        ShopInfo._ins = this;

        console.log("BINH Load shop");

        let _this = this;

        //Common.setDailyDate("");
        //FBGlobal.instance.loadVideoAdsFirst();

        //Check is receive
        let date1 = this.getTimeToday();
        let date2 = new Date(Common.getDateDaily());

        this.btnDailyAds.node.active = !date.isSameDay(date1, date2);
        this.lblTodayReceive.node.active = date.isSameDay(date1, date2);

        this.btnRowCoin.node.on('click', function () {
            _this.buyBonusItem(ToolType.Tool_Row, true);
        }, this);

        this.btnColumnCoin.node.on('click', function () {
            _this.buyBonusItem(ToolType.Tool_Column, true);
        }, this);

        this.btnX2Coin.node.on('click', function () {
            _this.buyBonusItem(ToolType.Tool_X2, true);
        }, this);

        this.btnRowAds.node.on('click', function () {
            _this.buyBonusItem(ToolType.Tool_Row);
        }, this);

        this.btnColumnAds.node.on('click', function () {
            _this.buyBonusItem(ToolType.Tool_Column);
        }, this);

        this.btnX2Ads.node.on('click', function () {
            _this.buyBonusItem(ToolType.Tool_X2);
        }, this);

        this.btnClose.node.on('click', function () {
            Common.playAudioEffect(AudioEffectID.ClickBtn, false);
            //cc.director.loadScene("StartScreen");
            StartScreenManager.instance.onShowScreenByName("Home");
        }, this);

        this.btnPlay.node.on('click', function () {
            Common.playAudioEffect(AudioEffectID.ClickBtn, false);
            //cc.director.loadScene("StartScreen");
            StartScreenManager.instance.onShowScreenByName("Level");
        }, this);

        console.log(this.getTimeToday());
    }

    start() {
        let _this = this;
        this.btnDailyAds.node.on('click', function () {
            Common.playAudioEffect(AudioEffectID.ClickBtn, false);
            // let AVSuccessCb = function (arg) {
            //     console.log("Show ads daily oke nhe");
            //     //Show ads callback add coin
                Common.addMoreCoin(1000);
                let date = _this.getTimeToday();

                Common.setDailyDate(date);

                let event = new cc.Event.EventCustom(SHOP_EVENT.UPDATE_COIN, true);
                _this.node.dispatchEvent(event);
            // };
            // let AVFailedCb = function (arg) {
            //     console.log("Show ads fail nhe");
            // };
            // FBGlobal.instance.showAds(AVSuccessCb.bind(_this), AVFailedCb.bind(_this), null);
        }, this);
        this.updateCoin();
    }

    buyBonusItem(toolType, isCoin?) {
        Common.playAudioEffect(AudioEffectID.ClickBtn, false);
        if (isCoin) {
            if (this.totalCoin < 100) {
                this.onCoinFail();
            } else {
                let toolCount = Common.toolBagData[toolType];
                if (toolCount >= 0) {
                    Common.setToolBagData(toolType, toolCount + 1);
                    //道具效果
                    Common.addMoreCoin(-100);
                    let event = new cc.Event.EventCustom(SHOP_EVENT.UPDATE_COIN, true);
                    this.node.dispatchEvent(event);

                }
            }
        } else {
            let self = this;
            //Show ads receive item
            // let AVSuccessCb = function (arg) {
            //     console.log("Show ads oke nhe");
                let toolCount = Common.toolBagData[toolType];
                Common.setToolBagData(toolType, toolCount + 1);
                let event = new cc.Event.EventCustom(SHOP_EVENT.UPDATE_COIN, true);
                self.node.dispatchEvent(event);
            // };
            // let AVFailedCb = function (arg) {
            //     console.log("Show ads fail nhe");
            // };
            // // Here `this` is referring to the component
            // FBGlobal.instance.showAds(AVSuccessCb.bind(this), AVFailedCb.bind(this), null);
        }
    }

    onEnable() {
        this.node.on(SHOP_EVENT.UPDATE_COIN, this.updateCoinDaily, this);
        this.node.on(SHOP_EVENT.UPDATE_COIN, this.updateCoin, this);
    }

    onDisable() {
        this.node.off(SHOP_EVENT.UPDATE_COIN, this.updateCoinDaily, this);
        this.node.off(SHOP_EVENT.UPDATE_COIN, this.updateCoin, this);
    }

    onCoinFail() {
        let pos = cc.v2(0, 0)
        let prefab = this.dlgPrefabsList[DlgNameConfig["CoinFailDlg"]];
        Common.getDlgMgr().showDlg(prefab, this.uiRoot, pos);
    }

    updateCoinDaily() {
        //Check is receive
        let date1 = this.getTimeToday();
        let date2 = new Date(Common.getDateDaily());
        if (date.isSameDay(date1, date2)) {
            this.btnDailyAds.node.active = false;
        }
        this.lblTodayReceive.node.active = date.isSameDay(date1, date2);
        this.updateCoin();
    }

    updateCoinNum() {
        this.totalCoin = Common.getTotalCoin();
        this.lblTotalCoin.string = ": " + this.totalCoin;
        let isActive = this.totalCoin >= 100;
        this.btnColumnCoin.node.active = isActive;
        this.btnRowCoin.node.active = isActive;
        this.btnX2Coin.node.active = isActive;
    }

    updateCoin() {
        

        this.totalCoin = Common.getTotalCoin();
        this.lblTotalCoin.string = ": " + this.totalCoin;
        let isActive = this.totalCoin >= 100;
        this.btnColumnCoin.node.active = isActive;
        this.btnRowCoin.node.active = isActive;
        this.btnX2Coin.node.active = isActive;
        GameManager.instance.onUpdateBonusItem();
    }

    getTimeToday() {
        const now = new Date();
        return now;
    }
}
