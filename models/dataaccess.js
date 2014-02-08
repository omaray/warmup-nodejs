'use strict';

// Requirements
var mysql = require('mysql');

// Object definition
function dataaccess() {}

/*****************************************************************/
// METHOD: query
//
// DESCRIPTION:
// Connects to the mysql database and executes the query string.
/*****************************************************************/
dataaccess.prototype.query = function(queryString, callback)
{
	// Connection to the database
	var connection = mysql.createConnection(
	{
		host: 'us-cdbr-east-05.cleardb.net',
		user: 'b53206430c258b',
		password: '57e48628',
		database: 'heroku_c678bc4e748e650'
	});

	// Execute the query
	connection.query(queryString, function(error, results, fields)
	{
		if (error)
		{
			console.log("Code: dataaccess.query(): An error was hit trying to execute the SQL query");
			console.log(error);
		}
		else
		{
			console.log("Code: dataaccess.query(): Database execution succeeded");
			if (callback)
			{
				callback(results);
			}			
		}
	});

	// Close the connection
	connection.end();
}

module.exports = dataaccess;