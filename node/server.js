
var express = require('express'),
    http = require('http'),
    server = http.createServer(express),
    io = require('socket.io').listen(server),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    childProcess = require('child_process'),
    sleep = require('sleep'),
    stripe = require('./routes/stripe'),
    orders = require('./routes/orders');

var app = express();
app.use(bodyParser());

app.get('/hey', function(req, res) {
  console.log('say hey...')
  res.end('all done');
});

app.get('/orders', orders.findAll);
app.get('/orders/:id', orders.findById);
app.delete('/orders/:id', orders.deleteOrder);
app.post('/orders', function(req, res) {
 stripe.chargeCard(req, res);
});

app.listen(8020);
