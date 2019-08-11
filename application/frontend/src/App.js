import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
// import Books from "./components/Books/Books.jsx";
// import Friends from "./components/Friends/Friends.jsx";
// import Genres from "./components/Genres/Genres.jsx";
import MyBooks from "./components/MyBooks/MyBooks.jsx";
import Navbar from "./components/HomePage/navbar.jsx";

class App extends Component {
  state = {};
  render() {
    return (
      <div>
        <h1>Book Buddies</h1>
        <Navbar u_id={null} loggedIn={false}/>
        <MyBooks />
      </div>
    );
  }
}

export default App;
