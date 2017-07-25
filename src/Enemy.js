const randNum = (min, max) => {
  return Math.floor(Math.random()*(max-min))+min;
}


class Enemy {
  constructor(level){
    this.level = level;
    this.role = "enemy";
    this.health = 40*(level+1) > 100 ? 100 : 40*(level+1);
    this.alive = true;
    this.fight = false;
    this.attack = 7*(level+1);
    this.xp = 5;
  }

  doDamage(){
    const damage = randNum(5, this.attack);
    return damage;
  }

  getDamage(damage){    
    this.health -= damage;
    if(this.health <= 0){
     this.alive = false;
    }
  }

}

class Boss extends Enemy {
  constructor(level){
    super(level);
    this.level = 4;
    this.role = "boss";
    this.health = 250;
    this.attack = 100;
  }
}

export { Boss, Enemy }