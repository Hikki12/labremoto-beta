import React from 'react';
import Modal from 'react-modal';
import './styles/ContinueModal.css';

function ContinueModal(props) {
    return (
        <Modal 
            className="continue__modal"
            overlayClassName="continue__modal--overlay"
            isOpen={props.isOpen}
            onRequestClose={props.onRequestClose}
            ariaHideApp={false}
        >         
            <div className="continue__modal--container container">
                <button className="btn btn-light offset-md-11 col-md-1" onClick={props.onRequestClose}><strong>x</strong></button>
                <div className="continue__modal--header">
                    <p className="title">ELIMINANDO...</p>
                </div>
                <hr/>
                <div className="continue__modal--body">
                    <p className="subtitle">
                        Se eliminará <strong>{`${props.data}`}</strong>
                    </p>
                    <p className="subtitle">¿Está seguro?</p>
                </div>
                <hr/>
                <div className="continue__modal--buttons row">
                    <div className="continue__modal--button col-md-3 offset-md-6">
                        <button className="btn btn-primary" onClick={() => {props.deleteVideo(props.data)}}>Proceder</button>
                    </div>
                    <div className="continue__modal--button col-md-3">
                        <button className="btn btn-danger" onClick={props.onRequestClose}>Cancelar</button>
                    </div>
                </div>
            </div>
        </Modal>
    );
  }

export default ContinueModal;