import React, { Component } from "react";
import Login from "../Authentication/login.jsx";
import Register from "../Authentication/register.jsx";
import Books from "../Books/Books.jsx";
import Friends from "../Friends/Friends.jsx";
import Genres from "../Genres/Genres.jsx";
import MyBooks from "../MyBooks/MyBooks.jsx";

class Navbar extends Component {
  state = {
<<<<<<< HEAD
    u_id : this.props.u_id,
    loggedIn : this.props.loggedIn,
    display : {
        MyBooks : false,
        Books : false,
        Genres : false,
        Friends : false,
        SignUp : false,
        SignIn : true,
        SignOut : false
    },
=======
    username: this.props.username,
    u_id: this.props.u_id,
    display: {
      MyBooks: false,
      Books: false,
      Genres: false,
      Friends: false,
      SignUp: false,
      SignIn: false,
      SignOut: false
    }
>>>>>>> 4b99f2c85505f72ac7e254107001da8dc93b92b3
  };

  handleClick = event => {
    let display = {
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
<<<<<<< HEAD

    if(event.target.name === 'SignOut') {
      this.setState({
        u_id : null,
        loggedIn : false
      });
=======
    if (event.target.name.includes("SignOut")) {
      this.setState({ username: "" });
>>>>>>> 4b99f2c85505f72ac7e254107001da8dc93b92b3
    }
  };

  render() {
<<<<<<< HEAD

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
                            <button className="btn btn-dark btn-lg" href="#">Book Buddies</button>
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
        {this.state.display.MyBooks ? <MyBooks u_id={this.state.u_id}/> : null }
        {this.state.display.Books ? <Books u_id={this.state.u_id}/> : null }
        {this.state.display.Genres ? <Genres u_id={this.state.u_id}/> : null }
        {this.state.display.Friends ? <Friends u_id={this.state.u_id}/> : null }
        {this.state.display.SignUp ? <Register /> : null }
        {this.state.display.SignIn ? <Login signedIn={this.state.loggedIn}/> : null }
        {this.state.display.SignOut ? <Login /> : null }
=======
    console.log(this.state);
    const mybooks = (
      <div className="mr-2">
        {this.state.username ? (
          <button
            className="btn btn-info"
            name="MyBooks"
            onClick={this.handleClick}
          >
            {" "}
            <i className="fa fa-user-circle" />
            My Books
          </button>
        ) : (
          <button
            className="btn btn-info btn-primary"
            name="MyBooks"
            onClick={this.handleClick}
            disabled
          >
            <i className="fa fa-user-circle" />
            My Books
          </button>
        )}
      </div>
    );

    const friends = (
      <div className="mx-2">
        {this.state.username ? (
          <button
            className="btn btn-info"
            name="Friends"
            onClick={this.handleClick}
          >
            {" "}
            <i className="fa fa-user-circle" />
            Friends
          </button>
        ) : (
          <button
            className="btn btn-info btn-primary"
            name="Friends"
            onClick={this.handleClick}
            disabled
          >
            <i className="fa fa-user-circle" />
            Friends
          </button>
        )}
      </div>
    );

    const signUp = (
      <div className="mx-1">
        <button
          className="btn btn-success"
          name="SignUp"
          onClick={this.handleClick}
        >
          <i className="fa fa-user" />
          Sign up
        </button>
      </div>
    );

    const signIn = (
      <div className="mx-1">
        <button
          className="btn btn-success"
          name="SignIn"
          onClick={this.handleClick}
        >
          <i className="fa fa-sign-in" />
          Sign in
        </button>
      </div>
    );

    const logOut = (
      <div className="mx-1">
        <button
          className="btn btn-warning"
          name="SignOut"
          onClick={this.handleClick}
        >
          <i className="fa fa-sign-out" />
          Sign out
        </button>
      </div>
    );

    const navigationBar = (
      <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <button className="btn btn-dark btn-lg" href="#">
          Book Buddies
        </button>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">{mybooks}</li>

            <li className="nav-item">
              <div className="mx-2">
                <button
                  className="btn btn-info"
                  name="Books"
                  onClick={this.handleClick}
                >
                  <i className="fa fa-book" />
                  Books
                </button>
              </div>
            </li>

            <li className="nav-item">
              <div className="mx-2">
                <button
                  className="btn btn-info"
                  name="Genres"
                  onClick={this.handleClick}
                >
                  <i className="fa fa-film" />
                  Genres
                </button>
              </div>
            </li>

            <li className="nav-item">{friends}</li>
          </ul>

          <ul className="nav navbar-nav ml-auto">
            <li className="nav-item">{this.state.username ? null : signUp}</li>

            <li className="nav-item">{this.state.username ? null : signIn}</li>

            <li className="nav-item">{this.state.username ? logOut : null}</li>
          </ul>
        </div>
      </nav>
    );

    return (
      <div>
        {navigationBar}
        {this.state.display.MyBooks ? <MyBooks /> : null}
        {this.state.display.Books ? <Books /> : null}
        {this.state.display.Genres ? <Genres id={4} visibility={true} /> : null}
        {this.state.display.Friends ? <Friends u_id={this.props.u_id} /> : null}
        {this.state.display.SignUp ? <Register /> : null}
        {this.state.display.SignIn ? <Login /> : null}
        {this.state.display.SignOut ? <Login /> : null}
>>>>>>> 4b99f2c85505f72ac7e254107001da8dc93b92b3
      </div>
    );
  }
}

export default Navbar;
