import DailyRewardItem, {PrizeTypeEnum} from "./DailyRewardItem";
import GameData from "./GameData";


const {ccclass, property} = cc._decorator;

@ccclass
export default class DailyRewardScript extends cc.Component
{
    @property([DailyRewardItem])
    private rewardItemList: DailyRewardItem[] = [];
    @property(cc.Button)
    private claimButton: cc.Button = null;
    @property(cc.Node)
    private greyOverlayForClaimButton: cc.Node = null;
    @property(cc.Button)
    private claimButton_Ads: cc.Button = null;
    @property(cc.Node)
    private greyOverlayForClaimButton_Ads: cc.Node = null;
    @property(cc.Node)
    private closeButton: cc.Node = null;
    @property(cc.Label)
    private remainContentText: cc.Label = null;
    @property(cc.AudioClip)
    claimSound: cc.AudioClip = null;

    onLoad()
    {
        this.closeButton.on('click', () => {this.node.active = false;}, this);
        this.claimButton.node.on('click', this.ClaimDailyReward, this);
        this.claimButton_Ads.node.on('click', this.ShowRewardAdsForMultipleReward, this);
    }

    currentRewardItemIndex: number;
    private ClaimDailyReward()
    {
        GameData.playerData.DailyRewardLastDay = this.GetCurrentDayStringInUTC();
        GameData.playerData.CurrentDailyRewardDay++;
        this.rewardItemList[this.currentRewardItemIndex].ReceiveReward();

        this.GenerateDailyReward();

        //TODO 27
        /*FBAdapter.instance.SavePlayerData();
        SoundManager.instance.PlayEfxSound(this.claimSound);*/
    }

    private ShowRewardAdsForMultipleReward()
    {
        //TODO 27
       /* CustomEventManager.instance.node.once(CustomEventManager.instance.ShowRewardAdsSuccess, this.ClaimDailyRewardForAds, this);
        CustomEventManager.instance.node.once(CustomEventManager.instance.ShowRewardAdsFail,
            (failReason) => 
            {
                HomeMenuScript.instance.ShowWarningPopup(GameData.NormalWarningTitle, failReason.message);
            }, this);
        AdsManager.instance.RequestRewardAds(false);*/
    }
    private ClaimDailyRewardForAds()
    {
        GameData.playerData.DailyRewardLastDay = this.GetCurrentDayStringInUTC();
        GameData.playerData.CurrentDailyRewardDay++;
        this.rewardItemList[this.currentRewardItemIndex].ReceiveRewardAfterWatchingAds();
        this.GenerateDailyReward();

        /*FBAdapter.instance.SavePlayerData();
        SoundManager.instance.PlayEfxSound(this.claimSound);*/
    }

    // tính toán phần thưởng
    // ngày lẻ được vàng => 500 -> 1000 -> 1500 ...
    // ngày chẵn được thẻ => 5 (9 lần) -> 10 (9 lần) -> 15 (9 lần) ...
    private CalculateReward(rewardDay: number)
    {
        if (rewardDay % 2 === 0)
        {
            switch ((rewardDay / 2) % 9)
            {
                case 0:
                    return new RewardItem(PrizeTypeEnum.Ticket_1, 5 * Math.floor((rewardDay / 18) + 1));
                case 1:
                    return new RewardItem(PrizeTypeEnum.Ticket_2, 5 * Math.floor((rewardDay / 18) + 1));
                case 2:
                    return new RewardItem(PrizeTypeEnum.Ticket_3, 5 * Math.floor((rewardDay / 18) + 1));
                case 3:
                    return new RewardItem(PrizeTypeEnum.Ticket_4, 5 * Math.floor((rewardDay / 18) + 1));
                case 4:
                    return new RewardItem(PrizeTypeEnum.Ticket_5, 5 * Math.floor((rewardDay / 18) + 1));
                case 5:
                    return new RewardItem(PrizeTypeEnum.Ticket_6, 5 * Math.floor((rewardDay / 18) + 1));
                case 6:
                    return new RewardItem(PrizeTypeEnum.Ticket_7, 5 * Math.floor((rewardDay / 18) + 1));
                case 7:
                    return new RewardItem(PrizeTypeEnum.Ticket_8, 5 * Math.floor((rewardDay / 18) + 1));
                case 8:
                    return new RewardItem(PrizeTypeEnum.Ticket_9, 5 * Math.floor((rewardDay / 18) + 1));
            }
        }
        {
            return new RewardItem(PrizeTypeEnum.Coin_SmallBuck, 500 * Math.floor((rewardDay + 1) / 2));
        }
    }

    private GenerateDailyReward()
    {
        if (GameData.playerData.DailyRewardLastDay === this.GetCurrentDayStringInUTC())
        {
            this.remainContentText.string = "TIME REMAINING FOR NEXT REWARD:";
            this.greyOverlayForClaimButton.active = true;
            this.claimButton.interactable = false;

            this.greyOverlayForClaimButton_Ads.active = true;
            this.claimButton_Ads.interactable = false;
        }
        else
        {
            this.remainContentText.string = "TIME REMAINING FOR THIS REWARD:";
            this.greyOverlayForClaimButton.active = false;
            this.claimButton.interactable = true;

            this.greyOverlayForClaimButton_Ads.active = false;
            this.claimButton_Ads.interactable = true;
        }

        if (GameData.playerData.CurrentDailyRewardDay > 3)
        {
            this.currentRewardItemIndex = 3;
            // generate từ ngày trước đó 2 ngày
            for (let i = 0; i < this.rewardItemList.length; i++)
            {
                this.rewardItemList[i].SetReward(this.CalculateReward(GameData.playerData.CurrentDailyRewardDay - 2 + i),
                    i < 3,
                    i == 3,
                    GameData.playerData.CurrentDailyRewardDay - 2 + i);
            }
        }
        else
        {
            this.currentRewardItemIndex = GameData.playerData.CurrentDailyRewardDay;
            // generate từ ngày 1
            for (let i = 0; i < this.rewardItemList.length; i++)
            {
                this.rewardItemList[i].SetReward(this.CalculateReward(i + 1),
                    i < GameData.playerData.CurrentDailyRewardDay,
                    i == GameData.playerData.CurrentDailyRewardDay,
                    i + 1);
            }
        }
    }

    onEnable()
    {
        this.GenerateDailyReward();
    }

    private GetCurrentDayStringInUTC()
    {
        var date = new Date();
        // console.log(`${ date.getHours() }-${ date.getMinutes() }-${ date.getSeconds() }`);
        return date.toLocaleDateString();
        // return `${ date.getFullYear() }${ date.getMonth() + 10 }${ date.getDate() }`;
    }
}

export class RewardItem
{
    PrizeType: PrizeTypeEnum;
    PrizeQty: number;

    constructor(prizeType: PrizeTypeEnum, prizeQty: number)
    {
        this.PrizeType = prizeType;
        this.PrizeQty = prizeQty;
    }
}