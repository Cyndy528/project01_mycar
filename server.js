var express = require('express'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	car = require('./models/car'),
	app = express(),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	flash = require('express-flash'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

// require and load dotenv
require('dotenv').load();

var User = require('./models/user');

var Car = require('./models/car');

var Maint = require('./models/maintenance');

var exhbs = require('hbs');

app.set('view engine', 'hbs');

process.env.MyCarID;


// middleware for auth
app.use(cookieParser());
app.use(session({
	secret: 'supersecretkey',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

/// send flash messages
app.use(flash());

// passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(__dirname + '/public'));



app.use(bodyParser.urlencoded({
	extended: true
}));

mongoose.connect(
	process.env.MONGOLAB_URI ||
	process.env.MONGOHQ_URL ||
	'mongodb://localhost/mycar');

//Delete Car
app.delete('/api/cars/:id', function(req, res) {
	// get car id from url params (`req.params`)
	var carId = req.params.id;

	// find car in db by id and remove
	car.findOneAndRemove({
		_id: carId
	}, function(err, deletedCar) {
		if (err) {
			res.status(500).json({
				error: err.message
			});
		} else {
			res.json(deletedCar);
		}
	});
});



// app.get('/api/maintenance',function(req,res){

// 	Maint.find(function(err,allMaint){
// 		res.json({
// 			maintenance:allMaint
// 		});
// 	});

// });

// get maintenance

app.get('/api/cars/:id', function(req, res) {
	Car.findOne({
			_id: req.params.id
		})
		.populate('maintenance')
		.exec(function(err, car) {
			if (err) {
				return console.error(err);
			}
			if (car.maintenance.length > -1) {
				for (var i = 0; i < car.maintenance.length; i++) {
					console.log(car.maintenance[i].maintenance);
				}
			} else {
				console.log(err);
			}
			res.json(car.maintenance);
			console.log(car);
		});
});

/// Add Maintenance
app.post('/api/cars/:id/maintenance', function(req, res) {
	var newMaint = new Maint(req.body);
	Car.findOne({
			_id: req.params.id
		})
		.populate('maintenance')
		.exec(function(err, car) {
			newMaint.save();
			car.maintenance.push(newMaint);
			car.save();
			res.json(car);
		});
});

/// add maint

// app.post('/api/maintenance',function(req,res){
// 	var newMaint = new Maint(req.body);
// 	newMaint.save(function(err,savedMaint){

// 		res.json(newMaint);
// 	});
// });

// Add car 
app.post('/api/cars/', function(req, res) {
	var newCar = new Car(req.body);
	newCar.save(function(err, savedCar) {
		res.json(newCar);
	});
});

// Get ALl Cars 
app.get('/api/cars/', function(req, res) {
	//mongoose
	Car.find(function(err, allCars) {
		res.json({
			car: allCars
			,user:req.user
		});
	});
});
// sign up new user, then log them in
// hashes and salts password, saves new user to db
app.post('/sign_up', function(req, res) {
	if (req.user) {
		res.redirect('/profile');
	} else {
		User.register(new User({
				username: req.body.username
			}), req.body.password,
			function(err, newUser) {
				if (err) {
					// res.send(err);
					req.flash('sign_upError',err.message); 
					res.redirect('/sign_up');
				} else {
					passport.authenticate('local')(req, res, function() {
						// res.send('signed up!!!');
						res.redirect('/profile');
					});
				}
			}
		);
	}
});

// log in user
app.post('/login', passport.authenticate('local'), function(req, res) {
	//res.send('logged in!!!');
	res.redirect('/profile');
});
// show user profile page
app.get('/profile', function(req, res) {
	res.render('profile', {
		user: req.user
	});
});
// log out user
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
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
app.get('/', function(req, res) {
	res.render('index');
});

var server = app.listen(process.env.PORT || 3000, function() {
	console.log('Hello...Is it me your looking for..')
});