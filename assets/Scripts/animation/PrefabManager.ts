
export default class PrefabManager {
    /**植物 */
    mLoadedPlants;
    mLoadedZombies;
    mLoadedEffects;
    mLoadedPrefabs;
    /**花盆 */
    mLoadedFlowerPots;
    _ownPlantIDs;

    constructor() {
        this.mLoadedPlants = {};
        this.mLoadedZombies = {};
        this.mLoadedEffects = {};
        this.mLoadedPrefabs = {};
        this.mLoadedFlowerPots = {};
        // for (let k = 1; k <= 60; k++) {
        //     let sPlantName = DB_plantName.getPlantName(k);
        //     Utils.LoadGetBullet(sPlantName);
        // }
    }

    private static instance: PrefabManager = null;
    public static get Instance(): PrefabManager {
        if (PrefabManager.instance == null) {
            PrefabManager.instance = new PrefabManager();
        }
        return PrefabManager.instance;
    }


    CreateEffect(effName): cc.Node {
        let pfbEff = this.mLoadedEffects[effName];
        return pfbEff && cc.instantiate(pfbEff);
    }


    _isLoading: boolean = false;
    safeLoadRes(url: string, type: typeof cc.Asset, completeCallback: (resource: any) => void) {
        let self = this;
        this._isLoading = true;
        cc.resources.load(url, type, (err, res) => {
            self._isLoading = false;
            if (err) {
                console.log("url " + url);
                console.log("err " + err)
                setTimeout(() => {
                    self.safeLoadRes(url, type, completeCallback)
                }, 0.5);
            } else {
                if (completeCallback) {
                    completeCallback(res);
                }
            }
        });
    }

    safeLoadDir() {

    }
    LoadEffect(effName): Promise<cc.Prefab> {
        let self = this;
        let url = "Prefab/Effect/" + effName;
        return new Promise((c, e) => {
            self.safeLoadRes(url, cc.Prefab, (pfbNode) => {
                self.mLoadedEffects[effName] = pfbNode;
                c(pfbNode)
            })
        })
    }
}