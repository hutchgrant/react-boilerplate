import React, { Component } from 'react';

class Dashboard extends Component {
  render() {
    return (
      <div className="content">
        <h2>Dashboard</h2>
        <h5>Welcome {this.props.auth.username}</h5>
      </div>
    );
  }
}

export default Dashboard;
