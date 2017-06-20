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

// GET all restos
router.get('/', function(req, res) {
  	models.Resto.findAll({
  		include: [{ model: models.User, as: 'User'}]
  	}).then(function(data) {
  		
  		var restos = Array();
  		
  		for(var i=0;i<data.length;i++){

			a={ id: data[i].id,nom: data[i].nom, type:data[i].type, lat:data[i].lat, lng: data[i].lng, photo: data[i].photo , note: data[i].note, 
				user: {nom: data[i].User.nom, prenom: data[i].User.prenom, email: data[i].User.email, photo: data[i].User.photo}};
			restos.push(a);
		}


		res.setHeader('Content-Type', 'text/plain');
		res.end(JSON.stringify(restos));
	});
});

// GET resto by name 
router.get('/get/:name', function(req,res){

	var nom=decodeURI(req.params.name);


	models.Resto.findOne({
		where:{ nom: nom},
		include: [{ model: models.User, as: 'User'}]
	}).then(function (restoFound) {
		if (restoFound==null) return res.status(404).send("Resto not Found");
		
		else{
			// Prepare output in JSON format
			response = { status: 200, id:restoFound.id ,nom:restoFound.nom, type:restoFound.type, lat:restoFound.lat, lng:restoFound.lng, photo:restoFound.photo, note:restoFound.note,
				user: {nom: restoFound.User.nom, prenom:restoFound.User.prenom, email: restoFound.User.email, photo:restoFound.User.photo}
   			};
   			res.setHeader('Content-Type', 'text/plain');
			res.end(JSON.stringify(response));
		}
			
				
	}).catch(function(err) { 
		console.log(err); 
	});

});

// GET resto by id 
router.get('/getId/:id', function(req,res){

	var id=decodeURI(req.params.id);


	models.Resto.findOne({
		where:{ id: id},
		include: [{ model: models.User, as: 'User'}]
	}).then(function (restoFound) {
		if (restoFound==null) return res.status(404).send("Resto not Found");
		else{
			// Prepare output in JSON format
			response = { status: 200, id:restoFound.id ,nom:restoFound.nom, type:restoFound.type, lat:restoFound.lat, lng:restoFound.lng, photo:restoFound.photo, note:restoFound.note,
				user: {nom: restoFound.User.nom, prenom:restoFound.User.prenom, email: restoFound.User.email, photo:restoFound.User.photo}
   			};
   			res.setHeader('Content-Type', 'text/plain');
			res.end(JSON.stringify(response));
		}
			
				
	}).catch(function(err) { 
		console.log(err); 
	});

});

// GET my restos  
router.get('/get', function(req, res) {
	//If header token is not defined throw and error status
	if(!req.get('token')) return res.sendStatus(401)

	var token=req.get('token');
	jwt.verify(token, 'gato', function(err, decoded) {
	  if (err) return res.status(500).send(err.message);
	  	
	  	var decoded = jwt.verify(token, 'gato');
		console.log(decoded);

		models.Resto.findAll({
  		where:{ idUser: decoded.id},
	  		include: [{ model: models.User, as: 'User'}]
	  	}).then(function(data) {
	  		
	  		var restos = Array();
	  		
	  		for(var i=0;i<data.length;i++){

				a={ id: data[i].id ,nom: data[i].nom, type:data[i].type, lat:data[i].lat, lng: data[i].lng ,created: data[i].createdAt, photo: data[i].phot};
				restos.push(a);
			}


			res.setHeader('Content-Type', 'text/plain');
			res.end(JSON.stringify(restos));
		});

	});//end jwt.verify

});

//POST /Create new restos
router.post('/create', urlencodedParser, function (req, res) {
  //If there's no body parametres throw and error status
  if (!req.body) return res.sendStatus(401)
  //If one of the parametres is not defined throw and error status
  if(!req.body.nom||!req.body.type||!req.body.lat||!req.body.lng||!req.body.img) return res.sendStatus(401)
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
				response = { status: 500, message: "Invalid_user"};
					return res.end(JSON.stringify(response));
				}
			
			console.log(userFound.nom);
			var userId=userFound.id;

			var newResto = models.Resto.create({
				nom:req.body.nom,
		      	type:req.body.type,
		      	lat:req.body.lat,
		      	lng:req.body.lng,
		      	photo:req.body.img,
		      	note:0,
		      	idUser: userId
			}).then(function(newResto){

				response = { status: 500, message: "Resto" +newResto.nom+" was correctly create"};
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

// POST /update gets urlencoded bodies
router.post('/update', urlencodedParser, function(req,res){

	//If there's no body parametres throw and error status
	if (!req.body) return res.sendStatus(401)
	//If one of the parametres is not defined throw and error status
  	if(!req.body.id||!req.body.nom||!req.body.type||!req.body.lat||!req.body.lng) return res.sendStatus(401)
  	//If header token is not defined throw and error status
  	if(!req.get('token')) return res.sendStatus(401)

	//I take the token and i verify it. 
	var token=req.get('token');
	jwt.verify(token, 'gato', function(err, decoded) {
	  if (err) {
	  	response = { erro:err.message };
	    return res.end(JSON.stringify(response));
	  }

		models.Resto.update({
		  	nom:req.body.nom,
		    type:req.body.type,
		    lat:req.body.lat,
		    lng:req.body.lng
		}, {
		  where: {
		    id: req.body.id
		  }
		}).then(function(response){
			response = {
	      		response: "Resto was correctly updated"
	   		};
			res.setHeader('Content-Type', 'text/plain');
			res.end(JSON.stringify(response));
			
		}).catch(function(err) {
			response = { erro:err}; 
			res.end(JSON.stringify(response));
		});//end findOne;

	});//end jwt.verify

});//end post update

// POST /delete gets urlencoded bodies
router.delete('/delete', urlencodedParser, function(req,res){

	//If there's no body parametres throw and error status
	if (!req.body) return res.sendStatus(401)
	//If one of the parametres is not defined throw and error status
  	if(!req.body.id) return res.sendStatus(401)
  	//If header token is not defined throw and error status
  	if(!req.get('token')) return res.sendStatus(401)

	//I take the token and i verify it. 
	var token=req.get('token');
	jwt.verify(token, 'gato', function(err, decoded) {
	  if (err) {
	  	response = { erro:err.message };
	    return res.end(JSON.stringify(response));
	  }

	 
		models.Resto.find({
		 	where: { id: req.body.id } 
		 }).then(function(response){
		 	if (response==null) {
				resp = {status: 500, message: "Resto not found"};
				return res.end(JSON.stringify(resp));
			}
			
			response.destroy();
			response = {
		      	response: "	Resto correctly deleted"
		   	};
			res.setHeader('Content-Type', 'text/plain');
			res.end(JSON.stringify(response));
			
		});

	});//end jwt.verify

});//end post delete


module.exports = router;