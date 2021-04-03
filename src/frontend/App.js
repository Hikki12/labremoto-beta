import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './screens/Login';
import PanelPage from './screens/Panel';
import NotFound from './screens/NotFound';
import Bookings from './screens/Bookings';
import MockupForm from './screens/MockupForm';
import MockupMCU from './mockups/mcu/MockupMCU';



function App(){
    return(
        <BrowserRouter>
            <Layout>
                <Switch>
                    <Route path="/" component={LoginPage} exact/>
                    <Route path="/home" component={PanelPage} exact/>
                    <Route path="/reservas" component={Bookings} exact/>
                    <Route path="/addMockup" component={MockupForm} exact/>
                    <Route path="/mcu" component={MockupMCU} exact/>
                    <Route component={NotFound} />
                </Switch>
            </Layout>
        </BrowserRouter>
    )
}

export default App;