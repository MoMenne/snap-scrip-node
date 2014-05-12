var stripe = require('stripe')("sk_test_vN8woKr8lcugU3LfYsuFWR7Q"),
    orders = require('./orders'),
    sendfax = require('./sendfax');


exports.chargeCard = function(req, res) {
  var stripeToken = req.body.id;
  orders.addOrder(req, res);

  var charge = stripe.charges.create({
     amount: req.body.order.totalCharge,
     currency: "usd",
     card: stripeToken
   }, function(err, charge) {
      if (err) {
        console.log('ERROR charging card with id ' + req.body.id + '  user ' + req.card.name + ' address ' + req.card.address_city + ' -->Error Message:  ' + err.message);
        orders.addError(error, res);
        res.status(500).send('Credit Card declined');
      }
      orders.addCharge(charge, res);
      sendfax.sendFax(null, {'orderId':charge.id, 'email':req.body.email, 'creditCard':charge.card.last4,
        'cardCount': req.body.order.items.length, 'totalAmount': charge.amount/100, 'cardAmount':req.body.order.totalCharge/100,
        'orders':req.body.order.items, 'name':req.body.card.name})
      res.status(200).send(charge);
  });
};
