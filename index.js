'use strict'

// Requirements
var http = require("http");
var users = require("./models/users");
var constants = require("./utilities/constants");
var controller = require("./controllers/controller.js");

/*****************************************************************/
// FUNCTION: sendResult
//
// DESCRIPTION:
// Returns the JSON result back to the client.
/*****************************************************************/
var sendResult = function(response, errorCode)
{
	console.log("Code: sendResult(): Sending the final result");
	
	// Headers
	var headers = {};
	headers["Connection"] = "close";
	headers["Content-Type"] = "application/json";

	// JSON result
	var jsonResult = {};
	jsonResult["errCode"] = errorCode;
	if (errorCode >= constants.SUCCESS)
	{
		console.log("writing the count: " + errorCode);
		jsonResult["count"] = errorCode;
	}
	
	response.writeHead(200, "ALL Good!", headers);
	response.end(JSON.stringify(jsonResult));
}

/*****************************************************************/
// EVENT HANDLER: uncaughtException
//
// DESCRIPTION:
// Handles exceptions that are thrown in the process.
/*****************************************************************/
process.on("uncaughtException", function(error)
{
	console.error("HIT AN UNCAUGHT EXCEPTION");
	console.error(error);
	console.error(error.stack);
});

/*****************************************************************/
// FUNCTION: handleRequest
//
// DESCRIPTION:
// Handles the incoming http requests to the server.
/*****************************************************************/
var handleRequest = function(request, response)
{
	console.log("Code: handleRequest(): Method requested: " + request.method);
	console.log("Code: handleRequest(): URL in the request: " + request.url); // for example /users/login

	if (request.method === "POST")
	{
		var body = "";
		request.on("data", function(data)
		{
			body += data;
		});

		request.on("end", function()
		{
			var jsonData = JSON.parse(body);
			var controllerInstance = new controller();
			controllerInstance.process(request, response, jsonData, sendResult);
		});
	}
	
	response.end();
}

// Start listening!
var port = Number(process.env.PORT || 5000);
http.createServer(handleRequest).listen(port);