module.exports = function(app, controllers) {
  app.get('/', controllers.index);
  app.get('/leagues', controllers.leagues);
  app.get('/players/:position', controllers.players);
  app.get('/scraper/:position', controllers.scraper);
  app.get('/search', controllers.search);
  // app.get('/auth/yahoo', passport.authenticate('yahoo'));
  // app.get('/auth/yahoo/return', passport.authenticate('yahoo', {failureRedirect: '/players'}),
  //   function(req, res){
  //     res.redirect('/leagues');
  //   }
  // );  
}