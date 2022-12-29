import React, {Component} from 'react';
import './InvoiceReports.css';
import Layout from '../components/Layout';
import ExportButton from '../components/ExportButton';
import ReportsTitle from '../components/ReportsTitle';
import ReportsFilter from '../components/ReportsFilter';
import AuditLogResults from '../components/AuditLogResults';

const columns = [
    {
        name: 'Sponsor',
        selector: row => row.orgName,
    },
    {
        name: 'User ID',
        selector: row => row.uID,
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
        name: 'Total',
        selector: row => row.total,
    },
    {
        name: 'Fee',
        selector: row => row.Fee,
    },
];

class InvoiceReports extends Component {

    state = {
        data_fetched: false,
        invoice_data: {},
        totalFee: 0
    };

    getInvoiceReport = async(data) => {

        //query for data
        var payload = {
            startDate: data.startDate,
            endDate: data.endDate,
            orgName: data.org
        };
    
        console.log(payload)
        await fetch('/getInvoiceReport', {
            method: 'POST', //post request
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload) //put into json form
        })
        .then(response => response.json())
        .then(response => {
            this.setState({invoice_data: response});
            console.log(response);
        })
        .catch(err => console.error(err));
    
        this.setState({
            data_fetched: true
        });

    }

    getTotalFee = () => {

        for( let i = 0, len =this.state.invoice_data.length; i < len; i++ ) {

            this.setState({
                totalFee: this.state.totalFee + this.state.invoice_data[i].Fee
            })

        }

        this.setState({
            totalFee: this.state.totalFee.toFixed(2)
        });

    }

    callback = async(data) => {

        console.log("Got data:");
        await this.getInvoiceReport(data);
        this.getTotalFee();
        console.log("Total Fee:")
        console.log(this.state.totalFee);

    }

    render() {

        if( !this.state.data_fetched ) {

            return(
                <Layout userType={2}>
                    <ReportsFilter callBack={this.callback}/>
                </Layout>
            );

        }
        else {
            return (
                <Layout userType={2}>
                    {/* Invoice Table */}
                    <ReportsTitle content="Invoice Report"></ReportsTitle>
                    <AuditLogResults data={this.state.invoice_data} columns={columns}></AuditLogResults>
                    <ExportButton data={this.state.invoice_data}>Export</ExportButton>
                    <p>Total Fee Due For Selected Period: {this.state.totalFee}</p>
                </Layout>
            );
        }


    };

}

export default InvoiceReports;