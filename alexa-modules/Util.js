/*************************************
Handy function that might be used
*************************************/

const debug = require('./Debug.js');

module.exports = {
	combineParkingLots: combineParkingLots
};

function combineParkingLots(data) {
	/*
	This handles the response from the database request, when a lot name
	satisfies multiple parking types:
	combine [{lot: Q, lot_info: blah}, {lot: Q}]
	to [{lot: Q, lot_info: blah}]
	*/
	var names = {}; // names that have been recorded - name: index in arr
	const data_len = data.length;

	for (var i = 0; i < data_len; i++) {
		var index = names[data[i].lot_name];
		if (index === 0 || index) {
			// record existing in a previous record, combine two records
			data[index].lot_type += (", " + data[i].lot_type);
			if (data[i].additional_info) { // append additional info
				if (data[index].additional_info) {
					data[index].additional_info += (". " + data[i].additional_info);
				}
				else { // previous record add info is empty
					data[index].additional_info = data[i].additional_info;
				}
			}

			// delete the current entry, then do recursion here
			data.splice(i, 1);
			return (combineParkingLots(data));
		}
		else { // record the current record
			names[data[i].lot_name] =i;
		}
	}

	if (debug.debug_flag) {
		console.log(data);
	}
	return data;
}
