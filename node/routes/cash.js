
var orders = require('./orders'), sendfax = require('./sendfax'), logger = require('../log'), mailer = require('../mailreceipt');

exports.recordOrder = function(req, res) {
  orders.addOrder(req, res);
  logger.info('order saved');
  mailer.sendEmail(req.body.email, '***UNPAID***');
  sendfax.sendFax(null, {'orderId': '', 'email':req.body.email, 'creditCard': '***PENDING***', 'cardCount': req.body.items.length, 'totalAmount': req.body.amount, 'name': req.body.name, 'orders':req.body.items})
 
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(JSON.stringify(req.body));
}
