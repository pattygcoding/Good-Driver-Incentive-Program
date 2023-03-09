import React, {Component} from 'react';
import './ResetPass.css';
import { Navigate } from 'react-router-dom';



class ResetPass extends Component{

  state = {
    email: '',
    code: '',
    newPass: '',
    newPassConf: '',
    redirect: false,
    msg: "",
    passMsg: ""
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



  submit = (event) => {
    event.preventDefault(); //prevent's browser from reloading
    console.log("Submitting to server");
    //stored data
    var payload = {
      email: this.state.email
    };

    //sending data to node server
    fetch('/resetemail-attempt', {
      method: 'POST', //post request
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload) //put into json form
    })
    .then(response => {
      if( response.status === 200 ) {
        response.json().then( data => {
          if( data.success ) {
            document.getElementById('login_displaybox').style.color = "black";
            this.setState({msg: "Email has been sent with reset instructions"});
            //this.setState({redirect: true});

          }
          else {
            //display fail message
            console.log("Email not found.")
            this.setState({msg: "Email not found."})
          }
        })
      }
    })
    .catch((error) => {
      console.error('Error', error);
    });

  };


  submitPass = (event) => {
    event.preventDefault(); //prevent's browser from reloading
    console.log("Submitting to server");
    //stored data
    var payload = {
      code: this.state.code,
      newPass: this.state.newPass,
      newPassConf: this.state.newPassConf
    };

    //sending data to node server
    fetch('/resetpass-attempt', {
      method: 'POST', //post request
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload) //put into json form
    })
    .then(response => {
      if( response.status === 200 ) {
        response.json().then( data => {
          if( data.success ) {
            document.getElementById('login_displaybox').style.color = "black";
            this.setState({passMsg: data.msg});
            this.setState({redirect: true});

          }
          else {
            //display fail message
            console.log("Code does not match.")
            this.setState({passMsg: "Code does not match or is expired."})
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
      <body>
        <div className='ResetPassPage'>
        <header className='Login-Header'>
              <img src="teamLogo.png" alt="The Mad Lads Team Logo" width="250" height="100"></img>
        </header>
        <div className='Signin-Box'>
        <form onSubmit={this.submit}>
          <h2><br/>Input Email</h2>
          <p className='login_displaybox' id='login_displaybox' >{this.state.msg}</p>
          <p>
            Email
          </p>
          <input 
            type="email" 
            id="email" 
            name="email" 
            placeholder='email' 
            size="55"
            value={this.state.email}
            onChange={this.handleChange}
          />
        
          <button type="submit" class='LoginButton'>Send Reset Email</button>
        </form>
        </div>

        <div className='Signin-Box'>
        <form onSubmit={this.submitPass}>
          <h2><br/>Input Code</h2>
          <p>
            Code
          </p>
          <input 
            type="text" 
            id="code" 
            name="code" 
            placeholder='code' 
            size="55"
            value={this.state.code}
            onChange={this.handleChange}
          />
          <p>New Password</p>
          <input 
            type="password" 
            id="newPass" 
            name="newPass" 
            placeholder='password' 
            size="55"
            value={this.state.newPass}
            onChange={this.handleChange}
            onInput={this.checkComplexity}
          />
          <p className='login_displaybox' id='login_displaybox' >{this.state.passMsg}</p>

          <p>Confirm Password</p>
          <input 
            type="password" 
            id="newPassConf" 
            name="newPassConf" 
            placeholder='confirm password' 
            size="55"
            value={this.state.newPassConf}
            onChange={this.handleChange}
          />  
        
          <button type="submit" className='LoginButton' id='btn' disabled>Reset Password</button>
          { this.state.redirect ? (<Navigate to="/login"/>) : null }

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

export default ResetPass;