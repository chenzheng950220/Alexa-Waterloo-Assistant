/***************************************
This script fetches the parking info from
API, and then update the info in the DynamoDB
***************************************/

const AWS = require("aws-sdk");
const request = require('request');
AWS.config.update({
  region: "us-east-1",
  endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});

var dynamodb = new AWS.DynamoDB();;
var client = new AWS.DynamoDB.DocumentClient();
const table = "UWParking";
const base_url = "https://api.uwaterloo.ca/v2/parking/lots/";
const token = "key=da4f8f38697f99b07a89ce05c3dcf755";

function getUrl(type) {
    return (base_url + type + '.json?' + token);
}

function getData(type, callback) {
    request.get(getUrl(type), function(error, response, body) {
        if (response.statusCode != 200) {
            console.error("ERROR: API gave a bad response code. ");
            callback("ERROR");
        }
        try {
            var d = JSON.parse(body);
            if (d !== null) {
                callback(d);
            }
            else {
                throw("ERROR: JSON parsing failed! ");
            }
        }
        catch (e) {
            console.error("ERROR: " + e);
            callback("ERROR");
        }
    });
}

function insertSingleData(p_data, type) {
    const parking_data = p_data.data;
    const arr_len = parking_data.length;
    for (var i = 0; i < arr_len; i++) {
        const current_lot = parking_data[i];
        var put_params = {
            TableName: table,
            Item: {
                lot_name: current_lot.name,
                lot_type: type,
                description: current_lot.description,
                additional_info: current_lot.additional_info
            }
        }
        insertData(put_params);
    }
}

function batchInsert() {
    var parking_types = ["meter", "permit", "visitor",
        "shortterm", "accessible", "motorcycle"];
    for (var i = 0; i < parking_types.length; i++) {
        const current_type = parking_types[i];
        getData(parking_types[i], function(p_data) {
            insertSingleData(p_data, current_type);
        });
    }
    
}

function insertData(params) {
    client.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        }
    });
}

batchInsert();
