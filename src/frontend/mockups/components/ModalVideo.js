import React from 'react';
import Modal from 'react-modal';
import VideoLister from '../../components/videoLister';


const customStyles = {
    content : {
      marginTop: '1rem',
    }
  };    

class ModalVideo extends React.Component {
    constructor(props){
        super(props);
    }
    
    render(){
        return(
            <div>
                <Modal
                    isOpen={this.props.isOpen}
                    onRequestClose={this.props.onRequestClose}
                    ariaHideApp={false}
                >         
                    <button className="btn btn-primary" onClick={this.props.onRequestClose}> x </button>
                    <VideoLister />
                </Modal>
            </div>
        )
    }
}

export default ModalVideo;