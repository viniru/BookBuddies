import React, { Component } from "react";
import BookList from './BookList.jsx'
import Book from '../Books/Book.jsx'


class Books extends Component {

    state = {
      u_id : this.props.u_id,
      showBook : null
    }

    handleClick = (b_id) => {
      console.log('called');
      this.setState({showBook : b_id});
    }

    render() {
      console.log(this.state);
      const haha = <div className="container-fluid">
                    <div className="bg-secondary text-white">
                      <div className="container">
                        <div className="row">
                          <div className="col-12">
                              <h1 className="mt-5">Books</h1>
                              <BookList handleClick={this.handleClick}/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

      return (
        <div>
          {this.state.showBook ? <Book b_id={this.state.showBook} u_id={this.state.u_id}/> : haha}
        </div>
      );
    }
}

export default Books;
