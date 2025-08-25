import React, {Component} from 'react';
import { Navigate } from 'react-router-dom';
import './SponsorView.css'

class SponsorView extends Component{
    state = {
      sponsors: [],
      sponsor: null,
      navigate: false
    }
    
    componentDidMount() {
        this.isLoggedIn();
    }
  
    getSponsors = () => {
      fetch('/getAllSponsors')
      .then(response => response.json())
      .then(response => {
        this.setState({
          sponsors: response.sponsors
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
          this.getSponsors()
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
        fetch('/sponsorview?' + new URLSearchParams({
          userid: this.state.sponsor,
        }))
        .catch(err => console.error(err))
        .then(response => {
          if( response.status === 200 ) {
              this.setState({navigate: true})
          }
        })
      }
  
    render() {
        return (
              <div className='SponsorView-Body'>
                <h1 className='SponsorView-heading'>Enter Sponsor View</h1>
                <form onSubmit={this.submit} className='SponsorView-Form'>
                  <div className='SponsorView-FormContent'>
                    <select id="orgs-list" value={this.state.sponsor === "" ? null : this.state.sponsor} onChange={e => this.setState({sponsor: e.target.value})} required>
                        <option disabled selected value=""> -- select a sponsor -- </option>
                        {this.state.sponsors.map((s,i) =>
                         <option value={s.uID} key={i}>{s.fname} {s.lname}</option>
                        )}
                    </select>
                    <input type="submit" value="Select Sponsor"/>
                  </div>
                </form>
                <button onClick={this.props.exitSponsorView}>Exit</button>
                {this.state.navigate && <Navigate to="/sponsorhome"/>}
              </div> 
        );
    }
  }

export default SponsorView
