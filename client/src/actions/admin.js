import _ from 'lodash';
import axios from 'axios';
import * as type from './adminTypes';

/*
*  Admin Error Message
*/
export const initAdminForm = () => dispatch => {
    dispatch({ type: type.INIT_ADMIN_FORM, payload: {error: null}});
};

/*
*  Categories
*/
export const fetchCategories = (token) => async dispatch => {
    try {
        const res = await axios({
            url: '/api/categories',
            headers: {'Authorization': 'Bearer ' +token} ,
            validateStatus: function (status) {
                if( status >= 200 && status < 300 ){
                    return true;
                }else{
                    dispatch({type: type.ADMIN_ERROR, payload: {error: `ERROR: ${status}`}});   
                    return false;                 
                }
            }
        });
        if(res){
            dispatch({ type: type.FETCH_CAT, payload: res.data });
        }
    } catch(err) {
        console.log(err);
    }
};

export const saveCategories = (values, remove, token) => async dispatch => {
    try {
        const res = await axios({
            url: '/api/categories',        
            method: 'post',
            headers: {'Authorization': 'Bearer ' +token} ,            
            data: {
                    save:values,
                    remove
            },
            validateStatus: function (status) {
                if( status >= 200 && status < 300 ){
                    return true;
                }else{
                    dispatch({ type: type.ADMIN_ERROR, payload: {error: `ERROR: ${status}`}});       
                    return false;         
                }
              },       
        });
        dispatch({ type: type.FETCH_CAT, payload: res.data });
    } catch(err) {
        console.log(err);
    }
};

/*
*  MENUS
*/
export const fetchMenus = (token) => async dispatch => {
    try {
        const res = await axios({
            url: '/api/menus',
            headers: {'Authorization': 'Bearer ' +token} ,
            validateStatus: function (status) {
                if( status >= 200 && status < 300 ){
                    return true;
                }else{
                    dispatch({type: type.ADMIN_ERROR, payload: {error: `ERROR: ${status}`}});   
                    return false;                 
                }
            }
        });
        if(res){
            dispatch({ type: type.FETCH_MENU, payload: res.data });
        }
    } catch(err) {
        console.log(err);
    }
};

export const saveMenus = (values, remove, token) => async dispatch => {
    try {
        const res = await axios({
            url: '/api/menus',        
            method: 'post',
            headers: {'Authorization': 'Bearer ' +token} ,            
            data: {
                    save:values,
                    remove
            },
            validateStatus: function (status) {
                if( status >= 200 && status < 300 ){
                    return true;
                }else{
                    dispatch({ type: type.ADMIN_ERROR, payload: {error: `ERROR: ${status}`}});       
                    return false;         
                }
              },       
        });
        dispatch({ type: type.FETCH_MENU, payload: res.data });
    } catch(err) {
        console.log(err);
    }
};
/* Pages */
export const initPage = () => dispatch => { dispatch({ type: type.INIT_PAGE}) }

export const fetchAllPages = (page, max, sort, direction, search, token) => async dispatch => {
    try {
        const res = await axios({
            url: '/api/pages?page='+page+'&max='+max+'&sort='+sort+'&direction='+direction+'&search='+search,
            headers: {'Authorization': 'Bearer ' +token} ,
            validateStatus: function (status) {
                if( status >= 200 && status < 300 ){
                    return true;
                }else{
                    dispatch({type: type.ADMIN_ERROR, payload: {error: `ERROR: ${status}`}});   
                    return false;                 
                }
            }
        });
        if(res){
            dispatch({ type: type.FETCH_ALL_PAGES, payload: res.data });
        }
    } catch(err) {
        console.log(err);
    }
}

export const fetchPage = (pages, pageid, token,) =>  dispatch => {
    const retrieve = async () => {
        try {
            const res = await axios({
                url: '/api/pages/'+pageid,
                headers: {'Authorization': 'Bearer ' +token} ,
                validateStatus: function (status) {
                    if( status >= 200 && status < 300 ){
                        return true;
                    }else{
                        dispatch({type: type.ADMIN_ERROR, payload: {error: `ERROR: ${status}`}});   
                        return false;                 
                    }
                }
            });
            if(res){
                dispatch({ type: type.FETCH_PAGE, payload: res.data });
            }
        } catch(err) {
            console.log(err);
        }
    }

    if(pages){
        const page = _.find(pages, (pg) => {
            return pg._id === pageid;
        });  
        if(page){
            dispatch({ type: type.FETCH_PAGE, payload: {page} });
        }else{
            retrieve();
        }
    }else{
        retrieve();
    }
}

export const savePage = (values, token) => async dispatch => {
    try {
        const res = await axios({
            url: '/api/pages',        
            method: 'post',
            headers: {'Authorization': 'Bearer ' +token} ,            
            data: values,
            validateStatus: function (status) {
                if( status >= 200 && status < 300 ){
                    return true;
                }else{
                    dispatch({ type: type.ADMIN_ERROR, payload: {error: `ERROR: ${status}`}});       
                    return false;         
                }
              },       
        }); 
        dispatch({ type: type.FETCH_PAGE, payload: res.data });
    } catch(err) {
        console.log(err);
    }
};

export const updatePage = (values, token) => async dispatch => {
    try {
        const res = await axios({
            url: '/api/pages/update',        
            method: 'patch',
            headers: {'Authorization': 'Bearer ' +token} ,            
            data: values,
            validateStatus: function (status) {
                if( status >= 200 && status < 300 ){
                    return true;
                }else{
                    dispatch({ type: type.ADMIN_ERROR, payload: {error: `ERROR: ${status}`}});       
                    return false;         
                }
              },       
        }); 
        dispatch({ type: type.FETCH_PAGE, payload: res.data });
    } catch(err) {
        console.log(err);
    }
};


export const removePage = ( pageid, token) => async dispatch => {
    try {
        await axios({
            url: '/api/pages/remove/'+pageid,        
            method: 'delete',
            headers: {'Authorization': 'Bearer ' +token},
            validateStatus: function (status) {
                if( status >= 200 && status < 300 ){
                    return true;
                }else{
                    dispatch({ type: type.ADMIN_ERROR, payload: {error: `ERROR: ${status}`}});       
                    return false;         
                }
              },       
        });
        dispatch({ type: type.REMOVE_PAGE, payload: pageid });
    } catch(err) {
        console.log(err);
    }
};


export const removeAllPages = ( pages, token) => async dispatch => {
    try {
        await axios({
            url: '/api/pages/remove',        
            method: 'post',
            headers: {'Authorization': 'Bearer ' +token},
            data: pages,
            validateStatus: function (status) {
                if( status >= 200 && status < 300 ){
                    return true;
                }else{
                    dispatch({ type: type.ADMIN_ERROR, payload: {error: `ERROR: ${status}`}});       
                    return false;         
                }
              },       
        });
        dispatch({ type: type.REMOVE_ALL_PAGES, payload: pages });
    } catch(err) {
        console.log(err);
    }
};