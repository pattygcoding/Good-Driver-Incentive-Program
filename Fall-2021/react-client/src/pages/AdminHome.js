import React, {Component} from 'react';
import AdminUpdateAccount from '../components/AdminUpdateAccount';
import AdminUpdateOrgs from '../components/AdminUpdateOrgs';
import AdminAddUser from '../components/AdminAddUser';
import './AdminHome.css'
import Layout from '../components/Layout';
import AdminUpdateOrg from '../components/AdminUpdateOrg';
import AdminAddOrg from '../components/AdminAddOrg';
import DriverView from '../components/DriverView';
import SponsorView from '../components/SponsorView';
class AdminHome extends Component{
  state = {
    loading: true,
    isAdmin: false,
    drivers: [],
    sponsors: [],
    admin: [],
    orgs: [],
    userType: 0,
    updating: -1,
    updatingOrgs: -1,
    adding: false,
    addingOrg: false,
    updatingOrg: -1,
    driverView: false,
    sponsorView: false,
  }
  
  componentDidMount() {
    this.isAdmin();
  }

  getDrivers = () => {
    fetch('/getAllDrivers')
    .then(response => response.json())
    .then(response => this.setState({drivers: response.drivers}))
    .catch(err => console.error(err))
  }

  getSponsors = () => {
    fetch('/getAllSponsors')
    .then(response => response.json())
    .then(response => this.setState({sponsors: response.sponsors}))
    .catch(err => console.error(err))
  }

  getAdmin = () => {
    fetch('/getAllAdmin')
    .then(response => response.json())
    .then(response => this.setState({admin: response.admin}))
    .catch(err => console.error(err))
  }

  getOrgs = () => {
    fetch('/getAllOrganizations')
    .then(response => response.json())
    .then(response => {
      console.log(response.orgs)
      this.setState({
        orgs: response.orgs
      })
    })
    .catch(err => console.error(err))
  }

  isAdmin = () => {
    fetch('/isAdmin')
    .then(response => response.json())
    .then(response => {
      this.setState({loading: false, isAdmin: response.is_admin})
      if(response.is_admin){
        this.getDrivers()
        this.getSponsors()
        this.getAdmin()
        this.getOrgs()
      }
    })
    .catch(err => console.error(err))
  }

