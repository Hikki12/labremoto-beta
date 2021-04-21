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

class MockupBase extends React.Component {

    constructor(props){
        super(props);

        this.array = Array(4).fill(null).map(() => Array(3).fill(0));

        this.state = {
            playerOn: false,
            quizIsOpen: false,
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

    componentDidMount() {
        this.clientIO = new MockupClientIO(name="MAQUETA-MCU");
        this.clientIO.newFrameReady(this.displayVideoImage);
        this.clientIO.reciveUpdates(this.reciveFromServer);
        //this.clientIO.updatesRequest(this.sendUpdates);

        if(this.props.mode < 1){
            this.randomRadio();
            this.randomSpeed();
            this.randomDir();
            this.autoStart(4000);
        }else{
            this.clientIO.updatesRequest(this.sendUpdates);
        }
    }

    onChangeTable = (row, col, e) => {
        this.array[parseInt(row, 10) - 1][parseInt(col, 10) -1] = e.target.value;
        //console.log("Matrix: ", this.array);
    }

    renderTable = () => {
        const rows = [1,2,3,4];
        const cols = [1,2,3];
        return(
            <div className="table__container">
                 <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th className="text-center" scope="col"># vueltas</th>
                      <th className="text-center" scope="col">Time(s)</th>
                      <th className="text-center" scope="col">Período(s)</th>
                      <th className="text-center" scope="col">Frecuencia(Hz)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                        return(
                            <tr key={row}>
                                <th className="text-center" scope="row">{5*row}</th>
                                {cols.map((col) => {
                                    return(
                                        <td key={col}>
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
        this.vars.playBtn.current.checked = !variables.PlayState;
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
                />

                <div className="section__title">
                     {this.props.name
                     ?<div className="title mockup__title">{this.props.name}</div>
                     :<div className="title mockup__title">Mockup Name</div>
                     }
          
                </div>
 
                <div className="row view__container">

                    <div className="col-sm-6">
                         <div className="card">
                            <div className="card-body">

                                {this.renderPlayer()}

                                <div className="light__container">
                                    <input id="lightBtn" type="checkbox" ref={this.vars.lightBtn} onClick={this.sendUpdates}/>
                                    <label htmlFor="lightBtn"></label>
                                    {/* <i>Lámpara</i> */}
                                </div>
                                <div className="play__box">
                                    <div className="play__container">
                                    <input id="playBtn" type="checkbox" defaultValue="None" ref={this.vars.playBtn} onClick={this.sendUpdates}
                                                defaultChecked
                                            />
                                            <label htmlFor="playBtn" tabIndex="1"></label>
                                            <div className="labelBtn" id="playLabel">INICIAR</div>
                                        {/* <ToogleButton> Play </ToogleButton> */}
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
                               
                                <div className="instructions__container mt-5">
                                    {/* <p className="text-left">1. Observe con atención el experimento.</p>
                                    <p className="text-left">2. Llene la tabla con los datos que pueda extraer del video.</p>
                                    <p className="text-left">3. Cuando esté listo proceda a realizar el cuestionario.</p> */}
                                <p className="text-justify">
                                1. Haciendo uso de un cronómetro, mide el tiempo que le toma a la partícula realizar las vueltas que se especifican en la primera columna de la tabla. Completa la segunda columna con estas mediciones.
                                </p>
                                <p className="text-justify">
                                2. Una vez que hayas realizado todas las mediciones, pausa la rotación del disco haciendo clic en el botón “Pausar”. Si necesitas realizar nuevas mediciones, pulsalo de nuevo para que el disco comience a girar.
                                </p>
                                <p className="text-justify">
                                3. Utiliza los datos de la primera y segunda columna para determinar el periodo y la frecuencia en la tercera y cuarta columna, respectivamente.
                                </p>
                                <p className="text-justify">
                                4. Para finalizar la práctica, haz clic en ¨cuestionario¨.
                                </p>
                                </div>

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
                                        <input id="speedSlider" className="rs-range" type="range" step="1" min="0" max="50"
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

export default MockupBase;
