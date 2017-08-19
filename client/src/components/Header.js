import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import * as actions from '../actions/index';

class Header extends Component {

    logoutUser() {
        this.props.logoutUser(this.props.history);
    }

    renderContent() {
        if(this.props.auth !== null){
            switch (this.props.auth.token) {
                case null:
                    return <li><a href="/login">Login</a></li>;
                default:
                    return <li key="2"><a className="cursorPointer" onClick={this.logoutUser.bind(this)} >Logout</a></li>;
            }
        }
        return;
    }

    renderFullPage() {
        const path = this.props.location.pathname;
        if(path !== '/login' && path !== '/signup' ){
            return (
                <nav className="navbar navbar-default navbar-static-top">
                    <div className="container">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            </button>
                            <Link 
                                to={this.props.auth.token ? '/dashboard'  : '/'} 
                                className="navbar-brand"
                            >
                                React Boilerplate
                            </Link>              
                        </div>
                        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                            <ul className="nav navbar-nav">   
                            </ul>
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

Header = connect(mapStateToProps, actions)(Header);
export default withRouter(Header);