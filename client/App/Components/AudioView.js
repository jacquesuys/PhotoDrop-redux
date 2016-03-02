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
} = React;

class Audio extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      latitude: this.props.latitude,
      longitude: this.props.longitude,
      recordingNow: false
    };
  }

  componentDidMount(){
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

  _cancelStanza() {
    console.log('cancelling!');
    this.render();
  }

  _startRecording() {
    console.log('Start recording!');
    this.state.recordingNow = true;
  }

  _finishRecording() {
    console.log('Finish recording!');
    this.state.recordingNow = false;
  }

  _toggleRecording() {
    if (this.state.recordingNow) {
      this._finishRecording();
    } else {
      this._startRecording();
    }
  }

  render() {
    StatusBarIOS.setHidden(true);
    return (
      <View style={{ flex: 1, backgroundColor: '#ededed'}} >
        <Text style={styles.pageTitle}>Audio Extravaganza</Text>
        
        <TouchableHighlight  onPress={ this._toggleRecording.bind(this) } style={!this.state.recordingNow && styles.recButton, this.state.recordingNow && styles.recordingNow} underlayColor={'#FC9396'}>
          <Icon name="circle" size={55} color="rgba(237,237,237,0.5)" style={styles.recIcon} />
        </TouchableHighlight>

        <View style={styles.recordBbuttonContainer}>
        

          <TouchableOpacity onPress={_.once(this._cancelStanza.bind(this))} style={styles.noButton}>
            <IconIon name="ios-close-empty" size={60} color="#FC9396" style={styles.noIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.yesButton}>
            <IconIon name="ios-checkmark-empty" size={60} color="#036C69" style={styles.yesIcon} />
          </TouchableOpacity>
        </View>
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
  recordingNow: {
    width: 100,
    height: 100,
    borderRadius: 100,
    alignItems: 'center',
    backgroundColor: 'black',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ededed',
    paddingLeft: 5,
    backgroundColor: 'red'
  },
  recIcon: {
    width: 52.5,
    height: 55,
    backgroundColor: 'transparent'
  }
});

module.exports = Audio;