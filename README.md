# meanAPP
MEAN stack application tutorial

The majority of this application is built from the thinkster.io tutorial on building a MEAN stack application. The intent is to have persistent data running to an instance of a MongoDB, have most of the functionality be done through a single page application and use Node.js, some Express.js and lots of great Angular.js.

There are a few dependencies which I need to add to the package.json which now include the following:
 passport
 jsonwebtoken
 express-jwt
 
So a few npm commands to run from within the flapper-news directory for implementing User support - 
 
 npm install jsonwebtoken --save
 
 npm install passport passport-local --save
 
 npm install express-jwt --save
 
  ** Don't forget to require jsonwebtoken in the User model
  
  var jwt = require('jsonwebtoken');
  
  ** Don't forget passport is required in app.js
  
  var passport = require('passport');
