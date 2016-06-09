
var http = require('http');
var path = require('path');
var async = require('async');
var express = require('express');

var logger=console;

var router = express();
var server = http.createServer(router);

module.exports=Server;

function Server() {

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


    router.use((req,res,next) => {
      console.log('Request:');
      console.log(req.url);
      next();
    })
    server.listen(3000,"localhost",511);
    logger.log("server started");
    return this;
};
