import { createStore } from 'redux';
import reducer from './reducers';

const initialState = {
    "mockups":[
        {
            "id": 1,
            "name":"Movimiento Circular Uniforme",
            "description": "Something...",
            "url": "/mcu",
            "state": "active"
        },
        {
            "id": 2,
            "name": "Caída Libre",
            "description":"Something...",
            "url": "/freefall",
            "state": "active"
        }
    ]
};

const store = createStore(reducer, initialState);
export default store;