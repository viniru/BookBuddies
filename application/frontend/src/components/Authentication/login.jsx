import React, { Component } from 'react';
import Register from './register.jsx';
import Navbar from '../HomePage/navbar.jsx';

class Login extends Component {
    state = {
        username : "",
        password : "",
        success: false,
        displayRegister : false,
        u_id : null
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


    closeAlert = event => {
      this.setState(
        {
          [event.target.name] : false
        }
      );
    }


    render() {

      const loggedInAlert = <div className="alert alert-success alert-dismissible">
                              <button type="button" className="close" name="signedIn" onClick={this.closeAlert}>&times;</button>
                              <strong>Success!</strong> You are now logged in.
                            </div>;

      const usernameAlert = <div className="alert alert-danger alert-dismissible">
                              <button type="button" className="close" name="usernameError" onClick={this.closeAlert}>&times;</button>
                              <strong>Invalid Username!</strong> user not found.
                            </div>;

      const passwordAlert = <div className="alert alert-danger alert-dismissible">
                              <button type="button" className="close" name="passwordError" onClick={this.closeAlert}>&times;</button>
                              <strong>Wrong password!</strong> Please try again.
                            </div>;

      const loginForm = <div className="jumbotron jumbotron-fluid offset-mt-5">

                          <div className="container">
                          <h1>Login</h1>
                          <form onSubmit = {this.handleSubmit}>
                            {this.props.signedIn ? loggedInAlert : null}
                            {this.state.usernameError ? usernameAlert : null}
                            {this.state.passwordError ? passwordAlert : null}
                            <div className = "form-group">
                              <label>Username:</label>
                              <input
                                name = "username"
                                className="form-control"
                                placeholder = "Enter your username"
                                value = {this.state.username}
                                onChange = {this.handleChange}
                                required
                              />
                            </div>

                            <div className = "form-group">
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

                              <button className="btn btn-primary" type="submit">Login</button>
                              <button className="btn btn-link" type = "button" onClick={this.handleSignUp}>Not a member? Sign Up</button>

                          </form>
                          </div>
                        </div>;

      const output = this.state.success ?
                      <Navbar u_id={this.state.u_id} loggedIn={true}/> :
                      this.state.displayRegister ?
                      <Register /> :
                      <div> {loginForm} </div>

      return (
        <div>
          {output}
        </div>
      );
  }
}

export default Login;
