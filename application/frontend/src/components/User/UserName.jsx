import React, { Component } from "react";
class UserName extends Component {
  state = {
      display = {
        
      }
  };

  handleViewUser = event => {
    
  };

  render() {
    return (
      <button
        className="list-group-item btn btn-link"
        type="button"
        name={props.user.name}
        value={propos.user.u_id}
        onClick={this.handleViewUser}
        key={user.u_id}
      >
        {user.name}
      </button>
    );
  }
}

export default UserName;
