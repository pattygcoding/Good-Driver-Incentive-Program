import React, {Component} from 'react';
import './Signup.css';
import { Navigate } from 'react-router-dom';

class Signup extends Component{

  //state used to store username & password from inputs
  state = {
    username: '',
    password: '',
    confirmpassword: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    msg: '',
    passMsg: '',
    code: '',
    userType: ''
  };

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

  checkComplexity = (event) => {
    const target = event.target;
    const value = target.value;
    let strongPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,20}))');
    if(strongPassword.test(value)){
      this.setState({passMsg: ""})
      document.getElementById("btn").disabled = false;
    }else{
      if(value === ''){
        this.setState({passMsg: ""})
        document.getElementById("btn").disabled = true;
      }else{
        this.setState({passMsg: "Password must be 8-20 characters long and contain a lowercase letter, a capital letter, a number, and a special character."})
        document.getElementById("btn").disabled = true;
      }
    }
  }



    //issue with preventDefault
  //issue with not connecting to the server & json errors
  //maybe try axion? maybe start from the beginning?
  //learn more about fetch first.
  submit = (event) => {
    event.preventDefault(); //prevent's browser from reloading
    //TODO: check to see if password meets requirements
    console.log("Submitting to server");
    //stored data
    var payload = {
      username: this.state.username,
      password: this.state.password,
      confirmpassword: this.state.confirmpassword,
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      email: this.state.email,
      phone: this.state.phone,
      code: this.state.code
    };

    //sending data to node server
    console.log("sending payload of :");
    console.log(payload)
    console.log("end of payload");
    fetch('/signup-attempt', {
      method: 'POST', //post request
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload) //put into json form
    })
    .then ( response => {
      if( response.status === 200 ) {
        response.json().then( data => {
          document.getElementById('login_displaybox').style.color = "red";
          this.setState({msg: data.msg})
          if( data.success ) {
            this.setState({redirect: true});
            this.setState({userType: data.uType});
          }
        })
      }  
    })
    .catch((error) => {
      console.error('Error :(', error);
    });

  };


  render() {

    console.log(this.state);

    return (

      <body>
      <div className='SignupPage'>
        <header className='Signup-Header'>
          <img src="teamLogo.png" alt="The Mad Lads Team Logo" width="250" height="100"></img>
        </header>
        <div className='Signup-Box'>
        <form onSubmit={this.submit}>
          <h2><br/>Sign-Up</h2>
          <p className='login_displaybox' id='login_displaybox' >{this.state.msg}</p>
          <p>
            <span class='Seperate-SI-UN'></span>
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

          <p>First Name</p>
          <input 
            type="text" 
            id="firstname" 
            name="firstname" 
            placeholder='first name' 
            size="55"
            value={this.state.firstname}
            onChange={this.handleChange}
          />

          <p>Last Name</p>
          <input 
            type="text" 
            id="lastname" 
            name="lastname" 
            placeholder='last name' 
            size="55"
            value={this.state.lastname}
            onChange={this.handleChange}
          />

          <p>Email</p>
          <input 
            type required="email" 
            id="email" 
            name="email" 
            placeholder='email' 
            size="55"
            value={this.state.email}
            onChange={this.handleChange}
          />

          <p>Phone Number</p>
          <input 
            type="tel" 
            id="phone" 
            name="phone" 
            placeholder='phone' 
            size="55"
            value={this.state.phone}
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
            onInput={this.checkComplexity}
          />
          <p className='login_displaybox' id='login_displaybox' >{this.state.passMsg}</p>

          <p>Confirm Password</p>
          <input 
            type="password" 
            id="confirmpassword" 
            name="confirmpassword" 
            placeholder='confirm password' 
            size="55"
            value={this.state.confirmpassword}
            onChange={this.handleChange}
          />  

          <p>For new drivers, use 0000.  To create a new organization, use 1111.  Otherwise, get your account code from your organization.</p>
          <p>Account Code</p>
          <input 
            type="text" 
            id="code" 
            name="code" 
            placeholder='account code' 
            size="55"
            value={this.state.code}
            onChange={this.handleChange}
          /> 
        
          <button type="submit" class='LoginButton' id="btn" disabled>Sign Up</button>
          { this.state.redirect && (this.state.userType === 0) ? (<Navigate to="/driverhome"/>) : null }
          { this.state.redirect && (this.state.userType === 1) ? (<Navigate to="/SponsorHome"/>) : null }
          { this.state.redirect && (this.state.userType === 2) ? (<Navigate to="/AdminHome"/>) : null }
          { this.state.redirect && (this.state.userType === 3) ? (<Navigate to="/NewOrganization"/>) : null }
        </form>

        <p>Already have an account?</p>
        <form action="/login" class="inline">
          <button type="submit" className='LoginButton'>Go To Log-in</button>
        </form>
        </div>



      </div>
      </body>
      
    );
  }

}

export default Signup;
