import React from 'react';
import Modal from 'react-modal';


class MockupFormEditor extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <>
            <Modal
                isOpen={this.props.isOpen}
                onRequestClose={this.props.onRequestClose}
                ariaHideApp={false}
            >         
                <button className="btn btn-primary"onClick={this.props.onRequestClose}> x </button>
                
            </Modal>
            </>
        );
    }

}

export default MockupFormEditor;