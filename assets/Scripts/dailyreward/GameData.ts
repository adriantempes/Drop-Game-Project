import {PrizeTypeEnum} from "./DailyRewardItem";

export class PlayerData {
    /**
     * Ngày số bao nhiêu đang nhận được daily reward
     */
    CurrentDailyRewardDay: number = 0;

    DailyRewardLastDay: string = "";

    TotalWatchRewardAds: number = 0;
    RewardAdsLastDay: string = "";

    PlayerCoin: number = 0;
    ReachedWave: number = 1;

    constructor(
        playerCoin: number, reachedWave: number,
        currentDailyRewardDay: number, dailyRewardLastDay: string,
        totalWatchedRewardAds: number, watchedRewardAdsLastDay: string) {
        this.PlayerCoin = playerCoin;
        this.ReachedWave = reachedWave;
        this.CurrentDailyRewardDay = currentDailyRewardDay;
        this.DailyRewardLastDay = dailyRewardLastDay;
        this.TotalWatchRewardAds = totalWatchedRewardAds;
        this.RewardAdsLastDay = watchedRewardAdsLastDay;
    }
}

export class BaseMessage {
    message: string = "";

    constructor(messageString: string) {
        this.message = messageString;
    }
}

export default class GameData {

    static playerData: PlayerData = new PlayerData(0,  0, 0, "", 0, "");

    //#region LUCKY WHEEL REWARD CONFIG
    static LuckyWheelRewardConfig: Map<PrizeTypeEnum, number> = new Map
    (
        [
            [PrizeTypeEnum.Coin_SmallBuck, 100],
            [PrizeTypeEnum.Coin_GreatBuck, 200],
            [PrizeTypeEnum.Coin_HugeBuck, 500],
            [PrizeTypeEnum.Coin_Jackpot, 5000],

            [PrizeTypeEnum.Ticket_1, 5],
            [PrizeTypeEnum.Ticket_2, 5],
            [PrizeTypeEnum.Ticket_3, 5],
            [PrizeTypeEnum.Ticket_4, 5],
            [PrizeTypeEnum.Ticket_5, 5],
            [PrizeTypeEnum.Ticket_6, 5],
            [PrizeTypeEnum.Ticket_7, 5],
            [PrizeTypeEnum.Ticket_8, 5],
            [PrizeTypeEnum.Ticket_9, 5]
        ]
    )
    /**
     * Thời điểm lần cuối cùng xem quảng cáo (tính bằng giây tính từ đầu ngày)
     * Nếu sang ngày mới thì sẽ tự xử tiếp
     * Bật game lần đầu tiên sẽ cho thời điểm lần cuối cùng bằng lúc bật game
     */
    static LastTimeWatchInterstitialAds: number;
}

