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

// Handling all of the post POST and GET operations
// This is the function that handles the request for posts, GET.
router.get('/posts', function(req, res, next) {		// Using Express.js built-in get method to define the URL end-point for our posts.
  Post.find(function(err,posts){					// Notice we're querying for Post(s) here with .find. Don't confuse with POST function.
  	if(err) {return next(err); }

  	res.json(posts);
  });
});

// Here is where we're handling POST functionality
router.post('/posts', function(req, res, next) {	// This is how you implement POST functionality with Mongoose
	var post = new Post(req.body);	// Having Mongoose create a new object of Post before saving to the database.

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

router.get('/posts/:post', function(req, res) {			// Made modifications to the GET rout for posts so that comments are also retrieved
	req.post.populate('comments', function(err,post) {
		if(err) {return next(err); }

		res.json(post);
	});
});

router.put('/posts/:post/upvote', function(req, res, next) {
	req.post.upvote(function(err, post) {
		if(err) {return next(err); }

		res.json(post);
	});
});


// Handling comments here
// Removed router.get that I thought I was supposed to use for comments, which didn't make sense anyways.
// Comments are attached to a specific post, so the comments should be part of the GET request for a particular/unique post id
router.post('/posts/:post/comments', function(req, res, next) {
	var comment = new Comment(req.body);
	comment.post = req.post;

	comment.save(function (err, comment) {
		if(err) {return next(err);}

		req.post.comments.push(comment);
		req.post.save(function(err, post){
			if(err){return next(err);}

		res.json(comment);
		});
	});
});


router.put('/posts/:posts/comments/:comment/upvote,', function(req, res, next) {
	req.post.comments.upvote(function(err, comments){
		if(err) {return next(err); }

		res.json(comments);
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

module.exports = router;
// Maybe think of POST as a record creation and PUT as an update to an existing record