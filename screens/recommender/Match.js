import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image
} from 'react-native';
import _ from 'lodash';
import moment from 'moment';
import * as firebase from 'firebase';
export default class Match extends Component {
  constructor(props) {
   super(props)
   const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
   this.state = {
     user: this.props.screenProps,
     dataSource: ds.cloneWithRows([]),
    }
  }
    componentDidMount(){
 
    const { uid } = this.state.user
    this.firebaseRef = firebase.database().ref('Users')
    this.firebaseRef.on('value', snap => {
 
       let users = snap.val();
 
        const rejectMe = _.reject(users, user => user.uid === uid)
        const filterMe = _.filter(users, user => user.uid === uid)
        const user = filterMe[0];
        /* Age filter start */
        const userBday = moment(user.birthday, 'MM/DD/YYYY')
        const userAge = moment().diff(userBday, 'years')
        const filterByAge = _.filter(rejectMe, profile => {
        const profileBday = moment(profile.birthday, 'MM/DD/YYYY')
        const profileAge = moment().diff(profileBday, 'years')
        const inRangeUser = _.inRange(profileAge, user.ageRange[0], user.ageRange[1] + 1)
        const inRangeProfile = _.inRange(userAge, profile.ageRange[0], profile.ageRange[1] + 1)
        return inRangeUser && inRangeProfile
      })
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({ dataSource: ds.cloneWithRows(filterByAge) })
    })
  }
  renderRow(rowData, sectionID, rowID) {
    return (
    <View style={styles.rowContainer}>
    <Image source={{ uri: rowData.profile_picture }} style={styles.photo} />
    <Text style={styles.text}>
      {`${rowData.first_name} ${rowData.last_name}`}
    </Text>
  </View>
)
  }
  render() {
 
    return (
      <ListView
        enableEmptySections={true}
        removeClippedSubviews={false}
        style={styles.container}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}
      />
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  rowContainer: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
  },
  photo: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
});