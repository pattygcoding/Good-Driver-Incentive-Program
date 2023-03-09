import React, {Component} from 'react';
import Layout from '../components/Layout';
import './UpdateAccount.css'

class UpdateAccount extends Component{
  state = {
    loading: true,
    isLoggedIn: false,
    name: '',
    street: '',
    city: '',
    state: '',
    zip: 0,
    ppd: 0,
    code: -1
  }
  
  componentDidMount() {
    this.isSponsor();
  }

  getInfo = () => {
    fetch('/getOrganizations?' + new URLSearchParams({
      uID: '-1',
    }))
    .then(response => response.json())
    .then(response => {
      console.log(response)
      this.setState({
        name: response.orgs[0].orgName,
        street: response.orgs[0].street,
        city: response.orgs[0].city,
        state: response.orgs[0].state,
        zip: response.orgs[0].zip,
        ppd: response.orgs[0].pointsPerDollar
      })
      document.getElementById("code").innerHTML = response.orgs[0].code;

    })
    .catch(err => console.error(err))
  }

  isSponsor = () => {
    fetch('/isSponsor')
    .then(response => response.json())
    .then(response => {
      this.setState({loading: false, isLoggedIn: response.is_sponsor})
      if(response.is_sponsor){
        this.getInfo()
        this.getUserType()
      }
    })
    .catch(err => console.error(err))
  }

  getUserType = () => {
    fetch('/currentUserType')
    .then(response => response.json())
    .then(response => {
      this.setState({userType: response.userType})
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
      }else{
        this.setState({passMsg: "Password must be 8-20 characters long and contain a lowercase letter, a capital letter, a number, and a special character."})
        document.getElementById("btn").disabled = true;
      }
    }
  }

  submit = (event) => {
    event.preventDefault();
    var payload = {
      uID: '-1',
      name: this.state.name,
      street: this.state.street,
      city: this.state.city,
      state: this.state.state,
      zip: this.state.zip,
      ppd: this.state.ppd
    };
    fetch('/update-org', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if( response.status === 200 ) {
      }
    })
    .catch((error) => {
      console.error('Error', error);
    });
  }

  render() {
    if (this.state.isLoggedIn){
      return (
          <Layout userType={this.state.userType}>
            <div className='UpdateAccount-Page'>
            <div className='UpdateAccount-Body'>
            <form id='info-form' onSubmit={this.submit}>
            <h4>Account Code: <span id="code"></span></h4>
              <label className='inputs' htmlFor='name'><br/>Update Organization Name<br/></label>
                <input required type='text' id='name' name='name'  size='45' value={this.state.name} onChange={this.handleChange}></input>
              <label className='inputs' htmlFor='street'><br/>Update Street Address<br/></label>
                <input required type='text' id='street' name='street' size='45' value={this.state.street} onChange={this.handleChange}></input>  
              <label className='inputs' htmlFor='city'><br/>Update City<br/></label>
                  <input required type='text' id='city' name='city' size='45' value={this.state.city} onChange={this.handleChange}></input>
              <label className='inputs' htmlFor='state'><br/>Update State<br/></label>
                <input required type='text' id='state' name='state' size='45' value={this.state.state} onChange={this.handleChange}></input>
              <label className='inputs' htmlFor='zip'><br/>Update Zip<br/></label>
                <input required type='text' id='zip' name='zip' size='45' value={this.state.zip} onChange={this.handleChange}></input>
              <label className='inputs' htmlFor='ppd'><br/>Update Points Per Dollar<br/></label>
                <input required type='number' id='ppd' name='ppd' min={0} size='45' value={this.state.ppd} onChange={this.handleChange}></input>
              
              <label className='inputs' htmlFor='userProfilePicture'><br/>Update Organization Picture<br/></label>
                <input type="file" id='userProfilePicture' name='userProfilePicture' accept="image/*"></input> 
              <button type="submit" className='saveChanges' id='btn'>Save Changes</button>
              </form>
            </div>
            </div>
          </Layout>
      );
    }else{
      return (
        <h1>{this.state.loading ? "" : "401: Unauthorized"}</h1>
      );
    }
  }
}

export default UpdateAccount;
