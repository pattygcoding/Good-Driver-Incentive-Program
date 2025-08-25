import React, {Component} from 'react';
import './AdminHeader.css'

class AdminHeader extends Component {
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
            <div className='Admin-Header'>
                <img src="teamLogo.png" alt="The Mad Lads Team Logo" width="250" height="100"></img>
                <nav className='Nav'>
                <a href='AdminHome'>
                    <button  className='NavButtons'>Home</button>
                </a>
                {/* <a href='PointHistory'>
                    <button className='NavButtons'>Points</button>
                </a>
                <a  href='CatalogPurchase'>
                    <button className='NavButtons'>Catalog</button>
                </a> */}
                <a href='UpdateAccount'>
                <button className='NavButtons'>Account</button>
                </a>

                <a href='AdminReporting'>
                    <button  className='NavButtons'>Reports</button>
                </a>
                    
                </nav>

                <div className='SmallNav'>
              <button className='NavButtons'>Menu</button>
              <div className='SmallNavContents'>
                <a href='AdminHome'>Home</a>
                <a href='AdminReporting'>Reports</a>
                <a href='UpdateAccount'>Account</a>
              </div>                
            </div>

                <ul className='AdminLout-UpAcc'>
                <img src='DefaultProfPic.png' alt='Default Profile Picure' width='40' height='40'/>
                <li><a href='UpdateAccount'>{this.state.username}</a></li>
                <li><a href='login' onClick={() => this.logout()}>Logout</a></li>
                </ul>
          </div>
        )
    }
}

export default AdminHeader;