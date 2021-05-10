import React from 'react';
import Modal from 'react-modal';
import './ModalQuiz.css';

import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';


const quiz2 = [

   { //0
      "type": "radio",
      "statement": "El periodo de una partícula se define como: ",
      "answers": [
         {"value": "El tiempo en el que realiza un ciclo completo", "isCorrect": true},
         {"value": "El número de ciclos por unidad de tiempo", "isCorrect": false},
         {"value": "El tiempo en el que se realizan varias vuelta", "isCorrect": false}
      ],
   },

   { //1
      "type": "radio",
      "statement": "La frecuencia de una partícula se define como:",
      "answers": [
         {"value": "El número de ciclos que realiza por unidad de tiempo", "isCorrect": true},
         {"value": "El tiempo en el que realiza un ciclo completo", "isCorrect": false},
         {"value": "Las vueltas que realiza hasta que se detiene", "isCorrect": false},
         {"value": "El ángulo girado en un ciclo", "isCorrect": false},

      ],
   },   

   { //2
      "type": "input",
      "statement": "Analice los resultados del experimento (en la tabla) y determine el periodo del movimiento.",
      "answers": [
         {"value": 0.45, "error": 0.1}
      ],
   },

   { //3
      "type": "input",
      "statement": "Analice los resultados del experimento (en la tabla) y determine la frecuencia del movimiento.",
      "answers": [
         {"value": 2.14, "error": 0.1}
      ],
   },  

   { //4
      "type": "radio",
      "statement": "La partícula describe un:",
      "answers": [
         {"value": "MCU", "isCorrect": true},
         {"value": "MCUV", "isCorrect": false},
         {"value": "MRU", "isCorrect": false},
         {"value": "MRUV", "isCorrect": false}
      ],    
   },
 
   { //5
      "type": "input",
      "statement": "¿Cuánto tiempo en segundos le tomaría  a la partícula  realizar 100 vueltas?",
      "answers": [
         {"value": 10 , "error": 0.05},
      ],    
   },

   { //6
      "type": "radio",
      "latex":true,
      "statement": "El tiempo transcurrido, el número de rotaciones y el periodo en un movimiento circular uniforme se relacionan mediante la expresión:",
      "answers": [
         {"value": "$\\triangle T/n$", "isCorrect": true},
         {"value": "$n/\\triangle T $", "isCorrect": false},
         {"value": "$ 2\\pi \\triangle n $", "isCorrect": false},
      ],    
   },

   { //7
      "type": "radio",
      "statement": "El periodo de rotación de la partícula depende del radio. ",
      "answers": [
         {"value": "Verdadero", "isCorrect": true},
         {"value": "Falso", "isCorrect": false},
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
        let data = props.data;
        this.quiz = quiz2;
        //this.quiz = this.modifyQuiz( data, quiz2);

        this.state = {
           quizIndex: 0,
           points: 0,
           total: quiz2.length
        }

        let array =  new Array(quiz2.length).fill(0);

        this.note = {
           points: 0,
           total: quiz2.length,
           array: array
         }

    }

    componentDidUpdate(){
         let data = this.props.data;
         //this.quiz = this.modifyQuiz(quiz2)
         this.modifyQuiz();
         //console.log("Componente cambió ", this.props.data);
      
    }

    modifyQuiz = () => {
      let newquiz = quiz2;
      let data = this.props.data;
      if(data){
         let rpm = 0.3*data.Steps;
         let freq = rpm/60;
         let period = 1/freq;
         let n_vueltas = 100/period;
         newquiz[2].answers[0].value = period;
         newquiz[3].answers[0].value = freq;
         newquiz[5].answers[0].value = n_vueltas;
         console.log("steps: ", data.Steps, "freq: ", freq, "T: ", period);
         this.quiz = newquiz;
         //console.log("Q: ", this.quiz);
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
         this.note.array[this.state.quizIndex] = 1
         this.note.points = this.note.array.reduce((a, b) => a + b, 0) ;
         if(this.note.points > this.note.total){
            this.note.points = this.note.total;
         }
      }
      else {
         this.note.array[this.state.quizIndex] = 0
         this.note.points = this.note.array.reduce((a, b) => a + b, 0) ;
         if(this.note.points < 0){
            this.note.points = 0;
         }
      }

      this.setState({
         points: this.note.points,
         total: this.note.total
      })

      //console.log("Tu calificación es: ",`${this.note.points} / ${this.note.total}`);
    }

    renderRadio = (question) => {
       //console.log("QqQ: ", question)
       return(
          <>
            {question.answers.map((answer, index) => {
               return(
                  <div className="answer__container" key={index}>
                     <button className="btn btn-outline-primary btn-lg btn-block text-left"
                     onClick={() => this.readAnswer(answer.isCorrect)}
                     >
                        {question.latex
                           ?<Latex>{answer.value}</Latex>
                           :answer.value
                        }
                        
                     </button>
                  </div>
                  
               );
         })}
      </>
       )
    }

    readInput = (e) => {
       let text = e.target.value;
       let correctValue = this.quiz[this.state.quizIndex].answers[0].value;
       let error = this.quiz[this.state.quizIndex].answers[0].error;
       let lim1 = (1 - error)*correctValue;
       let lim2 = (1 + error)*correctValue;
       let response = parseFloat(text);
       console.log("correct: ", correctValue, "text: ", text, "res: ", response);
       if (response){
          if ( response>= lim1 && response <= lim2){
            this.note.array[this.state.quizIndex] = 1
          }else{
            this.note.array[this.state.quizIndex] = 0
          }
       }
       else{
         this.note.array[this.state.quizIndex] = 0
       }

       this.note.points = this.note.array.reduce((a, b) => a + b, 0) ;
       this.setState({
         points: this.note.points,
         total: this.note.total
      })
       
    }

    renderInput = (question) => {
      return(
         <>
            <div className="answer__container" key={this.state.quizIndex}>
               <input className="form-control form-control-lg" type="text" placeholder="Introduzca un valor, ejemplo: 2,  2.14, 4.555"
               onChange={this.readInput}
               />
            </div>
         </>
      )
    }

    renderType = (question) => {
         if(question.type=="radio"){
            return this.renderRadio(question)
         }
         if(question.type=="input"){
            return this.renderInput(question)
         }
    }

    renderQuestion = (question) => {
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
                  {this.renderType(question)}
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
         <div className="note__container">
            {`Puntaje: ${this.state.points} / ${this.state.total}`}
         </div>
       );
    }

    renderQuestionIndex = () => {
      return(
          <div>
             {`${this.state.quizIndex}`}
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
                            <h1 className="quiz__title title text-center">CUESTIONARIO</h1>
                            <div className="info__container row">
                                {this.renderNote()}
                            </div>
                        </div>
                           <hr className="col-10"/>
                        {this.renderQuestion(this.quiz[this.state.quizIndex])}

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