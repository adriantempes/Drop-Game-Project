import ccclass = cc._decorator.ccclass;
import FBGlobal from "./FBGlobal";


class Difficulty {
    score: number;
    speed: number

    constructor(score: number, speed: number) {
        this.score = score;
        this.speed = speed;
    }
}


export enum GameState {
    None = 0,
    Run = 1,
    Eliminate_Cube = 2,
    Ready_Cube = 3,
    Drop = 4,
    Tool = 5,
    ToolActive = 6
}

//TYPE 0 x2
//TYPE 1 Clear column
//TYPE 2 Clear rơw
//道具类型
export enum ToolType {
    Tool_X2 = 0,
    Tool_Column = 1,
    Tool_Row = 2,
    Tool_4 = 3,
}

//音效ID配置
export enum AudioEffectID {
    ClickBtn = 0,
    Merge = 1,
    WinLevel = 2,
    FailLevel = 3,
    UnlockBlock = 4,
    Falling = 5,
    ClearRow = 6,
    X2 = 7,
    Breakdown = 8,
}


export enum CUSTOM_EVENT {
    PAUSE_GAME = "pauseGame",
    CONTINUE_GAME = "resumeGame",
    RESTART_GAME = "restartGame",
    STOP_GAME = "stopGame",
    REVIVE = "revive",
    CHANGE_MONEY = "changeMoney",
    TOOL_X2 = "tool_x2",
    TOOL_COLUMN = "tool_column",
    TOOL_ROW = "tool_row",
}

export enum SHOP_EVENT {
    UPDATE_COIN_DAILY = "updateCoinDaily",
    UPDATE_COIN = "updateCoin",
}

@ccclass
export default class Common {

    static gameState = 0;
    //自定义事件

    static DifficultyConfig: Difficulty[] = [
        new Difficulty(5000, 1),
        new Difficulty(10000, 2),
        new Difficulty(20000, 3),
        new Difficulty(30000, 4)
    ];

//背包道具数据
    static toolBagData = [
        5,
        5,
        5,
        5,
    ];


    static curScore: 0;
    static difficultyLevel = 0;
    static isPauseGame = false;
    static isMusicOn = true;
    static isDlgDisplay = false;
    static bestScore = 1;
    static moneyNum = 200;

    static savePlayerData() {
        let data = {
            bestScore: this.bestScore,
            // moneyNum: this.moneyNum,
            toolBagData: this.toolBagData,
        };

        let dataString = JSON.stringify(data);
        console.log("2048Cube_PlayerData-savePlayerData:" + dataString);

        cc.sys.localStorage.setItem("2048Cube_PlayerData", dataString);
        //Save to facebook
        FBGlobal.instance.saveFBData(data);
    };

    static overrideLocal() {
        let data = {
            bestScore: this.bestScore,
            // moneyNum: this.moneyNum,
            toolBagData: this.toolBagData,
        };
        let dataString = JSON.stringify(data);
        console.log("2048Cube_PlayerData-savePlayerData:" + dataString);
        cc.sys.localStorage.setItem("2048Cube_PlayerData", dataString);
    };

    /**
     * 加载用户数据
     */
    static loadPlayerData() {

        let dataString = null;

        dataString = cc.sys.localStorage.getItem("2048Cube_PlayerData");
        this.initPlayerData(dataString);
        // callback();
    };


    /**
     * 初始化玩家数据
     * @param {*数据} dataString
     */
    static initPlayerData(dataString) {
        if (dataString != null && dataString != "{}" && typeof (dataString) == "string" && dataString.length > 0) {
            console.log("2048Cube_PlayerData-loadPlayerData:" + dataString);

            let data = JSON.parse(dataString);

            let bestScore = data.bestScore;
            if (bestScore != null && bestScore >= 1) {
                this.bestScore = bestScore;
            } else {
                this.bestScore = 1;
            }
        } else {
            console.log("2048Cube_PlayerData-loadPlayerData-NoDataReset");
            this.resetPlayerData();
        }
    };

