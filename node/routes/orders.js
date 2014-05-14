var mongo = require('mongodb'),
    logger = require('../log');

var Server = mongo.Server,
    Db = mongo.Db;
    Connection = mongo.Connection;
    BSON = mongo.BSONpure;

var server = new Server('localhost', 27017, {autoconnect: true});
db = new Db('orders', server);
db.open(function(err, db) {
  if (!err) {
    logger.info('connected to orders database');
    db.collection('orders', {strict:true}, function(err, collection) {
      if (err) {
        logger.info('orders collection doesnt exist... better create it');
      }
    });
  } else {
    logger.error('oh man theres a problem connecting to the database ' + JSON.stringify(err));
  }
});

exports.findById = function(req) {
  var id = req.params.id;
  logger.info('Retrieving order ' + id);
  db.collection('orders', function(err, collection) {
    collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
      logger.info('heres what was foudn' + JSON.stringify(item));
      res.send(item);
    });
  });
}

exports.findAll = function(req) {
  logger.info('finding all of the orders');
  db.collection('orders', function(err, collection) {
    collection.find().toArray(function(err, items) {
      if (err) { return res.status(500).send('There was a problem processing the request');}
      logger.info('heres what was found' + JSON.stringify(items));
      res.send(items);
    })
  });
};

exports.addOrder = function(req) {
  var order = req.body;
  db.collection('orders', function(err, collection) {
    logger.info('Order collection access error ' + err + ' collection ' + collection);
    collection.insert(order, {safe:true}, function(err, result) {
      logger.info('Insert Order ' + result[0]);
      if (err) {
        logger.error('Error on order insert' + JSON.stringify(err));
        return;
      }
      logger.info('Saved the order ' + JSON.stringify(result[0]));
    });
  })
};

exports.addCharge = function(charge) {
  db.collection('charges', function(err, collection) {
    logger.info('Charge collection access error ' + err + ' collection ' + collection);
    collection.insert(charge, {safe:true}, function(err, result) {
      logger.info('Insert Order ' + result[0]);
      if (err) {
        logger.error('Error on charge insert' + JSON.stringify(err));
        return;
      }
      logger.info('Saved the charge ' + JSON.stringify(result[0]));
    });
  })
};

exports.addError = function(error) {
  db.collection('errors', function(err, collection) {
    logger.info('Error collection access error ' + err + ' collection ' + collection);
    collection.insert(error, {safe:true}, function(err, result) {
      logger.info('Insert Order ' + result[0]);
      if (err) {
        logger.error('Error on order insert' + err);
        res.status(500).send({'error': 'An error has occurred saving your order.  Please try to submit again' + err});
        return;
      }
      logger.info('Saved the error ' + JSON.stringify(result[0]));
    });
  })
};

exports.deleteOrder = function(req) {
  res.send('not implemented');
}

exports.updateOrder = function(res) {
  res.send('not implemented');
}
