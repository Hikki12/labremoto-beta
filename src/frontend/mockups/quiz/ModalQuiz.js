import React from 'react';
import Modal from 'react-modal';


const quiz_test = {
    "1":{
       "type":"text",
       "id":"1",
       "statement":"El o los ____ son de ayuda para el proyecto",
       "answers":{
          "1":{
             "value":"datos"
          },
          "2":{
             "value":"dato"
          },
          "3":{
             "value":"Datos"
          }
       }
    },
    "2":{
       "type":"radio",
       "id":"1",
       "statement":"Alg\u00fan enunciado 2",
       "answers":{
          "1":{
             "value":2,
             "correct":false
          },
          "2":{
             "value":3,
             "correct":true
          },
          "3":{
             "value":5,
             "correct":false
          },
          "4":{
             "value":7,
             "correct":false
          }
       }
    },
    "3":{
       "type":"check",
       "id":"1",
       "statement":"Alg\u00fan enunciado 3",
       "answers":{
          "1":{
             "value":2,
             "correct":false
          },
          "2":{
             "value":3,
             "correct":true
          },
          "3":{
             "value":5,
             "correct":false
          },
          "4":{
             "value":7,
             "correct":true
          }
       }
    },
    "4":{
       "type":"radio",
       "id":"1",
       "statement":"Alg\u00fan enunciado 555",
       "answers":{
          "1":{
             "value":2,
             "correct":false
          },
          "2":{
             "value":3,
             "correct":true
          },
          "3":{
             "value":5,
             "correct":false
          },
          "4":{
             "value":7,
             "correct":false
          }
       }
    },
    "5":{
       "type":"radio",
       "id":"1",
       "statement":"Una pregunta más",
       "answers":{
          "1":{
             "value":2,
             "correct":true
          },
          "2":{
             "value":3,
             "correct": false
          },
          "3":{
             "value":5,
             "correct":false
          },
          "4":{
             "value":7,
             "correct":false
          }
       }
    },
    "6":{
       "type":"check",
       "id":"1",
       "statement":"Una pregunta más 6",
       "answers":{
          "1":{
             "value":2,
             "correct":true
          },
          "2":{
             "value":3,
             "correct": true
          },
          "3":{
             "value":5,
             "correct":true
          },
          "4":{
             "value":7,
             "correct":false
          }
       }
    },
    "7":{
       "type":"radio",
       "id":"1",
       "statement":"Una pregunta más 7 ",
       "answers":{
          "1":{
             "value":2,
             "correct":true
          },
          "2":{
             "value":3,
             "correct": false
          },
          "3":{
             "value":5,
             "correct":false
          },
          "4":{
             "value":7,
             "correct":false
          }
       }
    },
    "8":{
       "type":"text",
       "id":"1",
       "statement":"Una pregunta _____ más 8 ",
       "answers":{
          "1":{
             "value":"diego",
             "correct":true
          }
       }
    }
 }


const customStyles = {
    content : {
      marginTop: '1rem',
    }
};    


class ModalQuiz extends React.Component {
    constructor(props){
        super(props);
        
    }

    renderAnswer(type, answers){
        let arrAnswers = this.jsonToArray(answers);
        console.log("Arr Answers:", arrAnswers);

        if(type==="text"){
            return(
                <div>
                    <input type="text" className="form-control" placeholder="su respuesta es..."/>
                </div>
                
            );
        }else if(type==="check"){
            return(
                arrAnswers.map((ans) =>{
                    return(
                        <div>
                            <input className="form-check-input" type="checkbox"/>
                            <label htmlFor="form-check-label">{ans.value}</label>
                        </div>
                    );
                })
            );
        } else if(type==="radio"){
            return(
                arrAnswers.map((ans) => {
                    return(
                        <div>
                            <input className="form-check-input" type="checkbox"/>
                            <label htmlFor="form-check-label">{ans.value}</label>
                        </div>
                    );
                })
            );
        }

    }

    renderQuestion(question, key){
        console.log("Question: ", question)
        let statement = question.statement;
        let type = question.type;
        let answers = question.answers;
        return(
            <div className="statement__quiz title" key={key}>
                {statement}
                {this.renderAnswer(type, answers)}
            </div>
            
        ); 
    }

    jsonToArray(json){
        let arr = [];
        Object.keys(json).forEach((key) => {
            arr.push(json[key])
        })  
        return arr;
    }

    renderQuiz(){
        if (!this.props.isOpen){
            return(<></>)
        }
        
        let questions = this.jsonToArray(quiz_test);

        return(
            <div>
                {questions.map((question, indx) =>{
                    return this.renderQuestion(question, indx)
                })}
            </div>
        );

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
                    <div className="container scrollable">
                        <div className="container__title">
                            <h1 className="title text-center">CUESTIONARIO</h1>
                            <div className="timer__count col-lg-2">
                                30:00
                            </div>
                        </div>
                        <div className="container__quiz">
                            {this.renderQuiz()}
                        </div>
                        
                    </div>
                </Modal>
            </div>
        )
    }
}

export default ModalQuiz;