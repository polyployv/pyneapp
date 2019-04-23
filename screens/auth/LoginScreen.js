import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  Text, 
  TextInput,
  Button,  
  SafeAreaView
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
      showModal: false,
      username: "",
      password: "",
      isFocused: false,

    }
  }
  _handleLogin = async() => {
    await firebase
      .auth()
      .signInWithEmailAndPassword(this.state.username, this.state.password)
      .then(response => {
        console.log('success: ', this.state.username, this.state.password)
        this.props.navigation.navigate("CategoriesControl");
      })
      .catch(error => {
        console.log('info: ', this.state.username, this.state.password)
        console.log("error");
        alert("Wrong username or password")
      });
      await this.setState({ 
        showModal: false ,
        username: "",
        password: ""
      })
  };
  _handleHeaderRight = () => {
    this.setState({ showModal: true });
    //this.props.navigation.navigate("CategoriesControl")
  };

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
      <SafeAreaView style={{ flex: 1 }}>
        {this.state.showModal ? (
          <View
            style={{
              height: "100%",
              width: "100%",
              elevation: 24,
              backgroundColor: "#ffe3e3",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <TextInput
              style={{ height: 30, width: "80%", fontSize: 18, color: '#444FAD'}}
              placeholder={"Username"}
              selectionColor={'#444FAD'}
              value={this.state.username}
              onChangeText={value => this.setState({ username: value })}
            />
            <TextInput
              secureTextEntry={true}
              style={{ height: 30, width: "80%", fontSize: 18, color: '#444FAD' }}
              textContentType={"password"}
              placeholder={"Password"}
              selectionColor={'#444FAD'}
              value={this.state.password}
              onChangeText={value => this.setState({ password: value })}
            />

            <Button 
              title={"Login"} 
              type="solid"
              onPress={
                this._handleLogin
              }/>
            <Button
              title={"Exit"}
              onPress={() => {
                this.setState({ showModal: false });
              }}
            />
          </View>
        ) : (
          <View />
        )}
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
        //onPress={ () => {this.props.navigation.navigate('CategoriesControl')}}> 
        onPress={this._handleHeaderRight}>
        admin 
      </Text>
            <Icon
                  name="shield-outline"
                  color="#444fad"
                  size= {30}/>     
      </View>  
      </SafeAreaView> 
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