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
    var ret_val = {
        error_flag: false,
        error_msg: "",
        speech_out: "",
        card: null,
        session_flag: true,
        session_attr: null
    };

	var request_type = {
		type: "parking",
		parking_type: "watpark"
	};
	api_manager.getJSON(function(data) {
		if (data === "ERROR") {
			ret_val.error_flag = true;
			ret_val.error_msg = speech_manager.generateGeneralSpeech().SPEECH_BAD_REQ;
			callback(ret_val);
		}
		else if (data === "EMPTY") {
            ret_val.error_flag = true;
            ret_val.error_msg = speech_manager.generateGeneralSpeech().SPEECH_BAD_REQ;
            callback(ret_val);
		}
		else {
            ret_val.card = card_manager.generateCardForStudentParking(data, intent);
            ret_val.speech_out += speech_manager.generateSpeechForStudentParking(data,intent);
            callback(ret_val);
		}
	}, request_type);
}

function getInfoForParkingLotName(callback, intent) {
    var ret_val = {
        error_flag: false,
        error_msg: "",
        speech_out: "",
        card: null,
        session_flag: true,
        session_attr: null
    };

	// get information for one specific parking lot name
	var request_lot = "";
	if (intent.slots.LotName.value === undefined) {
		ret_val.error_flag = true;
		ret_val.error_msg = speech_manager.generateGeneralSpeech().SPEECH_LOT_INFO_MISS;
		callback(ret_val); return;
	}
	else {
		request_lot = intent.slots.LotName.value;
	}

	// get info from db
	db_manager.queryLotNameEquals(request_lot, function(err, data) {
		if (err) {
			ret_val.error_flag = true;
			ret_val.error_msg = speech_manager.generateGeneralSpeech().SPEECH_DB_ERROR;
			callback(ret_val);
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
				ret_val.speech_out += speech_manager.generateSpeechForLotName(data.Items, intent);
				ret_val.card = card_manager.generateCardForLotName(data.Items, intent);
				callback(ret_val); // no need to continue session here, set [0] to null
			}
		}
	});
}

function getInfoForParkingLotNameConatins(callback, intent) {
    var ret_val = {
        error_flag: false,
        error_msg: "",
        speech_out: "",
        card: null,
        session_flag: true,
        session_attr: null
    };

	var request_lot = intent.slots.LotName.value;
	// try to use contains condition for current request
	db_manager.queryLotNameContains(request_lot, function(err, data) {
		if (err) {
			ret_val.error_flag = true;
			ret_val.error_msg = speech_manager.generateGeneralSpeech().SPEECH_DB_ERROR;
			callback(ret_val);
		}
		else {
			data.Items = util.combineParkingLots(data.Items);
			if (data.Items.length === 0) {
				ret_val.error_flag = true;
				ret_val.error_msg = speech_manager.generateGeneralSpeech().SPEECH_DB_EMPTY;
				// still gives no response, prompt user error message, cannot handle!
				callback(ret_val);
			}
			else {
				ret_val.speech_out += speech_manager.generateSpeechForLotName(data.Items, intent);
				ret_val.card = card_manager.generateCardForLotName(data.Items, intent);
				callback(ret_val); // no need to continue session here, set [0] to null
			}
		}
	});
}

function getInfoForParkingLot(callback, intent) { // get information for a parking type
	var request_type = {};
    var ret_val = {
        error_flag: false,
        error_msg: "",
        speech_out: "",
        card: null,
        session_flag: true,
        session_attr: null
    };

	if (intent.slots.LotType.value === undefined) { // asking about a specific lot
		getInfoForParkingLotName(callback, intent);
	}
	else { // asking about a lot type
		request_type = {
			type: "parking",
			parking_type: intent.slots.LotType.value
		};
        api_manager.getJSON(function(data) {
            if (data === "ERROR") {
            	ret_val.error_flag = true;
            	ret_val.error_msg = speech_manager.generateGeneralSpeech().SPEECH_BAD_REQ;
                callback(ret_val);
            }
            else {
            	ret_val.session_flag = false; // don't end session here
                ret_val.speech_out += speech_manager.generateSpeechForLotType(data, intent);
                ret_val.card = card_manager.generateCardForLotType(data, intent);
                ret_val.session_attr = data;
                callback (ret_val);
			}
        }, request_type);
	}
}
