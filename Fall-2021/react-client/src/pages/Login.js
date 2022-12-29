import React, {Component} from 'react';
import './Login.css';
import { Navigate } from 'react-router-dom';

class Login extends Component{

  //state used to store username & password from inputs
  state = {
    username: '',
    password: '',
    redirect: false,
    userType: -1,
    msg: ""
  };

  /* USER TYPES: (may be wise to change these to strings in the future)
      0: DRIVER
      1: SPONSOR
      2: ADMIN
  */

  //handleChange takes the value from input boxes & updates the state
  //param: event --> access to element calling fxn
  handleChange = (event) => {
    const target = event.target;
    const name = target.name
    const value = target.value
    
    this.setState({
      [name]: value
    });

  };

  submit = (event) => {
    event.preventDefault(); //prevent's browser from reloading
    console.log("Submitting to server");
    //stored data
    var payload = {
      username: this.state.username,
      password: this.state.password
    };

    //sending data to node server
    fetch('/login-attempt', {
      method: 'POST', //post request
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload) //put into json form
    })
    .then(response => {
      if( response.status === 200 ) {
        //this.setState({redirect: true});
        response.json().then( data => {
          if( data.success ) {
            document.getElementById('login_displaybox').style.color = "black";
            this.setState({userType: data.userType});
            this.setState({msg: "Logging in..."});
            this.setState({redirect: true});

          }
          else {
            //display fail message
            console.log("Username & Password do not match.")
            this.setState({msg: data.msg})
          }
        })
      }
    })
    .catch((error) => {
      console.error('Error', error);
    });

  };

  render() {

    return (
      <div className='LoginPage'>
        <header className='Login-Header'>
          <img src="teamLogo.png" alt="The Mad Lads Team Logo" width="250" height="100"></img>
        </header>
        <div className='Signin-Box'>
        <form onSubmit={this.submit}>
          <h2><br/>Sign-In</h2>
          <p className='login_displaybox' id='login_displaybox' >{this.state.msg}</p>
          <p>
            <span className='Seperate-SI-UN'></span>
            Username
          </p>
          <input 
            type="text" 
            id="username" 
            name="username" 
            placeholder='username' 
            size="55"
            value={this.state.username}
            onChange={this.handleChange}
          />

          <p>Password</p>
          <input 
            type="password" 
            id="password" 
            name="password" 
            placeholder='password' 
            size="55"
            value={this.state.password}
            onChange={this.handleChange}
          />
        
          <p className='Reset-UN-PASS'>Having trouble signing in?</p>
          <button type="submit" className='LoginButton'>Log-in</button>
          { this.state.redirect && (this.state.userType === 0) ? (<Navigate to="/driverhome"/>) : null }
          { this.state.redirect && (this.state.userType === 1) ? (<Navigate to="/sponsorhome"/>) : null }
          { this.state.redirect && (this.state.userType === 2) ? (<Navigate to="/adminhome"/>) : null }
        </form>
          <a className='Reset-UN-PASS' href='ResetPass'>Click here to reset your Password</a>
          <a className='Reset-UN-PASS' href='Signup'><br/><br/>Click here to make a new account</a> 
        </div>
      </div>      
    );
  }

}

export default Login;
