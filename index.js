'use strict';
const Alexa = require('alexa-sdk');
const util = require('util');

const APP_ID = 'amzn1.ask.skill.1db13f3d-b9b8-4cef-8145-b9086748dc9b';
const SKILL_NAME = 'AlexaWatPark';
const parking_manager = require('./alexa-modules/ParkingManager.js');
const speech_manager = require('./alexa-modules/SpeechManager.js');
const weather_manager = require('./alexa-modules/WeatherManager.js');
const goose_manager = require('./alexa-modules/GooseManager.js');
const course_manager = require('./alexa-modules/CourseManager.js');

const REQ_LAUNCH = "LaunchRequest";
const REQ_INT = "IntentRequest";
const REQ_SESSION_END = "SessionEndedRequest";
const INT_AMAZON_HELP = "AMAZON.HelpIntent";
const INT_AMAZON_STOP = "AMAZON.StopIntent";
const INT_AMAZON_CANCEL = "AMAZON.CancelIntent";
const INT_ASK_PK = "AskParkingInfo";
const INT_ASK_STD_PK = "AskStudentParkingInfo";
const INT_YES = "YesIntent";
const INT_WEATHER = "AskWeather";
const INT_GOOSE = "AskGooseWatch";
const INT_COURSE_INFO = "AskCourseInfo";
const INT_COURSE_OFFER = "AskCourseOffered";

