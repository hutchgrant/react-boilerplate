import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import * as actions from '../../actions/index';
import $ from 'jquery';

import MyRoutes from '../routes';

class AdminSidebar extends Component {
    constructor(props) {
        super(props);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }
    
    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }
    
    updateWindowDimensions() {
        let height3 = $( window ).height()-51;
        let height1 = $('.nav').height();
        let height2 = $('.main').height();
        
        let width = $(window).width();
        
        if(height2 > height3){
            $('.sidebar').height(Math.max(height1,height3,height2)+10);
		}else{
            $('.sidebar').height(Math.max(height1,height3,height2));
        }
        
        if(width < 768){
            $('.sidebar').removeAttr('style');
        }
        if(width < 768){
            $('.sidebar').removeAttr('style');
        }
    }

    renderMenuList() {
        return _.map(MyRoutes.admin, ({name, path, icon}, index) => {
            return <li key={index}
                        className={index === 0 ? "active" : ''}>
                        <Link to={path}>
                        {name}
                        <span style={{fontSize:'16px'}} 
                            className={`pull-right hidden-xs showopacity ${icon}`}>
                        </span>
                        </Link>
                    </li>;
        });
    }

    renderSideBar() {
        return <nav className="navbar navbar-sidebar sidebar">
                <div className="container-fluid">
                    <div className="collapse navbar-collapse" id="bs-sidebar-navbar-collapse-1">
                        <ul className="nav navbar-nav">
                           {this.renderMenuList()}
                            <li className="dropdown">
                                <a className="dropdown-toggle" data-toggle="dropdown">Settings <span className="caret"></span><span style={{fontSize:'16px'}} className="pull-right hidden-xs showopacity glyphicon glyphicon-cog"></span></a>
                                <ul className="dropdown-menu" role="menu">
                                    <li><Link to='/admin'>Action</Link></li>
                                    <li><Link to='/admin'>Another action</Link></li>
                                    <li><Link to='/admin'>Something else</Link></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
    } 

    render() {
        return (
            <div className="sidebar">
                {this.renderSideBar()}
            </div>
        );
    }
}

function mapStateToProps({ auth }) {
    return { auth };
}

AdminSidebar = connect(mapStateToProps, actions)(AdminSidebar);
export default withRouter(AdminSidebar);