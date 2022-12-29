import React, {Component} from 'react';
import CatalogItem from '../components/CatalogItem';
import Layout from '../components/Layout';
import './DriverCatalog.css'
import ShoppingCart from '../components/ShoppingCart';

class DriverCatalog extends Component{
  state = {
    loading: true,
    isDriver: false,
    items: [],
    orgs: [],
    org: -1,
    orgName: '',
    pointsPerDollar: 0,
    cart: [],
    points: [],
    viewCart: false
  }
  
  componentDidMount() {
    this.isDriver();
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
      driver: '-1',
    }))
    .then(response => response.json())
    .then(response => {
      this.setState({
        points: response.Points,
      })
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
        orgs: response.orgs,
        org: response.orgs[0].sponsorID,
        orgName: response.orgs[0].orgName,
        pointsPerDollar: response.orgs[0].pointsPerDollar,
      }, this.getItems)
    })
    .catch(err => console.error(err))
  }

  isDriver = () => {
    fetch('/isDriver')
    .then(response => response.json())
    .then(response => {
      this.setState({loading: false, isDriver: response.is_driver})
      if(response.is_driver){
        this.getOrgs();
        this.getPoints();
      }
    })
    .catch(err => console.error(err))
  }

  changeOrg = (e) => {
    const org = this.state.orgs.find(org => parseInt(org.sponsorID) === parseInt(e.target.value))
    this.setState({
      org: org.sponsorID,
      orgName: org.orgName,
      pointsPerDollar: org.pointsPerDollar,
      viewCart: false,
      cart: []
    }, this.getItems)
  }

  addToCart = (listingId, quantity, name, price) => {
    if(!this.state.viewCart && quantity>0){
      let newCart = this.state.cart;
      const item = newCart.findIndex(item => parseInt(item.listingId) === parseInt(listingId))
      if(item!==-1){
        newCart[item].quantity = newCart[item].quantity + 1
      }else{
        newCart.push({
          listingId: listingId,
          maxquantity: quantity,
          name: name,
          price: parseInt(price),
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
    }
  }

  render() {
    if (this.state.isDriver){
      return (
        <Layout userType={0}>
          <div className='DriverCatalog-Body'>
            <div className='DriverCatalog-Top'>
              <div className='DriverCatalog-SelectLabel'>
                <label htmlFor='SelectSponsor'>Select Sponsor:</label>
                <select className='DriverCatalog-Select' id='SelectSponsor' onChange={this.changeOrg}>
                    {this.state.orgs.map((org, i) => {return(
                      <option value={org.sponsorID} key={i}>{org.orgName}</option>
                    )})}
                </select>
                <p>Balance: {this.state.points.find(point => point.sponsorID === this.state.org) && this.state.points.find(point => point.sponsorID === this.state.org).totalPoints} points</p>
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
          {this.state.viewCart && <ShoppingCart cart={this.state.cart} sponsor={this.state.org} sponsorName={this.state.orgName} points={this.state.points.find(point => point.sponsorID === this.state.org).totalPoints} exit={this.exitCart}/>}
        </Layout>
      );
    }else{
      return (
        <h1>{this.state.loading ? "" : "401: Unauthorized"}</h1>
      );
    }
  }
}

export default DriverCatalog;