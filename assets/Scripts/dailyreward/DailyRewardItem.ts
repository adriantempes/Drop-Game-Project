import {RewardItem} from "./DailyRewardScript";
import GameData from "./GameData";

const {ccclass, property} = cc._decorator;


export enum PrizeTypeEnum
{
    NoReward = 0,
    Coin_SmallBuck = 1,
    Coin_GreatBuck = 2,
    Coin_HugeBuck = 3,
    Coin_Jackpot = 4,
    Ticket_1 = 5,
    Ticket_2 = 6,
    Ticket_3 = 7,
    Ticket_4 = 8,
    Ticket_5 = 9,
    Ticket_6 = 10,
    Ticket_7 = 11,
    Ticket_8 = 12,
    Ticket_9 = 13
}

@ccclass
export default class DailyRewardItem extends cc.Component
{
    @property(cc.Sprite)
    private rewardIconSprite: cc.Sprite = null;
    @property(cc.SpriteFrame)
    private coinIcon: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private ticket_1_Icon: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private ticket_2_Icon: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private ticket_3_Icon: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private ticket_4_Icon: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private ticket_5_Icon: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private ticket_6_Icon: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private ticket_7_Icon: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private ticket_8_Icon: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private ticket_9_Icon: cc.SpriteFrame = null;

    @property(cc.Label)
    private rewardQtyText: cc.Label = null;
    @property(cc.Node)
    private greyMask: cc.Node = null;

    @property(cc.Label)
    private dailyText: cc.Label = null;

    @property(cc.Sprite)
    private backgroundItemSprite: cc.Sprite = null;
    @property(cc.SpriteFrame)
    private receivedBackgroundSpriteFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private currentBackgroundSpriteFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private nextBackgroundSpriteFrame: cc.SpriteFrame = null;

    SetReward(Item: RewardItem, HasReceived: boolean, IsCurrentItem: boolean, DayNo: number)
    {
        this.rewardItem = Item;
        this.dailyText.string = `Day ${ DayNo }`;
        if (HasReceived)
        {
            this.greyMask.active = true;
            this.backgroundItemSprite.spriteFrame = this.receivedBackgroundSpriteFrame;
        }
        else
        {
            this.greyMask.active = false;
            this.backgroundItemSprite.spriteFrame = this.nextBackgroundSpriteFrame;
        }

        if (IsCurrentItem)
        {
            this.backgroundItemSprite.spriteFrame = this.currentBackgroundSpriteFrame;
        }


        this.rewardQtyText.string = `x${ Item.PrizeQty }`;
        switch (Item.PrizeType)
        {
            case PrizeTypeEnum.Ticket_1:
                this.rewardIconSprite.spriteFrame = this.ticket_1_Icon;
                break;
            case PrizeTypeEnum.Ticket_2:
                this.rewardIconSprite.spriteFrame = this.ticket_2_Icon;
                break;
            case PrizeTypeEnum.Ticket_3:
                this.rewardIconSprite.spriteFrame = this.ticket_3_Icon;
                break;
            case PrizeTypeEnum.Ticket_4:
                this.rewardIconSprite.spriteFrame = this.ticket_4_Icon;
                break;
            case PrizeTypeEnum.Ticket_5:
                this.rewardIconSprite.spriteFrame = this.ticket_5_Icon;
                break;
            case PrizeTypeEnum.Ticket_6:
                this.rewardIconSprite.spriteFrame = this.ticket_6_Icon;
                break;
            case PrizeTypeEnum.Ticket_7:
                this.rewardIconSprite.spriteFrame = this.ticket_7_Icon;
                break;
            case PrizeTypeEnum.Ticket_8:
                this.rewardIconSprite.spriteFrame = this.ticket_8_Icon;
                break;
            case PrizeTypeEnum.Ticket_9:
                this.rewardIconSprite.spriteFrame = this.ticket_9_Icon;
                break;
            default:
                this.rewardIconSprite.spriteFrame = this.coinIcon;
                break;
        }
    }

    rewardItem: RewardItem;
    ReceiveReward()
    {
        switch (this.rewardItem.PrizeType)
        {
            //TODO 27
           /* case PrizeTypeEnum.Ticket_1:
                GameData.ChangeTicket(this.rewardItem.PrizeQty, 0);
                break;
            case PrizeTypeEnum.Ticket_2:
                GameData.ChangeTicket(this.rewardItem.PrizeQty, 1);
                break;
            case PrizeTypeEnum.Ticket_3:
                GameData.ChangeTicket(this.rewardItem.PrizeQty, 2);
                break;
            case PrizeTypeEnum.Ticket_4:
                GameData.ChangeTicket(this.rewardItem.PrizeQty, 3);
                break;
            case PrizeTypeEnum.Ticket_5:
                GameData.ChangeTicket(this.rewardItem.PrizeQty, 4);
                break;
            case PrizeTypeEnum.Ticket_6:
                GameData.ChangeTicket(this.rewardItem.PrizeQty, 5);
                break;
            case PrizeTypeEnum.Ticket_7:
                GameData.ChangeTicket(this.rewardItem.PrizeQty, 6);
                break;
            case PrizeTypeEnum.Ticket_8:
                GameData.ChangeTicket(this.rewardItem.PrizeQty, 7);
                break;
            case PrizeTypeEnum.Ticket_9:
                GameData.ChangeTicket(this.rewardItem.PrizeQty, 8);
                break;
            default:
                GameData.ChangeCoin(this.rewardItem.PrizeQty);
                break;*/
        }
    }

    ReceiveRewardAfterWatchingAds()
    {
        switch (this.rewardItem.PrizeType)
        {
            //TODO 27
            /*case PrizeTypeEnum.Ticket_1:
                GameData.ChangeTicket(this.rewardItem.PrizeQty * 3, 0);
                break;
            case PrizeTypeEnum.Ticket_2:
                GameData.ChangeTicket(this.rewardItem.PrizeQty * 3, 1);
                break;
            case PrizeTypeEnum.Ticket_3:
                GameData.ChangeTicket(this.rewardItem.PrizeQty * 3, 2);
                break;
            case PrizeTypeEnum.Ticket_4:
                GameData.ChangeTicket(this.rewardItem.PrizeQty * 3, 3);
                break;
            case PrizeTypeEnum.Ticket_5:
                GameData.ChangeTicket(this.rewardItem.PrizeQty * 3, 4);
                break;
            case PrizeTypeEnum.Ticket_6:
                GameData.ChangeTicket(this.rewardItem.PrizeQty * 3, 5);
                break;
            case PrizeTypeEnum.Ticket_7:
                GameData.ChangeTicket(this.rewardItem.PrizeQty * 3, 6);
                break;
            case PrizeTypeEnum.Ticket_8:
                GameData.ChangeTicket(this.rewardItem.PrizeQty * 3, 7);
                break;
            case PrizeTypeEnum.Ticket_9:
                GameData.ChangeTicket(this.rewardItem.PrizeQty * 3, 8);
                break;
            default:
                GameData.ChangeCoin(this.rewardItem.PrizeQty * 3);
                break;*/
        }
    }
}

