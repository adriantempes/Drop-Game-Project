// const Common = require("Common");
// const GameConfig = require("GameConfig");
// var PausedtestDlg = require("PausedtestDlg");
//
// const GridSize = cc.v2(156, 157);
// const GridNum = cc.v2(5, 8);
//
// //手感参数配置
// //水平切换下落通道的移动距离
// const MoveDelLimit = 200;
//
// //方块提速后的下落速度
// const FasterSpeed = 7200;
//
// //向下移动停止时间（单位：s）
// const MoveDownDelayTimeMax = 0;
// //方块聚拢时间
// const GatherCubeDuration = 0.1;
// //方块缩放动作时间
// const ScaleCubeDuration = 0.2;
//
// var cgr = 1024;
//
//
// var isAudioActive = true;
//
//
// const TouchMoveDirectioin = cc.Enum({
//     None: 0,
//     Horizonal: 1,
//     Vertical: 2,
// });
//
//
// cc.Class({
//     extends: cc.Component,
//
//     properties: {
//         uiRoot:{
//             default: null,
//             type: cc.Node,
//         },
//
//         gameArea:{
//             default: null,
//             type: cc.Node,
//         },
//
//     },
//
//     // LIFE-CYCLE CALLBACKS:
//
//     onLoad () {
//         //局部变量
//         //游戏状态
//
//         this.gameState = Common.GameState.None;
//
//         //对象工厂
//         this.objMgr = this.node.getComponent("ObjectManager");
//
//         //UI管理
//         this.uiMgr = this.node.getComponent("UIManager");
//
//         //当前降落的cube
//         this.movingCube = null;
//
//         //方块容器：存放静态方块
//         this.cubeList = new Array();
//
//         //状态、数据属性
//         //最大数字
//         this.maxNum = 0;
//
//         //下落停滞计时
//         this.moveDownDelayTime = 0;
//
//         //movingCute是否开始横向移动
//         this.isMoveHor = false;
//
//         //Combo计算
//         this.comboCount = 0;
//
//
//         for (let i = 1; i < GridNum.x+1; i++) {
//             this.cubeList[i] = new Array();
//
//             for (let j = 1; j < GridNum.y+1; j++) {
//                 this.cubeList[i][j] = null;
//             }
//         }
//
//
//         //触控
//         this.touchDir = TouchMoveDirectioin.None;
//         this.touchHorDelta = 0;
//
//         this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
//             if ((this.gameState != Common.GameState.Ready_Cube && this.gameState != Common.GameState.Move_Cube)
//                 || Common.isPauseGame) {
//                 return;
//             }
//
//             this.touchHorDelta = 0;
//
//         }, this);
//
//         this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
//             if ((this.gameState != Common.GameState.Ready_Cube && this.gameState != Common.GameState.Move_Cube)
//                 || Common.isPauseGame) {
//                 return;
//             }
//
//             let delta = event.getDelta();
//
//             if (Math.abs(delta.x/delta.y) >= 1) {
//                 this.touchDir = TouchMoveDirectioin.Horizonal;
//
//                 this.touchHorDelta += delta.x;
//
//                 if (Math.abs(this.touchHorDelta) > MoveDelLimit) {
//                     //水平切换通道一格
//                     let pos = this.movingCube.getPosition();
//                     let idx = this.converPosToIdx(pos);
//
//                     if (this.touchHorDelta > 0 && !this.checkRightCollision()) {
//                         //右边换道
//                         if (idx.x < 5) {
//                             pos.x = this.convertIdxToPos(cc.v2(idx.x + 1, idx.y)).x;
//                         }
//
//                         this.movingCube.setPosition(pos);
//                         this.touchHorDelta -= MoveDelLimit;
//                         this.isMoveHor = true;
//                     }else if(this.touchHorDelta < 0 && !this.checkLeftCollision()){
//                         //左边换道
//                         if (idx.x > 1) {
//                             pos.x = this.convertIdxToPos(cc.v2(idx.x - 1, idx.y)).x;
//                         }
//
//                         this.movingCube.setPosition(pos);
//                         this.touchHorDelta += MoveDelLimit;
//                         this.isMoveHor = true;
//                     }
//                 }
//             }else{
//                 this.touchDir = TouchMoveDirectioin.Vertical;
//             }
//
//         }, this);
//
//         this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
//
//             if ((this.gameState != Common.GameState.Ready_Cube && this.gameState != Common.GameState.Move_Cube)
//                 || Common.isPauseGame) {
//                 return;
//             }
//
//             if (this.touchDir == TouchMoveDirectioin.Vertical) {
//                 //加速下落
//                 this.movingCube.getComponent("CubeComponent").setIsSpeedUp(true, FasterSpeed);
//
//             }else if (this.touchDir == TouchMoveDirectioin.Horizonal) {
//                 if (!this.isMoveHor) {
//                     //水平换一列
//                     let pos = this.movingCube.getPosition();
//                     let idx = this.converPosToIdx(pos);
//
//
//                     if (this.touchHorDelta > 0 && !this.checkRightCollision()) {
//                         //右边换道
//                         if (idx.x < 5) {
//                             pos.x = this.convertIdxToPos(cc.v2(idx.x + 1, idx.y)).x;
//                         }
//
//                         this.movingCube.setPosition(pos);
//                     }else if(this.touchHorDelta < 0 && !this.checkLeftCollision()){
//                         //左边换道
//                         if (idx.x > 1) {
//                             pos.x = this.convertIdxToPos(cc.v2(idx.x - 1, idx.y)).x;
//                         }
//
//                         this.movingCube.setPosition(pos);
//                     }
//                 }
//             }
//
//             this.touchDir = TouchMoveDirectioin.None;
//             this.touchHorDelta = 0;
//             this.isMoveHor = false;
//
//         }, this);
//     },
//
//     onEnable(){
//
//         this.node.on(Common.CUSTOM_EVENT.PAUSE_GAME, this.pauseGamePlay, this);
//         this.node.on(Common.CUSTOM_EVENT.CONTINUE_GAME, this.continueGamePlay, this);
//         this.node.on(Common.CUSTOM_EVENT.RESTART_GAME, this.restartGamePlay, this);
//         this.node.on(Common.CUSTOM_EVENT.STOP_GAME, this.stopGamePlay, this);
//         this.node.on(Common.CUSTOM_EVENT.REVIVE, this.reviveGamePlay, this);
//     },
//
//     onDisable(){
//         this.node.off(Common.CUSTOM_EVENT.PAUSE_GAME, this.pauseGamePlay, this);
//         this.node.off(Common.CUSTOM_EVENT.CONTINUE_GAME, this.continueGamePlay, this);
//         this.node.off(Common.CUSTOM_EVENT.RESTART_GAME, this.restartGamePlay, this);
//         this.node.off(Common.CUSTOM_EVENT.STOP_GAME, this.stopGamePlay, this);
//         this.node.off(Common.CUSTOM_EVENT.REVIVE, this.reviveGamePlay, this);
//     },
//
//     start () {
//         this.startGamePlay();
//
//
//     },
//
//     update (dt) {
//
//         if (Common.isPauseGame) {
//             return;
//         }
//
//         switch (this.gameState) {
//             case Common.GameState.Move_Cube:
//             {
//                 let cubeComp = this.movingCube.getComponent("CubeComponent");
//                 let delta = cubeComp.downSpeed*dt;
//
//                 if (!cubeComp.isSpeedUp && this.moveDownDelayTime > 0) {
//                     this.moveDownDelayTime -= dt;
//                     return;
//                 }
//
//                 if (delta > GridSize.y - cubeComp.downDis) {
//                     delta = GridSize.y - cubeComp.downDis;
//                     cubeComp.downDis = 0;
//
//
//
//                     let idx = this.converPosToIdx(this.movingCube.getPosition());
//
//                     let newPos = this.convertIdxToPos(idx);
//
//                     this.movingCube.setPosition(newPos);
//
//                     //往下移动一格后做下方判断
//                     if (this.checkDownCollision()) {
//                         this.gameState = Common.GameState.Eliminate_Cube;
//                         this.cubeList[idx.x][idx.y] = this.movingCube;
//                         cubeComp.setIsSpeedUp(false);
//
//                         this.checkSettleElimination(idx);
//                     }else{
//                         this.moveDownDelayTime = MoveDownDelayTimeMax;
//                     }
//
//                 }else{
//                     cubeComp.downDis += delta;
//
//                     let oldPos = this.movingCube.getPosition();
//                     this.movingCube.setPosition(oldPos.x, oldPos.y - delta);
//                 }
//             }
//                 break;
//
//             case Common.GameState.Eliminate_Cube:
//             {
//             }
//                 break;
//
//             case Common.GameState.Ready_Cube:
//             {
//                 if (this.moveDownDelayTime > 0) {
//
//                     this.moveDownDelayTime -= dt;
//
//                 }else{
//
//                     this.moveDownDelayTime = 0;
//
//                     if (this.checkDownCollision()) {
//                         let idx = this.converPosToIdx(this.movingCube.getPosition());
//
//                         this.gameState = Common.GameState.Eliminate_Cube;
//                         this.cubeList[idx.x][idx.y] = this.movingCube;
//
//                         this.checkSettleElimination(idx);
//
//                     }else{
//                         this.gameState = Common.GameState.Move_Cube;
//                     }
//                 }
//             }
//                 break;
//
//             default:
//                 break;
//         }
//     },
//
//
//     startGamePlay(){
//         //UI 重置
//         this.uiMgr.setBestScoreLabel(Common.bestScore);
//         this.setCurScore(0);
//
//         this.nextNum = this.createRandNum();
//         this.createMovingCube();
//
//         this.nextNum = this.createRandNum();
//         this.uiMgr.setNextNum(this.nextNum);
//
//         Common.isPauseGame = false;
//
//         cgr = 1024;
//         Common.difficultyLevel = 0;
//         Common.isDialogDisplay = false;
//
//
//     },
//
//     pauseGamePlay(){
//         Common.isPauseGame = true;
//         Common.pauseBGM();
//     },
//
//     continueGamePlay(){
//         Common.isPauseGame = false;
//         Common.resumeBGM();
//     },
//
//     restartGamePlay(){
//         this.cleanUpGameArea();
//         this.startGamePlay();
//     },
//
//     reviveGamePlay(){
//
//         for (let i = 1; i < GridNum.x + 1; i++) {
//             for (let j = GridNum.y; j > GridNum.y - 3; j--) {
//                 this.removeCubeWithIdx(cc.v2(i, j));
//             }
//         }
//
//         this.createMovingCube();
//         this.nextNum = this.createRandNum();
//         this.uiMgr.setNextNum(this.nextNum);
//
//         Common.isPauseGame = false;
//     },
//
//
//     stopGamePlay(){
//     },
//
//     cleanUpGameArea(){
//
//         for (let i = 1; i < GridNum.x + 1; i++) {
//             for (let j = 1; j < GridNum.y + 1; j++) {
//                 this.removeCubeWithIdx(cc.v2(i, j));
//             }
//         }
//
//         this.movingCube = null;
//     },
//
//     /**
//      * 创建下一个随机数字
//      */
//     createRandNum(){
//         // let rand = Math.ceil(Math.random()*11);
//         let rand = Math.ceil(Math.random()*5)
//         return Math.pow(2, rand);
//     },
//
//
//     /**
//      * 创建随机方块
//      */
//     createMovingCube(){
//
//         this.movingCube = this.objMgr.createCube(this.nextNum);
//         this.movingCube.getComponent("CubeComponent").isTarget = true;
//
//         this.gameArea.addChild(this.movingCube);
//
//         let idx = cc.v2(3, 8);
//         let pos = this.convertIdxToPos(idx);
//         this.movingCube.setPosition(pos);
//
//         this.comboCount = 0;
//
//
//         this.gameState = Common.GameState.Ready_Cube;
//         this.moveDownDelayTime = MoveDownDelayTimeMax;
//
//         // if (this.checkDownCollision()) {
//         //     this.gameState = Common.GameState.Eliminate_Cube;
//         //     this.cubeList[idx.x][idx.y] = this.movingCube;
//
//         //     this.checkSettleElimination(idx);
//         // }
//     },
//
//
//     /**
//      * 向下检测碰撞
//      */
//     checkDownCollision(){
//         let cubeIdx = this.converPosToIdx(this.movingCube.getPosition());
//
//         if (cubeIdx.y > 1) {
//             if (this.cubeList[cubeIdx.x][cubeIdx.y - 1] != null) {
//                 return true;
//             }
//
//         }else{
//             return true;
//         }
//
//         return false;
//
//     },
//
//
//     /**
//      * 向左检查碰撞
//      */
//     checkLeftCollision(){
//         let pos = this.movingCube.getPosition();
//         let cubeIdx = this.converPosToIdx(pos);
//
//         if (cubeIdx.x > 1) {
//             if (this.cubeList[cubeIdx.x - 1][cubeIdx.y] != null)
//             {
//                 return true;
//
//             }else if(this.cubeList[cubeIdx.x - 1][cubeIdx.y - 1] != null){//pos.y < this.convertIdxToPos(cubeIdx).y &&
//                 return true;
//             }
//             else{
//                 return false;
//             }
//
//         }
//
//
//
//     },
//
//     /**
//      * 向右检查碰撞
//      */
//     checkRightCollision(){
//         let pos = this.movingCube.getPosition();
//         let cubeIdx = this.converPosToIdx(pos);
//
//         if (cubeIdx.x < 5) {
//             if (this.cubeList[cubeIdx.x + 1][cubeIdx.y] != null) {
//                 return true;
//             }else if (this.cubeList[cubeIdx.x + 1][cubeIdx.y - 1] != null) {//pos.y < this.convertIdxToPos(cubeIdx).y &&
//                 return true;
//             }
//             else{
//                 return false;
//             }
//         }
//     },
//
//
//     /**
//      * 检查消除
//      * @param {*格子系数(x,y)} idx
//      */
//     checkElimination(idx){
//         let cube = this.cubeList[idx.x][idx.y];
//         let cubeComp = cube.getComponent("CubeComponent");
//         let num = cubeComp.number;
//
//         if (cubeComp.isLock) {
//             return false;
//         }
//
//         if (idx.y > 1) {
//             //check down
//             let cube = this.cubeList[idx.x][idx.y - 1];
//             if (cube != null) {
//                 let comp = cube.getComponent("CubeComponent");
//                 if(!comp.isLock && !comp.isTarget){
//
//                     if (cubeComp.isAll && cubeComp.number == 0) {
//                         cubeComp.number = comp.number;
//                         num = cubeComp.number;
//                     }
//
//                     if (comp.number == cubeComp.number) {
//                         //eliminate
//                         num += comp.number;
//
//                         let callback = cc.callFunc(function(){
//                             this.removeCubeWithIdx(cc.v2(idx.x, idx.y - 1));
//                         }, this);
//
//                         cube.runAction(cc.sequence(cc.moveBy(GatherCubeDuration, 0, GridSize.y), callback));
//                         comp.isLock = true;
//                         // cubeComp.isLock = false;
//                     }
//                 }
//             }
//         }
//
//         if (idx.x > 1) {
//             //check left
//             let cube = this.cubeList[idx.x - 1][idx.y];
//             if (cube != null) {
//                 let comp = cube.getComponent("CubeComponent");
//
//                 if(!comp.isLock && !comp.isTarget){
//                     if (cubeComp.isAll && cubeComp.number == 0) {
//                         cubeComp.number = comp.number;
//                         num = cubeComp.number;
//                     }
//
//                     if(comp.number == cubeComp.number){
//                         //eliminate
//                         num += comp.number;
//                         if (cubeComp.isAll && cubeComp.number == 0) {
//                             cubeComp.number = comp.number;
//                         }
//
//                         let callback = cc.callFunc(function(){
//                             this.removeCubeWithIdx(cc.v2(idx.x - 1, idx.y));
//                         }, this);
//
//                         cube.runAction(cc.sequence(cc.moveBy(GatherCubeDuration, GridSize.x, 0), callback));
//                         comp.isLock = true;
//                         // cubeComp.isLock = false;
//                     }
//                 }
//
//             }
//         }
//
//         if (idx.x < GridNum.x) {
//             //check right
//             let cube = this.cubeList[idx.x + 1][idx.y];
//             if (cube != null) {
//                 let comp = cube.getComponent("CubeComponent");
//
//                 if(!comp.isLock && !comp.isTarget){
//                     if (cubeComp.isAll && cubeComp.number == 0) {
//                         cubeComp.number = comp.number;
//                         num = cubeComp.number;
//                     }
//
//                     if (comp.number == cubeComp.number) {
//                         //eliminate
//                         num += comp.number;
//                         let callback = cc.callFunc(function(){
//                             this.removeCubeWithIdx(cc.v2(idx.x + 1, idx.y));
//                         }, this);
//
//                         cube.runAction(cc.sequence(cc.moveBy(GatherCubeDuration, 0 - GridSize.x, 0), callback));
//                         comp.isLock = true;
//                         // cubeComp.isLock = false;
//
//                     }
//
//                 }
//             }
//         }
//
//         if (idx.y < GridNum.y) {
//             //check up
//             let cube = this.cubeList[idx.x][idx.y + 1];
//             if (cube != null) {
//                 let comp = cube.getComponent("CubeComponent");
//
//                 if(!comp.isLock && !comp.isTarget){
//                     if (cubeComp.isAll && cubeComp.number == 0) {
//                         cubeComp.number = comp.number;
//                         num = cubeComp.number;
//                     }
//
//                     if (comp.number == cubeComp.number) {
//                         //eliminate
//                         num += comp.number;
//
//                         let callback = cc.callFunc(function(){
//                             this.removeCubeWithIdx(cc.v2(idx.x, idx.y + 1));
//                         }, this);
//
//                         cube.runAction(cc.sequence(cc.moveBy(GatherCubeDuration, 0, 0 - GridSize.y), callback));
//                         comp.isLock = true;
//                         // cubeComp.isLock = false;
//
//                     }
//                 }
//             }
//         }
//
//         //final combination
//         if (cubeComp.number < num) {
//
//             this.comboCount++;
//             this.uiMgr.showComboTips(this.comboCount);
//
//             if (num > 3*cubeComp.number) {
//                 num = 8*cubeComp.number;
//             }else if (num > 2*cubeComp.number) {
//                 num = 4*cubeComp.number;
//             }
//             else{
//                 num = 2*cubeComp.number;
//             }
//
//             let finished = cc.callFunc(function(){
//                 cubeComp.setNum(num);
//
//                 if (num > this.maxNum) {
//                     this.maxNum = num;
//                 }
//
//                 this.setCurScore(Common.curScore + num);
//             }, this);
//
//             cube.runAction(cc.sequence(cc.delayTime(GatherCubeDuration), cc.scaleTo(ScaleCubeDuration/2, 0.1), cc.scaleTo(ScaleCubeDuration/2, 1.0), finished));
//
//             let clip = this.aud
//
//             Common.playAudioEffect(Common.AudioEffectID.EliminateCube, false);
//
//             return true;
//
//
//         }else{
//
//             return false;
//         }
//
//     },
//
//
//     /**
//      * 全盘消除检查
//      */
//     checkAllElimination(){
//
//         let ret = false;
//
//         for (let i = 1; i < GridNum.x; i++) {
//             for (let j = 1; j < GridNum.y; j++) {
//                 let cube = this.cubeList[i][j];
//                 if (cube != null) {
//                     let isLock = cube.getComponent("CubeComponent").isLock;
//                     let isEliminate = this.checkElimination(cc.v2(i, j));
//                     if (!isLock && isEliminate) {
//                         ret = true;
//                     }
//                 }
//             }
//         }
//
//         return ret;
//     },
//
//
//     /**
//      * 整理
//      */
//     makeUpGameArea(){
//         let isChange = false;
//
//         for (let i = 1; i < GridNum.x + 1; i++) {
//             for (let j = 1; j < GridNum.y + 1; j++) {
//                 let cube = this.cubeList[i][j];
//
//                 if (cube == null) {
//                     for (let k = j + 1; k < GridNum.y + 1; k++) {
//                         let upCube = this.cubeList[i][k];
//
//                         if (upCube != null) {
//                             let callback = cc.callFunc(function(){
//                                 this.cubeList[i][k - 1] = upCube;
//                             }, this);
//
//                             this.cubeList[i][k] = null;
//                             console.log('i '+ i +' k'+k  );
//
//                             upCube.runAction(cc.sequence(cc.moveBy(0.2, 0, 0 - GridSize.y), callback));
//
//                             isChange = true;
//                         }else{
//                             break;
//                         }
//
//                     }
//
//                     break;
//                 }
//
//             }
//
//         }
//
//
//
//         if (isChange) {
//             let finished = cc.callFunc(function(){
//                 //其他消除
//                 if (this.checkAllElimination()) {
//
//                     let finished = cc.callFunc(function(){
//                         this.makeUpGameArea();
//
//                     }, this);
//
//                     this.node.stopAllActions();
//
//                     this.node.runAction(cc.sequence(cc.delayTime(0.7), finished));
//                 }else{
//                     this.makeUpGameArea();
//                 }
//
//             }, this);
//
//             this.node.runAction(cc.sequence(cc.delayTime(0.3), finished));
//         }else{
//             for (let i = 1; i < GridNum.x + 1; i++) {
//                 for (let j = 1; j < GridNum.y + 1; j++) {
//                     let cube = this.cubeList[i][j];
//
//                     if (cube != null) {
//                         if (cube.getComponent("CubeComponent").isTarget) {
//                             this.checkSettleElimination(cc.v2(i, j));
//                         }
//                     }
//
//                 }
//             }
//         }
//
//
//     },
//
//
//     /**
//      * 最后稳定时检查最后一个方块，一般是movingCube
//      * @param {*格子系数} idx
//      */
//     checkSettleElimination(idx){
//
//         if(this.checkElimination(idx)){
//
//             let finished = cc.callFunc(function(){
//                 this.makeUpGameArea();
//             }, this);
//
//             this.node.runAction(cc.sequence(cc.delayTime(0.7), finished));
//         }else{
//             if (idx.y == GridNum.y) {
//
//
//                 //复活界面
//                 Common.isPauseGame = true;
//                 Common.isDialogDisplay = true;
//
//                 // let callback = cc.callFunc(function(){
//
//                 this.uiMgr.showDlg("GameOver", cc.v2(0, 100));
//
//                 // }, this);
//
//                 // this.node.runAction(cc.sequence(cc.delayTime(0.8), callback));
//
//             }else{
//                 let cube = this.cubeList[idx.x][idx.y];
//                 let cubeComp = cube.getComponent("CubeComponent");
//                 cubeComp.isTarget = false;
//
//                 if (cubeComp.isAll && cubeComp.number == 0) {
//                     cubeComp.setNum(this.createRandNum());
//                 }
//
//                 if (cubeComp.number > this.maxNum) {
//                     this.maxNum = cubeComp.number;
//                 }
//
//                 this.createMovingCube();
//                 this.nextNum = this.createRandNum();
//                 this.uiMgr.setNextNum(this.nextNum);
//             }
//         }
//
//
//
//         // for (let i = 1; i < GridNum.x + 1; i++) {
//         //     for (let j = 1; j < GridNum.y + 1; j++) {
//         //         let cube = this.cubeList[i][j];
//
//         //         if (cube != null && cube.getComponent("CubeComponent").number == this.maxNum) {
//         //             this.removeCubeWithIdx(cc.v2(i, j));
//         //         }
//
//         //     }
//
//         // } var i = 32;"Home", ()=>{
//         //         Common.playAudioEffect(Common.AudioEffectID.ClickBtn, false);
//
//         //         Common.getDlgMgr().removeAllDlgs();
//         //         cc.director.loadScene("StartScene");
//         //     },
//
//         if ( this.maxNum == cgr || this.maxNum == cgr * 2) {
//             Common.isPauseGame = true;
//             // let callback = cc.callFunc(function(){
//
//             this.uiMgr.showDlg("Congrat", cc.v2(0, 100));
//             Common.isDialogDisplay = true;
//
//             // }, this);
//             // this.node.runAction(cc.sequence(cc.delayTime(0), callback));
//             cgr = this.maxNum * 2;
//
//         }
//
//
//     },
//
//
//     //  show dialog congrat ưhen appear 1024 cube
//
//     /**
//      * 删除对应格子内的Cube
//      * @param {*格子系数(x,y)} idx
//      */
//     removeCubeWithIdx(idx){
//         let cube = this.cubeList[idx.x][idx.y];
//
//         if (cube != null) {
//             cube.getComponent("CubeComponent").removeCube();
//         }
//
//         this.cubeList[idx.x][idx.y] = null;
//     },
//
//     /**
//      * 格子系数转化为坐标
//      * @param {*格子系数(x,y)} idx
//      */
//     convertIdxToPos(idx){
//         let x = (idx.x - 0.5)*GridSize.x;
//         let y = (idx.y - 0.5)*GridSize.y;
//
//         return cc.v2(x, y);
//     },
//
//
//     /**
//      * 坐标转化为格子系数
//      * @param {*坐标} pos
//      */
//     converPosToIdx(pos){
//         let x = Math.ceil(pos.x/GridSize.x);
//         let y = Math.ceil(pos.y/GridSize.y);
//
//         return cc.v2(x, y);
//     },
//
//     //UI回调
//     //下回合出现一个万能数字
//     onSkillBtn1(event){
//
//         Common.playAudioEffect(Common.AudioEffectID.ClickBtn, false);
//
//         let toolCount = Common.toolBagData[Common.ToolType.Tool_1];
//
//         if (toolCount >= 1) {
//
//             Common.setToolBagData(Common.ToolType.Tool_1, toolCount - 1);
//
//             let btnComp = event.target.getComponent("ToolBtn");
//             if (btnComp != null) {
//                 btnComp.count.string = toolCount - 1;
//             }
//
//             //道具效果
//             this.nextNum = 0;
//             this.uiMgr.setNextNum(0);
//
//         }else{
//
//             if (cc.sys.platform == cc.sys.QQ_PLAY) {
//                 this.showAdMoneyDlg();
//             }else if(cc.sys.platform == cc.sys.WECHAT_GAME){
//                 Common.getDlgMgr().showComboTips("Not Enough Golds!");
//             }else{
//                 Common.getDlgMgr().showComboTips("Not Enough Golds!");
//             }
//         }
//     },
//
//     // //消除最下层的数字
//     // onSkillBtn2(event){
//
//     //     Common.playAudioEffect(Common.AudioEffectID.ClickBtn, false);
//
//     //     let toolCount = Common.toolBagData[Common.ToolType.Tool_2];
//
//     //     if (toolCount >= 1) {
//
//     //         Common.setToolBagData(Common.ToolType.Tool_2, toolCount - 1);
//
//     //         let btnComp = event.target.getComponent("ToolBtn");
//     //         if (btnComp != null) {
//     //             btnComp.count.string = toolCount - 1;
//     //         }
//
//     //         //道具效果
//     //         for (let i = 1; i < GridNum.x + 1; i++) {
//     //             this.removeCubeWithIdx(cc.v2(i, 1));
//     //         }
//
//     //         this.makeUpGameArea();
//
//     //     }else{
//     //         this.showAdMoneyDlg();
//     //     }
//
//     // },
//
//     //暂停数字自动下落，持续三个回合
//     onSkillBtn3(event){
//         Common.playAudioEffect(Common.AudioEffectID.ClickBtn, false);
//
//         let toolCount = Common.toolBagData[Common.ToolType.Tool_3];
//
//         if (toolCount >= 1) {
//
//             Common.setToolBagData(Common.ToolType.Tool_3, toolCount - 1);
//
//             let btnComp = event.target.getComponent("ToolBtn");
//             if (btnComp != null) {
//                 btnComp.count.string = toolCount - 1;
//             }
//
//             //道具效果
//             Common.playAudioEffect(Common.AudioEffectID.ClickBtn, false);
//
//             if (this.movingCube != null) {
//                 this.movingCube.getComponent("CubeComponent").downSpeed = 0;
//             }
//
//         }else{
//             this.showAdMoneyDlg();
//         }
//
//     },
//
//     //消除屏幕中数字最大的方块
//     removeMaxCube(){
//
//         for (let i = 1; i < GridNum.x + 1; i++) {
//             for (let j = 1; j < GridNum.y + 1; j++) {
//                 let cube = this.cubeList[i][j];
//
//                 if (cube != null && cube.getComponent("CubeComponent").number == this.maxNum) {
//                     this.removeCubeWithIdx(cc.v2(i, j));
//                 }
//
//             }
//
//         }
//
//         let num = 0;
//
//         for (let i = 1; i < GridNum.x + 1; i++) {
//             for (let j = 1; j < GridNum.y + 1; j++) {
//                 let cube = this.cubeList[i][j];
//
//                 if (cube != null && cube.getComponent("CubeComponent").number > num) {
//                     num = cube.getComponent("CubeComponent").number;
//                 }
//
//             }
//         }
//
//         this.maxNum = num;
//
//         this.makeUpGameArea();
//
//     },
//
//     onSkillBtn4(event){
//         Common.playAudioEffect(Common.AudioEffectID.ClickBtn, false);
//
//         let toolCount = Common.toolBagData[Common.ToolType.Tool_4];
//
//         if (toolCount >= 1) {
//
//             Common.setToolBagData(Common.ToolType.Tool_4, toolCount - 1);
//
//             let btnComp = event.target.getComponent("ToolBtn");
//             if (btnComp != null) {
//                 btnComp.count.string = toolCount - 1;
//             }
//
//             //道具效果
//             this.removeMaxCube();
//
//         }else{
//             this.showAdMoneyDlg();
//         }
//
//     },
//
//
//     showAdMoneyDlg(){
//         Common.getDlgMgr().showCommonConfirmDlg("Not Enough Golds!\nAds to get 20 Golds",
//
//
//             "Confirm", ()=>{
//
//                 Common.stopBGM();
//
//                 Common.showAdVideo(
//                     ()=>{
//                         Common.setMoneyNum(Common.moneyNum + 20);
//                         Common.playBGM();
//                         let event = new cc.Event.EventCustom(Common.CUSTOM_EVENT.CHANGE_MONEY, true);
//                         this.node.dispatchEvent(event);
//                     },
//                     ()=>{
//                         Common.playBGM();
//                         console.log("QQplay Ad at ReviveDlg Failed");
//                     }
//                 );
//
//             },
//
//             "Cancel", ()=>{
//
//             },
//             this.uiRoot);
//     },
//
//     //暂停
//     // onPauseBtn1(){
//     //     Common.playAudioEffect(Common.AudioEffectID.ClickBtn, false);
//
//     //     Common.getDlgMgr().showCommonConfirmDlg("Continue Game?",
//     //     "Home", ()=>{
//     //         Common.playAudioEffect(Common.AudioEffectID.ClickBtn, false);
//
//     //         Common.getDlgMgr().removeAllDlgs();
//     //         cc.director.loadScene("StartScene");
//     //     },
//
//     //     "Continue", ()=>{
//     //         Common.playAudioEffect(Common.AudioEffectID.ClickBtn, false);
//     //         let event = new cc.Event.EventCustom(Common.CUSTOM_EVENT.CONTINUE_GAME, true);
//     //         this.node.dispatchEvent(event);
//     //     },
//     //     this.uiRoot);
//
//     //     this.pauseGamePlay();
//     // },
//
//     onPauseBtn(){
//
//
// // let callback = cc.callFunc(function(){
//         console.log(Common.isDialogDisplay + "dlg");
//         if (Common.isDialogDisplay == false){
//
//
//
//             this.uiMgr.showDlg("Paused", cc.v2(0, 100));
// //                 }, this);
// //                 this.node.runAction(cc.sequence(cc.delayTime(0), callback));
//             this.pauseGamePlay();
//             Common.isDialogDisplay = true;
//
//             if ( Common.isMusicOn == true  ){
//                 // btnSoundActive.active = false;
//                 PausedtestDlg.btnSoundInactive.active = false;
//                 // console.log(Common.isMusicOn + "isMusicOn");
//                 // console.log(PausedtestDlg.btnSoundInactive.active + "    Mute");
//             }else{
//                 // btnSoundActive.active = true;
//                 PausedtestDlg.btnSoundInactive.active = true;
//                 // console.log(Common.isMusicOn);
//
//             }
//
//         }
//     },
//
//
//
//     //数据更新
//     setCurScore(score){
//
//         Common.curScore = score;
//         this.uiMgr.setCurScoreLabel(Common.curScore);
//
//         if (Common.difficultyLevel < GameConfig.DifficultyConfig.length - 1
//             && Common.curScore >= GameConfig.DifficultyConfig[Common.difficultyLevel].speed) {
//
//             Common.difficultyLevel++;
//         }
//     },
//
//
// });
