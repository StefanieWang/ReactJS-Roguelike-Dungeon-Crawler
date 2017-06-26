import React from 'react'

const Header = (props) => {
 /* render(){*/
    /*const player = props.player;
          level = props.level,
          enemyHealth = props.enemyHealth,
          damageMake = props.damageMake,
          damageTake = props.damageTake,
*/
    return (
      <div>
        <ul className="game-info">
          <li key="health">{"Health: " + props.player.health}</li>
          <li key="attack">{"Attack: " + props.player.weapon.attack}</li>
          <li key="level">{"Level: " + props.level}</li>
          <li key="weapon">{"Weapon: " + props.player.weapon.name}</li>
          <li key="xp">{"XP: " + props.player.xp}</li>  
        </ul>
        <ul className="game-info">
          <li key="enemy">{"EnemyHealth: " + props.enemyHealth}</li>
          <li key="damageMake">{"Damage Make: " + props.damageMake}</li>
          <li key="damageTake">{"Damage Take: " + props.damageTake}</li>
          <li key="button"><button onClick={props.toggleDarkness}>toggle darkness</button></li>
        </ul>
      </div>)
  /*}*/
}

export default Header