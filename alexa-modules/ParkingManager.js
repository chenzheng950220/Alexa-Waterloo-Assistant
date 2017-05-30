/********************************
Parking Manager for Alexa
This module manages info fetched from API
*********************************/

var api_manager = require('./APIManager.js');
var speech_manager = require('./SpeechManager.js');
var card_manager = require('./CardManager.js');

module.exports = {
    getInfoForParkingLot: getInfoForParkingLot,
    getStudentParkingInfo: getStudentParkingInfo
};

function getStudentParkingInfo(callback, intent) {
	var request_type = "watpark";
	api_manager.getJSON(function(data) {
		var speech_out = ""; var card = {};
		if (data == "ERROR") {
			callback([null, speech_manager.generateGeneralSpeech("BAD_JSON")]);
		}
		else if (data.data === undefined) {
			callback([null, speech_manager.generateGeneralSpeech(data)]);
		}
		card = card_manager.generateCardForStudentParking(data, intent);
		speech_out += speech_manager.generateSpeechForStudentParking(data,intent);
		callback([card, speech_out]);
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
		var speech_out = ""; var card = null;
		if (data == "ERROR") {
			callback([null, speech_manager.generateGeneralSpeech("json_error"), null]);
		}
		if (lot_type) {
			speech_out += speech_manager.generateSpeechForLotType(data, intent);
			card = card_manager.generateCardForLotType(data, intent);
		}
		else {
			throw "ERROR: Not implemented yet! "; // FIX ME!
		}
		callback ([data, speech_out, card]);
	}, request_type);
}
