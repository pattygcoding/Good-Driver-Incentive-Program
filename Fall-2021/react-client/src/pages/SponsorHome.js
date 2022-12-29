import React, {Component} from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import AdminUpdateAccount from '../components/AdminUpdateAccount';
import AdminAddUser from '../components/AdminAddUser';
import './SponsorHome.css'
import SponsorApplications from '../components/SponsorApplications';
import DriverView from '../components/DriverView';

class SponsorHome extends Component{
  state = {
    loading: true,
    isSponsor: false,
    drivers: [],
    sponsors: [],
    updating: -1,
    userType: 0,
    org: [],
    viewApps: false,
    isSponsorView: false,
    adminView: false,
    driverView: false
  }
  
  componentDidMount() {
    this.isSponsor();
  }

  getDrivers = () => {
    fetch('/getSponsorDrivers')
    .then(response => response.json())
    .then(response => this.setState({drivers: response.drivers}))
    .catch(err => console.error(err))
  }

  getSponsors = () => {
    fetch('/getOrganizations?' + new URLSearchParams({
      uID: '-1',
    }))
    .then(response => response.json())
    .then(response => {
      this.setState({
        org: response.orgs[0].sponsorID
      })
      fetch('/getOrgSponsors?' + new URLSearchParams({
        org: response.orgs[0].sponsorID,
      }))
      .then(response => response.json())
      .then(response => {
        this.setState({
          sponsors: response.sponsors
        })
      })
      .catch(err => console.error(err))
    })
    .catch(err => console.error(err))
  }

  getIsSponsorView = () => {
    fetch('/issponsorview')
    .then(response => response.json())
    .then(response => {
      this.setState({
        isSponsorView: response.is_sponsorview
      })
    })
    .catch(err => console.error(err))
  }

  isSponsor = () => {
    fetch('/isSponsor')
    .then(response => response.json())
    .then(response => {
      this.setState({loading: false, isSponsor: response.is_sponsor});
      if(response.is_sponsor){
        this.getDrivers();
        this.getSponsors();
        this.getIsSponsorView();
      }
    })
    .catch(err => console.error(err))
  }

  updateAccount = (user) => {
    this.setState({
      updating: user.uID
    })
  }

  removeDriver = (user) => {
    var payload = {
      uID: user.uID,
      sponsorID: this.state.org,
    };
    fetch('/removeOrgRelation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if( response.status === 200 ) {
        this.getDrivers()
      }
    })
    .catch((error) => {
      console.error('Error', error);
    });
  }

  exitUpdateInfo = () => {
    this.setState({
      updating: -1
    })
    this.getDrivers()
    this.getSponsors();
  }

  exitAddUser = () => {
    this.setState({
      adding: false
    })
    this.getDrivers()
    this.getSponsors();
  }

  exitApplications = () => {
    this.setState({
      viewApps: false
    })
    this.getDrivers()
    this.getSponsors();
  }

  exitDriverView = () => {
    this.setState({driverView: false})
  }

  adminView = () => {
    fetch('/leavesponsorview')
    .catch(err => console.error(err))
    .then(response => {
      if( response.status === 200 ) {
          this.setState({adminView: true})
      }
    })
  }

  render() {
    if (this.state.isSponsor){
      const users = this.state.userType === 1 ? this.state.sponsors : this.state.drivers
      return (
        <Layout userType={1} isUser={this.isSponsor}>
          {/* <div className='SponsorHomePage'> */}
            {/* <body> */}
              
              {/* <select className='SortByDrop' id='SortByDrop'>
                <option disabled selected hidden>Sort By</option>
                <option>All Time</option>
                <option>Last 24 Hours</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select> */}
              <div className='AdminHome-Top'>
                {this.state.isSponsorView && <div style={{visibility: 'hidden'}}>
                  <button className='AdminHome-Button' onClick={() => this.setState({driverView: true})}>Driver View</button>
                </div>}
                {!this.state.isSponsorView && <div>
                  <button className='AdminHome-Button' onClick={() => this.setState({driverView: true})}>Driver View</button>
                </div>}
                <div className='userbuttons'>
                {this.state.isSponsorView && <button className='AdminHome-Button' onClick={() => this.adminView()}>Back to Admin View</button>}
                {this.state.adminView && <Navigate to="/adminhome"/>}
                  <p>View Users:</p>

                  <div>
                    <input type="radio" id="drivers" name="usertype" value="drivers" checked={this.state.userType===0} onChange={() => this.setState({userType: 0})}/>
                    <label htmlFor="drivers">Drivers</label>
                    <input type="radio" id="sponsors" name="usertype" value="sponsors" checked={this.state.userType===1} onChange={() => this.setState({userType: 1})}/>
                    <label htmlFor="sponsors">Sponsors</label>
                  </div>
                </div>
                <div className='Hidden-Buttons'>
                  <button className='AdminHome-Button'>Driver View</button>
                </div>
              </div>
              <div className='Sponsor-show-users'>
              {this.state.userType === 0 && <button onClick={() => this.setState({viewApps: true})}>View Applications</button>}
              {this.state.userType === 1 && <button onClick={() => this.setState({adding: true})}>Add New Sponsor</button>}
                {users.map((user, i) => {return(
                  <div className='Sponsor-individual-user' key={i}>
                      <img className='profile-pic' src='DefaultProfPic.png' alt='Default Profile Picure'/>
                      <p className='user-info'>{user.fname} {user.lname}</p>
                      <p className='user-info'>{user.status ? 'Active' : 'Suspended'}</p>
                      <button  className='user-info' onClick={() => this.updateAccount(user)}>Update Account</button>
                      {this.state.userType === 0 && <button  className='user-info' onClick={() => this.removeDriver(user)}>Remove Driver</button>}
                  </div>
                )})}
            </div>
            
            {this.state.updating !== -1 && <AdminUpdateAccount uID={this.state.updating} exitUpdateInfo={this.exitUpdateInfo} />}
            {this.state.adding && <AdminAddUser isSponsor={true} userType={this.state.userType} exitAddUser={this.exitAddUser} org={this.state.org}/>}
            {this.state.viewApps && <SponsorApplications org={this.state.org} exitApplications={this.exitApplications}></SponsorApplications>}
            {this.state.driverView && <DriverView userType={1} exitDriverView={this.exitDriverView}/>}
        </Layout>
      );
    }else{
      return (
        <h1>{this.state.loading ? "" : "401: Unauthorized"}</h1>
      );
    }
  }
}

export default SponsorHome;
