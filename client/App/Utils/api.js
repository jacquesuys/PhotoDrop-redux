var RNUploader = require('NativeModules').RNUploader;
var RNFS = require('react-native-fs');

var api = {
  login(username, password) {
    var user = { username: username, password: password };
    var url = 'http://localhost:8000/login';
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(user)
    });
  },

  signup(username, password) {
    var user = { username: username, password: password };
    return fetch('http://localhost:8000/signup', {
      method: 'POST',
      body: JSON.stringify(user)
    });
  },

  changePassword(username, password, newPassword) {
    var user = { username: username, password: password, newPassword: newPassword };
    return fetch('http://localhost:8000/changePassword', {
      method: 'POST',
      body: JSON.stringify(user)
    });
  },

  changeUsername(username, newUsername) {
    var user = { username: username, newUsername: newUsername };
    return fetch('http://localhost:8000/changeUsername', {
      method: 'POST',
      body: JSON.stringify(user)
    });
  },

  checkJWT(JWT, callback) {
    var url = 'http://localhost:8000/checkJWT/' + JWT;
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(userData) { // handle error here for some reason catch was not working
      if (userData.status === 404) {
        console.log('Problem with GET request for JWT');
      } else {
        callback(userData._bodyInit);
      }
    });
  },

  uploadPhoto(data, latitude, longitude, userId, callback) {
    var url = 'http://localhost:8000/imgUpload';
    // cut data in half
    var firstHalf = data.slice(0, Math.floor(data.length / 2));
    var secondHalf = data.slice(Math.floor(data.length / 2));
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: firstHalf,
        latitude: latitude,
        longitude: longitude,
        userId: userId
      })
    }).then(function() {
      fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: secondHalf,
          latitude: latitude,
          longitude: longitude,
          userId: userId
        })
      }).then(function(res) {
        callback(res._bodyText);
      }).catch(function(err) { console.log(err); });
    }).catch(function(err) { console.log(err); });
  },

  fetchPhotos(latitude, longitude, radius, callback) {
    var url = 'http://localhost:8000/fetchPhotos?lat=' + latitude + '&lon=' + longitude + '&radius=' + radius;
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(photos) {
      callback(photos._bodyInit);
    })
    .catch(function(err) {
      console.log(err);
    });
  },

  fetchLocations(latitude, longitude, latdelta, londelta, callback) {
    var url = 'http://localhost:8000/fetchLocations?lat=' + latitude + '&lon=' + longitude + '&latdelta=' + latdelta + '&londelta=' + londelta;
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(photos) {
      callback(photos._bodyInit);
    })
    .catch(function(err) {
      console.log(err);
    });
  },

  fetchUserPhotos(userId, callback) {
    var url = 'http://localhost:8000/fetchUserPhotos?userId=' + userId;
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(photos) {
      callback(photos._bodyInit);
    })
    .catch(function(err) {
      console.log(err);
    });
  },

  fetchUserFavorites(userId, callback) {
    var url = 'http://localhost:8000/fetchUserFavorites?userId=' + userId;
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(photos) {
      callback(photos._bodyInit);
    })
    .catch(function(err) {
      console.log(err);
    });
  },

  incrementViews(url, callback) {
    var url = 'http://localhost:8000/incrementViews?url=' + url;
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(result) {
      callback(result._bodyInit);
    })
    .catch(function(err) {
      console.log(err);
    });
  },

  toggleFavorite(userId, url, callback) {
    var url = 'http://localhost:8000/toggleFavorite?userId=' + userId + '&url=' + url;
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(result) {
      callback(result._bodyInit);
    })
    .catch(function(err) {
      console.log(err);
    });
  },

  getPhotoData(url, userId, callback) {
    var url = 'http://localhost:8000/getPhotoData?url=' + url + '&userId=' + userId;
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(data) {
      callback(data._bodyInit);
    })
    .catch(function(err) {
      console.log(err);
    });
  },

  saveStanza(data, latitude, longitude, userId, callback) {
    console.log('about to try to save a stanza');
    var url = 'http://localhost:8000/saveStanza';
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: data,
        latitude: latitude,
        longitude: longitude,
        userId: userId
      })
    }).then(function(res) {
        callback(res._bodyText);
    }).catch(function(err) { console.log(err); });
  },

  fetchStanzas(latitude, longitude, radius, callback) {
    var url = 'http://localhost:8000/fetchStanzas?lat=' + latitude + '&lon=' + longitude + '&radius=' + radius;
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(stanzas) {
      callback(stanzas._bodyInit);
    })
    .catch(function(err) {
      console.log(err);
    });
  },

  fetchStanzaLocations(latitude, longitude, latdelta, londelta, callback) {
    var url = 'http://localhost:8000/fetchStanzaLocations?lat=' + latitude + '&lon=' + longitude + '&latdelta=' + latdelta + '&londelta=' + londelta;
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(stanzas) {
      callback(stanzas._bodyInit);
    })
    .catch(function(err) {
      console.log(err);
    });
  },

  fetchUserStanzas(userId, callback) {
    var url = 'http://localhost:8000/fetchUserStanzas?userId=' + userId;
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(stanzas) {
      callback(stanzas._bodyInit);
    })
    .catch(function(err) {
      console.log(err);
    });
  },

  fetchUserFavoriteStanzas(userId, callback) {
    var url = 'http://localhost:8000/fetchUserFavoriteStanzas?userId=' + userId;
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(stanzas) {
      callback(stanzas._bodyInit);
    })
    .catch(function(err) {
      console.log(err);
    });
  },


  incrementStanzaViews(id, callback) {
    var url = 'http://localhost:8000/incrementStanzaViews?id=' + id;
    console.log(" CALLING tHE INCREMENT WITH AN ID ---- ", id);
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(result) {
      callback(result._bodyInit);
    })
    .catch(function(err) {
      console.log(err);
    });
  },

  getStanzaData(id, userId, callback) {
    var url = 'http://localhost:8000/getStanzaData?id=' + id + '&userId=' + userId;
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(data) {
      callback(data._bodyInit);
    })
    .catch(function(err) {
      console.log(err);
    });
  },

  toggleStanzaFavorite(userId, id, callback) {
    var url = 'http://localhost:8000/toggleStanzaFavorite?userId=' + userId + '&id=' + id;
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(result) {
      callback(result._bodyInit);
    })
    .catch(function(err) {
      console.log(err);
    });
  },

  uploadAudio(currentFileName, latitude, longitude, userId, callback) {
    console.log('arguments=======================================', arguments);
    var audioFilePath = RNFS.DocumentDirectoryPath  + '/' + currentFileName;

      let files = [{
        filename: currentFileName,
        filepath: audioFilePath
      }];

      let opts = {
      // TODO: Don't forget to change this to a real server!
        url: 'http://localhost:8000/saveAudio/',
        files: files,
        method: 'POST',
        // TODO: maybe fix this to a convention!
        params: {
          'user_id': userId,
          'latitude': latitude,
          'longitude': longitude
        }
      };

      RNUploader.upload( opts, (err, res) => {
        if( err ){
            console.log('Upload Error', err);
            return;
        }

        let status = res.status;
        let responseString = res.data;
        // let json = JSON.parse( responseString );

        console.log('upload complete with status: ', status, responseString);
      });
  },

  incrementAudioViews(id, callback) {
    var url = 'http://localhost:8000/incrementAudioViews?id=' + id;
    console.log(" CALLING tHE INCREMENT WITH AN ID ---- ", id);
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(result) {
      callback(result._bodyInit);
    })
    .catch(function(err) {
      console.log(err);
    });
  },
  fetchAudios(latitude, longitude, radius, callback) {
    var url = 'http://localhost:8000/fetchAudios?lat=' + latitude + '&lon=' + longitude + '&radius=' + radius;
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(audios) {
      callback(audios._bodyInit);
    })
    .catch(function(err) {
      console.log(err);
    });
  },
  fetchAudiosLocations(latitude, longitude, latdelta, londelta, callback) {
    var url = 'http://localhost:8000/fetchAudiosLocations?lat=' + latitude + '&lon=' + longitude + '&latdelta=' + latdelta + '&londelta=' + londelta;
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(stanzas) {
      callback(stanzas._bodyInit);
    })
    .catch(function(err) {
      console.log(err);
    });
  }

};

module.exports = api;
