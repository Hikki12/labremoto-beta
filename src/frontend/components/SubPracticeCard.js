import React from 'react';
import { Link } from 'react-router-dom';
import './styles/SubPracticeCard.css';
import './styles/MockupCard.css';
import { data } from 'jquery';

const SubPracticeCard = (props) => {
    return(
        <div className="container__card col-xl-6">
            <div className="card__container">
                <div className="container__card--title">
                    <h1 className="practice__title">{props.data.title}</h1>
                </div>
                <div className="container__card--body">
                    <div className="card__body--description">
                        <p className="description">{props.data.description}</p>
                    </div>
                </div>
                <div>
                    <div className="buttons__container row">
                        <div className="button__container col-md-2">
                            {console.log("PROPS ", props)}
                            <Link to={props.url + "/" + props.data.index.toString()} className="btn btn-outline-primary">Ingresar</Link> 
                        </div>
                        <div className="button__container col-md-2">
                            <button className="btn btn-outline-secondary">Editar</button> 
                        </div>
                        <div className="button__container col-md-2 offset-md-2">
                            <button className="btn btn-outline-danger">Eliminar</button> 
                        </div>                   
                    </div>
                </div>
            </div>
           

        </div>
    )
}

export default SubPracticeCard;