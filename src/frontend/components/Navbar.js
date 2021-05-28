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

            <div className="container">
                <nav className="navbar navbar-expand-lg navbar-light">
                    <NavLink className="navbar-brand col-1 col-md-9 text-primary my-3" to="/">
                        <h3 className="text-primary">LabRemotoUTPL</h3>
                    </NavLink>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse text-center" id="navbarNav">
                        <div className="">
                            <ul className="navbar-nav">
                                <li className="nav-item active">
                                    <NavLink to="/" className="nav-link text-muted">
                                        Home
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/home" className="nav-link text-muted">
                                        Experimentos
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/Reservas" className="nav-link text-muted">
                                        Reservas
                                    </NavLink>
                                </li>
                            </ul>
                        </div>

                    </div>
                </nav>
            </div>
        )
    }
}

export default Navbar;