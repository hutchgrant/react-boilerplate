import _ from 'lodash';
import * as actType from '../actions/adminTypes';

export default function(state = null, {type, payload}) {
    if(state !== null && state.error){
        state.error = null;
    }
    
    switch (type) {
        case actType.INIT_ADMIN_FORM: 
            return { ...state, error:null};    
        case actType.ADMIN_ERROR: 
            return  {...state, error:payload.error};
        case actType.FETCH_CAT:
            return {...state, ...payload};  
        case actType.FETCH_MENU:
            return {...state, ...payload};
        case actType.INIT_PAGE:
            return {...state, page:null};
        case actType.FETCH_PAGE:
            return {...state , ...payload};
        case actType.FETCH_ALL_PAGES:
            return {...state , ...payload};
        case actType.REMOVE_PAGE:
            state.pages.splice(_.findIndex(state.pages, {_id: payload}), 1);
            return {...state};
        case actType.REMOVE_ALL_PAGES:
            _.each(payload, (page) => {
                state.pages.splice(_.findIndex(state.pages, {_id: page}), 1);
            });
            return {...state};
        default:
            return state;
    }
}