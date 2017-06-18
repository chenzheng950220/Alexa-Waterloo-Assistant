/*********************************
Food Manager for Alexa
This module coordinates goose watch information
*********************************/

const api_manager = require('./APIManager.js');
const speech_manager = require('./SpeechManager.js');
const card_manager = require('./CardManager.js');

module.exports = {
	getGooseInfo: getGooseInfo
};

function getGooseInfo(callback, intent) {
	var request_type = {
		type: "goosewatch"
	};
	var ret_val = {
		error_flag: false,
		error_msg: "",
		speech_out: "",
		card: null,
		session_flag: true,
		session_attr: null
	};

	api_manager.getJSON(function(data) {
		if (data === "ERROR") { // request failed
			ret_val.error_flag = true;
			ret_val.error_msg = speech_manager.generateGeneralSpeech().SPEECH_BAD_REQ;
			callback(ret_val);
		}
		else if (data.data === undefined) { // request failed
			ret_val.error_flag = true;
			ret_val.error_msg = speech_manager.generateGeneralSpeech().SPEECH_BAD_REQ;
			callback(ret_val);
		}
		else { // normal response, keep going here
			ret_val.card = card_manager.generateCardForGoose(data, intent);
			ret_val.speech_out += speech_manager.generateSpeechForGoose(data,intent);
			callback(ret_val);
		}
	}, request_type);
}

