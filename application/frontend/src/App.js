import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Books from "./components/Books/Books.jsx";
import Friends from "./components/Friends/Friends.jsx";
import Genres from "./components/Genres/Genres.jsx";
import MyBooks from "./components/MyBooks/MyBooks.jsx";

class App extends Component {
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
    display.push(compo);
    this.setState({ display });
  };

  render() {
    return (
      <div>
        <h1> Book Buddies</h1>
        {this.checkVisibility(1) ? (
          <Books
            id={1}
            displayAllComponent={this.displayAllComponent}
            activeComponent={this.activeComponent}
          />
        ) : null}

        {this.checkVisibility(2) ? (
          <MyBooks
            id={2}
            displayAllComponent={this.displayAllComponent}
            activeComponent={this.activeComponent}
          />
        ) : null}
        {this.checkVisibility(3) ? (
          <Friends
            id={3}
            displayAllComponent={this.displayAllComponent}
            activeComponent={this.activeComponent}
          />
        ) : null}
        {this.checkVisibility(4) ? (
          <Genres
            id={4}
            displayAllComponent={this.displayAllComponent}
            activeComponent={this.activeComponent}
          />
        ) : null}
      </div>
    );
  }
}

export default App;
