'use strict'

// Requirements
var http = require("http");
var users = require("./models/users");
var constants = require("./utilities/constants");
var controller = require("./controllers/controller.js");

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
			controllerInstance.process(request, response, jsonData);
		});
	}
	else
	{
		// Headers
		var headers = {};
		headers["Connection"] = "close";
		headers["Content-Type"] = "text/plain";

		response.writeHead(200, headers);
		response.write("No HTML yet: use a POST request");
		response.end();
	}
}

// Start listening!
var port = Number(process.env.PORT || 5000);
http.createServer(handleRequest).listen(port);