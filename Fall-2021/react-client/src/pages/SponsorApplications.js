import React, {Component} from 'react';
import Layout from '../components/Layout';

class SponsorApplications extends Component{
  state = {
    loading: true,
    isSponsor: false
  }
  
  componentDidMount() {
    this.isSponsor();
  }

  isSponsor = () => {
    fetch('/isSponsor')
    .then(response => response.json())
    .then(response => this.setState({loading: false, isSponsor: response.is_sponsor}))
    .catch(err => console.error(err))
  }

  render() {
    if (this.state.isSponsor){
      return (
        <Layout userType={1}>
          <h1>
            Sponsor View Applications
          </h1>
        </Layout>
      );
    }else{
      return (
        <h1>{this.state.loading ? "" : "401: Unauthorized"}</h1>
      );
    }
  }
}

export default SponsorApplications;
