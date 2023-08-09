import GlobalData = require("../global/GlobalData");
import StartScreenManager from "../StartScreenManager";
import GameManager from "../GameManager";
import Common, {AudioEffectID} from "../Common";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PauseDlg extends cc.Component {

    @property(cc.Button)
    btnHome: cc.Button = null;

    @property(cc.Button)
    btnResume: cc.Button = null;

    @property(cc.Button)
    btnPlayAgain: cc.Button = null;

    @property([cc.SpriteFrame])
    m_AudioOnOffLst: cc.SpriteFrame[] = [];

    @property(cc.Sprite)
    btnSound: cc.Sprite = null;

    @property(cc.Button)
    btnSetting: cc.Button = null;


    onLoad() {
        this.btnHome.node.on('click', this.onBtnHome, this);
        this.btnResume.node.on('click', this.onBtnResume, this);
        this.btnPlayAgain.node.on('click', this.onBtnPlayAgain, this);
        //cc.director.preloadScene("GamePlay");

        this.btnSetting.node.on('click', this.onBtnSound, this);

        this.btnSound.spriteFrame = this.m_AudioOnOffLst[!Common.isMusicOn  ? 1 : 0];

    }

    onEnable() {
    }

    onBtnHome() {
        Common.playAudioEffect(AudioEffectID.ClickBtn, false);
        Common.getDlgMgr().removeDlg(this.node);
        StartScreenManager.instance.onShowScreenByName("Home");
        //cc.director.loadScene("StartScreen"); bb
    }

    onBtnResume() {
        Common.playAudioEffect(AudioEffectID.ClickBtn, false);
        Common.getDlgMgr().removeDlg(this.node);
        GameManager.instance.continueGamePlay();
        // let event = new cc.Event.EventCustom(Common.CUSTOM_EVENT.CONTINUE_GAME, true);
        // this.node.dispatchEvent(event);
    }

    onBtnPlayAgain() {
        Common.playAudioEffect(AudioEffectID.ClickBtn, false);
        Common.getDlgMgr().removeDlg(this.node);
        GameManager.instance.restartGamePlay();
        // let event = new cc.Event.EventCustom(Common.CUSTOM_EVENT.RESTART_GAME, true);
        // this.node.dispatchEvent(event);
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
}
