/************************************************************************************/
/* index.js Serves at the API for this site - all enpoints are defined in this file */
(function () {
	"use strict";
	var express = require('express');
	var passport = require('passport');
	var jwt = require('express-jwt');
	var router = express.Router();

	var mongoose = require('mongoose');	// First, make sure mongoose is imported.
	var Post = mongoose.model('Post');	// Need to have a handle to the Post data model
	var Comment = mongoose.model('Comment'); // Same goes for Comment data model, need a handle.
	var User = mongoose.model('User'); // Importing the User model here

	var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

	/* GET home page. */
	// Don't delete this Kale. You are dumb sometimes
	router.get('/', function(req, res, next) {
	  res.render('index', { title: 'Express' });
	});

	// Handling all of the post POST and GET operations
	// This is the function that handles the request for posts, GET.
	router.get('/posts', function(req, res, next) {		// Using Express.js built-in get method to define the URL end-point for our posts.
	  Post.find(function(err,posts){					// Notice we're querying for Post(s) here with .find. Don't confuse with POST function.
	  	if(err) {return next(err); }

	  	res.json(posts);
	  });
	});

	// Here is where we're handling POST functionality
	router.post('/posts', auth, function(req, res, next) {	// This is how you implement POST functionality with Mongoose
		var post = new Post(req.body);	// Having Mongoose create a new object of Post before saving to the database.
		post.author = req.payload.username;

		post.save(function(err, post){	// Similar to insert, we are saving this to our database.
			if(err) {return next(err); }

			res.json(post);
		});
	});

	// We're creating a route for pre-loading post object
	// This uses mongoose's query interface, supposedly a more simple way of interacting with the database.
	// Now when a route URL with :post is defined this function here will be run first. 
	router.param('post', function(req, res, next, id) {	
		var query = Post.findById(id);

		query.exec(function (err, post) {
			if(err) { return next(err); }
			if(!post) {return next(new Error('can\'t find post')); }

			req.post = post;
			return next();
		});
	});

	router.get('/posts/:post', function(req, res) {			// Made modifications to the GET route for a single post so that comments are also retrieved
		req.post.populate('comments', function(err,post) {
			if(err) {return next(err); }

			res.json(post);
		});
	});

	router.put('/posts/:post/upvote', auth, function(req, res, next) {
		req.post.upvote(function(err, post) {
			if(err) {return next(err); }

			res.json(post);
		});
	});


	// Handling comments here
	// Removed router.get that I thought I was supposed to use for comments, which didn't make sense anyways.
	// Comments are attached to a specific post, so the comments should be part of the GET request for a particular/unique post id
	router.post('/posts/:post/comments', auth, function(req, res, next) {
		var comment = new Comment(req.body);
		comment.post = req.post;
		comment.author = req.payload.username;

		comment.save(function (err, comment) {
			if(err) {return next(err);}

			req.post.comments.push(comment);
			req.post.save(function(err, post){
				if(err){return next(err);}

			res.json(comment);
			});
		});
	});


	router.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {
		req.post.comment.upvote(function(err, comment) {
			if(err) {return next(err); }

			res.json(comment);
		});
	});


	router.param('comment', function(req, res, next, id) {
		var query = Comment.findById(id);

		query.exec(function (err, comment) {
			if(err) {return next(err); }
			if(!comment) {return next(new Error('can\'t find comment')); }

			req.post.comment = comment;		// Need to have req.post.comment as it is the comment that belongs to a particular post.
			return next();
		});
	});


	// Handling User routes here
	router.post('/register', function(req, res, next) {
		if (!req.body.username || !req.body.password){
			return res.status(400).json({message: "Please fill out all fields"});
		}

		var user = new User();

		user.username = req.body.username;

		user.setPassword(req.body.password)

		user.save(function (err) {
			if(err) { return next(err); }

			return res.json({token: user.generateJWT()})
		});
	});


	router.post('/login', function(req, res, next) {
		if(!req.body.username || !req.body.password){
			return res.status(400).json({message: 'Please fill out all fields'});
		}

		passport.authenticate('local', function(err, user, info){
			if(err){ return next(err); }

			if(user){
				return res.json({token: user.generateJWT()});
			} else {
				return res.status(401).json(info);
			}
		})(req, res, next);
	});

	module.exports = router;
}());
// Maybe think of POST as a record creation and PUT as an update to an existing record