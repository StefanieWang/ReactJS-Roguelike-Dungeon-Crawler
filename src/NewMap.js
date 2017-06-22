const wallExist = (walls, newWalls) => {
  return newWalls.find((position) =>{
          return walls.includes(position);
        });

}

const invalidWall = (newWalls) => {
  const width = 600;
  const height = 40;
  const squareSize = 20;
  const totalSquareNumber = width*height/squareSize -1;

  const validWall = newWalls.every((position) => {     
      return position <= totalSquareNumber
   })
  return !validWall;
}

const getNewDoorPosition = (newWalls) => {
  const randIndex = Math.floor(Math.random()*(newWalls.length))
  const newDoor = newWalls[randIndex];
  return newDoor;
}

const generateWall = (start, arr, accumulator) => {
  let i = start;
  const wall = arr.map(() => {
    const item = i;
    i += accumulator;
    return item;
  })
  return wall;
}

const generateWalls = (roomSize, door) => {
  
  const RWidth = roomSize[0]+1;
  const RLength = roomSize[1]+1;
  const arrW = new Array(RWidth).fill(0);
  const arrL = new Array(RLength).fill(0);
  const offsetL = Math.floor(Math.random()*RLength/2+1)*30;
  const offsetW = Math.floor(Math.random()*RWidth/2);
  const offset = Math.random()>.5 ? offsetL : offsetW;
  
  const start = door - offset;
  let wallTop, wallBottom, wallRight, wallLeft;

  if(offset === offsetL){    
    wallTop = generateWall(start, arrW, 1);
    wallLeft = generateWall(wallTop[0], arrL, 30);
  } else {
    wallLeft =  generateWall(start, arrL, 30);
    wallTop = generateWall(wallLeft[0], arrW, 1)
  };

  const wallBottom = generateWall(wallLeft[RLength-1], arrW, 1);
  const wallRight = generateWall(wallTop[RWidth-1], arrL, 30);
  const walls = wallTop.concat(wallBottom, wallLeft, wallRight);
  const floor = ["area within the walls"];
  /*console.log("wallTop: "+ wallTop);
  console.log("wallLeft: " + wallLeft);
  console.log("wallBottom: " + wallBottom);
  console.log("wallRight: " + wallRight);*/
  
  console.log("walls: "+ walls);
  return walls;
}

const generateRoom = (walls) => {
  const roomSize = [Math.floor(Math.random()*5+5), Math.floor(Math.random()*5+5)];
  const doorPosition = walls.length ? getNewDoorPosition(walls): 32;
  
  
  const newWalls = generateWalls(roomSize, doorPosition);
  if(wallExist(walls, newWalls) ||
     invalidWall(newWalls)){
    
   console.log("wallExist: "+wallExist(walls, newWalls));
   console.log("invalidWall: "+invalidWall(newWalls));
   console.log("walls: "+ walls+ " newWalls: "+ newWalls);
   
   generateRoom(walls, doorPosition);
  }else{
   /* const newDoor = getNewDoorPosition(newWalls);
    const newRoom = {walls: newWalls, doorPosition: newDoor};
    return newRoom;*/
    return newWalls;
  }
  
}

const NewWalls = () => {
  /*const numRoom  = Math.floor(Math.random()*4+5);*/
  const numRoom = 1;
  console.log(numRoom );
  let walls = [];
  /*let doorPosition = 2;*/
  for(let count=0; count<numRoom; count++){   
    const newRoom = generateRoom(walls);
    walls = walls.concat(newRoom);
    
    console.log("room: "+ count);
  }
  return walls;
}
const NewMap = () => {
  const walls = NewWalls();
  const map = new Array(600).fill(2).map((item, index) => {
    let newitem;
    if(walls.find((position) =>{return position == index})){
      newitem = 1;
    }else{
      newitem = item;
    }
    return newitem;
  })
  return map;
}
export default NewMap;