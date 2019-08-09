import React, { Component } from "react";
class GenresList extends Component {
  state = {
    count: 0,
    genres: []
  };

  formatCount() {
    return this.state.count;
  }

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
      <div>
        <h1>Genres({this.formatCount()})</h1>
        <ul>
          {this.state.genres.map(genre => (
            <li key={genre}> {genre} </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default GenresList;
