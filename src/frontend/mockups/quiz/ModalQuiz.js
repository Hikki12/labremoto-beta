import React from 'react';
import Modal from 'react-modal';
import './ModalQuiz.css';


const quiz2 = [
   {
      "type": "radio",
      "statement": "El movimiento que usted ha observado, se aproxima más a:",
      "answers": [
         {"value": "Movimiento Circular Uniforme", "isCorrect": true},
         {"value": "Movimiento Circular Uniformemente Acelerado", "isCorrect": false},
         {"value": "Movimiento Giratorio", "isCorrect": false}
      ],
   },
   {
      "type": "input-numerical",
      "statement": "Algo",
      "answers": [
         {"value": "1", "isCorrect": true},
         {"value": "2", "isCorrect": true},
         {"value": "3", "isCorrect": false}
      ],    
   } 

];




const customStyles = {
    content : {
      marginTop: '1rem',
    }
};    


class ModalQuiz extends React.Component {
    constructor(props){
        super(props);
        this.state = {
           quizIndex: 0,
           points: 0,
           total: quiz2.length
        }

        this.note = {
           points: 0,
           total: quiz2.length
         }

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

    readAnswer = (value) => {
      if(value){
         this.note.points++;
         if(this.note.points > this.note.total){
            this.note.points = this.note.total;
         }
      }
      else {
         this.note.points--;
         if(this.note.points < 0){
            this.note.points = 0;
         }
      }
      this.setState({
         points: this.note.points,
         total: this.note.total
      })

      console.log("Tu calificación es: ",`${this.note.points} / ${this.note.total}`);
    }

    renderQuestion(question){
      return(
         <div className="question__container">
            <div className="statement__container">
               {/* <h1 className="title h-100 align-middle">{question.statement}</h1> */}
               <div className="col-sm-12 question__statement title">
                  {question.statement}
               </div>
            </div>
            <div className="answers__container">
               <div className="answers__container--aligner">
               
                  {question.answers.map((answer, index) => {
                        return(
                           <div className="answer__container" key={index}>
                              <button className="btn btn-outline-primary btn-lg btn-block text-left"
                              onClick={() => this.readAnswer(answer.isCorrect)}
                              >
                                 {answer.value}
                              </button>
                           </div>
                           
                        );
                  })}
               </div>
            </div>
       </div>      
      ); 
    }

    nextQuestion = () => {
       let n_questions = quiz2.length - 1;
       let index = this.state.quizIndex;
       if(index < n_questions){
          this.setState({
             quizIndex: index + 1
          });
       }
    }

    previousQuestion = () => {
       let index = this.state.quizIndex - 1;
       if(index <= 0){
          index = 0
       }
       this.setState({
         quizIndex: index
       });
    }

    renderNote = () => {
       return(
         <div>
            {`${this.state.points} / ${this.state.total}`}
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
                            <div className="info__container row">
                                {this.renderNote()}
                            </div>
                        </div>
                           <hr className="col-10"/>
                        {this.renderQuestion(quiz2[this.state.quizIndex])}

                        <div className="quiz__buttons--section">
                           <div className="quiz__buttons--container offset-9">
                              <div className="quiz__buttons row">
                                    <div className="quiz__button--container">
                                       <button onClick={this.previousQuestion} className="btn btn-secondary btn-lg">Anterior</button>
                                    </div>
                                    <div className="quiz__button--container ml-2">
                                       <button onClick={this.nextQuestion} className="btn btn-primary btn-lg">Siguiente</button>
                                    </div>
                              </div>
                           </div>

                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default ModalQuiz;