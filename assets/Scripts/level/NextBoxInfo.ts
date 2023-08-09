import Common from "../Common";
import UIManager from "../UIManager";
import FBGlobal from "../FBGlobal";
import GameManager from "../GameManager";
import StartScreenManager from "../StartScreenManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NextBoxInfo extends cc.Component {

    @property(cc.Node)
    nextCube: cc.Node = null;

    @property(cc.Button)
    btnNext100Coin: cc.Button = null;

    @property(cc.Button)
    btnNextAds: cc.Button = null;

    uiMgr: UIManager = null;

    static _ins: NextBoxInfo;

    static get instance(): NextBoxInfo {
        return this._ins || new NextBoxInfo;
    }

    onReuseUI(uiMgr: UIManager) {
        this.uiMgr = uiMgr;
    }

    onLoad() {
        this.btnNext100Coin.node.on('click', this.onNext100CoinClick, this);
        this.setLock();
    }

    onEnable() {
        this.btnNextAds.node.on('click', this.onNextAds, this);
    }

    onNext100CoinClick() {
        let totalCoin = Common.getTotalCoin();
        if (totalCoin < 100) {
            this.uiMgr.showDlg("CoinFailDlg", cc.v2(0, 0));
        } else {
            this.setUnLock();
            Common.addMoreCoin(-100);
            StartScreenManager.instance.onUpdateCoin();
            //GameManager.instance.uiMgr.onUpdateCoin();
        }
    }

    onNextAds() {
        let self = this;
        //Show ads receive item
        let AVSuccessCb = function (arg) {
            self.setUnLock();
        };
        let AVFailedCb = function (arg) {
            console.log("Show ads fail nhe");
        };
        FBGlobal.instance.showAds(AVSuccessCb.bind(this), AVFailedCb.bind(this), null);
    }

    // onLoad () {}
    setNextNum(num) {
        this.nextCube.getComponent("UICube").setNum(num);
    }

    setLock() {
        this.nextCube.getComponent("UICube").setLock();
    }

    setUnLock() {
        this.btnNext100Coin.node.color = new cc.Color(95, 95, 95, 255);
        this.btnNext100Coin.getComponent(cc.Button).enabled = false;
        this.nextCube.getComponent("UICube").setUnLock();
    }
}
