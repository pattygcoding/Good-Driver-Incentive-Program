import React, {Component} from 'react';
import SponsorHeader from './SponsorHeader'
import SponsorFooter from './SponsorFooter'
import './Layout.css'
import DriverHeader from './DriverHeader';
import DriverFooter from './DriverFooter';
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';

class Layout extends Component {
    render() {
        return (
            <div className='Layout-Container'> 
                {this.props.userType === 0 && <DriverHeader isUser={this.props.isUser}/>}
                {this.props.userType === 1 && <SponsorHeader isUser={this.props.isUser}/>}
                {this.props.userType === 2 && <AdminHeader isUser={this.props.isUser}/>}
                <div className='Layout-Content'>
                    {this.props.children}
                </div>
                {this.props.userType === 0 && <DriverFooter />}
                {this.props.userType === 1 && <SponsorFooter />}
                {this.props.userType === 2 && <AdminFooter />}
            </div>
        )
    }
}

export default Layout;