/********************************
Parking Manager for Alexa
This module generates complete sentences.
*********************************/

module.exports = {
    generateSpeechForLotType: generateSpeechForLotType,
    generateGeneralSpeech: generateGeneralSpeech,
    generateSpeechForStudentParking: generateSpeechForStudentParking
};

function generateGeneralSpeech(type) {
	if (type == "json_error") {
		return ("Sorry, but I'm having trouble fetching information from the network. " +
			"Would mind asking the question again? ");
	}
}

function generateSpeechForStudentParking(data, intent) {
	var speech_out = "";
	var lot_name = ['C', 'N', 'W', 'X'];
	var lot_status = assessStudentParking(data);
	var lot_overall_status = assessStudentOverallParking(lot_status);
	if (lot_overall_status == 1) {
		speech_out += "Student parking looks normal at the moment. ";
		speech_out += "All slots are either empty or normal. ";
	}
	else if (lot_overall_status == 2) {
		speech_out += "Student parking is tense right now. ";
		for (var i = 0; i < 4; i++) {
			speech_out += ("Lot " + lot_name[i] + " ");
			var remaining_spots = (data.data[i].capacity - data.data[i].current_count);
			speech_out += ("has " + remaining_spots + " parking spots left. ");
		}
	}
	else if (lot_overall_status == 3) {
		var full_lot = []; var not_full_lot = [];
		for (var i = 0; i < 4; i++) {
			if (lot_status[i] >= 4) { full_lot.push(lot_name[i]); }
			else { not_full_lot.push(lot_name[i]); }
		}
		speech_out += "Lot ";
		for (var i = 0; i < full_lot.length; i++) {
			speech_out += full_lot[i];
			speech_out += ", ";
		}
		speech_out += "are full. However, there are still some parking capacities in lot ";
		for (var i = 0; i < not_full_lot.length; i++) {
			speech_out += not_full_lot[i];
			if (i == (not_full_lot.length - 1)) { speech_out += ". "; }
			else { speech_out += ", "; }
		}
	}
	else {
		speech_out += "All student parking lots are full. ";
		speech_out += "Remaining parking capacity is under 10%. ";
	}
	return addSpeakTag(speech_out);
}

function assessStudentOverallParking(result) {
	var total_lot = 4;
	// 4 -> all (almost) full
	// 3 -> some (almost) full, some tense/normal
	// 2 -> tense
	// 1 -> normal
	var full = 0; var tense = 0; var normal = 0;
	for (var i = 0; i < total_lot; i++) {
		if (result[i] >= 4) { full++; }
		else if (result[i] == 3) {
			tense++;
		}
		else if (result[i] <= 2) {
			normal++;
		}
	}
	if (full == total_lot) { return 4; }
	else if (full !== 0) {
		return 3;
	}
	else if (full === 0 && tense >= 3) {
		return 2;
	}
	else { return 1; }
}

function assessStudentParking(data) {
	// assess the condition of four student parking lot
	// return -> [X, X, X, X] for parking status on lot C,N,W,X
	// X -> 1empty, 2normal, 3tense, 4almost full, 5full
	var total_lot = 4; var ret_val = [];
	for (var i = 0; i < total_lot; i++) {
		if (data.data[i].percent_filled < 20) {
			ret_val.push(1);
		}
		else if (data.data[i].percent_filled < 60) {
			ret_val.push(2);
		}
		else if (data.data[i].percent_filled < 80) {
			ret_val.push(3);
		}
		else if (data.data[i].percent_filled < 90) {
			ret_val.push(4);
		}
		else {
			ret_val.push(5);
		}
	}
	return ret_val;
}

function generateSpeechForLotType(data, intent) {
	// user is asking about a lot type
	var total_lot = data.data.length;
	var lot_type = intent.slots.LotType.value;
	if (lot_type === undefined) {
		console.log("ERROR: LotType is empty in generateSpeechForLotType!");
		throw "ERROR";
	}
	var speech_out = "";
	speech_out += ("There are " + total_lot + " " + lot_type + " parking lots. ");
	speech_out += "Here is a list of those lots. ";
	for (var i = 0; i < total_lot; i++) {
		speech_out += generateSpeechForSingleLot(data.data[i]);
	}
	return addSpeakTag(speech_out);
}

function generateSpeechForSingleLot(lot_data) {
	var speech_out = "";
	speech_out += "Lot " + lot_data.name + ", " + lot_data.description + ". ";
	if (lot_data.additional_info !== undefined) {
		speech_out += lot_data.additional_info + ". ";
	}
	return speech_out;
}

function addSpeakTag(speech) {
	// Remodify the text, so that it satisfies SSML requirement
	var speech_len = speech.length;
	for (var i = 0; i < speech_len; i++) {
		if (speech[i] == '&') {
			speech = speech.substring(0, i) + " and " + speech.substring(i+1, speech_len);
		}
		else if (speech[i] == '/') {
			speech = speech.substring(0, i) + " or " + speech.substring(i+1, speech_len);
		}
	}
	return ("<speak> " + speech + "</speak>");
}

