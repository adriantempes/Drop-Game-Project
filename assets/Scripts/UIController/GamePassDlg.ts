import GlobalData = require("../global/GlobalData");
import GameManager from "../GameManager";
import StartScreenManager from "../StartScreenManager";
import FBGlobal from "../FBGlobal";
import Common, {AudioEffectID} from "../Common";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GamePassDlg extends cc.Component {

    @property(cc.Button)
    btnHome: cc.Button = null;

    @property(cc.Button)
    btnx2Coin: cc.Button = null;

    @property(cc.Button)
    btnInviteFriend: cc.Button = null;

    @property(cc.Button)
    btnReplay: cc.Button = null;

    @property(cc.Button)
    btnNextLevel: cc.Button = null;

    @property(cc.Label)
    lblLevel: cc.Label = null;

    @property(cc.Label)
    lblCoinBonus: cc.Label = null;

    @property(cc.Node)
    nodeSun: cc.Node = null;

    @property(cc.Node)
    nodeBanner: cc.Node = null;

    @property(cc.Prefab)
    starSuccess: cc.Prefab = null;
    maxLevel: number;
    animCoin: cc.Animation;

    @property(cc.Label)
    lblTotalCoin: cc.Label = null;

    start() {
        this.onUpdateCoin();
    }

    onUpdateCoin() {
        this.lblTotalCoin.string = ": " + Common.getTotalCoin();
    }

    onLoad() {
        this.isShowAds = false;
        this.btnHome.node.on('click', this.onBtnHome, this);
        this.btnx2Coin.node.on('click', this.onX2Coin, this);
        this.btnReplay.node.on('click', this.onBtnPlayAgain, this);
        this.btnNextLevel.node.on('click', this.onBtnNextLevel, this);
        this.btnInviteFriend.node.on('click', this.onInviteFriend, this);
        // @ts-ignore
        this.lblLevel.string = "Stage " + GlobalData.currentLevel;
        // @ts-ignore
        this.lblCoinBonus.string = GlobalData.bonusCoin;
        // @ts-ignore
        this.maxLevel = Object.keys(GlobalData.LevelGame).length;
        this.animCoin = this.lblCoinBonus.getComponent(cc.Animation);
        //cc.director.preloadScene("GamePlay");

        // var starNode = cc.instantiate(this.starPrefabs);
        // this.nodeSun.addChild(starNode);
        // starNode.setPosition(cc.v2(this.node.x, this.node.y));

        // var starSuccess = cc.instantiate(this.starSuccess);
        // this.nodeBanner.addChild(starSuccess);
        // starSuccess.setPosition(cc.v2(this.node.x, this.node.y));
    }

    onEnable() {
    }


    onBtnHome() {
        Common.playAudioEffect(AudioEffectID.ClickBtn, false);
        Common.getDlgMgr().removeDlg(this.node);
        StartScreenManager.instance.onShowScreenByName("Home");
        //cc.director.loadScene("StartScreen");
    }

    x2Coin() {
        // @ts-ignore
        Common.addMoreCoin(GlobalData.bonusCoin);
        // @ts-ignore
        this.lblCoinBonus.string = (GlobalData.bonusCoin * 2).toString();
        this.onUpdateCoin();
        StartScreenManager.instance.onUpdateCoin();
    }

    onX2Coin() {
        var self = this;
        //TODO x2 coin save
        Common.playAudioEffect(AudioEffectID.ClickBtn, false);

        let AVSuccessCb = function (arg) {
            self.x2Coin();
            //add anim coin
            self.animCoin.play('X2Coin');
            //grey btn
            self.btnx2Coin.node.color = new cc.Color(95, 95, 95, 255);
            self.btnx2Coin.getComponent(cc.Button).enabled = false;
        };
        let AVFailedCb = function (arg) {
            console.log("Show ads fail nhe");
        };
        // Here `this` is referring to the component
        FBGlobal.instance.showAds(AVSuccessCb.bind(this), AVFailedCb.bind(this), null);
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

    onBtnPlayAgain() {
        Common.playAudioEffect(AudioEffectID.ClickBtn, false);
        Common.getDlgMgr().removeDlg(this.node);
        GameManager.instance.restartGamePlay();
        // let event = new cc.Event.EventCustom(Common.CUSTOM_EVENT.RESTART_GAME, true);
        // this.node.dispatchEvent(event);
    }

    isShowAds: boolean = false;

    onBtnNextLevel() {
        // @ts-ignore
        if (GlobalData.currentLevel == this.maxLevel) {
            console.log('its already max level');
            return;
        }
        // @ts-ignore
        if (GlobalData.currentLevel % 4 == 0 && !this.isShowAds) {
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
            this.isShowAds = true;
            return;
        }
        // @ts-ignore
        GlobalData.currentLevel += 1;

        // @ts-ignore
        console.log("BUG: current level when hit next tang 1 thanh" + GlobalData.currentLevel);

        Common.getDlgMgr().removeDlg(this.node);
        Common.playAudioEffect(AudioEffectID.ClickBtn, false);
        GameManager.instance.restartGamePlay();
        this.isShowAds = false;
        // let event = new cc.Event.EventCustom(Common.CUSTOM_EVENT.RESTART_GAME, true);
        // this.node.dispatchEvent(event);
    }
}
