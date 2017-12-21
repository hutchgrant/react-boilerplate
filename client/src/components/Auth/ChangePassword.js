import _ from 'lodash';
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import QueryString from 'query-string';

import AuthField from './AuthField';
import authFields from './authFields';
import * as actions from '../../actions/auth';

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = { values: null, token: null, changed: null };
  }

  async componentDidMount() {
    this.props.initForm();

    const parsed = QueryString.parse(this.props.location.search);
    if (parsed.token !== '') {
      await this.props.validateToken({
        token: parsed.token,
        type: 'change_password'
      });
      if (this.props.auth.success) {
        this.setState({ token: parsed.token });
      } else {
        this.setState({ token: false });
      }
    } else {
      this.setState({ token: false });
    }
  }

  renderField(fieldLabel) {
    const fieldIdx = authFields.signup.findIndex(
      ({ label }) => label === fieldLabel
    );

    const { label, name, type } = authFields.signup[fieldIdx];

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
  }

  async onSubmit(values) {
    this.props.initForm();
    await this.props.changePassword({ ...values, token: this.state.token });
    if (this.props.auth.success) {
      this.setState({ changed: true });
    }
  }

  renderSuccessFail() {
    if (this.state.token) {
      return this.renderForm();
    } else if (this.state.token === null) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <p id="profile-name" className="profile-name-card">
            Verification Expired/Invalid
          </p>

          <p className="text-center">
            If you're certain that you're using the correct verification link,
            try making <Link to="/user/recovery">another recovery request</Link>.
            Verification emails expire after 1 hour.
          </p>
        </div>
      );
    }
  }

  renderForm() {
    if (this.props.auth.success && this.state.changed !== true) {
      return (
        <div>
          <h2>Change Password</h2>
          <br />
          {this.renderResponseFail()}
          <p>You may now reset the password for your account.</p>
          <div className="row">
            <div className="col-md-8 col-md-offset-2">
              <form
                className="form-signin"
                onSubmit={this.props.handleSubmit(values =>
                  this.onSubmit(values)
                )}
              >
                <span id="reauth-email" className="reauth-email" />
                {this.renderField('Password')}
                {this.renderField('Confirm Password')}
                <button className="btn btn-default" type="submit">
                  Change Password
                </button>
              </form>
            </div>
          </div>
        </div>
      );
    }
  }

  renderResponse() {
    if (this.state.changed) {
      return (
        <div>
          <h2>Password Change Success</h2>
          <br />
          <div className="alert alert-success">
            <p>
              You may now <Link to="/user/login">login</Link> with your new
              password.
            </p>
          </div>
        </div>
      );
    }
  }

  renderResponseFail() {
    if (!this.state.changed && this.props.auth.error) {
      return (
        <div className="alert alert-warning">
          <p>{this.props.auth.error}, try again</p>
        </div>
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
          {this.renderSuccessFail()}
          {this.renderResponse()}
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

ChangePassword = reduxForm({
  validate,
  form: 'chgPasswordForm',
  destroyOnUnmount: true
})(ChangePassword);
ChangePassword = connect(mapStateToProps, actions)(ChangePassword);

export default ChangePassword;
