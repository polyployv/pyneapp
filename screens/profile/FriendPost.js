import React from "react";
import { View, Text } from "react-native";
import { Container, Content, Header, Form, Input, Item, Button, Label, List, ListItem, Icon , Left, Right, Thumbnail, Body} from 'native-base';

import * as firebase from "firebase";

class FriendPost extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "News Feed",
      headerStyle: {
        backgroundColor: "#ffe3e3"
      },
      headerTitleStyle: {
        color: "#444FAD"
      }
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      listviewdata: [],
      friend_list: []
    };
  }
  componentDidMount = async () => {
    var that = this;
    await firebase
      .database()
      .ref("/Users/" + firebase.auth().currentUser.uid + "/friends")
      .on("child_added", async function(user_id) {
        await firebase
          .database()
          .ref("/Posts/")
          .on("child_added", async function(data) {
            var new_data = [...that.state.listviewdata];
            if (data.val().userinfo.uid.toString() === user_id.val()) {
              new_data.push(data);
              new_data = new_data.sort( (a, b) => {                
                return( ( new Date(a.val().date) )- 
                ( new Date(b.val().date) )   )
            })
            new_data = new_data.reverse()
            await that.setState({ listviewdata: new_data });
            }
          });
      });
  };
  componentWillUnmount = async () => {
    await firebase.database().ref("/Posts/").off();
    await firebase.database().ref("/Users/" + firebase.auth().currentUser.uid + "/friends").off();
  };

  render() {
    return (
        <Container >
            <Content style={{marginLeft: 5, marginRight: 5}}>
                <List>
                    {this.state.listviewdata.map((data, index) => {
                        return (
                            <ListItem avatar style={{ paddingLeft: 5, paddingRight: 10, borderColor:'transparent' }}>
                                <Left>
                                    <Thumbnail source={{ uri: data.val().userinfo.profile_picture }} />
                                </Left>
                                <Body >
                                    <Text 
                                        onPress={ () => {this.props.navigation.navigate(
                                            'PostDetailsScreen',  {
                                                'dataKey': data.key, 
                                                'categoryname': data.val().categoryname 
                                            }
                                        )}
                                        }
                                        style={{color: '#ff3879'}}> 
                                        {data.val().posttype=="Event"? "[EVENT] ": null}
                                        <Text style={{color: '#444FAD'}}>{data.val().topicname}</Text>
                                    </Text>
                                    <Text note style={{ marginLeft: 10, color: "#aabbcc" }}>
                                        Post By: {data.val().userinfo.first_name+" "+data.val().userinfo.last_name}
                                    </Text>
                                </Body>
                                <Right>
                                    <Text note style={{ color: "#aabbcc", fontSize: 12 }}>
                                        {data.val().date}
                                    </Text>
                                    <Text note style={{ color: "#aabbcc", fontSize: 12 }}>
                                        {data.val().time}
                                    </Text>
                                </Right>
                            </ListItem>
                        )
                    })}
                </List>
            </Content>
        </Container>
    );
  }
}

export default FriendPost;
