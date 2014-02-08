'use strict';

// Requirements
var http = require("http");
var users = require("../models/users");
var constants = require("../utilities/constants");

// Object definition
function controller() {}

/*****************************************************************/
// METHOD: process
//
// DESCRIPTION:
// Processes the incoming request by executing the right model
// business logic and returns the result.
/*****************************************************************/
controller.prototype.process = function(request, response, jsonData, sendResult)
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
		else
		{
			// Simply close the connection
			response.end();
		}
	}
}

module.exports = controller;