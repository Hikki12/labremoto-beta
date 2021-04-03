import { ADD_MOCKUP } from '../actions';


const reducer = (state={}, action) => {
    switch (action.type) {
        case ADD_MOCKUP:
            return({
                ...state,
                mockups: state.mockups
            })
    
        default:
            return state;
    }
}

export default reducer;