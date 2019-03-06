import React from 'react';
import {
	StyleSheet,
	ScrollView,
	View,
	Text,
	ImageBackground,
	Dimensions,
	TouchableOpacity,
	Button
} from 'react-native';
import * as firebase from 'firebase';
import ProfileItem from '../../components/ProfileItem';
import Demo from '../../assets/data/demo.js';


export default class ProfileScreen extends React.Component {
	static navigationOptions = {
		title:  'Profile',
		headerStyle: {
			backgroundColor: '#ffe3e3',
		},
		headerTitleStyle: {
			color: '#444FAD',
		},
	  
	};
	constructor(props) {
		super(props);
		this.state = {
		  userdata: ""
		}
	  }
	async componentDidMount() {
		await this.setState({keyData: this.props.navigation.state.params.dataKey})
		const ref = firebase.database().ref('Users/'+this.state.keyData);
		ref.once('value', snapshot => {
		  this.setState({'userdata': snapshot.val()})
		});
	  }
	render() {
		return (
			<ImageBackground
				source={require('../../assets/images/bg.png')}
				style={styles.bg}
			>
				<ScrollView style={styles.container}>
					<ImageBackground source={this.state.userdata.profile_picture} style={styles.photo}>
					</ImageBackground>

					<ProfileItem
						name={this.state.userdata.first_name}
						alignItems={Demo[7].age}
						location={Demo[7].location}
						info1={this.state.userdata.email}
						info2={Demo[7].info2}
					/>
					<Button title="Sign out" onPress={() => firebase.auth().signOut()} />
				</ScrollView>
				
			</ImageBackground>
			

		);
	}
}

const styles = StyleSheet.create({
	container: { marginHorizontal: 0 },
	bg: {
		flex: 1,
		resizeMode: 'cover',
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height
	},
	photo: {
		width: Dimensions.get('window').width,
		height: 450
	},
	top: {
		paddingTop: 50,
		marginHorizontal: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	topIconLeft: {

		fontSize: 20,
		color: '#FFF',
		paddingLeft: 20,
		marginTop: -20,
		transform: [{ rotate: '90deg' }]
	},
	topIconRight: {
		fontSize: 20,
		color: '#FFF',
		paddingRight: 20
	},
	actions: {
		justifyContent: 'center',
		flexDirection: 'row',
		alignItems: 'center'
	},
	iconButton: { fontSize: 20, color: '#FFF' },
	textButton: {
		fontSize: 15,
		color: '#FFF',
		paddingLeft: 5
	},
	circledButton: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: '#7444C0',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 10
	},
	roundedButton: {
		justifyContent: 'center',
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: 10,
		height: 50,
		borderRadius: 25,
		backgroundColor: '#5636B8',
		paddingHorizontal: 20
	}
});



