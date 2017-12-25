/******************************
This modules manages DynamoDB:
query, scan, update...
******************************/

module.exports = {
    queryLotNameContains: queryLotNameContains,
    queryLotNameEquals: queryLotNameEquals
};

const AWS = require("aws-sdk");
const request = require('request');
AWS.config.update({
  region: "us-east-1",
  endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});
const table_name = "UWParking";

var client = new AWS.DynamoDB.DocumentClient();

function queryLotNameEquals(lot_name, callback) {
  // return parking lots whose name contains lot_name.toUpperCase()
  var query_params = {
    TableName: table_name,
    FilterExpression: "#lot_name = :lot_name",
    ExpressionAttributeNames: {
      "#lot_name": "lot_name"
    },
    ExpressionAttributeValues: {
      ":lot_name": lot_name.toUpperCase()
    }
  };

  client.scan(query_params, callback);
}

function queryLotNameContains(lot_name, callback) {
  // return parking lots whose name contains lot_name.toUpperCase()
  var query_params = {
    TableName: table_name,
    FilterExpression: "(contains (#lot_name, :lot_name))",
    ExpressionAttributeNames: {
      "#lot_name": "lot_name"
    },
    ExpressionAttributeValues: {
      ":lot_name": lot_name.toUpperCase()
    }
  };

  client.scan(query_params, callback);
}

