import React, { Component } from 'react';
class Login extends Component {

    state = {
        username : "",
        password : "",
        usernameError : "haha",
        passworError : ""
    };

    // validate = () => {
    //   let usernameError = "";
    //   let passwordError = "";
    //
    //   if(!this.state.password.includes('@')) {
    //     passwordError = "password invalid";
    //     this.setState({passwordError : "Wrong password" });
    //   }
    //   if(!(this.state.username.length > 6) ) {
    //     usernameError = "invalid username";
    //     this.setState({usernameError : "invalid username"})
    //   }
    //   if(usernameError || passwordError) {
    //     return false;
    //   }
    //
    //   return true;
    // }

    handleChange = event  => {
      this.setState(
        {
          [event.target.name] : event.target.value
        }
      );
    };

    handleSubmit = event => {
      event.preventDefault();
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
     .then(json => console.log(json));
    };

    render() {
        return (
          <div className="jumbotron">
            <div className = "container">
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
                    className = "form-control"
                    name = "password"
                    type="password"
                    placeholder="Enter your password"
                    value = {this.state.password}
                    onChange={this.handleChange}
                  />
                </div>

                  <button className="btn btn-primary" type="submit">Login</button>

              </form>
            </div>
          </div>
        );
    }
}

export default Login;
