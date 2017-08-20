import { FETCH_USER, LOGOUT_USER, INIT_FORM } from '../actions/types';

export default function(state = null, {type, payload}) {
    switch (type) {
        case FETCH_USER:
            if(payload.token){
                localStorage.setItem('token', payload.token);
                localStorage.setItem('username', payload.username);
            }else{
                payload.token = localStorage.getItem('token', payload.token);                
            }
            return payload || false;
        case INIT_FORM: 
            return { ...state, error:null}        
        case LOGOUT_USER:
            localStorage.clear();
            return {username: null, token: null};
        default:
            return state;
    }
}