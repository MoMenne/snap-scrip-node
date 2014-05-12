var fs = require('fs');
var publickey = '', privatekey = '';

console.log('were going to try and send a fax via the Phaxio API')

exports.sendFax = function(pdfPath, meta) {

  fs.readFile('phaxiopublic.key','utf8', function(err, data) {
    if (err) { console.log(err); }
    console.log(data);
    publickey = data;
  });
  fs.readFile('phaxioprivate.key','utf8', function(err, data) {
    if (err) { console.log(err); }
    privatekey = data;
  })
  var Phaxio = require('phaxio'),
      phaxio = new Phaxio('a678795e996a164e5937e652d83d9f499e7a8de7', '5027b57e8520e53372343c980d63305f71eeadb8',
          function(err, data) { console.log(data); });

  var orderString = 'Paid Order:' + meta.orderId + ' with credit card ' + meta.creditCard + ' charged for $' + meta.totalAmount + ' \n ' + new Date() + '\n ' + meta.name + ' ( ' + meta.email + ') \n ' + meta.cardCount + '  for a total of $' + meta.cardAmount;
  for (var i = 0; i < meta.orders.length; i++) {
    orderString = orderString + '\n      $' + meta.orders[i].value + ' ' + meta.orders[i].name;
  }
  orderString = orderString + '\n https://manage.stripe.com/test/payments/' + meta.orderId;
  console.log(orderString);

  phaxio.sendFax({
    to: '16366719209',
    string_data: orderString,
    string_data_type: 'text',
    filenames: pdfPath
  }, function(err, data) {
    if (err) {
      console.log('whoa theres a problem ' + err);
    } else if (!data.success) {
      console.log('hmmm....something didnt seem to work... no success' + data.message);
    }
    if (data.data.is_test) {
      console.log('Dont worry this is just a test... Repeat just a test');
    }

    console.log(data.message + ' for ' + data.data.faxId);
  });
}