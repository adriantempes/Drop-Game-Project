import FBGlobal from "./FBGlobal";

const {ccclass, property} = cc._decorator;

import GameManager from "./GameManager";
import ShopInfo from "./shop/ShopInfo";
import Common, {AudioEffectID} from "./Common";
import LevelDlg from "./LevelDlg";

const DlgNameConfig = {
    "Play": 0,
    "TipsDlg": 1,
    "Share": 2,
    "Shop": 3,
    "Setting": 4,
};

const ScreenConfig = {
    "Level": 0,
    "Game": 1,
    "Shop": 2,
    "Rank": 3,
    "Home": 4,
};

@ccclass
export default class StartScreenManager extends cc.Component {
    @property(cc.Node)
    uiRoot: cc.Node = null;

    @property(cc.Prefab)
    dlgPrefabsList: cc.Prefab[] = [];

    @property(cc.Node)
    screenList: cc.Node[] = [];

    @property(cc.Button)
    btnPlay: cc.Button = null;

    @property(cc.Button)
    btnShare: cc.Button = null;

    @property(cc.Button)
    btnShop: cc.Button = null;

    @property(cc.Button)
    btnSetting: cc.Button = null;

    @property(cc.Button)
    btnTips: cc.Button = null;

    @property(cc.Label)
    lblTotalCoin: cc.Label = null;

    @property(cc.Label)
    lblStage: cc.Label = null;

    @property(cc.Button)
    btnRanking: cc.Button = null;

    @property([cc.SpriteFrame])
    m_AudioOnOffLst: cc.SpriteFrame[] = [];

    @property(cc.Sprite)
    btnSound: cc.Sprite = null;

    static _ins: StartScreenManager;

    static get instance(): StartScreenManager {
        return this._ins || new StartScreenManager;
    }

    start() {
        this.onUpdateCoin();
    }

    onUpdateCoin() {
        this.lblTotalCoin.string = ": " + Common.getTotalCoin();
        GameManager.instance.onUpdateCoin();
        ShopInfo.instance.updateCoinNum();
    }

    onLoad() {
        //cc.sys.localStorage.setItem("numberLevelUnlocked", 1);
        console.log("BINH load main");

        FBGlobal.instance.loadVideoAdsFirst();

        this.scheduleOnce(() => {
            FBGlobal.instance.loadBannnerAdsFirst();
        }, 0.5)



        StartScreenManager._ins = this;
        Common.playBGM();

        Common.loadPlayerData();

        let self = this;
        FBGlobal.instance.getFBScore(function (score, toolBagData) {
            console.log("hehe checking highscore" + score);
            if (toolBagData != null) {
                console.log(toolBagData)
                Common.toolBagData = toolBagData;
            } else {
                for (let i = 0; i < 4; i++) {
                    Common.toolBagData[i] = 5;
                }
            }

            if (score > Common.bestScore) {
                Common.bestScore = score;
                Common.overrideLocal();
                self.onGetLevelText();
                LevelDlg._ins.loadData();
            }
        });

        //cc.sys.localStorage.setItem('numberTotalCoin', 0);
        this.btnPlay.node.on('click', this.onBtnPlay, this);
        this.btnTips.node.on('click', this.onBtnTips, this);
        this.btnShop.node.on('click', this.onBtnShop, this);
        this.btnSetting.node.on('click', this.onBtnSound, this);
        this.btnShare.node.on('click', this.onBtnShare, this);
        this.btnRanking.node.on('click', this.onBtnRanking, this);
        this.onGetLevelText();
        // cc.director.preloadScene("Level");
        //  cc.director.preloadScene("Shop");

        this.btnSound.spriteFrame = this.m_AudioOnOffLst[!Common.isMusicOn ? 1 : 0];

        FBGlobal.instance.subcribeMessage();
    }

    onBtnShare() {
        var param = {
            type: null,
            arg: null,
            successCallback: this.shareSuccessCb.bind(this),
            failCallback: this.shareFailedCb.bind(this),
            shareName: '啊啊啊',
            isWait: false
        };
        FBGlobal.instance.shareGame(param, 'RankGame0');
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

    onGetLevelText() {
        this.lblStage.string = Common.getNumberLevelUnlocked() + " Stage";
    }

    onBtnTips() {
        Common.playAudioEffect(AudioEffectID.ClickBtn, false);
        let pos = cc.v2(0, 0)
        let prefab = this.dlgPrefabsList[DlgNameConfig["TipsDlg"]];
        Common.getDlgMgr().showDlg(prefab, this.uiRoot, pos);
    }

    onBtnPlay() {
        Common.playAudioEffect(AudioEffectID.ClickBtn, false);
        //let pos = cc.v2(0, 0)

        this.onShowScreenByName("Level");
        //Common.getDlgMgr().showDlg(prefab, this.uiRoot, pos);
        //cc.director.loadScene("Level");
    }

    onShowScreenByName(name) {
        //let pos = cc.v2(0, 0)
        // let nodeHome = this.screenList[ScreenConfig["Home"]];
        // let nodeLevel = this.screenList[ScreenConfig["Level"]];
        // let nodeShop = this.screenList[ScreenConfig["Shop"]];
        // let nodeGame = this.screenList[ScreenConfig["Game"]];

        for (let i = 0; i < Object.keys(ScreenConfig).length; i++) {
            let currentNode = this.screenList[i];
            currentNode.active = i == ScreenConfig[name];
        }

        if (name == "Game") {
            GameManager.instance.restartGamePlay();
        }

        if (name == "Home") {
            GameManager.instance.restartGamePlay();
        }

        // if (name == "Level") {
        //     nodeHome.active = false;
        //     nodeShop.active = false;
        //     nodeLevel.active = true;
        // } else if (name == "Game") {
        //     nodeHome.active = false;
        //     nodeShop.active = false;
        //     nodeLevel.active = false;
        // } else if (name == "Shop") {
        //     nodeHome.active = false;
        //     nodeGame.active = false;
        //     nodeShop.active = true;
        // } else if (name == "Home") {
        //     nodeHome.active = true;
        // }
    }

    onBtnShop() {
        Common.playAudioEffect(AudioEffectID.ClickBtn, false);
        this.onShowScreenByName("Shop");
        //cc.director.loadScene("Shop");
    }

    onBtnRanking() {
        Common.playAudioEffect(AudioEffectID.ClickBtn, false);
        this.onShowScreenByName("Rank");
        //cc.director.loadScene("Rank");
    }

    onBtnSound() {
        Common.isMusicOn = !Common.isMusicOn;
        this.btnSound.spriteFrame = this.m_AudioOnOffLst[!Common.isMusicOn ? 1 : 0];

        if (Common.isMusicOn) {
            Common.playBGM()
        } else {
            Common.stopBGM();
        }
    }

    shareSuccessCb(type, arg) {
        console.log(type, arg);
    }

    shareFailedCb(type, arg) {
        console.log(type, arg);
    }
}
