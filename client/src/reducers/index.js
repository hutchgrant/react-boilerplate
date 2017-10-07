import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form';
import authReducer from './authReducer';
import adminReducer from './adminReducer';

export default combineReducers({
    form: reduxForm,
    auth: authReducer,
    admin: adminReducer
});