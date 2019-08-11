import React, { Component } from 'react';
import Login from './login.jsx';
import Navbar from '../HomePage/navbar.jsx'

class Register extends Component {
  state = {
    fullName: "",
    username: "",
    email: "",
    password: "",
    comfirmPassword: "",
    passwordError: false,
    success: false,
    displayLogin: false,
    error: "",
    username_exists: false,
    email_exists: false
  };

  validate = () => {
    let isValid = true;

    if (this.state.fullName.length < 3) {
      isValid = false;
    }

    if (this.state.username.length < 5) {
      isValid = false;
    }

    if (!this.state.email.includes("@") || !this.state.email.includes(".com")) {
      isValid = false;
    }

    if (this.state.password.length < 6) {
      isValid = false;
    }

    if (!(this.state.password === this.state.confirmPassword)) {
      isValid = false;
      this.setState({
        passwordError: true
      });
    }

    if (!isValid) {
      this.setState({ error: "invalid credentials" });
    }

    return isValid;
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const isValid = this.validate();

    if (isValid) {
      fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "content-Type": "application/json"
        },
        body: JSON.stringify({
          name: this.state.fullName,
          username: this.state.username,
          email: this.state.email,
          password: this.state.password
        })
      })
        .then(response => response.json())
        .then(json => {
          this.setState({
            email_exists: json.email_exists,
            username_exists: json.username_exists,
            success: json.success
          });
        });
    }
  };

  handleLogin = event => {
    this.setState({ displayLogin: true });
  };

  render() {
    const alertMessage = (
      <div className="alert alert-danger alert-dismissible">
        <button type="button" className="close" data-dismiss="alert">
          &times;
        </button>
        <strong>Invalid Credentails!</strong> Please try again.
      </div>
    );

    const emailAlert = (
      <div className="alert alert-danger alert-dismissible">
        <button type="button" className="close" data-dismiss="alert">
          &times;
        </button>
        <strong>Invalid Email!</strong> email already exists.
      </div>
    );

    const usernameAlert = (
      <div className="alert alert-danger alert-dismissible">
        <button type="button" className="close" data-dismiss="alert">
          &times;
        </button>
        <strong>Invalid Username!</strong> Username already exists.
      </div>
    );

    const passwordAlert = (
      <div className="alert alert-danger alert-dismissible">
        <button type="button" className="close" data-dismiss="alert">
          &times;
        </button>
        <strong>Password</strong> did not match.
      </div>
    );

    const output = this.state.success ? (
      <Login />
    ) : this.state.displayLogin ? (
      <Login />
    ) : (
      <div className="jumbotron jumbotron-fluid">
        <div className="container">
          <h1>Register </h1>
          <form onSubmit={this.handleSubmit}>
            {this.state.error ? alertMessage : null}
            {this.state.username_exists ? usernameAlert : null}
            {this.state.email_exists ? emailAlert : null}
            {this.state.passwordError ? passwordAlert : null}
            <div className="form-group">
              <label>Name:</label>
              <input
                className="form-control"
                name="fullName"
                placeholder="Enter your name(at least 3 characters)"
                value={this.state.fullName}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Username:</label>
              <input
                className="form-control"
                name="username"
                placeholder="Enter your username(at least 5 characters)"
                value={this.state.username}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                className="form-control"
                name="email"
                placeholder="Enter your email"
                value={this.state.email}
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
                placeholder="Enter your password(atleast 6 characters)"
                value={this.state.password}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password:</label>
              <input
                className="form-control"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={this.state.ConfirmPassword}
                onChange={this.handleChange}
                required
              />
            </div>

            <button className="btn btn-primary" type="submit">
              Register
            </button>
            <button
              className="btn btn-link"
              type="button"
              onClick={this.handleLogin}
            >
              Already a member? Login
            </button>
          </form>
        </div>
      </div>
    );
    return <div>{output}</div>;
  }
}

export default Register;
