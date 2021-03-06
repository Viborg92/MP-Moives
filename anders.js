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
        console.log(user);
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

function omdbSearch(input) {
    //   var input = document.getElementById('search').value;
    //Setting the input we get from the search bar which is located in index.html.
    var combinput = 'https://www.omdbapi.com/?t=' + encodeURI(input) + '&plot=full&apikey=d55929c4';
    //Creating a new varraible which is the combination of the input and the API for OMDB
    console.log(combinput);
    $.getJSON(combinput).then(function (output) {
        //Using jquery to gain the information from the api with the combined adress and input
        console.log(output);
        window.onload;
        document.getElementById('plot').innerHTML = output.Plot;
        document.getElementById('imdbRating').innerHTML = output.Ratings[0].Value;
        document.getElementById('tomatoRating').innerHTML = output.Ratings[1].Value;
        document.getElementById('Poster').innerHTML = '<img src="' + output.Poster + '" />';
        document.getElementById('imdbID').innerHTML = output.imdbID;
        //document.getElementById('runTime').innerHTML = output.Runtime;
        //Using the YQL to scape imdb, using the ID from omdb.
        $.getJSON("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fwww.imdb.com%2Ftitle%2F" + output.imdbID + "%2F'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys").then(function (trailerput){
            console.log(trailerput);
            //Here we call the function with the place we know the trailer ID is.
            console.log(getObjects(trailerput, 'class', 'slate'));
            var trailerSearch = "https://www.imdb.com/video/imdb/" + getObjects(trailerput, 'class', 'slate')[0].a["data-video"] + "/imdb/embed?autoplay=false&width=480";
            document.getElementById('trailerFrame').src = trailerSearch;
        });
        //Using a div from index.html to display the plot from the object search on.
    });
}
//Loops through the json file to find the class - slate - and then since java does not like "-" we need to to specify it as "[0].a["data-video"]" instead of
//a.datavideo if there was no "-"
function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else if (i == key && obj[key] == val) {
            objects.push(obj);
        }
    }
    return objects;
}

//When the document is done rendering, 
$(document).ready(function () {
    if (window.location.href.indexOf('search') > -1) {
        var url = window.location.href;
        var split = url.split('=');
        omdbSearch(split[1]);
    }
});

