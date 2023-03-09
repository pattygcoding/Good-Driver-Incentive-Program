import React, {Component} from 'react';
import Layout from '../components/Layout';
import './PointAssignment.css'

class PointAssignment extends Component{
  state = {
    add: true,
    value: 0,
    driver: '',
    comment: '',
    drivers: [],
    loading: true,
    isSponsor: false
  };

  componentDidMount() {
    this.isSponsor();
  }

  getDrivers = () => {
    fetch('/getSponsorDrivers')
    .then(response => response.json())
    .then(response => this.setState({drivers: response.drivers}))
    .catch(err => console.error(err))
  }
  
  isSponsor = () => {
    fetch('/isSponsor')
    .then(response => response.json())
    .then(response => {
      this.setState({loading: false, isSponsor: response.is_sponsor});
      if(response.is_sponsor){
        this.getDrivers();
      }
    })
    .catch(err => console.error(err))
  }

  handleChange = (event) => {
    const target = event.target;
    const name = target.name
    const value = target.value
    
    this.setState({
      [name]: value
    });

  };

  selectAdd = () => {
    this.setState({
      add: true
    });
  };

  selectSub = () => {
    this.setState({
      add: false
    });
  };

  submit = (event) => {
    event.preventDefault();
    var payload = {
      add: this.state.add,
      value: this.state.value,
      driver: this.state.driver,
      sponsor: -1,
      comment: this.state.comment,
    };
    console.log(payload)
    fetch('/point-assignment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if( response.status === 200 ) {
        this.setState({
          add: true,
          value: 0,
          driver: '',
          comment: ''
        });
        document.getElementById("point-form").reset();
        var dropDown = document.getElementById("driver-list");
        dropDown.selectedIndex = 0;
      }
    })
    .catch((error) => {
      console.error('Error', error);
    });
  }
  render() {
    if (this.state.isSponsor){
      return (
        <Layout userType={1}>
            <form id="point-form" onSubmit={this.submit} className='point-form'>
              <div className='form-item'>
                <label htmlFor="addsub">Add or Subtract Points?</label>
                  <div className='point-addbuttons' >
                    <div className='point-addsub' style={{backgroundColor: this.state.add ? 'rgb(0, 200, 0)' : 'rgb(223, 223, 223)'}} onClick={this.selectAdd}>
                      <div>+</div>
                    </div>
                    <div className='point-addsub' style={{backgroundColor: !this.state.add ? 'rgb(200, 0, 0)' : 'rgb(223, 223, 223)'}} onClick={this.selectSub}>
                      <div>-</div>
                    </div>
                  </div>
              </div>

              <div className='form-item'>
                <label htmlFor="value">Point Value</label>
                <input 
                  type="number" 
                  id="value" 
                  name="value"
                  placeholder={0} 
                  value={this.state.value}
                  onChange={this.handleChange}
                  min={1}
                />
              </div>

              <div className='form-item'>
              <label htmlFor="driver">Driver</label>
                <select id="driver-list" value={this.state.driver} onChange={e => this.setState({driver: e.target.value})} required>
                    <option disabled value=""> -- select a driver -- </option>
                    {this.state.drivers.map((d,i) => 
                      <option value={d.uID} key={i}>{`${d.fname} ${d.lname}`}</option>
                    )}
                </select>
              </div>

              <div className='form-item'>
                <label htmlFor="driver">Comment</label>
                <textarea
                  cols="40" 
                  rows = "7"
                  id="comment" 
                  name="comment" 
                  placeholder="Additional Comments"
                  value={this.state.comment}
                  onChange={this.handleChange}
                  required
                  minLength={1}
                  maxLength={100}
                />
              </div>
              <div className='form-item'>
                <label>Suggested Comments</label>
                  <button className='comment-suggest' type="button" onClick={()=>this.setState({comment: 'Great Driving!'})}>Great Driving!</button>
                  <button className='comment-suggest' type="button" onClick={()=>this.setState({comment: 'Bad Driving!'})}>Bad Driving!</button>
                  <button className='comment-suggest' type="button" onClick={()=>this.setState({comment: 'Free Points!'})}>Free Points!</button>
              </div>
              <input className="point-submit" type="submit" value="Send Points"/>
            </form>
        </Layout>
      );
    }else{
      return (
        <h1>{this.state.loading ? "" : "401: Unauthorized"}</h1>
      );
    }
  }
}

export default PointAssignment;
