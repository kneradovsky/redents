
var http = require('http');
var path = require('path');
var async = require('async');
var express = require('express');
var bodyParser = require('body-parser');

var logger=console;
var router = express();
var server = http.createServer(router);


module.exports=Server;

function Server() {
    var fruits = [{id:"1",name:"orange"},{id:"2",name:"mango"},{id:"3",name:"kiwi"},{id:"4",name:"lemon"},{id:"5",name:"apple"}];
    router.get(/^\/data\/(.+)$/,(req,res) => {
       var entity=req.params[0].toString();
       var query=req.query;
       var retval={id:1,...query};
       if(entity.endsWith('s'))
       	  retval = [{id:1,...query},{id:2,...query},{id:3,...query}];
	     var response = JSON.stringify(retval);
       res.send(response);
    });
    router.post(/^\/data\/(.+)$/,(req,res) => {
       var entity=req.params[0].toString();
	   var response = req.body;
       res.send(response);
    });

    router.delete(/^\/data\/(.+)$/,(req,res) => {
       var entity=req.params[0].toString();
	   var response = req.body;
       res.send(response);
    });

    router.post("/postUrl",(req,res) => {
        const retval = {customurl:true};
        res.send(JSON.stringify(retval))
    });

    router.all(/^\/error\/404(|\/.*)/, (req,res) => {
      res.status(404).send("Not found");
    });
    router.all(/^\/error\/400(|\/.*)/, (req,res) => {
      res.status(400).send("Bad request");
    });
    router.all(/^\/error\/500(|\/.*)/, (req,res) => {
      res.status(500).send("Server Error");
    });

    //handlers for the client demo
    router.get("/demo/fruits",(req,res)=> {
      res.send(JSON.stringify(fruits));
    })
    router.get("/demo/fruits/:name",(req,res)=> {
      const fres = fruits.filter(v=>v.name==req.params.name);
      if(fres.length==0) res.status(404).send(`Fruit named ${req.params.name} is not found`);
      else res.send(JSON.stringify(fres[0]));
    })
    router.delete("/demo/fruits/:id",(req,res)=> {
      const delres = fruits.filter(v=>v.id!=req.params.id);
      if(delres.length==fruits.length) res.status(404).send(`Fruit with id ${req.params.id} is not found`);
      else {
        fruits = delres;
        res.status(204).end("Deleted");
      }
    })
    router.post("/demo/fruits",bodyParser.json(),(req,res)=> {
      var newfruit = req.body;
      var found = false;
      for (var i = 0; i < fruits.length; i++) {
        if(fruits[i].id==newfruit.id) {
          fruits[i]=newfruit;
          found=true;
          break;
        }
      }
      if(!found) fruits.push(newfruit);
      res.status(200).send(newfruit).end();
    })
    router.post("/demo/fruits/:name",bodyParser.json(),(req,res)=> {
      var newfruit = req.body;
      var found = false;
      for (var i = 0; i < fruits.length; i++) {
        if(fruits[i].name==req.param.name) {
          fruits[i]=newfruit;
          found=true;
          break;
        }
      }
      if(!found) fruits.push(newfruit);
      res.status(200).send(newfruit).end();
    })



    router.use((req,res,next) => {
      console.log('Request:');
      console.log(req.url);
      res.setHeader('Access-Control-Allow-Origin', '*');
      next();
    })
    server.listen(3000);
    logger.log("server started");
    return this;
};

export default Server;
