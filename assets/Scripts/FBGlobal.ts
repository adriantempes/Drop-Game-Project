import Common from "./Common";

const {ccclass, property} = cc._decorator;

@ccclass
export default class FBGlobal extends cc.Component {
    fbname = "noname";
    fbphoto = null;
    fbScore = 0;
    toolBagData = 0;
    numberTry = 0;
    hehe = 0;
    debugText = "FB api loaded";

    preloadedInterstitial: FBInstant.AdInstance = null;
    preloadedRewardedVideo: FBInstant.AdInstance = null;
    public videoAdsID = "1315544158845755_1387741668292670";
    public interstitialId = "1315544158845755_1387741871625983";
    public canSubscribeBot = false;


    static _ins: FBGlobal

    static get instance(): FBGlobal {
        return this._ins || new FBGlobal;
    }

    onLoad() {
        FBGlobal._ins = this;
    }

    public loadAdsInterestial() {
        if (typeof FBInstant === "undefined") return;

        if (!this.isSupportInterstitial()) {
            return;
        }

        FBInstant.getInterstitialAdAsync(
            this.interstitialId // Your Ad Placement Id
        )
            .then(function (interstitial) {
                // Load the Ad asynchronously.
                console.log("load inter ads đã gọi");
                FBGlobal.instance.preloadedInterstitial = interstitial;
                return interstitial.loadAsync();
            })
            .then(function () {
            })
            .catch(function (err) {
                console.error("Interstitial failed to preload: " + err.message);
            });
    }

    public subcribeMessage() {
        if (typeof FBInstant === "undefined") return;
        let self = this;
        console.log("FBSDK dialog 0");

        FBInstant.player.canSubscribeBotAsync().then(function (can_subscribe) {
            console.log("FBSDK dialog 1" + can_subscribe);
            self.canSubscribeBot = can_subscribe;
            if (self.canSubscribeBot) {
                FBInstant.player.subscribeBotAsync().then(
                    // Player is subscribed to the bot
                ).catch(function (e) {
                    console.log("FBSDK dialog failed");
                });
            }
        });
    }

    public showAdsInterestial() {
        console.log("Show ads inter already");
        if (this.preloadedInterstitial == null) {
            return;
        }
        let self = this;

        this.preloadedInterstitial
            .showAsync()
            .then(function () {
                // Perform post-ad success operation
                console.log("show inter ads đã gọi");
            })
            .catch(function (e) {
                //console.error("Error" + err.message);
                self.numberTry++;
                if (self.numberTry <= 10) {
                    console.log('Reload inter ads at init r nhe')
                    FBGlobal.instance.loadAdsInterestial();
                }
            });
    }

    public loadBannnerAdsFirst() {
        if (typeof FBInstant === "undefined") return;
        let self = this;

        if (!this.isSupportBannerAds()) {
            return;
        }
        // FBInstant.loadBannerAdAsync( 'my_placement_id' ).then(() => {
        //     console.log('success');
        // });
    }

    public loadVideoAdsFirst() {
        if (typeof FBInstant === "undefined") return;
        let self = this;

        if (!this.isSupportRewardVideo()) {
            return;
        }
        FBInstant.getRewardedVideoAsync(
            this.videoAdsID // Your Ad Placement Id
        )
            .then(function (rewarded) {
                // Load the Ad asynchronously
                console.log("load video ads đã gọi");

                FBGlobal.instance.preloadedRewardedVideo = rewarded;

                console.log("Video" + FBGlobal.instance.preloadedRewardedVideo);

                return rewarded.loadAsync();
            })
            .then(function () {
                console.log("Rewarded video preloaded");
            })
            .catch(function (err) {
                console.error("Rewarded video failed to preload: " + err.message);
                self.numberTry++;
                if (self.numberTry <= 10) {
                    console.log('Reload video ads at init r nhe')
                    FBGlobal.instance.loadVideoAdsFirst();
                }
            });
    }

    public showAds(onCLoseCallback, onFailedCallBack, arg) {
        let self = this;
        console.log("Show video ads đã gọi");

        console.log("Video" + this.preloadedRewardedVideo);

        Common.pauseBGM();

        if (this.preloadedRewardedVideo === null) {
            FBGlobal.instance.loadVideoAdsFirst()
        }

        this.preloadedRewardedVideo
            .showAsync()
            .then(function () {
                Common.resumeBGM();
                onCLoseCallback(arg);
                FBGlobal.instance.loadVideoAdsFirst()
            })
            .catch(function (e) {
                Common.resumeBGM();
                console.error(e.message);
                onFailedCallBack("error");
                if (self.numberTry <= 10) {
                    console.log('Reload video ads r nhe')
                    FBGlobal.instance.loadVideoAdsFirst()
                    self.numberTry++;
                }
            });
    }

