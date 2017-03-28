// Node_Modules
var express    = require("express");
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var async = require('async');
var Sequelize = require('sequelize');

// Getting the models
var models = require('../models/index');
// Routing
var router = express.Router();

// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});


// POST /login gets urlencoded bodies
router.post('/login', urlencodedParser, function(req,res){

	//If there's no body parametres throw and error status
	if (!req.body) return res.sendStatus(401)
	//If one of the parametres is not defined throw and error status
	else if(!req.body.email||!req.body.password) return res.sendStatus(401)

	models.User.findOne({
		where:{
			email: req.body.email,
			password: req.body.password
		}
	}).then(function (userFound) {
		if (userFound==null) {
			res.json({status: 500, message: "Invalid_credentials"});
		}
		//create a token with user informationand with an hour of duration
			var token=jwt.sign({nom: userFound.nom, prenom: userFound.prenom, email: userFound.email, password: userFound.password, photo:userFound.photo}, 
				'gato', { expiresIn: '1h' });

			// Prepare output in JSON format
			 response = {
      				token:token
   			 };
			res.setHeader('Content-Type', 'text/plain');
			res.end(JSON.stringify(response));	
	}).catch(function(err) { 
		console.log(err); 
	});

});

router.post('/signup', urlencodedParser, function (req, res) {
	 //If there's no body parametres throw and error status
  if (!req.body) return res.sendStatus(401)
  //If one of the parametres is not defined throw and error status
  else if(!req.body.nom||!req.body.prenom||!req.body.email||!req.body.password||!req.body.photo) return res.sendStatus(401)

  	async.series([
		// fonction #1 for check that the users email is not than BD.
		function(callback) {

			models.User.findOne({
				where:{
					email: req.body.email
				}
			}).then(function (userFound) {
				if (userFound!=null) {
					res.json({status: 500, message: "Invalid_email"});
					return callback(new Error('Invalid email'));
				}
				callback();
			}).catch(function(err) { 
				console.log(err); 
			});//end findOne

		},
		// fonction #2 
		function(callback) {
			
			var newUser = models.User.create({
				nom: req.body.nom,
				prenom: req.body.prenom,
				email: req.body.email,
				password: req.body.password,
				photo: req.body.photo,
			}).then(function(newUser){
				//create a token with user informationand with an hour of duration
				var token=jwt.sign({nom: newUser.nom, prenom: newUser.prenom, email: newUser.email, password: newUser.password, photo: newUser.photo}, 
					'gato', { expiresIn: '1h' });

				// Prepare output in JSON format
				 response = {
	      				token:token
	   			 };
				res.setHeader('Content-Type', 'text/plain');
				res.end(JSON.stringify(response));
			}).catch(function(err){ 
				console.log(err); 
			});//end newUser

		},],
		function(err, results) {
			if (err) return (err);
	  		res.end();
	});//end Async

	
});

app.post('/signup', urlencodedParser, function (req, res) {
	 //If there's no body parametres throw and error status
  if (!req.body) return res.sendStatus(401)
  //If one of the parametres is not defined throw and error status
  else if(!req.body.nom||!req.body.prenom||!req.body.email||!req.body.password||!req.body.photo) return res.sendStatus(401)

  	async.series([
		// fonction #1 for check that the users email is not than BD.
		function(callback) {

			models.User.findOne({
				where:{
					email: req.body.email
				}
			}).then(function (userFound) {
				if (userFound!=null) {
					res.json({status: 500, message: "Invalid_email"});
					return callback(new Error('Invalid email'));
				}
				callback();
			}).catch(function(err) { 
				console.log(err); 
			});//end findOne

		},
		// fonction #2 
		function(callback) {
			
			var newUser = models.User.create({
				nom: req.body.nom,
				prenom: req.body.prenom,
				email: req.body.email,
				password: req.body.password,
				photo: req.body.photo,
			}).then(function(newUser){
				//create a token with user informationand with an hour of duration
				var token=jwt.sign({nom: newUser.nom, prenom: newUser.prenom, email: newUser.email, password: newUser.password, photo: newUser.photo}, 
					'gato', { expiresIn: '1h' });

				// Prepare output in JSON format
				 response = {
	      				token:token
	   			 };
				res.setHeader('Content-Type', 'text/plain');
				res.end(JSON.stringify(response));
			}).catch(function(err){ 
				console.log(err); 
			});//end newUser

		},],
		function(err, results) {
			if (err) return (err);
	  		res.end();
	});//end Async

	

// POST /login gets urlencoded bodies
router.post('/update', urlencodedParser, function(req,res){

	//If there's no body parametres throw and error status
	if (!req.body) return res.sendStatus(401)
	//If one of the parametres is not defined throw and error status
	else if(!req.body.nom||!req.body.prenom||!req.body.email||!req.body.password||!req.body.photo) return res.sendStatus(401)

	else if(!req.header['token']) return res.sendStatus(401)

	

});


module.exports = router;