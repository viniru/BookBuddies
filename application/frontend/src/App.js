import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Books from "./components/Books/Books.jsx";
import Friends from "./components/Friends/Friends.jsx";
import Genres from "./components/Genres/Genres.jsx";
import MyBooks from "./components/MyBooks/MyBooks.jsx";
import Login from "./components/Authentication/login.jsx"
import Register from "./components/Authentication/register.jsx"

class App extends Component {
  state = {};
  render() {
    return (
      <div>
        <h1> Book Buddies</h1>
        <Register />
        <Login />
        <Books />
        <MyBooks />
        <Friends />
        <Genres />
      </div>
    );
  }
}

export default App;
