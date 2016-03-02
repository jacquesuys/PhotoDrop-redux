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
  ActivityIndicatorIOS,
  TextInput
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
      <View style={{ flex: 1, backgroundColor: '#ededed'}}>
        <Text style={styles.pageTitle}>Stanza Bonanza</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
          multiline={true}
        />
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
  centering: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});

module.exports = Author;