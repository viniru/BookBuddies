import React, { Component } from "react";
import Login from "../Authentication/login.jsx";
import Register from "../Authentication/register.jsx";
import Books from "../Books/Books.jsx";
import Friends from "../Friends/Friends.jsx";
import Genres from "../Genres/Genres.jsx";
import MyBooks from "../MyBooks/MyBooks.jsx";
import Home from './Home.jsx';

class Navbar extends Component {
  state = {
    u_id : this.props.u_id,
    loggedIn : this.props.loggedIn,
    display : {
        Home : true,
        MyBooks : false,
        Books : false,
        Genres : false,
        Friends : false,
        SignUp : false,
        SignIn : false,
        SignOut : false
    },
  };

  handleClick = event => {
    let display = {
      Home : false,
      MyBooks: false,
      Books: false,
      Genres: false,
      Friends: false,
      SignUp: false,
      SignIn: false,
      SignOut: false
    };

    display[event.target.name] = true;
    this.setState({ display });

    if(event.target.name === 'SignOut') {
      this.setState({
        u_id : null,
        loggedIn : false
      });
    }
  };

  render() {

    const mybooks = <div className="mr-2">
                      {this.state.u_id ? <button className="btn btn-info" name="MyBooks" onClick={this.handleClick}> <i className="fa fa-user-circle"/>My Books
                      </button>:<button className="btn btn-info btn-primary" name="MyBooks" onClick={this.handleClick}disabled ><i className="fa fa-user-circle"/>My Books
                      </button>}
                    </div>;

    const friends = <div className="mx-2">
                      {this.state.u_id ? <button className="btn btn-info" name="Friends" onClick={this.handleClick}> <i className="fa fa-user-circle"/>Friends
                      </button>:<button className="btn btn-info btn-primary" name="Friends" onClick={this.handleClick}disabled ><i className="fa fa-user-circle"/>Friends
                      </button>}
                    </div>;

    const signUp =  <div className="mx-1">
                      <button className="btn btn-success" name="SignUp" onClick={this.handleClick}>
                        <i className="fa fa-user"/>Sign up
                      </button>
                    </div>;

    const signIn = <div className="mx-1">
                      <button className="btn btn-success" name="SignIn" onClick={this.handleClick}>
                        <i className="fa fa-sign-in"/>Sign in
                      </button>
                    </div>;

    const logOut = <div className="mx-1">
                    <button className="btn btn-warning" name="SignOut" onClick={this.handleClick}>
                      <i className="fa fa-sign-out"/>Sign out
                    </button>
                  </div>;

    const navigationBar = <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                            <button className="btn btn-dark btn-lg" name="Home" onClick={this.handleClick}>Book Buddies</button>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                              <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarCollapse">

                              <ul className="navbar-nav mr-auto">

                              <li className="nav-item">
                                {mybooks}
                              </li>

                              <li className="nav-item">
                                <div className="mx-2">
                                  <button className="btn btn-info" name="Books" onClick={this.handleClick}>
                                    <i className="fa fa-book"/>Books
                                  </button>
                                </div>
                              </li>

                              <li className="nav-item">
                                <div className="mx-2">
                                  <button className="btn btn-info" name="Genres" onClick={this.handleClick}>
                                    <i className="fa fa-film"/>Genres
                                    </button>
                                </div>
                              </li>

                              <li className="nav-item">
                                {friends}
                              </li>

                              </ul>

                              <ul className="nav navbar-nav ml-auto">

                                <li className="nav-item">
                                  {this.state.u_id ? null : signUp}
                                </li>

                                <li className="nav-item">
                                  {this.state.u_id ?  null : signIn}
                                </li>

                                <li className="nav-item">
                                  {this.state.u_id ? logOut : null}
                                </li>

                              </ul>

                            </div>
                          </nav>;

    return (
      <div>
        {navigationBar}
        {this.state.display.Home ? <Home u_id={this.state.u_id} /> : null}
        {this.state.display.MyBooks ? <MyBooks u_id={this.state.u_id}/> : null }
        {this.state.display.Books ? <Books u_id={this.state.u_id}/> : null }
        {this.state.display.Genres ? <Genres u_id={this.state.u_id}/> : null }
        {this.state.display.Friends ? <Friends u_id={this.state.u_id}/> : null }
        {this.state.display.SignUp ? <Register /> : null }
        {this.state.display.SignIn ? <Login signedIn={this.state.loggedIn}/> : null }
        {this.state.display.SignOut ? <Login /> : null }
      </div>
    );
  }
}

export default Navbar;
