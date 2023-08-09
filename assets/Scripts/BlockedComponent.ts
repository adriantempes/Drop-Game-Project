import ObjectManager from "./ObjectManager";

const {ccclass, property} = cc._decorator;


@ccclass
export default class BlockedComponent extends cc.Component {

    @property(cc.Node)
    blockNode: cc.Node = null;

    objMgr: ObjectManager = null;


    onLoad() {
    }

    onEnable() {
    }

    start() {

    }

    update(dt) {

    }

    reuse(objMgr) {
        this.objMgr = objMgr;
        this.node.stopAllActions();
        this.node.setScale(1, 1);
    }

    unuse() {
        //recycle to cubePool
        this.objMgr = null;
    }

    removeBlock() {
        this.objMgr.blockPool.put(this.node);
    }
}
