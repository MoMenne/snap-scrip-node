var nodemailer = require('nodemailer'), fs = require('fs'), path = require('path'), logger = require('./log');

var emailPass;
var transporter;
fs.readFile(path.join(__dirname + '/../email.pass'),'utf8', function(err, data) {
  if (err) { logger.error(err); }
  logger.info('reading email pass');
  emailPass = data + '';
  transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'snapscrip@gmail.com',
      pass: emailPass
    }
  });
});

exports.sendEmail = function(email, orderNumber) {
  var mailOptions = {
    from: 'snapscrip+orders@gmail.com',
    to: email,
    subject: 'Order Received :-)',
    html: '<html><body><h1>Thanks for your Order</h1><h3>Order #: ' + orderNumber  + '</h3><p>We faxed your order straight to St. Joan of Arc.  Typically it takes about a week for the gift cards to come in, but usually the more popular giftcards are kept on hand so parts of your order could be ready in the next day or two.</p><p>When the giftcards arrive, they can be picked up from the Rectory,  after Mass, or even sent home with your child from school</p></p><p>Also, remember if you paid with cash be sure to send a check with your child to school or drop one off at the rectory.</p><p>If you have any questions just send a note to snapscrip@gmail.com</p><p>Cheers!  Mike Menne (SnapScrip Founder) </p></body></html>'
  }

  transporter.sendMail(mailOptions, function(err, info) {
     if (err) { logger.error('ERROR sending mail!  ' + JSON.stringify(err)) }
     if (info) { logger.info ('email sent to ' + email); }
  });
}

exports.sendError = function(orderString, issue) {

  var mailOptions = {
    from: 'snapscrip@gmail.com',
    to: 'snapscrip+errors@gmail.com',
    subject: 'Problem with an Order',
    html: '<html><body><h1>Order Problemo</h1><p>' + orderString + '</p><p>' + issue + '</p></body></html>'
  }

  transporter.sendMail(mailOptions, function(err, info) {
     if (err) { logger.error(err) }
     if (info) { logger.info ('email sent to ' + email); }
  });

}
