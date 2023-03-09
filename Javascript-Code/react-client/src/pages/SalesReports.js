import React, {Component} from 'react';
import './SalesReports.css';
import Layout from '../components/Layout';
import ExportButton from '../components/ExportButton';
import ReportsTitle from '../components/ReportsTitle';
import ReportsDriverFilter from '../components/ReportsDriverFilter';
import DetailedTable from '../components/DetailedTable';
import ReportsFilter from '../components/ReportsFilter';

const driver_columns = [
    {
        name: 'First Name',
        selector: row => row.fname,
    },
    {
        name: 'Last Name',
        selector: row => row.lname,
    },
    {
        name: 'Total',
        selector: row => row.total,
    },
];

const sponsor_columns = [
    {
        name: 'Sponsor',
        selector: row => row.orgName,
    },
    {
        name: 'Total',
        selector: row => row.total,
    },
];

class SalesReports extends Component{
    state = {
      loading: true,
      isAdmin: true,
      data_fetched: false,
      driver_reports: false,
      sponsor_reports: false,
      row_data: {},
      columns: [],
      startDate: '',
      endDate: ''
    }
  
    
  //   componentDidMount() {
  //     this.isAdmin();
  //   }
  
    getSalesReportByDriver = async(data) => {

        console.log("fetching report!");

        //fetch for single table -- need to also have detailed & summary
                //fetch for single table -- need to also have detailed & summary

        // inputs --> data
            // data = startDate: '', endDate: '', org: 'Amazon', driverID: 3
        // outputs --> results
            // results = results.<row data> results.<expanded component data>

        var payload = {
            startDate: data.startDate,
            endDate: data.endDate,
            orgName: data.org,
            uID: data.driverID
        };
    
        console.log(payload)
        await fetch('/getSalesByDriver', {
            method: 'POST', //post request
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload) //put into json form
        })
        .then(response => response.json())
        .then(response => {
            this.setState({row_data: response});
            console.log(response);
        })
        .catch(err => console.error(err));

        this.setState({data_fetched: true,});

    }

    getSalesReportBySponsor = async(data) => {

        console.log("fetching report!");

        //fetch for single table -- need to also have detailed & summary

        // inputs --> data
            // data = startDate: '', endDate: '', org: 'Amazon', driverID: 3
        // outputs --> results
            // results = results.<row data> results.<expanded component data>

        var payload = {
            startDate: data.startDate,
            endDate: data.endDate,
            orgName: data.org,
        };
    
        console.log(payload)
        await fetch('/getSalesBySponsor', {
            method: 'POST', //post request
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload) //put into json form
        })
        .then(response => response.json())
        .then(response => {
            this.setState({row_data: response});
            console.log(response);
        })
        .catch(err => console.error(err));

        this.setState({data_fetched: true,});

    }

      drivercallback = (data) => {

        this.setState({ //giving up on trying to figure out why the state is not setting /getting deleted for some reason
          startDate:  JSON.parse(JSON.stringify(data.startDate)),
          endDate: JSON.parse(JSON.stringify(data.endDate)),
          driverID: data.driverID
        })
        this.getSalesReportByDriver(data);
      }

      sponsorcallback = (data) => {
        console.log("printing data");
        console.log(data);
        this.setState({
          startDate: data.startDate,
          endDate: data.endDate
        }, () => {
          this.getSalesReportBySponsor(data);
        });
      }
    
      setSponsorReports = () => {
          this.setState({
              sponsor_reports: true,
              columns:sponsor_columns
          });
      };

      setDriverReports = () => {
          this.setState({
              driver_reports: true,
              columns:driver_columns
          });
      };

    render() {
      // if (this.state.isSponsor){
        if( !this.state.sponsor_reports & !this.state.driver_reports ) {

            return (
                <Layout userType={2}>
                    <div className='SalesButtonBox'>
                        <p>Select Tye of Sales Report:</p>
                            <button className='SalesReportButton' onClick={this.setSponsorReports}>By Sponsor</button>
                        <p></p>
                            <button className='SalesReportButton' onClick={this.setDriverReports}>By Driver</button>
                        <p></p>
                    </div>
                </Layout>
            );

        }
        else if(!this.state.data_fetched & this.state.driver_reports) {

          return (
            <Layout userType={2}>
                <ReportsDriverFilter callBack={this.drivercallback}/>
            </Layout>
          );
  
        }
        else if(!this.state.data_fetched & this.state.sponsor_reports) {

            return (
              <Layout userType={2}>
                  <ReportsFilter callBack={this.sponsorcallback}/>
              </Layout>
            );
    
          }
        else if (this.state.data_fetched & this.state.driver_reports) {
            return (
                <Layout userType={2}>
                    <ReportsTitle content="Driver Sales Report"/>
                    {/* <DetailedTable data={this.state.row_data} columns={this.state.columns} expandableRowsComponent={ExpandedComponent}/> */}
                    <DetailedTable data={this.state.row_data} columns={this.state.columns} startDate={this.state.startDate} endDate={this.state.endDate}/>
                    <ExportButton data={this.state.row_data}>Export</ExportButton>
                </Layout>
            );
        }
        else if (this.state.data_fetched & this.state.sponsor_reports) {
            return (
                <Layout userType={2}>
                    <ReportsTitle content="Sponsor Sales Report"/>
                    {/* <DetailedTable data={this.state.row_data} columns={this.state.columns} expandableRowsComponent={ExpandedComponent}/> */}
                    <DetailedTable data={this.state.row_data} columns={this.state.columns} startDate={this.state.startDate} endDate={this.state.endDate}/>
                    <ExportButton data={this.state.row_data}>Export</ExportButton>
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
  
  export default SalesReports;
  