var http = require('http');
var verifier = require('alexa-verifier');
var config = require('./config.js');
var alexa = require('./server.js');

var debug = false;

http.createServer(onRequest).listen(config.port);

function onRequest(req, res) {
	var response_header = {  
		"Content-Type": 'application/json;charset=UTF-8',
	};

	// Request Query Fields
	req_header = req.headers;
    if (debug) { console.log(req_header); }

	// verify authentication of the request
	var body = []; var response; var body_str;
	req.on('data', function(chunk) {
		body.push(chunk);
	}).on('end', function () {
		body_str = Buffer.concat(body).toString();
		try {
			body_json = JSON.parse(body_str);
		}
		catch (e) {
			console.log("ERROR: JSON parsing on request body failed! ");
				res.writeHead(400, "Bad Request! ", response_header); 
				res.end();
				return;
		}

		// authenticate the request
		verifySignature(req, body_str, function(cert_veri) {
			if (!cert_veri[0]) { // unauthorised request
				console.log("ERROR" + cert_veri[1]);
				res.writeHead(401, "Authentication failed! ", response_header); 
				res.end();
				return;
			}
		});

		// handle request from AVS
		alexa.handler(body_json, function (alexa_response) {
			res.writeHead(200, "OK", response_header);
			res.end(JSON.stringify(alexa_response)); // write JSON response
		});
	});
}

function verifySignature(req, body_str, callback) {
	var cert_url = req.headers.signaturecertchainurl;
	var sig = req.headers.signature;
	verifier(cert_url, sig, body_str, function(error) {
		if (error !== undefined) {
			callback([false, error]);
		}
		else {
			callback([true, null]);
		}
	});
}