'use strict';
var Alexa = require('alexa-sdk');
var util = require('util');

var APP_ID = 'amzn1.ask.skill.1db13f3d-b9b8-4cef-8145-b9086748dc9b';
var SKILL_NAME = 'AlexaWatPark';
var alert_message = "";
var parking_manager = require('./alexa-modules/ParkingManager.js');

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
        return;
    }
    else if (intentName == "AskParkingInfo") {
        handleAskParkingInfoIntent(intent, session, context, callback);
    }
    else if (intentName = "AskStudentParkingInfo") {
        handleAskStudentParkingIntent(intent, session, context, callback);
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
    var speech_output = "<speak> Hello </speak>";
    callback(null, buildSpeechletResponseSimple(null, speech_output));
}

function handleHelpIntent(callback) {
    var speech_output = "<speak> Help </speak>";
    callback(null, buildSpeechletResponseSimple(null, speech_output));
}

function handleStopIntent(callback) {
    var speech_output = "<speak> Stop </speak>";
    callback(null, buildSpeechletResponseSimple(null, speech_output));
}

function handleAskParkingInfoIntent(intent, session, context, callback) {
    parking_manager.getInfoForParkingLot(function(speech_output) {
        callback(null, buildSpeechletResponseSimple(null, speech_output));
    }, intent);
}

function handleAskStudentParkingIntent(intent, session, context, callback) {
    parking_manager.getStudentParkingInfo(function(speech_output) {
        callback(null, buildSpeechletResponseSimple(null, speech_output));
    }, intent);
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

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "SSML",
            ssml: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}


