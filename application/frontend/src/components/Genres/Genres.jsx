import "whatwg-fetch";
import React, { Component } from "react";
class Genres extends Component {
  state = {
    count: 0,
    genres: []
  };

  componentDidMount() {
    fetch("http://localhost:5000/genre/list")
      .then(response => response.json())
      .then(
        result => {
          this.setState({
            isLoaded: true,
            genres: result.response,
            count: result.response.length
          });
        },

        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.

        error => {
          this.setState({
            isLoaded: true,
            error
          });

          console.log("error : " + error);
        }
      );
  }

  render() {
    return (
      <button onClick="" className="btn btn-primary m-4 btn-lg">
        Genres({this.formatCount()})
      </button>
    );
  }

  formatCount() {
    return this.state.count;
  }
}

export default Genres;
