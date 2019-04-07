import React from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Button,
  Image
} from "react-native";
import { List, ListItem } from "native-base";
import * as firebase from "firebase";
import ProfileItem from "../../components/ProfileItem";
import Demo from "../../assets/data/demo.js";
import { Constants, Location, Permissions } from "expo";
import { Platform } from "expo-core";

export default class ProfileScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Profile",
      headerStyle: {
        backgroundColor: "#ffe3e3"
      },
      headerTitleStyle: {
        color: "#444FAD"
      },
      headerLeft: (
        <Text
          style={{ marginLeft: 10 }}
          onPress={() => navigation.navigate("CategoriesListScreen")}
        >
          <Image
            style={{ height: 27, width: 27 }}
            source={require("../../assets/images/homeIcon.png")}
          />
        </Text>
      ),
      headerRight: (
        <Text style={{ marginRight: 10 }}>
          <Image
            style={{ height: 25, width: 25 }}
            source={require("../../assets/images/settingsIcon.png")}
          />
        </Text>
      )
    };
  };
  /*
	state = {
		location: {
			coords: {
				latitude: 0,
				longitude: 0
			}
		},
		errorMessage: null,
	}
	*/
  constructor(props) {
    super(props);
    this.state = {
      userdata: {
        //likes: ["-LatzfBxzsGzOG_ascfE"]
      },
      like_data: []
    };
  }
  componentWillMount() {
    if (Platform.OS === "Android" && !Constants.isDevice) {
      this.setState({
        errorMessage:
          "Oops, this will not work on Sketch in an android emulator. Try it on your device!"
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    //let geocode = await Location.reverseGeocodeAsync(location);
    this.setState({ location });
    //this.setState({geocode});
  };
  async componentDidMount() {
    await this.setState({
      keyData: this.props.navigation.state.params.dataKey
    });
    const ref = firebase.database().ref("Users/" + this.state.keyData);
    ref.once("value", snapshot => {
      //console.log(snapshot.val());
      this.setState({ userdata: snapshot.val() });
    });
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

  componentWillUnmount() {
    console.log("unmoiunt prfile");
  }

  render() {
    //location
    let text = "Waiting..";
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }
    //geoc = JSON.stringify(this.state.geocode);

    //update location to firebase
    firebase
      .database()
      .ref("/Users/" + this.props.navigation.state.params.dataKey)
      .update({
        location: text
      });

    return (
      <ImageBackground
        source={require("../../assets/images/bg.png")}
        style={styles.bg}
      >
        <ScrollView style={styles.container}>
          <ImageBackground
            source={{ uri: this.state.userdata.profile_picture }}
            style={styles.photo}
          />

          <ProfileItem
            name={
              this.state.userdata.first_name +
              " " +
              this.state.userdata.last_name
            }
            location={text}
            info1={this.state.userdata.email}
            info2={Demo[7].info2}
          />

          <Button title="Sign out" onPress={() => firebase.auth().signOut()} />
          {this.state.like_data.map((data, index) => {
            //return <Text>{data.topicname}</Text>;
          })}
        </ScrollView>
      </ImageBackground>
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
