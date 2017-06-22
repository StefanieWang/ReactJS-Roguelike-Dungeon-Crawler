import React from 'react';
import './index.css'

const Floor = (props) => {
	return (
		<div className="floor">{props.position}</div>
	)
}

const Outside = (props) => {
	return <div className="outside">{props.position}</div>
}

const Wall = (props) => {
	return <div className="wall">{props.position}</div>
}

class Map extends React.Component {  
	render() {
        const number = this.props.number;
        const position = this.props.position;
        let item;
        switch(number){
        	case 0: //inside
			    item = <Floor position={position} />;
			    break;
			case 1: // wall
	    		item = <Wall position={position} />;
	    		break;
	    	default: // outside
	    	    item = <Outside position={position} />;
	    };
	   
		return <div>{item}</div>
	}
}

export default Map;




