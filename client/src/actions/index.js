import axios from 'axios';
import { FETCH_USER, LOGOUT_USER, INIT_FORM } from './types';

export const initForm = () => dispatch => {
    dispatch({ type: INIT_FORM, payload: {error: null}});
};

export const createUser = (values, history) => async dispatch => {
    try {
        const res = await axios({
            url: '/auth/signup',        
            method: 'post',
            data: values,
            validateStatus: function (status) {
                if( status >= 200 && status < 300 ){
                    return true;
                }else{
                    // token expired or connection failed
                    localStorage.clear();
                    window.location.href = "/login";
                }
              },       
        });
        dispatch({ type: FETCH_USER, payload: res.data });        
        if(res.data.error === null){
           history.push('/dashboard');
        }       
    } catch(err) {
        console.log(err);
    }
};

export const loginUser = (values, history) => async dispatch => {
    try {
        const res = await axios({
            url: '/auth/login',
            method: 'post',
            data: values,
            validateStatus: function (status) {
                if( status >= 200 && status < 300 ){
                    return true;
                }else{
                    // token expired or connection failed
                    localStorage.clear();
                    window.location.href = "/login";
                }
            },
        });        
        dispatch({ type: FETCH_USER, payload: res.data });
    } catch(e) {
        console.log(e);
    }
};

export const logoutUser = (history) => async dispatch => {
    try {
        const res = await axios({
            url: '/auth/logout',        
            headers: {'Authorization': 'Bearer '+localStorage.getItem('token')}        
        });
        dispatch({ type: LOGOUT_USER, payload: res.data });                
        history.push('/');        
    } catch(err) {
        console.log(err);
    }
};

export const fetchUser = () => async dispatch => {
    const auth = {
        username: localStorage.getItem('username'), 
        token: localStorage.getItem('token')
    };

    if(auth.token) {
        try {
            const res = await axios({
                url: '/auth/current_user',        
                headers: {'Authorization': 'Bearer ' +auth.token} ,
                validateStatus: function (status) {
                    if( status >= 200 && status < 300 ){
                        return true;
                    }else{
                        // token expired or connection failed
                        localStorage.clear();
                        window.location.href = "/login";
                    }
                  },       
            });
            dispatch({ type: FETCH_USER, payload: res.data });                
        } catch(err) {
            console.log(err);
        }
    }else{
        dispatch({ type: FETCH_USER, payload: auth });
    }
};

export const fetchToken = (authHash) => async dispatch => {
    try {
        const res = await axios({
            url: `/auth/gentoken/${authHash}`,        
            validateStatus: function (status) {
                if( status >= 200 && status < 300 ){
                    return true;
                }else{
                    // invalid token request hash
                }
              },       
        });
        dispatch({ type: FETCH_USER, payload: res.data });                
    }catch(e){
        console.log(e);
    }
};
    