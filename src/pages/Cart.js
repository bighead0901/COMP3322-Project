import '../css/App.css';
import {debugmode} from '../var/variable.js';
import {useNavigate } from "react-router-dom";
import React, { Component } from 'react';
var axios = require("axios");

const WrappedCart = props => {
  const navigate = useNavigate()
  return <Cart ismobile={props.ismobile} navigate={navigate}/>
}

class Cart extends Component {
  constructor(props) {
    super(props);
    this.backHandler = this.backHandler.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
    this.checkoutHandler = this.checkoutHandler.bind(this);
    this.itemlist = this.itemlist.bind(this);
    this.state = {currenttitle: "My Shopping Cart", pricelist: [], loaded: false, price: 0, cartdata: undefined, imagedata: undefined};		
  };

  componentDidMount () {
    var that = this;
    axios.post('http://localhost:5000/images', {})
    .then(function (response) {
      that.state.imagedata = response.data;
      console.log(that.state.imagedata);
      that.state.loaded = true;
      for (var i = 0; i < 12; i++){
        that.state.pricelist[i] = that.state.imagedata[i].Price;
      }
      that.forceUpdate();
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  inputHandler(event){
    event.preventDefault();
    this.state.itemcount = event.target.value;
  }

  backHandler(event){
    event.preventDefault(); 
    if (this.props.ismobile){
      document.getElementById("sidenavbutton").style.display = "inherit";
      document.getElementById("sidenav").style.display = "none";
    }else{
      document.getElementById("sidenav").style.display = "inherit";
      document.getElementById("sidenavbutton").style.display = "none";
    }
    this.props.navigate("/home");
  }

  checkoutHandler(event){
    event.preventDefault();
    if (debugmode){
      console.log(sessionStorage.getItem("cartcount"));
    }
    if (sessionStorage.getItem("cartcount") === "0" || !sessionStorage.getItem("cartcount")){
      alert("empty cart!");
    }else{
      this.props.navigate("/checkout");
    } 
  }

  deleteHandler(event){
    event.preventDefault();
    if (debugmode){
      console.log(event.target.value);
    }
    var cartcount = sessionStorage.getItem("cartcount");
    cartcount = Number(cartcount) - this.state.cartdata[event.target.value];
    sessionStorage.setItem("cartcount", cartcount);
    var pastcart = sessionStorage.getItem("cartdata").split(",");
    pastcart[event.target.value] = 0;
    sessionStorage.setItem("cartdata", pastcart);
    this.setState({loaded: true});
    this.props.navigate("/cart");
  }

  itemlist(){
    this.state.price = 0;
    var returnlist = [];
    if (!sessionStorage.getItem("cartdata")){
      sessionStorage.setItem("cartdata", [0,0,0,0,0,0,0,0,0,0,0,0]);
    }
    this.state.cartdata = sessionStorage.getItem("cartdata").split(",");
    console.log(this.state.cartdata);
    for (var i = 0; i < this.state.cartdata.length; i++){
      console.log(this.state.cartdata[i])
      if (this.state.cartdata[i] > 0){
        console.log(i+"th item not 0");
        returnlist.push(
          <div>
            <div className="itembox" id={i}>
              <div>Music Name: {this.state.imagedata[i].MusicName}</div>
              <div>Quantity: {this.state.cartdata[i]}</div>
              <button id="deletebutton" value={i} onClick={this.deleteHandler} >❌Delete</button>
            </div>
          </div>
        );
        this.state.price = this.state.price + this.state.cartdata[i] * this.state.pricelist[i];
      }
    }
    return returnlist;    
  }

  render (){
    if (!this.state.loaded) return (<h1 className="App">Data loading...</h1>);
    return(
      <div className="Cart">
        <div id="carttitle">{this.state.currenttitle}</div>     
        
        <div id="cartdisplay">
          {this.itemlist()}
        </div>

        <div id="pricedisplay">Total Price: ${this.state.price}</div>
        <div id="cartpagebutton">
          <button id="backbutton" onClick={this.backHandler} >🔐Back</button>
          <button id="checkoutbutton" onClick={this.checkoutHandler} >✍🏻CheckOut</button> 
        </div>      
      </div>

    )
  }
}

export default WrappedCart;