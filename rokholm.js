function GoogleSignIn() {
    var provider = new firebase.auth.GoogleAuthProvider();

    /* 
    2.Optional: Specify additional OAuth 2.0 scopes that you want to request from the authentication provider. To add a scope, call addScope. For example:
    provider.addScope('https://www.googleapis.com/auth/plus.login');
    See the authentication provider documentation.
    
    3.Optional: Specify additional custom OAuth provider parameters that you want to send with the OAuth request. To add a custom parameter, call setCustomParameters on the initialized provider with an object containing the key as specified by the OAuth provider documentation and the corresponding value. For example:
    provider.setCustomParameters({
      'login_hint': 'user@example.com'
    });
    */


    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
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

function GoogleSignOff() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
    }, function (error) {
        // An error happened.
    });
}

console.log("works before scrape");
window.onload;

$( document ).ready(function() {
    document.getElementById('kinoLink').innerHTML = "Looking for movie on Kino.dk...";  
});


// Beginning of section that scrapes kino.dk's daily movies list for the different elements.
//It sends a JSON request to the specified YQL html and with tht Xpath path, and receives the disired objects as JSON

var d = new Date();
let urlDate = d.getFullYear() +"-" +(d.getUTCMonth()+1) +'-' +d.getDate();
console.log(urlDate);

$.getJSON("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fwww.kino.dk%2Fbooking%2Fflow%2Fday-step-2%3Fday%3D" +urlDate +"'%20and%20xpath%3D'%2F%2F*%5B%40id%3D%22block-system-main%22%5D%2Fdiv%2Fdiv%2Fdiv%5B1%5D%2Fdiv%2Fdiv%2Fdiv%5B2%5D'&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=").then(function (movieNames) {
    //Used for debugging, the recieved data. 
    //console.log(movieNames);
    //logs the object with class 'booking-day-two-content clearfix'and its child objects to console. 
    //console.log(getObjects(movieNames, 'class', 'booking-day-two-content clearfix'));
    //var kinoSearch = "https://www.imdb.com/video/imdb/" + getObjects(trailerput, 'class', 'booking-day-two-content clearfix');

    //This block of code cycles through the divs that each contain information about a specific movie.
    //It then gets the href element that we want and saves it in an array, which then can be accessed later.  
    let obj = movieNames.query.results.div.div;
    var arr = [];
    for (let i = 0; i < obj.length; i++) {
        if (obj[i].h2.a != undefined) arr[i] = obj[i].h2.a.href;

        //  console.log(arr[i]);
    }

    let imdbCodes = [];
    
    //$.getJSON("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fwww.kino.dk"+arr[0]+"'%20and%20xpath%3D'%2F%2F*%5B%40id%3D%22block-system-main%22%5D%2Fdiv%2Fdiv%2Fdiv%5B3%5D%2Fdiv%5B5%5D%2Fdiv%2Fdiv%2Fdiv%2Fdiv%2Fa'&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=").then(function (kinoImdb){
    for (let j = 0; j < arr.length; j++) {
        let url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fwww.kino.dk" + encodeURIComponent(arr[j]) + "'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
        $.getJSON(url).then(function (kinoImdb) {
            console.log("works after kinoID");
            let objKINO = getObjects(kinoImdb, 'class', 'panel-pane pane-entity-field pane-node-field-movie-imdb-link');
            objKINO = getObjects(objKINO, 'content', 'IMDb');
            if(objKINO.length > 0) {
            //    console.log(objKINO[0].href);
                let regexResults = objKINO[0].href.match(/\btt.{7}/g);
                if(regexResults[0] != undefined){
                    let currentMovieIMDBID = document.getElementById('imdbID').innerHTML;
                    imdbCodes[j] = regexResults[0];
                    if(regexResults[0] === currentMovieIMDBID){
                        console.log(regexResults[0] +" is equal to " +currentMovieIMDBID);
                        document.getElementById('kinoLink').innerHTML = '<a href="http://www.kino.dk' +arr[j] +'" target="_blank">View movie on Kino.dk</a>';
                        return;
                    }

                }
                
               // console.log(objKINO['0'].div.div.div.div.a.href);
            }
            
            /* let obj2 = kinoImdb.query.results.
            
            a.href;
             console.log(obj2);
             console.log("stuff");*/
        });
    }

    console.log(imdbCodes);

});
/*  if(kinoId == ImdbID) {

   }*/



// scrape imdb link

// crosscheck imdb link ID with omdb ID 

// document.getElementById('href').src = kinoSearch;

//Using a div from index.html to display the plot from the object search on.

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