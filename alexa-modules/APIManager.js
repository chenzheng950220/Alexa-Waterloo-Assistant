/********************************
API Manager for Alexa
This module fetches info from UW Open API
*********************************/

var request = require('request');
var base_url = "https://api.uwaterloo.ca/v2/parking/";
var token = "da4f8f38697f99b07a89ce05c3dcf755";
var request_types = ["watpark", "meter", "permit", "visitor",
    "shortterm", "accessible", "motorcycle"];

module.exports = {
    getJSON: getJSON
};

function getUrl(request_type) { // get appropriate url
    // type can ONLY be the following:
    // watpark, meter, permit, visitor, shortterm, accessible, motorcycle
    var index = request_types.indexOf(request_type);
    if (index == -1) {
        console.log("ERROR: Wrong type passed in request_type: "+request_type);
        return "BAD_REQ_TYPE";
    }
    else if (index == 0) {
        return (base_url + "watpark.json?key=" + token);
    }
    else {
        return (base_url + "lots/" + request_type + ".json?key=" + token);
    }
}

function getJSON(callback, request_type) {
    var url = getUrl(request_type);
    if (url.substring(0,5) != "https") { callback(url); }
    request.get(url, function(error, response, body) {
        if (response.statusCode != 200) {
            console.log(getUrl(request_type));
            console.log("ERROR: Http request error: "+response.statusCode);
            callback("BAD_REQ");
        }
        var d = JSON.parse(body);
        if (d != null) {
            callback(d);
        }
        else {
            console.log("ERROR: JSON parsing retuns null! ");
            callback("ERROR");
        }
    });
}
