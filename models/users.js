'use strict';

// Requirements
var dataaccess = require('./dataaccess');
var constants = require('../utilities/constants');

// Object definition
function users() {}

/*****************************************************************/
// METHOD: add
//
// DESCRIPTION:
// Adds a new use to the data storage. Ensures the user is unique
// and that the passed parameters are valid.
/*****************************************************************/
users.prototype.add = function(username, password, callback)
{
	console.log("Code: users.add(): Method called with paramters: " + username + ", " + password);

	// Validate the username and password
	var code = this.validate(username, password);
	if (code != constants.SUCCESS)
	{
		callback(code);
		return;
	}

	// Determine if the user already exists
	var dataaccessinstance = new dataaccess();
	var queryString = 'SELECT * FROM users WHERE username="'+username+'"';
	dataaccessinstance.query(queryString, function(results)
	{
		if (typeof results[0] != 'undefined')
		{
			console.log("Code: users.add(): User already exists in the data storage");
			callback(constants.ERR_USER_EXISTS);
			return;
		}

		// If no user is found, then they are new and can be added
		var insertString = 'INSERT INTO users (username, password, count) VALUES ("'+username+'", "'+password+'", 1)';
		dataaccessinstance.query(insertString, function(results)
		{
			console.log("Code: users.add(): User successfully added to the data storage");
			callback(constants.SUCCESS);
			return;
		});	
	});
};

/*****************************************************************/
// METHOD: login
//
// DESCRIPTION:
// Adds a new use to the data storage. Ensures the user is unique
// and that the passed parameters are valid.
/*****************************************************************/
users.prototype.login = function(username, password, callback)
{
	console.log("Code: users.login(): Method called with parameters: " + username + ", " + password);

	// Validate the username and password
	var code = this.validate(username, password);
	if (code != constants.SUCCESS)
	{
		callback(code);
		return;
	}

	// Determine if the user already exists
	var dataaccessinstance = new dataaccess();
	var queryString = 'SELECT * FROM users WHERE username="'+username+'"';
	dataaccessinstance.query(queryString, function(results)
	{
		if (typeof results[0] === 'undefined')
		{
			console.log("Code: users.login(): User doesn't exists in the data storage");
			callback(constants.ERR_BAD_CREDENTIALS);
			return;
		}

		// User found so let's confirm password
		if (password != results[0]["password"])
		{
			console.log("Code: users.login(): Bad password for user");
			callback(constants.ERR_BAD_CREDENTIALS);
			return;			
		}

		console.log("Code: users.login(): User successfully logged in and updating count");

		// User logged in so let's update count
		var newCount = results[0]["count"] + 1;
		var insertString = 'UPDATE users set count='+newCount+' where username="'+username+'"';
		dataaccessinstance.query(insertString, function(results)
		{
			callback(newCount);
			return;	
		});
	});
};

/*****************************************************************/
// METHOD: TESTAPI_resetFixture
//
// DESCRIPTION:
// Clears the database of all data and deletes all entries.
/*****************************************************************/
users.prototype.TESTAPI_resetFixture = function(callback)
{
	console.log("Code: users.TESTAPI_restFixture(): Method called");

	var dataaccessinstance = new dataaccess();
	dataaccessinstance.query("DELETE from users", function(results)
 	{
 		callback(constants.SUCCESS);		
 	});
}

/*****************************************************************/
// HELPER: validate
//
// DESCRIPTION:
// Validates the username and password passed in.
/*****************************************************************/
users.prototype.validate = function(username, password)
{	
	// Ensure the username is valid
	if (!username || 0 === username.length || username.length > constants.MAX_USERNAME_LENGTH)
	{
		return constants.ERR_BAD_USERNAME;
	}

	// Ensure the password is valid
	if (password.length > constants.MAX_PASSWORD_LENGTH)
	{
		return constants.ERR_BAD_PASSWORD;
	}

	return constants.SUCCESS;
}

module.exports = users;