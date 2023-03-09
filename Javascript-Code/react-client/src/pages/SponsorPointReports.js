import React, {Component} from 'react';
import './AuditLogReports.css';
import AuditLogResults from '../components/AuditLogResults.js';
import Layout from '../components/Layout';
import ExportButton from '../components/ExportButton';
import ReportsTitle from '../components/ReportsTitle';
import ReportsFilter from '../components/ReportsFilter';
import DriverOnlyFilter from '../components/DriverOnlyFilter';

const columns = [
    {
        name: 'Sponsor',
        selector: row => row.orgName,
    },
    {
        name: 'First Name',
        selector: row => row.fname,
    },
    {
        name: 'Last Name',
        selector: row => row.lname,
    },
    {
        name: 'TotalPoints',
        selector: row => row.totalPoints,
    },
    {
        name: 'Point Change',
        selector: row => row.pointValue,
    },
    {
        name: 'Reason',
        selector: row => row.pointReason,
    },
    {
        name: 'Date',
        selector: row => row.date,
    },
];

class SponsorPointReports extends Component {

    state = {
        data_fetched: false,
        data: {},
        org: -1,
        isSponsor: false,
        loading: true
    }

    async componentDidMount() {
        await this.isSponsor();
    }
    
    isSponsor = async() => {
    await fetch('/isSponsor')
    .then(response => response.json())
    .then(response => {
        if(response.is_sponsor){
            this.getOrgs()
        }
        this.setState({loading: false, isSponsor: response.is_sponsor})
    })
    .catch(err => console.error(err))
    }

    getOrgs = async() => {

        await fetch('/getOrganizations?' + new URLSearchParams({
            uID: '-1',
        }))
        .then(response => response.json())
        .then(response => {
            this.setState({
            org: response.orgs[0].sponsorID
            })
        })
        .catch(err => console.error(err))

    }

    getPointInfo = async(data) => {

        var payload = {
            startDate: data.startDate,
            endDate: data.endDate,
            orgID: this.state.org,
            uID: data.driverID
        };
    
        console.log(payload)
        await fetch('/getSponsorPointReport', {
            method: 'POST', //post request
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload) //put into json form
        })
        .then(response => response.json())
        .then(response => {
            this.setState({data: response});
            console.log(response);
        })
        .catch(err => console.error(err));

    }

    callback = (data) => {

        console.log("sponsor point data sent to server:")
        console.log(data);
        this.getPointInfo(data);

        this.setState({
            data_fetched: true
        });

    }

    render() {
        if( this.state.isSponsor & this.state.org !== -1 ) {
            if ( !this.state.data_fetched ) {
                console.log(this.state.org)
                return (
                    <Layout userType={1}>
                    <DriverOnlyFilter callBack={this.callback} orgID={this.state.org}/>
                    </Layout>
                )
            }
            else {
                return (
                    <Layout userType={1}>
                        {/* Invoice Table */}
                        <ReportsTitle content="Point Report"></ReportsTitle>
                        <AuditLogResults data={this.state.data} columns={columns}></AuditLogResults>
                        <ExportButton data={this.state.data}>Export</ExportButton>
                    </Layout>
                );
            }

        }
        else if( this.state.isSponsor ) {
            return(
                <Layout userType={1}>
                    Loading...
                </Layout>
            )

        }
        else {

            return (
              <h1>{this.state.loading ? "" : "401: Unauthorized"}</h1>
            );

        }

    }

}

export default SponsorPointReports;