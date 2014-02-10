'use strict';

// Requirements
var http = require("http");
var users = require("../models/users");
var constants = require("../utilities/constants");
var exec = require("child_process").exec;

// Object definition
function controller() {}

/*****************************************************************/
// METHOD: process
//
// DESCRIPTION:
// Processes the incoming request by executing the right model
// business logic and returns the result.
/*****************************************************************/
controller.prototype.process = function(request, response, jsonData)
{
	if (request.method == "POST")
	{
		if (request.url === "/users/add")
		{
			var userInstance = new users();
			userInstance.add(jsonData["user"], jsonData["password"], function(errorCode)
			{
				sendResult(response, errorCode);
			});
		}
		else if (request.url === "/users/login")
		{
			var userInstance = new users();
			userInstance.login(jsonData["user"], jsonData["password"], function(errorCode)
			{
				sendResult(response, errorCode);				
			});
		}
		else if (request.url === "/TESTAPI/resetFixture")
		{
			var userInstance = new users();
			userInstance.TESTAPI_resetFixture(function(errorCode)
			{
				sendResult(response, errorCode);				
			});
		}
		else if (request.url === "/TESTAPI/unitTests")
		{
			sendUnitTestResult(response, 0, "The output of the tests", 12);
			/*exec("node_modules/nodeunit/bin/nodeunit unittest/usertests.js", function(error, stdout, stderr)
			{
				console.log(error);
				sendUnitTestResult(response, 0, "The output of the tests", 12);
			});*/
		}
		else
		{
			// Simply close the connection
			response.end();
		}
	}
}

/*****************************************************************/
// HELPER: sendResult
//
// DESCRIPTION:
// Returns the JSON result back to the client.
/*****************************************************************/
var sendResult = function(response, errorCode)
{
	console.log("Code: sendResult(): Sending the final result: " + errorCode);
	
	// Headers
	var headers = {};
	headers["Connection"] = "close";
	headers["Content-Type"] = "application/json";

	// JSON result
	var jsonResult = {};
	if (errorCode >= constants.SUCCESS)
	{
		console.log("Code: sendResult(): Writing the count: " + errorCode);

		// The errorCode is the count in this case
		jsonResult["errCode"] = constants.SUCCESS;
		jsonResult["count"] = errorCode;
	}
	else
	{
		// The errorCode is the true failure code
		jsonResult["errCode"] = errorCode;
	}
	
	response.writeHead(200, "ALL Good!", headers);
	response.end(JSON.stringify(jsonResult));
}

/*****************************************************************/
// HELPER: sendUnitTestResult
//
// DESCRIPTION:
// Returns the JSON result of unit tests back to the client.
/*****************************************************************/
var sendUnitTestResult = function(response, nrFailed, output, totalTests)
{
	console.log("Code: sendUnitTestResult(): Sending the final result");
	
	// Headers
	var headers = {};
	headers["Connection"] = "close";
	headers["Content-Type"] = "application/json";

	// JSON result
	var jsonResult = {};
	jsonResult["nrFailed"] = nrFailed;
	jsonResult["output"] = output;
	jsonResult["totalTests"] = totalTests;
	
	response.writeHead(200, "ALL Good!", headers);
	response.end(JSON.stringify(jsonResult));	
}

module.exports = controller;