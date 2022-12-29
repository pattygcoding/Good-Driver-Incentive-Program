import React, {Component} from 'react';
import './AdminUpdateOrg.css'

class AdminUpdateOrg extends Component{
  state = {
    loading: true,
    isLoggedIn: false,
    name: '',
    street: '',
    city: '',
    state: '',
    zip: 0,
    ppd: 0
  }
  
  componentDidMount() {
    this.getInfo()
    this.getUserType()
  }

  getInfo = () => {
    fetch('/getSponsorOrganization?' + new URLSearchParams({
      sponsorID: this.props.org,
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

  submit = (event) => {
    event.preventDefault();
    var payload = {
      sponsorID: this.props.org,
      name: this.state.name,
      street: this.state.street,
      city: this.state.city,
      state: this.state.state,
      zip: this.state.zip,
      ppd: this.state.ppd
    };
    fetch('/update-sponsororg', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if( response.status === 200 ) {
        this.props.exitUpdateOrg()
      }
    })
    .catch((error) => {
      console.error('Error', error);
    });
  }

  render() {
    return (
            <div className='UpdateOrg-Body'>
            <form id='info-form' onSubmit={this.submit}>
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
    );
  }
}

export default AdminUpdateOrg;
