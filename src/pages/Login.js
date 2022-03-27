import '../css/App.css';
import {debugmode} from '../var/variable.js';
import {sleep} from '../var/function.js';
import {useNavigate } from "react-router-dom";
import React, { Component } from 'react';
var axios = require("axios");

const WrappedLogin = props => {
  const navigate = useNavigate()

  return <Login navigate={navigate} />
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.submitHandler = this.submitHandler.bind(this);
    this.state = {pw: '', email: ''};
    	
  };

  submitHandler = (event) => {
    event.preventDefault();
    if (this.state.email.length === 0 || this.state.pw.length === 0){
      alert("Please do not leave the fields empty");
      return;
    }

    if (debugmode){
      console.log(this.state.email);
      console.log(this.state.pw);
    }
    
    var config = {
      method: "post",
      url: "http://18.139.227.169:5000/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        email: this.state.email,
        pw: this.state.pw
      })
    };

    var that = this;
    axios(config)
        .then(async function(res) {
          let response = JSON.stringify(res.data)
          if (debugmode){
            console.log(response);
          }
          if (response === '"Account found"'){
            if (debugmode){
              console.log("Account found");
            }
            sessionStorage.setItem("loginid", that.state.email);
            //get cart data
            var config1 = {
              method: "post",
              url: "http://18.139.227.169:5000/getdata",
              headers: {
                "Content-Type": "application/json",
              },
              data: JSON.stringify({
                userid: sessionStorage.getItem("loginid"),
              })
            };
            axios(config1)
                .then(async function(res) {
                  let response = JSON.stringify(res.data)
                  console.log(response);
                  if (response === '"NO CART"'){
                    /*combine*/
                    if (!sessionStorage.getItem("cartdata")){
                      sessionStorage.setItem("cartdata", [0,0,0,0,0,0,0,0,0,0,0,0]);
                    }
                    if (!sessionStorage.getItem("cartcount")){
                      sessionStorage.setItem("cartcount", 0);
                    }
                    //not combine
                    //sessionStorage.setItem("cartdata", [0,0,0,0,0,0,0,0,0,0,0,0]);
                    //sessionStorage.setItem("cartcount", 0);
                    that.props.navigate("/home");           
                  }else{
                    if (debugmode){
                      console.log(res.data);
                    }
                    var cloudcartcount = 0;
                    var cloudcartdata = [0,0,0,0,0,0,0,0,0,0,0,0];
                    if (res.data.cartdata !== null){
                      var cloudcartdata = res.data.cartdata.split(",");
                    }
                    if (res.data.cartcount !== null){
                      var cloudcartcount = Number(res.data.cartcount);
                    }
  
                    //combine
                    if (sessionStorage.getItem("cartdata")){
                      if (sessionStorage.getItem("cartdata") != null){
                        var pastcart = sessionStorage.getItem("cartdata").split(",");
                      }
                    }else {
                      pastcart = [0,0,0,0,0,0,0,0,0,0,0,0];
                    }
                    if (debugmode){
                      console.log(typeof(pastcart));
                    }
                    for (var i=0; i<12; i++){
                      if (debugmode){
                        console.log(pastcart[i]);
                        console.log(cloudcartdata[i]);
                      }
                      cloudcartdata[i] = Number(cloudcartdata[i]) + Number(pastcart[i]);
                    }
                    if (sessionStorage.getItem("cartcount")){
                      if (sessionStorage.getItem("cartcount") != null){
                        cloudcartcount = Number(sessionStorage.getItem("cartcount")) + cloudcartcount;
                      }
                    }
                    sessionStorage.setItem("cartdata", cloudcartdata);
                    sessionStorage.setItem("cartcount", cloudcartcount);
                    that.props.navigate("/home");                 
                  }
                })
                .catch(function(err) {
                    console.log(err);
                });
          }else if (response === '"Account not found"'){
            if (debugmode){
              console.log("Account not found");
            }
            document.getElementById("acnotfound").style.display = "inherit";
            await sleep(3000);
            that.props.navigate("/register");
          }else if (response === '"Incorrect PW"'){
            if (debugmode){
              console.log("Incorrect PW");
            }
            document.getElementById("invalidlogin").style.display = "inherit";
          }
        })
        .catch(function(err) {
            console.log(err);
        });
  }

  createHandler = (event) => {
    event.preventDefault();
    this.props.navigate("/register");
  }

  pwHandler = (event) => {
    this.setState({pw: event.target.value});
    if (debugmode){
      console.log(this.state.pw);
    }
  }

  emailHandler = (event) => {
    this.setState({email: event.target.value});
    if (debugmode){
      console.log(this.state.email);
    }
  }

  render (){
    return(
      <div className="App">
        <h1>E-Store</h1>  
        <div className="input-group">
          <p className="question">Username: </p>
          <input className="smallbox" onChange={this.emailHandler} type="email" name="email" rows="1" cols="30" maxLength="64" placeholder="Username" required/>
        </div>
        <div className="input-group">
          <p className="question">Password: </p>
          <input type="password" className="smallbox" onChange={this.pwHandler} name="pw_" rows="1" cols="30" maxLength="64" placeholder="Password" required/>
        </div>
        <h1 id="invalidlogin">Invalid login, please login again.</h1>
        <h1 id="acnotfound">Username not found, redirecting to register page in 3 seconds...</h1>		
        <div className="btn-block-main">
          <button onClick={this.submitHandler} type="submit" id="submit" className="button" >SUBMIT</button>
          <button onClick={this.createHandler} id="create" className="button" >CREATE</button>
        </div>
      </div>
    )
  }
}

export default WrappedLogin;