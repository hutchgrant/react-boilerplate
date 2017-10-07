import _ from 'lodash';
import React, { Component } from 'react';
import Loadable from 'react-loadable';
import { withRouter } from 'react-router';

import Loading from '../Loading';
import AuthenticatedRoute from '../Auth/AuthenticatedRoute';
import MyRoutes from './adminRoutes';

let AsyncComponent = [];

const AsyncAdminHeader = Loadable({
    loader: () => import('./AdminHeader'),
    loading: Loading
  });
const AsyncAdminSidebar = Loadable({
    loader: () => import('./AdminSidebar'),
    loading: Loading
});

class AdminContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isDashLayout: true
    };
  }

  componentDidMount() {
    if(this.props.location.pathname.indexOf('/admin/dialog') !== -1) {
      this.setState({isDashLayout: false})
    }
  }

  addRoute({path, component, exact}, index) {
    AsyncComponent[index] = Loadable({
      loader: () => import(`${component}`),
      loading: Loading
    });
    return <AuthenticatedRoute 
        key={index}
        path={path}
        component={AsyncComponent[index]} 
        props={this.props} 
        admin="true" />
  }

  renderAdminRoutes() {
    let adminRoutes = [];
    if(!this.state.isDashLayout){
      adminRoutes = MyRoutes.dialogs;
    }else{
      adminRoutes = MyRoutes.admin;
    }
    return _.map(adminRoutes, (route, index) => {

      let routes = [];
      routes.push(this.addRoute(route, index)); 

      return routes;
    });
  }

  render() {
    return this.state.isDashLayout
        ?  <div className="page">
                <div className="dashboard">
                    <AsyncAdminHeader {...this.props} />
                    <AsyncAdminSidebar />
                    <div className="container main">
                        {this.renderAdminRoutes()}
                    </div>
                </div> 
            </div>
        : <div>
            {this.renderAdminRoutes()}
          </div>
  }
}

export default withRouter(AdminContainer);