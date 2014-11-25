
var orders = require('./orders'), sendfax = require('./sendfax'), logger = require('../log'), mailer = require('../mailreceipt');

exports.recordOrder = function(req, res) {
  orders.addOrder(req, res);
  logger.info('order saved');
  mailer.sendEmail(req.body.email, 'Cash Order');
  sendfax.sendFax(null, {'orderId': '', 'email':req.body.email, 'cardCount': req.body.items.length, 'totalAmount': req.body.totalAmount, 'name': req.body.firstName + ' ' + req.body.lastName, 'orders':req.body.items}, true)
 
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(JSON.stringify(req.body));
}
