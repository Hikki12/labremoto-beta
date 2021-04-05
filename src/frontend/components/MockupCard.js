import React from 'react';
import MockupFormEditor from './MockupFormEditor';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/MockupCard.css';


class MockupCard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            modalIsOpen: false,
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.editModal = this.editModal.bind(this);
    }

    componentDidMount(){
        
    }

    openModal(){
        this.setState({modalIsOpen: true});
    }

    closeModal(){
        this.setState({modalIsOpen: false});
    }

    editModal(){
        console.log("Editing modal...");
        this.openModal();
    }

    render(){
        return(
            <div className="card__container">

                <MockupFormEditor
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                />

                <div className="card__title">

                    <h1 className="title__name">{this.props.name}</h1>
                </div>
                <div className="card__body">
                    <div className="card__body--status">
                        <h2 className="title__status">Estado:</h2>
                        <div className="status__indicators">
                            <div className="indicator__container">
                                <div className="indicator__off"></div>
                                <h2 className="indicator__subtitle">Online</h2>
                            </div>
                            <div className="indicator__container">
                                <div className="indicator__off"></div>
                                <h2 className="indicator__subtitle">Ocupada</h2>
                            </div>
                            <div className="indicator__container">
                                <div className="indicator__off"></div>
                                <h2 className="indicator__subtitle">Reservada</h2>
                            </div>
                        </div>

                    </div>
                    <div className="card__body--description">
                        <div className="description__title--container">
                            <h2 className="description__title">Descripción:</h2>
                        </div>
                        <div className="description__body--container">
                            <p className="description">{this.props.description}</p>
                        </div>
                    </div>
                    <div className="card__body--controls row">
                        <div className="col-lg-1">
                            <NavLink  to={this.props.url} className="btn btn-outline-info">Entrar</NavLink>
                            {/* <button className="btn btn-outline-info" type="button">Entrar</button> */}
                        </div>
                        <div className="col-lg-1">
                            <button className="btn btn-outline-success" type="button">Reserva</button>
                        </div>
                        <div className="col-lg-2">
                            <button className="btn btn-outline-info" type="button">?</button>
                        </div>
                        <div className="col-lg-2">
                            <button className="btn btn-warning" onClick={this.editModal} type="button">Editar</button>
                        </div>
                        <div className="col-lg-1">
                            <button className="btn btn-danger" type="button">Editar</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MockupCard;