import React, { Component } from 'react';

class Dashboard extends Component {
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-lg-6 col-lg-offset-3 col-md-10 col-md-offset-1">
                        <h2 className="text-center">Dashboard</h2>
                        <h5 className="text-center">Welcome {this.props.auth.username}</h5>
                    </div>
                </div>
            </div>
        );
    }
};

export default Dashboard;