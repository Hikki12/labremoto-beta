import React from 'react';
import './styles/RangeSlider.css';


class RangeSlider extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            value: 0
        };
       this.myref = React.createRef();
    }


    Value = () => {
        return parseInt(this.myref.current.value, 10)
    }

    setValue = (value) =>{
        if(this.myref.current){
            this.myref.current.value = value;
        }
    }

    render(){
        
        return(
            <div className="slidecontainer">
                <input className="slider" type="range" ref={this.myref} {...this.props}/>
            </div>
        )
    }
}

export default RangeSlider;