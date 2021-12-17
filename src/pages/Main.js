import '../css/App.css';
import {debugmode} from '../var/variable.js';
import {useNavigate } from "react-router-dom";
import React, { Component } from 'react';
import { sleep } from '../var/function';
var axios = require("axios");

const WrappedMain = props => {
  const navigate = useNavigate()
  return <Main ismobile={props.ismobile} navigate={navigate}/>
}

class Main extends Component {
  constructor(props) {
    super(props);
    this.deschandler = this.deschandler.bind(this);
    this.cartHandler = this.cartHandler.bind(this);
    this.inputHandler = this.inputHandler.bind(this);
    this.filter = this.filter.bind(this);
    this.title = this.title.bind(this);
    this.clearcategory = this.clearcategory.bind(this);
    this.state = {checkdesc: false, firstload: true, error: false, itemcount: 1, search: "", currenttitle: "Home", temptitle: "", img: "", imagedata: "", newarrival: [], loaded: false, currentdesc: 0, cartitem: []};		
  };

  componentDidMount () {
      var that = this;
      axios.post('http://localhost:5000/images', {})
      .then(function (response) {
        that.state.imagedata = response.data;
        console.log(that.state.imagedata);
        that.state.loaded = true;
        for (var i = 0; i < that.state.imagedata.length; i++){
          if (that.state.imagedata[i]['New Arrival'] === "Yes"){
            that.state.newarrival[i] = "NEW ARRIVAL!"
            console.log(that.state.newarrival[i], i);
          }else {that.state.newarrival[i] = ""}
        }
        that.forceUpdate();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  componentDidUpdate(){
    var that = this;
    var category = sessionStorage.getItem("category");
    if (category !== ""){
      that.state.temptitle = category;
    }
    var search = sessionStorage.getItem("search");
    if (debugmode){
      console.log(search);
      console.log(category);
    }
    if (search !== null){
      that.filter(search, category);
      
    }else{
      this.state.temptitle = "";
    }
  }

  inputHandler(event){
    event.preventDefault();
    this.state.itemcount = event.target.value;
  }

  cartHandler(event){
    event.preventDefault();
    sessionStorage.setItem("cartcount", (Number(this.state.itemcount) + Number(sessionStorage.getItem("cartcount"))));
    if (!sessionStorage.getItem("cartdata")){
      sessionStorage.setItem("cartdata", [0,0,0,0,0,0,0,0,0,0,0,0]);
    }
    var pastcart = sessionStorage.getItem("cartdata").split(",");
    if (debugmode){
      console.log(pastcart);
    }
    for (var i = 0; i<12; i++){
      this.state.cartitem[i] = Number(pastcart[i]);
      if (i === this.state.currentdesc){
        this.state.cartitem[i] = this.state.cartitem[i] + Number(this.state.itemcount);
      }
    }
    sessionStorage.setItem("cartdata", this.state.cartitem);
    if (this.props.ismobile){
      document.getElementById("sidenav").style.display = "none";
      
    }
    document.getElementById("sidenavbutton").style.display = "none";
    this.props.navigate("/cart");
  }

  deschandler(event){
    event.preventDefault();
    if (debugmode){
      console.log(this.state.imagedata);
      console.log(event.target.innerText);
    }
    var currentcount = -1;
    for (var i = 0; i < this.state.imagedata.length; i++){
      if (this.state.imagedata[i].MusicName === event.target.innerText){
        currentcount = i;
        this.state.temptitle = this.state.imagedata[i].MusicName;
        console.log(this.state.currentdesc);
      }
    }
    this.state.currentdesc = currentcount;
    var mp3 = document.getElementById("mp3");
    while (mp3.firstChild) {
      mp3.removeChild(mp3.firstChild);
    }
    var tempmp3 = document.createElement('div');
    var src = "http://localhost:5000/m"+(1+this.state.currentdesc)+".mp3";
    tempmp3.innerHTML = '<audio id="mp3" controls autoPlay><source src='+src+' type="audio/mpeg"></source>Your browser does not support the audio element.</audio>';
    document.getElementById("mp3").appendChild(tempmp3);
    document.getElementById("sidenav").style.display = "none";
    document.getElementById("contentdisplay").style.display = "none";
    this.state.checkdesc = true;
    this.forceUpdate();
  }

  clearcategory(event){
    if (event !== null){
      event.preventDefault();
    }
    this.state.temptitle = "";
    document.getElementById("desc").style.display = "none";
    document.getElementById("sidenav").style.display = "inherit";
    document.getElementById("contentdisplay").style.display = "inherit";
    for (var i = 0; i<this.state.imagedata.length; i++){
      var temp = i+1;
      document.getElementById("image"+temp).style.display = "grid";
    }
    this.state.checkdesc = false;
    if (this.props.ismobile){
      document.getElementById("sidenav").style.display = "none";
    }
    this.forceUpdate();
  }

  title() {
    if (this.state.temptitle !== ""){
      return (
        <div className="title"><a onClick={this.clearcategory} href="/home">Home</a> &gt; <a onClick={this.cancel} href="/home">{this.state.temptitle}</a></div>
      );
    }
    return (<div className="title"><a onClick={this.clearcategory} href="/home">{this.state.currenttitle}</a> &gt; <a onClick={this.cancel} href="/home">All Music</a></div>);
  }

  cancel(event){
    event.preventDefault();
  }

  filter(val1, val2){
    if (debugmode){
      console.log(val1);
      console.log(val2);
    }
    var diderror = false;
    if (val1 !== "" && val1 !== null){
      //reset arr
      for (var i = 0; i<this.state.imagedata.length; i++){
        try{
          var temp = i+1;
          document.getElementById("image"+temp).style.display = "none";
        }catch (err){
          console.log(err)
          diderror = true;
        }
      }
      var keywords = val1.split(" ")
      for (var i = 0; i<keywords.length; i++){
        console.log(keywords[i]);
        for (var j = 0; j<this.state.imagedata.length; j++){
          try{
            var temp = j+1;
            if (this.state.imagedata[j].MusicName.includes(keywords[i])){
              document.getElementById("image"+temp).style.display = "grid";
            } else if (this.state.imagedata[j].Composer.includes(keywords[i])){
              document.getElementById("image"+temp).style.display = "grid";
            }
          }catch (err){
            console.log(err)
            diderror = true;
          }
        }
      }
      this.state.temptitle = "Searching Results";
    }else if (val2 !== ""){
      for (var i = 0; i<this.state.imagedata.length; i++){
        try{
          var temp = i+1;
          document.getElementById("image"+temp).style.display = "grid";
          if (this.state.imagedata[i].Category !== val2){
            document.getElementById("image"+temp).style.display = "none";
          }
        }catch (err){
          console.log(err)
          diderror = true;
        }
      }
    }
    if (!diderror){
      sessionStorage.setItem("category", "");
      sessionStorage.removeItem("search");
      if (!this.state.firstload){
        document.getElementById("desc").style.display = "none"; 
      }
      if (this.state.checkdesc){
        document.getElementById("desc").style.display = "grid";
      }    
    }
             
  }

  render (){
    var that = this;
    if (!this.state.loaded) return (<h1 className="App">Data loading...</h1>);
    var category = sessionStorage.getItem("category");
    if (category !== ""){
      that.state.temptitle = category;
    }
    var search = sessionStorage.getItem("search");
    if (debugmode){
      console.log(search);
      console.log(category);
    }
    that.filter(search, category);
    this.state.firstload = false;
    return(
      <div className="Main">
        <div id="titlebar">
          {this.title()}
        </div>
        
        <div id="desc">
          <div onClick={this.deschandler} className="imagename">{this.state.imagedata[this.state.currentdesc].MusicName}</div><br/>
          <img src={"http://localhost:5000/img_"+(1+this.state.currentdesc)+".jpg"}></img>
          <div id="mp3">
          </div>
          <div >Composer: {this.state.imagedata[this.state.currentdesc].Composer}</div>
          <div >Published: {this.state.imagedata[this.state.currentdesc].Published}</div>
          <div >Category: {this.state.imagedata[this.state.currentdesc].Category}</div>
          <div >Description: {this.state.imagedata[this.state.currentdesc].Description}</div><br/>
          <div >Price: ${this.state.imagedata[this.state.currentdesc].Price}</div><br/>
          <input onChange={this.inputHandler} type="text" defaultValue="1"></input>
          <button onClick={this.cartHandler} >Add to Cart</button>
        </div>       

        <div id="contentdisplay">
          <div className="imgbox" id="image1">
            <a href="" onClick={this.deschandler} className="imagename">{this.state.imagedata[0].MusicName}</a>
            <img src={"http://localhost:5000/img_1.jpg"}></img>
            <div className="newarrival" id="new1">{this.state.newarrival[0]}</div>
            <div >Composer: {this.state.imagedata[0].Composer}</div>
            <div >Price: ${this.state.imagedata[0].Price}</div>
          </div>

          <div className="imgbox" id="image2">
            <a href="" onClick={this.deschandler} className="imagename">{this.state.imagedata[1].MusicName}</a>
            <img src={"http://localhost:5000/img_2.jpg"}></img>
            <div className="newarrival" id="new2">{this.state.newarrival[1]}</div>
            <div >Composer: {this.state.imagedata[1].Composer}</div>
            <div >Price: ${this.state.imagedata[1].Price}</div>
          </div>

          <div className="imgbox" id="image3">
            <a href="" onClick={this.deschandler} className="imagename">{this.state.imagedata[2].MusicName}</a>
            <img src={"http://localhost:5000/img_3.jpg"}></img>
            <div className="newarrival" id="new3">{this.state.newarrival[2]}</div>
            <div >Composer: {this.state.imagedata[2].Composer}</div>
            <div >Price: ${this.state.imagedata[2].Price}</div>
          </div>

          <div className="imgbox" id="image4">
            <a href="" onClick={this.deschandler} className="imagename">{this.state.imagedata[3].MusicName}</a>
            <img src={"http://localhost:5000/img_4.jpg"}></img>
            <div className="newarrival" id="new4">{this.state.newarrival[3]}</div>
            <div >Composer: {this.state.imagedata[3].Composer}</div>
            <div >Price: ${this.state.imagedata[3].Price}</div>
          </div>
          
          <div className="imgbox" id="image5">
            <a href="" onClick={this.deschandler} className="imagename">{this.state.imagedata[4].MusicName}</a>
            <img src={"http://localhost:5000/img_5.jpg"}></img>
            <div className="newarrival" id="new5">{this.state.newarrival[4]}</div>
            <div >Composer: {this.state.imagedata[4].Composer}</div>
            <div >Price: ${this.state.imagedata[4].Price}</div>
          </div>
          
          <div className="imgbox" id="image6">
            <a href="" onClick={this.deschandler} className="imagename">{this.state.imagedata[5].MusicName}</a>
            <img src={"http://localhost:5000/img_6.jpg"}></img>
            <div className="newarrival" id="new6">{this.state.newarrival[5]}</div>
            <div >Composer: {this.state.imagedata[5].Composer}</div>
            <div >Price: ${this.state.imagedata[5].Price}</div>
          </div>
          
          <div className="imgbox" id="image7">
            <a href="" onClick={this.deschandler} className="imagename">{this.state.imagedata[6].MusicName}</a>
            <img src={"http://localhost:5000/img_7.jpg"}></img>
            <div className="newarrival" id="new7">{this.state.newarrival[6]}</div>
            <div >Composer: {this.state.imagedata[6].Composer}</div>
            <div >Price: ${this.state.imagedata[6].Price}</div>
          </div>

          <div className="imgbox" id="image8">
            <a href="" onClick={this.deschandler} className="imagename">{this.state.imagedata[7].MusicName}</a>
            <img src={"http://localhost:5000/img_8.jpg"}></img>
            <div className="newarrival" id="new8">{this.state.newarrival[7]}</div>
            <div >Composer: {this.state.imagedata[7].Composer}</div>
            <div >Price: ${this.state.imagedata[7].Price}</div>
          </div>

          <div className="imgbox" id="image9">
            <a href="" onClick={this.deschandler} className="imagename">{this.state.imagedata[8].MusicName}</a>
            <img src={"http://localhost:5000/img_9.jpg"}></img>
            <div className="newarrival" id="new9">{this.state.newarrival[8]}</div>
            <div >Composer: {this.state.imagedata[8].Composer}</div>
            <div >Price: ${this.state.imagedata[8].Price}</div>
          </div>

          <div className="imgbox" id="image10">
            <a href="" onClick={this.deschandler} className="imagename">{this.state.imagedata[9].MusicName}</a>
            <img src={"http://localhost:5000/img_10.jpg"}></img>
            <div className="newarrival" id="new10">{this.state.newarrival[9]}</div>
            <div >Composer: {this.state.imagedata[9].Composer}</div>
            <div >Price: ${this.state.imagedata[9].Price}</div>
          </div>

          <div className="imgbox" id="image11">
            <a href="" onClick={this.deschandler} className="imagename">{this.state.imagedata[10].MusicName}</a>
            <img src={"http://localhost:5000/img_11.jpg"}></img>
            <div className="newarrival" id="new11">{this.state.newarrival[10]}</div>
            <div >Composer: {this.state.imagedata[10].Composer}</div>
            <div >Price: ${this.state.imagedata[10].Price}</div>
          </div>

          <div className="imgbox" id="image12">
            <a href="" onClick={this.deschandler} className="imagename">{this.state.imagedata[11].MusicName}</a>
            <img src={"http://localhost:5000/img_12.jpg"}></img>
            <div className="newarrival" id="new12">{this.state.newarrival[11]}</div>
            <div >Composer: {this.state.imagedata[11].Composer}</div>
            <div >Price: ${this.state.imagedata[11].Price}</div>
          </div>
        </div>        
      </div>

    )
  }
}

export default WrappedMain;