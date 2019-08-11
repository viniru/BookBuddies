import React, { Component } from "react";


class BookList extends Component {
    state = {
      u_id : this.props.u_id,
      loaded : false,
      books : []
    };


    componentDidMount() {
      fetch('http://localhost:5000/book/getallbooks')
        .then(response => response.json()
        .then(books => {
          this.setState( {books, loaded : true} );
        }));
    }


    render() {

      const bookList = <div><span>Books</span><span className="float-right mr-5">Rating</span><p></p>
                          <ul>
                            {this.state.loaded ? this.state.books.map( (book,index) =>
                                <li key={book.b_id.toString()}>
                                  <button
                                    className="btn btn-link"
                                    type = "button"
                                    onClick={() => this.props.handleClick(book.b_id)}
                                    >
                                    <p className="text-info">{book.title}</p>
                                  </button>
                                  <span className="float-right">
                                    {book.rating}
                                    <span className="stars-inactive ml-2">
                                        <i className={book.rating >= 1 ? "fa fa-star" : "fa fa-star-o"} aria-hidden="true"></i>
                                        <i className={book.rating >= 2 ? "fa fa-star" : "fa fa-star-o"} aria-hidden="true"></i>
                                        <i className={book.rating >= 3 ? "fa fa-star" : "fa fa-star-o"} aria-hidden="true"></i>
                                        <i className={book.rating >= 4 ? "fa fa-star" : "fa fa-star-o"} aria-hidden="true"></i>
                                        <i className={book.rating >= 5 ? "fa fa-star" : "fa fa-star-o"} aria-hidden="true"></i>
                                    </span>
                                  </span>

                                </li>
                            ): "loading..."}
                          </ul>
                        </div>

        return (
          <div>
            {bookList}
          </div>
        );
    }
}


export default BookList;
