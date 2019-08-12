//change 1 to this.props.b_id
//change u_id to this.props.u_id
import React, { Component } from "react";
import { Rating } from "semantic-ui-react";
class Book extends Component {
  state = {
    userRating: 0,
    book: {
      Author: [],
      Book: {
        description: null,
        no_ratings: 0,
        rating: 0,
        title: null
      },
      Comments: [
        {
          c_id: null,
          likes: null,
          title: null,
          u_id: null
        }
      ],
      GenreBooks: [
        {
          g_id: null,
          name: null
        }
      ]
    },
    display: {
      book: false
    }
  };

  setRating(newRating, uid, bid) {
    this.setState({ userRating: newRating });
    let url = "http://localhost:5000/book/updaterating";
    fetch(url, {
      method: "post",
      mode: "cors",
      body: JSON.stringify({
        b_id: bid, //this.props.u_id
        u_id: uid,
        rating: newRating
      }),
      headers: {
        "content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(
        result => {
          this.updateBookRatings(bid, uid);
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });

          console.log("error : " + error);
        }
      );
  }

  updateBookRatings(bid, uid) {
    let url = "http://localhost:5000/view/book";
    fetch(url, {
      method: "post",
      mode: "cors",
      body: JSON.stringify({
        b_id: bid //this.props.u_id
      }),
      headers: {
        "content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(
        result => {
          console.log(result);
          this.setState({ book: result, display: { book: true } });
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });

          console.log("error : " + error);
        }
      )
      .then(res => {
        fetch("http://localhost:5000/book/getuserrating", {
          method: "post",
          mode: "cors",
          body: JSON.stringify({
            b_id: bid,
            u_id: uid //this.props.u_id
          }),
          headers: {
            "content-Type": "application/json"
          }
        })
          .then(response => response.json())
          .then(
            result => {
              this.setState({ userRating: result.response });
            },
            error => {
              this.setState({
                isLoaded: true,
                error
              });

              console.log("error : " + error);
            }
          );
      });
  }
  componentDidMount() {
    this.updateBookRatings(1, 21);
  }

  render() {
    const title = this.state.book.Book.title;
    const authors = [];
    for (let i = 0; i < this.state.book.Author.length; i++) {
      authors.push(this.state.book.Author[i].name);
      if (i !== this.state.book.Author.length - 1) authors.push(", ");
    }
    const bookRating = (
      <Rating
        icon="star"
        rating={this.state.book.Book.rating}
        maxRating={5}
        disabled
      />
    );

    var userRating = (
      <Rating
        icon="star"
        rating={this.state.userRating}
        maxRating={5}
        onRate={(_, data) => {
          this.setRating(data.rating, 21, 1);
        }}
      />
    );
    return (
      <div className="jumbotron">
        <h2>{title}</h2>
        <h4>
          By{" "}
          {authors.map(author => (
            <span>{author}</span>
          ))}
        </h4>
        <b>
          {this.state.book.Book.no_ratings} people have rated this book:{" "}
          {bookRating}
          <br />
          Your Rating: {userRating}
        </b>
      </div>
    );
  }
}

export default Book;
