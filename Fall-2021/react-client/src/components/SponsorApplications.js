import React, {Component} from 'react';
import './SponsorApplications.css'

class SponsorApplications extends Component{
    state = {
        applications: [],
    }
    
    componentDidMount() {
        this.isLoggedIn();
    }
  
    getApps = () => {
      fetch('/getApplications?' + new URLSearchParams({
        sponsorID: this.props.org,
      }))
      .then(response => response.json())
      .then(response => {
        console.log(response.orgs)
        this.setState({
            applications: response.applications
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
          this.getApps()
        }
      })
      .catch(err => console.error(err))
    }

    setAppStatus = (app, status) => {
      var payload = {
        appID: app.applicationsID,
        status: status,
        uID: app.uID,
        sponsorID: this.props.org
      };
      fetch('/updateApplicationStatus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(response => {
        if( response.status === 200 ) {
          this.getApps()
        }
      })
      .catch((error) => {
        console.error('Error', error);
      });
    }
  
    render() {
        return (
              <div className='SponsorApps-Body'>
                <h1 className='SponsorApps-heading'>Driver Applications</h1>
                {this.state.applications.map((app, i) => {return(
                    <div key={i} className='SponsorApps-Org'>
                        <p>{app.fname} {app.lname}</p>
                        <p>{app.date}</p>
                        {app.status === 0 ? 
                        <div className='SponsorApps-Buttons'><button onClick={() => {this.setAppStatus(app, 1)}}>Accept</button><button onClick={() => {this.setAppStatus(app, 2)}}>Reject</button></div> :
                            app.status === 1 ? 
                            <p>Accepted</p> :
                            <p>Rejected</p>}
                    </div>
                )})}
                <button className='AddUser-Exit' onClick={this.props.exitApplications}>Exit</button>
              </div> 
        );
    }
  }

export default SponsorApplications
