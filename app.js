const http = require("http");
const verifier = require("alexa-verifier");
const config = require("./config.js");
const alexa = require("./index.js");
const debug = require("./alexa-modules/Debug.js");

http.createServer(onRequest).listen(config.port);

function handleAlexaRequest(body_json, res, response_header) {
  alexa.server_handler(body_json, function (alexa_response) {
    var response_json = JSON.stringify(alexa_response);
    res.writeHead(200, "OK", response_header);
    if (debug.debug_flag) { console.log(response_json); }
    res.end(response_json); // write JSON response
  });
}

function verifySignature(req, body_str, callback) {
  var cert_url = req.headers.signaturecertchainurl;
  var sig = req.headers.signature;
  verifier(cert_url, sig, body_str, function(error) {
    if (error !== undefined) { callback([false, error]); }
    else { callback([true, null]); }
  });
}

function onRequest(req, res) {
  var response_header = {  
    "Content-Type": "application/json;charset=UTF-8"
  };

  // verify authentication of the request
  var body = []; var body_str; var body_json;
  req.on("data", function(chunk) {
    body.push(chunk);
  }).on("end", function () {
    body_str = Buffer.concat(body).toString();
    if (debug.debug_flag) { console.log(body_str); }
    try {
      body_json = JSON.parse(body_str);
    }
    catch (e) {
      res.writeHead(422, "Invalid Request", response_header); 
      res.end();
      return;
    }
    
    verifySignature(req, body_str, function(verification_result) {
      if (!verification_result[0]) { // unauthorised request
        console.log("ERROR: " + verification_result[1]);
        res.writeHead(401, "Authentication failed! ", response_header); 
        res.end();
      }
      else { // cert OK
        handleAlexaRequest(body_json, res, response_header);
      }
    });
  });
}
