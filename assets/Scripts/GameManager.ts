import HorizontalAlign = cc.Label.HorizontalAlign;
import ObjectManager from "./ObjectManager";
import UIManager from "./UIManager";
import GlobalData = require("./global/GlobalData");
import {TypeBlock} from "./GlobalConfig";
import Integer = cc.Integer;
import MissionInfo from "./level/MissionInfo";
import NextBoxInfo from "./level/NextBoxInfo";
import BonusItemInfo from "./level/BonusItemInfo";
import BottomInfo from "./level/BottomInfo";
import StartScreenManager from "./StartScreenManager";
import {EasingEnum} from "./global/EasingEnum";
import FBGlobal from "./FBGlobal";
import LevelDlg from "./LevelDlg";
import Utils from "./level/Utils";
import Common, {AudioEffectID, CUSTOM_EVENT, GameState, SHOP_EVENT} from "./Common";


const GridSize = cc.v2(110, 110);
const FasterSpeed = 7200;
var COL = 5;
var ROW = 7;
var BASESIZE = 104;
var DROPSPEED = 6000;

const MoveDownDelayTimeMax = 0;
const GatherCubeDuration = 0.03;
const ScaleCubeDuration = 0.2;
const {ccclass, property} = cc._decorator;
const PrintTest = true;

var testCase = {
    1: 256,
    2: 1024,
    3: 512,
    4: 256,
    5: 2048,
    7: 256,
    8: 128,
    9: 2048,
    10: 128,
    12: 1024,
    13: 32,
    14: 1024,
    15: 64,
    17: 512,
    18: 4,
    19: 64,
    22: 128,
    23: 2,
    24: 32,
    27: 64,
    29: 16
}

@ccclass
export default class GameManager extends cc.Component {

    static _ins: GameManager;
    @property(cc.Node)
    playBoardArea: cc.Node = null;

    @property(cc.Node)
    touchPlayBoardArea: cc.Node = null;

    @property(cc.Node)
    targetArea: cc.Node = null;
    @property(cc.Button)
    btnPause: cc.Button = null;

    @property(cc.Node)
    uiRoot: cc.Node = null;

    nowPic = null;
    objMgr: ObjectManager = null;
    uiMgr: UIManager = null;
    uiMission: MissionInfo = null;
    nextBoxInfo: NextBoxInfo = null;
    bonusItemInfo: BonusItemInfo = null;
    nextNum: number;
    nowNum: number = 0;
    columnTouchNew: number = Math.ceil(COL / 2);
    rowTouchNew: number = ROW;
    columnCurrent: number = Math.ceil(COL / 2);
    rowCurrent: number = ROW;
    passTime: number = 0;
    comboCount: number = 0;
    block: any[];
    moveDownDelayTime: number;
    checkCount: number;
    downCount: number;
    mergeNumers: any[];
    downNumbers: any[];
    mergeCount: any[];
    needMerge: any[];
    touchControl: boolean = true;
    moveTime: number = 0;
    moved: boolean = false;
    moveDx: number = 0;
    levelInfo: any;
    cx: number = 0;
    cy: number = 0;
    //Mission
    maxIdxCheck: number = 0;
    totalTime: number = 0;
    originalTime: number = 0;
    countTimeCb: any;
    indexStones: any[];
    touchPos: any;
    maxLevelUnclocked: number;
    isBlockingToolRow: boolean = false;

    //TYPE 0 x2
    //TYPE 1 Clear column
    idxBlockeds: any[];
    //TYPE 2 Clear rơw
    toolType: number;
    isCompleteMission1 = false;

    static get instance(): GameManager {
        return this._ins || new GameManager;
    }

