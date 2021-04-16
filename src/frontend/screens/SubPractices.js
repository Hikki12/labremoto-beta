import React from 'react';
import SubPracticeContainer from '../containers/SubPracticeContainer';

const data = {
    title: "MOVIMIENTO CIRCULAR UNIFORME",
    subpractices: [
        {
            type: "subpractice",
            title: "PRATICA 1",
            description: "Movimiento con aceleración",
            index:1
        },
        {
            type: "subpractice",
            title: "PRATICA 2",
            description: "Movimiento con aceleración y frecuencia",
            index:2
        }
    ]
}



class SubPractices extends React.Component {
    render(){
        return(
            <div className="container mt-1">
                <div className="title__container">
                    <h1 className="title text-center"><strong>{data.title}</strong></h1>
                    <h3 className="subtitle text-center">PRÁCTICAS</h3>
                    <hr className="col-lg-10 offset-lg-1"/>
                </div>
                <button className="btn btn-outline-info">Añadir práctica</button>
                <SubPracticeContainer data={data} url={this.props.match.url} />
            </div>
        );
    }
};

export default SubPractices;