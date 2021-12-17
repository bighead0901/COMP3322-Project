import '../css/App.css';
import {debugmode} from '../var/variable.js';
import {sleep} from '../var/function.js';
import {useNavigate } from "react-router-dom";
import React, { Component } from 'react';
var axios = require("axios");

const WrappedCreate = props => {
  const navigate = useNavigate()
  return <Create navigate={navigate} />
}

class Create extends Component {
  constructor(props) {
    super(props);
    this.confirmHandler = this.confirmHandler.bind(this);
    this.state = {pw: '', email: ''};		
  }

  confirmHandler = (event) => {
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
      url: "http://localhost:5000/createac",
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
            document.getElementById("acfound").style.display = "inherit";
          }else if (response === '"Account created"'){
            document.getElementById("accreated").style.display = "inherit";
            await sleep(3000);
            that.props.navigate("/");
          }
        })
        .catch(function(err) {
            console.log(err);
        });
  }

  backHandler = (event) => {
    event.preventDefault();
    this.props.navigate("/");
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
        <h1>E-Store - Create Account</h1>
        <div className="input-group">
          <p className="question">Username: </p>
          <input className="smallbox" onChange={this.emailHandler} type="email" name="email" rows="1" cols="30" maxLength="64" placeholder="Desired Username" required/>
        </div>
        <div className="input-group">
          <p className="question">Password: </p>
          <input type="password" className="smallbox" onChange={this.pwHandler} name="pw_" rows="1" cols="30" maxLength="64" placeholder="Desired Password" required/>
        </div>	
        <h1 id="accreated">Account created! Welcome!</h1>
        <h1 id="acfound">Account already existed</h1>	
        <div className="btn-block-main">
          <button onClick={this.confirmHandler} id="submit" className="button" >CONFIRM</button>
          <button onClick={this.backHandler} id="create" className="button" >BACK</button>
        </div>
      </div>
    )
  }
}

export default WrappedCreate;