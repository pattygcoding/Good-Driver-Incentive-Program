import React, {Component} from 'react';
import { Navigate } from 'react-router-dom';
import DriverOrganizations from '../components/DriverOrganizations';
import Layout from '../components/Layout';
import './DriverHome.css'


class DriverHome extends Component{
  state = {
    loading: true,
    isDriver: false,
    isDriverView: false,
    normalView: false,
    driverViewUser: 0
  }
  
  componentDidMount() {
    this.isDriver();
  }

  isDriver = () => {
    fetch('/isDriver')
    .then(response => response.json())
    .then(response => {
      this.setState({loading: false, isDriver: response.is_driver})
      if(response.is_driver){
        this.getIsDriverView()
      }
    })
    .catch(err => console.error(err))
  }

  getIsDriverView = () => {
    fetch('/isdriverview')
    .then(response => response.json())
    .then(response => {
      this.setState({
        isDriverView: response.is_driverview
      })
      if(response.is_driverview){
        fetch('/driverviewuser')
        .then(response => response.json())
        .then(response => {
          this.setState({
            driverViewUser: response.userType
          })
        })
        .catch(err => console.error(err))
      }
    })
    .catch(err => console.error(err))
  }
  
  normalView = () => {
    fetch('/leavedriverview')
    .catch(err => console.error(err))
    .then(response => {
      if( response.status === 200 ) {
          this.setState({normalView: true})
      }
    })
  }
  
    render() {
      if (this.state.isDriver){
        return (
          <Layout userType={0}>
              <div className='DriverHome-Body'>
                {this.state.driverViewUser === 2 && <button className='AdminHome-Button' onClick={() => this.normalView()}>Back to Admin View</button>}
                {(this.state.normalView && this.state.driverViewUser === 2) && <Navigate to="/adminhome"/>}
                {this.state.driverViewUser === 1 && <button className='AdminHome-Button' onClick={() => this.normalView()}>Back to Sponsor View</button>}
                {(this.state.normalView && this.state.driverViewUser === 1) && <Navigate to="/sponsorhome"/>}
                <DriverOrganizations></DriverOrganizations>
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

export default DriverHome;
