/********************************
Course Manager for Alexa
This module manages info fetched from API
*********************************/

const api_manager = require('./APIManager.js');
const speech_manager = require('./SpeechManager.js');
const card_manager = require('./CardManager.js');
const debug = require('./Debug.js');

module.exports = {
	getCourseInfo: getCourseInfo
};

function getCourseInfo(intent, callback) {
	var request_type = { // request passed to APIManager
		type: "course"
	};

	// For now, two slots must be presented in the question


	return [null, "hello"];	
}

