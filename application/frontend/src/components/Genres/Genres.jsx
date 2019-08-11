import React, { Component } from "react";
import GenresList from "./GenresList.jsx";

class Genres extends Component {
  state = {
    display: false
  };

  openGenres = () => {
    var display = true;
    this.setState({ display });
  };

  render() {
    return (
      <React.Fragment>
          <button
            onClick={this.openGenres}
            className="btn btn-primary m-4 btn-lg"
          >
            Genres
          </button>
        {this.state.display && <GenresList />}
      </React.Fragment>
    );
  }
}

export default Genres;
