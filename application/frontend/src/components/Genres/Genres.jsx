import React, { Component } from "react";
import GenreBooks from "./GenreBooks.jsx";

class Genres extends Component {
  state = {
    u_id: this.props.u_id,
    g_id: null,
    genre: null,
    count: "0",
    genres: [],
    display: {
      genres: false,
      bookList: false
    }
  };

  formatCount() {
    return this.state.count;
  }

  handleViewGenreBooks = event => {
    let genre = event.target.value;
    fetch("http://localhost:5000/genre/getgenreidbygenre", {
      method: "post",
      mode: "cors",
      body: JSON.stringify({
        genre: genre //this.props.u_id
      }),
      headers: {
        "content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(
        result => {
          this.setState({
            g_id: result.response,
            genre: genre,
            display: {
              genres: false,
              bookList: true
            }
          });
        },

        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  };

  componentDidMount() {
    fetch("http://localhost:5000/genre/list")
      .then(response => response.json())
      .then(
        result => {
          this.setState({
            isLoaded: true,
            display: { genres: true },
            genres: result.response,
            count: result.response.length,
            genre_selected: null
          });
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

  render() {
    var container = {
      width: "75%"
    };

    const genres = (
      <div className="container">
        <div className="list-group">
          {" "}
          <br />
          {this.state.genres.map(genre => (
            <button
              className="list-group-item list-group-item-primary btn btn-link"
              type="button"
              name={genre}
              value={genre}
              onClick={this.handleViewGenreBooks}
              key={genre}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
    );

    return this.state.display.genres ? (
      genres
    ) : this.state.display.bookList ? (
      <GenreBooks
        u_id={this.state.u_id}
        g_id={this.state.g_id}
        genre={this.state.genre}
      />
    ) : null;
  }
}

export default Genres;
