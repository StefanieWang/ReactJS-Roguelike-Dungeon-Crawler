const randNum = (min, max) => {
  return Math.floor(Math.random()*(max-min))+min;
}

class Player {
	constructor(position){
    this.role = "player";
    this.level = 0;   
    this.health = 100;  
    this.alive = true;  
    this.weapon = { name: "Wooden Stick", attack: 7};
    this.xp = 0;
    this.position = position;
  }

  doDamage(){
    const damage = randNum(5*(this.level+1), (this.xp)/2+this.weapon.attack);
    return damage
  }

  getDamage(damage){   
    this.health -= damage;
    if(this.health <= 0){
      this.alive = false;
    }
  }

  pickUpItem(item,gain){
    switch(item){
      case "food":
        this.health += gain;
        break;
      case "weapon":
        this.weapon = gain;
        break;
      case "xp":
        this.xp += gain;
        break;
      default:
        break;
    }
  }
}

export default Player;