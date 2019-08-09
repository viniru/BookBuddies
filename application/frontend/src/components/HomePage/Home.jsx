import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Books from "./../Books/Books.jsx";
import Friends from "./../Friends/Friends.jsx";
import Genres from "./../Genres/Genres.jsx";
import MyBooks from "./../MyBooks/MyBooks.jsx";

class Home extends Component {
  state = {
    display: [1, 2, 3, 4],
    everything: [1, 2, 3, 4]
  };

  checkVisibility = compo => {
    return this.state.display.includes(compo);
  };

  displayAllComponent = () => {
    var display = [...this.everything];
    this.setState({ display });
  };

  activeComponent = compo => {
    var display = [];
    //display.push(compo);
    this.setState({ display });
  };

  render() {
    return (
      <div>
        <h1> Book Buddies</h1>
        <Books
          id={1}
          visibility={this.checkVisibility(1)}
          displayAllComponent={this.displayAllComponent}
          activeComponent={this.activeComponent}
        />
        <MyBooks
          id={2}
          visibility={this.checkVisibility(2)}
          displayAllComponent={this.displayAllComponent}
          activeComponent={this.activeComponent}
        />
        <Friends
          id={3}
          visibility={this.checkVisibility(3)}
          displayAllComponent={this.displayAllComponent}
          activeComponent={this.activeComponent}
        />
        <Genres
          id={4}
          visibility={this.checkVisibility(4)}
          displayAllComponent={this.displayAllComponent}
          activeComponent={this.activeComponent}
        />
      </div>
    );
  }
}

export default Home;
