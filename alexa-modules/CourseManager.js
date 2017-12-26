/********************************
Course Manager for Alexa
This module manages info fetched from API
*********************************/

const api_manager = require('./APIManager.js');
const speech_manager = require('./SpeechManager.js');
const card_manager = require('./CardManager.js');
const debug = require('./Debug.js');

module.exports = {
  getCourseInfo: getCourseInfo,
  getCourseOfferInfo: getCourseOfferInfo
};

function getCourseInfo(intent, callback) {
  var ret_val = {
    error_flag: false,
    error_msg: "",
    speech_out: "",
    card: null,
    session_flag: true,
    session_attr: null
  };

  const course_subject = intent.slots.CourseSubject.value;
  const course_catelog = intent.slots.CourseCatelog.value;

  // error checking here
  if (!course_subject || !course_catelog) { // both catelog & subject must be passed in!
    ret_val.error_flag = true;
    ret_val.session_flag = false;
    ret_val.error_msg = speech_manager.generateGeneralSpeech().SPEECH_COURSE_BAD_REQ;
    callback(ret_val);
  }
  else { // enough info passed in
    var request_type = {
      type: "course",
      catelog: course_catelog,
      subject: course_subject
    };
    api_manager.getJSON(function(data) {
      if (data === "ERROR") {
        ret_val.error_flag = true;
        ret_val.session_flag = false;
        ret_val.error_msg = speech_manager.generateGeneralSpeech().SPEECH_BAD_REQ;
        callback(ret_val);
      }
      else if (data === "EMPTY") {
        ret_val.error_flag = true;
        ret_val.session_flag = false;
        ret_val.error_msg = speech_manager.generateGeneralSpeech().SPEECH_COURSE_EMPTY;
        callback(ret_val);
      }
      else {
        ret_val.card = card_manager.generateCardForCourseInfo(data, intent);
        ret_val.speech_out += speech_manager.generateSpeechForCourseInfo(data,intent);
        callback(ret_val);
      }
    }, request_type);
  }
}

function getCourseOfferInfo(intent, callback) {
  var ret_val = {
    error_flag: false,
    error_msg: "",
    speech_out: "",
    card: null,
    session_flag: true,
    session_attr: null
  };

  const course_subject = intent.slots.CourseSubject.value;
  const course_catelog = intent.slots.CourseCatelog.value;
  const course_term = intent.slots.Term.value;

  // error checking here
  if (!course_subject || !course_catelog) { // both catelog & subject must be passed in!
    ret_val.error_flag = true;
    ret_val.session_flag = false;
    ret_val.error_msg = speech_manager.generateGeneralSpeech().SPEECH_COURSE_BAD_REQ;
    callback(ret_val);
  }
  else if (!course_term) {
    getCourseInfo(intent, callback);
  }
  else { // enough info passed in
    var request_type = {
      type: "course",
      catelog: course_catelog,
      subject: course_subject
    };
    api_manager.getJSON(function(data) {
      if (data === "ERROR") {
        ret_val.error_flag = true;
        ret_val.session_flag = false;
        ret_val.error_msg = speech_manager.generateGeneralSpeech().SPEECH_BAD_REQ;
        callback(ret_val);
      }
      else if (data === "EMPTY") {
        ret_val.error_flag = true;
        ret_val.session_flag = false;
        ret_val.error_msg = speech_manager.generateGeneralSpeech().SPEECH_COURSE_EMPTY;
        callback(ret_val);
      }
      else {
        ret_val.card = card_manager.generateCardForCourseInfo(data, intent);
        ret_val.speech_out += speech_manager.generateSpeechForCourseTermInfo(data,intent);
        callback(ret_val);
      }
    }, request_type);
  }
}

