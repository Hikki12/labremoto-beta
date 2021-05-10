import React from 'react';
import { Player } from 'video-react'; 
import ToogleButton from '../../components/ToogleButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MockupBase.css';
import MockupClientIO from '../mockup-client/MockupIO-client';
import RadioButton from '../components/RadioButton';
import ModalVideo from '../components/ModalVideo';
import ModalQuiz from '../quiz/ModalQuiz';
import "video-react/dist/video-react.css"; // import css
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';
import { type } from 'jquery';

class MockupBase extends React.Component {



    constructor(props){
        super(props);
        
        this.array = Array(4).fill(null).map(() => Array(3).fill(0));
        this.state = {
            playerOn: false,
            quizIsOpen: false,
            isMaster:false,
            viewers:0,
            data: {}
        }

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
        

    }

    identifyUpdate = (vars) => {
        this.setState({
            isMaster: vars.isMaster,
            viewers: vars.viewers
        })
    }

    componentDidMount() {
        console.log("PRROPSS  ", this.props)
        this.clientIO = new MockupClientIO(name="MAQUETA-MCU");
        this.clientIO.newFrameReady(this.displayVideoImage);
        this.clientIO.reciveUpdates(this.reciveFromServer);
        //this.clientIO.socketInfo(this.identifyUpdate);

        this.clientIO.io.on('give control', (control)=>{
            console.log("NUSERS : ", control);
            this.setState({
                viewers: control.viewers,
                "isMaster": control.isMaster
            })
        });

        if(this.props.mode < 1){
            this.autoStart(3000);
        }else{
            this.clientIO.updatesRequest(this.sendUpdates);
        }
    }

    onChangeTable = (row, col, e) => {
        this.array[parseInt(row, 10) - 1][parseInt(col, 10) -1] = e.target.value;
        //console.log("Matrix: ", this.array);
    }

