/********************************
Card Manager for Alexa
This module generates card for displaying.
*********************************/

module.exports = {
  generateCardForStudentParking: generateCardForStudentParking,
  generateCardForLotType: generateCardForLotType,
  generateCardForWeather: generateCardForWeather,
  generateCardForGoose: generateCardForGoose,
  generateCardForLotName: generateCardForLotName,
    generateCardForCourseInfo: generateCardForCourseInfo
};

function generateCardForLotName(data, intent) {
  var card = {};
  card.type = "Standard";
  card.title = ("Lot " + intent.slots.LotName.value);
  card.text = "";
  const data_len = data.length;

  for (var i = 0; i < data_len; i++) {
    const cur_data = data[i];
    card.text += ("Lot " + cur_data.lot_name + " : " + cur_data.lot_type + "\n");
    if (cur_data.additional_info) {
      card.text += ("Additional Information: " + cur_data.additional_info + " \n");
    }
  }

  return card;
}

function generateCardForGoose(data, intent) {
  var card = {};
  card.type = "Standard";
  card.title = "Goose Watch";
  card.text = "";

  const goose_loc = data.data; const goose_num = goose_loc.length;
  for (var i = 0; i < goose_num; i++) {
    card.text += goose_loc[i].location;
    card.text += " \n";
  }

  return card;
}

function generateCardForWeather(data, intent) {
  var card = {};
  card.type = "Standard";
  card.title = "Weather Condition at UW";
  card.text = "";

  const weather_data = data.data;
  const cur_temp = weather_data.temperature_current_c;
  const wind_chill = weather_data.windchill_c;
  const high = weather_data.temperature_24hr_max_c;
  const low = weather_data.temperature_24hr_min_c;
  const precip_15m = weather_data.precipitation_15min_mm;
  const precip_1h = weather_data.precipitation_1hr_mm;
  const wind_speed = weather_data.wind_speed_kph;
  const wind_direct = weather_data.wind_direction;

  // temperatures
  card.text += ("Current Temperature: " + cur_temp + " degress \n");
  if (wind_chill !== null) {
    card.text += ("Wind Chill: " + wind_chill + "degrees \n");
  }
  card.text += ("High/Low in the next 24 hours: " + high + ", " + low + " degrees \n");

  // precip
  if (precip_15m > 1) {
    card.text += ("Precipitation in the next 15 minutes: " + precip_15m + "mm \n");
  }
  if (precip_1h > 1) {
    card.text += ("Precipitation in the next hour: " + precip_1h + "mm \n");
  }
  
  // wind
  card.text += ("Wind: " + wind_speed + "km/h, " + wind_direct + "\n");

  return card;
}

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
  card.title = (intent.slots.LotType.value + " Parking Status");
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

function generateCardForCourseInfo(data, intent) {
  const course_data = data.data;
  const subject = course_data.subject;
  const catelog = course_data.catalog_number;
  const title = course_data.title;
  const description = course_data.description;
  const prereq = course_data.prerequisites;
  const antireq = course_data.antirequisites;
  const offered = course_data.terms_offered;
  const notes = course_data.notes;

  var card = {};
  card.type = "Standard";
  card.title = (subject + " " + catelog + ": " + title);
  card.text = "";

  card.text += (description + "\n");
  if (prereq) { card.text += ("Prerequisites: " + prereq + "\n"); }
  if (antireq) { card.text += ("Antirequisites: " + antireq + "\n"); }
  if (offered.length) { card.text += ("Offered in: " + offered + "\n"); }
  if (notes) { card.text += (notes + "\n"); }

  return card;
}
