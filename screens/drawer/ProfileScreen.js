import React from 'react';
import styles from '../../styles'
import {
	StyleSheet,
	ScrollView,
	View,
	Text,
	ImageBackground,
	Dimensions,
	TouchableOpacity,
	Button,
	TextInput
} from 'react-native';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { uploadImages, deleteImage, updateAbout, logout } from '../../redux/actions'
import ProfileItem from '../../components/ProfileItem';



class ProfileScreen extends React.Component {

  deleteImage(){
    this.self.props.dispatch(deleteImage(this.self.props.user.images, this.key))
  }

  addImage(){
    this.props.dispatch(uploadImages(this.props.user.images))
  }

  render() {
    return (
					<ImageBackground
				source={require('../../assets/images/bg.png')}
				style={styles.bg}
			>
				<ScrollView style={styles.container}>
					<ImageBackground  source={{uri: this.props.user.photoUrl+"?width=2000"}}style={styles.photo}>
					</ImageBackground>
					<ProfileItem
						name={this.props.user.name}
					/>

					<Text style={styles.bold}>About</Text>
          <TextInput
            style={styles.textInput}
            multiline={true}
            numberOfLines={5}
            onChangeText={(text) => this.props.dispatch(updateAbout(text))}
            value={this.props.user.aboutMe}/>
				<TouchableOpacity onPress={ () => this.props.dispatch(logout()) }>
          <Text style={ styles.button }>Logout</Text>
        </TouchableOpacity>
     

				</ScrollView>
				
			</ImageBackground>	

          
   


        
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(ProfileScreen);