import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Login.css';

const LoginPage = ()=>{
        return(
            <div className="login__section">
                <div className="form__container">
                    <div className="form__container--title">
                        <p>Inicio de sesión</p>
                    </div>
                    <form>
                        <div className="form-group form__group--login">
                            <input className="form-control" type="email" name="username" placeholder="usuario@utpl.edu.ec"/>
                        </div>
                        <div className="form-group form__group--login">
                            <input className="form-control" type="password" placeholder="Contraseña"/>
                        </div>
                        <div className="form__button">
                            <button className="btn btn-outline-info btn-lg" type="submit">Entrar</button>                    
                        </div>                    
                    </form>
                </div>

            </div>
        )
}


export default LoginPage;