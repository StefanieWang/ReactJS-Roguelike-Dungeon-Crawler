import 'reset-css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import NewDungeon from './NewDungeon.js'
import { Boss, Enemy} from './Enemy.js'
import Player from './Player.js'
import Header from './Header'

const Food = [10,20,25,30,40];
const Weapon = [
                {
                  name: "Knife",
                  attack: 10,
                  image: "weapon-knife"
                },
                {
                  name: "Axe",
                  attack: 20,
                  image: "weapon-axe"
                },
                {
                  name: "Double Axes",
                  attack: 30,
                  image: "weapon-double-axes"
                },
                {
                  name: "Sword",
                  attack: 35,
                  image: "weapon-sword"
                },
                {
                  name: "Broadsword",
                  attack: 40,
                  image: "weapon-broadsword"
                }
              ]

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
    this.boardSizeX = 20;
    this.boardSizeY = 30;
    this.displayWindowHeight = 10;//only show 10 squares vertically
    this.player = undefined;
    this.enemy = undefined;
    this.level = 0;  		
    this.enemyArray = [];
    this.enemyNum = 10;
    this.foodNum = 10;
    this.makeMovement = this.makeMovement.bind(this);
    
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
    if(level < 4){ //no entrance in dungeon 4
      map = this.placeItems(map.floors, map.gameMap, "entrance", 1)
    }else { // boss is in dungeon 4
      map = this.placeItems(map.floors, map.gameMap, "boss", 1)
    }
    this.enemyNum = 10;
    this.foodNum = 10;
    return { gameMap: map.gameMap, floors: map.floors }
  }
  
  startNewGame(){    
    this.level = 0;
    this.gameEndMessage = undefined;
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
    return (x < 0 ||  y < 0 ||
        x >= this.boardSizeX || 
        y >= this.boardSizeY ||
        gameMap[x][y] === 0)
      
  }

  fightEnemy(enemy){ //player and enemy take turns to do damage
    let damage;
    if(!enemy.fight){ //player's turn to do damage
      damage = this.player.doDamage();
      enemy.getDamage(damage);
      enemy.fight = true;
    }else{  //enemy's turn to do damage
      damage = enemy.doDamage();
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
            this.foodNum--;
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
        /*this.damageMake = 0;
        this.damageTake = 0;*/
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
            this.enemyNum--;
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
    /*console.log(keycode);
    console.log(playerPos);*/
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
      this.gameEndMessage = "You fail!"

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
  
  getGameBoardRows(){
    const gameMap = this.state.gameMap;
    let gameBoardRows = [];
    const playerX = this.player.position[0];
    const playerY = this.player.position[1];
    const displayWindowTop = playerX - this.displayWindowHeight/2 > 0 ? // only display the area around player
                           playerX - this.displayWindowHeight/2 :
                           0;
    const displayWindowBottom = displayWindowTop + this.displayWindowHeight -1;    
    const visibleMap = getVisibleMap(playerX, playerY);
    for(let x=0; x<this.boardSizeX; x++){
      for(let y=0; y<this.boardSizeY; y++){
        let classname; 
        if(x >= displayWindowTop &&  // x is within the display window
           x <= displayWindowBottom) {
          if(this.state.revealAll || 
            findInArray([x, y], visibleMap)){ //if [x, y] is in the visible area
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
          }else {  // if [x,y] is outside visible area(darness)
            classname = "dark";
          }
          
          gameBoardRows.push(<li key={[x, y]} className={"square "+ classname}></li>);
        }
      }
    }
    return gameBoardRows;
  }

  render() { 	
    const enemyHealth = this.enemy && this.enemy.health>0 ? 
                        this.enemy.health : 0;
    const gameBoardRows = this.getGameBoardRows();
    
    return (
    	<div className="container">           		
        <Header player = {this.player}
                level = {this.level}
                enemyHealth = {enemyHealth}
                toggleDarkness = {this.toggleDarkness.bind(this)}
                gameEnd = {this.state.gameEnd}
                enemyNum = {this.enemyNum}
                foodNum = {this.foodNum}
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


