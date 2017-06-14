import React from 'react';
import ReactDOM from 'react-dom';
import Map from './Map';
import './index.css';

class Enemy extends React.Component {
  render() {
    return (
      <div className="enemy"></div>
    );
  }
}

class Player extends React.Component {
  render() {
    return (
      <div className="player"></div>
    );
  }
}

class Weapon extends React.Component {
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
			dungeonMap: [0,1,1,1,1,1,2,2,2,1,1,2,2,2,1,1,1,1,1,1,0,0,0,0,0],
			nextDungeon: false
		}

		this.setNewMap = this.setNewMap.bind(this);
	}
    
    setNewMap(newMap){
        this.setState({
        	dungeonMap: newMap,
        	nextDungeon: false
        })
    }

    render() {
    	const gameInfoList = ["Health: 100", "Attack: 7","Level: 0", "Weapon: stick", "Next Level: 60 XP","Dungeon: 0"].map((item)=>{
    			return <li key={item}>{item}</li>
    		});
      const gameBoardList = this.state.gameMap.map((item, index) => {
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
      })

      return (
      	<div className="container">
          <h1>Roguelike Dungeon Crawler Game</h1>
      		<ul className="game-info">
            {gameInfoList}
      		</ul>
      		<ul className="game-board">
  	    		{gameBoardList}		    		
      		</ul>
  		  </div>
      )
    	
    }
}
ReactDOM.render(<RogueLike />, document.getElementById('app'));

/**/
