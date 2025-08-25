import React, {Component} from 'react';

import './AdminUpdateOrgs.css'

class AdminUpdateOrgs extends Component{
    state = {
      orgs: [],
      allOrgs: [],
      sponsorID: 0,
    }
    
    componentDidMount() {
        this.isLoggedIn();
    }
  
    getOrgs = () => {
      fetch('/getOrganizations?' + new URLSearchParams({
        uID: this.props.uID,
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
        uID: `${this.props.uID}`,
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
        uID: `${this.props.uID}`,
        sponsorID: this.state.sponsorID,
      };
      fetch('/addOrgRelation', {
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
        }
      })
      .catch((error) => {
        console.error('Error', error);
      });
    }
  
    render() {
        return (
              <div className='UpdateOrgs-Body'>
                <h1 className='UpdateOrgs-heading'>View/Update Organizations</h1>
                {this.state.orgs.map((org, i) => {return(
                    <div key={i} className='UpdateOrgs-Org'>
                        <p>{org.orgName}</p>
                        <button onClick={() => {this.removeOrg(org)}}>Remove</button>
                    </div>
                )})}
                <form onSubmit={this.submit} className='UpdateOrgs-Form'>
                  <p>Add New Organization</p>
                  <div className='UpdateOrgs-FormContent'>
                    <select id="orgs-list" value={this.state.driver === "" ? null : this.state.driver} onChange={e => this.setState({sponsorID: e.target.value})} required>
                        <option disabled selected value=""> -- select an organization -- </option>
                        {this.state.allOrgs.map((o,i) =>
                         !this.state.orgs.some(org => {return org.sponsorID === o.sponsorID}) && <option value={o.sponsorID} key={i}>{o.orgName}</option>
                        )}
                    </select>
                    <input type="submit" value="Add Org"/>
                  </div>
                </form>
                <button onClick={this.props.exitUpdateOrgs}>Exit</button>
              </div> 
        );
    }
  }

export default AdminUpdateOrgs
