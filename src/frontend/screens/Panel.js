import React from 'react';
import { connect } from "react-redux";
import axios from 'axios';
import MockupsCardsList from '../components/MockupsCardsList';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Panel.css';
import Spinner from 'react-loader-spinner';
const api = "/mockups";


class PanelPage extends React.Component { 
        state = {
            loading: true,
            error: null,
            mockups: null,
        }

        componentDidUpdate(prevProps, prevState, snapshot){
            console.log("prev: ", prevState)
        }

        componentDidMount() {
            if(!this.state.mockups){
                this.requestMockups();
            }else{
                console.log("Ya existe111");
            }
            
        }

        requestMockups(){
            axios.get(api)
                .then((res) => {
                    this.setState({
                        loading: false,
                        mockups: res.data.mockups,
                    });
                });
        }

        render(){
            
            return(
                <section className="panel__section">
                
                    <div className="container">
                        <div className="title__container"> 
                            <h1 className="title text-center">EXPERIMENTOS</h1>
                            <h2 className="subtitle text-center">Maquetas disponibles</h2>
                            <hr className="col-sm-10"/>
                        </div>
                        <div className="card">
                            <NavLink to="/addMockup" className="btn btn-primary col-6 col-md-3 mt-4 ml-4">Añadir Nueva Maqueta</NavLink>
                            {this.state.mockups
                            ?<MockupsCardsList data={this.state.mockups}/>
                            :<div className="text-center mt-5">
                            <Spinner 
                                className="mt-5"
                                color="#00BFFF"
                                type="TailSpin"
                                color="#007bff" 
                                height={140}
                                width = {140}
                            />
                        </div>
                            }                      
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