var express = require('express'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	car = require('./models/car'),
	app = express();
// require and load dotenv
require('dotenv').load();

var Car = require('./models/car');

var exhbs = require('hbs');
app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
	extended: true
}));

mongoose.connect(
	process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
	'mongodb://localhost/mycar');

// Add car 
app.post('/api/cars/', function(req,res){
	var newCar = new Car(req.body);
	newCar.save(function(err,savedCar){
		res.json(newCar);
	});
});

// Get ALl Cars 
app.get('/api/cars/', function(req, res) {
	//mongoose
	Car.find(function(err, allCars) {
		res.json({
			car: allCars
		});
	});
});



// login route
app.get('/profile', function(req, res) {
	res.render('profile');
});
// login route
app.get('/login', function(req, res) {
	res.render('login');
});
// Sign Up route
app.get('/sign_up', function(req, res) {
	res.render('sign_up');
});
// Homepage route
app.get('/index', function(req, res) {
	res.render('index');
});

var server = app.listen(process.env.PORT || 3000, function() {
	console.log('Hello...Is it me your looking for..')
});