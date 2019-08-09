import React, { Component } from 'react';
import Home from '../HomePage/Home.jsx';
import Register from './register.jsx';

class Login extends Component {
    state = {
        username : "",
        password : "",
        success: false,
        displayRegister : false
    };


    handleChange = event  => {
      this.setState(
        {
          [event.target.name] : event.target.value
        }
      );
    };


    handleSubmit = event => {
      event.preventDefault();
      let response = {};
      fetch('http://localhost:5000/auth/login',
        {
          method : "post",
          mode : 'cors',
          body : JSON.stringify({
            username : this.state.username,
            password : this.state.password
          }),
          headers : {
            'content-Type' : 'application/json'
          }
        }
     ).then(response => response.json())
     .then(json => {console.log(json); this.setState({success : json.password_matched && json.username_exists}); console.log(this.state);});

    };


    handleSignUp = event => {
      console.log('iam here');
      this.setState({displayRegister : true});
      console.log(this.state);
    }


    render() {
      const output = this.state.success ?
        <Home /> :
        this.state.displayRegister ?
        <Register />
        :
        <div className="jumbotron jumbotron-fluid">
          <div className="container">
          <h1>Login</h1>
          <form onSubmit = {this.handleSubmit}>
            <div className = "form-group">
              <label>Username:</label>
              <input
                name = "username"
                className="form-control"
                placeholder = "Enter your username"
                value = {this.state.username}
                onChange = {this.handleChange}
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
              />
            </div>

              <button className="btn btn-primary" type="submit">Login</button>
              <button className="btn btn-link" type = "button" onClick={this.handleSignUp}>Not a member? Sign Up</button>

          </form>
          </div>
        </div>;


      return (
        <div>
          {output}
        </div>
      );

    }
}


export default Login;
