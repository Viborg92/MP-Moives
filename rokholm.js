function GoogleSignIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
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

//waits until window is fully loaded before it continues with the code
window.onload;

//function that displays a "Looking for movie...." message while its doing the scraping and comparison of Kino movies.
$( document ).ready(function() {
    document.getElementById('kinoLink').innerHTML = "Looking for movie on Kino.dk...";  
});

//variables are defined that gets the current year,date,month - to be loaded into the YQL scrape of Kino
var d = new Date();
let urlDate = d.getFullYear() +"-" +(d.getUTCMonth()+1) +'-' +d.getDate();
// debug of the date retrieval in console
console.log(urlDate);

// Beginning of section that scrapes kino.dk's daily movies list for the different elements.
//It sends a JSON request to the specified YQL html and with tht Xpath path, and receives the disired objects as JSON
$.getJSON("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fwww.kino.dk%2Fbooking%2Fflow%2Fday-step-2%3Fday%3D" +urlDate +"'%20and%20xpath%3D'%2F%2F*%5B%40id%3D%22block-system-main%22%5D%2Fdiv%2Fdiv%2Fdiv%5B1%5D%2Fdiv%2Fdiv%2Fdiv%5B2%5D'&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=").then(function (movieNames) {
    //This block of code cycles through the divs that each contain information about a specific movie.
    //It then gets the href element that we want and saves it in an array, which then can be accessed later.  
    let obj = movieNames.query.results.div.div;
    var arr = [];
    for (let i = 0; i < obj.length; i++) {
        if (obj[i].h2.a != undefined) arr[i] = obj[i].h2.a.href;
    }

// Creates array that is used for saving IMDb IDs inside 
    let imdbCodes = [];
    
//inputs the hrefs from the arr into the YQL scrape request 
    for (let j = 0; j < arr.length; j++) {
        //YQL scrape request
        let url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fwww.kino.dk" + encodeURIComponent(arr[j]) + "'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
        $.getJSON(url).then(function (kinoImdb) {
           //Gets the objects in 'panel-pane..........-imdb-link'
           let objKINO = getObjects(kinoImdb, 'class', 'panel-pane pane-entity-field pane-node-field-movie-imdb-link');
            //Gets objects of 'IMDB' 
            objKINO = getObjects(objKINO, 'content', 'IMDb');
            //gets the href, but only the part that matches the regex results. 
            if(objKINO.length > 0) {
                let regexResults = objKINO[0].href.match(/\btt.{7}/g);
                if(regexResults[0] != undefined){
                    //Gets the IMDb movie ID stored on the MP-moives website, and stores it in a variable. 
                    let currentMovieIMDBID = document.getElementById('imdbID').innerHTML;
                    imdbCodes[j] = regexResults[0];
                    //checks if the imdb ID gathered from the kino.dk scrape, matches the one from the mp-moives website. 
                    //If yes, the link for that movie if currently available on kino.dk, where after it stops looking for matches. 
                    if(regexResults[0] === currentMovieIMDBID){
                        console.log(regexResults[0] +" is equal to " +currentMovieIMDBID);
                        document.getElementById('kinoLink').innerHTML = '<a href="http://www.kino.dk' +arr[j] +'" target="_blank">View movie on Kino.dk</a>';
                        return;
                    }
                }
            }
        });
    }
    //displays the IMDb IDs collected in console 
    console.log(imdbCodes);
});

//Function that loops through the json file to find the specified key and value in a given object. 
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