import Firebase from 'firebase';  
let config= {
		apiKey: "AIzaSyBgFjUQyW35lFlgF8Q-Fmf4HtnaKGqRbaw",
        authDomain: "pyneproject-ad8b5.firebaseapp.com",
        databaseURL: "https://pyneproject-ad8b5.firebaseio.com",
        projectId: "pyneproject-ad8b5",
        storageBucket: "pyneproject-ad8b5.appspot.com",
        messagingSenderId: "33590640481"
}
let app = Firebase.initializeApp(config);  
export const db = app.database();  
