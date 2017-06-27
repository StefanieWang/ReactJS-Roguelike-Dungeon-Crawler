import 'reset-css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import NewDungeon from './NewDungeon.js'
import { Boss, Enemy} from './Enemy.js'
import Player from './Player.js'
import Header from './Header'

/*=============================================================
For the map 
0: outside area, 1: floors, 2: food, 3: weapon, 4: entrance
object: enemy or player
================================================================
*/
const Food = [10,20,25,30,40];
const Weapon = [
                {
                  name: "Knife",
                  attack: 10,
                  image: "weapon-knife"
                },
                {
                  name: "Axe",
                  attack: 15,
                  image: "weapon-axe"
                },
                {
                  name: "Double Axes",
                  attack: 20,
                  image: "weapon-double-axes"
                },
                {
                  name: "Sword",
                  attack: 25,
                  image: "weapon-sword"
                },
                {
                  name: "Broadsword",
                  attack: 30,
                  image: "weapon-broadsword"
                }
              ]
/*const getVisibleMap1 = (x, y) => {
  return [                                    [x-5, y],
                                  [x-4, y-1], [x-4, y], [x-4, y+1],
                      [x-3, y-2], [x-3, y-1], [x-3, y], [x-3, y+1], [x-3, y+2],
           [x-2, y-3],[x-2, y-2], [x-2, y-1], [x-2, y], [x-2, y+1], [x-2, y+2],[x-2, y+3],
[x-1, y-4],[x-1, y-3],[x-1, y-2], [x-1, y-1], [x-1, y], [x-1, y+1], [x-1, y+2],[x-1, y+3],[x-1, y+4],
[x, y-5],[x, y-4],[x, y-3],[x, y-2], [x, y-1],[x, y], [x, y+1], [x, y+2],[x, y+3],[x, y+4],[x, y+5],
[x+1, y-4],[x+1, y-3],[x+1, y-2], [x+1, y-1], [x+1, y], [x+1, y+1], [x+1, y+2],[x+1, y+3],[x+1, y+4],
           [x+2, y-3],[x+2, y-2], [x+2, y-1], [x+2, y], [x+2, y+1], [x+2, y+2],[x+2, y+3],
                      [x+3, y-2], [x+3, y-1], [x+3, y], [x+3, y+1], [x+3, y+2],
                                  [x+4, y-1], [x+4, y], [x+4, y+1],
                                              [x+5, y],
              ];
}*/

const getVisibleMap = (x, y) => {
  return [             [x-3, y],
           [x-2, y-1], [x-2, y], [x-2, y+1], 
[x-1, y-2], [x-1, y-1], [x-1, y], [x-1, y+1], [x-1, y+2],
[x, y-3],[x, y-2], [x, y-1],[x, y], [x, y+1], [x, y+2],[x, y+3],
[x+1, y-2], [x+1, y-1], [x+1, y], [x+1, y+1], [x+1, y+2],
           [x+2, y-1], [x+2, y], [x+2, y+1],
                      [x+3, y],                                        
              ];
} 

const findInArray = (item, array) => {
  return array.find((i) => {
          return i[0]===item[0]&&i[1]===item[1]
      })
}

const randNum = (min, max) => {
  return Math.floor(Math.random()*(max-min))+min;
}

const getRandomPosition = (floors, boardSizeX = 20, boardSizeY = 30) => {
  const randIndex = randNum(0, floors.length);
  const position = floors.splice(randIndex, 1);
  return {
    removedTile: position[0], 
    newFloors: floors
  };

}

class RogueLike extends React.Component {
	constructor(){
		super();
		this.state = {
			gameEnd: false,
      revealAll: false,
      gameMap: [],
		}
    this.gameEndMessage = undefined;
    this.damageMake = 0;
    this.damageTake = 0;
    this.boardSizeX = 20;
    this.boardSizeY = 30;
    this.player = undefined;
    this.level = 0;  		
    this.enemyArray = [];
    this.makeMovement = this.makeMovement.bind(this);
    this.enemy = undefined;
	}
    

