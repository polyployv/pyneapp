import React from 'react';
import RootNavigator from './navigation/RootNavigator';
// import LoginScreen from './screens/auth/LoginScreen';
import reducers from './redux/reducers';
import thunkMiddleware from 'redux-thunk';
import {Provider} from 'react-redux';
import {createStore,applyMiddleware} from 'redux';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
// import Test from './screens/recommender/RecommenderScreen'
import ApiKeys from './constants/ApiKeys';
const firebase = require('firebase')
const middleware = applyMiddleware(thunkMiddleware)
const store = createStore(reducers, middleware);
console.disableYellowBox = true;

export default class App extends React.Component {
   constructor(props) {
     super(props);
     this.state = {
       isLoadingComplete: false,
     };

     // Initialize firebase...
     if (!firebase.apps.length) { firebase.initializeApp(ApiKeys.FirebaseConfig); }
   }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <Provider store={store}>
          <RootNavigator/>
          </Provider>
          
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        Roboto: require('./assets/fonts/Roboto-Regular.ttf'),
        Roboto_medium: require('./assets/fonts/Roboto-Medium.ttf')
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
