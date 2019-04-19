
import React from 'react';
import styles from '../../styles';
import { connect } from 'react-redux';
import * as firebase from 'firebase';

import { 
  Text, 
  View,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';

import { Container, Header, Content, Body, Title} from "native-base";

class FriendScreen extends React.Component {
  static navigationOptions = {
    title: 'Friends',
    headerStyle: {
      backgroundColor: "#ffe3e3"
    },
    headerTitleStyle: {
      color: '#444FAD',
  },
  };
  state = {
    friends: [],
    items: []
  }

  componentDidMount = async () => {
    var that = this
     await firebase.database().ref('Users/' + this.props.user.uid + '/friends').once('value',  (snap) => { 
       snap.forEach((child) => {
        item = child.val();
        firebase.database().ref('Users').orderByKey().equalTo(item).once('child_added', async (snapshot) =>{
          await that.setState({ items: [...that.state.items, snapshot]})
        }); 
      }); 
    });
  }

  render() {
    return (
     <View style={styles.container} >
     <Container>
     <Header style={{ backgroundColor: "#444fad"}}><Body><Title  style={{ color: "#fff" }}>Friend</Title></Body></Header>
        <Content>
      <ScrollView>
        {this.state.items.map((friend, index)=>{
          var friend = friend.val()
          return (
            <TouchableOpacity key={index} style={[styles.imgRow, styles.border]} >
              <Image style={styles.img} source={{uri: friend.profile_picture+"?width=500"}} />
              <Content><Text style={{fontSize: 16, fontWeight: 'bold',color: '#444fad', marginTop: 30 }}>{friend.name}</Text></Content>
              <Content><Text  style={{ marginTop: 30 }}>{friend.aboutMe}</Text></Content>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      </Content>
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

export default connect(mapStateToProps)(FriendScreen);