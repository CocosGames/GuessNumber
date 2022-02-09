
import { _decorator, Component, Node, Label, Button } from 'cc';
import {ColyseusClient} from "db://assets/script/ColyseusClient";
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
    numberList1: Label;

    @property({type:Label})
    numberList2: Label;

    @property({type:Button})
    submitBtn: Button;

    @property({type:Node})
    clientNode: Node;

    guess: string = "";
    colyseusClient: ColyseusClient;
    count: number = 0;

    start () {
        this.colyseusClient = this.clientNode.getComponent<ColyseusClient>(ColyseusClient);
        this.numberLabel.string = this.numberList1.string = this.numberList2.string = "";
        this.colyseusClient.node.on("onResult", () => {
            if (this.count==0) return;
            this.numberList1.string = this.numberList2.string = "";
            let map:Map<string, string> = this.colyseusClient.room.state.results;
            map.forEach((r,id,m)=>
            {
                if (this.colyseusClient.room.sessionId == id) {
                    this.numberList1.string = r;
                }
                else
                {
                    this.numberList2.string = r;
                }
            });
        });
    }

    // update (deltaTime: number) {
    //     // [4]
    // }

    onSubmit()
    {
        this.count++;
        this.colyseusClient.room.send("action", {guess : this.guess})

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

    // onResult(e, d)
    // {
    //     if (this.count==0) return;
    //     let map:Map<string, string> = this.colyseusClient.room.state.results;
    //     map.forEach((r,id,m)=>
    //     {
    //         if (this.colyseusClient.room.sessionId == id) {
    //             this.numberList1.string = "";
    //             for (let i=0;i<this.count;i++)
    //                 this.numberList1.string += r.charAt(this.count*5)+r.charAt(this.count*5+1)+r.charAt(this.count*5+2)+"  " + r.charAt(this.count*5+3)+ + "  " + r.charAt(this.count*5+4)+ + "\n";
    //         }
    //         else
    //         {
    //             this.numberList2.string = "";
    //             for (let i=0;i<this.count;i++)
    //                 this.numberList2.string += "***"+"  " + r.charAt(this.count*5+3)+ + "  " + r.charAt(this.count*5+4)+ + "\n";
    //         }
    //     });
    // }

}

