import _ from 'lodash';
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import AuthField from './AuthField';
import authFields from './authFields';
import * as actions from '../../actions/auth';
import ReCAPTCHA from 'react-google-recaptcha';

let captcha;

class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = { values: null };
  }

  componentDidMount() {
    this.props.initForm();
  }

  renderFields() {
    return _.map(authFields.signup, ({ label, name, type }) => {
      return (
        <Field
          key={name}
          component={AuthField}
          type={type}
          label={label}
          name={name}
          placeholder={label}
        />
      );
    });
  }

  renderError() {
    let x = 0;
    if (this.props.auth.error) {
      return _.map(this.props.auth.error.message, err => {
        return <li key={x++}>{err} </li>;
      });
    }
  }

  onSubmit(values) {
    captcha.execute();
    this.setState({ ...this.state, values });
    if (this.state.values) {
      if (this.state.values.captcha) {
        values.captcha = this.state.values.captcha;
        this.props.createUser(values, this.props.history);
      }
    }
  }
  onChange(value) {
    if (value !== null) {
      this.setState({ values: { ...this.state.values, captcha: value } });
      this.props.createUser(this.state.values, this.props.history);
    }
  }

  renderForm() {
    if (!this.props.auth.verify) {
      return (
        <div>
          <p id="profile-name" className="profile-name-card">
            Register
          </p>

          <div
            className={this.props.auth.error ? 'alert alert-danger' : 'hidden'}
          >
            <ul>{this.renderError()}</ul>
          </div>
          <form
            className="form-signin"
            onSubmit={this.props.handleSubmit(values => this.onSubmit(values))}
          >
            <span id="reauth-email" className="reauth-email" />
            {this.renderFields()}

            <ReCAPTCHA
              ref={el => {
                captcha = el;
              }}
              sitekey={process.env.REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY}
              size="invisible"
              onChange={this.onChange.bind(this)}
            />
            <button
              className="btn btn-lg btn-primary btn-block btn-signin"
              type="submit"
            >
              Sign up
            </button>
          </form>
          <div className="profile-footer">
            <p>
              Already have an account? <Link to="/user/login">Login here</Link>
            </p>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>
      );
    }
  }

  renderVerify() {
    if (this.props.auth.verify) {
      return (
        <div>
          <p id="profile-name" className="profile-name-card">
            Account created successfully
          </p>

          <p className="text-center">
            In order to use your account, you need to{' '}
            <strong>verify your email</strong>. A verification link has been
            sent to {this.props.auth.email}.
          </p>
        </div>
      );
    }
  }

  render() {
    return (
      <div className={this.props.auth.verify ? 'verify' : 'login'}>
        <div className="card card-container">
          <img
            id="profile-img"
            alt="logo"
            className="profile-img-card"
            src="/logo.svg"
          />
          {this.renderForm()}
          {this.renderVerify()}
        </div>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};

  _.each(authFields.signup, ({ name, message, regex }) => {
    if (!values[name] || values[name].length > 50 || values[name].length < 4) {
      errors[name] = message;
    }
    if (values[name] && regex.test(values[name]) === false) {
      errors[name] = message;
    }
    if (
      name === 'confirm_password' &&
      values.confirm_password !== values.password
    ) {
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
