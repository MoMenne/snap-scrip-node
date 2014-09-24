var privateKey, fs = require('fs'), path = require('path');
fs.readFile(path.join(__dirname + '/../../stripe.key'),'utf8', function(err, data) {
  if (err) { logger.error(JSON.stringify(err)); }
  logger.info('stripe key');
  privateKey = data;
});

var stripe = require('stripe')('sk_test_vN8woKr8lcugU3LfYsuFWR7Q'),
    orders = require('./orders'),
    sendfax = require('./sendfax'),
    logger = require('../log'),
    mailer = require('../mailreceipt');


exports.chargeCard = function(req, res) {
  var stripeToken = req.body.id;
  orders.addOrder(req, res);

  var charge = stripe.charges.create({
     amount: req.body.order.totalCharge,
     currency: "usd",
     card: stripeToken
   }, function(err, charge) {
      if (err) {
        logger.error('ERROR charging card with id ' + JSON.stringify(err));
        res.writeHead(500);
        res.end("Error Processing Credit Card");
      }
      logger.info("Charge was a success for " + charge.id + " " +req.body.card.name);
      orders.addCharge(charge);
      mailer.sendEmail(req.body.email, charge.id);
      sendfax.sendFax(null, {'orderId':charge.id, 'email':req.body.email, 'creditCard':charge.card.last4,
        'cardCount': req.body.order.items.length, 'totalAmount': charge.amount/100, 'cardAmount':req.body.order.totalCharge/100,
        'orders':req.body.order.items, 'name':req.body.card.name})
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(200)
      res.end(JSON.stringify(charge));
  });
};
