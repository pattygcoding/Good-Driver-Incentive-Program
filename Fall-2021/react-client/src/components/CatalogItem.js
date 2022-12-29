import React, {Component} from 'react';
import { BsArrowRightSquare, BsArrowLeftSquare} from 'react-icons/bs'
import './CatalogItem.css'

class CatalogItem extends Component{  
    state = {
        loading: true,
        name: '',
        // quantity: 0,
        // price: 0,
        description: '',
        // url: '',
        images: [],
        currentimg: 0,
        listingId: 0,
        msg: ""
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.item.listingId !== this.state.listingId){
            this.getListing(nextProps.item)
        }
        this.setState({currentimg: 0})
    }

    componentDidMount(){
        this.getListing(this.props.item);
    }

    getListing = (item) => {
        console.log(item.listingId)
        this.setState({listingId: item.listingId})
        let name = item.name
        let cutoff = 30;
        if(name.length>cutoff){
            for(cutoff; name.charAt(cutoff)!==' ' && name.charAt(cutoff)!=='\n' && cutoff!==name.length; cutoff++);
            if(cutoff!==name.length){
                name = name.substring(0,cutoff)+'...';
            }
        }
        let description = item.description
        cutoff = 150;
        if(description.length>cutoff){
            for(cutoff; description.charAt(cutoff)!==' ' && description.charAt(cutoff)!=='\n' && cutoff!==description.length; cutoff++);
            if(cutoff!==description.length){
                description = description.substring(0,cutoff)+'...';
            }
        }
        this.setState({
            name: name,
            description: description,
        })
        fetch(`/getListingImages?` + new URLSearchParams({
            listingId: item.listingId,
          }))
        .then(response => response.json())
        .then(response => {
          this.setState({
            images: response.images,
            loading: false
          })
        })
        .catch(err => console.error(err))
        this.setState({msg: ""});
    }

    nextImage = () => {
        this.setState({
            currentimg: this.state.currentimg === this.state.images.length -1 ? 0 : this.state.currentimg + 1
        })
    }
    
    prevImage = () => {
        this.setState({
            currentimg: this.state.currentimg === 0 ? this.state.images.length - 1 : this.state.currentimg - 1
        })
    }

    onClick = () => {
        this.props.buttonClick(this.props.item.listingId, this.props.item.quantity, this.state.name, this.props.item.price*this.props.ppd);
        this.setState({msg: "Item Added to Cart"});
    }

    render() {
        let buttonText = ""
        if(this.props.type === 0){
            buttonText = "Add to Cart"
        }else if(this.props.type === 1){
            buttonText = "Remove Item"
        }else if(this.props.type === 2){
            buttonText = "Add Item"
        }
        return (
            <div style={this.props.type === 2 ? {"width": '80%'} : {"width": '35%'}} className='CatalogItem-Body'>
                <div className='CatalogItem-Text'>
                  <a href={this.props.item.url} target='_blank' rel="noopener noreferrer"><h1 className='CatalogItem-Name'>{this.state.name}</h1></a>
                  <div className='CatalogItem-Info'>
                    <p>Points: {parseInt(this.props.item.price*this.props.ppd)}</p>
                    {this.props.item.quantity < 10 ? this.props.item.quantity===0 ? <p style={{color: 'red'}}>Out of stock!</p>  : <p style={{color: 'red'}}>Only {this.props.item.quantity} in stock!</p> : <p>{this.props.item.quantity} in stock</p>}
                  </div>
                  <p>{this.state.description}</p>
                  {(this.props.item.quantity>0 && this.props.type === 0) && <p className='Msg'>{this.state.msg}</p>}
                  <button className='CatalogItem-Button' onClick={this.onClick}>{buttonText}</button>
                </div> 
                <div className='CatalogItem-ImgSide'>
                    <div className='CatalogItem-ImgContainer'>
                        {!this.state.loading && <img className='CatalogItem-Img' src={this.state.images[this.state.currentimg]} alt="Catalog Item"></img>}
                    </div>
                    <div>
                        <BsArrowLeftSquare className='CatalogItem-Arrow' onClick={() => this.prevImage()}></BsArrowLeftSquare>
                        <BsArrowRightSquare className='CatalogItem-Arrow' onClick={() => this.nextImage()}></BsArrowRightSquare>
                    </div>
                </div>
            </div>
        );
    }
  }

export default CatalogItem
