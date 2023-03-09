import React, {Component} from 'react';
import './ShoppingCart.css'

class ShoppingCart extends Component{
    state = {
        quantity: [],
        total: 0,
        error: "",
        isDriverView: false,
        isSponsorView: false
    }

    componentDidMount(){
        let newQuantity = this.state.quantity;
        this.props.cart.map((item) => {
            return newQuantity.push(1);
        })
        this.setState({quantity: newQuantity})
        this.getIsDriverView()
        this.getIsSponsorView()
        this.calculateTotal()
    }

    changeQuantity = i => (e) => {
        let quantity = this.state.quantity;
        quantity[i] = e.target.value;
        if(quantity[i]<0){
            quantity[i]=0
        }
        this.setState({quantity: quantity})
        this.calculateTotal();
    }

    getIsDriverView = () => {
        fetch('/isdriverview')
        .then(response => response.json())
        .then(response => {
          this.setState({
            isDriverView: response.is_driverview
          }, this.calculateTotal)
          console.log(response.is_driverview)
        })
        .catch(err => console.error(err))
    }

    getIsSponsorView = () => {
        fetch('/issponsorview')
        .then(response => response.json())
        .then(response => {
          this.setState({
            isSponsorView: response.is_sponsorview
          }, this.calculateTotal)
        })
        .catch(err => console.error(err))
    }

    calculateTotal = () => {
        console.log(this.state.isDriverView)
        let total = 0;
        this.props.cart.map((item, i) => {
            return total += item.price*this.state.quantity[i]
        })
        this.setState({total: total}, () =>{
            
        })
        if(this.state.isDriverView){
            this.setState({error: "Cannot Place Order In Driver View"})
        }else if(this.state.isSponsorView){
            this.setState({error: "Cannot Place Order In Sponsor View"})
        }else if(total > this.props.points){
            this.setState({error: "Total Exceeds Your Balance"})
        }else{
            this.setState({error: ""})
        }
    }

    completePurchse = () => {
        if(this.state.total === 0){
            this.props.exit(1);
        }
        else if(this.state.error === ""){
            var payload = {
                total: this.state.total,
                cart: this.props.cart,
                quantity: this.state.quantity,
                sponsor: this.props.sponsor,
                sponsorName: this.props.sponsorName,
                points: this.props.points,
                driver: this.props.driver ? this.props.driver : '-1'
            };
            console.log(payload)
            fetch('/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(response => {
            if( response.status === 200 ) {
                const today = new Date();
                const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                payload = {
                    add: false,
                    value: this.state.total,
                    driver: this.props.driver ? this.props.driver : -1,
                    sponsor: this.props.sponsor,
                    comment: `Purchase Made on ${date}`,
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
                this.props.exit(1);
            }
            })
            .catch((error) => {
            console.error('Error', error);
            });
        }
    }

    render() {
        return (
        <div className='ShoppingCart-Body'>
            <h1>Checkout</h1>
            <p className='ShoppingCart-Error'>{this.state.error}</p>
                <div className='ShoppingCart-List'>
                    <p className='ShoppingCart-ItemLabel'>Item(s)</p>
                    <div className='ShoppingCart-Item'>
                        <p>Item</p>
                        <p>Quantity</p>
                    </div>
                        {this.props.cart.map((item, i) => {return(
                            <div key={i} className='ShoppingCart-Item'>
                                <div>
                                    <p>{item.name}</p>
                                    <p>{item.price} points</p>
                                </div>
                                <input className='ShoppingCart-Quantity' type="number" min={0} max={item.maxQuantity} defaultValue={1} onChange={this.changeQuantity(i)}></input>
                            </div>
                        )})}
                    <h3>Total: {this.state.total} points</h3>
                </div>
            <div>
                <button className='ShoppingCart-Button' onClick={() => this.props.exit(0)}>Continue Shopping</button>
                <button className='ShoppingCart-Button' onClick={this.completePurchse}>Complete Purchase</button>
            </div>
            
        </div>
        );
    }
}

export default ShoppingCart;
