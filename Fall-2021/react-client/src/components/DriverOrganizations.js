import React, {Component} from 'react';
import './DriverOrganizations.css'

class DriverOrganizations extends Component{
    state = {
      orgs: [],
      allOrgs: [],
      sponsorID: 0,
      applications: []
    }
    
    componentDidMount() {
        this.isLoggedIn();
    }
  
    getOrgs = () => {
      fetch('/getOrganizations?' + new URLSearchParams({
        uID: '-1',
      }))
      .then(response => response.json())
      .then(response => {
        console.log(response.orgs)
        this.setState({
          orgs: response.orgs
        })
      })
      .catch(err => console.error(err))
    }

    getApps = () => {
        fetch('/getDriverApplications')
        .then(response => response.json())
        .then(response => {
          console.log(response.orgs)
          this.setState({
              applications: response.applications
          })
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
  
    isLoggedIn = () => {
      fetch('/isLoggedIn')
      .then(response => response.json())
      .then(response => {
        this.setState({loading: false, isLoggedIn: response.is_loggedin})
        if(response.is_loggedin){
          this.getOrgs()
          this.getAllOrgs()
          this.getApps()
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

    removeOrg = (org) => {
      var payload = {
        uID: `-1`,
        sponsorID: org.sponsorID,
      };
      fetch('/removeOrgRelation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(response => {
        if( response.status === 200 ) {
          this.getOrgs()
        }
      })
      .catch((error) => {
        console.error('Error', error);
      });
    }
  
    submit = (event) => {
      event.preventDefault();
      var payload = {
        sponsorID: this.state.sponsorID,
      };
      fetch('/addOrgApplication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(response => {
        if( response.status === 200 ) {
          this.setState({
            sponsorID: 0,
          });
          var dropDown = document.getElementById("orgs-list");
          dropDown.selectedIndex = 0;
          this.getOrgs()
          this.getApps()
        }
      })
      .catch((error) => {
        console.error('Error', error);
      });
    }

    deleteApplication = (app) => {
        var payload = {
            appID: app.applicationsID,
          };
          fetch('/removeApplication', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })
          .then(response => {
            if( response.status === 200 ) {
              this.getApps();
            }
          })
          .catch((error) => {
            console.error('Error', error);
          });
    }
  
    render() {
        return (
              <div className='DriverOrgs-Body'>
                <h1 className='DriverOrgs-heading'>My Sponsor Organizations</h1>
                {this.state.orgs.map((org, i) => {return(
                    <div key={i} className='DriverOrgs-Org'>
                        <p>{org.orgName}</p>
                        <button onClick={() => {this.removeOrg(org)}}>Leave Organization</button>
                    </div>
                )})}
                <form onSubmit={this.submit} className='DriverOrgs-Form'>
                  <p>Apply To Organization</p>
                  <div className='DriverOrgs-FormContent'>
                    <select id="orgs-list" value={this.state.driver === "" ? null : this.state.driver} onChange={e => this.setState({sponsorID: e.target.value})} required>
                        <option disabled selected value=""> -- select an organization -- </option>
                        {this.state.allOrgs.map((o,i) =>
                         (!this.state.orgs.some(org => {return org.sponsorID === o.sponsorID}) && !this.state.applications.some(app => {return app.sponsorID === o.sponsorID})) && <option value={o.sponsorID} key={i}>{o.orgName}</option>
                        )}
                    </select>
                    <input type="submit" value="Apply"/>
                  </div>
                </form>
                <h1 className='SponsorApps-heading'>Outstanding Applications</h1>
                {this.state.applications.length > 0 ? this.state.applications.map((app, i) => {return(
                    <div key={i} className='SponsorApps-Org'>
                        <p>{app.orgName}</p>
                        <p>{app.date}</p>
                        <button onClick={() => {this.deleteApplication(app)}}>Remove Application</button>
                    </div>
                )}) : <p>No applications</p>}
              </div> 
        );
    }
  }

export default DriverOrganizations
