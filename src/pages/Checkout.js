import '../css/App.css';
import {debugmode} from '../var/variable.js';
import {useNavigate } from "react-router-dom";
import React, { Component } from 'react';
var axios = require("axios");

const WrappedCheckout = props => {
  const navigate = useNavigate()
  return <Checkout navigate={navigate}/>
}

class Checkout extends Component {
  constructor(props) {
    super(props);
    this.islogined = this.islogined.bind(this);
    this.itemlist = this.itemlist.bind(this);
    this.confirmHandler = this.confirmHandler.bind(this);
    this.okHandler = this.okHandler.bind(this);
    this.haveac = this.haveac.bind(this);
    this.tocart = this.tocart.bind(this);
    this.state = {loaded: false, price: 0, invoicedata: [], imagedata: [], cartdata: [], pricelist: [], invoice: false};		
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

  okHandler(event){
    event.preventDefault();
    if (window.innerWidth < 1200) {
      document.getElementById("sidenav").style.display = "none";
      document.getElementById("sidenavbutton").style.display = "inherit";
      document.getElementById("sidenav").style.width = "100%";
      document.getElementById("sidenav").style.marginTop = "16vh";
      document.getElementById("sidenav").style.backgroundColor = "white";
    } else {
      document.getElementById("sidenav").style.display = "inherit";
      document.getElementById("sidenavbutton").style.display = "none";
      document.getElementById("sidenav").style.width = "12vw";
      document.getElementById("sidenav").style.backgroundColor = "transparent";
    }
    this.props.navigate("/home");
  }

  confirmHandler(event){
    event.preventDefault();
    var fullname = document.getElementById("fullname").value;
    var companyname = document.getElementById("companyname").value;
    var address1 = document.getElementById("address1").value;
    var address2 = document.getElementById("address2").value;
    var city = document.getElementById("city").value;
    var region = document.getElementById("region").value;
    var country = document.getElementById("country").value;
    var postcode = document.getElementById("postcode").value;
    if (document.getElementById("username") !== null){
      var username = document.getElementById("username").value;
    }
    if (document.getElementById("password") !== null){
      var password = document.getElementById("password").value;
    }  
    if (!sessionStorage.getItem("loginid")){ //not login
      if (username !== "" && password !== ""){
        var config = {
          method: "post",
          url: "http://localhost:5000/login",
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            email: username,
            pw: password
          })
        };
        var that = this;
        axios(config)
            .then(async function(res) {
              let response = JSON.stringify(res.data)
              if (debugmode){
                console.log(response);
              }
              if (response === '"Account found"' || response === '"Incorrect PW"'){
                document.getElementById("usernamewarn").style.display = "inherit";
              }else{
                document.getElementById("usernamewarn").style.display = "none";
                if (fullname === ""){
                  alert("Please fillin your full name");
                  return
                }
                if (address1 === ""){
                  alert("Please fillin your address");
                  return
                }
                if (city === ""){
                  alert("Please fillin your city");
                  return
                }
                if (country === ""){
                  alert("Please fillin your country");
                  return
                }
                if (postcode === ""){
                  alert("Please fillin your postcode");
                  return
                }
                var tempcart = sessionStorage.getItem("cartdata").split(",");
                var tempcount = sessionStorage.getItem("cartdata").split(",");
                sessionStorage.setItem("cartdata", [0,0,0,0,0,0,0,0,0,0,0,0]);
                sessionStorage.setItem("cartcount", 0);
                sessionStorage.setItem("category", "");
                that.state.cartdata = tempcart;
                that.state.invoicedata[0] = fullname;
                that.state.invoicedata[1] = companyname;
                that.state.invoicedata[2] = address1;
                that.state.invoicedata[3] = address2;
                that.state.invoicedata[4] = city;
                that.state.invoicedata[5] = region;
                that.state.invoicedata[6] = country;
                that.state.invoicedata[7] = postcode;
                that.state.invoicedata[8] = username;
                that.state.invoicedata[9] = password;
                that.state.invoice = true;
                that.props.navigate("/checkout");

                //create new ac
                var config = {
                  method: "post",
                  url: "http://localhost:5000/createac",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  data: JSON.stringify({
                    email: username,
                    pw: password
                  })
                };
                axios(config)
                    .then(async function(res) {
                      let response = JSON.stringify(res.data)
                      if (debugmode){
                        console.log(response);
                      }
                    })
                    .catch(function(err) {
                        console.log(err);
                    });

                //new user should not need update cartdata as checked out
                that.forceUpdate();
              }
            })
            .catch(function(err) {
                console.log(err);
            });
      }else if (username === ""){
        alert("Please enter username");
      }else if (password === ""){
        alert("Please enter password");
      }
    }else{ //if logined
      var that = this;
      if (fullname === ""){
        alert("Please fillin your full name");
        return
      }
      if (address1 === ""){
        alert("Please fillin your address");
        return
      }
      if (city === ""){
        alert("Please fillin your city");
        return
      }
      if (country === ""){
        alert("Please fillin your country");
        return
      }
      if (postcode === ""){
        alert("Please fillin your postcode");
        return
      }
      var tempcart = sessionStorage.getItem("cartdata").split(",");
      sessionStorage.setItem("cartdata", [0,0,0,0,0,0,0,0,0,0,0,0]);
      sessionStorage.setItem("cartcount", 0);
      sessionStorage.setItem("category", "");
      that.state.cartdata = tempcart;
      that.state.invoicedata[0] = fullname;
      that.state.invoicedata[1] = companyname;
      that.state.invoicedata[2] = address1;
      that.state.invoicedata[3] = address2;
      that.state.invoicedata[4] = city;
      that.state.invoicedata[5] = region;
      that.state.invoicedata[6] = country;
      that.state.invoicedata[7] = postcode;
      that.state.invoice = true;
      //update cart data
      var config = {
        method: "post",
        url: "http://localhost:5000/savedata",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          userid: sessionStorage.getItem("loginid"),
          cartdata: sessionStorage.getItem("cartdata"),
          cartcount: sessionStorage.getItem("cartcount")
        })
      };
      axios(config)
          .then(async function(res) {
            let response = JSON.stringify(res.data)
            if (debugmode){
              console.log(response);
            }
            if (response === '"OK"'){
              that.props.navigate("/checkout");
              that.forceUpdate();
            }else{
              alert("failed to update cartdata, please try to logout and login again");
              that.forceUpdate();
            }
          })
          .catch(function(err) {
              console.log(err);
          });
    }
  }

  itemlist(){
    if (!sessionStorage.getItem("loginid") && sessionStorage.getItem("loginid") === 0){
      this.props.navigate("/");
      return [];
    }
    this.state.price = 0;
    var returnlist = [];
    console.log(this.state.cartdata);
    for (var i = 0; i < this.state.cartdata.length; i++){
      console.log(this.state.cartdata[i])
      if (this.state.cartdata[i] > 0){
        console.log(i+"th item not 0");
        var currentprice = this.state.cartdata[i] * this.state.pricelist[i];
        returnlist.push(
          <div>
              <div>{this.state.cartdata[i]} x {this.state.imagedata[i].MusicName} HK${currentprice}</div>
          </div>
        );
        this.state.price = this.state.price + currentprice;
      }
    }
    return returnlist;    
  }

  haveac(event){
    event.preventDefault();
    this.props.navigate("/");
  }

  tocart(event){
    event.preventDefault();
    this.props.navigate("/cart");
  }

  islogined(){
    if (!sessionStorage.getItem("loginid")){
     return(
       <div>
         <div className="newcustomer">
            <div className="title">New customer? (<a href="/checkout" onClick={this.haveac}>I have an account!</a>)</div>
            <div>OR register NOW!</div><br/>
            <div>Username:</div>
            <input id="username" type="text" placeholder="Required" required></input>
            <div id="usernamewarn">Username Duplicated</div>
            <div>Password:</div>
            <input id="password" type="password" placeholder="Required" required></input>
         </div>
         <div className="addressinfo">
            <div id="checkouttitle">Delivery Address:</div>
            <div>Full Name:</div>
            <input id="fullname" type="text" placeholder="Required" required></input>
            <div>Company Name:</div>
            <input id="companyname" type="text"></input>
            <div>Address Line 1:</div>
            <input id="address1" type="text" placeholder="Required" required></input>
            <div>Address Line 2</div>
            <input id="address2" type="text"></input>
            <div>City:</div>
            <input id="city" type="text" placeholder="Required" required></input>
            <div>Region/State/District</div>
            <input id="region" type="text"></input>
            <div>Country:</div>
            <input id="country" type="text" placeholder="Required" required></input>
            <div>Postcode/Zip Code:</div>
            <input id="postcode" type="text" placeholder="Required" required></input>
          </div>
                   
         <div className="orderinfo">
            <div className="title" id="ordertitle">Your Order: (<a href="/checkout" onClick={this.tocart}>Change</a>)</div>
            <div><b>Free Standard Shipping</b></div>
            {this.itemlist()}
            <div><b>Total Price: HK${this.state.price}</b></div>
            <button id="confirmbutton" onClick={this.confirmHandler} >✔️Confirm</button>
          </div>
       </div>
     ) 
    }else{
      return(
        <div className="checkout"> 
          <div className="addressinfo">
            <div id="checkouttitle">Delivery Address:</div>
            <div>Full Name:</div>
            <input id="fullname" type="text" placeholder="Required" required></input>
            <div>Company Name:</div>
            <input id="companyname" type="text"></input>
            <div>Address Line 1:</div>
            <input id="address1" type="text" placeholder="Required" required></input>
            <div>Address Line 2</div>
            <input id="address2" type="text"></input>
            <div>City:</div>
            <input id="city" type="text" placeholder="Required" required></input>
            <div>Region/State/District</div>
            <input id="region" type="text"></input>
            <div>Country:</div>
            <input id="country" type="text" placeholder="Required" required></input>
            <div>Postcode/Zip Code:</div>
            <input id="postcode" type="text" placeholder="Required" required></input>
          </div>
          <div className="orderinfo">
            <div className="title" id="ordertitle">Your Order: (<a href="/checkout" onClick={this.tocart}>Change</a>)</div>
            <div><b>Free Standard Shipping</b></div>
            {this.itemlist()}
            <div><b>Total Price: HK${this.state.price}</b></div>
            <button id="confirmbutton" onClick={this.confirmHandler} >✔️Confirm</button>
          </div>

       </div>
      )
    }
  }

  render (){
    if (this.state.invoice){
      var returnlist = [];
      returnlist.push(<div id="invoicefullname">Full Name: {this.state.invoicedata[0]}</div>);
      if (this.state.invoicedata[1] !== ""){
        returnlist.push(<div id="invoicecompany">Company: {this.state.invoicedata[1]}</div>);
      }
      returnlist.push(<div id="invoiceaddress1">Address Line 1: {this.state.invoicedata[2]}</div>);
      if (this.state.invoicedata[3] !== ""){
        returnlist.push(<div id="invoiceaddress2">Address Line 2: {this.state.invoicedata[3]}</div>);
      }
      returnlist.push(<div id="invoicecity">City: {this.state.invoicedata[4]}</div>);
      if (this.state.invoicedata[5] !== ""){
        returnlist.push(<div id="invoiceregion">Region: {this.state.invoicedata[5]}</div>);
      }
      returnlist.push(<div id="invoicecountry">Country: {this.state.invoicedata[6]}</div>);
      returnlist.push(<div id="invoicepostcode">Postcode: {this.state.invoicedata[7]}</div>);
      return(
        <div className="Cart">
          <div className="invoiceinfo">
            <div className="title">Invoice Page</div>
            {returnlist}
          </div><br/>
          <div className="orderinfo">
            {this.itemlist()}
            <div><b>Total Price: HK${this.state.price}</b></div><br/>
            <div>Thanks for ordering! Your music will be delivered within 7 working days.</div>
            <button id="okbutton" onClick={this.okHandler} >✔️OK</button>
          </div>
        </div>
      )
    }
    if (!this.state.loaded) return (<h1 className="App">Data loading...</h1>);
    this.state.cartdata = sessionStorage.getItem("cartdata").split(",");
    return(
      <div className="Cart">
        {this.islogined()}
      </div>
    )
  }
}

export default WrappedCheckout;