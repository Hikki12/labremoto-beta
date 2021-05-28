import { createStore } from 'redux';
import reducer from './reducers';

const initialState = {
    "mockups":null
};

const store = createStore(reducer, initialState);
export default store;