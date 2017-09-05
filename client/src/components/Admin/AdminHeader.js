import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import * as actions from '../../actions/index';

class AdminHeader extends Component {

    logoutUser() {
        this.props.logoutUser(this.props.history);
    }

    renderContent() {
        if(this.props.auth !== null){
            switch (this.props.auth.token) {
                case null:
                    return <li><a href="/login">Login</a></li>;
                default:
                    return <li key="2">
                            <a className="dropdown-toggle" id="adminDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                <i className="fa fa-user-o" aria-hidden="true"> </i>
                                <span className="adminUserTag">{this.props.auth.username}</span>
                                <span className="caret"></span>
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="adminDropdown">
                                <li><Link to="/dashboard">Dashboard</Link></li>
                                <li><Link to="/admin">Admin</Link></li>
                                <li role="separator" className="divider"></li>
                                <li><a className="cursorPointer" onClick={this.logoutUser.bind(this)} >Logout</a></li>
                            </ul>
                       </li>;
            }
        }
        return;
    }

    renderFullPage() {
        const path = this.props.location.pathname;
        if(path.substring(0, 6) === '/admin'){
            return (
                <nav className="navbar navbar-admin navbar-static-top">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <button type="button" 
                            className="navbar-admin-toggle collapsed" 
                            data-toggle="collapse" 
                            data-target="#bs-sidebar-navbar-collapse-1" 
                            aria-expanded="false">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            </button>
                            <Link 
                                to={this.props.auth.token ? '/dashboard'  : '/'} 
                                className="navbar-brand"
                            >
                                Boilerplate Admin
                            </Link>              
                        </div>
                            <ul className="nav navbar-nav navbar-right">
                                {this.renderContent()}
                            </ul>
                    </div>
                </nav>
            );
        }
    }

    render() {
        return (
            <div>
                {this.renderFullPage()}
            </div>
        );
    }
}

function mapStateToProps({ auth }) {
    return { auth };
}

AdminHeader = connect(mapStateToProps, actions)(AdminHeader);
export default withRouter(AdminHeader);