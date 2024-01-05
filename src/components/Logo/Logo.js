import React from "react";
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import eye from './eye-icon-1483.png';
const Logo = () => {
    return (
        <div className="ma4 mt0">
            <Tilt style={{height:'100px', width:'100px'}} className="ba2 shadow-2">
                <div className="Tilt-inner pa3">
                    <img alt="logo" src={eye}/>
                </div>
             </Tilt>
        </div>
    );
}

export default Logo;