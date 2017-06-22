import React from 'react';
import ReactDOM from 'react-dom';
import Map from './Map';
import './index.css';
/*import NewMap from './NewMap.js';*/
import NewDungeon from './NewDungeon.js'
import Enemy from './Enemy.js'

const randNum = (min, max) =>{
  return Math.floor(Math.random()*(max-min))+min;
}

 
class Enemy extends React.Component {
  constructor(props){
    super(props);
    this.position = this.props.position;
    this.health = 100;
    this.xp = randNum(5, 10);
  }
  
  getDamage(){
    const damage = randNum(6, 9);
    this.health -= damage;
    if(this.health <== 0){
      this.props.enemyDie(this.position, this.xp);
    }
  }
  
  render() {
    return (
      <div className="enemy"></div>
    );
  }
}

class Player extends React.Component {
  constructor(props){
    super(props);
    this.position = getRandomPosition(this.props.gameMap);
    this.health = 100;
    this.level = 0;
    this.weapon = "stick";
    this.xp = 0;
  }
  

  getDamage(){
    const damage = randNum(6, 9);
    this.health -= damage;
    if(this.health <== 0){
      this.props.playerDie();
    }
  }

  render() {
    return (
      <div className="player"></div>
    );
  }
}

class Weapon extends React.Component {
  constructor(props){
    super(props);
    this.position = this.props.position;
    this
  }
  render() {
    return (
      <div className="weapon"></div>
    );
  }
}

class Food extends React.Component {
  render() {
    return (
      <div className="food">
        
      </div>
    );
  }
}

class RogueLike extends React.Component {
	constructor(){
		super();
		this.state = {
			gameMap: [0,1,1,1,1,1,2,{role: "player"},2,1,1,2,2,{role: "enemy"},1,1,1,1,1,1,0,0,0,0,0],
			nextDungeon: false,
		}

    this.floor = 0;
    this.boardSizeX = 20;
    this.boardSizeY = 30;
		this.setNewMap = this.setNewMap.bind(this);
	}
    
  setNewMap(newMap){
      this.setState({
      	dungeonMap: newMap,
      	nextDungeon: false
      })
  }
  
  placeWeapon(){

  }

  placeEnemies(gameMap, level){
    const enemyNum = 10;
    //generate 10 enemies;
    for(let i=0; i<enemyNum; i++){
      const position = getRandomPosition(gameMap);
      const x= position[0];
      const y = position[1];
      gameMap[x][y] = new Enemy(level);
    }
   
  }
  
  removeItem(position, gameMap){
    let gameMap = gameMap;
    const x = position[0];
    const y = position[1];
    gameMap[x][y] = this.floor;
    return gameMap;
  }
  
  placePlayer(){

  }

  placeFood(){

  }

  enemyDie(position, xp){
    const x = position[0];
    const y = position[1];
    let gameMap = this.state.gameMap;
    gameMap[x][y] = this.floor;
   /* player.xp += xp;*/
    this.setState({
      gameMap: gameMap;
    })
  }

  componentWillMount(){
    let gameMap = NewDungeon();
    
  }

  render() {
  	const gameInfoList = ["Health: 100", "Attack: 7","Level: 0", "Weapon: stick", "Next Level: 60 XP","Dungeon: 0"].map((item)=>{
  			return <li key={item}>{item}</li>
  		});
  
    const gameMap = NewDungeon();
    let gameBoardRows = [];
    let role;
    for(let x=0; x<this.boardSizeX; x++){
      for(let y=0; y<this.boardSizeY; y++){
        const item = gameMap[x][y];
        const position = [x, y];
        if (typeof(item) === "number") {
          role = <Map number={item} position={position} />;          
          } else if (typeof(item) === "object") {
              switch(item.role){              
                case "player":
                  role = <Player gameMap={this.state.gameMap}
                                  setGameInfo={this.state.setGameInfo}
                                  getDamage = {this.getDamage}
                                  makeMovement = {this.makeMovement}
                                  playerDie={this.playerDie} /> 
                  break;
                case "enemy": 
                  role = <Enemy position={position} enemyDie = {this.enemyDie}/>;
                  break;
                case "food":
                  role = <Food />;
                  break;
                case "weapon":
                  role = <Weapon />;               
              }
        }
        gameBoardRows.push(<li key={[x,y]} className="square">{role}</li>);
      }
    }
    /*const gameBoardList = gameMap.map((item, index) => {
      	let role;
			if (typeof(item) === "number") {
				role = <Map number={item} position={index} />;  				
			} else if (typeof(item) === "object") {
      		switch(item.role){        			
      			case "player":
    			    role = <Player position={index} />;
              break;
      			case "enemy": 
        			role = <Enemy position={index} />;
        			break;
        		case "food":
	        		role = <Food position={index} />;
	        		break;
	        	case "weapon":
		        	role = <Weapon position={index} />;			        	
      		}
    	  }
      return <li key={index} className="square">{role}</li>
    })*/
    
  

    return (
    	<div className="container">
        <h1>Roguelike Dungeon Crawler Game</h1>
    		<ul className="game-info">
          {gameInfoList}
    		</ul>
    		<ul className="game-board">
	    		{gameBoardRows}	

    		</ul>
		  </div>
    )
  	
  }
}
ReactDOM.render(<RogueLike />, document.getElementById('app'));