    renderTable = () => {
        let mode = parseInt(this.props.mode);
        let titles = [];
        let rows = [];
        let cols = [];
        if(mode === 0 || mode === 2){
            console.log("AAAAAqui")
            titles = ["# Rotaciones", "Tiempo(s)", "Período (s)", "Frecuencia(Hz)"]
            rows = [5,10,15,20];
            cols = [1,2,3];
        }
        if(mode == 1){
            titles = ["Desplazamiento Angular (rad)", "Tiempo(s)", "Velocidad Angular (rad/s)"]
            rows = ["3pi","4pi","5pi","6pi","7pi"];
            cols = [1,2];
        }
        console.log("mm ", mode)
        return(
            <div className="table__container">
                 <table className="table table-bordered">
                  <thead>
                    <tr>
                        {titles.map((title) =>{
                            return <th className="text-center" scope="col">{title}</th>
                        })}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => {
                        return(
                            <tr key={row}>
                                <th className="text-center" scope="row">{row}</th>
                                {cols.map((col, index) => {
                                    return(
                                        <td key={index}>
                                            <input className="text-center" onChange={(e) => this.onChangeTable(row, col, e)}/>
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                  </tbody>
                </table>
            </div>
        );
    }


    autoStart = (time=1000) => {
        
        setTimeout(()=>{
            this.vars.playBtn.current.checked = false;
            this.vars.lightBtn.current.checked = true;
            this.randomRadio();
            this.randomSpeed();
            this.randomDir();
            console.log("Auto Starting...");
            this.sendUpdates();
        }, time)
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
        console.log("SSS: ", speed);
        console.log("VVV : ", this.vars.slider.current.value);
        this.updateSpeedLabel()
    }

    randomDir = () => {
        this.vars.dirBtn.current.checked = Math.random() < 0.5;
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


    reciveFromServer = (variables) => {
        console.log("Reciving variables", variables);
        this.vars.dirBtn.current.checked = !variables.DirState;
        this.chooseRadio(variables.Radio);
        this.vars.sliderLabelValue.current.innerHTML  = (0.3*variables.Steps).toFixed(1);
        this.vars.slider.current.value = variables.Steps;
        this.vars.playBtn.current.setChecked(variables.PlayState);
        this.vars.recordBtn.current.checked = variables.Recording;
        this.vars.slider.current.value = variables.Steps;
        this.vars.recordTime.current.value = variables.RecordingTime;
        this.vars.lightBtn.current.checked = variables.LightState;
    }

    sendUpdates = () => {
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
        this.setState({
            data: variables
        })
    }


    componentWillUnmount(){
        this.clientIO.close();
    }

    displayVideoImage = (frame64) => {
        let image = 'data:image/jpeg;base64,' + frame64;
        this.setState({
            videoImg: image
        });
    }

    openModal = () => {
        this.setState({modalIsOpen: true});
    }

    closeModal = () => {
        this.setState({modalIsOpen: false});
    }

    openQuiz = () => {
        this.setState({quizIsOpen: true});
    }

    closeQuiz = () => {
        this.setState({quizIsOpen: false});
    }

    updateSpeedLabel = () => {
        this.vars.sliderLabelValue.current.innerHTML = (0.3*this.vars.slider.current.value).toFixed(1);
    }

    classHide = (name) => {
        let mode = this.props.mode;
        let hide = true;

        if (mode >= 2){
            hide = false;
        }
        if(hide){
            return "hide"
        }

        if(name == "radios-container"){
            return "radios__container"
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
        if(name == "playbox"){
            return "play__box"
        }
        if(name== "record"){
            return "record__container"
        }
    }

    renderPlayer = () => {
        if( this.state.playerOn == false){
            return(
                <div className="video__container">
                    <img className="video" id="video-img" src={this.state.videoImg}/>
                </div>
            );
        }else{
            return(
                <div className="video__container">
                    <Player
                        playsInline
                        src=""
                        width={495}
                        height={400}
                    />
                </div>
                
            );
        }
    }

    test = () => {
        this.setState({
            playerOn: !this.state.playerOn
        })
    } 

    renderDriverStatus = () => {
        let isMaster = this.state.isMaster;
        if (isMaster){
            return <div className="socket__info--indicator__on">/Driver</div>
        }else {
            return <div className="socket__info--indicator__off">/Passenger</div>
        }
    }

    renderSocketInfo = () => {
        return(
            <div className="socket__info--container">
                <div className="socket__info--element">
                   Viewers: {this.state.viewers}
                </div>
                {this.state.isMaster
                    ?<div className="socket__info--indicator__on">/Driver</div>
                    :<div className="socket__info--indicator__off">/Passenger</div>
                }
            </div>
        );
    }

    renderInstructions = () => {
        return(
        // {this.props.mockupInfo}
        <div className="instructions__container mt-5">
                {/* <p className="text-left">1. Observe con atención el experimento.</p>
                <p className="text-left">2. Llene la tabla con los datos que pueda extraer del video.</p>
                <p className="text-left">3. Cuando esté listo proceda a realizar el cuestionario.</p> */}
            {this.props.location.state.info &&

                this.props.location.state.info.instructions[this.props.mode].map((instruction, index)=>{
                    return(
                        <p className="text-justify" key={index}>
                            {`${index + 1}-. ${instruction}`}
                        </p>
                    )
                })
            }
        </div>
        );
    }

    render() {
        return(
            <div className="section">
                
{/*                <ModalVideo 
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                />

*/}
                <ModalQuiz
                    isOpen={this.state.quizIsOpen}
                    onRequestClose={this.closeQuiz}
                    variables={this.state.variables}
                    dataTable={this.state.dataMatrix}
                    renderTable={this.renderTable}
                    data={this.state.data}
                    mode={this.props.mode}
                />

                <div className="row view__container">

                    <div className="col-sm-6">
                         <div className="card">
                            
                            <div className="card-body">
                                 
                                 <div className="section__title">
                                     {this.props.name
                                     ?<div className="title mockup__title">EXPERIMENTO</div>
                                     :<div className="title mockup__title">Mockup Name</div>
                                     }
                          
                                </div>
                            
                                {this.renderPlayer()}

                                <div className="light__container">
                                    <input id="lightBtn" type="checkbox" ref={this.vars.lightBtn} onClick={this.sendUpdates}/>
                                    <label htmlFor="lightBtn"></label>
                                    <i className="light__text">Lámpara</i>
                                    {this.renderSocketInfo()}
                                </div>

                                <div className="play__box">
                                    <div className="play__container">
                                    <ToogleButton  ref={this.vars.playBtn} myref={this.vars.playBtn} onClick={this.sendUpdates}
                                    isChecked
                                    >
                                    INICIAR
                                    </ToogleButton>

                                    </div>
                                    <div className={this.classHide('record')}>
                                            <input id="recordBtn" type="checkbox" onClick={this.sendUpdates} ref={this.vars.recordBtn}/>
                                            <label htmlFor="recordBtn"></label>
                                            <div className="labelBtn" id="recordLabel">GRABAR</div>
                                        </div>
                                </div>
                                
                                <div className={this.classHide('recordTime')}>
                                        <span>Record Time (seg): </span>
                                        <input type="number" defaultValue="50" id="timeInput" name="tentacles" min="10"
                                            max="100" ref={this.vars.recordTime} onInput={this.sendUpdates}/>
                                    </div>
                                    {/*<button className="btn btn-success" onClick={this.test}>Results</button>*/}
                            </div>
                         </div>
                    </div>

                     <div className="col-sm-6">
                        <div className="card">
                            <div className="card-body">

                                {/* <h5 className="card-title text-center"><strong> Controles de la maqueta</strong> </h5> */}
                                <p className="card-text text-center">
                                    {/* <i className="title">PRÁCTICA 1</i> */}
                                </p>
                                {this.renderTable()}

                                <div className="btn__container mt-5">
                                    <button className="btn btn-primary mr-5" onClick={this.openQuiz}>Cuestionario</button>
                                </div>

                                {this.renderInstructions()}
                               

                                <div className={this.classHide('clockwise')}>
                                        <input id="clockwiseBtn" type="checkbox" onClick={this.sendUpdates} ref={this.vars.dirBtn}/>
                                        <label htmlFor="clockwiseBtn"></label>
                                        <div className="curve-arrow"></div>
                                </div>
                               
                                <div className={this.classHide('radios-container')}>
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
                                        <input id="speedSlider" className="rs-range" type="range" step="1" min="30" max="100"
                                        defaultValue="0" ref={this.vars.slider} onClick={this.sendUpdates} onChange={this.updateSpeedLabel}/>
                                        <div className="box-minmax">
                                            <span>0</span><span>30</span>
                                        </div>
                                </div>

                                </div>
                            </div>
                        </div>
                    </div>

            </div>
         );
    }

}

export default withRouter(MockupBase);
