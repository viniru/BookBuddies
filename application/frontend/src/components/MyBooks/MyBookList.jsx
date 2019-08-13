import React, { Component } from 'react';



//idea for closing alerts.. add onClick and set state to false or null....




class MyBookList extends Component {
    state = {
      u_id : this.props.u_id,
      status : this.props.status,
      loaded : false,
      books : [],
      typedBook : "",
      WrongBook : false,
      existsForUser : false
    };

    handleChange = event => {
      this.setState({typedBook : event.target.value});
    }

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

    // if delete button is clicked.......
    removeBook = (b_id, index) => {
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

    // if add button is clicked....
    addBook = event => {
      this.setState({loaded : false});
      fetch('http://localhost:5000/user/addbook',
         {
           method : "post",
           mode : "cors",
           body : JSON.stringify({
             "u_id" : this.state.u_id,
             "book" : this.state.typedBook,
             "status" : this.state.status
           }),
           headers: {
              'content-Type': 'application/json'
          }
        })
        .then(response => response.json()
        .then(json => {
            console.log(json);
            if(!json.book_exists) {
                this.setState({WrongBook : true, existsForUser: false, loaded : true});
                console.log('no book_exists');
            }
            else if(json.exists_for_user) {
                this.setState({existsForUser : true, WrongBook : false, loaded: true});
                console.log('exists_for_user');
            }
            else {
                this.setState( {books : json.books, loaded : true, typedBook : "", WrongBook: false, existsForUser : false} );
                console.log('added');
            }
        }));
    }

    closeAlert = event => {
      this.setState(
        {
          [event.target.name] : false
        }
      );
    }


    render() {


      const bookNotFoundAlert = <div className="alert alert-danger alert-dismissible">
                                <button type="button" className="close" name="WrongBook" onClick={this.closeAlert}>&times;</button>
                                <strong>Book not found!</strong> Book is not our databse.
                              </div>;

      const bookExistsAlert = <div className="alert alert-danger alert-dismissible">
                                <button type="button" className="close" name="existsForUser" onClick={this.closeAlert}>&times;</button>
                                <strong>Book exists!</strong> You already have this book.
                              </div>;


      const bookList = <ul>{this.state.books.length === 0 && this.state.loaded ? "You dont have any books" : null}
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
            {this.state.WrongBook ? bookNotFoundAlert : null}
            {this.state.existsForUser ? bookExistsAlert : null}
            {bookList}
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Enter Book Name" value={this.state.typedBook} onChange={this.handleChange} />
                <span className="input-group-btn">
                    <button className="btn btn-primary ml-2" type="button" onClick={this.addBook}>Add!</button>
                </span>
            </div>
          </div>
        );
    }
}

export default MyBookList;
