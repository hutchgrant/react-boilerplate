import _ from 'lodash';
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';

import AuthField from './AuthField';
import authFields from './authFields';
import * as actions from '../../actions/auth';

let captcha;

class RecoveryForm extends Component {
  constructor(props) {
    super(props);
    this.state = { values: null, attempts: 0 };
  }

  componentDidMount() {
    this.props.initForm();
  }

  renderField() {
    const emailField = authFields.signup.findIndex(
      ({ label }) => label === 'Email'
    );

    const { label, name, type } = authFields.signup[emailField];
    return (
      <Field
        key={name}
        component={AuthField}
        type={type}
        label={label}
        btn="true"
        name={name}
        placeholder={label}
      />
    );
  }

  resetCaptcha() {
    captcha.reset();
    this.setState(prevState => {
      return { values: { ...prevState.values, captcha: null } };
    });
  }

  onSubmit(values) {
    captcha.execute();
    this.setState({ ...this.state, values });
    if (this.state.values) {
      if (this.state.values.captcha) {
        values.captcha = this.state.values.captcha;
        this.props.recoverPassword(values, this.props.history);
        this.resetCaptcha();
      }
    }
  }
  onChange(value) {
    if (value !== null) {
      this.setState({ values: { ...this.state.values, captcha: value } });
      this.props.recoverPassword(this.state.values, this.props.history);
      this.resetCaptcha();
    }
  }

  renderError() {
    if (this.props.auth.error) {
      return (
        <div className="row">
          <div className="col-md-8 col-md-offset-2">
            <div className="alert alert-danger">
              {this.props.auth.error.message[0]}
            </div>
          </div>
        </div>
      );
    }
  }

  renderForm() {
    if (!this.props.auth.success) {
      return (
        <div className="row">
          <div className="col-md-8 col-md-offset-2">
            <form
              className="form-signin"
              onSubmit={this.props.handleSubmit(values =>
                this.onSubmit(values)
              )}
            >
              <span id="reauth-email" className="reauth-email" />
              {this.renderField()}
              <ReCAPTCHA
                ref={el => {
                  captcha = el;
                }}
                sitekey={process.env.REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY}
                size="invisible"
                onChange={this.onChange.bind(this)}
              />
            </form>
          </div>
        </div>
      );
    } else {
      return (
        <div className="alert alert-success">{this.props.auth.success}</div>
      );
    }
  }

  render() {
    return (
      <div className="verify">
        <div className="card card-container text-center">
          <img
            id="profile-img"
            alt="logo"
            className="profile-img-card"
            src="/logo.svg"
          />
          <h2>Reset Password</h2>
          <br />
          <div className="row">
            <div className="col-md-8 col-md-offset-2">
              <p>
                To recover your password for your account, we need to send you a
                password recovery email.
              </p>
              <p>
                Please enter your email below then follow the instructions in
                the email to reset your password.
              </p>
            </div>
          </div>
          {this.renderError()}
          {this.renderForm()}
        </div>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};

  _.each(authFields.signup, ({ name, message, regex }) => {
    if (!values[name] || values[name].length > 50) {
      errors[name] = message;
    }
    if (values[name] && regex.test(values[name]) === false) {
      errors[name] = message;
    }
  });

  return errors;
}

function mapStateToProps({ auth }) {
  return { auth };
}

RecoveryForm = reduxForm({
  validate,
  form: 'recoveryForm',
  destroyOnUnmount: true
})(RecoveryForm);
RecoveryForm = connect(mapStateToProps, actions)(RecoveryForm);

export default withRouter(RecoveryForm);
