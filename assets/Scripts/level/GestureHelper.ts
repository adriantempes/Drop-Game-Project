const {ccclass, property} = cc._decorator;
@ccclass
export default class GestureHelper extends cc.Component {
    static inst: GestureHelper = null;
    isActivating: boolean = false;
    @property(cc.Node)
    circle: cc.Node = null;
    @property(cc.Node)
    finger: cc.Node = null;

    fingerAction;
    circleAction;

    onLoad() {
        GestureHelper.inst = this
    }

    start() {
    }

    GuideTouchBtn(e, pos = cc.v2(0, -15)) {
        this.isActivating = true;
        this.node.active = true;
        let worldpos = e.convertToWorldSpaceAR(pos);
        let o = this.node.convertToNodeSpaceAR(worldpos);
        let _circle = this.circle;
        let _finger = this.finger;

        let _fingerCallbak = cc.callFunc(() => {
            _finger.setPosition(o);
            _finger.opacity = 255;
            _finger.scale = 1.3
        });
        let s = cc.callFunc(function () {
            _circle.setPosition(o);
            _circle.scale = 0;
            _circle.opacity = 255
        });
        let _fingerAction = cc.repeatForever(
            cc.sequence(_fingerCallbak,
                cc.scaleTo(.167, 1, 1),
                cc.scaleTo(.333, 1, 1),
                cc.scaleTo(.333, 1, 1),
                cc.scaleTo(.333, 1.3, 1.3)
            )
        );
        let _circleAction = cc.repeatForever(
            cc.sequence(s,
                cc.scaleTo(.167, 0, 0),
                cc.spawn(cc.scaleTo(.333, 1, 1),
                    cc.fadeTo(.333, 0)),
                cc.scaleTo(.333, 1, 1),
                cc.fadeTo(.333, 0)
            )
        );

        _finger.runAction(_fingerAction);
        _circle.runAction(_circleAction)
    }

    GuideMove(e, t) {
        this.node.active = true;
        this.isActivating = true;
        var n = e;
        let o = t;
        let _circleNode = this.circle;
        let _finger = this.finger;

        let _fingerCallbak = cc.callFunc(function () {
            _circleNode.setPosition(n);
            _circleNode.scale = 0;
            _circleNode.opacity = 255
        });

        let s = cc.callFunc(function () {
            _finger.setPosition(n),
                _finger.opacity = 255
        });

        let _fingerAction = cc.repeatForever(
            cc.sequence(s,
                cc.moveTo(.5, o),
                cc.fadeTo(.5, 0),
                cc.fadeTo(.5, 0)
            )
        );

        let _circleAction = cc.repeatForever(
            cc.sequence(_fingerCallbak,
                cc.spawn(cc.scaleTo(.5, 1, 1),
                    cc.fadeTo(.5, 0)),
                cc.fadeTo(1, 0)
            )
        );

        _finger.runAction(_fingerAction);
        _circleNode.runAction(_circleAction)
    }

    stopAction() {
        console.log("stopAction");
        this.isActivating = false;
        this.circle.stopAllActions();
        this.finger.stopAllActions();
        this.circle.opacity = 0;
        this.finger.opacity = 0
    }
}