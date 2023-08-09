import GameData from "./GameData";
import {PrizeTypeEnum} from "./DailyRewardItem";

const {ccclass, property} = cc._decorator;


@ccclass
export default class LuckyWheelPrizeScript extends cc.Component
{
    @property(cc.Sprite)
    private slotSprite: cc.Sprite = null;
    @property(cc.Sprite)
    private prizeIconSprite: cc.Sprite = null;
    @property(cc.SpriteFrame)
    private slotSpecialFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private slotGreatFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private slotNormalFrame: cc.SpriteFrame = null;

    @property(cc.Label)
    private prizeQtyLabel: cc.Label = null;

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
    @property(cc.SpriteFrame)
    private ship_Icon: cc.SpriteFrame = null;

    prizeType: PrizeTypeEnum;
    SetPrize(PrizeType: PrizeTypeEnum)
    {
        this.prizeType = PrizeType;
        switch (PrizeType)
        {
            case PrizeTypeEnum.NoReward:
                // GOOD LUCK
                break;
            case PrizeTypeEnum.Coin_SmallBuck:
                this.prizeIconSprite.spriteFrame = this.coinIcon;
                this.slotSprite.spriteFrame = this.slotNormalFrame;
                this.prizeQtyLabel.string = `x${GameData.LuckyWheelRewardConfig.get(PrizeType)}`;
                break;
            case PrizeTypeEnum.Coin_GreatBuck:
                this.prizeIconSprite.spriteFrame = this.coinIcon;
                this.slotSprite.spriteFrame = this.slotNormalFrame;
                this.prizeQtyLabel.string = `x${GameData.LuckyWheelRewardConfig.get(PrizeType)}`;
                break;
            case PrizeTypeEnum.Coin_HugeBuck:
                this.prizeIconSprite.spriteFrame = this.coinIcon;
                this.slotSprite.spriteFrame = this.slotNormalFrame;
                this.prizeQtyLabel.string = `x${GameData.LuckyWheelRewardConfig.get(PrizeType)}`;
                break;
            case PrizeTypeEnum.Coin_Jackpot:
                this.prizeIconSprite.spriteFrame = this.coinIcon;
                this.slotSprite.spriteFrame = this.slotSpecialFrame;
                this.prizeQtyLabel.string = `x${GameData.LuckyWheelRewardConfig.get(PrizeType)}`;
                break;
            case PrizeTypeEnum.Ticket_1:
                this.prizeIconSprite.spriteFrame = this.ticket_1_Icon;
                this.slotSprite.spriteFrame = this.slotGreatFrame;
                this.prizeQtyLabel.string = `x${GameData.LuckyWheelRewardConfig.get(PrizeType)}`;
                break;
            case PrizeTypeEnum.Ticket_2:
                this.prizeIconSprite.spriteFrame = this.ticket_2_Icon;
                this.slotSprite.spriteFrame = this.slotGreatFrame;
                this.prizeQtyLabel.string = `x${GameData.LuckyWheelRewardConfig.get(PrizeType)}`;
                break;
            case PrizeTypeEnum.Ticket_3:
                this.prizeIconSprite.spriteFrame = this.ticket_3_Icon;
                this.slotSprite.spriteFrame = this.slotGreatFrame;
                this.prizeQtyLabel.string = `x${GameData.LuckyWheelRewardConfig.get(PrizeType)}`;
                break;
            case PrizeTypeEnum.Ticket_4:
                this.prizeIconSprite.spriteFrame = this.ticket_4_Icon;
                this.slotSprite.spriteFrame = this.slotGreatFrame;
                this.prizeQtyLabel.string = `x${GameData.LuckyWheelRewardConfig.get(PrizeType)}`;
                break;
            case PrizeTypeEnum.Ticket_5:
                this.prizeIconSprite.spriteFrame = this.ticket_5_Icon;
                this.slotSprite.spriteFrame = this.slotGreatFrame;
                this.prizeQtyLabel.string = `x${GameData.LuckyWheelRewardConfig.get(PrizeType)}`;
                break;
            case PrizeTypeEnum.Ticket_6:
                this.prizeIconSprite.spriteFrame = this.ticket_6_Icon;
                this.slotSprite.spriteFrame = this.slotGreatFrame;
                this.prizeQtyLabel.string = `x${GameData.LuckyWheelRewardConfig.get(PrizeType)}`;
                break;
            case PrizeTypeEnum.Ticket_7:
                this.prizeIconSprite.spriteFrame = this.ticket_7_Icon;
                this.slotSprite.spriteFrame = this.slotGreatFrame;
                this.prizeQtyLabel.string = `x${GameData.LuckyWheelRewardConfig.get(PrizeType)}`;
                break;
            case PrizeTypeEnum.Ticket_8:
                this.prizeIconSprite.spriteFrame = this.ticket_8_Icon;
                this.slotSprite.spriteFrame = this.slotGreatFrame;
                this.prizeQtyLabel.string = `x${GameData.LuckyWheelRewardConfig.get(PrizeType)}`;
                break;
            case PrizeTypeEnum.Ticket_9:
                this.prizeIconSprite.spriteFrame = this.ticket_9_Icon;
                this.slotSprite.spriteFrame = this.slotGreatFrame;
                this.prizeQtyLabel.string = `x${GameData.LuckyWheelRewardConfig.get(PrizeType)}`;
                break;
        }
    }

