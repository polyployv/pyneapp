import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ListView,
  Image,
  Alert
} from "react-native";
import {
  Container,
  Content,
  Header,
  Form,
  Input,
  Item,
  Button,
  Label,
  List,
  ListItem,
  Icon,
  Body,
  Right,
  Segment,
  Tabs
} from "native-base";
import * as firebase from "firebase";

export default class ReportList extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Report List",
      headerStyle: {
        backgroundColor: "#ffe3e3"
      },
      headerBackTitle: " ",
      headerTitleStyle: {
        color: "#444FAD"
      }
    };
  };

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      switchShow: false,
      listViewData: [],
      listCommentData: []
    };
    this.configComment = this.configComment.bind(this);
    this.configpost = this.configpost.bind(this);
  }

  async componentDidMount() {
    //console.log('compoentn render')
    var that = this;
    await firebase
      .database()
      .ref("/Posts/")
      .on("child_added", function(data) {
        var newData = [...that.state.listViewData];
        if (data.val().report !== 0) {
          newData.push(data);
          newData = newData.sort((a, b) => {
            return a.val().report - b.val().report;
          });
        }
        newData = newData.reverse();
        that.setState({ listViewData: newData });

        data.val().comments !== undefined &&
          firebase
            .database()
            .ref("/Posts/" + data.key + "/comments/")
            .on("child_added", function(data_commend) {
              var new_comment = [...that.state.listCommentData];
              if (data_commend.val().report !== 0) {
                new_comment.push(data_commend);
              }
              that.setState({ listCommentData: new_comment });
            });
      });
  }

  componentWillUnmount = async () => {
    await firebase
      .database()
      .ref("/Posts/")
      .off();
    await firebase
      .database()
      .ref("/Posts/" + data.key + "/comments/")
      .off();
  };
  configpost(key) {
    Alert.alert(
      "Update this Report",
      "Do you want to delete or ignore this post?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => {
            Alert.alert("Delete", "Are you sure you want to delete this post", [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              {
                text: "Confirm",
                onPress: () => {
                  firebase
                    .database()
                    .ref("Posts/" + key)
                    .remove();
                  this.reflesh();
                  alert("Delete successfully");
                }
              }
            ]);
          }
        },
        {
          text: "Ignore",
          onPress: () => {
            Alert.alert("Ignor", "Are you sure you want to ignor this report", [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              {
                text: "Confirm",
                onPress: () => {
                  firebase
                    .database()
                    .ref("Posts/" + key)
                    .update({
                      report: 0
                    });
                  this.reflesh();
                }
              }
            ]);
          }
        }
      ],
      { cancelable: false }
    );
  }
  configComment(key) {
    Alert.alert(
      "Update this Report",
      "Do you want to delete or ignore this comment?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => {
            Alert.alert(
              "Delete",
              "Are you sure you want to delete this comment",
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                {
                  text: "Confirm",
                  onPress: async () => {
                    await firebase
                      .database()
                      .ref("/Posts/")
                      .on("child_added", function(data) {
                        data.val().comments !== undefined &&
                          firebase
                            .database()
                            .ref("/Posts/" + data.key + "/comments/")
                            .on("child_added", function(data_commend) {
                              if (data_commend.key === key) {
                                firebase
                                  .database()
                                  .ref(
                                    "/Posts/" +
                                      data.key +
                                      "/comments/" +
                                      data_commend.key
                                  )
                                  .remove();
                              }
                            });
                      });
                    console.log("delete complete");
                    this.reflesh();
                  }
                }
              ]
            );
          }
        },
        {
          text: "Ignore",
          onPress: () => {
            Alert.alert("Ignor", "Are you sure you want to ignor this report", [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              {
                text: "Confirm",
                onPress: () => {
                  firebase
                    .database()
                    .ref("Posts/" + key)
                    .update({
                      report: 0
                    });
                  this.reflesh();
                }
              }
            ]);
          }
        }
      ],
      { cancelable: false }
    );
  }

  async reflesh() {
    await this.setState({ listViewData: [], listCommentData: [] });
    var that = this;
    await firebase
      .database()
      .ref("/Posts/")
      .on("child_added", function(data) {
        var newData = [...that.state.listViewData];
        if (data.val().report !== 0) {
          newData.push(data);
          newData = newData.sort((a, b) => {
            return a.val().report - b.val().report;
          });
        }
        newData = newData.reverse();
        that.setState({ listViewData: newData });

        data.val().comments !== undefined &&
          firebase
            .database()
            .ref("/Posts/" + data.key + "/comments/")
            .on("child_added", function(data) {
              var new_comment = [...that.state.listCommentData];
              if (data.val().report !== 0) {
                new_comment.push(data);
              }
              that.setState({ listCommentData: new_comment });
            });
      });
  }

  render() {
    return (
      <Container>
        <Content style={{ marginLeft: 5, marginRight: 5 }}>
          <Item style={{ borderColor: "transparent", alignSelf: "center" }}>
            <Segment>
              <Button
                bordered
                info
                onPress={() => {
                  this.setState({ switchShow: false });
                }}
              >
                <Text style={{ color: "#444FAD" }}> Post Report </Text>
              </Button>

              <Button
                bordered
                info
                onPress={() => {
                  this.setState({ switchShow: true });
                }}
              >
                <Text style={{ color: "#444FAD" }}> Comment Report </Text>
              </Button>
            </Segment>
          </Item>
          <List>
            {this.state.switchShow
              ? this.state.listCommentData.map((data, index) => {
                  //console.log('data',data)
                  return (
                    <ListItem key={index}>
                      <Body>
                        <Text
                          style={{ fontSize: 17, color: "#ff3879" }}
                          onPress={() => {
                            this.props.navigation.navigate("", {
                              dataKey: data.key,
                              categoryname: data.val().categoryname
                            });
                          }}
                        >
                          <Text style={{ color: "#444FAD" }}>
                            {data.val().commenttext}
                          </Text>
                        </Text>
                      </Body>
                      <Right>
                        <Item style={{ borderColor: "transparent" }}>
                          <Button
                            danger
                            style={{ marginLeft: 5 }}
                            onPress={() => {
                              this.configComment(data.key);
                            }}
                          >
                            <Icon name="md-build" style={{ fontSize: 14 }} />
                          </Button>
                        </Item>
                      </Right>
                    </ListItem>
                  );
                })
              : this.state.listViewData.map((data, index) => {
                  return (
                    <ListItem key={index}>
                      <Body>
                        <Text
                          style={{ fontSize: 17, color: "#ff3879" }}
                          onPress={() => {
                            this.props.navigation.navigate(
                              "PostDetailsControl",
                              {
                                dataKey: data.key,
                                categoryname: data.val().categoryname
                              }
                            );
                          }}
                        >
                          <Text style={{ color: "#444FAD" }}>
                            {data.val().topicname}
                          </Text>
                        </Text>
                      </Body>
                      <Right>
                        <Item style={{ borderColor: "transparent" }}>
                          <Button
                            danger
                            style={{ marginLeft: 5 }}
                            onPress={() => {
                              this.configpost(data.key);
                            }}
                          >
                            <Icon name="md-build" style={{ fontSize: 14 }} />
                          </Button>
                        </Item>
                      </Right>
                    </ListItem>
                  );
                })}
          </List>
        </Content>
      </Container>
    );
  }
}
