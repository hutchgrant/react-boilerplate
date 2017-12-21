import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import $ from 'jquery';

class Header extends Component {
  componentDidMount() {
    $('.nav a').on('click', function() {
      if ($(this).attr('class') !== 'dropdown-toggle') {
        $('.navbar-collapse').removeClass('in');
      }
    });
  }

  logoutUser() {
    this.props.logoutUser(this.props.history);
  }

  renderAdminNav() {
    if (this.props.auth.admin) {
      return (
        <li>
          <Link to="/admin/dashboard">Admin</Link>
        </li>
      );
    }
  }

  renderContent() {
    if (this.props.auth !== null) {
      switch (this.props.auth.token) {
        case null:
          return (
            <li>
              <a href="/user/login">Login</a>
            </li>
          );
        default:
          return (
            <li key="2">
              <a
                className="dropdown-toggle"
                id="dropdownMenu1"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="true"
              >
                <i className="fa fa-user-o" aria-hidden="true">
                  {' '}
                </i>
                {' ' + this.props.auth.username}
                <span className="caret" />
              </a>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
                <li>
                  <Link to="/user/dashboard">Dashboard</Link>
                </li>
                {this.renderAdminNav()}
                <li role="separator" className="divider" />
                <li>
                  <a
                    className="cursorPointer"
                    onClick={this.logoutUser.bind(this)}
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </li>
          );
      }
    }
    return;
  }

  renderFullPage() {
    const path = this.props.location.pathname;
    if (
      path !== '/user/login' &&
      path !== '/user/signup' &&
      path !== '/user/change_password' &&
      path !== '/user/recovery' &&
      path !== '/user/verify' &&
      path.substring(0, 6) !== '/admin'
    ) {
      return (
        <nav className="navbar navbar-default navbar-static-top">
          <div className="container">
            <div className="navbar-header">
              <button
                type="button"
                className="navbar-toggle collapsed"
                data-toggle="collapse"
                data-target="#bs-example-navbar-collapse-1"
                aria-expanded="false"
              >
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar" />
                <span className="icon-bar" />
                <span className="icon-bar" />
              </button>
              <Link
                to={this.props.auth.token ? '/user/dashboard' : '/'}
                className="navbar-brand"
              >
                React Boilerplate
              </Link>
            </div>
            <div
              className="collapse navbar-collapse"
              id="bs-example-navbar-collapse-1"
            >
              <ul className="nav navbar-nav" />
              <ul className="nav navbar-nav navbar-right">
                {this.renderContent()}
              </ul>
            </div>
          </div>
        </nav>
      );
    }
  }

  render() {
    return <div>{this.renderFullPage()}</div>;
  }
}

export default withRouter(Header);
