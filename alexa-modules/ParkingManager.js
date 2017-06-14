/********************************
Parking Manager for Alexa
This module manages info fetched from API
*********************************/

const api_manager = require('./APIManager.js');
const speech_manager = require('./SpeechManager.js');
const card_manager = require('./CardManager.js');
const db_manager = require('./DBManager.js');
const debug = require('./Debug.js');
const util = require('./Util.js');

module.exports = {
    getInfoForParkingLot: getInfoForParkingLot,
    getStudentParkingInfo: getStudentParkingInfo
};

function getStudentParkingInfo(callback, intent) {
	var request_type = {
		type: "parking",
		parking_type: "watpark"
	};
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

function getInfoForParkingLotName(callback, intent) {
	// get information for one specific parking lot name
	var request_lot = "";
	var speech_out = ""; var card = null;
	if (intent.slots.LotName.value === undefined) {
		callback([null, speech_manager.generateGeneralSpeech().SPEECH_LOT_INFO_MISS, null]);
	}
	else {
		request_lot = intent.slots.LotName.value;
	}

	// get info from db
	db_manager.queryLotNameEquals(request_lot, function(err, data) {
		if (err) {
			callback([null, speech_manager.generateGeneralSpeech().SPEECH_DB_ERROR, null]);
			return; // no need to continue here
		}
		else {
			data.Items = util.combineParkingLots(data.Items);
			if (data.Items.length === 0) {
				// query gives empty, try another approach, give debug info here
				if (debug.debug_flag) {
					console.log("WARNING: Database query gave an empty response. Trying to use contains condition. ");
				}
				getInfoForParkingLotNameConatins(callback, intent);
			}
			else {
				speech_out += speech_manager.generateSpeechForLotName(data.Items, intent);
				card = card_manager.generateCardForLotName(data.Items, intent);
				callback([null, speech_out, card]); // no need to continue session here, set [0] to null
				return; // this function should be terminated here, request success
			}
		}
	});
}

function getInfoForParkingLotNameConatins(callback, intent) {
	var request_lot = intent.slots.LotName.value;
	var speech_out = ""; var card = null;
	// try to use contains condition for current request
	db_manager.queryLotNameContains(request_lot, function(err, data) {
		if (err) {
			callback([null, speech_manager.generateGeneralSpeech().SPEECH_DB_ERROR, null]);
			return; // no need to continue here
		}
		else {
			data.Items = util.combineParkingLots(data.Items);
			if (data.Items.length === 0) {
				// still gives no response, prompt user error message, cannot handle!
				callback([null, speech_manager.generateGeneralSpeech().SPEECH_DB_EMPTY, null]);
				return; // no need to continue here
			}
			else {
				speech_out += speech_manager.generateSpeechForLotName(data.Items, intent);
				card = card_manager.generateCardForLotName(data.Items, intent);
				callback([null, speech_out, card]); // no need to continue session here, set [0] to null
			}
		}
	});
}

function getInfoForParkingLot(callback, intent) { // get information for a parking type
	var request_type = {};
	if (intent.slots.LotType.value === undefined) {
		getInfoForParkingLotName(callback, intent);
		return;
	}
	else {
		request_type = {
			type: "parking",
			parking_type: intent.slots.LotType.value
		};
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
