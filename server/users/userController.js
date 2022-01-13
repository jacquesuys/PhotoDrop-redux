var Q = require('q');
var User = require('./userModel');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var Photo = require('./../photos/photoModel');
var Stanza = require('./../stanzas/stanzaModel');

var findUser = Q.nbind(User.findOne, User);
var createUser = Q.nbind(User.create, User);

module.exports = {
  login: function(req, res, next) {
    var user = JSON.parse(Object.keys(req.body)[0]);
    var username = user.username;
    var password = user.password;

    findUser({ username: username })
      .then(function(user) {
        if (!user) {
          next(new Error('User does not exist'));
        } else {
          return user.comparePasswords(password)
            .then(function(foundUser) {
              if (foundUser) {
                var token = jwt.sign({ username: username, userId: user._id }, 'FRANKJOEVANMAX');
                res.json({ userId: user._id, token: token });
              } else {
                return next(new Error('Incorrect password'));
              }
            });
        }
      })
      .fail(function(error) {
        next(error);
      });
  },

  signup: function(req, res, next) {
    var user = JSON.parse(Object.keys(req.body)[0]);
    var username = user.username;
    var password = user.password;

    findUser({ username: username })
      .then(function(user) {
        if (user) {
          next(new Error('User already exist!'));
        } else {
          return createUser({
            username: username,
            password: password
          }).then(function(user) {
            console.log('Created user', user);
              // Generate JWT for user here
              // params: payload, secret key, encryption, callback
            var token = jwt.sign({ username: user.username, userId: user._id }, 'FRANKJOEVANMAX');
            console.log('token created', token);
            res.json({ token: token, userId: user._id, username: user.username });
            next();
          }).catch(function(err) {
            console.error('problem creating user', err);
          });
        }
      })
      .fail(function(error) {
        next(error);
      });
  },

  checkJWT: function(req, res, next) {
    console.log('imcomming GET for JWT', req.params.JWT);
    var decoded = jwt.verify(req.params.JWT, 'FRANKJOEVANMAX', function(err, decoded) {
      if (err) {
        console.log('problem decoding', err);
      } else {
        // send back decoded.userId and decoded.username
        res.json({ username: decoded.username, userId: decoded.userId });
        next();
      }
    });
    // send back user id
  },

  changePassword: function(req, res, next) {
    var user = JSON.parse(Object.keys(req.body)[0]);
    var username = user.username;
    var password = user.password;
    var newPassword = user.newPassword;

    findUser({ username: username })
      .then(function(user) {
        if (!user) {
          next(new Error('User does not exist!'));
        } else {
          return user.comparePasswords(password)
            .then(function(foundUser) {
              user.password = newPassword;
              user.save(function(err, savedUser) {
                if (err) {
                  next(err);
                }
                res.json();
              });
            }).catch(function(err) {
              console.error('problem changing user info', err);
            });
        }
      })
      .fail(function(error) {
        next(error);
      });
  },

  changeUsername: function(req, res, next) {
    var user = JSON.parse(Object.keys(req.body)[0]);
    var username = user.username;
    var newUsername = user.newUsername;

    findUser({ username: username })
      .then(function(user) {
        if (!user) {
          next(new Error('User does not exist!'));
        } else {
          user.username = newUsername;
          user.save(function(err, savedUser) {
            if (err) {
              next(err);
            }
            res.json({ username: savedUser.username });
          });
        }
      })
      .fail(function(error) {
        next(error);
      });
  },

  toggleFavorite: function(req, res, next) {
    var url = req.query.url;
    User.findOne({ _id: mongoose.mongo.ObjectID(req.query.userId) }, function(err, user) {
      if (err) {
        next(err);
      }
      if (!user) {
        console.error('User was not found TOGGLEFAV');
      } else {
        if (user.favorites.indexOf(url) === -1) {
          user.favorites.push(url);
        } else {
          user.favorites.splice(user.favorites.indexOf(url), 1);
        }
        user.save(function(err, savedUser) {
          res.json();
        });
      }
    });
  },

  getPhotoData: function(req, res, next) {
    var currentUserId = req.query.userId;
    Photo.findOne({ url: req.query.url }, function(err, photo) {
      if (err) {
        console.log(err);
      }
      if (photo) {
        User.findOne({ _id: mongoose.mongo.ObjectID(photo.userId) }, function(err, user) {
          if (err) {
            next(err);
          }
          if (!user) {
            console.error('User was not found');
          } else {
            User.findOne({ _id: mongoose.mongo.ObjectID(currentUserId) }, function(err, user) {
              if (err) {
                next(err);
              }
              if (!user) {
                console.error('User was not found 2');
              } else {
                var favorited = (user.favorites.indexOf(req.query.url) === -1);
                res.json({ username: user.username, views: photo.views, favorited: !favorited });
              }
            });
          }
        });
      }
    });
  },

  getStanzaData: function(req, res, next) {
    var currentUserId = req.query.userId;
    Stanza.findOne({ _id: mongoose.mongo.ObjectID(req.query.id) }, function(err, stanza) {
      if (err) {
        console.log(err);
      }
      if (stanza) {
        User.findOne({ _id: mongoose.mongo.ObjectID(stanza.userId) }, function(err, user) {
          if (err) {
            next(err);
          }
          if (!user) {
            console.error('User was not found --- getStanzaData');
          } else {
            User.findOne({ _id: mongoose.mongo.ObjectID(currentUserId) }, function(err, user) {
              if (err) {
                next(err);
              }
              if (!user) {
                console.error('User was not found --- getStanzaData 2');
              } else {
                var favorited = (user.favoriteStanzas.indexOf(req.query.id) === -1);
                res.json({ username: user.username, views: stanza.views, favorited: !favorited });
              }
            });
          }
        });
      }
    });
  },

  getAudiosData: function(req, res, next) {
    var currentUserId = req.query.userId;
    Audio.findOne({ _id: mongoose.mongo.ObjectID(req.query.id) }, function(err, audio) {
      if (err) {
        console.log(err);
      }
      if (audio) {
        User.findOne({ _id: mongoose.mongo.ObjectID(audio.userId) }, function(err, user) {
          if (err) {
            next(err);
          }
          if (!user) {
            console.error('User was not found --- getAudioData');
          } else {
            User.findOne({ _id: mongoose.mongo.ObjectID(currentUserId) }, function(err, user) {
              if (err) {
                next(err);
              }
              if (!user) {
                console.error('User was not found --- getAudioData 2');
              } else {
                var favorited = (user.audioFavorites.indexOf(req.query.id) === -1);
                res.json({ username: user.username, views: audio.views, favorited: !favorited });
              }
            });
          }
        });
      }
    });
  },

  fetchFavorites: function(req, res, next) {
    User.findOne({ _id: mongoose.mongo.ObjectID(req.query.userId) }, function(err, user) {
      if (err) {
        next(err);
      }
      if (!user) {
        console.error('User was not found');
      } else {
        res.json(user.favorites);
      }
    });
  },

  fetchFavoriteStanzas: function(req, res, next) {
    User.findOne({ _id: mongoose.mongo.ObjectID(req.query.userId) }, function(err, user) {
      if (err) {
        next(err);
      }
      if (!user) {
        console.error('User was not found');
      } else {
        var counter = 0;
        var length = user.favoriteStanzas.length;
        var stanzas = [];
        var sendResponse = function(stanzas) {
          res.json(stanzas);
        };
        if(length === 0) {
          res.json();
        }
        user.favoriteStanzas.forEach(function(stanzaId) {
          Stanza.findOne({_id: mongoose.mongo.ObjectID(stanzaId)}, function(err, stanza) {
            if(err) {
              next(err);
            } else {
              stanzas.push(stanza);
              counter++;
              if(counter === length) {
                sendResponse(stanzas);
              }
            }
          });
        });
      }
    });
  },

  toggleStanzaFavorite: function(req, res, next) {
    var id = req.query.id;
    User.findOne({ _id: mongoose.mongo.ObjectID(req.query.userId) }, function(err, user) {
      if (err) {
        next(err);
      }

      if (!user) {
        console.error('User was not found TOGGLE STANZSA FAV');
      } else {
        if (user.favoriteStanzas.indexOf(id) === -1) {
          user.favoriteStanzas.push(id);
        } else {
          user.favoriteStanzas.splice(user.favoriteStanzas.indexOf(id), 1);
        }
        user.save(function(err, savedUser) {
          res.json();
        });
      }
    });
  },

  fetchFavoriteAudios: function(req, res, next) {
    User.findOne({ _id: mongoose.mongo.ObjectID(req.query.userId) }, function(err, user) {
      if (err) {
        next(err);
      }
      if (!user) {
        console.error('User was not found');
      } else {
        var counter = 0;
        var length = user.favoriteAudios.length;
        var audios = [];
        var sendResponse = function(audios) {
          res.json(audios);
        };
        if(length === 0) {
          res.json();
        }
        user.favoriteAudios.forEach(function(audioId) {
          Audio.findOne({_id: mongoose.mongo.ObjectID(audioId)}, function(err, audio) {
            if(err) {
              next(err);
            } else {
              audios.push(audio);
              counter++;
              if(counter === length) {
                sendResponse(audios);
              }
            }
          });
        });
      }
    });
  },

  toggleAudioFavorite: function(req, res, next) {
    var id = req.query.id;
    User.findOne({ _id: mongoose.mongo.ObjectID(req.query.userId) }, function(err, user) {
      if (err) {
        next(err);
      }

      if (!user) {
        console.error('User was not found TOGGLE AUDIOPIFOIO FAV');
      } else {
        if (user.favoriteAudios.indexOf(id) === -1) {
          user.favoriteAudios.push(id);
        } else {
          user.favoriteAudios.splice(user.favoriteAudios.indexOf(id), 1);
        }
        user.save(function(err, savedUser) {
          res.json();
        });
      }
    });
  }

};
