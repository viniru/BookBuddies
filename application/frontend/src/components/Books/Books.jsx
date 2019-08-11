import React, { Component } from "react";
class Books extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        {this.props.visibility && (
          <button className="btn btn-primary m-4 btn-lg">Books</button>
        )}
      </React.Fragment>
    );
  }
}

export default Books;
