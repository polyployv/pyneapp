import React from 'react';
import { StyleSheet } from 'react-native';

var Dimensions = require('Dimensions');
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  color: {
  	color: '#df4723'
  },
  logo: {
    width: 100, 
    height: 55,
    marginTop: 70
  },
  nav: {
    marginTop: 70
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
  img: {
  	width: 70,
  	height: 70,
  	borderRadius: 35,
  	margin: 10,
  	backgroundColor: '#fff',
  },
  imgRow: {
		flexWrap: 'wrap',
		flexDirection: 'row',
		padding: 15,
  },
  textInput: {
    width: 300,
    padding: 15,
    backgroundColor: '#fff',
    height: 100,
    borderRadius: 10,
    alignItems:'center',
    borderColor: '#cccccc',
    borderWidth: 2,
  },
  bold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444fad',
  },
  buttonSave: {
    borderRadius: 15,
	  textAlign: 'center',
    backgroundColor: '#ff3879',
    color: '#fff',
	  padding: 15,
	  margin: 15,
    fontSize: 18,
	  fontWeight: 'bold',
  },
  button: {
	  borderRadius: 15,
	  textAlign: 'center',
    backgroundColor: '#ff3879',
    color: '#fff',
	  padding: 15,
	  margin: 15,
    fontSize: 18,
    alignItems: 'flex-end',
	  fontWeight: 'bold',
  },
  buttonBlue: {
	  borderRadius: 15,
	  textAlign: 'center',
    backgroundColor: '#444fad',
    color: '#fff',
	  padding: 15,
	  margin: 15,
    fontSize: 18,
    alignItems: 'flex-end',
	  fontWeight: 'bold',
  },
  card: {
    width: deviceWidth*.9,
    height: deviceHeight*.75,
  },
  cardDescription: {
    padding: 15,
    justifyContent: 'flex-end',
    flex: 1,
  },
  cardInfo: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
  },
  border: {
    borderTopColor: '#bbb', 
    borderTopWidth: 0.5, 
  },
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
})

module.exports = styles