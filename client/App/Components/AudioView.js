var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var Icon = require('react-native-vector-icons/FontAwesome');
var IconIon = require('react-native-vector-icons/Ionicons');
var api = require('../Utils/api');
var ProgressBar = require('react-native-progress-bar');

var {AudioRecorder, AudioPlayer} = require('../../custom_modules/Audio.ios.js');
var RNFS = require('react-native-fs');

var {
  View,
  StyleSheet,
  Audio,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActionSheetIOS,
  Text,
  StatusBarIOS,
  ActivityIndicatorIOS
} = React;

class AudioView extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      touched: false,
      favorited: false,
      playing: false,
      audioProgress: 0,
      uploader: undefined,
      views: undefined,
      id: this.props.id || this.props.route.id,
      audio: this.props.audio || this.props.route.audio,
      path: this.props.path || this.props.route.path,
      userId: this.props.userId || this.props.route.userId,
      currentFileServerPath: undefined,
    }

    api.getStanzaData(this.state.id, this.state.userId, (data) => {
      var data = JSON.parse(data);
      this.setState({
        views: data.views,
        uploader: data.username,
        favorited: data.favorited
      })
    })
  }

  componentWillUnmount() {
    if(this.props.showStatusBar) {this.props.showStatusBar();}
  }

  componentDidMount() {
    // alert(this.state.audio.filename);

  }

  _closeAudio() {
    this.props.navigator.pop();
    if(this.props.showStatusBar) {this.props.showStatusBar();}
  }

  _favoriteAudio() {
    api.toggleAudioFavorite(this.state.userId, this.state.id, (result) => {
      this.state.favorited ? this.setState({favorited:false}) : this.setState({favorited:true})
    });
  }

  _toggleAudioPlayback() {
    if (this.state.playing) {
      // stop it
      this._stopPlay();
    } else {
      // start it
      this._startPlay();
    }
  }
  _startPlay() {
    AudioPlayer.playWithUrl('http://localhost:8000/' + this.state.audio.filename);
    this.setState({playing: true});
    var self = this;

    AudioPlayer.setProgressSubscription(function(data){
      console.log(data);
      var currentTime = data.currentTime;
      var totalTime = data.currentDuration;
      var statusBar = currentTime / totalTime;
      self.setState({
        audioProgress: statusBar
      })
    });
    AudioPlayer.setFinishedSubscription(function(){
      self.setState({
        playing: false,
        audioProgress: 0
      });
    });
  }
  _stopPlay() {
    AudioPlayer.stop();
    this.setState({
      playing: false,
      audioProgress: 0
    });
  }

  _shareAudio() {} // needs to be here otherwise, error

  _touch() {
    if(this.state.touched===false) {
      this.setState({touched:true});
    } else if(this.state.touched===true) {
      this.setState({touched:false});
    }
    if(this.props.togglePagination) {this.props.togglePagination();}
  }

  render() {
    StatusBarIOS.setHidden(true);
    var username = this.state.uploader ? <Text style={styles.infoText}> Uploaded by: {this.state.uploader} </Text> : null;
    var views = this.state.views ? <Text style={styles.infoText}> Views: {this.state.views} </Text> : null;
    var text = this.state.text;

    return (
        <TouchableWithoutFeedback onPress={this._touch.bind(this)} style={styles.imageContainer}>
          <View style={styles.image} onPress={this._touch.bind(this)}>

            <View style={styles.buttonContainer}>
              <View style={styles.leftContainer}>

                <TouchableOpacity onPress={this._closeAudio.bind(this)} style={styles.closeButton}>
                  <IconIon name="ios-close-empty" size={45} color="white" style={styles.closeIcon} />
                </TouchableOpacity>
              </View>
              <View style={styles.rightContainer}>
                <TouchableOpacity onPress={this._favoriteAudio.bind(this)} style={styles.favoriteButton}>
                  {this.state.favorited ? <Icon name="heart" size={20} color="white" style={styles.favoriteIcon} /> : <Icon name="heart-o" size={20} color="white" style={styles.favoriteIcon} />}
                </TouchableOpacity>
                <TouchableOpacity onPress={this._shareAudio.bind(this)} style={styles.shareButton}>
                  <IconIon name="ios-upload-outline" size={25} color="white" style={styles.shareIcon} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.progressContainer}>
              <ProgressBar
                fillStyle={{}}
                backgroundStyle={{backgroundColor: '#cccccc', borderRadius: 2}}
                style={{marginTop: 10, width: 300}}
                progress={this.state.audioProgress}
              />
            </View>

            <View style={styles.AudioContainer}>


              <TouchableOpacity onPress={this._toggleAudioPlayback.bind(this)} style={styles.playButton}>
                {this.state.playing ?
                  <Icon name="stop" size={35} color="white" style={styles.stopIcon} /> :
                  <Icon name="play" size={35} color="white" style={styles.playIcon} />}
              </TouchableOpacity>
            </View>

          </View>
        </TouchableWithoutFeedback>
      )
  }
}

var styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    backgroundColor: '#ededed'
  },
  image: {
    flex: 1
  },
  buttonContainer:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor:'transparent',
  },
  leftContainer: {
    flex: 1,
  },
  rightContainer:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor:'transparent',
  },
  closeButton:{
    width:50,
    height:50,
    backgroundColor:'rgba(0,0,0,0.3)',
    borderRadius:35,
    alignItems:'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    margin: 15,
  },
  shareButton:{
    width:50,
    height:50,
    backgroundColor:'rgba(0,0,0,0.3)',
    borderRadius:35,
    alignItems:'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    marginRight: 15,
    marginTop: 15
  },
  favoriteButton:{
    width:50,
    height:50,
    backgroundColor:'rgba(0,0,0,0.3)',
    borderRadius:35,
    alignItems:'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    marginTop: 15,
    marginRight: 5,
  },
  playButton:{
    width:100,
    height:100,
    backgroundColor:'rgba(0,0,0,0.3)',
    borderRadius:50,
    alignItems:'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    marginTop: 15,
    marginRight: 5,
  },
  playIcon:{
    width:35,
    height:35,
    paddingTop: 0,
    paddingLeft: 0,
    marginLeft: 15
  },
  stopIcon:{
    width:35,
    height:35,
    paddingTop: 0,
    paddingLeft: 0,
    marginLeft: 7.5
  },
  closeIcon:{
    width:60,
    height:60,
    paddingTop: 7,
    paddingLeft: 21
  },
  shareIcon:{
    width:60,
    height:35,
    paddingTop: 4,
    paddingLeft: 22
  },
  favoriteIcon:{
    width:35,
    height:35,
    paddingTop: 7.5,
    paddingLeft: 7.5
  },
  infoText:{
    fontSize: 16,
    fontFamily: 'circular',
    color: 'black'
  },
  AudioText:{
    fontSize: 30,
    fontFamily: 'circular'
  },
  AudioContainer:{
    position: 'absolute',
    top: 150,
    left: 140
  },
  progressContainer: {
    position: 'absolute',
    top: 120,
    left: 35
  }
});

module.exports = AudioView;
