import _ from 'lodash';
import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import * as actions from '../actions';

import Loading from './Loading';
import Header from './Header';
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

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoadingUserToken: true,
    };
  }

  async componentDidMount() {
    try {
      /// If a user signed in via social media and we received a callback token, request JWT
      const authHash = this.querystring('auth');
      if(authHash !== null){
        await this.props.fetchToken(authHash);
      }
      await this.props.fetchUser(); 
      if(this.props.auth !== null){
        this.setState({isLoadingUserToken: false});
      }
    } catch(e) {
      console.log(e);
    }
  }

  querystring(name, url = window.location.href) {
    name = name.replace(/[[]]/g, "\\$&");
  
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i");
    const results = regex.exec(url);
  
    if ( ! results) { return null; }
    if ( ! results[2]) { return ''; }
  
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  renderClientRoutes() {
    return _.map(MyRoutes.routes, ({path, component, authenticated}, index) => {
      AsyncComponent[index] = Loadable({
        loader: () => import(`${component}`),
        loading: Loading
      });
      if(!authenticated){
        return <UnauthenticatedRoute 
        key={index}
        exact path={path}
        component={AsyncComponent[index]} 
        props={this.props} />

      }
      return <AuthenticatedRoute 
        key={index}
        exact path={path}
        component={AsyncComponent[index]} 
        props={this.props} /> 
    });
  }

  renderAdminRoutes() {
    const AsyncAdminHeader = Loadable({
      loader: () => import('./Admin/AdminHeader'),
      loading: Loading
    });
    const AsyncAdminSidebar = Loadable({
      loader: () => import('./Admin/AdminSidebar'),
      loading: Loading
    });

    return _.map(MyRoutes.admin, ({path, component}, index) => {
      let AsyncAdminComponent = Loadable({
        loader: () => import(`${component}`),
        loading: Loading
      });
      return <AuthenticatedRoute 
              key={index}
              exact path={path}
              components={{ header: AsyncAdminHeader, sidebar: AsyncAdminSidebar, main: AsyncAdminComponent}} 
              props={this.props} 
              admin="true" /> 
    });
  }

  render() {
    return ! this.state.isLoadingUserToken
      && (
            <BrowserRouter>
              <div className="page">
                <Header />
                {this.renderAdminRoutes()}
                <div className="container"> 
                  {this.renderClientRoutes()}
                  <UnauthenticatedRoute exact path='/login' component={AsyncLoginComponent} props={this.props} />
                  <UnauthenticatedRoute exact path='/signup' component={AsyncSignupComponent} props={this.props} />
                </div>  
              </div>
            </BrowserRouter>      
        );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(App);