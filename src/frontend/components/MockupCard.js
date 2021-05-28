import React from 'react';
import MockupFormEditor from './MockupFormEditor';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/MockupCard.css';


class MockupCard extends React.Component {
    constructor(props){
        super(props);
        let description = "...";
        let topic = "...";
        let materials = "...";
        if(props.descriptions){
            description = props.descriptions[0];
            topic = props.data.topics[0]
            materials = props.data.materials[0]
        }
        this.state = {
            modalIsOpen: false,
            index:0,
            description: description,
            topic: topic,
            materials: materials
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

    selectorChange = (e) => {
        //console.log("Props,", this.props.descriptions);
        let index = e.target.selectedIndex;
        if(this.props.descriptions){
            this.setState({
                index: index,
                description: this.props.descriptions[index],
                topic: this.props.data.topics[index],
                materials: this.props.data.materials[index]
            });
        }

    }
    render(){
        return(
            <div className="card__container mx-4">

                <MockupFormEditor
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                />

                <div className="card__title">
                    <div className="col-7 col-md-10">
                        <h1 className="title__name">{this.props.name}</h1>
                    </div>
                    
                    <div className="col-5 col-md-2">
                    {this.props.descriptions &&
                    
                        <select onChange={this.selectorChange} className="form-control form-control-md">  
                            {this.props.descriptions.map((value, index) =>{
                                return(
                                    <option key={`opt-${index}`} defaultValue={index}>
                                        {`Práctica ${index + 1}`}
                                    </option>
                                )
                            })}  
                        </select>
                        }
                    </div>
               
                </div>
                <div className="card__body">
                    <div className="card__body--topic">
                        <div className="description__title--container">
                            <h2 className="description__title">TEMA:</h2>                         
                        </div>
                        <div className="description__body--container">
                            <p className="description">  {this.state.topic}</p>
                        </div>   
                    </div>
                    <hr/>
                    <div className="card__body--topic">
                        <h2 className="description__title">MATERIALES:</h2>
                        <div>
                            <p className="overflow-auto">{this.state.materials}</p>
                        </div>    
                    </div>
                    <hr/>
                    <div className="description__title--container">
                        <h2 className="description__title">Descripción:</h2>
                    </div>

                    <div>
                        <div className="description__body--container">
                            <p className="description">{this.state.description}</p>
                        </div>
                    </div>
                    <hr/>
                    <div className="card__body--controls row mt-4">
                        <div className="col-lg-1">
                            <Link  
                                to={{
                                    pathname: this.props.url + "/" + this.state.index.toString(),
                                    state: {info: this.props.data} // your data array of objects
                                  }} 
                                className="btn btn-outline-info"
                            >
                                Entrar
                            </Link>
                            {/* <button className="btn btn-outline-info" type="button">Entrar</button> */}
                        </div>
                        <div className="col-md-1">
                            <button className="btn btn-outline-success" type="button">Reserva</button>
                        </div>
                        <div className="col-md-1">
                            <button className="btn btn-outline-info" type="button">?</button>
                        </div>
                        <div className="col-md-1">
                            <button className="btn btn-warning" onClick={this.editModal} type="button">Editar</button>
                        </div>
                        <div className="col-md-1">
                            <button className="btn btn-danger" type="button">Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MockupCard;