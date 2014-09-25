
var express = require('express'),
    http = require('http'),
    server = http.createServer(express),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    childProcess = require('child_process'),
    sleep = require('sleep'),
    stripe = require('./routes/stripe'),
    cash = require('./routes/cash'),
    orders = require('./routes/orders'),
    logger = require('./log'),
    io = require('./routes/socketstuff');

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
app.post('/cashorders', function(req, res) {
 cash.recordOrder(req, res);
});

logger.info('starting up server');

app.listen(8020);
