var express = require('express'),
  app = express();

  var exhbs = require('hbs');
   app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));









  // Homepage route
app.get('/', function(req, res) {
  res.render('index');
});

var server = app.listen(process.env.PORT || 3000, function() {
  console.log('Hello...Is it me your looking for..')
});