import React from 'react';
import './styles/ToogleButton.css';


class ToogleButton extends React.Component {

    constructor(props){
        super(props);
        let value = false;

        if(props.isChecked){
            value = true;
        }

        this.state = {
            isChecked: value
        }
        this.checked = value;
            
    }

    componentDidMount() {

    }

    setChecked = (state) => {
        this.checked = state;        
        this.setState({
            isChecked: state
        });

       
    }

    isChecked = () => {
        return this.checked
    }

    handleClick = () => {
        this.checked = !this.checked;
        this.setState({
            isChecked: !this.state.isChecked
        });
        if(this.props.onClick){
            this.props.onClick();
        }
        
    }

    renderOnClass = () => {
        if(this.props.onClass){
            return this.props.onClass
        }
        else{
            return "btn btn-secondary"
        }
    }
    
    renderOffClass = () => {
        if(this.props.offClass){
            return this.props.offClass
        }else{ 
            return "btn btn-outline-secondary nohover"
            
        }
    }

    renderButton = () => {
        let {onClass, offClass, checkedText, onClick, ...props} = this.props;
        if(this.state.isChecked){
            return(
                <button className={this.renderOnClass()}  aria-pressed="true" onClick={this.handleClick} 
                    {...props}
                >
                    {this.props.checkedText
                    ?this.props.checkedText
                    :this.props.children}
                </button>
            );
        }else{
            return(
                <button className={this.renderOffClass()}  aria-pressed="true" onClick={this.handleClick} 
                    {...props}
                >
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