    static resetPlayerData() {
        this.bestScore = 1;
        this.moneyNum = 200;

        for (let i = 0; i < 4; i++) {
            this.toolBagData[i] = 5;
        }

        this.savePlayerData();
    }


    static setBestScore(score) {
        this.bestScore = score;
        console.log("BUG: luu lai storage num la" + score);
        cc.sys.localStorage.setItem('numberLevelUnlocked', score);
        this.savePlayerData();
    }


    static getDlgMgr() {
        let mgr = cc.find("DontDestroyNode").getComponent("DialogManager");
        return mgr;
    }

    /**
     *
     * @param {*音效序号} soundID
     * @param {*是否循环播放} loop
     */
    static playAudioEffect(soundID, loop) {
        if (!this.isMusicOn) return;

        let commonPrefabMgr = cc.find("DontDestroyNode").getComponent("CommonPrefabManager");

        let clip = commonPrefabMgr.audioUrlPrefabList[soundID];

        // cc.audioEngine.play(clip, loop, this.SoundVolumeConfig[soundID]);

        cc.audioEngine.playEffect(clip, loop);
    }

    /**
     * 播放背景音乐
     */
    static secondsToDhms(seconds) {
        seconds = Number(seconds);
        var d = Math.floor(seconds / (3600 * 24));
        var h = Math.floor(seconds % (3600 * 24) / 3600);
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 60);
        var ss = Math.floor(seconds * 10000);
        var mDisplay = m > 0 ? m + ":" : "0:";
        var sDisplay = s > 0 ? s >= 10 ? s : "0" + s : "00";
        return mDisplay + sDisplay;
    }


    static playBGM() {
        if (!this.isMusicOn) return;
        let commonPrefabMgr = cc.find("DontDestroyNode").getComponent("CommonPrefabManager");
        let clip = commonPrefabMgr.bgmUrlPrefab;
        cc.audioEngine.playMusic(clip, true)
        cc.audioEngine.setMusicVolume(0.3);
    }

    static stopBGM() {
        cc.audioEngine.stopMusic();

    }

    static pauseBGM() {
        cc.audioEngine.pauseMusic();

    }

    static resumeBGM() {
        cc.audioEngine.resumeMusic();
    }

    /**
     * 播放背景音乐
     */
    static getNumResource(num) {
        let name = "default"
        return "newBlock/default/" + name + "_" + num;
    }

    static getNumberLevelUnlocked() {
        //return 300;
        //let numberUnlocked = cc.sys.localStorage.getItem('numberLevelUnlocked');
        //console.log("BUG: get ra storage num la" + numberUnlocked);
        if (this.bestScore != 0) {
            return this.bestScore;
        } else {
            return 1;
        }
    }

    static addMoreCoin(num) {
        let currentCoin = Number(cc.sys.localStorage.getItem('numberTotalCoin')) + num;
        cc.sys.localStorage.setItem('numberTotalCoin', currentCoin);
    }

    static getTotalCoin() {
        let number = cc.sys.localStorage.getItem('numberTotalCoin');
        if (number) {
            return number;
        } else {
            return 0;
        }
    }

    static setDailyDate(date) {
        cc.sys.localStorage.setItem('dateRewardDaily', date.toString());
    }

    static getDateDaily() {
        let date = cc.sys.localStorage.getItem('dateRewardDaily');
        if (date) {
            return date;
        } else {
            return "";
        }
    }

    static getDefaultCdn() {
        return [2, 4, 8, 16, 32];
    }

    /**
     * 设置背包道具数据
     * @param {*道具类型} toolType
     * @param {*数量} count
     */
    static setToolBagData(toolType, count) {
        this.toolBagData[toolType] = count;

        this.savePlayerData();
    }

    start_game_time: null;
}

