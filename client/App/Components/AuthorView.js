var React = require('react-native');
var MapView = require('react-native-maps');
var Icon = require('react-native-vector-icons/FontAwesome');
var CircleMarker = require('./CircleMarker');
var PhotoView = require('./PhotoView');
var PhotosView = require('./PhotosView');
var api = require('../Utils/api');
var BlackPhotoMarker = require('./BlackPhotoMarker');
var RedPhotoMarker = require('./RedPhotoMarker');

var {
  Navigator,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  StatusBarIOS,
  ActivityIndicatorIOS
} = React;

class Author extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      latitude: this.props.latitude,
      longitude: this.props.longitude,
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

  render() {
    StatusBarIOS.setHidden(true);
    return (
      <View >
        <Text>TEXT</Text>
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
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
    borderColor: '#FF5A5F'
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 30,
    backgroundColor: 'transparent'
  },
  centering: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});

module.exports = Author;