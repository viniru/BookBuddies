import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Navbar from "./components/HomePage/navbar.jsx";
import Comments from './components/Books/Comments.jsx'

class App extends Component {
  state = {};
  render() {
    return (
      <div>
        <h1>Book Buddies</h1>
        <Navbar u_id={null} loggedIn={false}/>
        <Comments u_id={null} b_id={1}/>
      </div>
    );
  }
}

export default App;
