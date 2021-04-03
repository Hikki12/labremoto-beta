import React from 'react';
import { NavLink } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import './styles/Navbar.css';

AOS.init();
class Navbar extends React.Component {
    render(){
        return( 
            <header className="header-transparent container">
                <nav className="navbar navbar-expand-lg navbar-light">
                    <NavLink to="/" className="logo__text">LabRemotoUTPL</NavLink>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <ul className="navbar-nav p-auto">
                            <li className="nav-item">
                                <NavLink to="/" className="nav-link">Home</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/home" className="nav-link">Panel</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/reservas" className="nav-link">Reservas</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/home" className="nav-link link-enhanced">Inicio sesión</NavLink>
                            </li>

                        </ul>
                    
                    </div>
                </nav>
            </header>

        )
    }
}

export default Navbar;