  /*=============================================================
  For the map 
  0: outside area, 1: floors, 2: food, 3: weapon, 4: entrance
  object: enemy or player
  ================================================================
  */
  placeItems(floors, gameMap, item, num, level = 0){    
    for(let i=0; i<num; i++){
      //newFloors is an object {removedTile: [], newFloors: []};
      const { removedTile, newFloors } = getRandomPosition(floors);
      const x = removedTile[0];
      const y = removedTile[1];
      floors = newFloors;
      switch(item){       
        case "food":
          gameMap[x][y] = 2;
          break;
        case "weapon":
          gameMap[x][y] = 3;
          break;
        case "entrance":
          gameMap[x][y] = 4;
          break;
        case "boss":
          gameMap[x][y] = new Boss();
          break;
        case "enemy":
          gameMap[x][y] = new Enemy(level);
          this.enemyArray.push([x,y]);
          break;
        case "player":
          if(level === 0){
            const newPlayer = new Player([x,y]);
            gameMap[x][y] = newPlayer;
            this.player = newPlayer;
          } else {
            gameMap[x][y] = this.player;
            this.player.position = [x, y];
          }
      }      
    }
 
    return { gameMap: gameMap, floors: floors };
  }
   
  generateNewMap(level){
    const num = 10 ;
    let map = NewDungeon();    
    map = this.placeItems(map.floors, map.gameMap, "enemy", num, level)
    map = this.placeItems(map.floors, map.gameMap, "food", num)
    map = this.placeItems(map.floors, map.gameMap, "weapon", 1)
    map = this.placeItems(map.floors, map.gameMap, "player", 1, level)
    if(level < 4){
      map = this.placeItems(map.floors, map.gameMap, "entrance", 1)
    }else {
      map = this.placeItems(map.floors, map.gameMap, "boss", 1)
    }

    return { gameMap: map.gameMap, floors: map.floors }
  }
  
  startNewGame(){    
    this.level = 0;
    this.gameEndMessage = undefined;
    this.damageMake = 0;
    this.damageTake = 0;
    this.player = undefined;    
    this.enemyArray = [];
    this.enemy = undefined;
    const map = this.generateNewMap(0);
    window.addEventListener("keydown", this.makeMovement);
    this.setState({
      gameMap: map.gameMap,
      revealAll: false,
      gameEnd: false
    })
  }

  updateMap(gameMap){
    this.setState({
      gameMap: gameMap
    })
  }

  nextDungeon(level){
    const nextLevel = level + 1;
    const  map = this.generateNewMap(nextLevel);
    this.level = nextLevel;    
    return map.gameMap;
  }

  replaceItem(itemPosition, gameMap){    
    const prevPlayerPos = this.player.position;
    let x = prevPlayerPos[0];
    let y = prevPlayerPos[1];
    gameMap[x][y] = 1; // 1: floors
    x = itemPosition[0];
    y = itemPosition[1];
    this.player.position = [x, y];
    gameMap[x][y] = this.player;
    return gameMap;
  }

  isInvalidMove(position, gameMap){
    const x = position[0];
    const y = position[1];
    let invalid = false;
    if (x < 0 ||  y < 0 ||
        x >= this.boardSizeX || y >= this.boardSizeY ||
        gameMap[x][y] === 0){
      invalid = true;
    }
    return invalid;
  }

  fightEnemy(enemy){
    let damage;
    if(!enemy.fight){
      damage = this.player.doDamage();
      this.damageMake = damage;
      this.damageTake = 0;
      enemy.getDamage(damage);
      enemy.fight = true;
    }else{
      damage = enemy.doDamage();
      this.damageTake = damage;
      this.damageMake = 0;
      this.player.getDamage(damage);
      enemy.fight = false;
    }

  }

