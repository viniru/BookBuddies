import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Book from "./components/Books/Book.jsx";
//import Friends from "./components/Friends/Friends.jsx";
// import Genres from "./components/Genres/Genres.jsx";
// import MyBooks from "./components/MyBooks/MyBooks.jsx";
// import Login from "./components/Authentication/login.jsx"
// import Home from "./components/HomePage/Home.jsx"
// import Register from "./components/Authentication/register.jsx"
//import Navbar from "./components/HomePage/navbar.jsx";

class App extends Component {
  state = {};
  render() {
    return (
      <div>
        <center fontColor="green">
          <h1>Book Buddies</h1>
        </center>
        <Book />
      </div>
    );
  }
}

export default App;
