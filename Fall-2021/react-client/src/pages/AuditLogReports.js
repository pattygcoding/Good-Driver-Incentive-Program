import React, {Component} from 'react';
import './AuditLogReports.css';
import AuditLogResults from '../components/AuditLogResults.js';
import Layout from '../components/Layout';
import ExportButton from '../components/ExportButton';
import ReportsTitle from '../components/ReportsTitle';
import ReportsFilter from '../components/ReportsFilter';


const login_columns = [
    {
        name: 'Date',
        selector: row => row.date,
    },
    {
        name: 'Username',
        selector: row => row.username,
    },
    {
        name: 'Success/Fail',
        selector: row => row.success,
    },
];

const password_columns = [
    {
        name: 'Date',
        selector: row => row.date,
    },
    {
        name: 'Username',
        selector: row => row.username,
    },
    {
        name: 'Type of Change',
        selector: row => row.changeType,
    },
];

const point_columns = [
  {
      name: 'Date',
      selector: row => row.date,
  },
  {
      name: 'Sponsor',
      selector: row => row.orgName,
  },
  {
      name: 'Last Name',
      selector: row => row.lname,
  },
  {
    name: 'First Name',
    selector: row => row.fname,
  },
  {
    name: 'Point Value',
    selector: row => row.pointValue,
  },
  {
    name: 'Reason',
    selector: row => row.pointReason,
  },
];

const app_columns = [
  {
      name: 'Date',
      selector: row => row.date,
  },
  {
      name: 'Sponsor',
      selector: row => row.orgName,
  },
  {
      name: 'Last Name',
      selector: row => row.lname,
  },
  {
    name: 'First Name',
    selector: row => row.fname,
  },
  {
    name: 'Status',
    selector: row => row.status,
  },
  // {
  //   name: 'Reason',
  //   selector: row => row.pointReason,
  // },
];

class AuditLogReports extends Component{
  state = {
    loading: true,
    isAdmin: true,
    login_columns: login_columns,
    login_data: {},
    password_columns: password_columns,
    password_data: {},
    point_columns: point_columns,
    point_data: {},
    app_columns: app_columns,
    app_data: {},
    data_fetched: false,
  }


  
//   componentDidMount() {
//     this.isAdmin();
//   }

// make new component with param to see wich kind of report
// contain inner fxn falls and queries

  getAuditLogReport = async(data) => {

    var payload = {
        startDate: data.startDate,
        endDate: data.endDate,
        orgName: data.org
    };

    console.log(payload)
    await fetch('/getLoginAttempts', {
        method: 'POST', //post request
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload) //put into json form
    })
    .then(response => response.json())
    .then(response => {
        this.setState({login_data: response});
        console.log(response);
    })
    .catch(err => console.error(err));

    await fetch('/getPasswordChanges', {
      method: 'POST', //post request
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload) //put into json form
    })
    .then(response => response.json())
    .then(response => {
        this.setState({password_data: response});
        console.log(response);
    })
    .catch(err => console.error(err));

    await fetch('/getPointAdjustments', {
      method: 'POST', //post request
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload) //put into json form
    })
    .then(response => response.json())
    .then(response => {
        this.setState({point_data: response});
        console.log(response);
    })
    .catch(err => console.error(err));

    await fetch('/getApplications', {
      method: 'POST', //post request
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload) //put into json form
    })
    .then(response => response.json())
    .then(response => {
        this.setState({app_data: response});
        console.log(response);
    })
    .catch(err => console.error(err));

    this.setState({data_fetched: true});
  };

  

    // isAdmin = () => {
    //     fetch('/isAdmin')
    //     .then(response => response.json())
    //     .then(response => {
    //     this.setState({loading: false, isAdmin: response.is_admin})
    //     if(response.is_admin){
    //         this.getDrivers()
    //         this.getSponsors()
    //         this.getAdmin()
    //     }
    //     })
    //     .catch(err => console.error(err))
    // }

    callback = async(data) => {
      console.log("printing data");
      console.log(data);
      // this.setState({
      //   startDate: data.startDate,
      //   endDate: data.endDate
      // }, () => {
      //   this.getAuditLogReport();
      // });
      await this.getAuditLogReport(data);
    }
  
  render() {
    // if (this.state.isSponsor){

      if(!this.state.data_fetched) {


        // this.getAuditLogReport();
        // this.state.data_fetched = true;

        return (
          <Layout userType={2}>
              <ReportsFilter callBack={this.callback}/>
          </Layout>
        );

      }
      else {
        return (
          <Layout userType={2}>

              {/* Point Change Table */}
              <ReportsTitle content="Password Changes"></ReportsTitle>
              <AuditLogResults data={this.state.password_data} columns={this.state.password_columns}></AuditLogResults>
              <ExportButton data={this.state.password_data}>Export</ExportButton>
  
              {/* Application Table */}
              <ReportsTitle content="Applications"></ReportsTitle>
              <AuditLogResults data={this.state.app_data} columns={this.state.app_columns}></AuditLogResults>
              <ExportButton data={this.state.app_data}>Export</ExportButton> 
  
              {/* Point Adjustment Table */}
              <ReportsTitle content="Point Adjustments"></ReportsTitle>
              <AuditLogResults data={this.state.point_data} columns={this.state.point_columns}></AuditLogResults>
              <ExportButton data={this.state.point_data}>Export</ExportButton>            
  
              {/* Login Attempts Table */}
              <ReportsTitle content="Login Attempts"></ReportsTitle>
              <AuditLogResults data={this.state.login_data} columns={this.state.login_columns}></AuditLogResults>
              <ExportButton data={this.state.login_data}>Export</ExportButton>
              
          </Layout>
        );
      }
    // }else{
    //   return (
    //     <h1>{this.state.loading ? "" : "401: Unauthorized"}</h1>
    //   );
    // }
  };
}

export default AuditLogReports;
