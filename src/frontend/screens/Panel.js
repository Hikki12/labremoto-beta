import React from 'react';
import { connect } from "react-redux";
import axios from 'axios';
import MockupsCardsList from '../components/MockupsCardsList';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Panel.css';

const api = "http://localhost:8000/mockups";

class PanelPage extends React.Component { 
        state = {
            loading: true,
            error: null,
            mockups: [],
        }

        componentDidMount() {
            this.requestMockups();
        }

        requestMockups(){
            axios.get(api)
                .then((res) =>{
                    this.setState({
                        loading: false,
                        mockups: res.data,
                    })
                        
                })
        }

        render(){
            return(
                <section className="panel__section">
                    <div className="container">
                        <div className="title__container"> 
                            <h1 className="title text-center">PRÁCTICAS</h1>
                            <h2 className="subtitle text-center">Maquetas disponibles</h2>
                            <hr className="col-sm-10"/>
                        </div>
                        <div className="cards__container">
                            <NavLink to="/addMockup" className="btn btn-primary">Añadir Nueva Maqueta</NavLink>
                            <MockupsCardsList data={this.state.mockups}/>
                        </div>
                    </div>
                </section>
            )
        }
}


const mapStateToProps = (state) => {
    return ({
        mockups: state.mockups
    })
}

export default connect(mapStateToProps)(PanelPage);