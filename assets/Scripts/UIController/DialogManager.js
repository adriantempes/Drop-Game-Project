var Common = require("Common");

cc.Class({
    extends: cc.Component,

    properties: {
        antiContactLayerPrefab: {
            default: null,
            type: cc.Prefab,
        },

        // commonConfirmDlgPrefab:{
        //     default: null,
        //     type: cc.Prefab,
        // },
        //
        // tipsPrefab:{
        //     default: null,
        //     type: cc.Prefab,
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.dlgList = new Array();
        this.antiContactLayer = null;
    },

    start() {
    },


    /**
     * 展示对话框
     * @param {*对话框预设} prefab
     * @param {*父节点} parent
     * @param {*坐标} pos
     */
    showDlg(prefab, parent, pos = cc.v2(0, 0)) {

        if (this.dlgList.length == 0) {
            this.setAntiContactLayerActive(true);
            Common.isPauseGame = true;
        }
        let dlg = cc.instantiate(prefab);
        parent.addChild(dlg);
        dlg.setPosition(pos);
        dlg.setScale(0.5);
        dlg.runAction(cc.scaleTo(0.3, 1, 1));

        this.dlgList.push(dlg);

        return dlg;
    },

    // /**
    //  * 展示通用确认窗口
    //  * @param {*标题} title
    //  * @param {*确认回调} confirmCallback
    //  * @param {*取消回调} cancelCallback
    //  */
    // showCommonConfirmDlg(title, confirmText, confirmCallback, cancelText, cancelCallback, parent){
    //     if (this.dlgList.length == 0)  {
    //
    //         this.setAntiContactLayerActive(true);
    //
    //         Common.isPauseGame = true;
    //
    //     }
    //
    //     let dlg = this.showDlg(this.commonConfirmDlgPrefab, parent);
    //
    //     dlg.getComponent("CommonConfirmDlg").initDlg(title, confirmText, confirmCallback, cancelText, cancelCallback);
    //
    // },


    /**
     * 关闭特定窗口
     * @param {*窗口} dlg
     */
    removeDlg(dlg) {
        let idx = this.dlgList.indexOf(dlg);
        if (idx > -1) {
            this.dlgList.splice(idx, 1);
        }

        dlg.destroy();

        if (this.dlgList.length == 0) {
            this.setAntiContactLayerActive(false);

            Common.isPauseGame = false;
        }
    },


    /**
     * 关闭最上层窗口
     */
    popDlg() {
        let idx = this.dlgList.length - 1;

        let dlg = this.dlgList[idx];

        if (dlg != null) {
            dlg.destroy();
        }

        this.dlgList.splice(idx, 1);

        if (this.dlgList.length == 0) {

            this.setAntiContactLayerActive(false);

            Common.isPauseGame = false;
        }
    },

    /**
     * 关闭所有窗口，一般在切换场景时调用
     */
    removeAllDlgs() {
        for (let i = 0; i < this.dlgList.length; i++) {
            let dlg = this.dlgList[i];

            if (dlg != null) {
                dlg.destroy();
            }
        }

        if (this.antiContactLayer != null) {
            this.antiContactLayer.removeFromParent();
            this.antiContactLayer.destroy();
            this.antiContactLayer = null;
        }

        Common.isPauseGame = false;
    },


    // update (dt) {},

    /**
     * 设置防触层活性
     * @param {}} isVisible
     */
    setAntiContactLayerActive(isActive) {

        if (isActive) {
            if (this.antiContactLayer == null) {

                let uiRoot = cc.find("Canvas/UIRoot");
                this.antiContactLayer = cc.instantiate(this.antiContactLayerPrefab);
                uiRoot.addChild(this.antiContactLayer);
            }

            this.antiContactLayer.active = true;
        } else {
            if (this.antiContactLayer != null) {
                this.antiContactLayer.active = false;
            }
        }
    },


    // /**
    //  * 展示提示
    //  * @param {*提示文本} text
    //  */
    // showTips(text, parent){
    //     let tips = cc.instantiate(this.tipsPrefab);
    //     tips.getComponent(cc.Label).string = text;
    //     let callback = cc.callFunc(function(){
    //         tips.destroy();
    //     }, this);
    //
    //     parent.addChild(tips);
    //     tips.setPosition(0, 0);
    //     tips.opacity = 0;
    //     tips.runAction(cc.sequence(cc.fadeIn(0.2), cc.delayTime(0.3), cc.fadeOut(0.3), callback));
    // },


});
