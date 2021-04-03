import React from 'react';
import './styles/RadioButton.css';

const RadioButton = (props) => {
    return(
        <>
            <input type="radio"/>
            <label>{props.text}</label>
            <div className="check"></div>
        </>
    );  
}

export default RadioButton;

