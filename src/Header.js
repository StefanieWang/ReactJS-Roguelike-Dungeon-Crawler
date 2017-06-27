import 'reset-css';
import React from 'react'

class Header extends React.Component {
  render(){  
    const player = this.props.player;
    const playerHealth = player.health>0 ? player.health : 0;
    return (
      <div className="game-header clear">
        <h1>Roguelike Dungeon Crawler Game</h1>
        <h3>Kill the boss in dungeon 4</h3>
        <ul className="game-info clear">
          <li key="health">{"Health: " + playerHealth}</li>
          <li key="enemy">{"Enemy Health: " + this.props.enemyHealth}</li>
          <li key="attack">{"Attack: " + player.weapon.attack}</li>
          <li key="level">{"Dungeon: " + this.props.level}</li>
          <li key="weapon">{"Weapon: " + player.weapon.name}</li>
          <li key="xp">{"XP: " + player.xp}</li>  
        </ul> 
        <ul className="game-info clear">     
          <li key="enemyNum ">{"Enemies: "+this.props.enemyNum+ " / 10"}</li>   
          <li key="foodNum">{"Health Items: "+this.props.foodNum+" / 10"}</li>  
          <li key="button"><button onClick={this.props.toggleDarkness}>toggle darkness</button></li>
          <li key="gameEnd">{
              this.props.gameEnd ? 
              <button onClick = {this.props.startNewGame}>New Game</button> :
              null }
          </li>
        </ul>      
        <div className="game-end-message">{this.props.gameEnd ?
              this.props.gameEndMessage : null}
        </div>
      </div>)
  }
}

export default Header
