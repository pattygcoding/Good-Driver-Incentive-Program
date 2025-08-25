
import DataTable from 'react-data-table-component';
import React, {Component} from 'react';
import './AuditLogResults.css'





class AuditLogResults extends Component {
    
    render() {
        return(
            
                <DataTable
                columns={this.props.columns}
                data={this.props.data}
                pagination
                />
            
        );
    };

}

export default AuditLogResults