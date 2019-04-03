import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Slider
} from 'react-native';
import * as firebase from 'firebase';

export default class Age extends Component {
  constructor(props) {
   super(props)
   this.state = { user: this.props.navigation.state.params.user, agefrom: 18, ageto:71}
 
  }
  componentDidMount(){
    const { ageRange } = this.state.user
    this.setState({ agefrom: ageRange[0],ageto: ageRange[1] })
    this.agefrom = ageRange[0]
    this.ageto = ageRange[1]
  }
  getValfrom(val){
      if(val<this.ageto){
      const { uid } = this.state.user
      const userData = {
          ageRange: [val, this.ageto ]
        }
      this.agefrom = val
      firebase.database().ref('Users').child(uid).update({ ...userData})
    }else{
      this.setState({ agefrom: this.agefrom })
    }
  }
  getValto(val){
    if(val>this.agefrom){
      const { uid } = this.state.user
      const userData = {
          ageRange: [this.agefrom, val]
        }
      this.ageto = val
      firebase.database().ref('Users').child(uid).update({ ...userData})
    }else{
      this.setState({ ageto: this.ageto })
    }
  }
  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.instructions}>
        age from :
      </Text>
        <Slider
          style={{ width: 300 }}
          step={1}
          minimumValue={18}
          maximumValue={71}
          value={this.state.agefrom}
          onValueChange={val => val<this.ageto ? this.setState({ agefrom: val }) :  this.no = 0 }
          onSlidingComplete={ val => this.getValfrom(val)}
        />
 
        <Text style={styles.welcome}>
          {this.state.agefrom}
        </Text>
        <Text style={styles.instructions}>
          age to :
        </Text>
        <Slider
          style={{ width: 300 }}
          step={1}
          minimumValue={18}
          maximumValue={71}
          value={this.state.ageto}
          onValueChange={val => val>this.agefrom ? this.setState({ ageto: val }) : this.no = 0 }
          onSlidingComplete={ val => this.getValto(val)}
        />
        <Text style={styles.welcome}>
          {this.state.ageto}
        </Text>
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});