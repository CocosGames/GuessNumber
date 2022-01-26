import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('Lobby')
export class Lobby extends Component {


    client!: Colyseus.Client;


    start () {
        director.loadScene("room");

    }

}