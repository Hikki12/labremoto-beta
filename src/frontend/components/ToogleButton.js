import React from 'react';
import './styles/ToogleButton.css';


class ToogleButton extends React.Component {

    constructor(props){
        super(props);
        let value = false;
        this.state = {
            isChecked: value
        }
    }

    handleClick = () => {
        this.setState({
            isChecked: !this.state.isChecked
        });
        if(this.props.myref){
            this.props.myref.current.checked = this.state.isChecked;
        }
        if(this.props.onClick){
            this.props.onClick();
        }
        
        //console.log("This PROPS REF: ", this.props.myref)
    }

    renderButton = () => {
        if(this.state.isChecked){
            return(
                <button className="btn btn-outline-secondary nohover"  aria-pressed="true" onClick={this.handleClick}>
                    {this.props.children}
                </button>
            );
        }else{
            return(
                <button className="btn btn-secondary"  aria-pressed="true" onClick={this.handleClick}>
                    {this.props.children}
                </button>
            );
        }
    }

    render(){
        return(
            <>
                {this.renderButton()}
            </>
            
        )
    }
}

export default ToogleButton;