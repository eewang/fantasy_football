var mongoose = require('mongoose'),
    PlayerRanking = mongoose.model('PlayerRanking');
    _ = require('underscore');

var dir = "../app/views";

exports.index = function(req, res){
  res.render(dir + '/index', { title: 'Express' });
};

exports.leagues = function(req, res){
  res.render('leagues/index', {title: 'League List'});
}

exports.players = function(req, res){
  var position = req.params.position;
  PlayerRanking.find({position: position}, function(err, players){
    res.render(dir + '/players/index', {title: 'Player List', players: players});
  });
}

exports.search = function(req, res){
  var search = req.query.player;
  if (!search) {
    res.render(dir + '/players/search');
  } else {
    PlayerRanking.findOne({name: search}, function(err, player){
      res.render(dir + '/players/show', {player: player});
    });
  }
}

exports.scraper = function(req, res){
  var position = req.params.position;
  PlayerRanking.scrape(position, function(){
    res.redirect('/players/' + position);
  });
}