var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
	body: String,
	author: String,
	upvotes: {type: Number, default: 0},
	post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'}	// With Mongoose, this is how you go about creating relationsips between different data models
});																// Use of the ObjectId type allows for this.
																// The ObjectId is a 12 byte MongoDB ObjectId which is actually what is stored in the database.
mongoose.model('Comment', CommentSchema);						// The ref property tesll Mongoose what type of object the ID references.