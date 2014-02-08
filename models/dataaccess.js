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
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'priyanode'
	});

	// Execute the query
	connection.query(queryString, function(error, results, fields)
	{
		if (error)
		{
			console.log("Code: dataaccess.query(): An error was hit trying to execue the SQL query");
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