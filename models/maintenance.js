var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var maintSchema = new Schema({
	type: String,
	part: String,
	maintenance: String,
	date: {type: Date, default: Date.now}

});

var Maint = mongoose.model('maintenance', maintSchema);

module.exports = Maint;