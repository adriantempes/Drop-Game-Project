const {ccclass, property} = cc._decorator;

@ccclass
export default class PressedButton extends cc.Component
{
    @property
    deltaMove: number = 0;

    originPos: cc.Vec2[] = [];

    selfButton: cc.Button;
    onLoad()
    {
        this.selfButton = this.node.getComponent(cc.Button);
        this.node.on(cc.Node.EventType.TOUCH_START, this.OnPressedButton, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.OnReleasedButton, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.OnReleasedButton, this);

        for (let i = 0; i < this.node.childrenCount; i++)
        {
            this.originPos.push(this.node.children[i].position);
        }
    }

    OnPressedButton()
    {
        if (this.selfButton.interactable == false) return;
        for (let i = 0; i < this.node.childrenCount; i++)
        {
            this.node.children[i].position = this.originPos[i].add(cc.v2(0, this.deltaMove));
        }
    }

    OnReleasedButton()
    {
        if (this.selfButton.interactable == false) return;
        for (let i = 0; i < this.node.childrenCount; i++)
        {
            this.node.children[i].position = this.originPos[i];
        }
    }
}
