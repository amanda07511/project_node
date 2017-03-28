//My modules
var connect = require('sever'); 

//Node modules
var express    = require("express");

//Calling routes
var user = require('./routes/user.js');
var resto = require('./routes/resto.js');
var notes = require('./routes/notes.js');

//create application expres
var app = express();


app.use('/user', user);
app.use('/resto', resto);
app.use('/notes', notes);

//If the direction is not found
app.use(function(req, res) {
	res.setHeader("Content-Type", "text/plain");
	res.send('La page demandée n\'existe pas');
});


app.listen(3000);



