function playerRanking(name){
  this.name = name;
  this.rank, this.position;
}

playerRanking.prototype = {
  constructor: playerRanking,
  greeting: function(){
    return "Name: " + this.name + ", rank: " + this.rank + ", position: " + this.position;
  },
  setRank: function(rank){
    this.rank = rank;
    return this.rank;
  },
  setPosition: function(position) {
    this.position = position;
    return this.position;
  }
}

var cheerio = require('cheerio');
var request = require('request');

var positions = ['qb', 'rb', 'wr', 'te']
var root_url = "http://www.fantasypros.com/nfl/rankings/";
var position;
for (pos in positions) {
  position = positions[pos];
  var url = root_url + position + '.php';
  request(url, function(err, res, body){
    if (err) {
      throw err;
    } else {
      $ = cheerio.load(body);
      // debugger
      $('.table').find('tbody').last().find('tr').each(function(index){
        // console.log($(this).find('td:nth-child(2)').text());

        var text = $(this).find('td:nth-child(2)').text().split(' ');
        var name = text[0] + ' ' + text[1];
        var player = new playerRanking(name);
        player.setRank(index + 1);
        console.log(position);
        player.setPosition(position);
        console.log(player.greeting());
      });
    }
    console.log('-------------BREAK------------');
  });
}