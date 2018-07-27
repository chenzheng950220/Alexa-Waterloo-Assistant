/*********************************
Weather Manager for Alexa
This module coordinate with API to get weather information
*********************************/

const api_manager = require("./APIManager.js");
const card_manager = require("./CardManager.js");
const speech_manager = require("./SpeechManager.js");

module.exports = {
  getWeatherInfo() getWeatherInfo
};

function getWeatherInfo(callback, intent) {
  var ret_val = {
    error_flag: false,
    error_msg: "",
    speech_out: "",
    card: null,
    session_flag: true,
    session_attr: null
  };

  const request_type = {
    type: "weather"
  };
  api_manager.getJSON(function(data) {
    if (data === "ERROR") {
      ret_val.error_flag = true;
      ret_val.error_msg = speech_manager.generateGeneralSpeech().SPEECH_BAD_REQ;
      callback(ret_val);
    }
    else if (data.data === undefined) {
      ret_val.error_flag = true;
      ret_val.error_msg = speech_manager.generateGeneralSpeech().SPEECH_BAD_REQ;
      callback(ret_val);
    }
    else {
      ret_val.card = card_manager.generateCardForWeather(data, intent);
      ret_val.speech_out += speech_manager.generateSpeechForWeather(data,intent);
      callback(ret_val);
    }
  }, request_type);
}
