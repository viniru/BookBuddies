import React, { Component } from "react";
import "./Friends.css";
import User from "../User/User.jsx";
import FindFriends from "../Friends/FindFriends.jsx";

class Friends extends Component {
  state = {
    friends: [],
    friendRequests: [],
    friendsCount: 0,
    friendRequestsCount: 0,
    display: {
      friends: false,
      findFriends: false,
      User: false
    },
    u_id_t: null, // u_id of the person the user clicks, will be updated in handle view user
    name_t: null
  };

  componentDidMount() {
    this.fetchFriends();
    this.fetchFriendRequests();
    let display = {
      friends: false,
      findFriends: false,
      User: false
    };
    display.friends = true;
    this.setState({ display });
  }

  handleViewUser = event => {
    let display = {
      friends: false,
      findFriends: false,
      User: false
    };
    display["user"] = true;

    console.log(event.target.value);
    console.log(event.target.name);

    this.setState({
      display,
      u_id_t: event.target.value,
      name_t: event.target.name
    });
  };

  handleAcceptRequest = event => {
    let friend_id = event.target.value;
    this.executeURL(
      "http://localhost:5000/friends/acceptrequest",
      this.props.u_id,
      friend_id
    ).then(result => {
      this.fetchFriends();
      this.fetchFriendRequests();
    });
  };

  handleFindFriends = event => {
    let display = { friends: false, findFriends: false, User: false };
    display["findFriends"] = true;
    this.setState({ display });
  };

  executeURL(url, u_id1, friend_id) {
    return fetch(url, {
      method: "post",
      mode: "cors",
      body: JSON.stringify({
        u_id_s: friend_id,
        u_id_r: u_id1
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
  }

  handleCancelRequest = event => {
    var friend_id = event.target.value;
    this.executeURL(
      "http://localhost:5000/friends/cancelrequest",
      this.props.u_id,
      friend_id
    ).then(result => {
      console.log(result);
      this.fetchFriendRequests();
    });
  };

  handleRemoveFriend = event => {
    var friend_id = event.target.value;
    this.executeURL(
      "http://localhost:5000/friends/unfriend",
      this.props.u_id,
      friend_id
    ).then(result => {
      this.fetchFriends();
    });
  };

  fetchDataFromURL = (url, uid) => {
    return fetch(url, {
      method: "post",
      mode: "cors",
      body: JSON.stringify({
        u_id: uid //this.props.u_id
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

  fetchFriends() {
    let u_id = this.props.u_id;
    let url_friends = "http://localhost:5000/friends/viewfriends";
    this.fetchDataFromURL(url_friends, u_id).then(result => {
      this.setState({
        isLoaded: true,
        friends: result.response,
        friendsCount: result.response.length
      });
    });
  }

  fetchFriendRequests() {
    let u_id = this.props.u_id;
    let url_requests = "http://localhost:5000/friends/viewrequestsrecieved";
    this.fetchDataFromURL(url_requests, u_id).then(result => {
      this.setState({
        isLoaded: true,
        friendRequests: result.response,
        friendRequestsCount: result.response.length
      });
    });
  }
  //this.props.u_id}

  render() {
    var container = {
      width: "75%",
      height: "30px",
      borderRadius: "5px",
      align: "center",
      clear: "both"
    };

    var leftsubcont = {
      width: "45%",
      float: "left"
    };
    var rightsubcont = {
      width: "45%",
      float: "right"
    };
    var subcontheader = {
      color: "white",
      backgroundColor: "blue"
    };
    var buttonContainer = {
      width: "100%"
    };
    var divPushLeft = {
      position: "fixed",
      bottom: "0",
      width: "100%"
    };

    const friends = (
      <center>
        <br /> <br /> <br />
        <div class="row" style={container}>
          <div class="col" style={leftsubcont}>
            <div style={subcontheader}>Friends ({this.state.friendsCount})</div>
            <div className="list-group">
              {" "}
              <br />
              {this.state.friends.map(user => [
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
                  onClick={this.handleRemoveFriend}
                  value={user.u_id}
                  className="btn btn-danger btn-sm"
                >
                  Remove Friend
                </button>,
                <br />
              ])}
            </div>
          </div>

          <div class="col rightmost" style={rightsubcont}>
            <div style={subcontheader}>
              Friend Requests ({this.state.friendRequestsCount})
            </div>
            <div className="list-group">
              {" "}
              <br />
              {this.state.friendRequests.map(user => [
                <button
                  className="list-group-item btn btn-link"
                  type="button"
                  value={user.u_id}
                  name={user.name}
                  onClick={this.handleViewUser}
                  key={user.u_id}
                >
                  {user.name}
                </button>,
                <div className={buttonContainer}>
                  <button
                    onClick={this.handleAcceptRequest}
                    value={user.u_id}
                    className="btn btn-success btn-sm button"
                  >
                    Accept Request
                  </button>
                  <button
                    onClick={this.handleCancelRequest}
                    value={user.u_id}
                    className="btn btn-danger btn-sm button"
                  >
                    Deny Request
                  </button>
                </div>
              ])}
            </div>
          </div>
          <br />
          <div class="leftmost">
            <button
              onClick={this.handleFindFriends}
              className="btn btn-danger btn-sm button"
            >
              {" "}
              Find more Friends{" "}
            </button>
          </div>
        </div>
      </center>
    );

    return this.state.display.friends ? (
      friends
    ) : this.state.display.user ? (
      <User u_id_t={this.state.u_id_t} name_t={this.state.name_t} />
    ) : this.state.display.findFriends ? (
      <FindFriends u_id={this.props.u_id} friends={this} />
    ) : null;
  }
}

export default Friends;
