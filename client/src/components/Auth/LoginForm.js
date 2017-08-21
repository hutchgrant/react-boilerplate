import _ from 'lodash';
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import AuthField from './AuthField';
import authFields from './authFields';
import * as actions from '../../actions';
import ReCAPTCHA from 'react-google-recaptcha';

let captcha;

class LoginForm extends Component {

    constructor() {
        super();
        this.state = {values: null, attempts:0};
    }

    componentDidMount() {
        this.props.initForm();
    }

    renderFields() {
        return _.map(authFields.login, ({label, name, type}) => {
            return <Field key={name} component={AuthField} type={type} label={label} name={name} placeholder={label}/>
        });
    }

    renderError() {
        if(this.props.auth.error) {
            return (
                <div className="alert alert-danger">
                    <p>{this.props.auth.error.message}</p>
                </div>
            );
        }
    }

    onSubmit(values) {
        if(this.props.auth.error){
            this.setState({values, attempts: this.props.auth.error.attempts})
            if(this.state.values){
                if(this.state.values.captcha){
                    values.captcha = this.state.values.captcha
                    this.props.loginUser(values, this.props.history);       
                }
                if(this.props.auth.error.attempts > this.state.attempts && this.props.auth.error.attempts >= 5){
                    captcha.reset();
                    this.setState({ values, captcha: null});
                }
                if(this.props.auth.error.attempts < 5){
                    this.props.loginUser(this.state.values, this.props.history); 
                }
            }
        }else{        
            this.setState({values, attempts: this.state.attempts})
            this.props.loginUser(values, this.props.history);
        }
    }
    onChange(value) {
        if(value !== null){
            this.setState({values: {...this.state.values, captcha: value}});
        }
    }

    renderCaptcha() {
        if(this.props.auth.error){
            if(this.props.auth.error.attempts >= 5) {
                return (
                    <div>
                        <ReCAPTCHA
                            ref={(el) => { captcha = el; }}
                            sitekey={process.env.REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY}
                            size="normal"
                            onChange={this.onChange.bind(this)}
                        />
                    </div>
                );
            }
        }
    }

    render() {
        return (
            <div  className="login">
                <div className="card card-container">
                    <div className="text-center">
                        <a href="/auth/google" className="btn btn-block btn-social btn-google"><i className="fa fa-google" />Sign in with Google</a>
                        <a href="/auth/facebook" className="btn btn-block btn-social btn-facebook"><i className="fa fa-facebook" />Sign in with Facebook</a>
                        <a href="/auth/twitter" className="btn btn-block btn-social btn-twitter"><i className="fa fa-twitter" />Sign in with Twitter</a>
                    </div>
                    <hr />
                    <p id="profile-name" className="profile-name-card">Sign In</p>
                    {this.renderError()}
                    <form className="form-signin" onSubmit={this.props.handleSubmit(value => this.onSubmit(value))}>
                        <span id="reauth-email" className="reauth-email"></span>
                        {this.renderFields()}
                        <div id="remember" className="checkbox">
                            <label>
                                <input type="checkbox" value="remember-me" /> Remember me
                            </label>
                        </div>
                        {this.renderCaptcha()}
                        <button className="btn btn-lg btn-primary btn-block btn-signin" type="submit">Sign in</button>
                    </form>
                    <div className="profile-footer">
                        <p>Don't have an account? <Link to="/signup">Register here</Link></p>
                        <Link to="/password-recovery">Forgot your password?</Link>
                    </div>
                </div>
            </div>
        );
    }

};

function validate(values) {
    const errors = {};

    _.each(authFields.login, ({ name, message }) => {
        if (!values[name] || values[name].length > 20) {
            errors[name] = message;
        }
    });

    return errors;
}

function mapStateToProps({ auth }) {
        return { auth };
}

LoginForm = reduxForm({
    validate,
    form: 'loginForm',
    destroyOnUnmount: true
})(LoginForm);
LoginForm = connect(mapStateToProps, actions)(LoginForm);

export default withRouter(LoginForm);