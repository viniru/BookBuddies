import React, { Component } from "react";

class Home extends Component {
  state = {}


  render() {
    // const size={
    //   font-size : 12;
    // }
    return (
        <div className="jumbotron jumbotron-fluid">
          <div className="container">
            <h1>Welcome to Book Buddies</h1>
            <ul>
              <li className="md-3 mt-2 font-italic" style={{fontSize : 16}}>Manage the books you are reading.</li>
              <li className="md-3 mt-2 font-italic" style={{fontSize : 16}}>Comment on your favorite books.</li>
              <li className="md-3 mt-2 font-italic" style={{fontSize : 16}}>Rate your favorite books.</li>
              <li className="md-3 mt-2 font-italic" style={{fontSize : 16}}>List books by genre.</li>
              <li className="md-3 mt-2 font-italic" style={{fontSize : 16}}>Make friends and enjoy.</li>
            </ul>
          </div>
        </div>
      );
  }
}

export default Home;
