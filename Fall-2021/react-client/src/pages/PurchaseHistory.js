import React, {Component} from 'react';
import Layout from '../components/Layout';
import './PurchaseHistory.css'

class PurchaseHistory extends Component{
  state = {
    loading: true,
    isDriver: false,
    orders: [],
    orgs: [],
    org: 0,
    orgName: ''
  }
  
  componentDidMount() {
    this.isDriver();
  }

  isDriver = () => {
    fetch('/isDriver')
    .then(response => response.json())
    .then(response => {
        this.setState({loading: false, isDriver: response.is_driver})
        if(response.is_driver){
            this.getOrders();
            this.getOrgs();
        }
    
    })
    .catch(err => console.error(err))
  }

  getOrders = () => {
    fetch('/get-orders?' + new URLSearchParams({
        driver: '-1',
      }))
    .then(response => response.json())
    .then(response => {
        this.setState({orders: response.Orders.reverse()})
        console.log(response.Orders)
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
      }, this.getItems)
    })
    .catch(err => console.error(err))
  }

  changeOrg = (e) => {
    const org = this.state.orgs.find(org => parseInt(org.sponsorID) === parseInt(e.target.value))
    this.setState({
      org: org.sponsorID,
      orgName: org.orgName,
    })
  }

  getStatus = (date, status) => {
    const today = new Date();
    const orderDate = new Date(date);
    const diff = (today-orderDate) / (1000 * 60 * 60 * 24)
    if(status===0){
        return "Canceled"
    }
    else if(diff<1){
        return "Pending"
    }else if(diff<2){
        return "Shipped"
    }else{
        return "Delivered"
    }
  }

  cancelOrder = (orderID, points) => {
    var payload = {
        orderID: orderID,
        points: points,
        sponsorName: this.state.orgName,
    };
    console.log(payload)
    fetch('/cancel-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(response => {
    if( response.status === 200 ) {
        payload = {
            add: true,
            value: points,
            driver: -1,
            sponsor: this.state.org,
            comment: `Order Refund for order #${orderID}`,
        };
        fetch('/point-assignment', {
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
            this.getOrders()
    }
    })
    .catch((error) => {
        console.error('Error', error);
    });
}

  render() {
    if (this.state.isDriver){
      return (
        <Layout userType={0}>
            <div className='PurchaseHistory-Orders'>
                <label htmlFor='SelectSponsor'>View Orders From:</label>
                <select className='PurchaseHistory-Select' id='SelectSponsor' onChange={this.changeOrg}>
                    {this.state.orgs.map((org, i) => {return(
                      <option value={org.sponsorID} key={i}>{org.orgName}</option>
                    )})}
                </select>
                {this.state.orders.map((order, i) => {return(
                    <div key = {i} className='PurchaseHistory-OrderWrapper'>
                        {this.state.org === order.sponsorID && <div key = {i} className='PurchaseHistory-Order'>
                            <div>
                                <p>Order Confirmation #{order.orderID}</p>
                                <p>Placed on: {order.date}</p>
                                <p>Total: {order.total} points</p>
                                <p>Status: {this.getStatus(order.date, order.status)}</p>
                            </div>
                            {this.getStatus(order.date, order.status) === "Canceled" ? <p>Canceled</p> : this.getStatus(order.date, order.status) === "Delivered" ? <p>Delivered</p> : <button className='PurchaseHistory-Button' onClick={() => this.cancelOrder(order.orderID, order.total)}>Cancel Order</button>}
                            <div>
                                {order.items.map((item, i) => {return(
                                    <div key={i} className='PurchaseHistory-Item'>
                                        <div className='PurchaseHistory-ItemInfo'>
                                            <p>Item: {item.name}</p>
                                        </div>
                                        <div className='PurchaseHistory-ItemInfo'>
                                            <p>Price: {item.price} points</p>
                                        </div>
                                        <div className='PurchaseHistory-ItemInfo'>
                                            <p>Quantity: {item.quantity}</p>
                                        </div> 
                                    </div>  
                                )})}
                            </div>
                        </div>}
                    </div>
                )})}
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

export default PurchaseHistory;
