var cheerio = require('cheerio'),
    request = require('request'),
    mongoose = require('mongoose'),
    _underscore = require('underscore'),
    Schema = mongoose.Schema;

var Rank = new Schema({
  scoring_system: {type: String, default: '', trim: true},
  best: {type: Number},
  worst: {type: Number},
  average: {type: Number},
  consensus: {type: Number},
  stdev: {type: Number},
  created_at: {type: Date, default: Date.now}
})

var PlayerRankingSchema = new Schema({
  name: {type: String, default: '', trim: true},
  team: {type: String, default: '', trim: true},
  position: {type: String, default: '', trim: true},
  ranks: [Rank],
  created_at: {type: Date, default: Date.now}
});

// PlayerRankingSchema.methods = {
  
// }

PlayerRankingSchema.statics = {
  list: function(){
    var rankings = [];
    rankings = this.find({});
    return rankings;
  },

  scrape: function(pos, callback){
    var _ = require('underscore');
    var _self = this;
    var root_url = "http://www.fantasypros.com/nfl/rankings/";
    var url = root_url + pos + '.php';
    request(url, function(err, res, body){
      if (err) {
        throw err;
      } else {
        $ = cheerio.load(body);
        $('.table').find('tbody').last().find('tr').each(function(index){
          var body_array = _.map($(this.find('td')), function(value){
            return $(value).text();
          })
          var player_name = body_array[1].split(' ')[0] + ' ' + body_array[1].split(' ')[1];
          var team = _.map(body_array[1].split(' '), function(value) {
            if (value[0] == '(') { return value }
          });
          var team_name = _.compact(team)[0].replace('(', '').replace(')', '');
          var ranks = body_array.reverse().slice(0, 4);
          var player_attrs = {
            name: player_name,
            team: team_name,
            position: pos
          }
          // console.log(player_attrs);
          var rank_attrs = {
            scoring_system: 'standard',
            stdev: ranks[0],
            average: ranks[1],
            worst: ranks[2],
            best: ranks[3],
            consensus: index + 1
          }
          _self.findOne({name: player_name}, function(err, person){
            if (person.length == 0) {
              var player = new _self(player_attrs)
              player.ranks.push(rank_attrs);
              player.save();
            } else {
              person.team = team_name;
              person.position = pos;
              person.ranks.push(rank_attrs);
              person.save();
              // _self.update({_id: person.id}, {
              //   name: player_name,
              //   team: team_name,
              //   position: pos
              // });
              // person.ranks.push(rank_attrs);
              // console.log(team_name);
            }
          });

        });
      }

    });
    callback();
  }

}

mongoose.model('PlayerRanking', PlayerRankingSchema, 'player_rankings');
