
import DataTable from 'react-data-table-component';
import React, {Component} from 'react';
import './ReportingWindow.css'

const columns = [
    {
        name: 'Date',
        selector: row => row.date,
    },
    {
        name: 'username',
        selector: row => row.username,
    },
    {
        name: 'success',
        selector: row => row.success,
    },
];

const data = [
    {
        id: 1,
        title: 'Beetlejuice',
        year: '1988',
    },
    {
        id: 2,
        title: 'Ghostbusters',
        year: '1984',
    },
]

class ReportingWindow extends Component {
    
    render() {
        return(
            <DataTable
            columns={columns}
            data={this.props.data}
            pagination
            />
        );
    };

}

export default ReportingWindow