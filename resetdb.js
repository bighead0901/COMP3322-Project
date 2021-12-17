const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://ivanbh0901:51140901@cluster0.azvth.mongodb.net/comp3322?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  if (err){
    console.log(err);
  }
  client.db("comp3322").dropCollection("login", function(err, res){
    if (err) throw err;
    if (res){
      console.log("reseting login...")
      client.db("comp3322").createCollection("login", function(err, res){
        if (err) throw err;
        console.log("login reseted!");
        client.close();
      });
    }
  });
  client.db("comp3322").dropCollection("cart", function(err, res){
    if (err) throw err;
    if (res){
      console.log("reseting cart...")
      client.db("comp3322").createCollection("cart", function(err, res){
        if (err) throw err;
        console.log("cart reseted!");
        client.close();
      });
    }
  });
  //client.close();
});