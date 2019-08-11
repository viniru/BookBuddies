import React, { Component } from "react";
class User extends Component {
  state = {};
  render() {
    return <div>I am the user {this.props.name} </div>;
  }
}

export default User;
