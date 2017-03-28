//My modules
var connect = require('sever'); 

//Node modules
var express    = require("express");
var Sequelize = require('sequelize');

//Models
var models = require('./models/index');
//Calling routes
var user = require('./routes/user.js');

//create application expres
var app = express();



app.use('/user', user);

//If the direction is not found
app.use(function(req, res) {
	res.setHeader("Content-Type", "text/plain");
	res.send('La page demandée n\'existe pas');
});


app.listen(3000);



