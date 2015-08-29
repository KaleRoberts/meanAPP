// Notes live up here as I go along learning
// Node.js is a forked version of the js vm that runs in Chrome aka V8 like the drink.
// And the engine

// Node is a runtime
// Node is all server side, it is a server side technology


(function () {
	"use strict";
	var app = angular.module('flapperNews', ['ui.router']);


	app.factory('posts', [function(){
		var o = {
			posts: []
		};
		return o;
	}]);

	app.factory('posts', [  // posts is the id of the compenent (dependency you can inject later), when you add the id of the compenent you use posts as the identifier
		function () {
			var b = {
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

	app.factory('posts2', [
		'posts',
		function (posts) {
			return posts;
		}
	]);

	app.config([
		'$stateProvider',		// I'm asking for $stateProvider REQUEST
		'$urlRouterProvider',
		function($stateProvider, $urlRouterProvider){		//  Here's where they are giving it to me  PROVIDE

			$stateProvider
				.state('home', {
					url: '/home',
					templateUrl: '/home.html',
					controller: 'MainCtrl'									//USE
				})															
				.state ('posts', {
					url: '/posts/{id}',
					templateUrl: '/posts.html',
					controller: 'PostsCtrl'
				});
				
			$urlRouterProvider.otherwise('home');
		}]);

	app.controller('MainCtrl', [
		'$scope',
		'posts2',
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
					$scope.posts.push({
						title: $scope.title,
						link: $scope.link,
						upvotes: 0,
						comments: [
							{author: 'Kale', body: 'Cool post Kale!', upvotes: 10},
							{author: 'James', body: 'Great idea but everything is wrong!', upvotes: 0}
						]
					});
					$scope.title = '';
					$scope.link = '';
				};
				$scope.incrementUpvotes = function(post){
					post.upvotes += 1;
				};
		}]);

	app.controller('PostsCtrl', [
		'$scope',
		'$stateParams',
		'posts',
		function($scope, $stateParams, posts){
			$scope.post = posts.posts[$stateParams.id];

			// When refreshing if there isn't a post then you don't get a page
			// if($scope.post === undefined) {go to MainCtrl;}
			$scope.addComment = function(){
				if($scope.body === '') { return; }
					$scope.post.comments.push({
						body: $scope.body,
						author: 'user',
						upvotes: 0
				});
				$scope.body = '';
			};
		}]);
}());

// So far I'm not able to access the comments view.
// Looks like I have all the correct functionality built in but I'm not hitting the comments view for some reason
// TODO: Figure that out dude!

// Get the handle on Angular and the concepts and then move to making Unit Test on your code