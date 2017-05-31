'use strict';
var Alexa = require('alexa-sdk');
var util = require('util');

var APP_ID = 'amzn1.ask.skill.1db13f3d-b9b8-4cef-8145-b9086748dc9b';
var SKILL_NAME = 'AlexaWatPark';
var alert_message = "";
var parking_manager = require('./alexa-modules/ParkingManager.js');
var speech_manager = require('./alexa-modules/SpeechManager.js');

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            console.log(util.inspect(event, false, null));
            onIntent(event.request,
                event.session, event.context,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
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
    if (intentName == "AMAZON.HelpIntent") {
        handleHelpIntent(callback);
    }
    else if (intentName == "AMAZON.StopIntent") {
        handleStopIntent(callback);
    }
    else if (intentName == "AMAZON.CancelIntent") {
        handleStopIntent(callback);
    }
    else if (intentName == "AskParkingInfo") {
        handleAskParkingInfoIntent(intent, session, context, callback);
    }
    else if (intentName == "AskStudentParkingInfo") {
        handleAskStudentParkingIntent(intent, session, context, callback);
    }
    else if (intentName == "YesIntent") {
        handleYesIntent(intent, session, context, callback);
    }
    else {
         throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    return;
}

// ------- Skill specific logic -------

function getWelcomeResponse(callback) {
    var speech_output = speech_manager.generateGeneralSpeech("WELCOME");
    callback(null, buildSpeechletResponseSession(null, speech_output, false));
}

function handleHelpIntent(callback) {
    var speech_output = speech_manager.generateGeneralSpeech("HELP");
    callback(null, buildSpeechletResponseSession(null, speech_output, false));
}

function handleStopIntent(callback) {
    var speech_output = "<speak> Stop </speak>";
    callback(null, buildSpeechletResponseSimple(null, speech_output));
}

function handleAskParkingInfoIntent(intent, session, context, callback) {
    parking_manager.getInfoForParkingLot(function(ret_val) {
        var session_flag = false;
        if (ret_val[0] === undefined) { session_flag = true; }
        callback(ret_val[0], buildSpeechletResponseSession(ret_val[2], ret_val[1], session_flag));
        // do not end session here, in case user wants to here detail info on parking type
    }, intent);
}

function handleAskStudentParkingIntent(intent, session, context, callback) {
    parking_manager.getStudentParkingInfo(function(ret_val) {
        callback(null, buildSpeechletResponseSimple(ret_val[0], ret_val[1]));
    }, intent);
}

function handleYesIntent(intent, session, context, callback) {
    var speech_out = "";
    if (session.new) { // no previous session detected
        speech_out = speech_manager.generateGeneralSpeech("NO_PREV_SESSION");
        callback(null, buildSpeechletResponseSession(null, speech_out, true));
    }
    speech_out = speech_manager.generateSpeechForDetailLotType(session.attributes);
    callback(null, buildSpeechletResponseSession(null, speech_out, true))
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



