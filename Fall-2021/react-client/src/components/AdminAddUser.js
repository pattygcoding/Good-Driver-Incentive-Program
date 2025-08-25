import React, {Component} from 'react';
import './AdminAddUser.css'

class AdminAddUser extends Component{
    state = {
      loading: true,
      isLoggedIn: false,
      lname: '',
      fname: '',
      username: '',
      email: '',
      phone: '',
      allOrgs: [],
      org: null
    }
    
    componentDidMount() {
        // const { uid } = props.match.params.uid;
        // console.log(uid)
        this.isLoggedIn();
    }
  
    isLoggedIn = () => {
      fetch('/isLoggedIn')
      .then(response => response.json())
      .then(response => {
        this.setState({loading: false, isLoggedIn: response.is_loggedin})
        if(response.is_loggedin){
            this.getAllOrgs()
        }
      })
      .catch(err => console.error(err))
    }
  
    getAllOrgs = () => {
        fetch('/getAllOrganizations?' + new URLSearchParams({
          uID: this.props.uID,
        }))
        .then(response => response.json())
        .then(response => {
          console.log(response.orgs)
          this.setState({
            allOrgs: response.orgs
          })
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
        userType: this.props.userType,
        lastname: this.state.lname,
        firstname: this.state.fname,
        username: this.state.username,
        email: this.state.email,
        phone: this.state.phone,
        org: this.props.org ? this.props.org : this.state.org
      };
      fetch('/add-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(response => {
        if( response.status === 200 ) {
            this.props.exitAddUser()
        }
      })
      .catch((error) => {
        console.error('Error', error);
      });
    }
  
    render() {
        return (
              <div className='AddUser-Body'>
                <h1 className='AddUser-heading'>Add New User</h1>
                <form className='AddUser-FormContent' id='info-form' onSubmit={this.submit}>
                    <label className='AddUser-inputs' htmlFor='fname'><br/>First Name<br/></label>
                    <input required type='text' id='fname' name='fname'  size='45' value={this.state.fname} onChange={this.handleChange}></input>
                    <label className='AddUser-inputs' htmlFor='lname'><br/>Last Name<br/></label>
                    <input required type='text' id='lname' name='lname'size='45' value={this.state.lname} onChange={this.handleChange}></input>
                    <label className='AddUser-inputs' htmlFor='username'><br/>Username<br/></label>
                    <input required type='text' id='username' name='username' size='45' value={this.state.username} onChange={this.handleChange}></input>  
                    <label className='AddUser-inputs' htmlFor='email'><br/>Email<br/></label>
                        <input required type='email' id='email' name='email' size='45' value={this.state.email} onChange={this.handleChange}></input>
                    <label className='AddUser-inputs' htmlFor='phone'><br/>Phone Number<br/></label>
                    <input required type='tel' id='phone' name='phone' maxLength={10} minLength={10} size='45' value={this.state.phone} onChange={this.handleChange}></input>
                    {(this.props.userType === 1 && !this.props.isSponsor) && <label className='AddUser-inputs' htmlFor='orgs-list'><br/>Organization<br/></label>}
                    {(this.props.userType === 1 && !this.props.isSponsor) && <select id="orgs-list" value={this.state.org === "" ? null : this.state.org} onChange={e => this.setState({org: e.target.value})} required>
                        <option disabled selected value=""> -- select an organization -- </option>
                        {this.state.allOrgs.map((o,i) =>
                         <option value={o.sponsorID} key={i}>{o.orgName}</option>
                        )}
                    </select>}
                    <button className='AddUser-Exit' type="submit">Add User</button>
                </form>
                <button className='AddUser-Exit' onClick={this.props.exitAddUser}>Exit</button>
              </div> 
        );
    }
  }

export default AdminAddUser
