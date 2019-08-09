import React, { Component } from "react";
class MyBooks extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        {this.props.visibility && (
          <button className="btn btn-primary m-4 btn-lg">Friends</button>
        )}
      </React.Fragment>
    );
  }
}

export default MyBooks;