    public printLog(srtLog) {
        console.log(srtLog);
    }

    public createShortcutAsync() {
        if (typeof FBInstant === "undefined") return;
        FBInstant.canCreateShortcutAsync()
            .then(function (canCreateShortcut) {
                if (canCreateShortcut) {
                    FBInstant.createShortcutAsync()
                        .then(function () {
                            console.log("create shortcut");
                        })
                        .catch(function () {
                            console.log("create shortcut fail");
                        });
                }
            });
    }

    //Save fpr information only
    public getFBScore(callback) {
        this.debugText = "called getFBScore() ";
        if (typeof FBInstant === "undefined") return;

        this.fbname = FBInstant.player.getName();
        this.fbphoto = FBInstant.player.getPhoto();
        this.debugText = "try get score from fb " + this.fbname + this.fbphoto;
        this.printLog(this.debugText);
        FBInstant.player
            .getDataAsync(["data"])
            .then((data) => {
                let converted  = data['data'];
                this.fbScore = converted['bestScore'];
                this.toolBagData = converted["toolBagData"];
                if (callback) {
                    callback(this.fbScore, this.toolBagData);
                }
                this.debugText =
                    " get score from fb :" +
                    this.fbScore +
                    " metadata:" +
                    this.toolBagData;
                this.printLog(this.debugText);
            })
            .catch((error) => {
                this.debugText =
                    " getDataAsysnc error\n code:" +
                    error.code +
                    "\n msg: " +
                    error.message;
                this.printLog(this.debugText);
            });
        // return this.fbScore;
    }

    public saveFBData(dataString) {
        if (typeof FBInstant === "undefined") return;

        if (dataString['bestScore'] > this.fbScore) {
            FBInstant.player.setDataAsync({
                data: dataString
            })
                .then(() => {
                    this.fbScore = dataString["bestScore"];
                    this.debugText = ' save score to fb player successed';
                    this.printLog(this.debugText);
                })
                .catch(error => {
                    this.debugText = ' setDataAsync error\n code:' + error.code + '\n msg: ' + error.message;
                    this.printLog(this.debugText);
                });

            let strNameAndPhoto = this.fbname + "_" + this.fbphoto;
            //更新排行榜
            FBInstant.getLeaderboardAsync(
                "my_leaderboard." + FBInstant.context.getID()
            )
                .then((leaderboard) => {
                    this.debugText = " save score to fb successed on setScoreAsync";
                    this.printLog(this.debugText);
                    return leaderboard.setScoreAsync(dataString["bestScore"], strNameAndPhoto);
                })
                .then((entry) => {
                    this.debugText = " save score to fb successed get entry";
                    this.printLog(this.debugText);
                })
                .catch((error) => {
                    this.debugText =
                        " save score to fb rank error setScoreAsync\n code:" +
                        error.code +
                        "\n msg: " +
                        error.message;
                    this.printLog(this.debugText);
                });
        } else {
            this.debugText = "not saved ,old highscore is :" + this.fbScore;
            this.printLog(this.debugText);
        }
    }

    public getRank(callback) {
        this.debugText = "called getRank()";
        this.printLog(this.debugText);
        if (typeof FBInstant === "undefined") return;
        let result = null;
        this.debugText = "try get fb rank";
        this.printLog(this.debugText);
        FBInstant.getLeaderboardAsync("my_leaderboard." + FBInstant.context.getID())
            .then((leaderboard) => {
                this.debugText = " get fb rank leaderboard";
                this.printLog(this.debugText);
                return leaderboard.getEntriesAsync(10, 2);
            })
            .then((entries) => {
                if (entries) {
                    this.debugText = " get fb rank entries :" + entries.length;
                    this.printLog(this.debugText);
                } else {
                    this.debugText = " no entries ";
                    this.printLog(this.debugText);
                }
                if (callback) {
                    this.printLog("Call load data r nhe");
                    callback(entries);
                }
            })
            .catch((error) => {
                this.debugText =
                    "getLeaderboardAsync error\n code:" +
                    error.code +
                    "\n msg:" +
                    error.message;
                this.printLog(this.debugText);
            });
    }


