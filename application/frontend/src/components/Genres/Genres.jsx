import React, { Component } from "react";
import GenresList from "./GenresList.jsx";

class Genres extends Component {
  state = {
    count: 0,
    display: false
  };

  openGenres = () => {
    this.props.activeComponent(this.props.id);
    var display = true;
    this.setState({ display });
  };

  render() {
    return (
      <React.Fragment>
        {this.props.visibility && (
          <button
            onClick={this.openGenres}
            className="btn btn-primary m-4 btn-lg"
          >
            Genres({this.formatCount()})
          </button>
        )}

        {this.state.display && <GenresList />}
      </React.Fragment>
    );
  }

  formatCount() {
    return this.state.count;
  }
}

export default Genres;
