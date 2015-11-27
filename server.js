var express = require('express'),
	app = express();
// require and load dotenv
require('dotenv').load();

var exhbs = require('hbs');
app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));


// Sign Up route
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