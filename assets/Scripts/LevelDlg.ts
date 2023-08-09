import GlobalData = require("./global/GlobalData");
import LevelItem from "./level/LevelItem";
import StartScreenManager from "./StartScreenManager";
import Common, {AudioEffectID} from "./Common";

const {ccclass, property} = cc._decorator;
var PageItemCount = 15;

@ccclass
export default class LevelDlg extends cc.Component {
    @property(cc.Node)
    levelBoard: cc.Node = null;

    @property(cc.Button)
    btnClose: cc.Button = null;

    @property(cc.Button)
    btnNext: cc.Button = null;

    @property(cc.Button)
    btnPre: cc.Button = null;

    @property(cc.Label)
    lblTotalCoin: cc.Label = null;

    levelListData: any = null;
    levelItemList = [];
    pageIdx: number;
    dataPage: number;
    maxLevel: number;
    currentPage: number;

    numberLevelUnlocked: number;
    static _ins: LevelDlg;


    static get instance(): LevelDlg {
        return this._ins || new LevelDlg;
    }


    onLoad() {
        LevelDlg._ins = this;
        this.btnNext.node.on('click', this.onBtnNext, this);
        this.btnPre.node.on('click', this.onBtnPre, this);
        this.btnClose.node.on('click', this.onBtnClose, this);
    }

    start() {
        this.loadData();
    }

    loadData(){
        this.levelItemList = this.levelBoard.children;
        // @ts-ignore
        this.levelListData = GlobalData.LevelGame;

        this.maxLevel = Object.keys(this.levelListData).length;
        // @ts-ignore
        this.dataPage = Math.ceil(this.maxLevel / PageItemCount);

        this.numberLevelUnlocked = Number(Common.getNumberLevelUnlocked());

        // @ts-ignore
        this.currentPage = Math.ceil(this.numberLevelUnlocked / PageItemCount);
        this.pageIdx = this.currentPage;
        this.lblTotalCoin.string = ": " + Common.getTotalCoin();
        this.loadLevelData(this.pageIdx);
    }

    onEnable() {
    }

    loadLevelData(pageIdx: number) {
        // @ts-ignore
        if (GlobalData.LevelGame[1] == 0) {
            return;
        }

        if (pageIdx > this.dataPage) {
            return;
        }
        this.pageIdx = pageIdx;

        for (let i = 1; i <= this.levelItemList.length; i++) {
            let item = this.levelItemList[i - 1];
            item.active = false;
            let currentIndex = (this.pageIdx - 1) * PageItemCount + i;
            if (currentIndex <= this.maxLevel) {
                let levelData = this.levelListData[currentIndex];
                item.getComponent(LevelItem).setItem(currentIndex, levelData, this.numberLevelUnlocked, function () {
                    StartScreenManager.instance.onShowScreenByName("Game");
                });
                item.active = true;
            }
        }
    }

    reloadLevelMax() {
        this.numberLevelUnlocked = Number(Common.getNumberLevelUnlocked());
        this.loadLevelData(1);
    }


    onBtnNext() {
        this.pageIdx += 1;
        if (this.pageIdx > this.dataPage) {
            this.pageIdx = this.dataPage;
        }
        this.loadLevelData(this.pageIdx);
    }

    onBtnPre() {
        this.pageIdx -= 1;
        if (this.pageIdx <= 1) {
            this.pageIdx = 1;
        }
        this.loadLevelData(this.pageIdx);
    }

    onBtnClose() {
        Common.playAudioEffect(AudioEffectID.ClickBtn, false);

        cc.director.loadScene("StartScreen");
    }
}
