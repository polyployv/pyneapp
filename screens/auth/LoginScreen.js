import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  Text
} from 'react-native';

import {Content} from 'native-base';
import * as firebase from 'firebase';
import {connect} from 'react-redux';
import {login} from '../../redux/actions'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

class LoginScreen extends React.Component {
  static navigationOptions = {
		header: null
    };
  constructor(props){
    super(props)
    this.state = {

    }
  }

login = async() =>{
  try {
    const result = {
    type,
    token,
    expires,
    permissions,
    declinedPermission,
  } = await Expo.Facebook.logInWithReadPermissionsAsync(
    '355951551902795',
    { permissions: ['public_profile','user_photos'] }
  );
  if (type === 'success') {
    const credential = firebase.auth.FacebookAuthProvider.credential(token);
    firebase.auth().signInAndRetrieveDataWithCredential(credential)
    .then( (res) => {
      this.props.dispatch(login(res.user))
      this.props.navigation.navigate('DrawerNavigator');
    })
    .catch((error) => {
      console.log(error)
    })  
  } else {
    console.log('Error occur')
  }
  } catch ({ message }) {
  alert(`Facebook Login Error: ${message}`);
  }
}
    render() {
    return(
      <View style={styles.container}>
      <Content>
            <Image source={require('../../assets/images/pynelogo.png')}
              style={styles.welcomeImage}
            />     
            <View style={styles.button}>
             <Icon.Button
                  name="facebook"
                  backgroundColor="#444fad"
                  size={30}
                  onPress={this.login.bind(this)}>
                  Login with Facebook
            </Icon.Button>
            </View>  
     </Content>
     <Text style={{fontSize:17,color: '#444fad'}}
                            onPress={ () => {this.props.navigation.navigate(
                                'CategoriesControl')}}> admin </Text>
            <Icon
                  name="shield-outline"
                  color="#444fad"
                  size= {30}/>     
            </View>   
    );
  }
  }



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe3e3',
    alignItems:'center',
    paddingTop: 100,
  }, 
  welcomeImage: {
    width: 250,
    height: 200,
    resizeMode: 'contain',
    alignContent: 'center',
  },
  button:{
    paddingTop: 60,
  },
});
function mapStateToProps(state) {
    return {
      loggedIn: state.loggedIn
    };
  }
  
export default connect(mapStateToProps)(LoginScreen);  