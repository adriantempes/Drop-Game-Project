import ObjectManager from "./ObjectManager";
import {TypeBlock} from "./GlobalConfig";
import Common from "./Common";

const {ccclass, property} = cc._decorator;


@ccclass
export default class CubeComponent extends cc.Component {

    @property(cc.Node)
    numNode: cc.Node = null;

    @property(cc.Node)
    blockNode: cc.Node = null;
    @property(cc.Node)
    block : cc.Node = null;
    //hello cac ban

    @property([cc.SpriteFrame])
    cubeArray: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    lockArray: cc.SpriteFrame[] = [];

    //Default FALSE, = TRUE when merging with other blocks
    isLock: boolean = false;
    objMgr: ObjectManager = null;
    isSpeedUp: boolean;
    downSpeed: number;
    number: number;
    downDis: number;

    index: number;
    typeCube: TypeBlock = TypeBlock.Normal;


    onLoad() {
        // this.objMgr = this.node.getComponent("ObjectManager");
    }

    onEnable() {
        // this.setNum(0);
        // this.gatherCube();
    }

    start() {

    }

    update(dt) {

    }

    reuse(objMgr) {
        this.objMgr = objMgr;
        this.downDis = 0;
        this.downSpeed = Common.DifficultyConfig[Common.difficultyLevel].speed;
        this.isLock = false;  // TRUE if block is merging, can't do anything
        this.isSpeedUp = false;
        this.node.stopAllActions();
        this.node.setScale(1, 1);
    }

    unuse() {
        //recycle to cubePool
        this.objMgr = null;
    }

    removeCube() {
        this.blockNode.active = false;
        this.objMgr.cubePool.put(this.node);
    }

    setIsSpeedUp(isSpeedUp, speed = Common.DifficultyConfig[Common.difficultyLevel].speed) {
        this.isSpeedUp = isSpeedUp;
        if (this.isSpeedUp) {
            this.downSpeed = speed;
            console.log("speed1" + this.downSpeed)
        }
    }

    gatherCube() {

    }

    setNumPre(idx, num, value) {
        if (num == 50) {
            this.blockNode.active = true;
            this.setNum(value, idx)
        } else if (num == 10) {
            this.blockNode.active = false;
            this.setNum(value, idx)
        } else {
            this.setNum(num, idx)
            this.blockNode.active = false;
        }
        this.setTypeCube(num);
    }

    setX2Value() {
        this.number *= 2;
        let cubeSprite = this.node.getComponent(cc.Sprite);
        let num = this.number;
        switch (num) {
            case 2: {
                // this.node.color = cc.Color.WHITE.fromHEX("#666666");
                cubeSprite.spriteFrame = this.cubeArray[0];
            }
                break;
            case 4: {
                cubeSprite.spriteFrame = this.cubeArray[1];
            }
                break;
            case 8: {
                cubeSprite.spriteFrame = this.cubeArray[2];
            }
                break;
            case 16: {
                cubeSprite.spriteFrame = this.cubeArray[3];
            }
                break;
            case 32: {
                cubeSprite.spriteFrame = this.cubeArray[4];
            }
                break;
            case 64: {
                cubeSprite.spriteFrame = this.cubeArray[5];
            }
                break;
            case 128: {
                cubeSprite.spriteFrame = this.cubeArray[6];
            }
                break;
            case 256: {
                cubeSprite.spriteFrame = this.cubeArray[7];
            }
                break;
            case 512: {
                cubeSprite.spriteFrame = this.cubeArray[8];
            }
                break;
            case 1024: {
                cubeSprite.spriteFrame = this.cubeArray[9];
            }
                break;
            case 2048: {
                cubeSprite.spriteFrame = this.cubeArray[10];
            }
                break;
            case 4096: {
                cubeSprite.spriteFrame = this.cubeArray[11];
            }
                break;
            case 8192: {
                cubeSprite.spriteFrame = this.cubeArray[12];
            }
                break;
            case 16384: {
                cubeSprite.spriteFrame = this.cubeArray[13];
            }
                break;
            case 32768: {
                cubeSprite.spriteFrame = this.cubeArray[14];
            }
                break;
            case 65536: {
                cubeSprite.spriteFrame = this.cubeArray[15];
            }
                break;
            case 99: {
                cubeSprite.spriteFrame = this.lockArray[0];
            }
                break;
            case -1: {
                cubeSprite.spriteFrame = this.cubeArray[16];
            }
                break;
            default:
                break;
        }
    }

    setNum(num, idx) {
        this.number = num;
        this.index = idx;
        if (num != 99) {
            //this.numNode.getComponent(cc.Label).string = num;
        }
        let cubeSprite = this.node.getComponent(cc.Sprite);
        switch (num) {
            case 2: {
                // this.node.color = cc.Color.WHITE.fromHEX("#666666");
                cubeSprite.spriteFrame = this.cubeArray[0];
            }
                break;
            case 4: {
                cubeSprite.spriteFrame = this.cubeArray[1];
            }
                break;
            case 8: {
                cubeSprite.spriteFrame = this.cubeArray[2];
            }
                break;
            case 16: {
                cubeSprite.spriteFrame = this.cubeArray[3];
            }
                break;
            case 32: {
                cubeSprite.spriteFrame = this.cubeArray[4];
            }
                break;
            case 64: {
                cubeSprite.spriteFrame = this.cubeArray[5];
            }
                break;
            case 128: {
                cubeSprite.spriteFrame = this.cubeArray[6];
            }
                break;
            case 256: {
                cubeSprite.spriteFrame = this.cubeArray[7];
            }
                break;
            case 512: {
                cubeSprite.spriteFrame = this.cubeArray[8];
            }
                break;
            case 1024: {
                cubeSprite.spriteFrame = this.cubeArray[9];
            }
                break;
            case 2048: {
                cubeSprite.spriteFrame = this.cubeArray[10];
            }
                break;
            case 4096: {
                cubeSprite.spriteFrame = this.cubeArray[11];
            }
                break;
            case 8192: {
                cubeSprite.spriteFrame = this.cubeArray[12];
            }
                break;
            case 16384: {
                cubeSprite.spriteFrame = this.cubeArray[13];
            }
                break;
            case 32768: {
                cubeSprite.spriteFrame = this.cubeArray[14];
            }
                break;
            case 65536: {
                cubeSprite.spriteFrame = this.cubeArray[15];
            }
                break;
            case 99: {
                cubeSprite.spriteFrame = this.lockArray[0];
            }
                break;
            case -1: {
                cubeSprite.spriteFrame = this.cubeArray[16];
            }
                break;
            default:
                break;
        }
        this.setTypeCube(num);
    }

    setTypeCube(num) {
        if (num == 99) {
            this.typeCube = TypeBlock.Stone;
        } else if (num == 50) {
            this.typeCube = TypeBlock.Block;
        } else if (num == 10) {
            this.typeCube = TypeBlock.Target;
        } else {
            this.typeCube = TypeBlock.Normal;
        }
    }

    getDownSpeed() {
        return this.downSpeed;
    }

    getIdx() {
        return this.index;
    }

    setIdx(idx) {
        this.index = idx;
    }


    // update (dt) {}
}
