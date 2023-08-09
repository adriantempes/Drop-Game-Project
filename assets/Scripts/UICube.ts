
import ObjectManager from "./ObjectManager";
import Common = require("./Common"); 
const {ccclass, property} = cc._decorator;

@ccclass
export default class UICube extends cc.Component {

    @property(cc.Label)
    numLabel: cc.Label = null;

    @property(cc.Sprite)
    cubeBg: cc.Sprite = null;

    @property(cc.Node)
    lockBg: cc.Node = null;

    @property([cc.SpriteFrame])
    cubeArray: cc.SpriteFrame[] = [];


    onLoad() {
        this.lockBg.active = true;
    }

    setLock(){
        this.lockBg.active = true;
    }

    setUnLock(){
        this.lockBg.active = false;
    }

    setNum(num) {
        switch (num) {
            case 2:
            {
                // this.node.color = cc.Color.WHITE.fromHEX("#666666");
                this.cubeBg.spriteFrame = this.cubeArray[0];
            }
                break;

            case 4:
            {
                this.cubeBg.spriteFrame = this.cubeArray[1];
            }
                break;

            case 8:
            {
                this.cubeBg.spriteFrame = this.cubeArray[2];
            }
                break;

            case 16:
            {
                this.cubeBg.spriteFrame = this.cubeArray[3];
            }
                break;

            case 32:
            {
                this.cubeBg.spriteFrame = this.cubeArray[4];
            }
                break;

            case 64:
            {
                this.cubeBg.spriteFrame = this.cubeArray[5];
            }
                break;

            case 128:
            {
                this.cubeBg.spriteFrame = this.cubeArray[6];
            }
                break;

            case 256:
            {
                this.cubeBg.spriteFrame = this.cubeArray[7];
            }
                break;

            case 512:
            {
                this.cubeBg.spriteFrame = this.cubeArray[8];
            }
                break;

            case 1024:
            {
                this.cubeBg.spriteFrame = this.cubeArray[8];
            }
                break;

            case 2048:
            {
                this.cubeBg.spriteFrame = this.cubeArray[9];
            }
                break;

            case 4096:
            {
                this.cubeBg.spriteFrame = this.cubeArray[10];
            }
                break;

            case 8192:
            {
                this.cubeBg.spriteFrame = this.cubeArray[11];
            }
                break;

            default:
                break;
        }
    }
}
