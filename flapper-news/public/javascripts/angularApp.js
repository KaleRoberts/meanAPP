// Notes live up here as I go along learning
// Node.js is a forked version of the js vm that runs in Chrome aka V8 like the drink.
// And the engine

// Node is a runtime
// Node is all server side, it is a server side technology

/*KNR 08/31/2015 Newest revision. Testing commit and push to GitHub */


(function () {
	"use strict";
	var app = angular.module('flapperNews', ['ui.router']);


	app.factory('posts', ['$http', function($http){
		var o = {
			 posts: []
		};
		
		o.getAll = function() {
			return $http.get('/posts').success(function(data){		// Query for all the posts from our server
				angular.copy(data, o.posts);
			});
		};

		o.create = function(post) {
			return $http.post('/posts', post).success(function(data){	// Creates posts on the backend
				o.posts.push(data);
			});
		};

		o.upvote = function(post) {
			return $http.put('/posts/' + post._id + '/upvote')			// Upvotes posts on the backend, persists votes
			.success(function(data){
				post.upvotes += 1;
			});
		};

		// o.downvote = function(post) {								// Flesh this functionality out for downvotes. Because things need to be downvoted :)
		// 	return $http.put('/posts/' + post._id + '/downvote')
		// 	.success(function(data){
		// 		post.upvotes -+ 1;
		// 	});
		// };

		o.get = function(id) {
			return $http.get('/posts/' + id).then(function(res){
				return res.data;
			});
		};

		o.addComment = function(id, comment) {
			return $http.post('/posts/' + id + '/comments', comment);
		};

		o.upvoteComment = function(post, comment) {
  			return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote')
   		 	.success(function(data){
      			comment.upvotes += 1;
    		});
		};

		return o;
	}]);

/*
	app.factory('posts', [  // posts is the id of the compenent (dependency you can inject later), when you add the id of the compenent you use posts as the identifier
		function () {		// This is merely a test factory that can be injected.
			var b = {		// This might be a good way to mock out the posts factory?
				"posts": [
					{
						title: "This is the title",
						link: "a cool link",
						upvotes: 0,
						comments: [
							{author: 'Kale', body: 'Cool post Kale!', upvotes: 10},
							{author: 'James', body: 'Great idea but everything is wrong!', upvotes: 0}
						]
					}
				]
			}

		return b;
		}
	]);

	app.factory('posts2', [   // This is to illustrate dependency injection and how you can ask for dependencies, again posts2 is the just alias for this factory. Dependency injection for this factory is going to be posts2
		'posts',		      // Asking for, "posts" factory here, the function takes posts as an argument and then just returns the posts factory.
		function (posts) {	  // This factory is an just an example.
			return posts;
		}
	]);
*/

	app.config([
		'$stateProvider',		// I'm asking for $stateProvider REQUEST
		'$urlRouterProvider',
		function($stateProvider, $urlRouterProvider){		//  Here's where they are giving it to me PROVIDE

			$stateProvider
				.state('home', {
					url: '/home',
					templateUrl: '/home.html',				// USE
					controller: 'MainCtrl',
					resolve: {										// We're using the resolve property of uik-router to ensure that posts are loaded
						postPromise: ['posts', function(posts){		// Anytime the home state is entered we automatically query all posts from the backend before the state actually finishes loading.
							return posts.getAll();
						}]
					}									
				})															
				.state ('posts', {
					url: '/posts/{id}',
					templateUrl: '/posts.html',
					controller: 'PostsCtrl',
					resolve: {
						post: ['$stateParams', 'posts', function($stateParams, posts) {
							return posts.get($stateParams.id);
						}]
					}
				});
				
			$urlRouterProvider.otherwise('home');
		}]);

	app.controller('MainCtrl', [
		'$scope',
		'posts',
		function($scope, posts){
				$scope.test = 'Hello World!';
				$scope.posts = posts.posts;
				// [
				// 	{title: 'post 1', upvotes: 5},
				// 	{title: 'post 2', upvotes: 2},
				// 	{title: 'post 3', upvotes: 15},
				// 	{title: 'post 4', upvotes: 9},
				// 	{title: 'post 5', upvotes: 4},
				// ];
				$scope.addPost = function(){
					if(!$scope.title || $scope.title === '') {return;}
					posts.create({						// This is persistent data. We are creating posts on the backend now, this will save posts to the server.
						title: $scope.title,
						link: $scope.link,
					});
					// $scope.posts.push({				// This serves as a local array for posts, this is not persistent data
					// 	title: $scope.title,
					// 	link: $scope.link,
					// 	upvotes: 0,
					// 	comments: [
					// 		{author: 'Kale', body: 'Cool post Kale!', upvotes: 10},
					// 		{author: 'James', body: 'Great idea but everything is wrong!', upvotes: 0}
					// 	]
					// });
					$scope.title = '';
					$scope.link = '';
				};
				$scope.incrementUpvotes = function(post){
					posts.upvote(post);
					// posts.upvotes += 1;
				};
				// $scope.decrementUpvotes = function(post){
				// 	posts.downvote(post);
				// };
		}]);

	app.controller('PostsCtrl', [
		'$scope',					// Don't ask me why this actually works. I thought I was supposed to have postsA in here since that's my factory with all of the working functions.
		'posts',					// I know this is my factory, so it has to be part of the dependencies
		'post',						// I guess post is filling in for $stateParams?
		function($scope, posts, post){
			$scope.post = post;
			// $scope.post = posts.posts[$stateParams.id];		// $stateParams.id ties each comment to a post by {id}
			
			// When refreshing if there isn't a post then you don't get a page
			// TODO: Find out how to implement this later
			// if($scope.post === undefined) {go to MainCtrl;}
			$scope.addComment = function(){
				if($scope.body === '') { return; }
					posts.addComment(post._id, {
						body: $scope.body,
						author: 'user',
					}).success(function(comment) {
						$scope.post.comments.push(comment);
					});
					// $scope.post.comments.push({
					// 	body: $scope.body,
					// 	author: 'user',
					// 	upvotes: 0
					// });
					$scope.body = '';
			};
			$scope.incrementUpvotes = function(comment){
				posts.upvoteComment(post, comment);
			};
		}]);
}());

// So far I'm not able to access the comments view.
// Looks like I have all the correct functionality built in but I'm not hitting the comments view for some reason
// TODO: Figure that out dude!
// I figured this out with Kevin's help. Was missing a / after post/{id}

// Get the handle on Angular and the concepts and then move to making Unit Test on your code
// This is further down the line though
