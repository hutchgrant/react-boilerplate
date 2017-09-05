import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export default ({ component: C, props: cProps, ...rest, admin }) => {
  if(rest.admin !== "true"){
    return <Route {...rest} render={props => (
      cProps.auth.token
        ? <C {...props} {...cProps} />
        : <Redirect to='/login' />
    )}/>
  }else{
    return <Route {...rest} render={props => (
      cProps.auth.admin
        ? <div className="dashboard">
            <rest.components.header {...props} {...cProps} />
            <rest.components.sidebar {...props} {...cProps} />
            <div className="container main">
              <rest.components.main {...props} {...cProps} />
            </div>
          </div>
        : cProps.auth.token
          ? <Redirect to='/dashboard' />
          : <Redirect to='/login' />
      )}/>
  }
};