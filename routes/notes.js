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


// GET all notes
router.get('/', function(req, res) {
  	
  	models.Note.findAll({
  		include: [{ model: models.User, as: 'User'},{ model: models.Resto, as: 'Resto'}]
  	}).then(function(data) {
  		
  		var restos = Array();
  		
  		for(var i=0;i<data.length;i++){

			a={ note: data[i].note, message:data[i].message,  
				user: {nom: data[i].User.nom, prenom: data[i].User.prenom, email: data[i].User.email, photo: data[i].User.photo},
				resto: {nom: data[i].Resto.nom, lat: data[i].Resto.lat, lng: data[i].Resto.lng, type: data[i].Resto.type}
			};
			restos.push(a);
		}


		res.setHeader('Content-Type', 'text/plain');
		res.end(JSON.stringify(restos));
	});
});

// GET notes by id Resto 
router.post('/suma', urlencodedParser , function(req,res){

	//If there's no body parametres throw and error status
  	if (!req.body) return res.sendStatus(401)
  	//If one of the parametres is not defined throw and error status
 	if(!req.body.note||!req.body.message||!req.body.resto) return res.sendStatus(401)
  	//If header token is not defined throw and error status
  	if(!req.get('token')) return res.sendStatus(401)

	var idResto=decodeURI(req.body.resto);
	var suma;
	var prom;

	async.series([
		// fonction #1 for check that the users email is not than BD.
		function(callback) {

			//I take the token and i verify it. 
			var token=req.get('token');
			jwt.verify(token, 'gato', function(err, decoded) {
					  
				if (err) {
			    	res.json({status: 500, message: err.message});
					return callback(new Error(err));
				}
				
				var decoded = jwt.verify(token, 'gato');
						
				models.User.findOne({
					where:{ id: decoded.id }
				}).then(function (userFound) {
					
					if (userFound==null) {
							res.json({status: 500, message: "Invalid_user"});
							return callback(new Error("Invalid_user"));
						}
					
					var userId=userFound.id;

					var newNote = models.Note.create({
						note:req.body.note,
				      	message:req.body.message,
				      	idResto:idResto,
				      	idUser: userId
					}).then(function(newNote){
						callback();
					}).catch(function(err){ 
						console.log(err); 
					});//end newResto
							
				}).catch(function(err) { 
					console.log(err); 
				});//end findOne

			});//end jwt.verify


		},
		// fonction #2 
		function(callback) {

			models.Note.sum('note',{
				where:{ idResto: idResto}
			}).then(function (data) {
				if (data==null) {
					res.json({status: 500, message: "Invalid_resto"});
					return callback(new Error("Invalid_resto"));
				}

				suma = data;

			}).catch(function(err) { 
				console.log(err); 
			});

			models.Note.count({ where:{ idResto: idResto} }).then(function(c) {
			  	prom= suma/c;
			  	console.log(prom.toFixed(2));
			  	callback();
			})

		},
		// fonction #3 
		function(callback) {

			models.Resto.update({
			  	note:prom.toFixed(2)
			}, {
			  where: {
			    id: idResto
			  }
			}).then(function(response){
				response = {
		      		response: "Note was correctly create and now the average is "+ prom
		   		};
				res.setHeader('Content-Type', 'text/plain');
				res.end(JSON.stringify(response));
				
			}).catch(function(err) {
				response = { erro:err}; 
				res.end(JSON.stringify(response));
			});//end findOne;

		},],
		function(err, results) {
			if (err) return (err);
	  		res.end();
	});//end Async


	

});

// GET notes by id Resto 
router.get('/get/:id', function(req,res){

	var id=decodeURI(req.params.id);


	models.Note.findAll({
		where:{ idResto: id},
		include: [{ model: models.User, as: 'User'},{ model: models.Resto, as: 'Resto'}]
	}).then(function (data) {
		if (data==null) {
			res.json({status: 500, message: "Not coincidences"});
		}
		var restos = Array();

		for(var i=0;i<data.length;i++){
			// Prepare output in JSON format
			 response = {note: data[i].note, message:data[i].message,  
				user: {nom: data[i].User.nom, prenom: data[i].User.prenom, email: data[i].User.email, photo: data[i].User.photo},
				resto: {nom: data[i].Resto.nom, lat: data[i].Resto.lat, lng: data[i].Resto.lng, type: data[i].Resto.type}
   			 };
   			 restos.push(response);
		}
		res.setHeader('Content-Type', 'text/plain');
		res.json(restos);	
	}).catch(function(err) { 
		console.log(err); 
	});

})

