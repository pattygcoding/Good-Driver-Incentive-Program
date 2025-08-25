import React, {Component} from 'react';
import Layout from '../components/Layout';
import CatalogItem from '../components/CatalogItem';
import AddItem from '../components/AddItem';
import './SponsorCatalog.css';

class SponsorCatalog extends Component{
  state = {
    loading: true,
    isSponsor: false,
    org: 0,
    pointsPerDollar: 0,
    items: [],
    addItem: false
  }
  
  componentDidMount() {
    this.isSponsor();
  }

  isSponsor = () => {
    fetch('/isSponsor')
    .then(response => response.json())
    .then(response => {
      this.setState({loading: false, isSponsor: response.is_sponsor})
      if(response.is_sponsor){
        this.getOrgs()
      }
    })
    .catch(err => console.error(err))
  }

  getItems = () => {
    fetch('/getSponsorItems?' + new URLSearchParams({
      sponsorID: this.state.org,
    }))
    .then(response => response.json())
    .then(response => this.setState({items: response.items}))
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
        pointsPerDollar: response.orgs[0].pointsPerDollar,
      }, this.getItems)
    })
    .catch(err => console.error(err))
  }

  removeItem = (listingId) => {
    var payload = {
      sponsorID: this.state.org,
      listingId: listingId,
    };
    fetch('/remove-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(response => {
      if( response.status === 200 ) {
        this.getItems();
      }
    })
    .catch((error) => {
      console.error('Error', error);
    });
  }

  exitAddItem = () => {
    this.getItems();
    this.setState({addItem: false})
  }

  changePoints = () => {
    var payload = {
      uID: '-1',
      ppd: this.state.pointsPerDollar
    };
    fetch('/update-ppd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if( response.status === 200 ) {
      }
    })
    .catch((error) => {
      console.error('Error', error);
    });
  }


  handlPointChange = (event) => {
    const points = event.target.value >= 0 ? event.target.value : 0
    this.setState({pointsPerDollar: points}, this.changePoints)
  }

  render() {
    if (this.state.isSponsor){
      return (
        <Layout userType={1}>
            <div className='SponsorCatalog-Body'>
              <div className='SponsorCatalog-Top'>
                <h1>Catalog Creation</h1>
                <button className='SponsorCatalog-Add' onClick={() => this.setState({addItem: true})}>Add Product</button>
                <label htmlFor='ppd'>Points Per Dollar:</label>
                <input type='number' id='ppd' name='ppd' min={0} value={this.state.pointsPerDollar} onChange={this.handlPointChange}></input>
              </div>
              <div className='SponsorCatalog-Items'>
                {this.state.items.map((item, i) => {
                  return(
                    <CatalogItem key={i} type={1} item={item} ppd={this.state.pointsPerDollar} buttonClick={this.removeItem}/>
                )})}
              </div>
              {this.state.addItem && <AddItem ppd={this.state.pointsPerDollar} org={this.state.org} exitAddItem={this.exitAddItem}></AddItem>}
            </div>
        </Layout>
      );
    }else{
      return (
        <h1>{this.state.loading ? "" : "401: Unauthorized"}</h1>
      );
    }
  }
}

export default SponsorCatalog;
