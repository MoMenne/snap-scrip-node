var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    logger = require('../log');

app.listen(8003);

function handler (req, res) {
  res.writeHead(200);
}

var totalRaised = 0;

io.sockets.on('connection', function(socket) {
  logger.info('new connection!');
  socket.emit('totalCentsRaised', totalRaised);

  socket.on('disconnect', function() {
    logger.info("user disconnected");
  });

  socket.on('new purchase', function(purchaseAmount) {
    logger.info('socket update');
    totalRaised = totalRaised + purchaseAmount;
    socket.emit('totalCentsRaised', totalRaised);
  });

});