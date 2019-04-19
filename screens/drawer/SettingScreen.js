import React from 'react';
import styles from '../../styles';
import { connect } from 'react-redux';
// import LoginScreen from '../auth/LoginScreen';
import { Container, Header, Content, Icon, Picker, Form, Body, Title} from "native-base";
import * as firebase from 'firebase';

import { 
  Text, 
  View,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';

class SettingScreen extends React.Component {
  static navigationOptions = {
    title: 'Setting',
    headerStyle: {
      backgroundColor: "#ffe3e3"
    },
    headerTitleStyle: {
      color: '#444FAD',
  },
  };
    constructor(props) {
        super(props);
        this.state = {
          selected: 5
        };
      }
      onValueChange(value) {
        this.setState({
          selected: value
        });
    }

  render() {
    return (
     <View style={styles.container} >
       <Container>
       <Header style={{ backgroundColor: "#444fad"  }}><Body><Title  style={{ color: "#fff" }}>Setting</Title></Body></Header>
        <Content padder>
          <Form>
            <Text style={{ color: "#444fad", fontWeight: "bold", fontSize: 20 }}>
            Select the maximum distance
            </Text>
            <Picker
              mode="dropdown"
              placeholder="Select the maximum distance"
              iosIcon={<Icon name="arrow-down" />}
              textStyle={{ color: '#bbbbbb',fontWeight: "bold"  }}
              itemTextStyle={{ color: '#444fad',fontWeight: "bold"  }}
              headerStyle={{ backgroundColor: "#ffe3e3" }}
              headerBackButtonTextStyle={{ color: "#444fad",fontWeight: "bold" }}
              headerTitleStyle={{ color: "#444fad",fontWeight: "bold" }}
              selectedValue={this.state.selected}
              onValueChange={this.onValueChange.bind(this)}
            >
              <Picker.Item label="0-20 km" value="5" />
              <Picker.Item label="20-78 km" value="6" />
              <Picker.Item label="78-630 km" value="7" />
              <Picker.Item label="630-2500 km" value="8" />

            </Picker>
          </Form> 
          
          </Content>
          
          <TouchableOpacity
                onPress={() => {
                  firebase.database().ref('Users/'+this.props.user.uid).remove();
                  this.props.navigation.navigate('LoginScreen');
                }}
              >
                 <Text style={ styles.button }>Delete account</Text>
              </TouchableOpacity>
       
      </Container>
     </View>
    )
  }
}
function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(SettingScreen);