  toggleActive = (user) => {
    var payload = {
      active: !user.status,
      uID: user.uID
    };
    fetch('/toggle-active', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if(response.status === 200){
        this.getDrivers()
        this.getSponsors()
        this.getAdmin()
      }
    })
    .catch(err => console.error(err))
  }

  updateAccount = (user) => {
    this.setState({
      updating: user.uID
    })
  }

  updateOrgs = (user) => {
    this.setState({
      updatingOrgs: user.uID
    })
  }

  exitUpdateInfo = () => {
    this.setState({
      updating: -1
    })
    this.getDrivers()
    this.getSponsors();
    this.getAdmin();
  }

  exitUpdateOrgs = () => {
    this.setState({
      updatingOrgs: -1
    })
  }

  exitAddUser = () => {
    this.setState({
      adding: false
    })
    this.getDrivers()
    this.getSponsors();
    this.getAdmin();
  }

  updateOrg = (org) => {
    this.setState({
      updatingOrg: org.sponsorID
    })
  }

  exitUpdateOrg = () => {
    this.setState({
      updatingOrg: -1
    })
    this.getOrgs();
  }

  exitAddOrg = () => {
    this.setState({
      addingOrg: false
    })
    this.getOrgs();
  }

  changeUserType = (e) => {
    this.setState({userType: parseInt(e.target.value)})
  }

  exitDriverView = () => {
    this.setState({driverView: false})
  }

  exitSponsorView = () => {
    this.setState({sponsorView: false})
  }

  render() {
    const users = this.state.userType === 2 ? this.state.admin : this.state.userType === 1 ? this.state.sponsors : this.state.drivers
    if (this.state.isAdmin){
      return (
        <Layout userType={2} isUser={this.isAdmin}>
          {/* <select className='SortByDrop' id='SortByDrop'>
              <option disabled selected hidden>Sort By</option>
              <option>All Time</option>
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select> */}
            <div className='AdminHome-Top'>
              <div>
                <button className='AdminHome-Button' onClick={() => this.setState({driverView: true})}>Driver View</button>
                <button className='AdminHome-Button' onClick={() => this.setState({sponsorView: true})}>Sponsor View</button>
              </div>
              <div className='userbuttons'>
                <p>View Users:</p>

                <div>
                  <select className='AdminHome-Select' id='SortByDrop' onChange={this.changeUserType}>
                    <option id="drivers" name="usertype" value={0}>Drivers</option>
                    <option id="sponsors" name="usertype" value={1}>Sponsors</option>
                    <option id="admin" name="usertype" value={2}>Admin</option>
                    <option id="orgs" name="usertype" value={3}>Organizations</option>
                  </select>
                  {/* <input type="radio" id="drivers" name="usertype" value="drivers" checked={this.state.userType===0} onChange={() => this.setState({userType: 0})}/>
                  <label htmlFor="drivers">Drivers</label>
                  <input type="radio" id="sponsors" name="usertype" value="sponsors" checked={this.state.userType===1} onChange={() => this.setState({userType: 1})}/>
                  <label htmlFor="sponsors">Sponsors</label>
                  <input type="radio" id="admin" name="usertype" value="admin" checked={this.state.userType===2} onChange={() => this.setState({userType: 2})}/>
                  <label htmlFor="admin">Admin</label>
                  <input type="radio" id="orgs" name="usertype" value="orgs" checked={this.state.userType===3} onChange={() => this.setState({userType: 3})}/>
                  <label htmlFor="orgs">Organizations</label> */}
                </div>
            </div>
            <div className='Hidden-Buttons'>
                <button className='AdminHome-Button'>Driver View</button>
                <button className='AdminHome-Button'>Sponsor View</button>
              </div>
            </div>
            <div className='show-users'>
              {this.state.userType === 0 && <button onClick={() => this.setState({adding: true})}>Add New Driver</button>}
              {this.state.userType === 1 && <button onClick={() => this.setState({adding: true})}>Add New Sponsor</button>}
              {this.state.userType === 2 && <button onClick={() => this.setState({adding: true})}>Add New Admin</button>}
              {this.state.userType === 3 && <button onClick={() => this.setState({addingOrg: true})}>Add New Organization</button>}
              {/* <div className='users-heading'>
                  <div className='blank'></div>
                  <p className='user-info'>Name</p>
              </div> */}
              {this.state.userType !== 3 ? users.map((user, i) => {return(
                <div className='individual-user' key={i}>
                    <img className='profile-pic' src='DefaultProfPic.png' alt='Default Profile Picure'/>
                    <p className='user-info'>{user.fname} {user.lname}</p>
                    <p className='user-info'>{user.status ? 'Active' : 'Suspended'}</p>
                    {this.state.userType === 1 && <p className='user-info'>{user.orgName}</p>}
                    <button  className='user-info' onClick={() => this.updateAccount(user)}>Update Account</button>
                    <button className='user-info' onClick={() => this.toggleActive(user)}>Change Status</button>
                    {this.state.userType === 0 && <button className='user-info' onClick={() => this.updateOrgs(user)}>View Organizations</button>}
                </div>
              )}) :
                this.state.orgs.map((org, i) => {return(
                  <div className='individual-org' key={i}>
                      <p className='user-info'>{org.orgName}</p>
                      <button  className='user-info' onClick={() => this.updateOrg(org)}>Update Organization</button>
                  </div>
                )})
              }
            </div>
            
            {this.state.updating !== -1 && <AdminUpdateAccount uID={this.state.updating} exitUpdateInfo={this.exitUpdateInfo} />}
            {this.state.updatingOrgs !== -1 && <AdminUpdateOrgs uID={this.state.updatingOrgs} exitUpdateOrgs={this.exitUpdateOrgs} />}
            {this.state.adding && <AdminAddUser userType={this.state.userType} exitAddUser={this.exitAddUser} />}
            {this.state.updatingOrg !== -1 && <AdminUpdateOrg org={this.state.updatingOrg} exitUpdateOrg={this.exitUpdateOrg}/>}
            {this.state.addingOrg && <AdminAddOrg exitAddOrg={this.exitAddOrg}/>}
            {this.state.driverView && <DriverView exitDriverView={this.exitDriverView}/>}
            {this.state.sponsorView && <SponsorView exitSponsorView={this.exitSponsorView}/>}
        </Layout>
      );
    }else{
      return(
        <h1>{this.state.loading ? "" : "401: Unauthorized"}</h1>
      );
    }
    }
}

export default AdminHome;