    onLoad() {
        GameManager._ins = this;
        Common.gameState = GameState.None;
        // Common.setNumberLevelUnlocked(300);

        //FBGlobal.instance.loadVideoAdsFirst();

        FBGlobal.instance.loadAdsInterestial();

        let self = this;

        this.objMgr = this.node.getComponent(ObjectManager);
        this.uiMgr = this.node.getComponent(UIManager);
        this.uiMission = this.node.getComponent(MissionInfo);
        this.nextBoxInfo = this.node.getComponent(NextBoxInfo);
        this.bonusItemInfo = this.node.getComponent(BonusItemInfo);
        this.bonusItemInfo.updateUIByType(1, this.uiMgr);
        this.nextBoxInfo.onReuseUI(this.uiMgr);
        this.uiMgr.onUpdateCoin();

        this.nowPic = null;
        this.cx = cc.winSize.width / 2;
        this.cy = cc.winSize.height / 2;

        this.maxIdxCheck = 0;
        this.moveDownDelayTime = 0;
        this.maxLevelUnclocked = Number(Common.getNumberLevelUnlocked());
        this.btnPause.node.on('click', this.onBtnPause, this);


//----------------------------------------------------------------------------------------------------
        this.touchPlayBoardArea.on(cc.Node.EventType.TOUCH_START, function (event) {
            if ((Common.gameState != GameState.Ready_Cube
                    && Common.gameState != GameState.Run
                    && Common.gameState != GameState.Drop
                    && Common.gameState != GameState.Tool)
                || Common.isPauseGame) {
                return;
            }
            console.log("touch start");

            this.touchControl = true;
            this.moveTime = 0;
            this.moved = false;
            this.moveDx = 0;
            this.touchPos = event.getLocation();
            this.columnTouchNew = this.getIdxFromTouchPos(this.touchPos).x;
            this.rowTouchNew = this.getIdxFromTouchPos(this.touchPos).y;
        }, this);


        this.touchPlayBoardArea.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            if ((Common.gameState != GameState.Ready_Cube && Common.gameState != GameState.Run)
                || Common.isPauseGame) {
                return;
            }
            console.log("touch move");

            // Di chuyển vị trí tọa độ của nút hiện tại
            var target = event.getCurrentTarget();
            var pos = event.getLocation();
            var dx = pos.x - this.touchPos.x;
            var dy = pos.y - this.touchPos.y;
            // console.log("move:", dx, dy);
            if (Math.abs(dy) > Math.abs(dx))
                return;

            var moveDx = 0;
            if (dx < 0)
                moveDx = Math.ceil(dx / BASESIZE - 0.5);
            else
                moveDx = Math.floor(dx / BASESIZE + 0.5);
            if (moveDx - this.moveDx < 0) {
                for (var i = 0; i < this.moveDx - moveDx; i++) {
                    this.move("left");
                    this.moved = true;
                }
            } else if (moveDx - this.moveDx > 0) {
                for (var i = 0; i < moveDx - this.moveDx; i++) {
                    this.move("right");
                    this.moved = true;
                }
            }
            this.moveDx = moveDx;
        }, this);

        this.touchPlayBoardArea.on(cc.Node.EventType.TOUCH_END, function (event) {
            if (((Common.gameState != GameState.Ready_Cube &&
                Common.gameState != GameState.Run &&
                Common.gameState != GameState.Tool) || Common.isPauseGame)) {
                return;
            }

            if (Common.gameState == GameState.Tool) {
                Common.gameState = GameState.ToolActive
                return;
            }

            console.log("touch end");

            this.touchControl = false;
            let isCanSwapColumn = true;

            let min = self.columnTouchNew;
            let max = self.columnCurrent;
            if (min > max) {
                min = self.columnCurrent;
                max = self.columnTouchNew;
            }

            // if (self.rowTouchNew > self.rowCurrent) {
            //     isCanSwapColumn = false;
            // } else {
            //
            // }
            for (var i = min; i <= max; i++) {
                if (self.block[(this.rowCurrent - 1) * COL + i - 1].num) {
                    isCanSwapColumn = false;
                    break;
                }
            }

            // if (this.moved)
            //     return;
            // var pos = event.getLocation();
            // var dx = pos.x - this.touchPos.x;
            // var dy = pos.y - this.touchPos.y;
            // if (dy < -BASESIZE * 0.5) {
            //     this.drop();
            // } else {
            //     //    --[[1.2.1取消点击最下一行掉落
            //     // 	if y < display.height * 0.5 - ROW * BASESIZE * 0.5 + BASESIZE  then
            //     // this.tetris: drop()
            //     //    else]]
            //     // }
            //     // if (this.moveTime < 0.5) {
            //     //     if (pos.x < this.cx) {
            //     //         this.move("left");
            //     //     } else {
            //     //         this.move("right");
            //     //     }
            //     // }
            //     this.drop();
            // }
            if (isCanSwapColumn) {
                self.columnCurrent = self.columnTouchNew;
                console.log("BINH COLUMN" + self.columnCurrent);
                self.drop();
            }
        }, this);
    }

    onUpdateIdxBlocked(idxsBlocked) {
        this.idxBlockeds = [];
        for (const num in idxsBlocked) {
            this.idxBlockeds.push(false);
        }
    }

    onUpdateMission() {
        // @ts-ignore
        this.levelInfo = GlobalData.LevelGame[GlobalData.currentLevel];
        //this.uiMgr.updateMission(this.levelInfo);
        this.uiMission.updateMission(this.levelInfo, this.uiMgr, this);
        this.onUpdatePrecondition(this.levelInfo);
        this.startTimer();
    }

    onInitBlock() {
        var block = this.block;
        if (block != null) {
            for (var i = 0; i < ROW * COL; i++) {
                this.block[i].num = 0
                if (block[i].pic != null) {
                    block[i].pic.getComponent("CubeComponent").removeCube();
                    block[i].pic = null;
                }
            }
        } else {
            block = this.block = new Array();
            for (var i = 0; i < ROW * COL; i++) {
                block[i] = {num: 0, pic: null};
            }
        }
    }

    targetUnlockBool: boolean[];

    onUpdatePrecondition(level) {
        var numeroPerguntas = 30;
        this.targetUnlockBool = new Array(numeroPerguntas).fill(false);
        console.log(this.targetUnlockBool);
        this.indexStones = [0, 0, 0, 0, 0, 0];
        this.maxIdxCheck = 0;
        if (level.coin) {
            // @ts-ignore
            GlobalData.bonusCoin = level.coin;
        } else {
            // @ts-ignore
            GlobalData.bonusCoin = 50;
        }

        this.onInitBlock();

        //Tao khoi block ban dau
        var missionType = level.typeMission;
        let preconditions = level.precondition;
        this.initPreCubeFromCondition(preconditions);
        this.totalTime = Number(level.mission["time"]);
        this.originalTime = Number(level.mission["time"]);
    }

    initPreCubeFromCondition(preconditions) {
        for (var k in preconditions) {
            let currentNumber = Number(k);
            if (currentNumber == 50 || currentNumber == 10) {
                var indexs = preconditions[k].index;
                var nums = preconditions[k].num;
                for (var i in indexs) {
                    this.initPreCube(indexs[i], currentNumber, nums[i])
                }
            } else {
                let idxs = preconditions[k];
                for (var m in idxs) {
                    this.initPreCube(idxs[m], currentNumber)
                }
            }
        }
    }

    /**
     * 创建随机方块
     */
    initPreCube(idx, num, value?) {
        let pic = this.objMgr.createCube(num);
        pic.getComponent("CubeComponent").setNumPre(idx, num, value);
        this.playBoardArea.addChild(pic);
        let pos = this.getBlockPosition(idx);
        pic.setPosition(pos);
        this.block[idx].pic = pic;
        if (num == 50) {
            this.block[idx].num = value;
        } else if (num == 10) {
            let target = this.objMgr.createTarget(this.block[idx].pic.position);
            this.targetArea.addChild(target.getComponent("TargetComponent").node);
            this.block[idx].num = value;
        } else {
            this.block[idx].num = num;
        }
        if (num == 99) {
            var position = this.pos(idx);
            if (this.indexStones[position.x] > idx) {
                this.indexStones[position.x] = idx;
            }
        }
    }

    onEnable() {
        this.node.on(CUSTOM_EVENT.PAUSE_GAME, this.pauseGamePlay, this);
        this.node.on(CUSTOM_EVENT.CONTINUE_GAME, this.continueGamePlay, this);
        this.node.on(CUSTOM_EVENT.RESTART_GAME, this.restartGamePlay, this);
        this.node.on(CUSTOM_EVENT.STOP_GAME, this.stopGamePlay, this);
        this.node.on(CUSTOM_EVENT.REVIVE, this.reviveGamePlay, this);
        this.node.on(CUSTOM_EVENT.TOOL_X2, this.onToolX2, this);
        this.node.on(CUSTOM_EVENT.TOOL_ROW, this.onToolRow, this);
        this.node.on(CUSTOM_EVENT.TOOL_COLUMN, this.onToolColumn, this);
        this.node.on(SHOP_EVENT.UPDATE_COIN, this.onUpdateCoin, this);
    }

    onDisable() {
        this.node.off(CUSTOM_EVENT.PAUSE_GAME, this.pauseGamePlay, this);
        this.node.off(CUSTOM_EVENT.CONTINUE_GAME, this.continueGamePlay, this);
        this.node.off(CUSTOM_EVENT.RESTART_GAME, this.restartGamePlay, this);
        this.node.off(CUSTOM_EVENT.STOP_GAME, this.stopGamePlay, this);
        this.node.off(CUSTOM_EVENT.REVIVE, this.reviveGamePlay, this);
        this.node.off(CUSTOM_EVENT.TOOL_X2, this.onToolX2, this);
        this.node.off(CUSTOM_EVENT.TOOL_ROW, this.onToolRow, this);
        this.node.off(CUSTOM_EVENT.TOOL_COLUMN, this.onToolColumn, this);
        this.node.off(SHOP_EVENT.UPDATE_COIN, this.onUpdateCoin, this);
    }

    onUpdateCoin() {
        this.uiMgr.onUpdateCoin();
    }

    onToolX2() {
        Common.isPauseGame = true;
        let cube = this.nowPic;
        this.nowNum *= 2;
        let pos = cube.position;
        this.uiMgr.showRemoveEffect(3, pos);
        Common.playAudioEffect(AudioEffectID.X2, false);
        if (cube != null) {
            cube.getComponent("CubeComponent").setX2Value();
        }
        this.scheduleOnce(function () {
            BottomInfo.instance.setLastTime();
            Common.isPauseGame = false;
        }, 0.5);
    }

    onToolColumn() {
        Common.gameState = GameState.Tool;
        this.uiMgr.showUIBonus(true);
        this.isBlockingToolRow = true;
        this.toolType = 1;
        this.bonusItemInfo.updateUIByType(1, this.uiMgr);
    }

    onToolRow() {
        Common.gameState = GameState.Tool;
        this.uiMgr.showUIBonus(true);
        this.isBlockingToolRow = true;
        this.toolType = 2;
        this.bonusItemInfo.updateUIByType(2, this.uiMgr);
    }

    removeCubeNormalOnly(idx) {
        let cube = this.block[idx].pic;
        let num = this.block[idx].num;
        if (cube != null) {
            if (cube.getComponent("CubeComponent").typeCube != TypeBlock.Stone && cube.getComponent("CubeComponent").typeCube != TypeBlock.Block && num != 99 && num != 50) {
                cube.getComponent("CubeComponent").removeCube();
                this.block[idx] = {num: 0, pic: null};
            }
        }
    }

    start() {
        //this.startGamePlay();
        //this.onInitBlock();
    }

    update(dt) {
        if (Common.isPauseGame) {
            return;
        }

        if (this.touchControl)
            this.moveTime = this.moveTime + dt;
        // console.log("current pos" + this.convertPosToIdx(this.movingCube.getPosition()) + "playboardarea" + this.convertPosToIdx(this.playBoardArea.getPosition()) );

        switch (Common.gameState) {
            case GameState.Run: {
                this.passTime = this.passTime + dt;
                let cubeComp = this.nowPic.getComponent("CubeComponent");

                // if (this.passTime > cubeComp.getDownSpeed()) {
                //     this.passTime = 0;
                //     this.dropOneRow();
                // }
            }
                break;

            case GameState.Eliminate_Cube: {
            }
                break;

            case GameState.Ready_Cube: {
                Common.gameState = GameState.Run;
            }
                break;

            case GameState.ToolActive: {
                if (this.toolType == 1) {
                    let columnPos = this.getIdxFromTouchPos(this.touchPos);
                    let idx = this.idx(columnPos.x, columnPos.y);
                    this.uiMgr.showRemoveEffect(1, this.getBlockPosition(idx));
                    Common.playAudioEffect(AudioEffectID.ClearRow, false);
                    for (let i = 0; i < ROW; i++) {
                        let idx = (columnPos.x - 1) + COL * i;
                        console.log("idx" + idx);
                        this.removeCubeNormalOnly(idx);
                    }
                    BottomInfo.instance.setLastTime();
                } else if (this.toolType == 2) {
                    let rowPos = this.getIdxFromTouchPos(this.touchPos);
                    let idx = this.idx(rowPos.x, rowPos.y);
                    this.uiMgr.showRemoveEffect(2, this.getBlockPosition(idx));
                    Common.playAudioEffect(AudioEffectID.ClearRow, false);
                    for (let i = 0; i < COL; i++) {
                        let idx = COL * (rowPos.y - 1) + i;
                        console.log("idx" + idx);
                        this.removeCubeNormalOnly(idx);
                    }
                    BottomInfo.instance.setLastTime();
                }
                this.sortAfterMerge();
                this.uiMgr.showUIBonus(false);
                Common.isPauseGame = false;
                Common.gameState = GameState.Run;
            }
                break;
            default:
                break;
        }

    }

    startGamePlay() {
        console.log("start game play already");
        this.onUpdateMission();

        this.setCurScore(0);

        this.nextNum = this.createRandNum();

        console.log(`nextnum2 = ${this.nextNum}`);
        this.nextBoxInfo.setNextNum(this.nextNum);

        Common.isPauseGame = false;

        Common.difficultyLevel = 0;
        Common.isDlgDisplay = false;
        this.isCompleteMission1 = false;
        this.isBlockingToolRow = false;
        this.passTime = 0;
        this.rowCurrent = ROW;
        this.columnCurrent = Math.ceil(COL / 2);

        this.sendNumer(null, null, true);
    }

    startTimer() {
        if (this.levelInfo.typeMission == 3) {
            this.unschedule(this.countTimeCb);
            console.log("Start timer")
            // Time interval in units of seconds
            let self = this;
            // Time of repetition
            var repeat = 1;
            // Start delay
            var delay = 1;
            this.countTimeCb = function () {
                if (self.totalTime === 0) {
                    // Cancel this timer at the sixth call-back
                    this.unschedule(self.countTimeCb);
                    //Show Game over time out
                    self.gameOverHandle();
                    return;
                }
                if (Common.isPauseGame != true) {
                    self.uiMission.updateTimeLabel(self.totalTime);
                    self.totalTime--;
                }
            }
            this.schedule(this.countTimeCb, 1, self.originalTime);
        } else {
            this.unschedule(this.countTimeCb);
        }
    }

    pauseGamePlay() {
        //FBInstant.onPause(function() {
        console.log('Pause event was triggered!');
        Common.isPauseGame = true;
        Common.pauseBGM();
        // })
    }

    continueGamePlay() {
        console.log("Resume nhe")
        Common.isPauseGame = false;
        Common.resumeBGM();
    }

    resetPool() {
        this.objMgr.onClear();
    }

    restartGamePlay() {
        Common.isPauseGame = true;
        this.targetArea.removeAllChildren();
        this.cleanUpGameArea();
        this.startGamePlay();
        Common.isPauseGame = false;
        Common.resumeBGM();
    }

    stopGamePlay() {
    }

    reviveGamePlay() {
        if (this.nowPic != null) {
            this.nowPic.getComponent("CubeComponent").removeCube();
        }
        this.nowPic = null;
        for (let row = 4; row <= 6; row++) {
            this.uiMgr.showRemoveEffect(2, row);
            for (let i = 0; i < COL; i++) {
                let idx = COL * (row - 1) + i;
                console.log("idx" + idx);
                this.removeCubeNormalOnly(idx);
            }
        }


        this.nextNum = this.createRandNum();

        console.log(`nextnum2 = ${this.nextNum}`);
        this.nextBoxInfo.setNextNum(this.nextNum);

        Common.isPauseGame = false;

        Common.difficultyLevel = 0;
        Common.isDlgDisplay = false;
        this.isCompleteMission1 = false;
        this.isBlockingToolRow = false;
        this.passTime = 0;
        this.rowCurrent = ROW;
        this.columnCurrent = Math.ceil(COL / 2);

        this.sendNumer(null, null, true);

        this.unschedule(this.countTimeCb);
        this.startTimer();
        // this.startGamePlay();
    }

    cleanUpGameArea() {
        if (this.nowPic != null) {
            this.nowPic.getComponent("CubeComponent").removeCube();
        }
        this.nowPic = null;
        if (this.block) {
            for (let i = 0; i < ROW * COL; i++) {
                this.removeCubeWithIdx(i);
            }
        }
    }

    removeCubeWithIdx(idx) {
        let cube = this.block[idx].pic;

        if (cube != null) {
            cube.getComponent("CubeComponent").removeCube();
        }
        this.block[idx] = {num: 0, pic: null};
    }

    createRandNum() {
        let listNumber = this.levelInfo["cdnNumRate"];
        if (!listNumber) {
            listNumber = Common.getDefaultCdn();
        }
        // let rand = Math.ceil(Math.random()*11);
        let rand = Math.ceil(Math.random() * listNumber.length);
        return listNumber[rand - 1];
    }

    /**
     * 创建随机方块
     */
    createMovingCube() {
        let idx = this.idx(this.columnCurrent, ROW);

        this.nowPic = this.objMgr.createCube(this.nextNum);
        this.nowNum = this.nextNum;
        this.nowPic.getComponent("CubeComponent").setNum(this.nextNum, idx);
        // this.movingCube.getComponent("CubeComponent").isTarget = true;

        this.playBoardArea.addChild(this.nowPic);

        let pos = this.getBlockPosition(idx);
        this.nowPic.setPosition(pos);

        //this.block[idx].num = this.nowNum;
        //this.block[idx].pic = this.nowPic;

        Common.gameState = GameState.Ready_Cube;
        this.moveDownDelayTime = MoveDownDelayTimeMax;
    }

    /**
     * 创建随机方块
     */
    createMergeBlock(mergeNum, subIdx) {
        let mergeBlock = this.objMgr.createCube(this.nextNum);
        mergeBlock.getComponent("CubeComponent").setNum(mergeNum, subIdx);
        // this.movingCube.getComponent("CubeComponent").isTarget = true;
        this.playBoardArea.addChild(mergeBlock);

        let pos = this.getBlockPosition(subIdx);
        mergeBlock.setPosition(pos);

        return mergeBlock;
    }

    dropOneRow() {
        let cubeComp = this.nowPic.getComponent("CubeComponent");

        var pos = this.pos(cubeComp.getIdx());
        var x = pos.x;
        var y = pos.y;
        if (y > 1 && this.block[cubeComp.getIdx() - COL].num == 0) {
            this.setNowNumPos(x, y - 1);
            return
        }

        if (y == ROW - 1) {
            if (this.block[cubeComp.getIdx() - COL].num != this.nowNum) {
                this.unschedule(this.countTimeCb);
                this.uiMgr.showDlg("GameOverDlg", cc.v2(0, 0));
                Common.gameState = GameState.Eliminate_Cube;
                return;
            }
        }
        Common.gameState = GameState.Drop;
        var idx = cubeComp.getIdx();
        this.block[idx].num = this.nowNum;
        this.block[idx].pic = this.nowPic;
        this.checkMerge([idx], false);
    }

    move(orient) {
        // console.log("move", orient);
        var index = this.nowPic.getComponent("CubeComponent").getIdx();

        var pos = this.pos(index);
        var x = pos.x;
        var y = pos.y;
        if (orient == "left") {
            if (x != 1 && this.block[index - 1].num == 0) {
                x = x - 1;
                this.columnCurrent = x;
                this.columnTouchNew = x;
            } else
                return;
        } else if (orient == "right") {
            if (x != COL && this.block[index + 1].num == 0) {
                x = x + 1;
                this.columnCurrent = x;
                this.columnTouchNew = x;
            } else
                return;
        }
        // --if GameData.music then audio.playEffect(res.smove) end
        this.setNowNumPos(x, y);
    }

    checkMerge(idxes, noDown?) {
        //console.log(idxes);
        var mergeNumers = this.mergeNumers = [];
        this.mergeCount = []
        var needMerge = this.needMerge = []; //需要合成的点
        for (var i = 0; i < idxes.length; i++) {
            var idx = idxes[i];
            if (this.block[idx].num != 0) {
                mergeNumers[idx] = []; //检查点上的相邻相同数
                this.getNearbySameNumbers(idx, idx);
                //console.log(this.mergeNumers[idx]);
                if (mergeNumers[idx].length >= 2) {
                    needMerge.push(idx);
                }
            }
        }

        //Kết thúc mà không hợp nhất. Điểm kết thúc duy nhất.
        var needMergeCount = needMerge.length;
        if (needMergeCount == 0) {
            if (this.levelInfo.typeMission != 1 && this.checkMission()) {
                console.log("HAHA2")
                return true;
            } else {
                Common.gameState = GameState.Run;
                if (!noDown) {
                    //if (GameData.music) audio.playEffect(res.sdown);

                }
                if (!this.isBlockingToolRow) {
                    this.comboCount = 0;
                    this.sendNumer();
                } else {
                    this.isBlockingToolRow = false;
                }

                console.log("HAHA3")

                return false;
            }
        }
        this.checkCount = needMergeCount;
        if (PrintTest) {
            console.log(needMerge);
        }
        var _this = this;

        for (var i = 0; i < needMergeCount; i++) {
            this.merge(needMerge[i], function (mergeNumber) {
                if (_this.levelInfo.typeMission == 1) {
                    console.log("can complate called -1 ");

                    let canComplete = _this.checkMission(mergeNumber);
                    if (canComplete) {
                        console.log("can complate called 0 ");
                        _this.isCompleteMission1 = true;
                    }
                }
                console.log("Merge number" + mergeNumber);
                _this.checkCount = _this.checkCount - 1;
                if (PrintTest) {
                    console.log("AllMerge count.." + (_this.checkCount + 1) + "->" + _this.checkCount);
                }
                if (_this.checkCount == 0) {
                    _this.sortAfterMerge();
                }
            })
        }
    }

    addScore(subIdx, mergeNum) {
        this.setCurScore(Common.curScore + mergeNum);
        var str = "+" + mergeNum;
        var pt = this.getBlockPosition(subIdx);
        var px = this.cx - COL * BASESIZE * 0.5;
        var py = this.cy - ROW * BASESIZE * 0.5;

        let fontNode = new cc.Node();
        let score = fontNode.addComponent(cc.Label);
        score.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        score.verticalAlign = cc.Label.VerticalAlign.CENTER;
        score.overflow = cc.Label.Overflow.CLAMP;
        score.fontSize = 32;
        score.enableWrapText = false;

        // cc.loader.load("/font/fontMain", function (err, font) {
        //     score.font = font;
        // });

        score.string = str;
        fontNode.color = cc.color(1, 128, 128);

        fontNode.setPosition(px + pt.x, py + pt.y, 999);
        fontNode.zIndex = 999;
        fontNode.parent = this.playBoardArea;

        // let a = this
        // // this.playBoardArea.addChild(this.animCoin);
        // let test =cc.instantiate(this.animCoin);
        // test.getComponentInChildren(cc.Label).string = "100";
        // test.position = this.uiRoot.position.add(cc.v2(-40, -40));
        // test.zIndex = 999;
        // test.parent = this.uiRoot;
        //
        //
        // setTimeout(function () {
        //     a.animCoin.destroy()
        // }, 5e3)
        //
        //     var action = cc.sequence(
        //             cc.spawn(cc.moveBy(5, cc.v2(10, 10)), cc.fadeOut(0.5)),
        //             cc.callFunc(function () {
        //                 a.animCoin.removeFromParent(true);
        //             })
        //         );
        // this.animCoin.runAction(action);
    }

    sortAfterMerge(isToolClear?) {
        var block = this.block;
        var needMerge = this.needMerge;

        if (!this.needMerge) return;
        //console.log("sortAfterMerge");
        var downNumbers = this.downNumbers = [];
        for (var col = 1; col <= COL; col++) {
            var blank = false;
            //Binh change from row <= Row to Row
            for (var row = 1; row <= ROW; row++) {
                var idx = this.idx(col, row);
                //99 is stone
                if (block[idx].num == 0) {
                    blank = true;
                } else if (blank && block[idx].num == 99) {
                    blank = false;
                } else if (blank && block[idx] != 0) {
                    //Check if stone not down it
                    downNumbers.push(idx);
                }
            }
        }
        //Điểm tổng hợp có thể không cần bỏ, bạn phải kiểm tra lại điểm tổng hợp
        var addCheckNumbers = [];
        for (var i = 0; i < needMerge.length; i++) {
            var has = false;
            for (var k in downNumbers) {
                if (downNumbers[k] == needMerge[i]) {
                    has = true;
                    break;
                }
            }
            if (!has) {
                addCheckNumbers.push(needMerge[i]);
            }
        }

        //没有掉落，但还得检查之前的合成点
        var downNumbersCount = downNumbers.length;
        if (downNumbersCount == 0) {
            this.checkMerge(addCheckNumbers, true)
            return
        }
        this.downCount = downNumbersCount;
        let _this = this;
        for (var i = 0; i < downNumbersCount; i++) {
            let idx = downNumbers[i];

            let downIdx = idx - COL;
            if (idx > this.maxIdxCheck) {
                this.maxIdxCheck = idx;
            }

            //Không roi, nhưng bạn phải kiểm tra điểm tổng hợp trước đó
            //Need check down meet stone cant down more
            var isChecked = false;
            while (downIdx - COL > 0) {
                if (block[downIdx - COL].num == 0) {
                    downIdx = downIdx - COL;
                } else {
                    if (block[downIdx - COL].num == 99) {
                        isChecked = true;
                        break;
                    } else {
                        break;
                    }
                }
            }
            block[downIdx].num = block[idx].num;
            block[downIdx].pic = block[idx].pic;
            downNumbers[i] = downIdx
            block[idx] = {num: 0, pic: null};
            let action = cc.sequence(
                cc.moveBy(0.05, cc.v2(0, -BASESIZE * (idx - downIdx) / COL)).easing(cc.easeIn(3)),
                cc.callFunc(function () {
                        _this.downCount = _this.downCount - 1;
                        if (_this.downCount == 0) {
                            for (let j = 0; j < addCheckNumbers.length; j++) {
                                //TODO // Lỗi nghiêm trọng, được lặp lại. Gxj đã nêu ra.
                                let downHas = false;
                                for (let k = 0; k < downNumbers.length; k++) {
                                    if (downNumbers[k] == addCheckNumbers[j]) {
                                        downHas = true;
                                        break;
                                    }
                                }
                                if (!downHas) {
                                    downNumbers.push(addCheckNumbers[j]);
                                }
                            }
                            _this.checkMerge(downNumbers.reverse());
                        }
                    }
                ));
            block[downIdx].pic.runAction(action);
        }
        //console.log(downNumbers);
    }

    checkMission(mergeNumber?) {
        let isComplete;
        if (this.levelInfo.typeMission == 1) {
            isComplete = this.uiMission.checkMissionForMission1(mergeNumber);
        } else {
            isComplete = this.uiMission.checkMissionIsComplete(this.block, this.maxIdxCheck, this.targetUnlockBool);
        }
        if (isComplete) {
            // @ts-ignore
            console.log("BUG: current level" + GlobalData.currentLevel);
            this.maxLevelUnclocked = Common.bestScore;
            // @ts-ignore
            if (GlobalData.currentLevel == this.maxLevelUnclocked) {
                let num = this.maxLevelUnclocked + 1;
                Common.setBestScore(num);
                this.uiMgr.updateLevelForHome();
                //FBGlobal.postSessionScore(num);
            }
            //Still add coin when not in max level
            // @ts-ignore
            let numberBonusCoin = 0;
            for (let i = 0; i <= this.maxIdxCheck; i++) {
                if (this.block[i].num != 0) {
                    numberBonusCoin += 1;
                }
            }
            // @ts-ignore
            GlobalData.bonusCoin += numberBonusCoin;
            // @ts-ignore
            GlobalData.bonusCoin = Math.floor(GlobalData.bonusCoin / 3);
            // @ts-ignore
            Common.addMoreCoin(GlobalData.bonusCoin);
            StartScreenManager.instance.onUpdateCoin();
            this.unschedule(this.countTimeCb);
            this.gamePassHandle();
            FBGlobal.instance.createShortcutAsync();
            return true;
        }
        return false;
    }

    comboShakingScreen(comboLevel) {
        // if (comboLevel < 1) {
        // } else if (comboLevel == 1) {
        //     this.uiMgr.shakeScreen(1);
        // } else if (comboLevel == 2) {
        //     this.uiMgr.shakeScreen(3);
        // } else {
        //     this.uiMgr.shakeScreen(5);
        // }
        FBGlobal.instance.performHapticFeedbackAsync();
    }

    merge(idx, callback) {
        if (this.isCompleteMission1 && this.levelInfo.typeMission == 1) return;
        if (this.block[idx].num == 0) {
            //Đáng lẽ nó phải được hợp nhất bởi những diem khác.
            if (PrintTest) {
                console.log("Bỏ qua hợp nhất:", idx);
            }
            callback(-100);
            return;
        }
        var mergeNumers = this.mergeNumers;
        var mergeDatas = mergeNumers[idx];
        var mergeCount = this.mergeCount;
        var block = this.block;

        if (PrintTest) {
            var str = "MergeIdx:";
            for (var i = 0; i < mergeDatas.length; i++) {
                str = str + mergeDatas[i] + ",";
            }
            console.log(str);
        }

        mergeCount[idx] = mergeDatas.length;
        if (mergeCount[idx] == 2) {
            // if (GameData.music) {
            //     audio.playEffect(res.smerge1);
            // }
            Common.playAudioEffect(AudioEffectID.Merge, false);

            //  this.uiMgr.shakeScreen(3);
        } else if (mergeCount[idx] == 3) {
            // if (GameData.music) {
            //     audio.playEffect(res.smerge2);
            // }
            Common.playAudioEffect(AudioEffectID.Merge, false);
        } else {
            // if (GameData.music) {
            //     audio.playEffect(res.smerge3);
            // }
            Common.playAudioEffect(AudioEffectID.Merge, false);
        }

        this.comboShakingScreen(this.comboCount);

        var _this = this;
        var mergeNum = block[idx].num * Math.pow(2, mergeDatas.length - 1);
        var num = this.nowNum;
        for (var i = 0; i < mergeDatas.length; i++) {
            var subIdx = mergeDatas[i];
            var action = null;
            if (subIdx != idx) { //Khối tổng hợp nhấp nháy và biến mất.
                block[subIdx].num = 0;
                (function (subIdx) {
                    action = cc.sequence(
                        // cc.fadeTo(0.1, 128),
                        // cc.fadeTo(0.1, 255),
                        cc.moveTo(0.07, _this.getBlockPosition(idx)).easing(cc.easeSineIn()),
                        cc.callFunc(function () {
                            //TODO show anim remove
                            if (_this.levelInfo.typeMission == 4) {
                                var isNeedShow = false;
                                //var indexs = _this.levelInfo.mission[50].index;
                                var indexs = _this.levelInfo.mission[50].index;
                                for (var i in indexs) {
                                    if (subIdx == indexs[i] && _this.idxBlockeds[i] == false) {
                                        isNeedShow = true;
                                        _this.idxBlockeds[i] = true;
                                        Common.playAudioEffect(AudioEffectID.Breakdown, false);
                                        break;
                                    }
                                }
                                if (isNeedShow)
                                    _this.uiMgr.showBlockUnlock(_this.playBoardArea, _this.objMgr, block[subIdx].pic.position);
                            }
                            block[subIdx].pic.getComponent("CubeComponent").removeCube();
                            block[subIdx].pic.removeFromParent(true);
                            block[subIdx] = {num: 0, pic: null};
                            mergeCount[idx] = mergeCount[idx] - 1;


                            if (PrintTest) {
                                console.log("mergeIdx:" + idx + " count.." + (mergeCount[idx] + 1) + "->" + mergeCount[idx]);
                            }
                            if (mergeCount[idx] == 0) {
                                callback(-100);
                            }
                        })
                    );
                })(subIdx);
            } else { //Khối tổng hợp sẽ nhấp nháy, sau đó trở thành một khối mới và phóng to lại.
                (function (subIdx) {
                    action = cc.sequence(
                        cc.fadeTo(0.05, 128),
                        cc.fadeTo(0.05, 255),
                        cc.callFunc(function () {
                            block[subIdx].pic.removeFromParent(true);
                            block[subIdx].num = mergeNum;
                            block[subIdx].pic = _this.createMergeBlock(mergeNum, subIdx);
                            block[subIdx].pic.runAction(cc.sequence(
                                cc.callFunc(function () {
                                    //Ghi điểm
                                    _this.addScore(subIdx, mergeNum);


                                    //TODO change level hard 判断等级
                                    // while (mergeNum > _this.levelNum) {
                                    //     _this.level = _this.level + 1;
                                    //     _this.speed = _this.speed * 0.85;
                                    //     _this.levelNum = _this.levelNum * 2;
                                    //     //_this.scene.levelLabel.setString("Lv "+_this.level);
                                    // }
                                }),
                                cc.scaleTo(0.03, 1.3),
                                cc.scaleTo(0.05, 1),
                                cc.callFunc(function () {
                                    //block[subIdx].pic.remremoveFromParentAndCleanup(true)
                                    //block[subIdx].num = mergeNum
                                    //block[subIdx].pic = this.getNumerSprite(mergeNum,subIdx)
                                    mergeCount[idx] = mergeCount[idx] - 1;
                                    if (PrintTest) {
                                        console.log("mergeIdx:" + idx + " count.." + (mergeCount[idx] + 1) + "->" + mergeCount[idx]);
                                    }
                                    if (mergeCount[idx] == 0) {
                                        callback(mergeNum);
                                    }
                                })
                            ));
                        })
                    );
                })(subIdx);
            }
            block[subIdx].pic.runAction(action);
            this.comboCount++;
        }
    }

    // Thả một số
    sendNumer(nowNum?, nextNum?, first?) {
        if (!this.isBlockingToolRow) {
            this.nowNum = nowNum || this.nextNum;
            this.createMovingCube();
            this.nextNum = this.createRandNum();
            this.nextBoxInfo.setNextNum(this.nextNum);
            this.passTime = 0;
        }
    }

    getNearbySameNumbers(mergeIdx, idx) {
        //console.log("getNear.."..idx);
        var mergeDatas = this.mergeNumers[mergeIdx];
        for (var k in mergeDatas) {
            if (mergeDatas[k] == idx) {
                //console.log("has.."..idx)
                return;
            }
        }
        mergeDatas.push(idx);
        var pos = this.pos(idx);
        var x = pos.x;
        var y = pos.y;
        var block = this.block;
        var num = block[idx].num;
        if (x > 1) { //left
            if (block[this.idx(x - 1, y)].num == num) {
                //console.log("same left..")
                this.getNearbySameNumbers(mergeIdx, this.idx(x - 1, y));
            }
        }
        if (x < COL) {  //right
            if (block[this.idx(x + 1, y)].num == num) {
                //console.log("same right..")
                this.getNearbySameNumbers(mergeIdx, this.idx(x + 1, y));
            }
        }
        if (y < ROW) {  //up
            if (block[this.idx(x, y + 1)].num == num) {
                //console.log("same up..")
                this.getNearbySameNumbers(mergeIdx, this.idx(x, y + 1));
            }
        }
        if (y > 1) {  //down
            if (block[this.idx(x, y - 1)].num == num) {
                //console.log("same down..")
                this.getNearbySameNumbers(mergeIdx, this.idx(x, y - 1));
            }
        }
    }

    setNowNumPos(x, y, isDrop?, isBreak?) {
        //this.nowPic.x = x;
        //this.nowPic.y = y;
        let _this = this;
        var idx = this.idx(x, y);
        this.nowPic.getComponent("CubeComponent").setIdx(idx);
        if (isDrop) {
            //Case drop change to column then drop
            var idxCurrentColumn = this.idx(this.columnCurrent, this.rowCurrent);
            _this.rowCurrent = ROW;
            // var action = cc.sequence(
            //     cc.moveTo(0.05,),
            //     cc.moveTo(0.15,),
            //     cc.callFunc(function () {
            //
            //     })
            // );
            // this.nowPic.runAction(action);
            cc.tween(this.nowPic)
                .to(0.05, {position: this.getBlockPosition(idxCurrentColumn)})
                .to(0.08, {scale: 1, position: this.getBlockPosition(idx), easing: EasingEnum.cubicIn})
                .to(0.05, {scaleX: 1, scaleY: 0.8, easing: EasingEnum.sineIn})
                .to(0.05, {scaleX: 1, scaleY: 1.1, easing: EasingEnum.sineIn})
                .to(0.05, {scale: 1, easing: EasingEnum.sineIn})
                .call(() => {
                    Common.playAudioEffect(AudioEffectID.Falling, false);
                    if (!isBreak) {
                        var idx = _this.idx(x, y);
                        _this.block[idx].num = _this.nowNum;
                        _this.block[idx].pic = _this.nowPic;
                        _this.checkMerge([idx]);

                    }
                }).start()
            this.uiMgr.activeColumn(x, this.getBlockPosition(idx));
        } else {
            this.nowPic.setPosition(this.getBlockPosition(idx));
            this.rowCurrent = y;
        }
    }

    getIdxFromTouchPos(pos) {
        let realPos = this.playBoardArea.convertToNodeSpaceAR(pos);
        let x = Math.ceil((realPos.x - 85) / GridSize.x);
        let y = Math.ceil((realPos.y - 85) / GridSize.y);
        console.log("pos x :" + realPos.x + "pos y :" + realPos.y + "x :" + x + "y :" + y);
        return cc.v2(x, y);
    }

    /**
     * GridIndexToPosition
     * @param {*He so (x,y)} idx
     */
    pos(idx) {
        var y = Math.ceil((idx + 1) / COL);
        var x = idx + 1 - (y - 1) * COL;
        return cc.v2(x, y);
    }

    /**
     * PositionToGridIndex
     * @param {*坐标} pos
     */
    idx(x, y) {
        return (y - 1) * COL + x - 1;//Mang so
    }

    drop() {
        // console.log("drop");
        var currentIndex = this.getMovingIndex();
        Common.gameState = GameState.Drop;
        var block = this.block;
        var stopY = ROW;
        var pos = this.pos(currentIndex);
        var x = this.columnCurrent;
        var y = pos.y;
        for (var row = this.rowCurrent; row >= 1; row--) {
            var idx = this.idx(x, row);
            console.log("BINH idx" + idx + "column: " + x + "row: " + row);
            console.log("BINH num at idx:" + this.block[idx].num);

            if (this.block[idx].num != 0) {
                stopY = row + 1;
                break;
            }
            if (row == 1) {
                stopY = 1;
            }
        }

        if (stopY == ROW - 1) {
            let idx = this.idx(this.columnCurrent, stopY);
            if (block[idx - COL].num != this.nowNum) {
                this.setNowNumPos(x, stopY, true, true);
                this.gameOverHandle()
                return;
            }
        }

        if (1) {
            this.setNowNumPos(x, stopY, true);
        } else {
            console.log("False of case drop number");
            var idx = this.idx(x, stopY);
            var _this = this;
            var action = cc.sequence(
                cc.moveTo((y - stopY) * BASESIZE / DROPSPEED, this.getBlockPosition(idx)).easing(cc.easeSineIn()),
                cc.callFunc(function () {
                    _this.nowPic.getComponent("CubeComponent").setIdx(idx);
                    _this.nowPic.setPosition(_this.getBlockPosition(idx));
                    _this.block[idx].num = _this.nowNum;
                    _this.block[idx].pic = _this.nowPic;
                    _this.checkMerge([idx]);
                })
            );
            this.nowPic.runAction(action);
        }

    }

    gamePassHandle() {
        let self = this;
        this.isBlockingToolRow = true;
        Common.isPauseGame = true;
        Common.playAudioEffect(AudioEffectID.WinLevel, false);

        Utils.LoadPrefab("Prefab/AnimCoin").then((pfbGuide) => {
            let coin = cc.instantiate(pfbGuide);
            coin.getComponentInChildren(cc.Label).string = "Level Complete";
            coin.position = this.node.position.add(cc.v3(0, 0, 999));
            coin.parent = self.uiRoot;
            setTimeout(function () {
                coin.destroy()
            }, 5e3)
        }).then(() => {
        });
        this.scheduleOnce(function () {
            Common.isPauseGame = false;
            this.isBlockingToolRow = false;
            this.uiMgr.showDlg("GamePassDlg", cc.v2(0, 0));
            console.log("HAHA1");
            // @ts-ignore
            if (GlobalData.currentLevel % 2 == 0) {
                FBGlobal.instance.showAdsInterestial();
            }
            return;
        }, 2);



    }

    gameOverHandle() {
        let self = this;

        this.scheduleOnce(function () {
            // Here `this` is referring to the component
            //this.scene.gameOver(); gameOver
            // @ts-ignore
            GlobalData.bonusCoin = 3;
            // @ts-ignore
            Common.addMoreCoin(GlobalData.bonusCoin);
            self.uiMgr.showDlg("GameOverDlg", cc.v2(0, 0));
            Common.playAudioEffect(AudioEffectID.FailLevel, false);
            return;
        }, 0.5);
    }

    setCurScore(score) {
        Common.curScore = score;
        this.uiMission.setCurScoreLabel(Common.curScore)
        if (Common.difficultyLevel < Common.DifficultyConfig.length - 1
            && Common.curScore >= Common.DifficultyConfig[Common.difficultyLevel].score) {

            Common.difficultyLevel++;
        }
    }

    generateTestBlock() {
        for (var k in testCase) {
            var v = testCase[k];
            var idx = parseInt(k) - 1;
            this.block[idx].setNum(v, idx);
        }
    }

    getBlockPosition(idx) {
        var pos = this.pos(idx);
        var px = BASESIZE * (pos.x - 0.5) + 90;
        var py = BASESIZE * (pos.y - 0.5) + 90;

        if (idx > 29) {
            py += 50;
        }
        return cc.v2(px, py);
    }

    getMovingIndex() {
        return this.nowPic.getComponent("CubeComponent").getIdx();
    }

    onBtnPause() {
        // let event = new cc.Event.EventCustom(Common.CUSTOM_EVENT.PAUSE_GAME, true);
        // this.node.dispatchEvent(event);
        this.pauseGamePlay()
        this.uiMgr.showDlg("PauseDlg", cc.v2(0, 100));
    }

    onUpdateBonusItem() {
        BottomInfo.instance.onUpdateInfo();
        // LevelDlg.instance.onUpdateCoin();
        StartScreenManager.instance.onUpdateCoin();
    }
}
