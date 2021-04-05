import { ADD_MOCKUP } from '../actions';


const reducer = (state={}, action) => {
    switch (action.type) {
        case ADD_MOCKUP:
            return({
                ...state,
                mockups: state.mockups
            })
        case 'PLAY_VDEO':
            return({
                ...state,
                videoName: state.videoName
            });
        default:
            return state;
    }
}

export default reducer;