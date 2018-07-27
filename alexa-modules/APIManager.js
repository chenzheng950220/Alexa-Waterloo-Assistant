/********************************
API Manager for Alexa
This module fetches info from UW Open API
*********************************/

const request = require("request");
const secret = require("./secret.js");
const base_url_parking = "https://api.uwaterloo.ca/v2/parking/";
const base_url_weather = "https://api.uwaterloo.ca/v2/weather/current.json";
const base_url_resources = "https://api.uwaterloo.ca/v2/resources/";
const base_url_course = "https://api.uwaterloo.ca/v2/courses/";
const parking_request_types = ["watpark", "meter", "permit", "visitor",
  "shortterm", "accessible", "motorcycle"];

module.exports = {
  getJSON() getJSON
};

function getUrl(request_type) { // get appropriate url
  const type = request_type.type;

  switch (type) {
    case "weather":
      return (base_url_weather + "?key=" + secret.token);

    case "goosewatch":
      return (base_url_resources + "goosewatch.json?key=" + secret.token);

    case "parking":
      var parking_type = request_type.parking_type;
      var index = parking_request_types.indexOf(parking_type);
      switch (index) {
      case -1:
        console.log("ERROR: Wrong type passed in request_type: "+request_type);
        return "BAD_REQ_TYPE";

      case 0:
        return (base_url_parking + "watpark.json?key=" + secret.token);

      default:
        return (base_url_parking + "lots/" + parking_type + ".json?key=" + secret.token);
      }
      break;

    case "course":
      return (base_url_course + request_type.subject + "/" + request_type.catelog + ".json?key=" + secret.token);

    default:
      return "ERROR";
  }
}

function getJSON(callback, request_type) {
  // request_type is a dictionary contains request information
  var url = getUrl(request_type);
  if (url.substring(0,5) !== "https") { callback("ERROR"); }
  request.get(url, function(error, response, body) {
    if (response.statusCode === 200) {
      try {
        var d = JSON.parse(body);
        if (d !== null) {
          const api_status_code = d.meta.status;
          if (api_status_code === 204) { callback("EMPTY"); }
          else { callback(d); }
        }
        else {
          console.log("ERROR: JSON parsing returns null! ");
          callback("ERROR");
        }
      }
      catch (e) {
        console.log("ERROR: "+e);
        callback("ERROR");
      }
    }
    else {
      console.log(getUrl(request_type));
      console.log("ERROR: Http request error: "+response.statusCode);
      callback("ERROR");
    }
  });
}
