import React, {Component} from 'react';
import './SponsorFooter.css'

class SponsorFooter extends Component {
    render() {
        return (
            <div className='Sponsor-Footer'>
                <img src="teamLogo.png" alt="The Mad Lads Team Logo" width="200" height="70"></img>
                <p className='getHelp'>If you are experiencing problems with the website please email  
                    <a href="mailto:madlads4910@gmail.com"> madlads4910@gmail.com</a> 
                    with your issues.</p>
                <button className='DriverView'>Driver View</button>
            </div>
        )
    }
}

export default SponsorFooter;