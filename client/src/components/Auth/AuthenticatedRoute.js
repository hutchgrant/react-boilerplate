import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export default ({ component: C, props: cProps, ...rest }) => {
  if(rest.admin !== "true"){
    return <Route {...rest} render={props => (
      cProps.auth.token
        ? <div className="container"><C {...props} {...cProps} /></div>
        : <Redirect to='/user/login' />
    )}/>
  }else{
    return <Route {...rest} render={props => (
      cProps.auth.admin
        ? <C {...props} {...cProps} />
        : cProps.auth.token
          ? <Redirect to='/user/dashboard' />
          : <Redirect to='/user/login' />
      )}/>
  }
};