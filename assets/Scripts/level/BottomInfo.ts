import GameManager from "../GameManager";
import Common, {AudioEffectID, CUSTOM_EVENT, GameState, ToolType} from "../Common";

const {ccclass, property} = cc._decorator;


@ccclass
export default class BottomInfo extends cc.Component {

    @property(cc.Button)
    btnX2: cc.Button = null;

    @property(cc.Button)
    btnRow: cc.Button = null;

    @property(cc.Button)
    btnColumn: cc.Button = null;


    static _ins: BottomInfo;


    static get instance(): BottomInfo {
        return this._ins || new BottomInfo;
    }


    onLoad() {
        BottomInfo._ins = this;
        this.btnX2.node.on('click', this.onBtnX2, this);
        this.btnRow.node.on('click', this.onBtnRow, this);
        this.btnColumn.node.on('click', this.onBtnColumn, this);
    }

    lasttime = 0;

    setLastTime() {
        var d = new Date();
        var n = d.getTime();
        this.lasttime = n;
    }

    checkInterval() {
        var d = new Date();
        var n = d.getTime();
        return (n - this.lasttime) > 1000;
    }

    onBtnX2() {
        if (!this.checkInterval()) {
            return;
        }
        Common.playAudioEffect(AudioEffectID.ClickBtn, false);
        let toolCount = Common.toolBagData[ToolType.Tool_X2];
        if (toolCount >= 1) {
            Common.setToolBagData(ToolType.Tool_X2, toolCount - 1);

            let btnComp = this.btnX2.node.getComponent("ToolBtn");
            if (btnComp != null) {
                btnComp.numToolBag.string = toolCount - 1;
            }

            //道具效果
            let event = new cc.Event.EventCustom(CUSTOM_EVENT.TOOL_X2, true);
            this.node.dispatchEvent(event);
        }
    }

    onBtnRow() {
        if (!this.checkInterval()) {
            return;
        }
        if (Common.gameState == GameState.Drop) {
            return;
        }
        Common.playAudioEffect(AudioEffectID.ClickBtn, false);
        let toolCount = Common.toolBagData[ToolType.Tool_Row];
        if (toolCount >= 1) {
            Common.setToolBagData(ToolType.Tool_Row, toolCount - 1);

            let btnComp = this.btnRow.node.getComponent("ToolBtn");
            if (btnComp != null) {
                btnComp.numToolBag.string = toolCount - 1;
            }

            //道具效果
            let event = new cc.Event.EventCustom(CUSTOM_EVENT.TOOL_ROW, true);
            this.node.dispatchEvent(event);
        }
    }

    onBtnColumn() {
        if (!this.checkInterval()) {
            return;
        }
        if (Common.gameState == GameState.Drop) {
            return;
        }
        Common.playAudioEffect(AudioEffectID.ClickBtn, false);
        let toolCount = Common.toolBagData[ToolType.Tool_Column];
        if (toolCount >= 1) {
            Common.setToolBagData(ToolType.Tool_Column, toolCount - 1);

            let btnComp = this.btnColumn.node.getComponent("ToolBtn");
            if (btnComp != null) {
                btnComp.numToolBag.string = toolCount - 1;
            }

            //道具效果
            let event = new cc.Event.EventCustom(CUSTOM_EVENT.TOOL_COLUMN, true);
            this.node.dispatchEvent(event);
        }
    }

    onUpdateInfo() {
        this.btnX2.getComponent("ToolBtn").reload();
        this.btnRow.getComponent("ToolBtn").reload();
        this.btnColumn.getComponent("ToolBtn").reload();
        console.log("hehe")
    }
}
