import React from "react";
import { StyleSheet, Text, View, StatusBar, ListView, Image } from "react-native";
import { Container, Content, Form, Item, Button, Icon, List, ListItem, Card, CardItem,
  Textarea, Body, Right } from "native-base";
import * as firebase from "firebase";
import moment from "moment";

export default class PostDetailsScreen extends React.Component {
  static navigationOptions = {
    title: "PostDetails"
  };
  constructor(props) {
    super(props);

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      postdata: "",
      currentUser: "",
      listViewData: [],
      event: "",
      newComment: "",
      categorykey: "",
      subcategorykey: "",
      userOfpost: "",
      commentUser: "",
      like: false,
      numberOflike: 0,
      numberOfview: 0,
    };
  }
  async componentDidMount() {
    await this.setState({
      keyData: this.props.navigation.state.params.dataKey,
      currentUser: firebase.auth().currentUser.uid
    });
    this.state.like = this.checkLike(this.state.currentUser);
    this.state.numberOflike = this.likeCount(this.state.currentUser); 
    await firebase.database().ref("Posts/" + this.state.keyData).on("value", snapshot => {
      this.setState({ postdata: snapshot.val(), numberOfview: snapshot.val().views+1} );
    });
    await firebase.database().ref("Users/" + this.state.postdata.uid).on("value", snapshot => {
      this.setState({ userOfpost: snapshot.val() });
    });
    this.viewCount();
    var that = this;
    await firebase
      .database()
      .ref("Posts/" + this.state.keyData + "/comments")
      .on("child_added", function(data) {
        var newData = [...that.state.listViewData];
        newData.push(data);
        that.setState({ listViewData: newData });
    });   
    
    
  }
  renderForm() {
    if (this.state.postdata.posttype == "Event") {
      this.state.event = "[EVENT] ";
    } else {
      this.state.event = "";
    }
  }
  viewCount = () => {
     firebase.database().ref("Posts/" + this.state.keyData).update({
      "views": this.state.numberOfview
    });
    firebase.database().ref("Users/" + this.state.currentUser+"/interests_number/").update({
      "3":1
    });
    
    
  }
  
  addComment(data, date, time) {
    var key = firebase
      .database()
      .ref("Posts/" + this.state.keyData + "/comments")
      .push().key;
    firebase
      .database()
      .ref("Posts/" + this.state.keyData + "/comments")
      .child(key)
      .set({ commenttext: data, commentdate: date, commenttime: time, uid: this.state.currentUser });
  }
  checkLike  = (uid) => {
    var exists 
    firebase
    .database()
    .ref("Posts/" + this.state.keyData + "/likes/")
    .child(uid).on('value', function(snapshot) {
      exists = (snapshot.val() !== null);
    });
    return exists
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
  Like(){
    if(this.state.like==false){
      firebase
        .database()
        .ref("Posts/" + this.state.keyData + "/likes")
        .child(this.state.currentUser)
        .set({ uid: this.state.currentUser });
      this.state.numberOflike = this.state.numberOflike+1
    }
    else {
      firebase
        .database()
        .ref("Posts/" + this.state.keyData + "/likes/"+this.state.currentUser)
        .remove()
        .then(function() {
          console.log("Remove succeeded.")
        })
        .catch(function(error) {
          console.log("Remove failed: " + error.message)
        });
        this.state.numberOflike = this.state.numberOflike-1
    }
}
  render() {
    return (
      <Container>
        <Card style={{ marginTop: 20, marginLeft: 10, marginRight: 10,maxHeight: '70%' }}>
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
                  {this.state.userOfpost.first_name+" "+this.state.userOfpost.last_name}
                </Text>
                <Text
                  style={{ marginLeft: 15, marginTop: 5 }}
                  onPress={() => {
                    this.setState({ like: !this.state.like })
                    this.Like()
                    
                  }}
                >
                  {this.state.like ? ( 
                    
                    <Image
                      style={{ width: 25, height: 25 }}
                      source={require("../../assets/images/heartpinkIcon.png")}
                    />
                    
                  ) : (
                    <Image
                      style={{ width: 25, height: 25 }}
                      source={require("../../assets/images/heartIcon.png")}
                    />
                  )}
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

        <Form style={{ paddingLeft: 10, paddingRight: 10 }}>
          <Textarea
            rowSpan={2}
            bordered
            onChangeText={newComment => this.setState({ newComment })}
            value={this.state.newComment}
            placeholder="Comment..."
            placeholderTextColor="#aabbcc"
          />
          <Button
            style={{
              backgroundColor: "#FF3879",
              marginTop: 3,
              marginBottom: 3,
              alignSelf: "flex-end"
            }}
            onPress={() => {
              this.addComment(
                this.state.newComment,
                new Date().toString().substr(4, 12),
                moment().format("hh:mm a")
              ),
                this.setState({ newComment: "" });
            }}
          >
            <Text style={{ color: "white", fontSize: 14 }}> Send </Text>
          </Button>
        </Form>

        <List
          enableEmptySections
          dataSource={this.ds.cloneWithRows(this.state.listViewData)}
          renderRow={data => (
            
            <ListItem avatar style={{ paddingLeft: 5, paddingRight: 10 }}>
              
              {/* <Left>
                            <Thumbnail source={{ uri: 'Image URL' }} />
                        </Left> */}
              <Body>
                
                <Text
                  style={{ fontWeight: "bold", fontSize: 16, color: "#444FAD" }}
                >
                Username
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
            <Button full>
              <Icon name="information-circle" />
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