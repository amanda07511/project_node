//Node modules
var express    = require("express");
var cors = require('cors')

//Calling routes
var user = require('./routes/user.js');
var resto = require('./routes/resto.js');
var notes = require('./routes/notes.js');

//create application expres
var app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.use(cors());

app.use('/user', user);
app.use('/resto', resto);
app.use('/notes', notes);

//If the direction is not found
app.use(function(req, res) {
	res.setHeader("Content-Type", "text/plain");
	res.send('La page demandée n\'existe pas');
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



