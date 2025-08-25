import React, {Component} from 'react';
import './SponsorHeader.css'

class SponsorHeader extends Component {
    state = {
        username: ''
    }

    componentDidMount(){
        this.getUsername();
    }

    getUsername = () => {
        fetch('/get-acc-info?' + new URLSearchParams({
          uID: '-1'
        }))
        .then(response => response.json())
        .then(response => {
          console.log(response)
          this.setState({
            username: response.user.username,
          })
        })
        .catch(err => console.error(err))
      }

    logout = () => {
        fetch('/logout')
        .catch(err => console.error(err))
        this.props.isUser()
    }
    render() {
        return (
            <div className='Sponsor-Header'>
                <img src="teamLogo.png" alt="The Mad Lads Team Logo" width="250" height="100"></img>
                <nav className='Nav'>
                    <a href='SponsorHome'>
                        <button href='SponsorHome' className='NavButtons' >Home</button>
                    </a>
                    <a href='PointAssignment'>
                        <button className='NavButtons'>Points</button>
                    </a>
                    <a href='SponsorCatalog'>
                        <button className='NavButtons'>Catalog</button>
                    </a>
                    <a href='SponsorPurchasing'>
                        <button className='NavButtons'>Purchasing</button>
                    </a>
                    <a href='UpdateOrg'>
                        <button className='NavButtons'>Organization</button>
                    </a>
                    <a href='UpdateAccount'>
                        <button className='NavButtons'>Account</button>
                    </a>
                    <a href='SponsorReporting'>
                        <button className='NavButtons'>Reporting</button>
                    </a>
                </nav>

                <div className='SmallNav'>
                    <button className='NavButtons'>Menu</button>
                    <div className='SmallNavContents'>
                        <a href='SponsorHome'>Home</a>
                        <a href='PointAssignment'>Points</a>
                        <a href='SponsorCatalog'>Catalog</a>
                        <a href='SponsorPurchasing'>Purchasing</a>
                        <a href='UpdateOrg'>Organization</a>
                        <a href='UpdateAccount'>Account</a>
                        <a href='SponsorReporting'>Reporting</a>
                    </div>                
                </div>

                <ul className='Sponsor-Header-UpAcc'>
                    <img src='DefaultProfPic.png' alt='Default Profile Picure' width='40' height='40'/>
                    <li><a href='UpdateAccount'>{this.state.username}</a></li>
                    <li><a href='login' onClick={() => this.logout()}>Logout</a></li>
                </ul>
          </div>
        )
    }
}

export default SponsorHeader;