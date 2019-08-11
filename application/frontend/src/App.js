import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
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
