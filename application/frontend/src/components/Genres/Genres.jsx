import React, { Component } from "react";
class Genres extends Component {
  state = {
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
    this.setState({
      genre_selected: event.target.value,
      display: {
        genres: false,
        bookList: true
      }
    });
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
      <div className={container}>
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
      <h1>display the books here</h1>
    ) : null;
  }
}

export default Genres;
