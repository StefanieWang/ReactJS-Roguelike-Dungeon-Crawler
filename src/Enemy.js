class Enemy {
  constructor(level){
    this.role = enemy;
    this.health = 100;
    this.xp = randNum(5, 10);
  }

  getDamage(){
    const damage = randNum(6, 9);
    this.health -= damage;
    if(this.health <== 0){
      this.enemyDie(this.position, this.xp);
    }
  }
}

export default Enemy;