import React, {Component} from 'react';
import './Home.css';

class Home extends Component{
  render() {
    return (
      <div className='HomePage'>
        <header className='Home-Header'>
          <img src="teamLogo.png" alt="The Mad Lads Team Logo" width="250" height="100"></img>
        </header>
        <div className='home-buttons'>
          <a href='login'><button className='home-button'>Login</button></a>
          <a href='signup'><button className='home-button'>Signup</button></a>
        </div>
      </div>      
    );
  }
}

export default Home;
