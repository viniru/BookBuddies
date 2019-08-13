import React, { Component } from "react";

class GenreBookList extends Component {
  state = {
    u_id: this.props.u_id,
    g_id: this.props.g_id,
    genre: this.props.genre,
    loaded: false,
    books: []
  };

  componentDidMount() {
    let url = "http://localhost:5000/genre/getbookandratingbygenreid";
    fetch(url, {
      method: "post",
      mode: "cors",
      body: JSON.stringify({
        g_id: this.state.g_id //this.props.u_id
      }),
      headers: {
        "content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(
        result => {
          console.log(result.response);
          this.setState({ books: result.response, loaded: true });
        },
        error => {
          console.log(this.state.g_id);
          this.setState({
            isLoaded: true,
            error
          });

          console.log("error : " + error);
        }
      );
  }

  render() {
    const bookList = (
      <div>
        <span className="ml-4">Title</span>
        <span className="float-right mr-5">Rating</span>
        <p />
        <ul>
          {this.state.loaded
            ? this.state.books.map((book, index) => (
                <li key={book.b_id.toString()}>
                  <button
                    className="btn btn-link"
                    type="button"
                    onClick={() => this.props.handleClick(book.b_id)}
                  >
                    <p className="text-info">{book.title}</p>
                  </button>
                  <span className="float-right">
                    {book.rating}
                    <span className="stars-inactive ml-2">
                      <i
                        className={
                          book.rating >= 1 ? "fa fa-star" : "fa fa-star-o"
                        }
                        aria-hidden="true"
                      />
                      <i
                        className={
                          book.rating >= 2 ? "fa fa-star" : "fa fa-star-o"
                        }
                        aria-hidden="true"
                      />
                      <i
                        className={
                          book.rating >= 3 ? "fa fa-star" : "fa fa-star-o"
                        }
                        aria-hidden="true"
                      />
                      <i
                        className={
                          book.rating >= 4 ? "fa fa-star" : "fa fa-star-o"
                        }
                        aria-hidden="true"
                      />
                      <i
                        className={
                          book.rating >= 5 ? "fa fa-star" : "fa fa-star-o"
                        }
                        aria-hidden="true"
                      />
                    </span>
                  </span>
                </li>
              ))
            : "loading..."}
        </ul>
      </div>
    );

    return <div>{bookList}</div>;
  }
}

export default GenreBookList;
