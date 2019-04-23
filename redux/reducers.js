export default reducers = (state = {
    loggedIn: false,
    cards: [],
    user: {
		  uid: '',
		  profile_picture: '',
      name: '',
      email: '',
		  aboutMe: ' ',
		  friends: ' ',
		  geocode: ' ',
      interests_number: [],
      interests_fin: [],
		  notification: false,
		  show: false,
		  report: false,
		  swipes: [],
		  token: ' ',
    }, 
    geocodesubstring: "1",
  }, action) => {
    switch (action.type) {
      case 'LOGIN': {
        return { ...state, user: action.user, loggedIn: action.loggedIn }
      }
      case 'LOGOUT': {
        return { ...state, loggedIn: action.loggedIn }
      }
      case 'UPDATE_ABOUT':      
        return { ...state, user: { ...state.user, aboutMe : action.payload } 
      }
      case 'GET_CARDS':
      const values = action.payload.filter(item => item !== undefined)  
        return { ...state, cards: values
      }
      case 'GET_LOCATION':      
        return { ...state, user: { ...state.user, geocode : action.payload } 
      }
      case 'CHANGE_GEO':
        return { ...state, geocodesubstring: action.payload
      }
      case 'ALLOW_NOTIFICATIONS':      
        return { ...state, user: { ...state.user, token : action.payload } 
      }
    }
    return state;
} 