import React from 'react';

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
    }

    renderButton = () => {
        if(this.state.isChecked){
            return(
                <button className="btn btn-outline-secondary" onClick={this.handleClick}>
                    {this.props.children}
                </button>
            );
        }else{
            return(
                <button className="btn btn-secondary" onClick={this.handleClick}>
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