import React from "react";
import { StyleSheet, Text, View, StatusBar, ListView, Image , Alert} from "react-native";
import { Container, Content, Form, Item, Button, Icon, List, ListItem, Card, CardItem,
  Textarea, Body, Right, Left, Thumbnail } from "native-base";
import * as firebase from "firebase";
import moment from "moment";

export default class PostDetailsControl extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "PostDetails",
      headerStyle: {
        backgroundColor: '#ffe3e3',
      },
    
    }
  };
  constructor(props) {
    super(props);

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      postdata: "",
      currentUserId: "",
      listViewData: [],
      event: "",
      newComment: "",
      categorykey: "",
      categoryname: "",
      subcategorykey: "",
      commentUser: "",
      like: false,
      numberOflike: 0,
      numberOfview: 0,
      numberOfinterest: 0,
      currentuserdata: "",
      userinfo: "",
      numberOfreport: 0,
      keyData: "",
    };
  }
  async componentDidMount() {
    await this.setState({
      keyData: this.props.navigation.state.params.dataKey,
      categoryname: this.props.navigation.state.params.categoryname,
    });
    this.checkCategoryKey(this.state.categoryname)
    //this.state.like = this.checkLike(this.state.currentUserID);
    this.state.numberOflike = this.likeCount(0); 
    await firebase.database().ref("Posts/" + this.state.keyData).on("value", snapshot => {
      this.setState({ 
        postdata: snapshot.val(), 
        numberOfview: snapshot.val().views, 
        userinfo: snapshot.val().userinfo,
        numberOfreport: snapshot.val().report
      });
    });
    var that = this;
    await firebase.database().ref("Posts/" + this.state.keyData + "/comments/").on("child_added", function(data) {
        var newData = [...that.state.listViewData];
        newData.push(data);
        that.setState({ listViewData: newData });
    });   
    
  }
  deletecomment(keypost, keycomment){
    Alert.alert(
      'Delete',
      'Do you want to delete this comment',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Delete', 
            onPress: () => {
              firebase.database().ref("Posts/" + keypost+"/comments/"+keycomment).remove();
            }
        },
      ],
      {cancelable: false},
    );
  }

  checkCategoryKey(name){
    var key
    firebase.database().ref('/Categories/').orderByChild('categoryname').equalTo(name).on("value", function(snapshot) {
      snapshot.forEach(function(data) {
         key = data.key;
      });
    });
    this.state.categorykey = key
  }
  renderForm() {
    if (this.state.postdata.posttype == "Event") {
      this.state.event = "[EVENT] ";
    } else {
      this.state.event = "";
    }
  }
  viewCount = () => {
    catkey = this.state.categorykey
    firebase.database().ref("Posts/" + this.state.keyData).update({
      "views": this.state.numberOfview+1
    });
  }
  likeCount = (uid) => {
    var numberOflike 
    firebase
    .database()
    .ref("Posts/" + this.state.keyData + "/likes/")
    .child(uid).once('value', function(snapshot) {
      numberOflike = snapshot.numChildren()
    });
    return numberOflike
  }

  render() {
    return (
      <Container>
        <Card style={{ marginTop: 10, marginLeft: 10, marginRight: 10,maxHeight: '60%' }}>
          <CardItem style={{ backgroundColor: "#444FAD", borderRadius: 10 }}>
            <Content>
              {this.renderForm()}
              <Item style={{ alignSelf: "center", borderColor: "transparent" }}>
                <Text
                  style={{ fontSize: 20, color: "#FF3879", fontWeight: "bold" }}
                >
                  {this.state.event}
                </Text>
                <Text
                  style={{ fontSize: 20, color: "white", fontWeight: "bold" }}
                >
                  {this.state.postdata.topicname}
                </Text>
              </Item>
              {this.state.postdata.posttype == "Event" ? (
                <CardItem
                  style={{
                    backgroundColor: "white",
                    borderRadius: 10,
                    marginTop: 10, 
                  }}
                >
                  <Content>
                    <Text style={{ color: "#FF3879" }}>
                      <Icon
                        style={{ color: "#FF3879", fontSize: 20 }}
                        name="md-calendar"
                      />
                      {"  " + this.state.postdata.eventdate}
                    </Text>
                    <Text style={{ color: "#FF3879" }}>
                      <Icon
                        style={{ color: "#FF3879", fontSize: 20 }}
                        name="md-pin"
                      />
                      {"  " + this.state.postdata.eventlocation}
                    </Text>
                  </Content>
                </CardItem>
              ) : null}
              <Text style={{ fontSize: 16, color: "white", marginTop: 10 }}>
                {this.state.postdata.text}
              </Text>

              <Item
                style={{
                  marginTop: 15,
                  borderColor: "transparent",
                  alignSelf: "flex-end"
                }}
              >
                <Text
                  style={{ fontSize: 18, color: "#ffE3E3", fontWeight: "bold" }}
                >
                  {this.state.userinfo.first_name+" "+this.state.userinfo.last_name}
                </Text>
                <Text style={{ marginLeft: 15, marginTop: 5 }}>
                    <Image
                      style={{ width: 25, height: 25 }}
                      source={require("../../assets/images/heartIcon.png")}
                    />
                </Text>
                <Text style={{ fontSize: 16, color: "#FF3879" }}> {this.state.numberOflike}</Text>
                <Image
                  style={{ width: 30, height: 30, marginLeft: 10 }}
                  source={require("../../assets/images/eyeIcon.png")}
                  
                />
                <Text style={{ fontSize: 16, color: "#FF3879" }}> {this.state.numberOfview}</Text>
              </Item>
            </Content>
          </CardItem>
        </Card>


        <List
          enableEmptySections
          dataSource={this.ds.cloneWithRows(this.state.listViewData)}
          renderRow={data => (
            
            <ListItem avatar style={{ paddingLeft: 5, paddingRight: 10, borderColor:'transparent' }}>
              
              <Left>
                <Thumbnail source={{ uri: data.val().userinfo.profile_picture }} />
              </Left>
              <Body>
                
                <Text
                  style={{ fontWeight: "bold", fontSize: 16, color: "#444FAD" }}
                >
                {data.val().userinfo.first_name+" "+data.val().userinfo.last_name}
                </Text>
                <Text note style={{ marginLeft: 10, color: "#444FAD" }}>
                  {data.val().commenttext}
                </Text>
              </Body>
              <Right>
                <Text note style={{ color: "#aabbcc", fontSize: 12 }}>
                  {data.val().commentdate}
                </Text>
                <Text note style={{ color: "#aabbcc", fontSize: 12 }}>
                  {data.val().commenttime}
                </Text>
              </Right>
            </ListItem>
          )}
          renderRightHiddenRow={data => (
            <Button full danger
            onPress={ () => {this.deletecomment(this.state.keyData, data.key)}}>
              <Icon name="md-trash" />
            </Button>
          )}
          rightOpenValue={-75}
        />
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
    paddingRight: 10,
    paddingLeft: 10
  }
});