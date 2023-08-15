import GlobalData = require("../global/GlobalData");
import StartScreenManager from "../StartScreenManager";
import GameManager from "../GameManager";
import FBGlobal from "../FBGlobal";
import Common, {AudioEffectID} from "../Common";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameOverDlg extends cc.Component {

    @property(cc.Button)
    btnHome: cc.Button = null;

    @property(cc.Button)
    btnRevive100: cc.Button = null;

    @property(cc.Button)
    btnReviveAds: cc.Button = null;

    @property(cc.Button)
    btnEnd: cc.Button = null;

    @property(cc.Button)
    btnInviteFriend: cc.Button = null;

    @property(cc.Label)
    lblLevel: cc.Label = null;

    @property(cc.Label)
    lblCoinBonus: cc.Label = null;

    @property(cc.Node)
    starNode: cc.Node = null;

    @property(cc.Prefab)
    starPrefabs: cc.Prefab = null;


    @property(cc.Label)
    lblTotalCoin: cc.Label = null;

    start() {
        this.onUpdateCoin();
    }

    onUpdateCoin() {
        this.lblTotalCoin.string = ": " + Common.getTotalCoin();
    }

    onLoad() {
        this.btnHome.node.on('click', this.onBtnHome, this);
        this.btnRevive100.node.on('click', this.onBtnRevive, this);
        this.btnReviveAds.node.on('click', this.onBtnReviveAds, this);
        this.btnEnd.node.on('click', this.onBtnPlayAgain, this);
        this.btnInviteFriend.node.on('click', this.onInviteFriend, this);
        // @ts-ignore
        this.lblLevel.string = "Stage " + GlobalData.currentLevel;
        //cc.director.preloadScene("GamePlay");
        // @ts-ignore
        this.lblCoinBonus.string = GlobalData.bonusCoin;

        let totalCoin = Common.getTotalCoin();
        if (totalCoin < 100) {
            this.btnRevive100.node.active = false;
            this.btnReviveAds.getComponent(cc.Widget).isAlignHorizontalCenter = true;
        } else {
            this.btnRevive100.node.active = true;
            this.btnReviveAds.getComponent(cc.Widget).isAlignHorizontalCenter = false;
        }

        // var starNode = cc.instantiate(this.starPrefabs);
        // this.starNode.addChild(starNode);
        // starNode.setPosition(cc.v2(this.node.x, this.node.y));
        StartScreenManager.instance.onUpdateCoin();
    }

    onEnable() {
    }

    onInviteFriend() {
        Common.playAudioEffect(AudioEffectID.ClickBtn, false);
        var param = {
            type: null,
            arg: null,
            successCallback: this.shareSuccessCb.bind(this),
            failCallback: this.shareFailedCb.bind(this),
            shareName: '啊啊啊',
            isWait: false
        };
        FBGlobal.instance.inviteAsync(param, 'RankGame0');
    }

    shareSuccessCb(type, arg) {
        console.log(type, arg);
    }
    shareFailedCb(type, arg) {
        console.log(type, arg);
    }

    onBtnHome() {
        Common.playAudioEffect(AudioEffectID.ClickBtn, false);
        Common.getDlgMgr().removeDlg(this.node);
        StartScreenManager.instance.onShowScreenByName("Home");
        //cc.director.loadScene("StartScreen");
    }

    onBtnPlayAgain() {
        Common.playAudioEffect(AudioEffectID.ClickBtn, false);
        Common.getDlgMgr().removeDlg(this.node);
        GameManager.instance.restartGamePlay();
        // let event = new cc.Event.EventCustom(Common.CUSTOM_EVENT.RESTART_GAME, true);
        // this.node.dispatchEvent(event);
    }


    onBtnRevive() {
        Common.playAudioEffect(AudioEffectID.ClickBtn, false);
        Common.getDlgMgr().removeDlg(this.node);
        GameManager.instance.reviveGamePlay();
        Common.addMoreCoin(-100);
        StartScreenManager.instance.onUpdateCoin();
        //StartScreenManager.instance.onUpdateCoin();
    }

    onBtnReviveAds() {
        let self = this;
        // //Show ads receive item
        // Common.playAudioEffect(AudioEffectID.ClickBtn, false);

        // let AVSuccessCb = function (arg) {
            Common.getDlgMgr().removeDlg(this.node);
            GameManager.instance.reviveGamePlay();
        // };
        // let AVFailedCb = function (arg) {
        //     console.log("Show ads fail nhe");
        // };
        // // Here `this` is referring to the component
        // FBGlobal.instance.showAds(AVSuccessCb.bind(this), AVFailedCb.bind(this), null);
        // // let event = new cc.Event.EventCustom(Common.CUSTOM_EVENT.RESTART_GAME, true);
        // // this.node.dispatchEvent(event);
    }
}
