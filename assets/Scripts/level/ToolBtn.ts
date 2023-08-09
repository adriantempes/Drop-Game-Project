import Common from "../Common";

const {ccclass, property} = cc._decorator;


@ccclass
export default class ToolBtn extends cc.Component {

    @property(cc.Label)
    numToolBag: cc.Label = null;

    @property({
        type: cc.Integer
    })
    toolType: Number = 0;


    onLoad() {
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.initButton(this.toolType)
    }

    /**
     * 初始化按钮
     * @param {*道具类型} toolType
     */
    initButton(toolType) {
        this.numToolBag.string = Common.toolBagData[toolType] + "";
    }

    reload(){
        this.initButton(this.toolType);
    }
}
