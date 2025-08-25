import React, {Component} from 'react';
import { Navigate } from 'react-router-dom';
import './DriverView.css'

class DriverView extends Component{
    state = {
      drivers: [],
      driver: -1,
      navigate: false
    }
    
    componentDidMount() {
        this.getDrivers()
    }
  
    getDrivers = () => {
        if(this.props.userType === 1){
            fetch('/getSponsorDrivers')
            .then(response => response.json())
            .then(response => this.setState({drivers: response.drivers}))
            .catch(err => console.error(err))
        }else{
            fetch('/getAllDrivers')
            .then(response => response.json())
            .then(response => {
              this.setState({
                drivers: response.drivers
              })
              console.log(response.drivers)
            })
            .catch(err => console.error(err))
        }
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
      fetch('/driverview?' + new URLSearchParams({
        userid: this.state.driver,
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
              <div className='DriverView-Body'>
                <h1 className='DriverView-heading'>Enter Driver View</h1>
                <form onSubmit={this.submit} className='DriverView-Form'>
                  <div className='DriverView-FormContent'>
                    <select id="orgs-list" value={this.state.driver === -1 ? null : this.state.driver} onChange={e => this.setState({driver: e.target.value})} required>
                        <option disabled selected value=""> -- select a driver -- </option>
                        {this.state.drivers.map((d,i) =>
                         <option value={d.uID} key={i}>{d.fname} {d.lname}</option>
                        )}
                    </select>
                    <input type="submit" value="Select Driver"/>
                  </div>
                </form>
                <button onClick={this.props.exitDriverView}>Exit</button>
                {this.state.navigate && <Navigate to="/driverhome"/>}
              </div> 
        );
    }
  }

export default DriverView