  meetItem(item, position){
    let gameMap = this.state.gameMap;
      if(typeof(item) === "number"){
        switch(item){
          case 1: //floor
            gameMap = this.replaceItem(position, gameMap);
            break;
          case 2: //food
            const health = Food[this.level];
            this.player.pickUpItem("food", health);
            gameMap = this.replaceItem(position, gameMap);
            break;
          case 3: // weapon
            const newWeapon = Weapon[this.level];
            this.player.pickUpItem("weapon", newWeapon);
            gameMap = this.replaceItem(position, gameMap);
            break;
          case 4: // entrance to the next dungeon
            gameMap = this.nextDungeon(this.level);            
            break;
        }
        this.damageMake = 0;
        this.damageTake = 0;
      }else {
        const enemy = item;
        this.enemy = enemy;
        this.fightEnemy(enemy);
        if (!this.player.alive){
          this.gameEnd("fail");
        } 
        else if(!enemy.alive){
          if(enemy.role === "boss"){
            this.gameEnd("win");
          }
          else{
            this.player.pickUpItem("xp", enemy.xp);
            this.enemy = undefined;
            gameMap = this.replaceItem(position, gameMap);            
          }
        }
        
      }

      this.updateMap(gameMap);
  }

  makeMovement(e){
    e.stopPropagation();
    const gameMap = this.state.gameMap;
    const keycode = e.keyCode;
    const playerPos = this.player.position;
    console.log(keycode);
    console.log(playerPos);
    let x = playerPos[0];
    let y = playerPos[1];
    switch(keycode){
      case 37: //left
        y--;
        break;
      case 38: //up
        x--;
        break;
      case 39: //right
        y++;
        break;
      case 40: //down
        x++;
        break;
    };
    if(!this.isInvalidMove([x,y], gameMap)){
      const item = gameMap[x][y];
      this.meetItem(item, [x, y]);
    }
  }

  gameEnd(message){
    if(message === "fail"){
      this.gameEndMessage = "Oh, you fail!"

    }else{
      this.gameEndMessage = "Congratulations! You beat the big boss!"
    }
    window.removeEventListener("keydown", this.makeMovement);
    this.setState({
      gameEnd: true
    })
  }

  toggleDarkness(){
    const revealAll = this.state.revealAll;
    this.setState({
      revealAll: !revealAll
    })
  }

  componentWillMount(){
    const map = this.generateNewMap(0);    
    this.setState({
      gameMap: map.gameMap,
      gameEnd: false
    })
  }

  componentDidMount(){
    window.addEventListener("keydown", this.makeMovement);
  }

  componentWillUnmount(){
    window.removeEventListener("keydown", this.makeMovement);
  }

  render() { 	
    /*const gameEndMessage = this.gameEnd ? this.gameEndMessage : null;*/
    const enemyHealth = this.enemy && this.enemy.health>0 ? 
                        this.enemy.health : 0;
    const gameMap = this.state.gameMap;
    let gameBoardRows = [];
    const visibleMap = getVisibleMap(this.player.position[0], this.player.position[1]);
    for(let x=0; x<this.boardSizeX; x++){
      for(let y=0; y<this.boardSizeY; y++){
        let classname;
        if(this.state.revealAll || 
          findInArray([x, y], visibleMap)){
          const item = gameMap[x][y];         
          if(typeof(item) === "number"){
            switch(item){
              case 0: //outside
                classname = "outside";
                break;
              case 1: //floor
                classname = "floor";
                break;
              case 2: //food
                classname = "food";
                break;
              case 3: // weapon
                classname = Weapon[this.level].image;
                break;
              case 4: // entrance to the next dungeon
                classname = "entrance"           
                break;
            }        
          }else {
            switch(item.role){
              case "enemy":
                classname = "enemy";
                break;
              case "player":
                classname = "player";
                break;
              case "boss":
                classname = "boss";
                break;
            }
          }
        }else {
          classname = "dark";
        }
        
        gameBoardRows.push(<li key={[x, y]} className={"square "+ classname}></li>);
      }
    }
    
    return (
    	<div className="container">           		
        <Header player = {this.player}
                level = {this.level}
                enemyHealth = {enemyHealth}
                damageTake = {this.damageTake}
                damageMake = {this.damageMake}
                toggleDarkness = {this.toggleDarkness.bind(this)}
                gameEnd = {this.state.gameEnd}
                gameEndMessage = {this.gameEndMessage}
                startNewGame = {this.startNewGame.bind(this)}/>
        <div className="board">          
    		  <ul className="game-board clear">
	    		 {gameBoardRows}	
    		  </ul>         
        </div>
		  </div>
    )
  	
  }
}
ReactDOM.render(<RogueLike />, document.getElementById('app'));


