const BoardSizeX = 20,
      BoardSizeY = 30,
      MaxRoomSize = 8,
      MinRoomSize = 5,
      MaxRoomNum = 7,
      MinRoomNum = 5;


const randNum = (max, min) => {
    return Math.floor(Math.random()*(max - min ) + min);
}

const findWall = (start, roomSize, type) => {
    const startX = start[0];
	const startY = start[1];
	let wall = [];
	if(type==="hori"){
		const x = startX;		
		let y = startY;
		for(let i=0; i<roomSize-1; i++){
			y++;
           wall.push([x,y])
		}
	}else if(type === "verti"){
		const y = startY;
		let x = startX;
		for (let i=0; i<roomSize-1; i++){
            x++;
            wall.push([x,y])
		}
	}
	return wall;
}

const findFloors = (start, end) => { // start is the top left position, 
	let floors = [];                // end is the bottom right position of a room
	for(let x=start[0]+1; x<end[0]; x++){
		for(let y=start[1]+1; y<end[1]; y++){
            floors.push([x,y]);
		}
	}
	return floors;
}

//start is the starting position to generate walls, it's an array[x,y] 
const generateWalls = (start, roomSizeX, roomSizeY) => {
	const wallTop = findWall(start, roomSizeY, "hori");
	const wallLeft = findWall(start, roomSizeX, "verti");
	const wallRight = findWall(wallTop[roomSizeY-2], roomSizeX, "verti");
	let wallBottom = findWall(wallLeft[roomSizeX-2], roomSizeY, "hori");
	wallBottom.pop() // remove the repeated position

	const walls = [start].concat(wallTop, wallLeft, wallBottom, wallRight);
	return walls;
}

const generateNewRoom = (start, roomSizeX, roomSizeY) => {	
    const walls = generateWalls(start, roomSizeX, roomSizeY);
    const end = walls[walls.length - 1]; // the bottom right position of a room
    const floors = findFloors(start, end);
    return {"walls": walls, "floors": floors}; //an enclosed room without doors

}

const findInArray = (item, array) => {
	return array.find((i) => {
	        return i[0]===item[0]&&i[1]===item[1]
	    })
}

const getDoorDir = (door, walls, floors) => {
	const x = door[0];
	const y = door[1];
    const dir = {
    	"up": [x-1, y],
    	"down": [x+1, y],
    	"left": [x, y-1],
    	"right": [x, y+1]
    };
    const roomArea = floors.concat(walls);
    let doorDir;
    if(!findInArray(dir.up, roomArea) && findInArray(dir.down, floors)){
    	doorDir = "up";
    }else if(!findInArray(dir.down, roomArea) && findInArray(dir.up, floors)){
    	doorDir = "down";
    }else if(!findInArray(dir.left, roomArea) && findInArray(dir.right, floors)){
    	doorDir = "left";
    }else if(!findInArray(dir.right, roomArea) && findInArray(dir.left , floors)){
    	doorDir = "right";
    }

    return doorDir;
}

//get starting position of a new room
const getNewStartPos = (newDoor, doorDir, roomSizeX, roomSizeY) => {
	let offset;
	const x = newDoor[0];
	const y = newDoor[1];
	let start = [];
	if(doorDir === "up" || doorDir === "down"){
		offset = randNum(-1, -roomSizeY+2);
        start = [x, y+offset];
	}else{
		offset = randNum(-1, -roomSizeX+2);
		start = [x+offset, y];
	}; 
    return start; 
}

const generateRoom = (door, doorDir, 
    	       maxRoomSize=MaxRoomSize, minRoomSize=MinRoomSize) => {
	const dir = (x, y) => {
    	return {"up": [x-1, y],
    	    	"down": [x+1, y],
    	    	"left": [x, y-1],
    	    	"right": [x, y+1]
    	    }
    };
    
    const aisle = dir(door[0],door[1])[doorDir];
    const newDoor = dir(aisle[0], aisle[1])[doorDir];
    const roomSizeY = randNum(maxRoomSize, minRoomSize);
	const roomSizeX = randNum(maxRoomSize, minRoomSize);
    const start =  getNewStartPos(newDoor, doorDir, roomSizeX, roomSizeY);
    let newRoom = generateNewRoom(start, roomSizeX, roomSizeY);
    newRoom.floors.push(aisle, newDoor);
    return newRoom;
}

const isInvalidRoom = (newRoom, walls, floors, 
                    boardSizeX = BoardSizeX, boardSizeY = BoardSizeY) => {
    const existRoomArea = walls.concat(floors);
    const newRoomArea = newRoom.walls.concat(newRoom.floors)
    let invalid = false;
    //check if tile exist
    const areaExist = newRoomArea.find((tile) => {
        return findInArray(tile, existRoomArea)
    })
    //check if out of board
    const outOfBoard = newRoom.walls.find((wallTile) => {
        return (wallTile[0] < 0 ||
            wallTile[0] >= boardSizeX ||
            wallTile[1] < 0 ||
            wallTile[1] >= boardSizeY)
    })

    return !!(areaExist) || !!(outOfBoard);
}

const getRandDoor = (walls) => {
    const randIndex = randNum(walls.length - 1, 1);
    return walls[randIndex];//door is a random position found in walls, door is an array[x,y];
}


const placeNewRoom = (walls, floors) => {   
    let door, doorDir, newRoom;
    door = getRandDoor(walls);
    doorDir = getDoorDir(door, walls, floors);
    if(doorDir) {
        newRoom = generateRoom(door, doorDir);
        if(isInvalidRoom(newRoom, walls, floors)){
            newRoom = false;
        }else {
            newRoom.floors.push(door);
        }
    }else{ //undefined door direction, invalide door
        newRoom = false;
    };  
    return newRoom;
}

//roomNum is the number of rooms need to be generated,
//firstRoom is an object like {walls: [], floors:[]}, containing positions of first room
const NewDungeon = (boardSizeX = BoardSizeX, boardSizeY = BoardSizeY, 
	                maxRoomNum = MaxRoomNum, minRoomNum = MinRoomNum, 
	                maxRoomSize = MinRoomSize, minRoomSize = MaxRoomSize) => {
    let map = [];
    for(let x=0; x<boardSizeX; x++){ //generate a 2D array of the map
        map[x] = [];
    	for(let y=0; y<boardSizeY; y++){
            map[x][y]=0;//number 0 for area outside of rooms
    	}
    	
    };
    
    let rooms = [];//array of rooms, each item is an oject {walls: [], floors:[]}
    const start = [2, 2];//the starting position of first room
    const roomSizeY = randNum(maxRoomSize, minRoomSize);
	const roomSizeX = randNum(maxRoomSize, minRoomSize);
    const firstRoom = generateNewRoom(start, roomSizeX, roomSizeY);//firstRoom is an object {walls: [], floors:[]}
    
    let roomNum = randNum(maxRoomNum, minRoomNum);
    let walls = firstRoom.walls;
    let floors = firstRoom.floors;
    
    
    while(roomNum){
        let newRoom = placeNewRoom(walls, floors);
        if(newRoom){
            walls = walls.concat(newRoom.walls);
            floors = floors.concat(newRoom.floors);
            roomNum--;
        }
    }   

    walls.forEach((wallPos) => {
    	let x= wallPos[0];
    	let y= wallPos[1];
		map[x][y] = 1; // number 1 for walls
 
    });

    floors.forEach((floorPos) => {
    	let x = floorPos[0];
    	let y = floorPos[1];
    	map[x][y] = 1; //number 1 for floors
    });


    return {
        gameMap: map, 
        floors: floors.concat(walls),
        
    };
}

export default NewDungeon;