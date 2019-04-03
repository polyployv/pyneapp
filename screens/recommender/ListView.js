import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	Button,
	ListView,
	Dimensions,
	ImageBackground,
	TouchableHighlight
  } from 'react-native';
import _ from 'lodash';
import moment from 'moment';
import * as firebase from 'firebase';
import CardStack, { Card } from 'react-native-card-stack-swiper';
import City from '../../components/City';
import Filters from '../../components/Filters';
import CardItem from '../../components/CardItem';

export default class Recommender extends React.Component {
	static navigationOptions = ({ navigation }) => {
        return {
            title: 'Recommender',
            headerStyle: {
                backgroundColor: '#ffe3e3',
            },  
            headerTitleStyle: {
                color: '#444FAD',
            },
            
        };
      };
	  constructor() {
		super();
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		this.state = {
		  dataSource: ds.cloneWithRows(['row 1', 'row 2']),
		}
		this.usersRef = this.getRef().child('Users');
		this.renderRow = this.renderRow.bind(this);
		this.pressRow = this.pressRow.bind(this);
	  }
	  getRef(){
		  return firebase.database().ref();
	  }
	  componentWillMount(){
		  this.getUsers(this.usersRef);
	  }
	  componentDidMount(){
		  this.getUsers(this.usersRef);
	  }
	  getUsers(usersRef){
		  usersRef.on('value',(snap)=>{
			  let users = [];
			  snap.forEach((child)=>{
				  users.push({
					  name: child.val().first_name,
					  _key: child.key
				  });
			  });
		this.setState({
			dataSource: this.state.dataSource.cloneWithRows(users)
		});
 		});
	  }
	  pressRow(users){
		  console.log(users);
	  }

	  renderRow(item){
		  return (
			<ImageBackground
			source={require('../../assets/images/bg.png')}
			style={styles.bg}
		>
			<View style={styles.container}>
				<View style={styles.top}>
					<City />
					<Filters />
				</View>

				<CardStack
					loop={true}
					verticalSwipe={false}
					renderNoMoreCards={() => {
						return null;
					}}
					ref={swiper => {
						this.swiper = swiper;
					}}
				>
					{this.state.dataSource.map((item, index) => {
						return (
							<Card key={index}>
								<CardItem
									// image={item.image}
									name={item.first_name}
									// description={item.description}
									// matches={item.match}
									actions
									onPressLeft={() => {
										this.swiper.swipeLeft();
									}}
									onPressRight={() => {
										this.swiper.swipeRight();
									}}
								/>
							</Card>
						);
					})}
				</CardStack>
			</View>
		</ImageBackground>
			//   <TouchableHighlight onPress={() =>{
			// 	  this.pressRow(users);
			//   }}>
			//   <View><Text>{users.title}
			//   </Text></View></TouchableHighlight>
		  );
	  }
	render() {
			
	  return (
		<ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
      />

	 
	  );
	}
   
}
   
   
const styles = StyleSheet.create({
   container: {
   flex: 1,
   backgroundColor: '#F5FCFF',
   },
  });