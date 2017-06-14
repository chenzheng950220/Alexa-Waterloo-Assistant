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
	var card = null; var speech_out = "";
	var request_type = {
		type: "goosewatch"
	};
	api_manager.getJSON(function(data) {
		if (data == "ERROR") {
			callback([null, speech_manager.generateGeneralSpeech().SPEECH_BAD_REQ]);
		}
		else if (data.data === undefined) {
			callback([null, speech_manager.generateGeneralSpeech().SPEECH_BAD_REQ]);
		}
		card = card_manager.generateCardForGoose(data, intent);
		speech_out += speech_manager.generateSpeechForGoose(data,intent);
		callback([card, speech_out]);
	}, request_type);
}



