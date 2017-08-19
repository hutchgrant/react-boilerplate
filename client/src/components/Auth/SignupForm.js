import _ from 'lodash';
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import AuthField from './AuthField';
import authFields from './authFields';
import * as actions from '../../actions';

class SignupForm extends Component {

    renderFields() {
        return _.map(authFields.signup, ({label, name, type}) => {
            return <Field key={name} component={AuthField} type={type} label={label} name={name} placeholder={label}/>
        });
    }

    renderError() {
        let x = 0;
        if(this.props.auth.error) {
            return _.map(this.props.auth.error.message, err =>{
                return <li key={x++}>{err} </li>
            });
        }
    }

    render() {
        return (
            <div className="login">
                <div className="card card-container">
                    <img id="profile-img" alt="logo" className="profile-img-card" src="/logo.svg" />
                    <p id="profile-name" className="profile-name-card">Register</p>
                    
                    <div className={this.props.auth.error ? 'alert alert-danger' : 'hidden'}>
                        <ul>
                            {this.renderError()}
                        </ul>
                    </div>
                    <form className="form-signin" onSubmit={this.props.handleSubmit(value => this.props.createUser(value, this.props.history))}>
                        <span id="reauth-email" className="reauth-email"></span>
                        {this.renderFields()}
                        <button className="btn btn-lg btn-primary btn-block btn-signin" type="submit">Sign up</button>
                    </form>
                    <div className="profile-footer">
                        <p>Already have an account? <Link to="/login">Login here</Link></p>
                        <Link to="/privacy">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        );
    }

};

function validateEmails(email, message) {
    const re = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(re.test(email) === false){
        return message;
    }    
}

function validate(values) {
    const errors = {};
    
    _.each(authFields.signup, ({ name, message }) => {
        if (!values[name] || values[name].length > 50) {
            errors[name] = message;
        }
        if(name === "email" && values.email !== ''){
            errors.email = validateEmails(values.email, message);
        }
        if(name === "confirm_password" && values.confirm_password !== values.password){
            errors.confirm_password = message;
        }
    });

    return errors;
}

function mapStateToProps({ auth }) {
        return { auth };
}

SignupForm = reduxForm({
    validate,
    form: 'signupForm',
    destroyOnUnmount: true
})(SignupForm);
SignupForm = connect(mapStateToProps, actions)(SignupForm);

export default withRouter(SignupForm);