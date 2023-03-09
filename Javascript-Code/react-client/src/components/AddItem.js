import React, {Component} from 'react';
import CatalogItem from '../components/CatalogItem';
import './AddItem.css';

class AddItem extends Component{
  state = {
    items: [],
    keywords: '',
    searched: false,
    error: ''
  }
  
  componentDidMount() {
    
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

  searchItems = () => {
    this.setState({error: ''})
    fetch('/searchItems?' + new URLSearchParams({
        keywords: this.state.keywords,
        sponsorID: this.props.org
      }))
      .then(response => response.json())
      .then(response => this.setState({items: response.items, searched: true}))
      .catch(err => console.error(err))
  }

  addItem = (listingId) => {
    var payload = {
      sponsorID: this.props.org,
      listingId: listingId,
    };
    fetch('/add-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(response => {
        response.json().then( data => {
            if( data.success ) {
                this.props.exitAddItem()
            }
            else {
                this.setState({error: data.msg})
            }
        })
    })
    .catch((error) => {
      console.error('Error', error);
    });
  }

  render() {
      return (
            <div className='AddItem-Body'>
              <div className='SponsorCatalog-Top'>
                <h1>Add an Item</h1>
                <p>Your catalog can have up to 10 items</p>
                <button className='addItem-exitbutton' onClick={this.props.exitAddItem}>Exit</button>
                <label htmlFor="item-search">Search for items:</label>
                <div className='addItem-search'>
                    <input type="search" id="item-search" className='addItem-searchinput' onChange={(e) => this.setState({keywords: e.target.value})}></input>
                    <button className='addItem-searchbutton' onClick={() => this.searchItems()}>Search</button>
                </div>
                {this.state.error !== '' && <p style={{"color": "red"}}>{this.state.error}</p>}
              </div>
              <div className='addItem-Items'>
                {this.state.items.map((item, i) => {
                  return(
                    <CatalogItem key={i} type={2} item={item} ppd={this.props.ppd} buttonClick={this.addItem}/>
                )})}
                {this.state.items.length === 0 && this.state.searched && <p>No items found</p>}
              </div>
            </div>
      );
  }
}

export default AddItem;
