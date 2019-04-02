import React from 'react';
import { StyleSheet, Text, ListView, View, FlatList, Image, ImageBackground, ScrollView, Dimensions} from 'react-native';
import {
  Container, Content, CheckBox, Body, Left, Right, Header, Title, Form, 
  Input, Item, Icon,Button, ListItem, Textarea, Card, CardItem, Picker, DatePicker, List, Badge
} from 'native-base';
import * as firebase from 'firebase';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import ProfileItem from "../../components/ProfileItem";
import Demo from "../../assets/data/demo.js";
import { Constants, Location, Permissions } from "expo";
import { Platform } from "expo-core";

export default class likedListScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: "" ,   
            headerStyle: {
                backgroundColor: '#ffe3e3',
            },    
            // headerLeft: (
            //     <Text style={{ marginLeft: 10}} /*onPress={() => navigation.navigate('RecommenderScreen')}*/>
            //     <Image style={{height: 30, width: 30,}}
            //     source={require('../../assets/images/peopleIcon.png')}
            //     />
            //     </Text>
            // ),
            // headerRight: (
            //     <Text style={{ marginRight: 10}} onPress={() => navigation.navigate('ProfileScreen')}>
            //     <Image style={{height: 20, width: 20,}}
            //         source={require('../../assets/images/menuIcon.png')}
            //     />
            //     </Text>
            // )  
        };
    };
    constructor(props) {
        super(props);
        this.state = {
          userdata: {
            //likes: ["-LatzfBxzsGzOG_ascfE"]
          },
          like_data: []
        };
    }
    async componentDidMount() {
        
        console.log("id: "+firebase.auth().currentUser.uid)
        // await  firebase.database().ref("Users/" + firebase.auth().currentUser.uid)
        // .once("value", snapshot => {
        //   console.log("user data: "+snapshot.val());
        //   this.setState({ userdata: snapshot.val() });
        // });
        await firebase.database().ref("Users/" + firebase.auth().currentUser.uid).on("value", snapshot => {
        
            this.setState({ userdata: snapshot.val() });
          });
        //await console.log(this.state.userdata.likes[0])
        //await firebase.database().ref('/Users/'+ firebase.auth().currentUser.uid).off()
        if (this.state.userdata.likes !== undefined) {
            
          for (var i = 0; i < this.state.userdata.likes.length; i++) {
            firebase
              .database()
              .ref("Posts/" + this.state.userdata.likes[i])
              .once("value", snapshot => {
                var new_like = this.state.like_data;
                new_like.push(snapshot.val());
                this.setState({ like_data: new_like });
              });
          }
          
        }
    }
    render() {
    
        return (
          <Container>
              <Content>
              </Content>
          </Container>
        );
    }
    
}
const styles = StyleSheet.create({
    container: { marginHorizontal: 0 },
  
    bg: {
      flex: 1,
      resizeMode: "cover",
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height
    },
    photo: {
      width: Dimensions.get("window").width,
      height: 450
    },
    top: {
      paddingTop: 50,
      marginHorizontal: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    },
    topIconLeft: {
      fontSize: 20,
      color: "#FFF",
      paddingLeft: 20,
      marginTop: -20,
      transform: [{ rotate: "90deg" }]
    },
    topIconRight: {
      fontSize: 20,
      color: "#FFF",
      paddingRight: 20
    },
    actions: {
      justifyContent: "center",
      flexDirection: "row",
      alignItems: "center"
    },
    iconButton: { fontSize: 20, color: "#FFF" },
    textButton: {
      fontSize: 15,
      color: "#FFF",
      paddingLeft: 5
    },
    circledButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: "#7444C0",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 10
    },
    roundedButton: {
      justifyContent: "center",
      flexDirection: "row",
      alignItems: "center",
      marginLeft: 10,
      height: 50,
      borderRadius: 25,
      backgroundColor: "#5636B8",
      paddingHorizontal: 20
    }
  });



    
























  

     