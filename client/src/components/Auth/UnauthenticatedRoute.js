import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export default ({ component: C, props: cProps, ...rest }) => (
    <Route {...rest} render={props => (
      cProps.auth.token === null
        ? <div className="container"><C {...props} {...cProps} /></div>
        : <Redirect to="/user/dashboard" />
    )}/>
);