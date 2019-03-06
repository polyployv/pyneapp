import React from 'react';
import { StyleSheet, View, ImageBackground, Dimensions } from 'react-native';
import CardStack, { Card } from 'react-native-card-stack-swiper';
import City from '../../components/City';
import Filters from '../../components/Filters';
import CardItem from '../../components/CardItem';
import Demo from '../../assets/data/demo.js';
import Icon from 'react-native-vector-icons/FontAwesome'


export default class RecommenderScreen extends React.Component {
	static navigationOptions = {
		title:  'Recommender',
		headerStyle: {
			backgroundColor: '#ffe3e3',
		},
		headerTitleStyle: {
			color: '#444FAD',
		},
	  };

	state = {
		data: Demo
	};

	render() {
		return (
			<ImageBackground
				source={require('../../assets/images/bg.png')}
				style={styles.bg}
			>
				<View style={styles.container}>
					

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
						{this.state.data.map((item, index) => {
							return (
								<Card key={index}>
									<CardItem
										image={item.image}
										name={item.name}
										description={item.description}
										matches={item.match}
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
		);
	}
}

const styles = StyleSheet.create({
	container: { marginHorizontal: 10 },
	bg: {
		flex: 1,
		resizeMode: 'cover',
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height
	},
	top: {
		paddingTop: 50,
		marginHorizontal: 10,
		flexDirection: 'row',
		justifyContent: 'space-between'
	}
});