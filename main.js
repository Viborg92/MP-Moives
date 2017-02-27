var config = {
    apiKey: "AIzaSyBa6c18Ip2mptMgiOUYuWgw3yTg-cm5-8A",
    authDomain: "mp-moive.firebaseapp.com",
    databaseURL: "https://mp-moive.firebaseio.com",
    storageBucket: "mp-moive.appspot.com",
    messagingSenderId: "596618721944"
};
firebase.initializeApp(config);


function facebookLogin() {

    var provider = new firebase.auth.FacebookAuthProvider();

    /*
    Specify additional OAuth 2.0 scopes that you want to request from the authentication provider.
    To add a scope, call addScope. For example:
    provider.addScope('user_birthday');
    */

    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
        console.log(user.displayName);
        document.getElementById("user").innerHTML = user.displayName;
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });

}

function facebookSignOut() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
    }, function (error) {
        // An error happened.
    });

}