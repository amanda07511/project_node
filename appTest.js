//My modules
var connect = require('severTest'); 

//Node modules
var mysql = require('mysql');
var express    = require("express");
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var async = require('async');
var Sequelize = require('sequelize');

//Model
var models = require('./models/index');

//create application expres
var app = express();
// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


app.post('/newUser', urlencodedParser, function (req, res) {
	var newUser = models.User.create({
		nom: 'Dupont',
		prenom: 'Holly',
		email: 'dupont@gmail.com',
		password: 'hola',
		photo: '',
	}).then(function(newUser){
		console.log(newUser.nom);
	}).catch(function(err){ console.log(err); });
});

app.post('/find', urlencodedParser, function(req,res){

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
			response = {
      				error:"Invalid_Credentials"
   			 };
			res.sendStatus(401)
			res.end(JSON.stringify(response));
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


// POST /login gets urlencoded bodies
app.post('/login', urlencodedParser, function (req, res) {
  
  //If there's no body parametres throw and error status
  if (!req.body) return res.sendStatus(401)
  //If one of the parametres is not defined throw and error status
  else if(!req.body.email||!req.body.password) return res.sendStatus(401)

 // Use the connection got of the pool
  connect.pool.getConnection(function(err, connection) {

	  //query to database for get an user by email and password
	  connection.query('SELECT * FROM `user`WHERE `email`= ? AND password= ?',[req.body.email, req.body.password], function (error, results, fields) {
	    
	    if (!err){

			//create a token with an hour of duration
			var token=jwt.sign({data: 'foobar'}, 'gato', { expiresIn: '1h' });			
			console.log(results[0]);
			// Prepare output in JSON format
			 response = {
      				user: results[0],
      				token:token
   			 };

			res.setHeader('Content-Type', 'text/plain');
  			res.end(JSON.stringify(response));	
	    }
		else
		    console.log('Error while performing Query.');

	    // And done with the connection.
	    connection.release();

	    // Handle error after the release.
	    if (error) throw error;

	    // Don't use the connection here, it has been returned to the pool.
	  });
	});

});//Login

app.post('/signup', urlencodedParser, function (req, res) {
  
  //If there's no body parametres throw and error status
  if (!req.body) return res.sendStatus(401)
  //If one of the parametres is not defined throw and error status
  else if(!req.body.nom||!req.body.prenom||!req.body.email||!req.body.password||!req.body.photo) return res.sendStatus(401)


 // Use the connection got of the pool
  connect.pool.getConnection(function(err, connection) {

  	async.series([
		// fonction #1 for check that the users email is not than BD.
		function(callback) {

		//query to database look an user by his email
		  connection.query('SELECT * FROM user WHERE email LIKE ? ',[req.body.email], function (error, results, fields) {
		    
		    if (err) return callback('Error while performing Query.'+ err);
		    
		    console.log(results);
		    //If the eamil exist in database
			if(results.length>0){
				// And done with the connection.
			    connection.release();
			    // Handle error after the release.
			    if (error) throw error;
			    //Send a fail status
	  			res.sendStatus(500);
	  			//Send an error
	  			return callback(new Error('Invalid email'));
			}//end if 
				 
			callback();
		     
		  });
			
		},
		// fonction #2 
		function(callback) {
			//query to database for insert a new user
		  connection.query('INSERT INTO user (nom, prenom, email, password, photo) VALUES (?, ?, ?, ?, ?)',[req.body.nom,req.body.prenom,req.body.email, req.body.password, req.body.photo], function (error, results, fields) {
		    if (err) return callback('Error while performing Query.'+ err);
		    
			//create a token with an hour of duration
			var token=jwt.sign({data: 'foobar'}, 'gato', { expiresIn: '1h' });			
				
			// Prepare output in JSON format
			response = {
	      				user: {nom: req.body.nom, prenom:req.body.prenom, email:req.body.email, photo:req.body.photo},
	      				token:token
	   		};

			res.setHeader('Content-Type', 'text/plain');
	  		res.end(JSON.stringify(response));	
		    callback();

		    // And done with the connection.
		    connection.release();

		    // Handle error after the release.
		    if (error) throw error;

		    // Don't use the connection here, it has been returned to the pool.
		  });
			

		},],
		function(err, results) {
			if (err) return (err);
	  		res.end();
	});//end Async

  	

	});//end getConnection

});//Signup



//test pool
app.get("/",function(req,res){-
    connect.handle_database(req,res);
});

//If the direction is not found
app.use(function(req, res) {
	res.setHeader("Content-Type", "text/plain");
	res.send('La page demandée n\'existe pas');
});


app.listen(3000);



