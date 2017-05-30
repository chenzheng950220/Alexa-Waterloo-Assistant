/********************************
Card Manager for Alexa
This module generates card for displaying.
*********************************/

module.exports = {
	generateCardForStudentParking: generateCardForStudentParking,
	generateCardForLotType: generateCardForLotType
};

function generateCardForStudentParking(data, intent) {
	var card = {};
	card.type = "Standard";
	card.title = "Student Parking Status";
	card.text = "";
	for (var i = 0; i < 4; ++i) {
		var cap = data.data[i].capacity;
		var count = data.data[i].current_count;
		var percent = data.data[i].percent_filled;
		var lot_name = data.data[i].lot_name;
		card.text += ("Lot " + lot_name + " - ");
		card.text += ("Capacity: " + cap + ", ");
		card.text += ("Occupied spots: " + count + " (" + percent + "%) \n");
	}
	return card;
}

function generateCardForLotType(data, intent) {
	var card = {};
	card.type = "Standard";
	card.title = "Student Parking Status";
	card.text = "";
	for (var i = 0; i < 4; ++i) {
		var name = data.data[i].name;
		var desc = data.data[i].description;
		var add_info = data.data[i].additional_info;
		card.text += ("Lot " + name + " - " + desc + " \n");
		if (add_info !== undefined) {
			card.text += ("Additional Information: " + add_info + " \n");
		}
	}
	return card;
}
