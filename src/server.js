const {debugmode, serverport} = require('./var/variable');
var cors = require('cors');
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = serverport;
const fs = require('fs');

const uri = "mongodb+srv://ivanbh0901:51140901@cluster0.azvth.mongodb.net/comp3322?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  if (debugmode && err){
    console.log(err);
  }
  const collection = client.db("comp3322").collection("music");
  // perform actions on the collection object
  client.close();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static('./static'));

app.listen(port, () => console.log(`Listening on port ${port}`));

app.post('/images', async (req, res) => {
  client.connect(async err => {
    if (debugmode && err){
      console.log(err);
    }
    const collection = await client.db("comp3322").collection("music").find({}).toArray();
    //if not find uid
    if (!collection){
      res.end("Error");
    }else {
      res.send(collection);
    }
    client.close();
  });
});

app.post('/login', async (req, res) => {
  client.connect(async err => {
    if (debugmode && err){
      console.log(err);
    }
    const collection = await client.db("comp3322").collection("login").find({}).toArray();
    let obj = collection.find(o => o.UserId === req.body.email);
    if (debugmode){
      console.log(collection);
      console.log(obj);
    }
    //if not find uid
    if (!obj){
      res.end("Account not found");
    }else {
      if (debugmode){
        console.log("uid "+obj.UserId+" found, checking pw");
      }
      if (obj.PW === req.body.pw){
        if (debugmode){
          console.log("same password, logging in");
          res.end("Account found");
        }
      }else{
        if (debugmode){
          console.log("incorrect password, try again");
          res.end("Incorrect PW");
        }
      }

    }
    client.close();
  });
});

app.post('/createac', async (req, res) => {
  client.connect(async err => {
    if (debugmode && err){
      console.log(err);
    }
    const collection = await client.db("comp3322").collection("login").find({}).toArray();
    let obj = collection.find(o => o.UserId === req.body.email);
    if (debugmode){
      console.log(collection);
      console.log(obj);
    }
    //if not find uid create new one
    if (!obj){
      var newID = require('mongodb').ObjectID;
      var newuser = {
        _id: new newID(),
        UserId: req.body.email,
        PW: req.body.pw
      }
      await client.db("comp3322").collection("login").insertOne(newuser);
      res.end("Account created");
    }else {
      if (debugmode){
        console.log("uid "+obj.UserId+" found");
      }
      res.end("Account found");
    }
    client.close();
  });
});

app.post('/getdata', async (req, res) => {
  client.connect(async err => {
    if (debugmode && err){
      console.log(err);
    }
    const collection = await client.db("comp3322").collection("cart").find({}).toArray();
    let obj = collection.find(o => o.userid === req.body.userid);
    if (debugmode){
      console.log(collection);
      console.log(obj);
    }
    //if not find
    if (!obj){
      res.end("NO CART");
      client.close();
    }else {
      await client.db("comp3322").collection("cart").findOne({userid: req.body.userid}, function(err, result){
        if (err) throw err;
        var cartdata = result.cartdata;
        var cartcount = result.cartcount;
        var r = {cartdata, cartcount};
        res.json(r);
        client.close();
      })
    }
  });
});

app.post('/savedata', async (req, res) => {
  client.connect(async err => {
    if (debugmode && err){
      console.log(err);
    }
    var userid = req.body.userid;
    var cartdata = req.body.cartdata;
    var cartcount = req.body.cartcount;
    const collection = await client.db("comp3322").collection("cart").find({}).toArray();
    let obj = collection.find(o => o.userid === userid);
    //if find replace content
    if (obj){
      var query = {userid: userid};
      var newdata = {$set:
        {
          cartdata: cartdata,
          cartcount: cartcount
        }
      }
      await client.db("comp3322").collection("cart").updateOne(query, newdata);
      res.end("OK");
    }else if (!obj){
      var newID = require('mongodb').ObjectID;
      var newuser = {
        _id: new newID(),
        userid: userid,
        cartdata: cartdata,
        cartcount: cartcount
      }
      await client.db("comp3322").collection("cart").insertOne(newuser);
      res.end("OK");
    }
    client.close();
  });
});

