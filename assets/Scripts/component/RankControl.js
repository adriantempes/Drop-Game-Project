import StartScreenManager from "../StartScreenManager";

const Common = require('../Common');
import FBGlobal from "../FBGlobal";
import {AudioEffectID} from "../Common";

cc.Class({
    extends: cc.Component,
    properties: {
        spacing: 0, // space between each item
        spawnCount: 0, // how many items we actually spawn
        bufferZone: 0, // when item is away from bufferZone, we relocate it
        listScrollNhe: {
            default: null,
            type: cc.ScrollView,
        },
        content: {
            default: null,
            type: cc.Node,
        },
        btnClose: {
            default: null,
            type: cc.Button,
        },
        btnShare: {
            default: null,
            type: cc.Button,
        },
        // btnShare: {
        //     default: null,
        //     type: cc.Button,
        // },
        itemPrefab: {
            default: null,
            type: cc.Prefab,
        },
    },
    onLoad() {
        this.btnClose.node.on('click', this.onClose, this);
        this.btnShare.node.on('click', this.onShare, this);
        //this.btnShare.node.on('click', this.shareButtonCb, this);
        //this.content = this.listScrollNhe.content;
        this.items = []; // array to store spawned items
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        this.lastContentPosY = 0; // use this variable to detect if we are scrolling up or down
    },

    start() {
        self = this;
        this.initialize(function (entries) {
            self.updateRankingUIView(entries);
        });
    },

    inviteFriend: function (playerID) {
        console.log('Goi r nhe hehe' + playerID)
    },

    initialize: function (callback) {
        if (typeof FBInstant === 'undefined') return;
        FBInstant.getLeaderboardAsync('my_leaderboard.' + FBInstant.context.getID())
            .then(leaderboard => {
                console.log(' get fb rank leaderboard');

                return leaderboard.getEntriesAsync();
            })
            .then(entries => {
                console.log(entries[0].getRank() + 'name' + entries[0].getPlayer().getName() + 'score' + entries[0].getScore());
                if (entries) {
                    if (callback) {
                        callback(entries)
                        console.log('callback already');
                    }
                } else {
                    console.log(' no entries');

                }
            })
            .catch(error => {
                console.log("getLeaderboardAsync error\n code:" + error.code + '\n msg:' + error.message);
            });
    },

    updateRankingUIView(entries) {
        // FBGlobal.debugText = ' get fb rank entries :' + entries.length;
        // FBGlobal.printLog(FBGlobal.debugText);

        // console.log("already comehere22"+ entries[0].getPlayer().getName());

        // console.log("already comehere1" +(entries.length * (30) + 0));

        //let height = this.listScrollNhe.height / 2;
        let self = this;

        var itemTemplate = cc.instantiate(this.itemPrefab);
        this.content.height = entries.length * (itemTemplate.height + this.spacing) + this.spacing; // get total content height

        for (let i = 0; i < entries.length; ++i) { // spawn items, we only need to do this once
            // if (i < 3) {
            //     this.fetchItemForRank(entries[i], i);
            // }

            var item = cc.instantiate(this.itemPrefab);

            this.content.addChild(item);

            item.setPosition(0, -item.height * (0.5 + i) - this.spacing * (i + 1));
            item.getComponent('RankItem').initItem(entries[i], i, self.inviteFriend.bind(this));
            console.log("already comehere2" + entries[i].getPlayer().getName());
            this.items.push(item);
            console.log('Size list la' + this.items.length + 'height' + this.content.height);
        }
        console.log("already comehere3");

        this.scrollToFixedPosition();
    },

    onClose: function (button) {
        //cc.director.loadScene('StartScreen');
        // this.node.removeFromParent();
        // this.node.destroy();
        StartScreenManager.instance.onShowScreenByName("Home");
    },

    onShare: function (button) {
        Common.playAudioEffect(Common.AudioEffectID.ClickBtn, false);
        var param = {
            type: null,
            arg: null,
            successCallback: this.shareSuccessCb.bind(this),
            failCallback: this.shareFailedCb.bind(this),
            shareName: '啊啊啊',
            isWait: false
        };
        FBGlobal.instance.inviteAsync(param, 'RankGame0');
    },

    show() {
        this.isDraw = true;
    },
    hide() {
        this.isDraw = false;
        this.node.active = false;
    },

    update: function (dt) {
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) return; // we don't need to do the math every frame
        this.updateTimer = 0;
        let items = this.items;
        let buffer = this.bufferZone;
        let isDown = this.content.y < this.lastContentPosY; // scrolling direction
        let offset = (this.itemPrefab.height + this.spacing) * items.length;
        for (let i = 0; i < items.length; ++i) {
            let viewPos = this.getPositionInView(items[i]);
            if (isDown) {
                // if away from buffer zone and not reaching top of content
                if (viewPos.y < -buffer && items[i].y + offset < 0) {
                    items[i].y = items[i].y + offset;
                }
            } else {
                // if away from buffer zone and not reaching bottom of content
                if (viewPos.y > buffer && items[i].y - offset > -this.content.height) {
                    items[i].y = items[i].y - offset;
                }
            }
        }
        // update lastContentPosY
        this.lastContentPosY = this.content.y;
    },

    getPositionInView: function (item) { // get item position in scrollview's node space
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.listScrollNhe.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },

    scrollToFixedPosition: function () {
        //   this.listScrollNhe.scrollToOffset(cc.v2(0, 0), 2, false);
    },
    shareSuccessCb(type, arg) {
        console.log(type, arg);
    },
    shareFailedCb(type, arg) {
        console.log(type, arg);
    },
    // shareButtonCb() {
    //     if (this.voiceManager != null) {
    //         this.voiceManager.getComponent("AudioManager").play(GData.AudioParam.AudioButton);
    //     }
    //     var param = {
    //         type: null,
    //         arg: null,
    //         successCallback: this.shareSuccessCb.bind(this),
    //         failCallback: this.shareFailedCb.bind(this),
    //         shareName: '啊啊啊',
    //         isWait: false
    //     };
    //     FBGlobal.inviteAsync(param, 'RankGame0');
    //   //FBGlobal.onChallenge(param, 'StartGame0');
    // },
});
