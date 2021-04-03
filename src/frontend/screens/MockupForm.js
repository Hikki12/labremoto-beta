import React from 'react';
import { connect } from "react-redux";
import { reducer } from '../redux/reducers';
import { useHistory } from 'react-router-dom'; // <--- import `withRouter`. We will use this in the bottom of our file.
import { addNewMockup } from '../redux/actions';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/MockupForm.css';

const MockupForm = () =>{
    const history = useHistory()

    const submitForm = (event) => {
        event.preventDefault();
        const data = {
            "name": event.target.name.value,
            "code": event.target.code.value,
            "description": event.target.description.value,
            "url": "/" + event.target.url.value
        }
        axios.post('/api/addNewMockup', data)
            .then((res) => {
                // history.push('/home');
                console.log("fue Posteado");
            })
            .catch((err) => {
                console.log("Error")
            })
    }

    return (
        <section className="container mockup__form--section">
            <div className="section__title">
                <h1 className="title text-center"> AÑADIR NUEVA MAQUETA </h1>
            </div>  
            <hr className="col-sm-10"/>
            <div className="mockup__form--container">
                <div className="mockup__form--title text-center">
                    <h2 className="title__form">Registro de nueva maqueta</h2>
                </div>
                <div className="mockup__form--body">
                    <form onSubmit={submitForm}>
                        <div className="form-group row">
                            <label htmlFor="" className="col-sm-2">Nombre de la Maqueta:</label>
                            <div className="col-sm-10">
                                <input name="name" type="text" className="form-control" placeholder="Nombre..."/>
                            </div>
                        </div>
                        
                        <div className="form-group row">
                            <label htmlFor="" className="col-sm-2">Código de la Maqueta:</label>
                            <div className="col-sm-10">
                                <input name="code" type="text" className="form-control" placeholder="código (Ej: mcu-11)"/>
                            </div>
                        </div> 
                        <div className="form-group row">
                            <label htmlFor="" className="col-sm-2">Descripción:</label>
                            <div className="col-sm-10">
                                <textarea name="description" className="form-control" cols="62" rows="5"></textarea>
                            </div>
                        </div>
                        <div className="row">
                            <label htmlFor="" className="col-sm-2">URL de la Maqueta:</label>
                            <div className="col-sm-10">
                                <input name="url" type="text" className="form-control" placeholder="Nombre..."/>
                            </div>
                        </div>
                        <div className="form-group mockup__form--buttons">
                            <button className="btn btn-outline-success btn-lg">Añadir</button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
    }




export default connect(null, {addNewMockup})(MockupForm);