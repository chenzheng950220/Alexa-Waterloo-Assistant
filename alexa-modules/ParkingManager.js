/********************************
Parking Manager for Alexa
This module manages info fetched from API
*********************************/

var api_manager = require('./APIManager.js');
var speech_manager = require('./SpeechManager.js');

module.exports = {
    getInfoForParkingLot: getInfoForParkingLot,
    getStudentParkingInfo: getStudentParkingInfo
};

function getStudentParkingInfo(callback, intent) {
	var request_type = "watpark";
	api_manager.getJSON(function(data) {
		var speech_out = "";
		if (data == "ERROR") {
			callback(speech_manager.generateGeneralSpeech("json_error"));
		}
		speech_out += speech_manager.generateSpeechForStudentParking(data,intent);
		callback(speech_out);
	}, request_type);
}

function getInfoForParkingLot(callback, intent) {
	var request_type = ""; var lot_type = false;
	if (intent.slots.LotType !== undefined) {
		request_type = intent.slots.LotType.value;
		lot_type = true;
	}
	else {
		lot_type = false;
		throw "ERROR: Not implemented yet! "; // FIX ME!
	}
	api_manager.getJSON(function(data) {
		var speech_out = "";
		if (data == "ERROR") {
			callback(speech_manager.generateGeneralSpeech("json_error"));
		}
		if (lot_type) {
			speech_out += speech_manager.generateSpeechForLotType(data,intent);
		}
		else {
			throw "ERROR: Not implemented yet! "; // FIX ME!
		}
		callback(speech_out);
	}, request_type);
}
