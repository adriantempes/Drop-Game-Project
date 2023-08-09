cc.Class({
    extends: cc.Component,

    properties: {
        rankLabel: {
            default: null,
            type: cc.Label,
        },

        nameLabel: {
            default: null,
            type: cc.Label,
        },

        scoreLabel: {
            default: null,
            type: cc.Label,
        },

        avatarSprite: {
            default: null,
            type: cc.Sprite,
        },

        backgroundSprite: {
            default: null,
            type: cc.Sprite,
        },

        btnPlay: {
            default: null,
            type: cc.Button,
        },
    },


    /**
     * 设置item
     * @param {*数据（排名、微信名、分数、头像url）} data
     */
    initItem(data, index, inviteFriendCb) {
        let that = this;
        if (index === 0) {
            cc.loader.loadRes("texture/ranking/rank1bg", cc.SpriteFrame, function (err, spriteFrame) {
                that.backgroundSprite.spriteFrame = spriteFrame;
            });
            // that.nameLabel.node.getComponent(cc.LabelShadow).color = new cc.Color().fromHEX('#FA00008E');
            // that.crownSprite.node.active = true;
        } else if (index === 1) {
            cc.loader.loadRes("texture/ranking/rank2bg", cc.SpriteFrame, function (err, spriteFrame) {
                that.backgroundSprite.spriteFrame = spriteFrame;
            });
            // that.nameLabel.node.getComponent(cc.LabelShadow).color = new cc.Color().fromHEX('#EB11FF8E');
            // that.crownSprite.node.active = false;
        } else if (index === 2) {
            cc.loader.loadRes("texture/ranking/rank2bg", cc.SpriteFrame, function (err, spriteFrame) {
                that.backgroundSprite.spriteFrame = spriteFrame;
            });
            // that.nameLabel.node.getComponent(cc.LabelShadow).color = new cc.Color().fromHEX('#11FF29CC');
            // that.crownSprite.node.active = false;
        } else {
            cc.loader.loadRes("texture/ranking/rank2bg", cc.SpriteFrame, function (err, spriteFrame) {
                that.backgroundSprite.spriteFrame = spriteFrame;
            });
            // that.nameLabel.node.getComponent(cc.LabelShadow).color = new cc.Color().fromHEX('#70729CCC');
            // that.crownSprite.node.active = false;
        }

        this.rankLabel.string = data.getRank();

        console.log("nickname _ rank: " + data.getPlayer().getName() + "/" + data.getRank() + "/ score" + data.getScore());

        this.nameLabel.string = data.getPlayer().getName();
        this.scoreLabel.string = data.getScore();

        console.log("PHOTO _ rank: " + data.getPlayer().getPhoto() + "/" + data.getRank());

        //this.btnPlay.node.on('click', inviteFriendCb('hehehe'), this);

        cc.loader.load({url: data.getPlayer().getPhoto(), type: 'png'}, function (err, img) {
            if (err) {
                console.log("Load image failed HEHE");
            } else {
                that.avatarSprite.spriteFrame = new cc.SpriteFrame(img);
                console.log('load image avatar r nhe');
            }
        });
    },
});
