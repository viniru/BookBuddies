import React, { Component } from "react";
import "./Friends.css";
import User from "../User/User.jsx";

class FindFriends extends Component {
  state = {
    count: 0,
    users: [],
    display: {
      users: false,
      singleuser: false
    },
    u_id_t: null, // u_id of the person the user clicks, will be updated in handle view user
    name_t: null
  };

  handleAddFriend = event => {
    var u_id_r = event.target.value;
    var u_id_s = this.props.u_id;
    var url = "http://localhost:5000/friends/sendrequest";
    this.AddFriendCall(url, u_id_s, u_id_r).then(
      this.fetchDataFromURL("http://localhost:5000/user/all").then(result => {
        console.log("hello");
        console.log(result);
        this.setState({
          users: result.response,
          count: result.response.count
        });
      })
    );
  };

  handleViewUser = event => {
    let display = {
      users: false,
      singleuser: true
    };

    this.setState({
      display,
      u_id_t: event.target.value,
      name_t: event.target.name
    });
  };

  AddFriendCall = (url, u_ids, u_idr) => {
    return fetch(url, {
      method: "post",
      mode: "cors",
      body: JSON.stringify({
        u_id_s: u_ids,
        u_id_r: u_idr
        //this.props.u_id
      }),
      headers: {
        "content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(
        result => {
          return result;
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
          console.log("error : " + error);
        }
      );
  };

  componentDidMount() {
    let url = "http://localhost:5000/user/all";
    this.fetchDataFromURL(url).then(result => {
      this.setState({
        display: {
          users: true
        },
        users: result.response,
        count: result.response.length
      });
    });
  }

  fetchDataFromURL = url => {
    return fetch(url)
      .then(response => response.json())
      .then(
        result => {
          return result;
        },
        error => {
          return error;
        }
      );
  };

  render() {
    var half = {
      width: "50%"
    };

    const users = (
      <center>
        <div className="list-group" style={half}>
          {" "}
          {this.state.users.map(user => [
            <button
              className="list-group-item btn btn-link"
              type="button"
              name={user.name}
              value={user.u_id}
              onClick={this.handleViewUser}
              key={user.u_id}
            >
              {user.name}
            </button>,
            <button
              onClick={this.handleAddFriend}
              value={user.u_id}
              className="btn btn-success btn-sm"
            >
              Send Friend Request
            </button>,
            <br />
          ])}
        </div>
      </center>
    );

    return this.state.display.users ? (
      users
    ) : this.state.display.singleuser ? (
      <User u_id={this.state.u_id_t} name={this.state.name_t} />
    ) : null;
  }
}

export default FindFriends;
