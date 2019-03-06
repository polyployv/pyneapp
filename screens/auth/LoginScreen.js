import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Button,
  TouchableOpacity,
  View,
  AsyncStorage,

} from 'react-native';
import * as firebase from 'firebase';
// import { Icon } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'


export default class Login extends React.Component {
      

isUserEqualGG = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };
  


onSignInGG = googleUser => {
    console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(
      function(firebaseUser) {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!this.isUserEqualGG(googleUser, firebaseUser)) {
          // Build Firebase credential with the Google ID token.
          var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
          );
          // Sign in with credential from the Google user.
          firebase
            .auth()
            .signInAndRetrieveDataWithCredential(credential)
            .then(function(result) {
              console.log('user signed in ');
              this.setState({result});
              // if (result.additionalUserInfo.isNewUser) {
                var key = firebase
                .database()
                .ref("/Users")
                .push().key;
                firebase
                  .database()
                  .ref('/Users/' + result.user.uid)
                  .set({
                    uid: result.user.uid,
                    email: result.user.email,
                    first_name: result.additionalUserInfo.profile.given_name,
                    last_name: result.additionalUserInfo.profile.family_name,
                    profile_picture: result.additionalUserInfo.profile.picture,
                    created_at: Date.now()
                  })

              this.props.navigation.navigate("ProfileScreen", {'dataKey': result.user.uid});  
              // } else {
              //   firebase
              //     .database()
              //     .ref('/Users/' + result.user.uid)
              //     .update({
              //       last_logged_in: Date.now()
              //     });
              // }
            })
            .catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // ...
            });
        } else {
          console.log('User already signed-in Firebase.');
        }
      }.bind(this)
    );
    
  };
                                             //facebook
signInWithFacebook = async() =>{
    try {
      const result = {
      type,
      token,
      expires,
      permissions,
      declinedPermission,
    } = await Expo.Facebook.logInWithReadPermissionsAsync(
      '355951551902795',
      { permissions: ['public_profile','user_birthday','email','user_photos'] }
    );
    if (type === 'success') {
      // Build Firebase credential with the Facebook access token.
      const credential = firebase.auth.FacebookAuthProvider.credential(token);
          // Sign in with credential from the Facebook user.
      firebase.auth().signInAndRetrieveDataWithCredential(credential)
      .catch((error) => {
        console.log(error)
      })
              const response = await fetch(`https://graph.facebook.com/me/?fields=id,first_name,last_name,email,picture,name&access_token=${token}`);
              const userInfo = await response.json();
              this.setState({userInfo});
              var key = firebase
              .database()
              .ref("/Users")
              .push().key;
              firebase
                  .database()
                  .ref('/Users/'+ userInfo.id) 
                  .set({
                    uid: userInfo.id,
                    email: userInfo.email,
                    profile_picture: userInfo.picture,
                    first_name: userInfo.first_name,
                    last_name: userInfo.last_name,
                    created_at: Date.now()
                  })
          
            this.props.navigation.navigate("ProfileScreen", {'dataKey': userInfo.id});     
    } else {
      // type === 'cancel'
    }
    } catch ({ message }) {
    alert(`Facebook Login Error: ${message}`);
    }
    
  }
                                                //google
  signInWithGoogleAsync = async () => {
    try {
      const result = await Expo.Google.logInAsync({
        // androidClientId: YOUR_CLIENT_ID_HERE,
        behavior: 'web',
        iosClientId: '33590640481-25088pa47chgpsnfd0b9vnn0v5tcjlt3.apps.googleusercontent.com', 
        scopes: ['profile', 'email']
      });

      if (result.type === 'success') {
        this.onSignInGG(result);
        return result.accessToken;
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
      }
  };





    render() {
      const{Navigate} = this.props
    return(
      // this.state.showSpinner ? 
      // <View style={styles.container}><ActivityIndicator animating={this.state.showSpinner} /></View> :
      //pyne logo 
      <View style={styles.container}>
            <Image source={require('../../assets/images/pynelogo.png')}
              style={styles.welcomeImage}
            />     
            <View style={styles.button}>
             <Icon.Button
                  name="facebook"
                  backgroundColor="#3b5998"
                  size={30}
                  onPress={this.signInWithFacebook.bind(this)}>
                  Login with Facebook
            </Icon.Button>
           
            <Icon.Button
                  name="google"
                  backgroundColor="#dd4b39"
                  size={30}
                  onPress={this.signInWithGoogleAsync.bind(this)}>
                  Login with Google
            </Icon.Button>

            </View>      
      </View>    
    );
  }
  }
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe3e3',
    alignItems:'center',
    paddingTop: 20,
  }, 
  welcomeImage: {
    width: 250,
    height: 200,
    resizeMode: 'contain',
    alignContent: 'center',
  },
  button:{
    paddingTop: 60,
  }
});
