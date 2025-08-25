
import DataTable from 'react-data-table-component';
import React, {Component} from 'react';
import './DetailedTable.css'



// issue where expanding more than one column causes everything to go haywaire

class DetailedTable extends Component {

    state = {
        info: {},
        uID: -1,
        data: this.props.data,
        initialzed: false
    }

    // append info to the end of the data array upon loading, then display normally

    initializeData = async() => {
        if( this.props.columns.length === 2 ) {

            console.log("sponsor")
            console.log("initializing data with items")
            for( let i = 0, len =this.state.data.length; i < len; i++ ) {
    
                await fetch('/getDetailedSponsorInfo', {
                    method: 'POST', //post request
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({data: this.state.data[i], startDate: this.props.startDate, endDate: this.props.endDate}) //put into json form
                })
                .then(response => response.json())
                .then(response => {
                    //console.log(response);
                    let row = this.state.data[i];
                    row.items = response;
                    this.state.data[i] = row;
                })
                .catch(err => console.error(err));
    
            }

        }
        else {

            console.log("initializing data with items")
            for( let i = 0, len =this.state.data.length; i < len; i++ ) {
    
                await fetch('/getDetailedDriverInfo', {
                    method: 'POST', //post request
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({data: this.state.data[i], startDate: this.props.startDate, endDate: this.props.endDate}) //put into json form
                })
                .then(response => response.json())
                .then(response => {
                    //console.log(response);
                    let row = this.state.data[i];
                    row.items = response;
                    this.state.data[i] = row;
                })
                .catch(err => console.error(err));
    
            }

        }


        this.setState({
            initialzed: true
        });

    }

    // make query to get drvier's items based off the data row, return the results!
    render() {

        if( !this.state.initialzed ) {
            this.initializeData();
        }

        const ExpandedComponent = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>;

        return(
            
                <DataTable
                columns={this.props.columns}
                data={this.props.data}
                pagination
                expandableRows
                expandableRowsComponent={<ExpandedComponent/>}
                />
            
        );
    };

}

export default DetailedTable