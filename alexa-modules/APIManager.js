/********************************
API Manager for Alexa
This module fetches info from UW Open API
*********************************/

const request = require('request');
const base_url_parking = "https://api.uwaterloo.ca/v2/parking/";
const base_url_weather = "https://api.uwaterloo.ca/v2/weather/current.json";
const base_url_resources = "https://api.uwaterloo.ca/v2/resources/";
const token = "da4f8f38697f99b07a89ce05c3dcf755";
const parking_request_types = ["watpark", "meter", "permit", "visitor",
    "shortterm", "accessible", "motorcycle"];

module.exports = {
    getJSON: getJSON
};

function getUrl(request_type) { // get appropriate url
    if (request_type == "weather") { // weather request
        return (base_url_weather + "?key=" + token);
    }
    else if (request_type == "goosewatch") {
        return (base_url_resources + "goosewatch.json?key=" + token);
    }
    var index = parking_request_types.indexOf(request_type);
    switch (index) {
        case -1:
            console.log("ERROR: Wrong type passed in request_type: "+request_type);
            return "BAD_REQ_TYPE"; break;

        case 0:
            return (base_url_parking + "watpark.json?key=" + token);
            break;

        default:
            return (base_url_parking + "lots/" + request_type + ".json?key=" + token);
    }
}

function getJSON(callback, request_type) {
    var url = getUrl(request_type);
    if (url.substring(0,5) != "https") { callback("ERROR"); }
    request.get(url, function(error, response, body) {
        if (response.statusCode != 200) {
            console.log(getUrl(request_type));
            console.log("ERROR: Http request error: "+response.statusCode);
            callback("ERROR");
        }
        try {
            var d = JSON.parse(body);
            if (d !== null) {
                callback(d);
            }
            else {
                console.log("ERROR: JSON parsing retuns null! ");
                callback("ERROR");
            }
        }
        catch (e) {
            console.log("ERROR: "+e);
            callback("ERROR");
        }
    });
}
