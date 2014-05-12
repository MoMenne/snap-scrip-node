var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db;
    Connection = mongo.Connection;
    BSON = mongo.BSONpure;

var server = new Server('localhost', 27017, {autoconnect: true});
db = new Db('orders', server);
db.open(function(err, db) {
  if (!err) {
    console.log('connected to orders database');
    db.collection('orders', {strict:true}, function(err, collection) {
      if (err) {
        console.log('orders collection doesnt exist... better create it');
      }
    });
  } else {
    console.log('oh man theres a problem connecting to the database ' + err);
  }
});

exports.findById = function(req, res) {
  var id = req.params.id;
  console.log('Retrieving order ' + id);
  db.collection('orders', function(err, collection) {
    collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
      console.log('heres what was foudn' + JSON.stringify(item));
      res.send(item);
    });
  });
}

exports.findAll = function(req, res) {
  console.log('finding all of the orders');
  db.collection('orders', function(err, collection) {
    collection.find().toArray(function(err, items) {
      if (err) { return res.status(500).send('There was a problem processing the request');}
      console.log('heres what was found' + JSON.stringify(items));
      res.send(items);
    })
  });
};

exports.addOrder = function(req, res) {
  var order = req.body;
  db.collection('orders', function(err, collection) {
    console.log('Order collection access error ' + err + ' collection ' + collection);
    collection.insert(order, {safe:true}, function(err, result) {
      console.log('Insert Order ' + result[0]);
      if (err) {
        console.log('Error on order insert' + err);
        res.status(500).send({'error': 'An error has occurred saving your order.  Please try to submit again' + err});
        return;
      }
      console.log('Saved the order ' + JSON.stringify(result[0]));
    });
  })
};

exports.addCharge = function(charge, res) {
  db.collection('charges', function(err, collection) {
    console.log('Charge collection access error ' + err + ' collection ' + collection);
    collection.insert(charge, {safe:true}, function(err, result) {
      console.log('Insert Order ' + result[0]);
      if (err) {
        console.log('Error on order insert' + err);
        res.status(500).send({'error': 'An error has occurred saving your order.  Please try to submit again' + err});
        return;
      }
      console.log('Saved the charge ' + JSON.stringify(result[0]));
    });
  })
};

exports.addError = function(error, res) {
  db.collection('errors', function(err, collection) {
    console.log('Error collection access error ' + err + ' collection ' + collection);
    collection.insert(error, {safe:true}, function(err, result) {
      console.log('Insert Order ' + result[0]);
      if (err) {
        console.log('Error on order insert' + err);
        res.status(500).send({'error': 'An error has occurred saving your order.  Please try to submit again' + err});
        return;
      }
      console.log('Saved the error ' + JSON.stringify(result[0]));
    });
  })
};

exports.deleteOrder = function(req, res) {
  res.send('not implemented');
}

exports.updateOrder = function(res, req) {
  res.send('not implemented');
}
