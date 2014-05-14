var fs = require('fs'),
    path = require('path'),
    logger = require('../log');

logger.info('fax api spinning up')

var privateKey, publicKey;
fs.readFile(path.join(__dirname + '/../../phaxiopublic.key'),'utf8', function(err, data) {
  if (err) { logger.error(err); }
  logger.info('phaxio public key' + data);
  publickey = data;
});
fs.readFile(path.join(__dirname + '/../../phaxioprivate.key'),'utf8', function(err, data) {
  if (err) { logger.error(err); }
  logger.info('private phaxio key read');
  privatekey = data;
})


exports.sendFax = function(pdfPath, meta) {

  var Phaxio = require('phaxio'),
      phaxio = new Phaxio('a678795e996a164e5937e652d83d9f499e7a8de7', '5027b57e8520e53372343c980d63305f71eeadb8',
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
    } else if (!data.success) {
      logger.info('hmmm....something didnt seem to work... no success' + data.message);
    }
    if (data.data.is_test) {
      logger.info('Dont worry this is just a test... Repeat just a test');
    }

    logger.info(data.message + ' for ' + data.data.faxId);
  });
}
