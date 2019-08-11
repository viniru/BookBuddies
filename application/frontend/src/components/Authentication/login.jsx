import React, { Component } from "react";
import Register from "./register.jsx";
import Navbar from "../HomePage/navbar.jsx";

class Login extends Component {
  state = {
    username: "",
    password: "",
    u_id: null,
    success: false,
    displayRegister: false
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    fetch("http://localhost:5000/auth/login", {
      method: "post",
      mode: "cors",
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      }),
      headers: {
        "content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json =>
        this.setState({
          usernameError: !json.username_exists,
          passwordError: !json.password_matched,
          success: json.password_matched && json.username_exists,
          u_id: json.u_id
        })
      );
  };

  handleSignUp = event => {
    this.setState({ displayRegister: true });
  };

  render() {
    const usernameAlert = (
      <div className="alert alert-danger alert-dismissible">
        <button type="button" className="close" data-dismiss="alert">
          &times;
        </button>
        <strong>Invalid Username!</strong> user not found.
      </div>
    );

    const passwordAlert = (
      <div className="alert alert-danger alert-dismissible">
        <button type="button" className="close" data-dismiss="alert">
          &times;
        </button>
        <strong>Wrong password!</strong> Please try again.
      </div>
    );

    const output = this.state.success ? (
      <Navbar username={this.state.username} u_id={this.state.u_id} />
    ) : this.state.displayRegister ? (
      <Register />
    ) : (
      <div className="jumbotron jumbotron-fluid">
        <div className="container">
          <h1>Login</h1>
          <form onSubmit={this.handleSubmit}>
            {this.state.usernameError ? usernameAlert : null}
            {this.state.passwordError ? passwordAlert : null}
            <div className="form-group">
              <label>Username:</label>
              <input
                name="username"
                className="form-control"
                placeholder="Enter your username"
                value={this.state.username}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password:</label>
              <input
                className="form-control"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={this.state.password}
                onChange={this.handleChange}
                required
              />
            </div>

            <button className="btn btn-primary" type="submit">
              Login
            </button>
            <button
              className="btn btn-link"
              type="button"
              onClick={this.handleSignUp}
            >
              Not a member? Sign Up
            </button>
          </form>
        </div>
      </div>
    );

    return <div>{output}</div>;
  }
}

export default Login;
