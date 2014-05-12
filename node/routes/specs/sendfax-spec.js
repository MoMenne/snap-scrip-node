var sendfax = require('../sendfax');
var meta = {orderId:"ch_23423423423", email:'afsdsd@dfs.com', name:'Mike',
  creditCard:'XXXX-XXXX-XXXX-1234', cardCount:3, totalAmount: 100, cardAmount:105,
  orders:[{name:'Lowes', amount:100}, {name:'Applebees', amount:25}]};

beforeEach(function() {
});

describe("should be able to load key files at the least", function() {
  sendfax.sendFax('/Users/mpmenne/Code/Examples/Javascript/Phaxio/order.pdf', meta);
})