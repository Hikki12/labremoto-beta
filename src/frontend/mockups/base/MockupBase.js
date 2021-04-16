import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MockupBase.css';
import MockupClientIO from '../mockup-client/MockupIO-client';
import RadioButton from '../components/RadioButton';
import ModalVideo from '../components/ModalVideo';
import ModalQuiz from '../quiz/ModalQuiz';
import { set } from 'mongoose';


class MockupBase extends React.Component {
    
    clientIO;

    constructor(props){
        super(props);
        this.state = {
            modalIsOpen: false,
            quizIsOpen: false
        };


        this.vars = {
            videoImg: React.createRef(),
            dirBtn: React.createRef(),
            lightBtn: React.createRef(),
            r1Btn: React.createRef(),
            r2Btn: React.createRef(),
            r3Btn: React.createRef(),
            slider: React.createRef(),
            playBtn: React.createRef(),
            recordBtn: React.createRef(),
            recordTime: React.createRef(),
            sliderLabelValue: React.createRef()
        }

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openQuiz = this.openQuiz.bind(this);
        this.closeQuiz = this.closeQuiz.bind(this);
        this.sendUpdates = this.sendUpdates.bind(this); 

    }

    componentDidMount() {
        this.clientIO = new MockupClientIO(name="MAQUETA-MCU");
        this.clientIO.newFrameReady(this.displayVideoImage.bind(this));
        this.clientIO.reciveUpdates(this.reciveFromServer.bind(this));
        //this.clientIO.updatesRequest(this.sendUpdates.bind(this));
        if(this.props.mode < 1){
            this.randomRadio();
            this.randomSpeed();
            this.randomDir();
            this.autoStart(2000);
        }else{
            this.clientIO.updatesRequest(this.sendUpdates.bind(this));
        }
    }

    autoStart = (time=1000) => {
        this.vars.playBtn.current.checked = false;
        setTimeout(()=>{
            console.log("Auto Starting...");
            this.sendUpdates();
        }, time)
    }

    classHide = (name) => {
        let mode = this.props.mode;
        let hide = true;
        if (mode >= 1){
            hide = false;
        }
        if(hide){
            return "hide"
        }
        
        if(name == "radios"){
            return "radios__container--button"
        }
        if(name == "play"){
            return "play__container";
        }
        if(name == "recordTime"){
            return "recordTime__container";
        }
        if(name == "clockwise"){
            return "clockwise__container";
        }
        if(name == "slider"){
            return "slider__container";
        }
    }

    chooseRadio = (radio) => {
        switch(radio){
            case 1:
                this.vars.r1Btn.current.checked = true;
                break;
            case 2:
                this.vars.r2Btn.current.checked = true;
                break;
            case 3:
                this.vars.r3Btn.current.checked = true;
                break;
        }
    }

    reciveFromServer(variables){
        console.log("Reciving variables", variables);
        this.vars.dirBtn.current.checked = !variables.DirState;
        this.chooseRadio(variables.Radio);
        this.vars.sliderLabelValue.current.innerHTML  = (0.3*variables.Steps).toFixed(1);
        this.vars.slider.current.value = variables.Steps;
        this.vars.playBtn.current.checked = !variables.PlayState;
        this.vars.recordBtn.current.checked = variables.Recording;
        this.vars.slider.current.value = variables.Steps;
        this.vars.recordTime.current.value = variables.RecordingTime;
        this.vars.lightBtn.current.checked = variables.LightState;
    }

    sendUpdates(){
        let radio = 0;

        if(this.vars.r1Btn.current.checked){
            radio = 1;
        }
        if(this.vars.r2Btn.current.checked){
            radio = 2;
        }
        if(this.vars.r3Btn.current.checked){
            radio = 3;
        }

        let variables = {
            ID: "MAQUETA-MCU",
            PlayState: !this.vars.playBtn.current.checked,
            DirState: !this.vars.dirBtn.current.checked,
            LightState: this.vars.lightBtn.current.checked,
            Radio: radio,
            Recording: this.vars.recordBtn.current.checked,
            Steps: parseInt(this.vars.slider.current.value),
            RecordingTime: parseInt(this.vars.recordTime.current.value, 10),
        }
        console.log("Variables to send: ", variables);
        this.clientIO.sendToServer(variables);
    }

    randomRadio = () => {
        let radio = Math.floor(Math.random() * (3 - 1) ) + 1;
        this.chooseRadio(radio);
    }

    randomSpeed = () => {
        const max = 100;
        const min = 30;
        let speed = Math.floor(Math.random() * (max - min) + min);
        this.vars.slider.current.value = speed;
        this.updateSpeedLabel()
    }
    randomDir = () => {
        this.vars.dirBtn.current.checked = Math.random() < 0.5;
    }

    componentWillUnmount(){
        this.clientIO.close();
    }

    displayVideoImage(frame64) {
        this.vars.videoImg.current.src = 'data:image/jpeg;base64,' + frame64;
    }

