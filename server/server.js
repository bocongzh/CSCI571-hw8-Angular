"use strict";

var express = require('express');
var path = require('path');
var request=require('request');
var http = require('http');
var bodyParser = require('body-parser');
var url = require('url');


var app=express();
var port = process.env.PORT || 8081;

app.use(express.static(__dirname + '/'));
app.get('/*',(req,res)=> res.sendFile(path.join(__dirname)));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    if(req.method=="OPTIONS") res.sendStatus(200);
    else  next();
});
 
app.get('/', function(req,res){
    res.end('hello world');
})

app.post('/search', function (req, res){
    var api = req.body.api;
    queryAPI(api,res);
})

app.post('/details', function (req,res){
    var api = req.body.api;
    queryAPI(api,res);
})

app.post('/photos', function (req,res){
    var api = req.body.api;
    queryAPI(api,res);
})


app.post('/similar', function (req,res){
    var api = req.body.api;
    request(api,function(err,response,body){
        var obj = JSON.parse(body);
        res.json(obj);
    })
})

app.get('/getDetails', function(req,res){
    var itemId = req.query.itemId;
    var api = 'http://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=BocongZh-hw6-PRD-216e2f149-25c874c3&siteid=0&version=967&itemID='+itemId+'&IncludeSelector=Description,Details,ItemSpecifics';
    queryAPI(api,res);
})

function queryAPI(url, res){
    request({url:url,method:'GET',headers:{'Content-Type':'text/json' }},function(error,response,body){
            if(!error && response.statusCode==200){
                //console.log(body);
                var obj = JSON.parse(body);
                res.json(obj);
            }
    });
}

var server = http.createServer(app);
server.listen(port, ()=>console.log('Listening port 8081...'))
