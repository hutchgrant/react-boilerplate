import _ from 'lodash';
import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import * as actions from '../actions/auth';

import Loading from './Loading';
import Header from './Header';
import Footer from './Footer';
import Error404 from './Error404';
import AuthenticatedRoute from './Auth/AuthenticatedRoute';
import UnauthenticatedRoute from './Auth/UnauthenticatedRoute';
import MyRoutes from './routes';

let AsyncComponent = [];
const AsyncLoginComponent = Loadable({
  loader: () => import('./Auth/LoginForm'),
  loading: Loading
});
const AsyncSignupComponent = Loadable({
  loader: () => import('./Auth/SignupForm'),
  loading: Loading
});
const AsyncRecoveryComponent = Loadable({
  loader: () => import('./Auth/RecoveryForm'),
  loading: Loading
});
const AsyncPasswordComponent = Loadable({
  loader: () => import('./Auth/ChangePassword'),
  loading: Loading
});
const AsyncVerifyEmailComponent = Loadable({
  loader: () => import('./Auth/VerifyEmail'),
  loading: Loading
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingUserToken: true
    };
  }

  async componentDidMount() {
    try {
      /// If a user signed in via social media and we received a callback token, request JWT
      const authHash = this.querystring('auth');
      if (authHash !== null) {
        await this.props.fetchToken(authHash);
      }
      await this.props.fetchUser();
      if (this.props.auth !== null) {
        this.setState({ isLoadingUserToken: false });
      }
    } catch (e) {
      console.log(e);
    }
  }

  querystring(name, url = window.location.href) {
    name = name.replace(/[[]]/g, '\\$&');

    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)', 'i');
    const results = regex.exec(url);

    if (!results) {
      return null;
    }
    if (!results[2]) {
      return '';
    }

    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  renderClientRoutes() {
    return _.map(
      MyRoutes.routes,
      ({ path, component, authenticated, everyone, sub }, index) => {
        AsyncComponent[index] = Loadable({
          loader: () => import(`${component}`),
          loading: Loading
        });
        if (everyone) {
          return (
            <Route
              exact={!sub ? true : false}
              key={index}
              path={path}
              component={AsyncComponent[index]}
              props={this.props}
            />
          );
        }
        if (!authenticated) {
          return (
            <UnauthenticatedRoute
              key={index}
              exact
              path={path}
              component={AsyncComponent[index]}
              props={this.props}
            />
          );
        }
        return (
          <AuthenticatedRoute
            key={index}
            exact
            path={path}
            component={AsyncComponent[index]}
            props={this.props}
          />
        );
      }
    );
  }

  renderAdminRoutes() {
    let AsyncAdminComponent = Loadable({
      loader: () => import('./Admin/AdminContainer'),
      loading: Loading
    });

    return (
      <AuthenticatedRoute
        path={'/admin'}
        component={AsyncAdminComponent}
        props={this.props}
        admin="true"
      />
    );
  }

  render() {
    return (
      !this.state.isLoadingUserToken && (
        <BrowserRouter>
          <div className="page">
            <Header {...this.props} />
            <Switch>
              {this.renderAdminRoutes()}
              {this.renderClientRoutes()}
              <UnauthenticatedRoute
                exact
                path="/user/login"
                component={AsyncLoginComponent}
                props={this.props}
              />
              <UnauthenticatedRoute
                exact
                path="/user/signup"
                component={AsyncSignupComponent}
                props={this.props}
              />
              <UnauthenticatedRoute
                exact
                path="/user/recovery"
                component={AsyncRecoveryComponent}
                props={this.props}
              />
              <UnauthenticatedRoute
                exact
                path="/user/change_password"
                component={AsyncPasswordComponent}
                props={this.props}
              />
              <UnauthenticatedRoute
                exact
                path="/user/verify"
                component={AsyncVerifyEmailComponent}
                props={this.props}
              />
              <Route component={Error404} />
            </Switch>
            <Footer />
          </div>
        </BrowserRouter>
      )
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(App);
