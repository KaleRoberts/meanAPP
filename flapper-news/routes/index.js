var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');	// First, make sure mongoose is imported.
var Post = mongoose.model('Post');	// Need to have a handle to the Post data model
var Comment = mongoose.model('Comment'); // Same goes for Comment data model, need a handle.

/* GET home page. */
// Don't delete this Kale. You are dumb sometimes
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// This is the function that handles the request for posts, GET.
router.get('/posts', function(req, res, next) {		// Using Express.js built-in get method to define the URL end-point for our posts.
  Post.find(function(err,posts){					// Notice we're querying for Post(s) here with .find. Don't confuse with POST function.
  	if(err) {return next(err); }

  	res.json(posts);
  });
});

// Here is where we're handling POST functionality
router.post('/posts', function(req, req, next) {	// This is how you implement POST functionality with Mongoose
	var post = new Post(req.body);	// Having Mongoose create a new object of Post before saving to the database.

	post.save(function(err, post){	// Similar to insert, we are saving this to our database.
		if(err) {return next(err); }

		res.json(post);
	});
});

// // We're creating a route for pre-loading post object
// router.param('post', function(req, res, next, id) {	
// 	var query = Post.findById(id);

// 	query.exec(function (err, post) {
// 		if(err) { return next(err); }
// 		if(!post) {return next(new Error('can\'t find post')); }

// 		req.post = post;
// 		return next();
// 	});
// });

module.exports = router;

// TODO: Learn the difference between POST and PUT