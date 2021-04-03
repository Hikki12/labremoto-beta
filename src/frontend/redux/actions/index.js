export const ADD_MOCKUP = 'ADD_MOCKUP';
export const DELETE_MOCKUP = 'DELETE_MOCKUP';

/* Creadores de acciones */

export const addNewMockup = payload => ({
    type: ADD_MOCKUP, 
    payload,
});