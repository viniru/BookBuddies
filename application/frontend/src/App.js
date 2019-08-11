import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
<<<<<<< HEAD
=======
// import Books from "./components/Books/Books.jsx";
//import Friends from "./components/Friends/Friends.jsx";
// import Genres from "./components/Genres/Genres.jsx";
// import MyBooks from "./components/MyBooks/MyBooks.jsx";
// import Login from "./components/Authentication/login.jsx"
// import Home from "./components/HomePage/Home.jsx"
// import Register from "./components/Authentication/register.jsx"
>>>>>>> 4b99f2c85505f72ac7e254107001da8dc93b92b3
import Navbar from "./components/HomePage/navbar.jsx";

class App extends Component {
  state = {};
  render() {
    return (
      <div>
        <h1>Book Buddies</h1>
        <Navbar u_id={null} loggedIn={false}/>
      </div>
    );
  }
}

export default App;
