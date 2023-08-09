import Common, {AudioEffectID} from "../Common";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TipsDlg extends cc.Component {

    @property(cc.Button)
    btnHome: cc.Button = null;

    onLoad() {
        this.btnHome.node.on('click', this.onBtnHome, this);
        //cc.director.preloadScene("GamePlay");
    }

    onEnable() {
    }

    onBtnHome() {
        Common.playAudioEffect(AudioEffectID.ClickBtn, false);
        Common.getDlgMgr().removeDlg(this.node);
    }
}
