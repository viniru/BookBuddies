import React, { Component } from 'react';






//editing backend for adding books...






class MyBookList extends Component {
    state = {
      u_id : this.props.u_id,
      status : this.props.status,
      loaded : false,
      books : []
    };

    componentDidMount() {
      fetch('http://localhost:5000/user/viewbooks',
         {
           method : "post",
           mode : "cors",
           body : JSON.stringify({
             "u_id" : this.state.u_id,
             "status" : this.state.status
           }),
           headers: {
              'content-Type': 'application/json'
          }
        })
        .then(response => response.json()
        .then(books => {
          this.setState( {books, loaded : true} );
        }));
    }

    removeBook = (b_id, index) => {
      console.log(this.state);
      this.setState({loaded : false});
      fetch('http://localhost:5000/user/removebook',
         {
           method : "post",
           mode : "cors",
           body : JSON.stringify({
             "u_id" : this.state.u_id,
             "status" : this.state.status,
             "b_id" : b_id
           }),
           headers: {
              'content-Type': 'application/json'
          }
        })
        .then(response => response.json()
        .then(books => {
          this.setState( {books, loaded : true} );
        }));
    }


    render() {

      const bookList = <ul>
                          {this.state.loaded ? this.state.books.map( (book,index) =>
                              <li key={book.b_id.toString()}>
                                <button
                                  className="btn btn-link"
                                  type = "button"
                                  onClick={() => this.props.handleClick(book.b_id)}
                                  >
                                  {book.title}
                                </button>
                                <button className="btn btn-round float-right" onClick={() => this.removeBook(book.b_id, index)}>
                                  <i className="fa fa-trash" aria-hidden="true">
                                  </i>
                                </button>
                              </li>
                          ): "loading..."}
                        </ul>

        return (
          <div>
            {bookList}
          </div>
        );
    }
}

export default MyBookList;
