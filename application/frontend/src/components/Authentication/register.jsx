import React, { Component } from 'react';
class Register extends Component {
    state = {
       fullName : "",
       username : "",
       email : "",
       password : "",
       confirmPassword : ""
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
      fetch("http://localhost:5000/auth/register",
        {
          method : "POST",
          headers : {
            'content-Type' : 'application/json'
          },
          body : JSON.stringify({
            name : this.state.fullName,
            username : this.state.username,
            email : this.state.email,
            password : this.state.password
          })
        }
      ).then(response => response.json())
      .then(json => console.log(json));
    };


    render() {
        return (
          <div className ="jumbotron jumbotron-fluid">
            <div className = "container">
              <div className="alert alert-success alert-dismissible">
                <button type="button" className="close" data-dismiss="alert">&times;</button>
                <strong>Success!</strong> Indicates a successful or positive action.
              </div>
              <form onSubmit = {this.handleSubmit}>

                <div className = "form-group">
                  <label>Name:</label>
                  <input
                    className = "form-control"
                    name = "fullName"
                    placeholder = "Enter your name"
                    value = {this.state.fullName}
                    onChange = {this.handleChange}
                  />
                </div>

                <div className = "form-group">
                  <label>Username:</label>
                  <input
                    className = "form-control"
                    name = "username"
                    placeholder = "Enter your username"
                    value = {this.state.username}
                    onChange = {this.handleChange}
                  />
                </div>

                <div className = "form-group">
                  <label>Email:</label>
                  <input
                    className = "form-control"
                    name = "email"
                    placeholder = "Enter your email"
                    value = {this.state.email}
                    onChange = {this.handleChange}
                  />
                </div>

                <div className = "form-group">
                  <label>Password:</label>
                  <input
                    className = "form-control"
                    name = "password"
                    type="password"
                    placeholder="Enter your password"
                    value = {this.state.password}
                    onChange={this.handleChange}
                  />
                </div>

                <div className = "form-group">
                  <label>Confirm Password:</label>
                  <input
                    className = "form-control"
                    name = "confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value = {this.state.confirmPassword}
                    onChange={this.handleChange}
                  />
                </div>

                  <button className = "btn btn-primary" type="submit">Register</button>

              </form>
            </div>
          </div>
        );
    }
}

export default Register;
