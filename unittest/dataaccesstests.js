'use strict';

var dataaccess = require("../models/dataaccess");
var mysql = require('mysql');

/*****************************************************************/
// METHOD: testdelete
//
// DESCRIPTION:
// Deletes all entries in the db. This test is not quite a unit
// test but rather is used to clean the database as need be.
/*****************************************************************/
exports['testdelete'] = function(test)
{
 	var dataaccessinstance = new dataaccess();

 	dataaccessinstance.query("DELETE from users", function(results)
 	{
 		test.done();			
 	});
};

/*****************************************************************/
// METHOD: testquery
//
// DESCRIPTION: 
// Tests the "query" method of dataaccess object. Creates a mock
// object for the "connection" and redefines the createConnection
// behavior of the mysql object as well.
/*****************************************************************/
exports['testquery'] = function(test)
{
	test.expect(3);
	var dataaccessinstance = new dataaccess();

	// Build our connection mock object
	function mockconnection() {}
	mockconnection.prototype.query = function(queryString, callback)
	{
		console.log("Test: query() method was called with parameter: " + queryString);
		test.ok(true, "Ensuring query was called")
	};

	mockconnection.prototype.end = function()
	{
		console.log("Test: end() method was called");
		test.ok(true, "Ensuring end was called")
	};

	// Redefine the behavior of mysql createConnection
	mysql.createConnection = function(dummy)
	{
		console.log("Test: createConnection() of mysql was called");

		test.ok(true, "Ensuring createConnection was called");
		return new mockconnection();
	};

	// Call the method under test
	dataaccessinstance.query("SELECT nothing SINCE dummy string");
	test.done();
}



