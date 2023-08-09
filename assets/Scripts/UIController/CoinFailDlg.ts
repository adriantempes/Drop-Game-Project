import GlobalData = require("../global/GlobalData");
import StartScreenManager from "../StartScreenManager";
import NextBoxInfo from "../level/NextBoxInfo";
import Common, {AudioEffectID} from "../Common";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CoinFailDlg extends cc.Component {

    @property(cc.Button)
    btnResume: cc.Button = null;

    @property(cc.Button)
    btnAds: cc.Button = null;

    @property(cc.Label)
    totalCoin: cc.Label = null;

    onLoad() {
        this.btnResume.node.on('click', this.onBtnResume, this);
        this.btnAds.node.on('click', this.onBtnAds, this);
        //cc.director.preloadScene("GamePlay");
        this.totalCoin.string = ": " + Common.getTotalCoin();
    }

    onEnable() {
    }

    onBtnResume() {
        Common.playAudioEffect(AudioEffectID.ClickBtn, false);
        Common.getDlgMgr().removeDlg(this.node);
        //StartScreenManager.instance.onShowScreenByName("Shop");
        //cc.director.loadScene("Shop");
    }

    onBtnAds() {
        //TODO show Ads
        NextBoxInfo.instance.onNextAds();
    }
}
