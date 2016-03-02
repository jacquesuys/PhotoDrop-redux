var React = require('react-native');
var Icon = require('react-native-vector-icons/FontAwesome');
var api = require('../Utils/api');
var IconIon = require('react-native-vector-icons/Ionicons');
var NavigationBar = require('react-native-navbar');

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

  _clearText(){
    // this._textInput.setNativeProps({text:''});
    this.setState({text:''});
  }

  _saveText(text) {
    api.saveStanza(this.state.text, this.state.latitude, this.state.longitude, this.props.userId, (res) => 
    {
      this._clearText.bind(this);
    });
  }

  render() {
    StatusBarIOS.setHidden(true);
    var pageTitle = (
      <Text style={styles.pageTitle}>Stanza Bonanza</Text>
    );
    return (
      <View style={{ flex: 1, backgroundColor: '#ededed'}}>
        <NavigationBar 
          title={pageTitle} 
          tintColor={"white"}
        />
        <TextInput
          ref={component => this._textInput = component}
          style={styles.input}
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
          multiline={true}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={_.once(this._clearText.bind(this))} style={styles.noButton}>
            <IconIon name="ios-close-empty" size={60} color="#FC9396" style={styles.noIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={_.once(this._saveText.bind(this))} style={styles.yesButton}>
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
    fontSize: 18,
    fontFamily: 'circular',
    textAlign: 'center',
    color: '#565b5c'
  },
  input: {
    height: 300, 
    fontFamily: 'circular',
    borderColor: 'gray', 
    borderWidth: 5, 
    borderRadius: 10,
    fontSize: 30,
    margin: 15,
    padding: 20,
    backgroundColor: 'white'
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
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
});

module.exports = Author;