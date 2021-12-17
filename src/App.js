import React, {useEffect, useState, useReducer} from 'react';
import './css/App.css';
import {useNavigate, Routes, Route} from "react-router-dom";
import WrappedLogin from './pages/Login';
import WrappedCreate from './pages/Create';
import WrappedMain from './pages/Main';
import WrappedCart from './pages/Cart';
import WrappedCheckout from './pages/Checkout';
import {sleep} from './var/function.js';
import {debugmode} from './var/variable.js';
var axios = require("axios");

function App() {
  const loginstatus = useState();
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const navigate = useNavigate();
  var [cartcount, setcartcount] = useState(0);
  const [firstload, setfirstload]= useState(true);
  const [loginchecked, setloginchecked]= useState(false);
  const [sidenavopened, setsidenavopened]= useState(false);
  const [ismobile, setismobile] = useState(false);

  useEffect(() =>{
    if (sessionStorage.getItem("loginid")){
      document.getElementById("logoutbutton").style.display = "inherit";
      document.getElementById("signinbutton").style.display = "none";
      document.getElementById("registerbutton").style.display = "none";
      if (firstload){
        navigate("/home");
        setfirstload(false);
      }
    }else{
      if (!firstload && !loginchecked){
        logoutHandler(null);
        setloginchecked(true);
      }
    }
    if (sessionStorage.getItem("cartcount")){
      setcartcount(sessionStorage.getItem("cartcount"));
    }
    window.matchMedia("(min-width: 1201px, max-width: 10000px)").addEventListener('load', function(){
      document.getElementById("sidenav").style.fontSize = "25px";
      var tempdiv = document.getElementById("sidenav").getElementsByTagName("div");
      for (var i = 0; i<tempdiv.length; i++){
        tempdiv[i].style.fontSize = "19px"
      }
      var tempa = document.getElementById("sidenav").getElementsByTagName("a");
      for (var i = 0; i<tempa.length; i++){
        tempa[i].style.fontSize = "19px"
      }
    });
    window.matchMedia("(max-width: 1200px)").addEventListener('load', function(){
      document.getElementById("sidenav").style.display = "none";
      document.getElementById("sidenavbutton").style.display = "inherit";
    });
    window.matchMedia("(min-width: 500px)").addEventListener('load', function(){
      document.getElementById("signinbutton").style.fontSize = "10px";
      document.getElementById("registerbutton").style.fontSize = "10px";
      document.getElementById("logoutbutton").style.fontSize = "10px";
      document.getElementById("cartbutton").style.fontSize = "10px";
    });
    window.addEventListener("resize", mobileHandler);
    window.addEventListener("load", mobileHandler);
    document.getElementById("cartbutton").style.display = "flex";
  });
  function mobileHandler(){
    if (window.innerWidth < 1200) {
      setismobile(true)
      document.getElementById("sidenav").style.display = "none";
      document.getElementById("sidenavbutton").style.display = "inherit";
      document.getElementById("sidenav").style.width = "100%";
      document.getElementById("sidenav").style.marginTop = "16vh";
      document.getElementById("sidenav").style.backgroundColor = "white";
    } else {
      setismobile(false)
      document.getElementById("sidenav").style.display = "inherit";
      document.getElementById("sidenavbutton").style.display = "none";
      document.getElementById("sidenav").style.width = "12vw";
      document.getElementById("sidenav").style.backgroundColor = "transparent";
    }
  }
  function searchHandler(event){
    sessionStorage.setItem("search", document.getElementById("searchbarr").value);
    document.getElementById("sidenav").style.display = "inherit";
    navigate("/home");
    if (ismobile){
      document.getElementById("sidenav").style.display = "none";
      setsidenavopened(false);
      document.getElementById("sidenavbutton").style.display = "inherit";
    }
  }
  function signinHandler(event){
    event.preventDefault();
    document.getElementById("sidenav").style.display = "inherit";
    navigate("/");
    if (ismobile){
      document.getElementById("sidenav").style.display = "none";
      setsidenavopened(false);
      document.getElementById("sidenavbutton").style.display = "inherit";
    }
  }
  function registerHandler(event){
    event.preventDefault();
    document.getElementById("sidenav").style.display = "inherit";
    navigate("/register");
    if (ismobile){
      document.getElementById("sidenav").style.display = "none";
      setsidenavopened(false);
      document.getElementById("sidenavbutton").style.display = "inherit";
    }
  }
  async function logoutHandler(event){
    if (event !== null){
      event.preventDefault();
    }
    var that = this;
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
            //destroy item when success
            sessionStorage.removeItem('loginid');
            sessionStorage.removeItem('cartdata');
            sessionStorage.removeItem('cartcount');
            if (!sessionStorage.getItem("loginid")){
              document.getElementById("logoutbutton").style.display = "none";
              document.getElementById("signinbutton").style.display = "inherit";
              document.getElementById("registerbutton").style.display = "inherit";
            }
            setcartcount(0);
            forceUpdate();
            document.getElementById("logoutmsg").style.display = "inherit";
            sleep(3000).then(function(){
              navigate("/home");
              setcartcount(0);
              forceUpdate();
              document.getElementById("sidenav").style.display = "inherit";
              document.getElementById("logoutmsg").style.display = "none"; 
              if (ismobile){
                document.getElementById("sidenav").style.display = "none";
                setsidenavopened(false);
                document.getElementById("sidenavbutton").style.display = "inherit";
              }
            });
          }else{
            alert("failed to logout");
          }
        })
        .catch(function(err) {
            console.log(err);
        });
  }
  function logoutclose(event){
    document.getElementById("logoutmsg").style.display = "none";
  }
  function cartHandler(event){
    event.preventDefault();
    document.getElementById("sidenav").style.display = "none";
    document.getElementById("sidenavbutton").style.display = "none";
    navigate("/cart");
  }
  function categoryHandler(event){
    event.preventDefault();
    sessionStorage.setItem("category", event.target.innerText);
    navigate("/home");
    if (ismobile){
      document.getElementById("sidenav").style.display = "none";
      setsidenavopened(false);
      document.getElementById("sidenavbutton").style.display = "inherit";
    }
  }
  function sidenav(){
    if (sidenavopened){
      document.getElementById("sidenav").style.display = "none";
      setsidenavopened(false);
    }else{
      document.getElementById("sidenav").style.display = "inherit";
      setsidenavopened(true);
    } 
  }
  return (
    <div>
      <div className="topbar">
        <div className="searchbar">
          <input id="searchbarr" type="text" placeholder="Keyword(s)"></input>
          <button onClick={searchHandler} >🔍SEARCH</button>
        </div>
        <br/>
        <nav>
          <div id="sidenavbutton" onClick={sidenav}>≡</div>
          <button id="cartbutton" onClick={cartHandler} >🛒Cart <sup>{cartcount}</sup></button>
          <button id="logoutbutton" onClick={logoutHandler} >🔑Logout</button> 
          <button id="registerbutton" onClick={registerHandler} >✍🏻Register</button>
          <button id="signinbutton" onClick={signinHandler} >🔐Sign In</button>
        </nav>  
      </div>

      

      <div id="sidenav">
        <div>Category</div>
        <a href="home" onClick={categoryHandler}>Classical</a>
        <a href="home" onClick={categoryHandler}>Baroque</a>
        <a href="home" onClick={categoryHandler}>Romantic</a>
        <a href="home" onClick={categoryHandler}>Late 19th</a>
      </div>

      <div id="logoutmsg" className="modal">
        <div className="modal-content">
          <span onClick={logoutclose} className="close">&times;</span>
          <p>You have logged out, redirecting to main in 3 seconds...</p>
        </div>
      </div>

      <br/>
      <div>
        <Routes>
          <Route path="/" element={<WrappedLogin logined={loginstatus}/>} />
          <Route path="register" element={<WrappedCreate ismobile={ismobile}/>} />
          <Route path="home" element={<WrappedMain ismobile={ismobile}/>} />
          <Route path="cart" element={<WrappedCart ismobile={ismobile}/>} />
          <Route path="checkout" element={<WrappedCheckout ismobile={ismobile}/>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;