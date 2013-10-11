
/**
 * Module dependencies.
 */

var express = require('express'),
    fs = require('fs'),
    http = require('http'),
    path = require('path'),
    mongo = require('mongodb'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    util = require('util'),
    jsdom = require('jsdom'),
    YahooStrategy = require('passport-yahoo').Strategy; 

// var user = require('./routes/user');


var db = mongoose.connection;
var app = express();

// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function callback(){
//   var Schema = mongoose.Schema,
//       ObjectId = Schema.ObjectId;

//   var playerRankingSchema = new Schema({
//     name: String,
//     position: String,
//     rank: Number
//   });
  
//   playerRankingSchema.methods.greeting = function(){
//     var greeting = this.name ? "My name is " + this.name : "Yolo!";
//     console.log(greeting);
//   }

//   var PlayerRanking = mongoose.model('PlayerRanking', playerRankingSchema, "player_rankings");

// });

mongoose.connect('mongodb://localhost/fantasy_football');

// require('./settings')(app)   
// all environments
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
})

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Models

var models_path = __dirname + '/app/models',
    model_files = fs.readdirSync(models_path);

model_files.forEach(function(file){
  require(models_path + '/' + file);
});

// Routes
var controllers = require('./app/controllers');
var routes_path = __dirname + '/app/routes',
    route_files = fs.readdirSync(routes_path);

route_files.forEach(function(file){
  require(routes_path + '/' + file)(app, controllers);
});

// Controllers

var controllers_path = __dirname + '/app/controllers',
    controller_files = fs.readdirSync(controllers_path);

controller_files.forEach(function(file){
  require(controllers_path + '/' + file);
})

// passport.serializeUser(function(user, done){
//   done(null, user);
// })

// passport.deserializeUser(function(obj, done){
//   done(null, user);
// });

// passport.use(new YahooStrategy({
//     returnURL: 'http://localhost:3000/auth/yahoo/return',
//     realm: 'http://localhost:3000'
//   },
//   function(identifier, profile, done){
//     process.nextTick(function(){
//       profile.identifier = identifier;
//       return done(null, profile);
//     })
//   }
// ));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
