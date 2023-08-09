import UIManager from "../UIManager";
import GameManager from "../GameManager";

const {ccclass, property} = cc._decorator;
import GlobalData = require("../global/GlobalData");
import HorizontalAlign = cc.Label.HorizontalAlign;
import Common from "../Common";


@ccclass
export default class MissionInfo extends cc.Component {

    @property(cc.Label)
    lblTime: cc.Label = null;

    @property(cc.Label)
    lblMission: cc.Label = null;

    @property(cc.Label)
    targetMission: cc.Label = null;

    @property(cc.Label)
    currentScoreLabel: cc.Label = null;

    @property(cc.Label)
    titleStage: cc.Label = null;

    @property(cc.Sprite)
    targetImage: cc.Sprite = null;

    @property(cc.Sprite)
    targetImageSub: cc.Sprite = null;

    @property(cc.Layout)
    layoutCube: cc.Layout = null;

    @property(cc.Prefab)
    cubePrefab: cc.Prefab = null;

    @property(cc.Button)
    btnTips: cc.Button = null;

    currentLevel: any;


    totalNumberTarget: number = 0;
    passedNumberTarget: number = 0;

    uiMgr: UIManager = null;
    gameManager: GameManager = null;


    // onLoad () {}

    updateMission(level, uiManager, gameManager) {
        this.uiMgr = uiManager;
        this.gameManager = gameManager;
        let listRandom = level["cdnNumRate"];
        this.layoutCube.node.removeAllChildren(true);
        if (!listRandom) {
            listRandom = Common.getDefaultCdn();
        }

        for (var i = 0; i < listRandom.length; ++i) {
            var item = cc.instantiate(this.cubePrefab);
            this.layoutCube.node.addChild(item);
            item.getComponent('CubeComponent').setNum(listRandom[i], 0);
        }
        this.btnTips.node.on('click', this.onBtnTips, this);

        this.lblMission.string = level.description;
        this.lblMission.horizontalAlign = HorizontalAlign.CENTER;
        this.currentLevel = level;

        // @ts-ignore
        this.titleStage.string = "Stage " + GlobalData.currentLevel;

        if (level.typeMission == 3) {
            this.lblTime.node.active = true;
            this.currentScoreLabel.node.active = true;
            this.targetMission.node.active = false;
            this.updateTimeLabel(level.mission["time"]);
            //console.log(Common.secondsToDhms(100));
        } else {
            this.lblTime.node.active = false;
            this.targetMission.node.active = true;
            this.currentScoreLabel.node.active = false;
        }

        if (level.typeMission == 1 || level.typeMission == 5) {
            for (var k in this.currentLevel.mission) {
                this.totalNumberTarget = this.currentLevel.mission[k];
                this.updateTargetMission(0);
            }
        } else if (level.typeMission == 2) {
            let k = Object.keys(level.mission)[0];
            var count = level.mission[k].length;
            this.totalNumberTarget = count;
            this.updateTargetMission(0);
        } else if (level.typeMission == 4) {
            this.totalNumberTarget = this.currentLevel.mission[50].index.length;
            this.updateTargetMission(0);
            this.gameManager.onUpdateIdxBlocked(this.currentLevel.mission[50].index);
        }
        this.updateImageTarget();
    }

    onBtnTips() {
        this.uiMgr.showDlg("TipsDlg", cc.v2(0, 0));
    }

    updateImageTarget() {
        let self = this;
        let typeMission = this.currentLevel.typeMission;
        let name = "newBlock/default/default_2";
        self.targetImageSub.node.active = false;
        if (typeMission == 1 || typeMission == 5) {
            let num = Object.keys(this.currentLevel.mission)[0];
            name = Common.getNumResource(num);
            self.targetImage.node.width = 75;
            self.targetImage.node.height = 75;
        } else if (typeMission == 2) {
            self.targetImageSub.node.active = true;
            let num = Object.keys(this.currentLevel.mission)[0];
            let nameSub = Common.getNumResource(num);
            cc.loader.loadRes(nameSub, cc.SpriteFrame, function (err, spriteFrame) {
                self.targetImageSub.spriteFrame = spriteFrame;
            });
            name = "newMain/targetMission";
            self.targetImage.node.width = 86;
            self.targetImage.node.height = 75;
        } else if (typeMission == 3) {
            self.targetImage.node.width = 75;
            self.targetImage.node.height = 75;
            name = "newMain/clockBrown"
        } else if (typeMission == 4) {
            self.targetImage.node.width = 75;
            self.targetImage.node.height = 75;
            name = "newMain/target_top_display"
        }
        cc.loader.loadRes(name, cc.SpriteFrame, function (err, spriteFrame) {
            self.targetImage.spriteFrame = spriteFrame;
        });
    }

    resetMission() {
        this.totalNumberTarget = 0;
        this.passedNumberTarget = 0;
    }

    updateTimeLabel(time) {
        if (this.currentLevel.typeMission == 3) {
            this.lblTime.string = Common.secondsToDhms(time);
        }
    }

    setCurScoreLabel(score) {
        this.currentScoreLabel.string = score;
    }

    checkMissionForMission1(mergeNumber) {
        let isComplete = false;
        let k = Object.keys(this.currentLevel.mission)[0];

        if (mergeNumber == k) {
            this.passedNumberTarget += 1;
        }
        this.updateTargetMission(this.passedNumberTarget);
        if (this.passedNumberTarget == this.totalNumberTarget) {
            isComplete = true;
        }
        return isComplete;
    }

    checkMissionIsComplete(block, maxIdxCheck, targetBoolArray) {
        let mission = this.currentLevel.mission;
        let isComplete = true;
        if (this.currentLevel.typeMission == 5) {
            for (var k in mission) {
                var count = mission[k];
                var times = 0;
                for (var i = 0; i < maxIdxCheck; i++) {
                    if (block[i].num == k) {
                        times++;
                    }
                }
                this.updateTargetMission(times);
                if (times < count) {
                    isComplete = false;
                }
            }
        } else if (this.currentLevel.typeMission == 2) {
            for (var k in mission) {
                //List index should be number K
                var indexs = mission[k];
                var targetNumber = Number(k);
                var count = indexs.length;
                var times = 0;
                for (var i = 0; i < count; i++) {
                    if (block[indexs[i]].num == targetNumber) {
                        times++;
                    }
                }
                this.updateTargetMission(times);
                if (times < count) {
                    isComplete = false;
                }
            }
        } else if (this.currentLevel.typeMission == 3) {
            if (Common.curScore < mission["score"]) {
                isComplete = false;
            }
        } else if (this.currentLevel.typeMission == 4) {
            var indexs = mission["50"].index;
            var nums = mission["50"].num;
            var count = indexs.length;
            var times = 0;
            for (var i = 0; i < indexs.length; i++) {
                if (block[indexs[i]].num != nums[i] || targetBoolArray[indexs[i]] == true) {
                    targetBoolArray[indexs[i]] = true;
                    times++;
                }
            }
            this.updateTargetMission(times);
            if (times < count) {
                isComplete = false;
            }
        }
        return isComplete;
    }


    updateTargetMission(times) {
        this.passedNumberTarget = times;
        this.targetMission.string = this.passedNumberTarget + "/" + this.totalNumberTarget;
    }
}
