import UIManager from "../UIManager";

const {ccclass, property} = cc._decorator;
import GlobalData = require("../global/GlobalData");
import GameManager from "../GameManager";
import Common, {ToolType} from "../Common";


@ccclass
export default class BonusItemInfo extends cc.Component {

    @property(cc.Sprite)
    targetImage: cc.Sprite = null;

    @property(cc.Label)
    bonusTitle: cc.Label = null;

    @property(cc.Label)
    description: cc.Label = null;

    @property(cc.Button)
    btnCancel: cc.Button = null;

    currentLevel: any;

    uiMgr: UIManager = null;

    static _ins: BonusItemInfo;

    static get instance(): BonusItemInfo {
        return this._ins || new BonusItemInfo;
    }

    onLoad() {
        BonusItemInfo._ins = this;
        this.btnCancel.node.on('click', this.onCancelDialog, this);
    }

    onCancelDialog() {
        this.uiMgr.showUIBonus(false);
    }

    updateUIByType(type, uiManager) {
        this.uiMgr = uiManager;
        let name = "play/clock";
        let self = this;
        if (type == ToolType.Tool_Column) {
            name = "newMain/setdoc";
            this.bonusTitle.string = "Column Breaker"
            this.description.string = "Choose a column you want to clear"
        } else if (type == ToolType.Tool_Row) {
            this.bonusTitle.string = "Row Breaker"
            this.description.string = "Choose a row you want to clear"
            name = "newMain/setngang";
        }
        cc.loader.loadRes(name, cc.SpriteFrame, function (err, spriteFrame) {
            self.targetImage.spriteFrame = spriteFrame;
        });
    }
}