// handle the incoming request from http server, not the lambda server
exports.server_handler = function (event, callback) {
  try {
    if (event.session.new) {
      onSessionStarted({requestId: event.request.requestId}, event.session);
    }

    switch (event.request.type) {
      case REQ_LAUNCH:
        onLaunch(event.request, event.session,
          function(sessionAttributes, speechletResponse) {
            callback(buildResponse(sessionAttributes, speechletResponse));
          });
        break;

      case REQ_INT:
        console.log(util.inspect(event, false, null));
        onIntent(event.request,
          event.session, event.context,
          function(sessionAttributes, speechletResponse) {
            callback(buildResponse(sessionAttributes, speechletResponse));
          });
        break;

      case REQ_SESSION_END:
        onSessionEnded(event.request, event.session);
        callback({}, {});
        break;

      default:
        console.error("ERROR: Bad Request from AVS! ");
        callback({}, {});
    }
  } catch (e) {
    callback("Exception: " + e);
  }
};

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
  try {
    if (event.session.new) {
      onSessionStarted({requestId: event.request.requestId}, event.session);
    }

    switch (event.request.type) {
      case REQ_LAUNCH:
        onLaunch(event.request, event.session,
          function callback(sessionAttributes, speechletResponse) {
            context.succeed(buildResponse(sessionAttributes, speechletResponse));
          });
        break;

      case REQ_INT:
        console.log(util.inspect(event, false, null));
        onIntent(event.request,
          event.session, event.context,
          function callback(sessionAttributes, speechletResponse) {
            context.succeed(buildResponse(sessionAttributes, speechletResponse));
          });
        break;

      case REQ_SESSION_END:
        onSessionEnded(event.request, event.session);
        context.succeed();
        break;

      default:
        console.error("ERROR: Bad Request from AVS! ");

    }
  } catch (e) {
    context.fail("Exception: " + e);
  }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
  // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
  getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, context, callback) {

  var intent = intentRequest.intent;
  var intentName = intentRequest.intent.name;

  // dispatch custom intents to handlers here
  switch (intentName) {
    case INT_AMAZON_HELP:
      handleHelpIntent(callback);
      break;

    case INT_AMAZON_STOP:
      handleStopIntent(callback);
      break;

    case INT_AMAZON_CANCEL:
      handleStopIntent(callback);
      break;

    case INT_ASK_PK:
      handleAskParkingInfoIntent(intent, session, context, callback);
      break;

    case INT_ASK_STD_PK:
      handleAskStudentParkingIntent(intent, session, context, callback);
      break; 

    case INT_YES:
      handleYesIntent(intent, session, context, callback);
      break;

    case INT_WEATHER:
      handleWeatherIntent(intent, session, context, callback);
      break;

    case INT_GOOSE:
      handleGooseWatchIntent(intent, session, context, callback);
      break;

    case INT_COURSE_INFO:
      handleAskCourseInfoIntent(intent, session, context, callback);
      break;

    case INT_COURSE_OFFER:
      handlerAskCourseOfferIntent(intent, session, context, callback);
      break;

    default:
      throw "ERROR: Invalid intent";
  }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {

}

// ------- Skill specific logic -------

function getWelcomeResponse(callback) {
  var speech_output = speech_manager.generateGeneralSpeech().SPEECH_WELCOME;
  callback(null, buildSpeechletResponseSession(null, speech_output, false));
}

function handleHelpIntent(callback) {
  var speech_output = speech_manager.generateGeneralSpeech().SPEECH_HELP;
  speech_output = speech_manager.addSpeakTag(speech_output);
  callback(null, buildSpeechletResponseSession(null, speech_output, false));
}

function handleStopIntent(callback) {
  var speech_output = "<speak> Stop </speak>";
  callback(null, buildSpeechletResponseSimple(null, speech_output));
}

function handleGooseWatchIntent(intent, session, context, callback) {
  goose_manager.getGooseInfo(function(ret_val) {
    if (ret_val.error_flag) { // error occured in goose manager
      callback(null, buildSpeechletResponseSimple(null, ret_val.error_msg));
    }
    else {
      callback(null, buildSpeechletResponseSimple(ret_val.card, ret_val.speech_out));
    }
  }, intent);
}

function handleAskParkingInfoIntent(intent, session, context, callback) {
  parking_manager.getInfoForParkingLot(function(ret_val) {
    if (ret_val.error_flag) { // error handling
      callback(null, buildSpeechletResponseSession(null, ret_val.error_msg, ret_val.session_flag));
    }
    else {
      callback(ret_val.session_attr, buildSpeechletResponseSession(ret_val.card, ret_val.speech_out, ret_val.session_flag));
    }
  }, intent);
}

function handleAskStudentParkingIntent(intent, session, context, callback) {
  parking_manager.getStudentParkingInfo(function(ret_val) {
    if (ret_val.error_flag) { // error handling
      callback(null, buildSpeechletResponseSimple(ret_val.card, ret_val.error_msg));
    }
    else {
      callback(null, buildSpeechletResponseSimple(ret_val.card, ret_val.speech_out));
    }
  }, intent);
}

function handleYesIntent(intent, session, context, callback) {
  var speech_out = "";
  if (session.new) { // no previous session detected
    speech_out = speech_manager.generateGeneralSpeech().SPEECH_NO_PREV_SESSION;
    callback(null, buildSpeechletResponseSession(null, speech_out, true));
  }
  speech_out = speech_manager.generateSpeechForDetailLotType(session.attributes);
  callback(null, buildSpeechletResponseSession(null, speech_out, true));
}

function handleWeatherIntent(intent, session, context, callback) {
  weather_manager.getWeatherInfo(function(ret_val) {
    if (ret_val.error_flag) { // error handling
      callback(null, buildSpeechletResponseSimple(ret_val.card, ret_val.error_msg));
    }
    else {
      callback(null, buildSpeechletResponseSimple(ret_val.card, ret_val.speech_out));
    }
  }, intent);
}

function handleAskCourseInfoIntent(intent, session, context, callback) {
  course_manager.getCourseInfo(intent, function(ret_val) {
    if (ret_val.error_flag) { // error handling
      callback(null, buildSpeechletResponseSession(ret_val.card, ret_val.error_msg, ret_val.session_flag));
    }
    else {
      callback(null, buildSpeechletResponseSession(ret_val.card, ret_val.speech_out, ret_val.session_flag));
    }
  });
}

function handlerAskCourseOfferIntent(intent, session, context, callback) {
  course_manager.getCourseOfferInfo(intent, function(ret_val) {
    if (ret_val.error_flag) { // error handling
      callback(null, buildSpeechletResponseSimple(ret_val.card, ret_val.error_msg));
    }
    else {
      callback(null, buildSpeechletResponseSimple(ret_val.card, ret_val.speech_out));
    }
  });
}

// ------- Helper functions to build responses for Alexa -------

function buildSpeechletResponseSimple(card, output) {
  var ret_val = {
    outputSpeech: {
      type: "SSML",
      ssml: output
    },
    shouldEndSession: true
  };
  ret_val.card = card;
  return ret_val;
}

function buildSpeechletResponseSession(card, output, session_end) {
  var ret_val = {
    outputSpeech: {
      type: "SSML",
      ssml: output
    },
    shouldEndSession: session_end
  };
  ret_val.card = card;
  return ret_val;
}

function buildResponse(sessionAttributes, speechletResponse) {
  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  };
}