    openModal(){
        this.setState({modalIsOpen: true});
    }

    closeModal(){
        this.setState({modalIsOpen: false});
    }

    openQuiz(){
        this.setState({quizIsOpen: true});
    }

    closeQuiz(){
        this.setState({quizIsOpen: false});
    }

    updateSpeedLabel = () => {
        this.vars.sliderLabelValue.current.innerHTML = (0.3*this.vars.slider.current.value).toFixed(1);
    }

    render() {
        return(
            <div className="section">
                
                <ModalVideo 
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                />

                <ModalQuiz
                    isOpen={this.state.quizIsOpen}
                    onRequestClose={this.closeQuiz}
                />

                <div className="section__title">
                     {this.props.name
                     ?<div className="title mockup__title">{this.props.name}</div>
                     :<div className="title mockup__title">Mockup Name</div>
                     }
          
                </div>
                <div className="view__container">
                        <button className="btn btn-primary mr-5" onClick={this.openQuiz}>Quiz</button>
                </div>   
                <div className="row view__container">

                     <div className="col-sm-6 image__container">
                        <div className="image__container--elements ">
                                <img className="video" id="video-img" ref={this.vars.videoImg}/>
                                <div className="light__container">
                                    <input id="lightBtn" type="checkbox" ref={this.vars.lightBtn} onClick={this.sendUpdates}/>
                                    <label htmlFor="lightBtn"></label>
                                </div>
                                <button className="btn btn-success" onClick={this.openModal}>Results</button>
                        </div>
                     </div>
                     
                     <div className="col-sm-6 controls__container">
                        <div className="controls__container--elements">

                                {/* <h5 className="card-title text-center"><strong> Controles de la maqueta</strong> </h5> */}
                                <p className="card-text text-center">
                                    <i>Seleccione la acción.</i>
                                </p>
                                <div className={this.classHide('clockwise')}>
                                        <input id="clockwiseBtn" type="checkbox" onClick={this.sendUpdates} ref={this.vars.dirBtn}/>
                                        <label htmlFor="clockwiseBtn"></label>
                                        <div className="curve-arrow"></div>
                                    </div>
                                    <div className="radios__container">
                                        <div className={this.classHide('radios')}>
                                            <input type="radio" id="r1Btn" name="selector" onClick={this.sendUpdates} ref={this.vars.r1Btn} defaultChecked/>
                                            <label htmlFor="r1Btn">R = 3cm</label>
                                            <div className="check"></div>
                                        </div>
                                        <div className={this.classHide('radios')}>
                                            <input type="radio" id="r2Btn" name="selector" onClick={this.sendUpdates} ref={this.vars.r2Btn}/>
                                            <label htmlFor="r2Btn">R = 6cm</label>
                                            <div className="check"></div>
                                        </div>
                                        <div className={this.classHide('radios')}>
                                            <input type="radio" id="r3Btn" name="selector" onClick={this.sendUpdates} ref={this.vars.r3Btn}/>
                                            <label htmlFor="r3Btn">R = 9cm</label>
                                            <div className="check"></div>
                                        </div>
                                    </div>
                                <div className={this.classHide('slider')}>
                                        <div className="slider__container--label-container">
                                            <span id="sliderLabelValue" ref={this.vars.sliderLabelValue}>0.0</span>
                                           
                                        </div>
                                        <input id="speedSlider" className="rs-range" type="range" step="1" min="0" max="100"
                                        defaultValue="0" ref={this.vars.slider} onClick={this.sendUpdates} onChange={this.updateSpeedLabel}/>
                                        <div className="box-minmax">
                                            <span>0</span><span>30</span>
                                        </div>
                                </div>

                                <div className="play__box">
                                        <div className={this.classHide('play')}>
                                            <input id="playBtn" type="checkbox" defaultValue="None" ref={this.vars.playBtn} onClick={this.sendUpdates}
                                                defaultChecked
                                            />
                                            <label htmlFor="playBtn" tabIndex="1"></label>
                                            <div className="labelBtn" id="playLabel">INICIAR</div>
                                        </div>
                                        <div className="record__container">
                                            <input id="recordBtn" type="checkbox" onClick={this.sendUpdates} ref={this.vars.recordBtn}/>
                                            <label htmlFor="recordBtn"></label>
                                            <div className="labelBtn" id="recordLabel">GRABAR</div>
                                        </div>
                                    </div>
                                    {/* <div id="msg">PRESIONE INICIAR</div> */}
                                    <div className={this.classHide('recordTime')}>
                                        <span>Record Time (seg): </span>
                                        <input type="number" defaultValue="50" id="timeInput" name="tentacles" min="10"
                                            max="100" ref={this.vars.recordTime} onInput={this.sendUpdates}/>
                                    </div>
                        </div>
                     </div>
                </div>
     
            </div>
         );
    }

}

export default MockupBase;