    GetPrize()
    {
        switch (this.prizeType)
        {
            case PrizeTypeEnum.NoReward:
                // GOOD LUCK
                break;
            case PrizeTypeEnum.Coin_SmallBuck:
                //GameData.ChangeCoin(GameData.LuckyWheelRewardConfig.get(this.prizeType));
                break;
            case PrizeTypeEnum.Coin_GreatBuck:
                //GameData.ChangeCoin(GameData.LuckyWheelRewardConfig.get(this.prizeType));
                break;
            case PrizeTypeEnum.Coin_HugeBuck:
                //GameData.ChangeCoin(GameData.LuckyWheelRewardConfig.get(this.prizeType));
                break;
            case PrizeTypeEnum.Coin_Jackpot:
                //GameData.ChangeCoin(GameData.LuckyWheelRewardConfig.get(this.prizeType));
                break;
            case PrizeTypeEnum.Ticket_1:
                //GameData.ChangeTicket(GameData.LuckyWheelRewardConfig.get(this.prizeType), 0);
                break;
            case PrizeTypeEnum.Ticket_2:
                //GameData.ChangeTicket(GameData.LuckyWheelRewardConfig.get(this.prizeType), 1);
                break;
            case PrizeTypeEnum.Ticket_3:
                //GameData.ChangeTicket(GameData.LuckyWheelRewardConfig.get(this.prizeType), 2);
                break;
            case PrizeTypeEnum.Ticket_4:
                //GameData.ChangeTicket(GameData.LuckyWheelRewardConfig.get(this.prizeType), 3);
                break;
            case PrizeTypeEnum.Ticket_5:
                //GameData.ChangeTicket(GameData.LuckyWheelRewardConfig.get(this.prizeType), 4);
                break;
            case PrizeTypeEnum.Ticket_6:
                //GameData.ChangeTicket(GameData.LuckyWheelRewardConfig.get(this.prizeType), 5);
                break;
            case PrizeTypeEnum.Ticket_7:
                //GameData.ChangeTicket(GameData.LuckyWheelRewardConfig.get(this.prizeType), 6);
                break;
            case PrizeTypeEnum.Ticket_8:
                //GameData.ChangeTicket(GameData.LuckyWheelRewardConfig.get(this.prizeType), 7);
                break;
            case PrizeTypeEnum.Ticket_9:
                //GameData.ChangeTicket(GameData.LuckyWheelRewardConfig.get(this.prizeType), 8);
                break;
        }
    }
}