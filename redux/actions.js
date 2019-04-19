import * as firebase from 'firebase';

import { Location, Permissions, Notifications } from 'expo';
import { Alert } from 'react-native';
import Geohash from 'latlon-geohash';
const lodash = require('lodash')

export function login(user){
  return function(dispatch){
		let params = {
		  uid: user.uid,
		  profile_picture: user.photoURL,
		  name: user.displayName,
		  aboutMe: ' ',
			geocode: ' ',
			email: ' ',
			interests_number: {
				1:0,
				2:0,
				3:0,
				4:0,
				5:0,
				6:0,
				7:0,
				8:0,
				9:0,
				10:0,
				11:0,
				12:0
			},
			interests_final: '',
			created_at: Date.now(),
			friends: '',
		  notification: false,
		  show: false,
		  report: false,
		  swipes: {
		    [user.uid]: false
		  },
		  token: ' ',
		}
		firebase.database().ref('Users/').child(user.uid).once('value', function(snapshot){
		  if(snapshot.val() !== null){
		    dispatch({ type: 'LOGIN', user: snapshot.val(), loggedIn: true });
		  } else {
		    firebase.database().ref('Users/' + user.uid ).update(params);
		    dispatch({ type: 'LOGIN', user: params, loggedIn: true });
		  }
		  dispatch(getLocation())
		})
  }
}

export function logout(){
	return function(dispatch){
    firebase.auth().signOut()
    dispatch({ type: 'LOGOUT', loggedIn: false });
   }
}


export function updateAbout(value){
	return function(dispatch){
		dispatch({ type: 'UPDATE_ABOUT', payload: value });
    setTimeout(function(){  
			firebase.database().ref('Users/' + firebase.auth().currentUser.uid).update({ aboutMe: value });
    }, 3000);
  }
}


export function getCards(geocode){
	return function(dispatch){
		firebase.database().ref('Users').orderByChild("geocode").equalTo(geocode).once('value', (snap) => {
		  var items = [];
		  snap.forEach((child) => {
		    item = child.val();
				item.id = child.key;
		    items.push(item); 
			});	
			let me_uid = firebase.auth().currentUser.uid
			var me = items.find(item =>{
				return item.uid === me_uid;	
			})
			let interest = me.interests_final
			let sorted = Object.keys(interest).sort(function(a,b){return interest[b]-interest[a]})
			var items_fin = [];
			sorted.forEach(i=>{
				var user = items.find(item =>{
				return	item.uid === i;	
				})
				items_fin.push(user);
			})
			dispatch({ type: 'GET_CARDS', payload: items });
		});
	}
}




export function getLocation(){
	return function(dispatch){
		Permissions.askAsync(Permissions.LOCATION).then(function(result){
		  if(result){
		    Location.getCurrentPositionAsync({}).then(function(location){
		      var geocode = Geohash.encode(location.coords.latitude, location.coords.longitude, 8)
		      firebase.database().ref('Users/' + firebase.auth().currentUser.uid).update({geocode: geocode});
		      dispatch({ type: 'GET_LOCATION', payload: geocode });
		    })
		  }
		})
	}
}



export function sendNotification(id, name, text){
  return function(dispatch){
    firebase.database().ref('Users/' + id).once('value', (snap) => {
      if(snap.val().token != null){

        return fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: snap.val().token,
            title: name,
            body: text,
          }),
        });

      }
    });
  }
}