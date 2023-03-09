import React, {Component} from 'react';
import CatalogItem from '../components/CatalogItem';
import Layout from '../components/Layout';
// import './SponsorPurchasing.css'
import ShoppingCart from '../components/ShoppingCart';

class SponsorPurchasing extends Component{
  state = {
    loading: true,
    isSponsor: false,
    items: [],
    drivers: [],
    driver: -1,
    org: -1,
    orgName: '',
    pointsPerDollar: 0,
    cart: [],
    points: 0,
    viewCart: false
  }
  
  componentDidMount() {
    this.isSponsor();
  }

  getItems = () => {
    fetch('/getSponsorItems?' + new URLSearchParams({
      sponsorID: this.state.org,
    }))
    .then(response => response.json())
    .then(response => this.setState({items: response.items}))
    .catch(err => console.error(err))
  }

  getPoints = () => {
    fetch('/get-points?' + new URLSearchParams({
        driver: this.state.driver,
      }))
    .then(response => response.json())
    .then(response => {
        let points = 0
        if(response.Points.find(point => point.sponsorID === this.state.org)){
            points = response.Points.find(point => point.sponsorID === this.state.org).totalPoints
        }
      this.setState({points: points})
    })
    .catch(err => console.error(err))
  }

  getOrgs = () => {
    fetch('/getOrganizations?' + new URLSearchParams({
      uID: '-1',
    }))
    .then(response => response.json())
    .then(response => {
      this.setState({
        org: response.orgs[0].sponsorID,
        orgName: response.orgs[0].orgName,
        pointsPerDollar: response.orgs[0].pointsPerDollar,
      }, this.getItems)
    })
    .catch(err => console.error(err))
  }

  getDrivers = () => {
    fetch('/getSponsorDrivers')
    .then(response => response.json())
    .then(response => this.setState({
        drivers: response.drivers,
        driver: response.drivers[0].uID
    }, this.getPoints))
    .catch(err => console.error(err))
  }

  isSponsor = () => {
    fetch('/isSponsor')
    .then(response => response.json())
    .then(response => {
      this.setState({loading: false, isSponsor: response.is_sponsor})
      if(response.is_sponsor){
        this.getDrivers();
        this.getOrgs();
        // this.getPoints();
      }
    })
    .catch(err => console.error(err))
  }

  changeDriver = (e) => {
    this.setState({
      driver: e.target.value,
      viewCart: false,
    }, this.getPoints)
  }

  addToCart = (listingId, quantity, name, price) => {
    if(!this.state.viewCart){
      let newCart = this.state.cart;
      const item = newCart.findIndex(item => parseInt(item.listingId) === parseInt(listingId))
      if(item!==-1){
        newCart[item].quantity = newCart[item].quantity + 1
      }else{
        newCart.push({
          listingId: listingId,
          maxquantity: quantity,
          name: name,
          price: price,
          quantity: 1
        })
      }
      this.setState({
        cart: newCart
      })
    }
  }

  exitCart = (action) => {
    this.getPoints();
    if(action === 0){
      this.setState({viewCart: false})
    }else{
      this.setState({viewCart: false, cart: []})
      this.getPoints();
    }
  }

  render() {
    if (this.state.isSponsor){
      return (
        <Layout userType={1}>
          <div className='DriverCatalog-Body'>
              <h1>Purchase For a Driver</h1>
            <div className='DriverCatalog-Top'>
              <div className='DriverCatalog-SelectLabel'>
                <label htmlFor='SelectSponsor'>Select Driver:</label>
                <select className='DriverCatalog-Select' id='SelectSponsor' onChange={this.changeDriver}>
                    {this.state.drivers.map((driver, i) => {return(
                      <option value={driver.uID} key={i}>{driver.fname} {driver.lname}</option>
                    )})}
                </select>
                <p>Balance: {this.state.points} points</p>
              </div>
              <div className='DriverCatalog-Title'>
                {/* <h1>{this.state.orgName} Catalog</h1> */}
                <button className='DriverCatalog-Cart' onClick={() => this.setState({viewCart: true})}>View Cart</button>
              </div>
            </div>
            <div className='DriverCatalog-Items'>
              {this.state.items.map((item, i) => {
                return(
                  <CatalogItem key={i} type={0} item={item} ppd={this.state.pointsPerDollar} buttonClick={this.addToCart}/>
              )})}
            </div>
          </div>
          {this.state.viewCart && <ShoppingCart driver={this.state.driver} cart={this.state.cart} sponsor={this.state.org} sponsorName={this.state.orgName} points={this.state.points} exit={this.exitCart}/>}
        </Layout>
      );
    }else{
      return (
        <h1>{this.state.loading ? "" : "401: Unauthorized"}</h1>
      );
    }
  }
}

export default SponsorPurchasing;