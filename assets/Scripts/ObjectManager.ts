const {ccclass, property} = cc._decorator;

@ccclass
export default class ObjectManager extends cc.Component {

    @property(cc.Prefab)
    cubePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    blockPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    targetPrefab: cc.Prefab = null;

    cubePool: cc.NodePool = null;

    blockPool: cc.NodePool = null;

    targetPool: cc.NodePool = null;


    onLoad() {
        this.cubePool = new cc.NodePool("CubeComponent");
        let cubeInitCount = 5;
        for (let i = 0; i < cubeInitCount; i++) {
            let cube = cc.instantiate(this.cubePrefab);
            this.cubePool.put(cube);
        }
        this.blockPool = new cc.NodePool("BlockedComponent");
        let blockInitCount = 1;
        for (let i = 0; i < blockInitCount; i++) {
            let cube = cc.instantiate(this.blockPrefab);
            this.blockPool.put(cube);
        }

        this.targetPool = new cc.NodePool("BlockedComponent");
        for (let i = 0; i < blockInitCount; i++) {
            let cube = cc.instantiate(this.targetPrefab);
            this.targetPool.put(cube);
        }
    }

    start() {

    }

    onClear(){
        this.cubePool.clear();
        this.blockPool.clear();
        this.targetPool.clear();
    }

    onDestroy() {
        this.cubePool.clear();
        this.blockPool.clear();
        this.targetPool.clear();
    }

    createCube(num) {
        let cube = null;
        if (this.cubePool.size() > 0) {
            cube = this.cubePool.get(this);
        } else {
            cube = cc.instantiate(this.cubePrefab);
        }
        cube.getComponent("CubeComponent").reuse(this);

        cube.getComponent("CubeComponent").setNum(num);

        return cube;
    }

    createBlockAnim(position) {
        let block = null;
        if (this.blockPool.size() > 0) {
            block = this.blockPool.get(this);
        } else {
            block = cc.instantiate(this.blockPrefab);
        }
        block.getComponent("BlockedComponent").reuse(this);
        block.position = position;
        return block;
    }

    createTarget(position) {
        let target = null;
        if (this.targetPool.size() > 0) {
            target = this.targetPool.get(this);
        } else {
            target = cc.instantiate(this.targetPrefab);
        }
        target.getComponent("TargetComponent").reuse(this);
        target.position = position;
        return target;
    }
}
