import { Room, Delayed, Client } from 'colyseus';
import { type, Schema, MapSchema, ArraySchema } from '@colyseus/schema';

const TURN_TIMEOUT = 10
const BOARD_WIDTH = 19;
const BOARD_HEIGHT = 19;

class State extends Schema {
  @type("string") currentTurn: string;
  @type({ map: "boolean" }) players = new MapSchema<boolean>();
  @type({ map: "string" }) results = new MapSchema<string>();
  @type("string") winner: string;
  @type("boolean") draw: boolean;
}

export class MyRoom extends Room<State> {
  maxClients = 2;
  cpu = "";

  onCreate () {
    this.setState(new State());
    this.onMessage("action", (client, message) => this.playerAction(client, message));
    this.createCPUNumber();
    console.log("Room Created!");
  }

  createCPUNumber()
  {
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

  onJoin (client: Client) {
    this.state.players.set(client.sessionId, true);
    this.state.results.set(client.sessionId, "");
    console.log(this.state.players.size + " players joined!");
    if (this.state.players.size === 2) {
      this.state.currentTurn = client.sessionId;

      // lock this room for new users
      this.lock();
    }
  }

  playerAction (client: Client, data: any) {
    if (this.state.winner || this.state.draw) {
      return false;
    }

    if (client.sessionId === this.state.currentTurn) {
      const playerIds = Array.from(this.state.players.keys());

        if (this.checkWin(data.guess)) {
          this.state.winner = client.sessionId;
          console.log("winner: " + client.sessionId);
        } else if (this.checkGuessComplete(playerIds)) {
          this.state.draw = true;

        } else {
          // switch turn
          const otherPlayerSessionId = (client.sessionId === playerIds[0]) ? playerIds[1] : playerIds[0];
          this.state.currentTurn = otherPlayerSessionId;
        }
      }
  }

checkGuessComplete (ids:string[]) {
    return this.state.results.size ==2 && this.state.results.get(ids[0]).length>=80 &&
        this.state.results.get(ids[1]).length>=80;
  }

  checkWin (g:string="123") {
    let h = 0;
    let b = 0;
    for (var i=0;i<3;i++)
    {
      if (this.cpu.charAt(i)==g.charAt(i))
        h++;
    }

    for (var j=0;j<3;j++)
    {
      for (var k=0;k<3;k++)
      {
        if (this.cpu.charAt(j)==g.charAt(k))
        {
          b++;
        }
      }
    }
    b-=h;
    let resultString = this.state.results.get(this.state.currentTurn);
    resultString+=g+"  ";
    resultString+=b+"  ";
    resultString+=h+"  \n";
    this.state.results.set(this.state.currentTurn,resultString);
    return h>=3;
  }

  onLeave (client: Client) {
    this.state.players.delete(client.sessionId);

    let remainingPlayerIds = Array.from(this.state.players.keys());
    if (remainingPlayerIds.length > 0) {
      this.state.winner = remainingPlayerIds[0]
    }
  }

}

