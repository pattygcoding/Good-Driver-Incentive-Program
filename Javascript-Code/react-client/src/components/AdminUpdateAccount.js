import React, {Component} from 'react';
// import { useParams } from 'react-router-dom';

import './AdminUpdateAccount.css'

class AdminUpdateAccount extends Component{
    state = {
      loading: true,
      isLoggedIn: false,
      lname: '',
      fname: '',
      username: '',
      email: '',
      phone: '',
      newPass: ''
    }
    
    componentDidMount() {
        // const { uid } = props.match.params.uid;
        // console.log(uid)
        this.isLoggedIn();
    }
  
    getInfo = () => {
      fetch('/get-acc-info?' + new URLSearchParams({
        uID: this.props.uID,
      }))
      .then(response => response.json())
      .then(response => {
        console.log(response)
        this.setState({
          lname: response.user.lname,
          fname: response.user.fname,
          username: response.user.username,
          email: response.user.email,
          phone: response.user.phone
        })
      })
      .catch(err => console.error(err))
    }
  
    isLoggedIn = () => {
      fetch('/isLoggedIn')
      .then(response => response.json())
      .then(response => {
        this.setState({loading: false, isLoggedIn: response.is_loggedin})
        if(response.is_loggedin){
          this.getInfo()
        }
      })
      .catch(err => console.error(err))
    }
  
    handleChange = (event) => {
      const target = event.target;
      const name = target.name
      const value = target.value
      
      this.setState({
        [name]: value
      });
    };
  
    submit = (event) => {
      event.preventDefault();
      var payload = {
        uID: `${this.props.uID}`,
        lname: this.state.lname,
        fname: this.state.fname,
        username: this.state.username,
        email: this.state.email,
        phone: this.state.phone,
        newPass: this.state.newPass
      };
      fetch('/update-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(response => {
        if( response.status === 200 ) {
            this.props.exitUpdateInfo()
        }
      })
      .catch((error) => {
        console.error('Error', error);
      });
    }
  
    render() {
        return (
              <div className='UpdateAcc-Body'>
                <h1 className='UpdateAcc-heading'>View/Update Account</h1>
                <form id='info-form' onSubmit={this.submit}>
                <label className='inputs' htmlFor='fname'><br/>Update First Name<br/></label>
                  <input required type='text' id='fname' name='fname'  size='45' value={this.state.fname} onChange={this.handleChange}></input>
                <label className='inputs' htmlFor='lname'><br/>Update Last Name<br/></label>
                  <input required type='text' id='lname' name='lname'size='45' value={this.state.lname} onChange={this.handleChange}></input>
                {/* <label className='inputs' for='userBirthday'><br/>Update Birthday<br/></label>
                  <input type='date' id='userBirthday' name='userBirthday'></input> */}
                <label className='inputs' htmlFor='username'><br/>Update Username<br/></label>
                  <input required type='text' id='username' name='username' size='45' value={this.state.username} onChange={this.handleChange}></input>  
                <label className='inputs' htmlFor='email'><br/>Update Email<br/></label>
                    <input required type='email' id='email' name='email' size='45' value={this.state.email} onChange={this.handleChange}></input>
                <label className='inputs' htmlFor='newPass'><br/>Update Password<br/></label>
                    <input type='password' id='newPass' name='newPass' placeholder='new password' size='45' value={this.state.newPass} onChange={this.handleChange}></input> 
                <label className='inputs' htmlFor='phone'><br/>Update Phone Number<br/></label>
                  <input required type='tel' id='phone' name='phone' maxLength={10} minLength={10} size='45' value={this.state.phone} onChange={this.handleChange}></input>
                
                <label className='inputs' htmlFor='userProfilePicture'><br/>Update Profile Picture<br/></label>
                  <input type="file" id='userProfilePicture' name='userProfilePicture' accept="image/*"></input> 
                <button type="submit" className='saveChanges'>Save Changes</button>
                </form>
              </div> 
        );
    }
  }

export default AdminUpdateAccount
