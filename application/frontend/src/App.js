import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
//import Book from "./components/Books/Book.jsx";
//import Friends from "./components/Friends/Friends.jsx";
//import GenreBooks from "./components/Genres/GenreBooks.jsx";
// import MyBooks from "./components/MyBooks/MyBooks.jsx";
// import Login from "./components/Authentication/login.jsx"
// import Home from "./components/HomePage/Home.jsx"
// import Register from "./components/Authentication/register.jsx"
import Navbar from "./components/HomePage/navbar.jsx";
//import Comments from "./components/Books/Comments.jsx";

class App extends Component {
  state = {};
  render() {
    return (
      <div>
        <h1>Book Buddies</h1>
        <Navbar u_id={null} loggedIn={false} />
      </div>
    );
  }
}

export default App;
