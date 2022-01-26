
import { _decorator, Component, Node, Label, Button } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Room
 * DateTime = Wed Jan 26 2022 18:58:23 GMT+0800 (中国标准时间)
 * Author = CocosGames
 * FileBasename = Room.ts
 * FileBasenameNoExtension = Room
 * URL = db://assets/script/Room.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('Room')
export class Room extends Component {

    @property({type:Label})
    numberLabel: Label;

    @property({type:Label})
    numberList: Label;

    @property({type:Button})
    submitBtn: Button;

    cpu: string = "";
    guess: string = "";

    h = 0;
    b = 0;

    start () {
        this.numberLabel.string = this.numberList.string = "";
        let numbers = [1,2,3,4,5,6,7,8,9,0];
        for (var i=0;i<3;i++)
        {
            let r = Math.floor(Math.random()*numbers.length);
            this.cpu = this.cpu + numbers[r].toString();
            numbers[r]= numbers[numbers.length-1];
            numbers.pop();
        }

        console.log(this.cpu);
    }

    // update (deltaTime: number) {
    //     // [4]
    // }

    onSubmit()
    {
        for (var i=0;i<3;i++)
        {
            if (this.cpu.charAt(i)==this.guess.charAt(i))
                this.h++;
        }

        for (var j=0;j<3;j++)
        {
            for (var k=0;k<3;k++)
            {
                if (this.cpu.charAt(j)==this.guess.charAt(k))
                {
                    this.b++;
                }
            }
        }
        this.b-=this.h;
        this.numberList.string += this.guess + "  " + this.h + "  " + this.b + "\n";

        this.h = this.b = 0;
        this.guess = "";
        this.numberLabel.string = "";
        this.submitBtn.interactable = false;
    }

    onNumber(e, n:string)
    {
        this.guess += n;
        this.numberLabel.string = this.guess;
        if (this.guess.length==3)
            this.submitBtn.interactable = true;
    }

}

