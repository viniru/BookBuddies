import React, { Component } from "react";
import GenreBookList from "./GenreBookList.jsx";
import Book from "../Books/Book.jsx";

class GenreBooks extends Component {
  state = {
    u_id: this.props.u_id,
    g_id: this.props.g_id,
    genre: this.props.genre,
    showBook: null
  };

  handleClick = b_id => {
    console.log("called");
    this.setState({ showBook: b_id });
  };

  render() {
    const output = (
      <div className="container-fluid">
        <div className="bg-secondary text-white">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h1 className="mt-5">Books Of {this.state.genre}</h1>
                <GenreBookList
                  handleClick={this.handleClick}
                  g_id={this.state.g_id}
                  u_id={this.state.u_id}
                  genre={this.state.genre}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div>
        {this.state.showBook ? (
          <Book b_id={this.state.showBook} u_id={this.state.u_id} />
        ) : (
          output
        )}
      </div>
    );
  }
}

export default GenreBooks;
