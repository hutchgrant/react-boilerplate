import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class Settings extends Component {
    render() {
        return (
            <div>
                <h2>Settings</h2>
                <h5>Welcome {this.props.auth.username}</h5>
            </div>
        );
    }
};

function mapStateToProps({ auth }) {
        return { auth };
}

export default connect(mapStateToProps, actions)(Settings);