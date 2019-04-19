import React from 'react';
import styles from '../styles'

import { 
  Text, 
  View,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

class Cards extends React.Component {
  constructor(props){
    super(props)
  }
  componentDidMount = () => {
    //console.log('card', this.props)
  }
  render() {
    return (
      <TouchableOpacity >
        <ImageBackground style={styles.card} imageStyle={{borderRadius: 10}} source={{uri: this.props.profile_picture+"?width=2000"}}>
          <View style={styles.cardDescription}>
            <View style={styles.cardInfo}>
              <Text style={styles.bold}>{this.props.name}</Text>
              <Text>{this.props.aboutMe}</Text>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    )
  }
}

export default Cards
