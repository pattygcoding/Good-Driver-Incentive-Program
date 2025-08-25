import React, {Component} from 'react';
import './AdminUpdateOrg.css'

class AdminAddOrg extends Component{
  state = {
    loading: true,
    isLoggedIn: false,
    name: '',
    street: '',
    city: '',
    state: '',
    zip: 0,
    ppd: 0,
    email: ''
  }
  
  componentDidMount() {
  }

  handleChange = (event) => {
    const target = event.target;
    const name = target.name
    const value = target.value
    
    this.setState({
      [name]: value
    });
  };

  submit = (event) => {
    event.preventDefault();
    var payload = {
      name: this.state.name,
      email: this.state.email,
      street: this.state.street,
      city: this.state.city,
      state: this.state.state,
      zip: this.state.zip,
      ppd: this.state.ppd
    };
    fetch('/add-org', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if( response.status === 200 ) {
        this.props.exitAddOrg()
      }
    })
    .catch((error) => {
      console.error('Error', error);
    });
  }

  render() {
    return (
            <div className='UpdateOrg-Body'>
                <h1 className='AddUser-heading'>Add New Organization</h1>
                <form classname='UpdateOrg-Form' id='info-form' onSubmit={this.submit}>
                    <label className='inputs' htmlFor='name'><br/>Organization Name<br/></label>
                        <input required type='text' id='name' name='name'  size='45' value={this.state.name} onChange={this.handleChange}></input>
                    <label className='inputs' htmlFor='email'><br/>Email<br/></label>
                        <input required type='text' id='email' name='email'  size='45' value={this.state.email} onChange={this.handleChange}></input>
                    <label className='inputs' htmlFor='street'><br/>Street Address<br/></label>
                        <input required type='text' id='street' name='street' size='45' value={this.state.street} onChange={this.handleChange}></input>  
                    <label className='inputs' htmlFor='city'><br/>City<br/></label>
                        <input required type='text' id='city' name='city' size='45' value={this.state.city} onChange={this.handleChange}></input>
                    <label className='inputs' htmlFor='state'><br/>State<br/></label>
                        <input required type='text' id='state' name='state' size='45' value={this.state.state} onChange={this.handleChange}></input>
                    <label className='inputs' htmlFor='zip'><br/>Zip<br/></label>
                        <input required type='text' id='zip' name='zip' size='45' value={this.state.zip} onChange={this.handleChange}></input>
                    <label className='inputs' htmlFor='ppd'><br/>Points Per Dollar<br/></label>
                        <input required type='number' id='ppd' name='ppd' min={0} size='45' value={this.state.ppd} onChange={this.handleChange}></input>
                    <button type="submit" id='btn' className='UpdateOrg-Button'>Add Organization</button>
                </form>
                <button className='UpdateOrg-Button' onClick={this.props.exitAddOrg}>Exit</button>
            </div>
    );
  }
}

export default AdminAddOrg;
