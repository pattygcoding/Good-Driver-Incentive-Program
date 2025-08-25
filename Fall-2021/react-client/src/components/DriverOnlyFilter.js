import React from 'react';
import DateRangeFilter from './DateRangeFilter';
import PropTypes from "prop-types";

// instlled module for date-range-picker from https://www.npmjs.com/package/react-date-range

class DriverOnlyFilter extends React.Component {

    state = {

        orgs: [],
        loaded: false,
        startDate: '',
        endDate: '',
        org: '',
        targetName: "",
        targetDriver: "",
        drivers: [],
        driverName: "",
        driverID: ""
    };

    submit = (event) => {
        this.props.callBack({
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            org: this.state.targetName,
            driverID:this.state.driverID
        })

    }

    getDrivers = (orgID) => {

        fetch('/getDriversFromOrg', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({orgID: this.props.orgID})
        })
        .then(response => response.json())
        .then( response => {
            console.log(response)
            if( response.length !== 0 ) {
                this.setState({
                    drivers: response
                });
            }
            else {
                this.setState({
                    drivers: [],
                    driverID: "",
                    driverfname: "",
                    driverlname: ""
                });
            }

        })
        .catch(err => console.error(err));
    
    }

    handleSelect(ranges) {
        console.log(ranges)
    }

    onChange = (ranges) => {
        // ranges ...
        this.setState({startDate: ranges.startDate.toLocaleString(), endDate: ranges.endDate.toLocaleString()});
    };


    changeDriver = (e) => {
        if(e.target.value === "") {
            this.setState({
                targetDriver: "",
                driverID: ""
            });
        }
        else {
            const driver = this.state.drivers.find(driver => parseInt(driver.uID) === parseInt(e.target.value))
            this.setState({
                driverID: driver.uID
            })
        }
    }
    

    render() {

        if( !this.state.loaded ) {
            console.log("orgid: "+this.props.orgID)
            this.getDrivers(this.props.orgID);
            this.setState({loaded: true});
        }


        return (

            <div>
                <div>
                <p> Select Filters for Report Query</p>
                </div>

                <label>Select Driver:</label>
                <select className='DriverCatalog-Select' id='SelectDriver' onChange={this.changeDriver}>
                    <option value="" key={0}>No Selection</option>
                    {this.state.drivers.map((driver, i) => {return(
                      <option value={driver.uID} key={i}>{driver.fname + " " + driver.lname}</option>
                    )})}
                </select>

                <p>Select Date Range</p>
                <p>
                    <DateRangeFilter onChange={this.onChange}/>
                </p>
            
                <div>
                    <button onClick={this.submit}> Submit </button>
                </div>
            </div>
        )

    }

};

DriverOnlyFilter.propTypes = {
    callBack: PropTypes.func,
    orgID: PropTypes.any
}

export default DriverOnlyFilter;