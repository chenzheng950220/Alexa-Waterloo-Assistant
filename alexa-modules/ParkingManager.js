/********************************
Parking Manager for Alexa
This module manages info fetched from API
*********************************/

const api_manager = require('./APIManager.js');
const speech_manager = require('./SpeechManager.js');
const card_manager = require('./CardManager.js');

module.exports = {
    getInfoForParkingLot: getInfoForParkingLot,
    getStudentParkingInfo: getStudentParkingInfo
};

function getStudentParkingInfo(callback, intent) {
	var request_type = "watpark";
	api_manager.getJSON(function(data) {
		var speech_out = ""; var card = {};
		if (data == "ERROR") {
			callback([null, speech_manager.generateGeneralSpeech().SPEECH_BAD_REQ]);
		}
		else if (data.data === undefined) {
			callback([null, speech_manager.generateGeneralSpeech().SPEECH_BAD_REQ]);
		}
		card = card_manager.generateCardForStudentParking(data, intent);
		speech_out += speech_manager.generateSpeechForStudentParking(data,intent);
		callback([card, speech_out]);
	}, request_type);
}

function getInfoForParkingLot(callback, intent) {
	var request_type = "";
	if (intent.slots.LotType.value === undefined) {
		callback([null, speech_manager.generateGeneralSpeech().SPEECH_LOT_INFO_MISS, null]);
	}
	else {
		request_type = intent.slots.LotType.value;
	}
	api_manager.getJSON(function(data) {
		var speech_out = ""; var card = null;
		if (data == "ERROR") {
			callback([null, speech_manager.generateGeneralSpeech().SPEECH_BAD_REQ, null]);
		}
		speech_out += speech_manager.generateSpeechForLotType(data, intent);
		card = card_manager.generateCardForLotType(data, intent);
		callback ([data, speech_out, card]);
	}, request_type);
}
