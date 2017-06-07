/*********************************
Weather Manager for Alexa
This module coordinate with API to get weather information
*********************************/

const api_manager = require('./APIManager.js');
const card_manager = require('./CardManager.js');
const speech_manager = require('./SpeechManager.js');

module.exports = {
	getWeatherInfo: getWeatherInfo
};

function getWeatherInfo(callback, intent) {
	var card = null; var speech_out = "";
	// Add card support
	const request_type = "weather";
	api_manager.getJSON(function(data) {
		if (data == "ERROR") {
			callback([null, speech_manager.generateGeneralSpeech().SPEECH_BAD_REQ]);
		}
		else if (data.data === undefined) {
			callback([null, speech_manager.generateGeneralSpeech().SPEECH_BAD_REQ]);
		}
		card = card_manager.generateCardForWeather(data, intent);
		speech_out += speech_manager.generateSpeechForWeather(data,intent);
		callback([card, speech_out]);
	}, request_type);
}
