import GestureHelper from "./GestureHelper";

const {ccclass, property} = cc._decorator;
import GlobalData = require("../global/GlobalData");


@ccclass
export default class LevelItem extends cc.Component {

    @property(cc.Label)
    numNode: cc.Label = null;

    @property(cc.Node)
    levelNode: cc.Node = null;

    isUnlocked: boolean;
    level: number;
    callback: any;

    onLoad() {
    }

    onEnable() {
    }

    start() {
    }

    setItem(level, levelInfo, numberLevelUnlocked, callback) {
        // console.log(level, levelInfo, numberLevelUnlocked);
        this.callback = callback;
        let self = this;
        this.level = level;
        console.log("level", level);
        if (level <= Number(numberLevelUnlocked)) {
            if (level < Number(numberLevelUnlocked)) {
                cc.loader.loadRes("newLevel/unselected", cc.SpriteFrame, function (err, spriteFrame) {
                    self.levelNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                });
            } else {
                cc.loader.loadRes("newLevel/unselected", cc.SpriteFrame, function (err, spriteFrame) {
                    self.levelNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    self.levelNode.getComponent(cc.Sprite).node.height = 127;
                    self.levelNode.getComponent(cc.Sprite).node.width = 125;
                });
                // this.onShowTouch(self.node);
            }
            this.isUnlocked = true;
            this.numNode.string = level;
            if (level < 10) {
                this.numNode.fontSize = 80;
            } else {
                this.numNode.fontSize = 70;
            }
        } else {
            cc.loader.loadRes("newLevel/locked1", cc.SpriteFrame, function (err, spriteFrame) {
                self.levelNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            this.isUnlocked = false;
            this.numNode.string = "";
        }

        if (this.isUnlocked) {
            this.node.on('click', this.onButtonCLick, this);
        } else {
            this.node.off('click', this.onButtonCLick, this);
        }
    }

    onButtonCLick() {
        // @ts-ignore
        GlobalData.currentLevel = this.level;
        this.callback();
    }

    onShowTouch(node) {
        let posA = cc.v2(node.position.x +50, node.position.y -60)
        GestureHelper.inst.GuideMove(posA, posA);
        // GestureHelper.inst.stopAction();
        // var btnworldpos = node.convertToWorldSpaceAR(cc.v3(0, 0));
        // let locpos = this.node.convertToNodeSpaceAR(btnworldpos);
        // this.node.getChildByName("mask").position = locpos;
        // this.node.getComponentInChildren(cc.Label).node.position = locpos.add(cc.v3(0, 134)); GestureHelper.inst.GuideTouchBtn(node)
    }
}
