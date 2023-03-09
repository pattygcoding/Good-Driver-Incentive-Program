import React, {Component} from 'react';
import './NewOrganization.css';
import { Navigate } from 'react-router-dom';


class NewOrganization extends Component{

    state = {
        orgName: '',
        email: '',
        redirect: false,
        street: '',
        city: '',
        state: '',
        zip: '',
        msg: ""
    };

    handleChange = (event) => {
        const target = event.target;
        const name = target.name
        const value = target.value
        
        this.setState({
          [name]: value
        });
    
      };



    //SUBMIT FUNCTION
    submit = (event) => {
      event.preventDefault(); //prevent's browser from reloading
      console.log("Submitting to server");
      //stored data
      var payload = {
        orgName: this.state.orgName,
        email: this.state.email,
        street: this.state.street,
        city: this.state.city,
        state: this.state.state,
        zip: this.state.zip
      };
  
      //sending data to node server
      fetch('/neworganization-attempt', {
        method: 'POST', //post request
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload) //put into json form
      })
      .then(response => {
        if( response.status === 200 ) {
          //this.setState({redirect: true});
          response.json().then( data => {
            if( data.success ) {
              this.setState({msg: data.msg});
              this.setState({redirect: data.redirect});
  
            }
            else {
              //display fail message
              console.log("Organization creation failed.")
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
              <h2><br/>Create New Organization</h2>
              <p>
                <span className='Seperate-SI-UN'></span>
                Organization Name
              </p>
              <input 
                type="text" 
                id="orgName" 
                name="orgName" 
                placeholder='organization name' 
                size="55"
                value={this.state.orgName}
                onChange={this.handleChange}
              />
    
              <p>Organization Email</p>
              <input 
                type required="email" 
                id="email" 
                name="email" 
                placeholder='organization email' 
                size="55"
                value={this.state.email}
                onChange={this.handleChange}
              />

              <p>Mailing Address</p>
              <p>Street</p>
              <input 
                type="text" 
                id="street" 
                name="street" 
                placeholder='street' 
                size="55"
                value={this.state.street}
                onChange={this.handleChange}
              />    

              <p>City</p>
              <input 
                type="text" 
                id="city" 
                name="city" 
                placeholder='city' 
                size="55"
                value={this.state.city}
                onChange={this.handleChange}
              />  
            
              <p>State (Two-letter code)</p>
              <input 
                type="text" 
                id="state" 
                name="state" 
                placeholder='state' 
                size="55"
                maxLength="2"
                value={this.state.state}
                onChange={this.handleChange}
              />  

              <p>Zip</p>
              <input 
                type="text" 
                id="zip" 
                name="zip" 
                placeholder='zip' 
                size="55"
                maxLength="5"
                value={this.state.zip}
                onChange={this.handleChange}
              />  

              <button type="submit" className='LoginButton'>Create Organization</button>
              { this.state.redirect  ? (<Navigate to="/sponsorhome"/>) : null }
            </form>
            </div>
          </div>      
        );
      }
    
}

export default NewOrganization;
