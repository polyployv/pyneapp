import React from "react";
import { StyleSheet, Text, View, StatusBar, ListView, Image , Alert} from "react-native";
import { Container, Content, Form, Item, Button, Icon, List, ListItem, Card, CardItem,
  Textarea, Body, Right, Left, Thumbnail } from "native-base";
import * as firebase from "firebase";
import moment from "moment";

export default class PostDetailsScreen extends React.Component {
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
      numberOfcommentreport: 0,
    };
  }
  async componentDidMount() {
    await this.setState({
      keyData: this.props.navigation.state.params.dataKey,
      categoryname: this.props.navigation.state.params.categoryname,
      currentUserID: firebase.auth().currentUser.uid
    });
    console.log("key: "+this.state.keyData)
    console.log("catname: "+this.state.categoryname)
    console.log("uid: "+this.state.currentUserID)
    await this.checkCategoryKey(this.state.categoryname)
    this.state.like = this.checkLike(this.state.currentUserID);
    this.state.numberOflike = this.likeCount(this.state.currentUserID); 
    await firebase.database().ref("Posts/" + this.state.keyData).on("value", snapshot => {
      this.setState({ 
        postdata: snapshot.val(), 
        numberOfview: snapshot.val().views, 
        userinfo: snapshot.val().userinfo,
        numberOfreport: snapshot.val().report
      });
    });
    await firebase.database().ref('/Users/' +  firebase.auth().currentUser.uid+"/interests_number/"+this.state.categorykey).on("value", snapshot => {
      this.setState({ numberOfinterest: snapshot.val(), } );      
    });
    var that = this;
    await firebase.database().ref("Posts/" + this.state.keyData + "/comments/").on("child_added", function(data) {
        var newData = [...that.state.listViewData];
        newData.push(data);
        that.setState({ listViewData: newData });
    });   
    await firebase.database().ref("Users/" + firebase.auth().currentUser.uid).on("value", snapshot => {
      this.setState({ currentuserdata: snapshot.val(), } );
    });
    this.viewCount();
  }
  componentWillUnmount = async () => {
    await firebase.database().ref("/Posts/").off();
    await firebase.database().ref("/Users/").off();
  };
  report(key,commentkey,text){
    Alert.alert(
      'Report',
      'Are you sure you want to report',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Report', onPress: () => {
          if(text=="Post"){
            firebase.database().ref("Posts/" + key).update({
              "report": this.state.numberOfreport+1
            });
          }
          else{
            firebase.database().ref("Posts/" + key+"/comments/"+commentkey).on("value", snapshot => {
              this.setState({ 
                numberOfcommentreport: snapshot.val().report
              });
            });
            firebase.database().ref("Posts/" + key+"/comments/"+commentkey).update({
              "report": this.state.numberOfcommentreport+1
            });
          }
        }},
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
    console.log(this.state.categorykey)
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
    this.state.numberOfinterest = this.state.numberOfinterest+2
    this._handleSetInterest(this.state.numberOfinterest)
  }
  
  async addComment(data, date, time) {
    if(data==""){
      alert("Please enter your comment")
    }
    else{
      var key = await firebase.database().ref("Posts/" + this.state.keyData + "/comments").push().key;
      await firebase.database().ref("Posts/" + this.state.keyData + "/comments").child(key).set({ 
        commenttext: data, 
        commentdate: date, 
        commenttime: time, 
        userinfo:{
          uid: this.state.currentuserdata.uid,
          name: this.state.currentuserdata.name,
          profile_picture: this.state.currentuserdata.profile_picture,
        },
        report: 0,
      });
      await this.setState({ newComment: "" });
      this.state.numberOfinterest = this.state.numberOfinterest+3
      this._handleSetInterest(this.state.numberOfinterest)
    }
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
        .child(this.state.currentUserID)
        .set({ uid: this.state.currentUserID });
      firebase
        .database()
        .ref("Users/" +this.state.currentUserID + "/likes")
        .push(this.state.keyData)
      this.state.numberOflike = this.state.numberOflike+1
      this.state.numberOfinterest = this.state.numberOfinterest+5
      this._handleSetInterest(this.state.numberOfinterest)
    }
    else {
      firebase
        .database()
        .ref("Posts/" + this.state.keyData + "/likes/"+this.state.currentUserID)
        .remove()
        .then(function() {
          console.log("Remove succeeded.")
        })
        .catch(function(error) {
          console.log("Remove failed: " + error.message)
        });
        firebase
        .database()
        .ref("Users/"+this.state.currentUserId+"/likes/"+this.state.keyData)
        .remove()

        this.state.numberOflike = this.state.numberOflike-1
        this.state.numberOfinterest = this.state.numberOfinterest-5
        this._handleSetInterest(this.state.numberOfinterest)
    }
}
_handleSetInterest(number){
  firebase.database().ref("/Users/" + this.state.currentUserID + "/interests_number/").child(this.state.categorykey).set(number)
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
                  {this.state.userinfo.name}
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
                <Text  
                  style={{fontSize: 16, marginLeft: 10}}
                    onPress={() => {
                    this.report(this.state.keyData,"","Post")
                  }}>
                  <Icon name='md-information-circle' style={{fontSize: 16, color:"#FF3879"}}/>
                </Text>
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
              )  
            }}
          >
            <Text style={{ color: "white", fontSize: 14 }}> Send </Text>
          </Button>
        </Form>

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
                {data.val().userinfo.name}
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
            <Button 
              full
              onPress={() => {
                this.report(this.state.keyData,data.key,"comment")
              }}>
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