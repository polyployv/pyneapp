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
import { Container, Header, Content, Body, Title} from "native-base";
import { uploadImages, deleteImage, updateAbout, logout } from '../../redux/actions'
import ProfileItem from '../../components/ProfileItem';



class ProfileScreen extends React.Component {
	static navigationOptions = {
    title: 'Profile',
    headerStyle: {
      backgroundColor: "#ffe3e3"
    }
  };
  render() {
    return (
			<Container>
        <Header style={{ backgroundColor: "#444fad" }}><Body><Title  style={{ color: "#fff" }}>Profile</Title></Body></Header>
        <Content>
					<ImageBackground
				source={require('../../assets/images/bg.png')}
				style={styles.bg}
			>
				<ScrollView style={styles.container}>
					<ImageBackground  source={{uri: this.props.user.profile_picture+"?width=2000"}}style={styles.photo}>
					</ImageBackground>
					<ProfileItem
						name={this.props.user.name}
					/>
				<TouchableOpacity onPress={ () => this.props.dispatch(logout()) }>
          <Text style={ styles.button }>Logout</Text>
        </TouchableOpacity>
				</ScrollView>
			</ImageBackground>	
</Content>
</Container>
          
   


        
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(ProfileScreen);