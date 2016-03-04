var userController = require('../users/userController.js');
var photoController = require('../photos/photoController.js');
var stanzaController = require('../stanzas/stanzaController.js');
var audioController = require('../audio/audioController.js');
var helpers = require('./helpers.js');

var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/../audio/uploads/');
  },
  filename: function (req, file, cb) {
    // TODO: change convention of user_id 9
    var userId = req.body.user_id;
    var fileName = userId + Date.now() + '.caf';
    cb(null, fileName);
  }
})
var upload = multer({ storage: storage });

module.exports = function(app, express) {
  // upload photo to imgur and store link in database
  app.post('/imgUpload',
    photoController.uploadPhoto,
    photoController.savePhotoModelToDB);

  // Fetching photos for the map view and user photos
  app.get('/fetchPhotos/', photoController.fetchPhotos);
  app.get('/fetchLocations/', photoController.fetchLocations);
  app.get('/fetchUserPhotos/', photoController.fetchUserPhotos);
  app.get('/fetchUserFavorites/', userController.fetchFavorites);

  // Deal with Stanzas
  app.post('/saveStanza/', stanzaController.saveStanzaModelToDB);
  app.get('/fetchStanzas/', stanzaController.fetchStanzas);
  app.get('/fetchStanzaLocations/', stanzaController.fetchStanzaLocations);
  app.get('/fetchUserStanzas/', stanzaController.fetchUserStanzas);
  app.get('/fetchUserFavoriteStanzas/', userController.fetchFavoriteStanzas);

  // Deal with audio
  app.post('/saveAudio', upload.any(), audioController.saveAudioToDb);
  app.get('/fetchAudios/', audioController.fetchAudios);
  app.get('/fetchAudiosLocations/', audioController.fetchAudiosLocations)
  app.get('/fetchUserAudios/', audioController.fetchUserAudios);


  // Increment views count on photo and add to Favorites
  app.get('/incrementViews/', photoController.incrementViews);
  app.get('/toggleFavorite/', userController.toggleFavorite);
  app.get('/getPhotoData/', userController.getPhotoData);

  // Increment views count on stanzas
  app.get('/incrementStanzaViews/', stanzaController.incrementViews);
  app.get('/toggleStanzaFavorite', userController.toggleStanzaFavorite);
  app.get('/getStanzaData/', userController.getStanzaData);

  // Increment view count on Audios
  app.get('/incrementAudioViews/', audioController.incrementViews);
  // working here.......
  // app.get('/toggleAudiosFavorite', userController.toggleAudiosFavorite);
  // app.get('/getAudiosData/', userController.getAudiosData);

  // Sign in and sign up routes
  app.post('/login', userController.login);
  app.post('/signup', userController.signup);
  app.get('/checkJWT/:JWT', userController.checkJWT);

  // Change user information
  app.post('/changePassword', userController.changePassword);
  app.post('/changeUsername', userController.changeUsername);

  // Handle errors for unsupported requests
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);
};
