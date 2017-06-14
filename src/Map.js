import React from 'react';
import './index.css'

const Floor = () => {
	console.log("i am floor");
	return (
		<div className="floor"></div>
	)
}

const Outside = () => {
	return <div className="outside"></div>
}

const Wall = () => {
	return <div className="wall"></div>
}

class Map extends React.Component {  
	render() {
        const number = this.props.number;
        const position = this.props.position;
        let item;
        switch(number){
        	case 0: //inside
			    item = <Floor />;
			    break;
			case 1: // wall
	    		item = <Wall />;
	    		break;
	    	default: // outside
	    	    item = <Outside />;
	    };
		return <div>{item}</div>
	}
}

export default Map;
