import React, {Component} from 'react';
import Layout from '../components/Layout';
import './CatalogPurchase.css'

class CatalogPurchase extends Component{
  state = {
    loading: true,
    isDriver: false
  }
  
  componentDidMount() {
    this.isDriver();
  }

  isDriver = () => {
    fetch('/isDriver')
    .then(response => response.json())
    .then(response => this.setState({loading: false, isDriver: response.is_driver}))
    .catch(err => console.error(err))
  }

  render() {
    if (this.state.isDriver){
      return (
        <Layout userType={0}>
            <h1 align='center'><br/><br/>Thank you For Your Order!<br/></h1>
            <p align='center'>We will be sending a shipping confirmation email when the item has shipped successfully.<br/></p>  
            <div className='OrderConfirm'>         
              <div className='OrderConfirmNum'>
                <h3>Order Confirmation #</h3>
              </div>
              <div className='PriceAddons'>
                <p>Purchased Item(s)</p>
                <p>Shipping</p>
                <p>Sales Tax</p>
                <p>Discount</p>
                <hr/>
                <h3>Total</h3>
              </div>
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

export default CatalogPurchase;
