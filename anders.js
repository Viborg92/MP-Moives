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

//want the sreach word + the website, should give us all the information, then create a structure which to show case this information



function omdbSearch(){
    var input = document.getElementById('search').value;
    var kek = 'https://www.omdbapi.com/?t=' +  encodeURI(input);
    console.log(kek);
    $.getJSON(kek).then(function(output){
        console.log(output);
        document.getElementById('plot').innerHTML = output.Plot;
    });
}