// GET my notes
router.get('/get', function(req, res) {
	//If header token is not defined throw and error status
	if(!req.get('token')) return res.sendStatus(401)

	var token=req.get('token');
	jwt.verify(token, 'gato', function(err, decoded) {
	  if (err) {
	  	response = { status: 500 ,erro:err.message };
	    return res.end(JSON.stringify(response));
	  }
	  	var decoded = jwt.verify(token, 'gato');
		console.log(decoded);

		models.Note.findAll({
  		where:{ idUser: decoded.id},
	  		include: [{ model: models.User, as: 'User'},{ model: models.Resto, as: 'Resto'}]
	  	}).then(function(data) {
	  		
	  		var restos = Array();
	  		
	  		for(var i=0;i<data.length;i++){
	  			
				response = {status: 200, id: data[i].id ,note: data[i].note, message:data[i].message, created: data[i].createdAt,
					resto: {nom: data[i].Resto.nom, lat: data[i].Resto.lat, lng: data[i].Resto.lng, type: data[i].Resto.type, photo: data[i].Resto.photo}
	   			 };
	   			 restos.push(response);
			}


			res.setHeader('Content-Type', 'text/plain');
			res.end(JSON.stringify(restos));
		});

	});//end jwt.verify

});



//POST /Create new note
router.post('/create', urlencodedParser, function (req, res) {
  //If there's no body parametres throw and error status
  if (!req.body) return res.sendStatus(401)
  //If one of the parametres is not defined throw and error status
  if(!req.body.note||!req.body.message||!req.body.resto) return res.sendStatus(401)
  //If header token is not defined throw and error status
  if(!req.get('token')) return res.sendStatus(401)
  	
  	//I take the token and i verify it. 
	var token=req.get('token');
	jwt.verify(token, 'gato', function(err, decoded) {
			  
		if (err) {
			response = { erro:err.message };
	    	return res.end(JSON.stringify(response));
		}
		
		var decoded = jwt.verify(token, 'gato');
				
		models.User.findOne({
			where:{ id: decoded.id }
		}).then(function (userFound) {
			
			if (userFound==null) {
				response = {status: 500, message: "Invalid_user"};
					return res.end(JSON.stringify(response));
				}
			
			var userId=userFound.id;

			var newNote = models.Note.create({
				note:req.body.note,
		      	message:req.body.message,
		      	idResto:req.body.resto,
		      	idUser: userId
			}).then(function(newNote){
				response = {
				    response: "Note was correctly create"
				 };
				res.setHeader('Content-Type', 'text/plain');
				res.end(JSON.stringify(response));
			
			}).catch(function(err){ 
				console.log(err); 
			});//end newResto
					
		}).catch(function(err) { 
			console.log(err); 
		});//end findOne

	});//end jwt.verify
	
});

// POST /update  urlencoded bodies
router.post('/update', urlencodedParser, function(req,res){

	//If there's no body parametres throw and error status
	if (!req.body) return res.sendStatus(401)
	//If one of the parametres is not defined throw and error status
  	if(!req.body.id||!req.body.message||!req.body.note) return res.sendStatus(401)
  	//If header token is not defined throw and error status
  	if(!req.get('token')) return res.sendStatus(401)

	//I take the token and i verify it. 
	var token=req.get('token');
	jwt.verify(token, 'gato', function(err, decoded) {
	  if (err) {
	  	response = { erro:err.message };
	    return res.end(JSON.stringify(response));
	  }

		models.Note.update({
		  	note:req.body.note,
		    message:req.body.message,
		}, {
		  where: {
		    id: req.body.id
		  }
		}).then(function(response){
			response = {
	      		response: "Note was correctly updated"
	   		};
			res.setHeader('Content-Type', 'text/plain');
			res.end(JSON.stringify(response));
			
		}).catch(function(err) {
			response = { erro:err}; 
			res.end(JSON.stringify(response));
		});//end findOne;

	});//end jwt.verify

});//end post update

// POST /update gets urlencoded bodies
router.delete('/delete', function(req,res){

  	//If header token is not defined throw and error status
  	if(!req.get('token')) return res.sendStatus(401)
  	if(!req.get('id')) return res.sendStatus(401)

	//I take the token and i verify it. 
	var token=req.get('token');
	jwt.verify(token, 'gato', function(err, decoded) {
	  if (err) {
	  	response = { erro:err.message };
	    return res.end(JSON.stringify(response));
	  }

	 
		models.Note.find({
		 	where: { id: req.get('id') } 
		 }).then(function(response){
		 	if (response==null) {
				resp = {status: 500, message: "Resto not found"};
				return res.end(JSON.stringify(resp));
			}
			
			response.destroy();
			response = {
		      	response: {status: 200, message: "Note was correctly deleted"};
		   	};
			res.setHeader('Content-Type', 'text/plain');
			res.end(JSON.stringify(response));
			
		});

	});//end jwt.verify

});//end post delete



module.exports = router;