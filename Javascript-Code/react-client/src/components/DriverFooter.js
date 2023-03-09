import React, {Component} from 'react';
import './DriverFooter.css'

class DriverFooter extends Component {
    render() {
        return (
            <div className='Driver-Footer'>
                <img src="teamLogo.png" alt="The Mad Lads Team Logo" width="200" height="70"></img>
                <p classname='getHelp'>If you are experiencing problems with the website please email  
                    <a href="mailto:madlads4910@gmail.com"> madlads4910@gmail.com </a> 
                    with your issues.</p>
            </div>
        )
    }
}

export default DriverFooter;