import React, { Component } from "react";
import MyBookList from './MyBookList.jsx'
import Book from '../Books/Book.jsx'

class MyBooks extends Component {

  state = {
    u_id : 18, //this.props.u_id
    showBook : null
  };


  handleClick = (b_id) => {
    this.setState({showBook : b_id});
  }


  render() {
    const columns = <div className="container">
                      <h1>My Books</h1>

                      <div className="parent-container d-flex">

                          <div className="container">
                            <div className="row">
                              <div className="col">
                                <div className = "jumbotron">
                                    <h3>Read</h3>
                                    <MyBookList handleClick={this.handleClick} u_id={this.state.u_id} status={1}/>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="container">
                          <div className="row">
                            <div className="col">
                              <div className = "jumbotron">
                                  <h3>Reading</h3>
                                  <MyBookList handleClick={this.handleClick} u_id={this.state.u_id} status={2}/>
                            </div>
                          </div>
                        </div>
                      </div>

                        <div className="container">
                          <div className="row">
                            <div className="col">
                              <div className = "jumbotron">
                                  <h3>WishList</h3>
                                  <MyBookList handleClick={this.handleClick} u_id={this.state.u_id} status={3} />
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>;

    return (
      <div>
        {this.state.showBook ? <Book b_id={this.state.showBook} u_id={this.state.u_id}/> : columns}
      </div>
    );
  }
}

export default MyBooks;
