import React from "react";
import { StyleSheet, Text, ListView, View } from "react-native";
import { Container, Content, CheckBox, Body, Form, Input, Item, Button, Icon, ListItem, 
  Textarea, Card, CardItem, Picker, DatePicker, } from "native-base";
import * as firebase from "firebase";
import moment from "moment";

export default class AddPostScreen extends React.Component {
  static navigationOptions = {
    title: null,
    headerStyle: {
      backgroundColor: "#ffe3e3"
    }
  };
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      isLoading: false,
      listViewData: [],
      newTopic: "",
      newText: "",
      checked: undefined,
      postType: "",
      categorykey: "",
      selectedcat: "",
      subcategorykey: "",
      selectedsubcat: "",
      chosenDate: "",
      location: "",
      subViewData: [],
      keyData: "",
      userdata: "",
      numberOfinterest: 0,
      interests: ""
    };
    this.setDate = this.setDate.bind(this);
    this._handleSelectSubcategory = this._handleSelectSubcategory.bind(this);
    this.onValueChangecat = this.onValueChangecat.bind(this);
    this.onValueChangesubcat = this.onValueChangesubcat.bind(this);
  }

  setDate(newDate) {
    this.setState({ chosenDate: newDate });
  }
  onValueChangecat(value) {
    this.setState({
      categorykey: value
    });
    this._handleSelectSubcategory(value);
  }
  onValueChangesubcat(value){
    this.setState({
      subcategorykey: value
    });
    const ref = firebase.database().ref('Categories/' + this.state.categorykey + '/Subcategories/' +value);
    ref.once("value", snapshot => {
      this.setState({ selectedsubcat: snapshot.val().subcategoryname });
    });
  }

  componentDidMount = async () => {
    var newData = this.state.listViewData;
    newData.slice()
    await firebase
      .database()
      .ref("/Categories/")
      .on("child_added", function(data) {
        newData.push(data)
      })
    await firebase.database().ref('/Categoreis/').off()
    await this.setState({listViewData:newData})
    
    await firebase.database().ref("Users/" + firebase.auth().currentUser.uid).on("value", snapshot => {
      this.setState({ userdata: snapshot.val(), numberOfinterest: snapshot.val().interests_number});
    });
    console.log(this.state.selectedcat)
  };

  _handleSelectSubcategory = async categorykey => {
    await this.setState({ subViewData: [] });
    firebase
      .database()
      .ref('/Categories/' + categorykey + '/Subcategories')
      .on("child_added", async data => {
        await this.setState({ subViewData: [...this.state.subViewData, data] });
      });
    const ref = firebase.database().ref("Categories/" + categorykey);
    ref.once("value", snapshot => {
      this.setState({ selectedcat: snapshot.val().categoryname });
    });
  };
  async addRow(name, txt, type, catkey,catname, subcatname, eventdate, location, date, time) {
    if(name==""){ alert("Please enter the topic name") }
    else if(type=="Event" && (new Date(eventdate))-(new Date(date)) < 0){ alert("This date has passed") }
    else if(type=="Event" && eventdate==""){ alert("Please select the event date") }
    else if(type=="Event" && location==""){ alert("Please enter the event location") }
    else if(catname==""){ alert("Please choose category") }
    else if(subcatname==""){ alert("Please choose subcategory") }
    else if(txt==""){ alert("Please enter the post details") }
    else{
    this.state.keyData = await firebase.database().ref("/Posts").push().key;
    
    firebase.database().ref("/Posts").child(this.state.keyData).set({
        topicname: name,
        text: txt,
        posttype: type,
        eventdate: eventdate,
        eventlocation: location,
        categoryname: catname,
        subcategoryname: subcatname,   
        date: date,
        time: time,
        userinfo: {
          uid: this.state.userdata.uid,
          name: this.state.userdata.name,
          profile_picture: this.state.userdata.profile_picture,
        },
        views: 0,
        report: 0,
      });
    await this._handleSetInterest(catkey)
    await this.setState({ 
      newTopic: "",
      newText: "",
      checked: "",
      chosenDate: "",
      location: "",
      selectedcat: "",
      selectedsubcat: ""
    });  
    await this.props.navigation.navigate("PostDetailsScreen", {
      dataKey: this.state.keyData,  
      categoryname: this.state.selectedcat
    });
  } 
  }
  _handleSetInterest(catkey){
    firebase.database().ref("/Users/" + firebase.auth().currentUser.uid + "/interests_number/").child(this.state.categorykey).set(this.state.numberOfinterest[catkey]+7)
  }
  setType(check) {
    if (check == true) {
      this.state.postType = "Event";
    } else {
      this.state.postType = "Post";
    }
  }
  pickerChange(index) {
    this.state.currencies.map((v, i) => {
      if (index === i) {
        this.setState({
          currentLabel: this.state.currencies[index].currencyLabel,
          currency: this.state.currencies[index].currency
        });
      }
    });
  }

  render() {
    return (
      <Container>
        <Card
          style={{
            marginTop: 20,
            marginBottom: 20,
            marginLeft: 10,
            marginRight: 10
          }}
        >
          <CardItem style={{ backgroundColor: "#444FAD", borderRadius: 10 }}>
            <Content>
              <Item
                style={{
                  backgroundColor: "white",
                  marginTop: 10,
                  borderRadius: 10
                }}
              >
                <Input
                  style={{ fontSize: 20, textAlign: "center" }}
                  onChangeText={newTopic => this.setState({ newTopic })}
                  value={this.state.newTopic}
                  placeholder="Topic name"
                  placeholderTextColor="#444FAD"
                />
              </Item>
              <ListItem
                onPress={this.setType(this.state.checked)}
                style={{ borderColor: "transparent" }}
              >
                <CheckBox
                  checked={this.state.checked}
                  onPress={() =>
                    this.setState({ checked: !this.state.checked })
                  }
                  value={this.state.checked}
                  color="#FF3879"
                />
                <Body>
                  <Text
                    style={{
                      color: "#FF3879",
                      fontSize: 16,
                      fontWeight: "bold",
                      marginLeft: 5
                    }}
                  >
                    Event
                  </Text>
                </Body>
              </ListItem>
              {this.state.checked ? (
                <View>
                  <Item style={{ borderColor: "transparent" }}>
                  <Icon name="md-calendar"
                    style={{color: '#FFE3E3', marginLeft: 40}} />
                    
                    <DatePicker
                      locale={"en"}
                      timeZoneOffsetInMinutes={undefined}
                      modalTransparent={false}
                      animationType={"fade"}
                      androidMode={"default"}
                      placeHolderText="Select date"
                      textStyle={{ color: "#FFE3E3", fontSize: 16 }}
                      placeHolderTextStyle={{ color: "#d3d3d3", fontSize: 16 }}
                      onDateChange={this.setDate}
                      disabled={false}
                      onChangeText={chosenDate => this.setState({ chosenDate })}
                      value={this.state.chosenDate}
                    />
                  </Item>
                  <Item style={{ borderColor: "transparent" }}>
                  <Icon name="md-pin"
                    style={{color: '#FFE3E3', marginLeft: 40}} />
                    <Input
                      style={{ fontSize: 16, color: "#FFE3E3", marginLeft: 10 }}
                      onChangeText={location => this.setState({ location })}
                      value={this.state.location}
                      placeholder="Location..."
                      placeholderTextColor="#d3d3d3"
                    />
                  </Item>
                </View>
              ) : null}
              <Item
                style={{
                  backgroundColor: "#FFE3E3",
                  marginTop: 5,
                  borderRadius: 10
                }}
              >
                <Form>
                  <Picker
                    mode="dropdown"
                    iosIcon={
                      <Icon name="arrow-down" style={{ color: "#444FAD" }} />
                    }
                    placeholder="Category"
                    placeholderStyle={{
                      color: "#444FAD",
                      marginRight: 10,
                      fontWeight: "bold",
                      fontSize: 16
                    }}
                    style={{ width: 360}}
                    textStyle={{ color: "#444FAD", fontSize: 16 }}
                    selectedValue={this.state.categorykey}
                    value={this.state.selectedcat}
                    onValueChange={value => {
                      this.onValueChangecat(value);
                    }}
                  >
                    {
                      
                      this.state.listViewData.map((object,id)=>{
                        return(
                          <Picker.Item
                          key={id}
                          label={object.val().categoryname}
                          value={object.key}
                          />
                        )
                      })
                    }
                  </Picker>
                </Form>
              </Item>
              <Item
                style={{
                  backgroundColor: "#FFE3E3",
                  borderRadius: 10,
                  marginTop: 5
                }}
              >
                <Form>
                  <Picker
                    mode="dropdown"
                    iosIcon={
                      <Icon name="arrow-down" style={{ color: "#444FAD" }} />
                    }
                    placeholder="Subcategory"
                    placeholderStyle={{
                      color: "#444FAD",
                      marginRight: 10,
                      fontWeight: "bold",
                      fontSize: 16
                    }}
                    style={{ width: 360 }}
                    textStyle={{ color: "#444FAD", fontSize: 16 }}
                    selectedValue={this.state.subcategorykey}
                    value={this.state.selectedsubcat}
                    onValueChange={this.onValueChangesubcat.bind(this)}
                  >
                    {this.state.subViewData.map((data, i) => {
                      return (
                        <Picker.Item
                          key={i}
                          label={data.val().subcategoryname}
                          value={data.key}
                        />
                      );
                    })}
                  </Picker>
                </Form>
              </Item>

              <Content>
                <Form>
                  <Textarea
                    rowSpan={10}
                    bordered
                    placeholder="Textarea"
                    placeholderTextColor="#aabbcc"
                    onChangeText={newText => this.setState({ newText })}
                    value={this.state.newText}
                    style={{
                      backgroundColor: "white",
                      borderRadius: 10,
                      marginTop: 10
                    }}
                  />
                </Form>
              </Content>
              <Button
                onPress={async() => {
                  await this.addRow(
                    this.state.newTopic,
                    this.state.newText,
                    this.state.postType,
                    this.state.categorykey,
                    this.state.selectedcat,
                    this.state.selectedsubcat,
                    this.state.chosenDate.toString().substr(4, 12),
                    this.state.location,
                    new Date().toString().substr(4, 12),
                    moment().format("hh:mm a")
                  );
                                
                }}
                style={{
                  backgroundColor: "#FF3879",
                  alignSelf: "flex-end",
                  borderRadius: 10,
                  marginTop: 15
                }}
              >
                <Text style={{ color: "white", fontSize: 18 }}> Post </Text>
              </Button>
            </Content>
          </CardItem>
        </Card>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
    paddingTop: 20
  }
});