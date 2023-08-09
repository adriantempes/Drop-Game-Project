import StartScreenManager from "./StartScreenManager";

const {ccclass, property} = cc._decorator;

import LevelDlg from "./LevelDlg";
import {Shake} from "./animation/Shake";
import BottomInfo from "./level/BottomInfo";
import Common from "./Common";

const DlgNameConfig = {
    "GameOverDlg": 0,
    "PauseDlg": 1,
    "GamePassDlg": 2,
    "TipsDlg": 3,
    "CoinFailDlg": 4,
};


@ccclass
export default class UIManager extends cc.Component {

    @property(cc.Node)
    uiRoot: cc.Node = null;

    @property(cc.Node)
    playBoardArea: cc.Node = null;

    lastColumnActive: number = 0;

    tempPrefab: cc.Node = null;

    @property(cc.Layout)
    listGridHighlight: cc.Layout = null;

    @property(cc.Prefab)
    dropAnim: cc.Prefab = null;

    @property(cc.Prefab)
    dlgPrefabsList: cc.Prefab[] = [];

    @property(cc.Node)
    bonusLayout: cc.Node = null;

    @property(cc.Prefab)
    removeRowPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    removeColumnPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    x2EffectPrefab: cc.Prefab = null;

    @property(cc.Label)
    lblTotalCoin: cc.Label = null;

    onUpdateCoin() {
        this.lblTotalCoin.string = ": " + Common.getTotalCoin();
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    // start () {

    // }

    activeColumn(column, pos) {
        // this.listGridHighlight.node.children[this.lastColumnActive].opacity = 0;
        // this.listGridHighlight.node.children[column - 1].opacity = 255;
        // var action = cc.blink(0.1, 1);
        // this.listGridHighlight.node.runAction(action);
        // this.listGridHighlight.node.children[column - 1].opacity = 0;
        // this.lastColumnActive = column - 1;

        let posNew = this.listGridHighlight.node.children[column - 1].position;
        let pos2 = cc.v3(posNew.x, posNew.y + 90);
        if (this.tempPrefab == null) {
            this.tempPrefab = cc.instantiate(this.dropAnim);
        }
        let dropAim = this.tempPrefab;
        dropAim.position = pos2;
        dropAim.zIndex = 2000;
        dropAim.parent = this.uiRoot;

        let anim = dropAim.getComponent(cc.Animation);
        anim.play("DropAnim");
        // setTimeout(function () {
        //     dropAim.destroy()
        // }, 5e3)
    }

    showDlg(name, pos = cc.v2(0, 0)) {
        let prefab = this.dlgPrefabsList[DlgNameConfig[name]];
        Common.getDlgMgr().showDlg(prefab, this.uiRoot, pos);
    }

    showBlockUnlock(node, objectManager, position) {
        let block = objectManager.createBlockAnim(position);
        node.addChild(block.getComponent("BlockedComponent").node);
        let currentNode = node;
        cc.tween(block.getComponent("BlockedComponent").node)
            .by(0.3, {position: cc.v2(-50, 20), rotation: 360})
            .by(0.4, {position: cc.v2(-50, -150), rotation: 360})
            .to(0.1, {opacity: 0})
            .call(() => {
                block.getComponent("BlockedComponent").node.opacity = 255;
                block.getComponent("BlockedComponent").removeBlock();
                currentNode.removeChild(block.getComponent("BlockedComponent").node)
            })
            .start()
        //
    }

    showUIBonus(isShow) {
        this.bonusLayout.active = isShow;
    }

    showRemoveEffect(type, pos?) {
        if (type == 1) {
            var removeNode = cc.instantiate(this.removeColumnPrefab);
            this.playBoardArea.addChild(removeNode);
            removeNode.setPosition(pos.x, this.playBoardArea.height / 2);
        } else if (type == 2) {
            var removeNode = cc.instantiate(this.removeRowPrefab);
            this.playBoardArea.addChild(removeNode);
            removeNode.setPosition(this.playBoardArea.width / 2, pos.y);
        } else if (type == 3) {
            var effectX2 = cc.instantiate(this.x2EffectPrefab);
            this.playBoardArea.addChild(effectX2);
            effectX2.setPosition(cc.v2(pos.x, pos.y));
        }
    }

    updateLevelForHome() {
        StartScreenManager.instance.onGetLevelText();
        LevelDlg.instance.reloadLevelMax();
    }

    shakeScreen(level) {
        let duration, x, y;
        // Call (duration duration: 3 seconds, amplitude in x direction: 15 pixels, amplitude in y direction: 15 pixels):
        let oldPos = cc.v2(this.playBoardArea.position.x, this.playBoardArea.position.y);
        let shake: Shake = Shake.create(0.5, level, level);
        shake.startWithTarget(this.playBoardArea);
        this.playBoardArea.runAction(shake);
        //shake.stop();
        this.scheduleOnce(function () {
            this.playBoardArea.position = oldPos;
        }, 0.6);
        //this.playBoardArea.stopAction(shake);
    }
}
