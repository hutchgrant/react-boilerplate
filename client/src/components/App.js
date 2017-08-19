import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Header from './Header';
import Landing from './Landing';
import Dashboard from './Dashboard';
import LoginForm from './Auth/LoginForm';
import SignupForm from './Auth/SignupForm';
import AuthenticatedRoute from './Auth/AuthenticatedRoute';
import UnauthenticatedRoute from './Auth/UnauthenticatedRoute';


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

    render() {
      return ! this.state.isLoadingUserToken
      && (
            <BrowserRouter>
              <div>
                <Header />
                <div className="container">
                  <UnauthenticatedRoute exact path="/" component={Landing} props={this.props} />
                  <AuthenticatedRoute exact path="/dashboard" component={Dashboard} props={this.props} />
                  <UnauthenticatedRoute exact path="/login" component={LoginForm} props={this.props} />
                  <UnauthenticatedRoute exact path="/signup" component={SignupForm} props={this.props}  />
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