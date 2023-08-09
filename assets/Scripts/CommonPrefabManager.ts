const {ccclass, property} = cc._decorator;

@ccclass
export default class CommonPrefabManager extends cc.Component {

    @property([cc.AudioClip])
    audioUrlPrefabList = []

    @property(cc.AudioClip)
    bgmUrlPrefab = null

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    }

    // update (dt) {},
}