    // // 分享功能  intent("INVITE" | "REQUEST" | "CHALLENGE" | "SHARE") 表示分享的意图
    // onShareGame: function (img) {
    //   this.debugText = "called onShareGame()";
    //   if (!img) {
    //     return;
    //   }
    //   this.debugText = "get screenshot :" + img.length;
    //   if (typeof FBInstant === "undefined") return;

    //   // 分享功能  intent("INVITE" | "REQUEST" | "CHALLENGE" | "SHARE") 表示分享的意图
    //   // let img = this.getImgBase64(w, h, renderType);
    //   // this.debugText = 'get screenshot :' + img.length;
    //   FBInstant.shareAsync({
    //     intent: "SHARE",
    //     image: img,
    //     text: "Look my score!",
    //     data: {
    //       myReplayData: "...",
    //     },
    //   })
    //     .then(() => {
    //       // continue with the game.
    //     })
    //     .catch((error) => {
    //       this.debugText =
    //         " shareAsync error\n code:" + error.code + "\n msg: " + error.message;
    //     });
    // },

    public onChallenge() {
        var self = this;
        this.debugText = "called onChallenge()";
        if (typeof FBInstant === "undefined") return;
        FBInstant.shareAsync({
            intent: "CHALLENGE",
            image: self.getBase64Image(),
            text: "I just challenged Drag Number 2048 ,Join me!",
            data: {
                myReplayData: "...",
            },
        })
            .then(() => {
                // continue with the game.
            })
            .catch((error) => {
                this.debugText =
                    " challenge shareAsync\n code:" +
                    error.code +
                    "\n msg: " +
                    error.message;
            });
    }

    public inviteAsync(params, tag) {
        //if (typeof FBInstant === 'undefined') return;
        console.log('invite r nhe')
        var callback_success = params.successCallback;
        var callback_fail = params.failCallback;
        var sefl = this;
        FBInstant.context
            .chooseAsync()
            .then(function () {
                console.log('invite then');
                FBInstant.updateAsync({
                    action: 'CUSTOM',
                    cta: 'Play',
                    image: sefl.getBase64Image(),
                    text: {
                        default: "Come and get new challenge!!",
                        localizations: {}
                    },
                    template: 'pass_score',
                    data: {myReplayData: '...'},
                    strategy: 'IMMEDIATE',
                    notification: 'NO_PUSH',
                }).then(() => {
                    console.log('invite then already');
                    callback_success(null, params.arg);
                }).catch(function (e) {
                    console.log('catch invite error ' + e);
                    //callback_fail(null, data);
                });
            }).catch(function (e) {
            console.log('catch ' + e);
            //callback_fail(null, data);
        });
    }

    //拉起微信分享(参数：successCallback,failCallback)
    public shareGame(params, tag) {
        console.log('Share game already' + tag);
        let self = this;
        //if (typeof FBInstant === 'undefined') return;
        var successCallback = params.successCallback;
        var failCallback = params.failCallback;

        FBInstant.shareAsync({
            image: self.getBase64Image(),
            intent: 'SHARE',
            text: 'Moi chen',
            data: {myReplayData: '...'},
        }).then(() => {
            console.log('Share game already1' + tag);
            successCallback(null, params.arg);
        }).catch((error) => {
            console.log('Share game already fail' + error);
            failCallback(null, error);
        });
    }

    public postSessionScore(num) {
        if (typeof FBInstant === 'undefined') return;
        FBInstant.postSessionScore(num);
    }

    public performHapticFeedbackAsync() {
        if (typeof FBInstant === 'undefined') return;
        FBInstant.performHapticFeedbackAsync();
    }

    //获取base64图片
    public getBase64Image() {
        return 'data:image/webp;base64,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';
    }

    public isSupportRewardVideo(): boolean {
        return FBInstant.getSupportedAPIs().indexOf('getRewardedVideoAsync') !== -1
    }

    public isSupportBannerAds(): boolean {
        return FBInstant.getSupportedAPIs().indexOf('loadBannerAdAsync') !== -1
    }

    public isSupportInterstitial() {
        return FBInstant.getSupportedAPIs().indexOf('getInterstitialAdAsync') !== -1
    }
}
