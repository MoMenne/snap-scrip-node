var fs = require('fs'),
    path = require('path'),
    logger = require('../log'), 
    mailer = require('../mailreceipt');

logger.info('fax api spinning up')

var privateKey, publicKey;
fs.readFile(path.join(__dirname + '/../../phaxiopublic.key'),'utf8', function(err, data) {
  if (err) { logger.error(err); }
  logger.info('phaxio public key' + data);
  publicKey = data;
});
fs.readFile(path.join(__dirname + '/../../phaxioprivate.key'),'utf8', function(err, data) {
  if (err) { logger.error(err); }
  logger.info('private phaxio key read');
  privateKey = data;
});

exports.sendFax = function(pdfPath, meta) {

  logger.info('okay does it make it here');
  var Phaxio = require('phaxio'),
      phaxio = new Phaxio(publicKey, privateKey,
          function(err, data) {
            logger.info(data);
            if (err) {
              logger.error(JSON.stringify(err))
            }
          });

  var orderString = 'Paid Order:' + meta.orderId + ' with credit card ' + meta.creditCard + ' charged for $' + meta.totalAmount + ' \n ' + new Date() + '\n ' + meta.name + ' ( ' + meta.email + ') \n ' + meta.cardCount + '  for a total of $' + meta.cardAmount;
  for (var i = 0; i < meta.orders.length; i++) {
    orderString = orderString + '\n      $' + meta.orders[i].value + ' ' + meta.orders[i].name;
  }
  orderString = orderString + '\n https://manage.stripe.com/test/payments/' + meta.orderId;
  logger.info('Fax Message \n' + orderString);

  phaxio.sendFax({
    to: '13143529350',
    string_data: orderString,
    string_data_type: 'text'
  }, function(err, data) {
    if (err) {
      logger.error('whoa theres a problem ' + JSON.stringify(err));
      mailer.sendError(JSON.stringify(orderString, err));
    } else if (!data.success) {
      logger.error('hmmm....error sending fax ' + JSON.stringify(err));;
    }
  });
}
