var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CarSchema = new Schema({
  year: String,
  make: String,
  model: String
});

var Car = mongoose.model('Car', CarSchema);

module.exports = Car;