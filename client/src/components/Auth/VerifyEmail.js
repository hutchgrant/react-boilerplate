import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import QueryString from 'query-string';

class VerifyEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null
    };
  }
  async componentDidMount() {
    this.props.initForm();
    const parsed = QueryString.parse(this.props.location.search);
    await this.props.validateToken({
      token: parsed.token,
      type: 'verify_email'
    });
    if (this.props.auth.success) {
      this.setState({ token: true });
    } else {
      this.setState({ token: false });
    }
  }

  renderSuccessFail() {
    if (this.state.token) {
      return (
        <div>
          <p id="profile-name" className="profile-name-card">
            Email Verified
          </p>

          <p className="text-center">
            {this.props.auth.success}. You may now{' '}
            <Link to="/user/login">login</Link>.
          </p>
        </div>
      );
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
            try <Link to="/user/login">relogging in</Link> then hit "resend
            verification email" from the error message. Verification emails
            expire after 1 hour.
          </p>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="verify">
        <div className="card card-container">
          <img
            id="profile-img"
            alt="logo"
            className="profile-img-card"
            src="/logo.svg"
          />
          {this.renderSuccessFail()}
        </div>
      </div>
    );
  }
}

export default VerifyEmail;
