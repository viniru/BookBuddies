import React, { Component } from "react";


class User extends Component {
    state = {
        u_id : this.props.u_id,
        viewer_id : null,
        user : null,
        comments : [],
        friends: []
    }

    componentDidMount() {
        fetch("http://localhost:5000/user/userdetails", {
          method: "post",
          mode: "cors",
          body: JSON.stringify({
            u_id : this.state.u_id
          }),
          headers: {
            "content-Type": "application/json"
          }
        })
        .then(response => response.json())
        .then(user => { this.setState({user : user});});


        fetch("http://localhost:5000/user/usercomments", {
          method: "post",
          mode: "cors",
          body: JSON.stringify({
            u_id : this.state.u_id
          }),
          headers: {
            "content-Type": "application/json"
          }
        })
        .then(response => response.json())
        .then(comments => {this.setState({comments});});


        fetch("http://localhost:5000/friends/viewfriends", {
          method: "post",
          mode: "cors",
          body: JSON.stringify({
            u_id : this.state.u_id
          }),
          headers: {
            "content-Type": "application/json"
          }
        })
        .then(response => response.json())
        .then(json =>
          this.setState({friends : json.response})
        );
    }



    render() {
      console.log(this.state);

      const addFriend = <span className="d-inline ml-5 md">
                          <button type="button" className="btn btn-primary">Add Friend
                            <i className="fa fa-user-plus ml-2"/>
                          </button>
                        </span>

      return (
          <div>
            <div className="jumbotron jumbotron-fluid">
              <div className="container">
                <div className="row">
                    <div className="col-md-7">

                        <h2 className="d-inline">{this.state.user ? this.state.user.map( item => item.name) : "loading..."}</h2>
                        <div className="ml-2">
                        <i className="">@{this.state.user ? this.state.user.map( item => item.username) : "loading..."} </i>
                        <hr/>
                        <div className="mt-2"> Joined on : {this.state.user ? this.state.user.map( item => item.date_created.substring(0, item.date_created.length-13)) : "loading..."}</div>
                        <br /><div className="mt-1"> Email : {this.state.user ? this.state.user.map( item => item.email) : "loading..."}</div>
                        <br /><div className="mt-1"> Comments : {this.state.comments.length}</div>
                        <br /><div className="mt-1"> Friends : {this.state.friends.length}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="container">

                <div className="row">
                      <div className="col-md-8 col-md-offset-2 col-sm-12">
                          <div className="comment-wrapper">
                              <div className="panel panel-info">
                                  <div className="panel-heading">

                                      <h3 className="text-center">Comments by {this.state.user ? this.state.user.map( item => item.username) : "loading..."} <i className="fa fa-comments ml-2 mr-2" />({this.state.comments.length})</h3><hr/>
                                  </div>
                                  <div className="panel-body">


                                      <ul className="media-list">
                                        {this.state.comments.length !== 0 ? this.state.comments.map( (comment,index) =>
                                          <div><li key={comment.c_id.toString()} className="media mb-4">

                                              <div className="media-body">
                                                  <span className="text-muted pull-right">
                                                    <small className="text-muted">{comment.comment_date}</small>
                                                  </span>
                                                  <strong className="text-success">@{comment.book}</strong>
                                                  <p>{comment.title}</p>
                                              </div>
                                              {this.state.u_id === comment.u_id ?
                                              <button
                                              type="button"
                                              className="btn btn-danger btn-sm mt-4"
                                              onClick = {() => this.handleDelete(comment.c_id)}
                                              >
                                              <i className="fa fa-trash"/>
                                              </button> : null}
                                          </li>
                                          <hr/>
                                          </div>
                                        ): "Loading..."}
                                      </ul>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
            </div>

          </div>
        );
    }
}

export default User;
