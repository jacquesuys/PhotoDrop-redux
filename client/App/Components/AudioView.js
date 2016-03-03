var React = require('react-native');
var MapView = require('react-native-maps');
var Icon = require('react-native-vector-icons/FontAwesome');
var CircleMarker = require('./CircleMarker');
var PhotoView = require('./PhotoView');
var PhotosView = require('./PhotosView');
var api = require('../Utils/api');
var BlackPhotoMarker = require('./BlackPhotoMarker');
var RedPhotoMarker = require('./RedPhotoMarker');
var IconIon = require('react-native-vector-icons/Ionicons');

var {AudioRecorder, AudioPlayer} = require('react-native-audio');

var {
  Navigator,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  StatusBarIOS,
  ActivityIndicatorIOS,
  TextInput,
  Component,
  DeviceEventEmitter,
  AlertIOS,
  AppRegistry
} = React;

class Audio extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      latitude: this.props.latitude,
      longitude: this.props.longitude,
      userId: this.props.userId || this.props.route.userId,

      recordingNow: false,
      stoppedRecording: false,
      stoppedPlaying: false,
      playing: false,
      finished: false,
      currentTime: null,
      recordingStatusText: null,
      currentFileName: null
    };
  }

  componentDidMount(){

    // upload progress
    DeviceEventEmitter.addListener('RNUploaderProgress', (data)=>{
      let bytesWritten = data.totalBytesWritten;
      let bytesTotal   = data.totalBytesExpectedToWrite;
      let progress     = data.progress;

      console.log('Bytes Total', bytesTotal);
      console.log('Bytes Written', bytesWritten);

      console.log( "upload progress: " + progress + "%");
    });

    AudioRecorder.onProgress = (data) => {
      console.log('On audio rec progress-------------------');
      // TODO: parse into nice timestamp here...
      var parsedTimeStamp = Math.round(data.currentTime);
      this.state.recordingStatusText = 'Recording...';
      this.setState({currentTime: parsedTimeStamp });
    };
    AudioRecorder.onFinished = (data) => {
      this.state.recordingStatusText = null;
      this.state.currentTime = null;
      this.setState({finished: data.finished});
      console.log(`Finished recording: ${data.finished}`)
    };

    setInterval(()=> {
      if(this.props.params.index===1) {
        navigator.geolocation.getCurrentPosition(
          location => {
            this.setState({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            });
          }
        );
      }
    }, 2000)
  }

  doUpload(){
    api.uploadAudio(this.state.currentFileName, this.state.latitude, this.state.longitude, this.state.userId, function() {
      console.log('Callback fires!');
    });
  }

  _startRecording() {
    // console.log('Start recording!');
    this.state.recordingNow = true;
    var fileToSave = Date.now() + '.caf';
    this.state.currentFileName = fileToSave;

    AudioRecorder.prepareRecordingAtPath('/' + fileToSave);
    AudioRecorder.startRecording();
  }

  _finishRecording() {
    // console.log('Finish recording!');
    this.state.recordingNow = false;
    AudioRecorder.stopRecording();

  }

  _toggleRecording() {
    if (this.state.recordingNow) {
      this._finishRecording();
    } else {
      this._startRecording();
    }
  }

  _cancelRecording() {
    console.log('Cancel recording-----------');
    this.state.currentFileName = null;
  }


  render() {
    StatusBarIOS.setHidden(true);
    return (
      <View style={{ flex: 1, backgroundColor: '#ededed'}} >
        <Text style={styles.pageTitle}>Audio Extravaganza</Text>
        
        <View style={styles.recordBbuttonContainer}>
        
          <TouchableHighlight  onPress={ this._toggleRecording.bind(this) } style={styles.recButton} underlayColor={'#FC9396'}>
            <Icon name="circle" size={55} color="rgba(237,237,237,0.5)" style={styles.recIcon} />
          </TouchableHighlight>

        </View>
          <Text style={styles.recTime}>{this.state.recordingStatusText}</Text>
          <Text style={styles.recTime}>{this.state.currentTime}</Text>

        <TouchableOpacity onPress={ this._cancelRecording.bind(this) } style={styles.noButton}>
          <IconIon name="ios-close-empty" size={60} color="#FC9396" style={styles.noIcon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={ this.doUpload.bind(this, ) } style={styles.yesButton}>
          <IconIon name="ios-checkmark-empty" size={60} color="#036C69" style={styles.yesIcon} />
        </TouchableOpacity>
      </View>
    );
  }
};

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  pageTitle: {
    top: 10,
    fontSize: 18,
    fontFamily: 'circular',
    textAlign: 'center',
    color: '#565b5c'
  },
  input: {
    height: 300, 
    borderColor: 'gray', 
    borderWidth: 5, 
    borderRadius: 5,
    fontSize: 30,
    margin: 20,
    padding: 20,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  yesButton: {
    width: 50,
    height: 50,
    backgroundColor: 'transparent',
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    margin: 15,
  },
  yesIcon: {
    width: 60,
    height: 60,
    marginLeft: 37
  },
  noButton: {
    width: 50,
    height: 50,
    backgroundColor: 'transparent',
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    margin: 15,
  },
  noIcon: {
    width: 60,
    height: 60,
    marginLeft: 37
  },
  recordBbuttonContainer: {
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'center',
    marginTop: 150,
    marginBottom: 15
  },
  recButton: {
    width: 100,
    height: 100,
    borderRadius: 100,
    alignItems: 'center',
    backgroundColor: 'black',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ededed',
    paddingLeft: 5
  },
  recIcon: {
    width: 52.5,
    height: 55,
    backgroundColor: 'transparent'
  },
  recTime: {
    fontSize: 25
  }
});

module.exports = Audio;