'use strict';

var dataaccess = require("../models/dataaccess");
var users = require("../models/users");
var constants = require('../utilities/constants');

/*****************************************************************/
// METHOD: addNullUsername
//
// DESCRIPTION:
// Adds a new user with a null username.
/*****************************************************************/
exports['addNullUsername'] = function(test)
{
	test.expect(1);
	var usersInstance = new users();

	usersInstance.add(null, "myPassword", function(code)
	{
		test.equal(code, constants.ERR_BAD_USERNAME);
		test.done();
	});
};

/*****************************************************************/
// METHOD: addEmptyUsername
//
// DESCRIPTION:
// Adds a new user with an empty username.
/*****************************************************************/
exports['addEmptyUsername'] = function(test)
{
	test.expect(1);
	var usersInstance = new users();

	usersInstance.add("", "myPassword", function(code)
	{
		test.equal(code, constants.ERR_BAD_USERNAME);
		test.done();
	});
};

/*****************************************************************/
// METHOD: addTooLongUsername
//
// DESCRIPTION:
// Adds a new user with a username too long.
/*****************************************************************/
exports['addTooLongUsername'] = function(test)
{
	test.expect(1);
	var usersInstance = new users();

	usersInstance.add("0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789", "myPassword", function(code)
	{
		test.equal(code, constants.ERR_BAD_USERNAME);
		test.done();
	});
};

/*****************************************************************/
// METHOD: addTooLongPassword
//
// DESCRIPTION:
// Adds a new user with a password too long.
/*****************************************************************/
exports['addTooLongPassword'] = function(test)
{
	test.expect(1);
	var usersInstance = new users();

	usersInstance.add("myUserName", "0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789", function(code)
	{
		test.equal(code, constants.ERR_BAD_PASSWORD);
		test.done();
	});
};

/*****************************************************************/
// METHOD: addValidUser
//
// DESCRIPTION:
// Adds a valid new user in the data storage.
/*****************************************************************/
exports['addValidUser'] = 
{
	setUp: function(callback)
	{
		console.log("Test: setUp(): clear the users table");
		var dataaccessinstance = new dataaccess();
 		dataaccessinstance.query("DELETE from users", function(results)
 		{
 			callback(); 				
 		});
 		
	},
	tearDown: function(callback)
	{
		console.log("Test: tearDown(): clear the users table");
		var dataaccessinstance = new dataaccess();
 		dataaccessinstance.query("DELETE from users", function(results)
 		{
  			callback(); 				
 		});
	},
	testMethod: function(test)
	{
		test.expect(1);
		var usersInstance = new users();

		usersInstance.add("myUsername", "myPassword", function(code)
		{
			test.equal(code, constants.SUCCESS);
			test.done();
		});
	}
};

/*****************************************************************/
// METHOD: addExistingUser
//
// DESCRIPTION:
// Adds an existing user in the data storage.
/*****************************************************************/
exports['addExistingUser'] = 
{
	setUp: function(callback)
	{
		console.log("Test: setUp(): clear the users table");
		
		var dataaccessinstance = new dataaccess();
 		dataaccessinstance.query("DELETE from users", function(results)
 		{
 			console.log("Test: setUp(): add existing user");
 			dataaccessinstance.query('INSERT INTO users (username, password, count) VALUES ("myUsername", "myPassword", 1)', function(results)
 			{
 				callback();	
 			});		
 		}); 		
	},
	tearDown: function(callback)
	{
		console.log("Test: tearDown(): clear the users table");
		var dataaccessinstance = new dataaccess();
 		dataaccessinstance.query("DELETE from users", function(results)
 		{
  			callback(); 				
 		});
	},
	testMethod: function(test)
	{
		test.expect(1);
		var usersInstance = new users();

		usersInstance.add("myUsername", "myPassword", function(code)
		{
			test.equal(code, constants.ERR_USER_EXISTS);
			test.done();
		});	
	}
};

/*****************************************************************/
// METHOD: loginNonExistingUser
//
// DESCRIPTION:
// Logins a user not present in the data storage.
/*****************************************************************/
exports['loginNonExistingUser'] = function(test)
{
	test.expect(1);
	var usersInstance = new users();

	usersInstance.login("nonExistingUserName", "myPassword", function(code)
	{
		test.equal(code, constants.ERR_BAD_CREDENTIALS);
		test.done();
	});
};

/*****************************************************************/
// METHOD: loginExistingUserWithBadPassword
//
// DESCRIPTION:
// Logins a user present in the data storage but with bad pwd.
/*****************************************************************/
exports['loginExistingUserWithBadPassword'] =
{
	setUp: function(callback)
	{
		console.log("Test: setUp(): clear the users table");
		
		var dataaccessinstance = new dataaccess();
 		dataaccessinstance.query("DELETE from users", function(results)
 		{
 			console.log("Test: setUp(): add existing user");
 			dataaccessinstance.query('INSERT INTO users (username, password, count) VALUES ("myUsername", "myPassword", 1)', function(results)
 			{
 				callback();	
 			});		
 		}); 		
	},
	tearDown: function(callback)
	{
		console.log("Test: tearDown(): clear the users table");
		var dataaccessinstance = new dataaccess();
 		dataaccessinstance.query("DELETE from users", function(results)
 		{
  			callback(); 				
 		});
	},
	testMethod: function(test)
	{
		test.expect(1);
		var usersInstance = new users();

		usersInstance.login("myUsername", "badPassword", function(code)
		{
			test.equal(code, constants.ERR_BAD_CREDENTIALS);
			test.done();
		});	
	}
};

/*****************************************************************/
// METHOD: loginExistingUser
//
// DESCRIPTION:
// Logins a user present in the data storage which updates the count.
/*****************************************************************/
exports['loginExistingUser'] =
{
	setUp: function(callback)
	{
		console.log("Test: setUp(): clear the users table");
		
		var dataaccessinstance = new dataaccess();
 		dataaccessinstance.query("DELETE from users", function(results)
 		{
 			console.log("Test: setUp(): add existing user");
 			dataaccessinstance.query('INSERT INTO users (username, password, count) VALUES ("myUsername", "myPassword", 3)', function(results)
 			{
 				callback();	
 			});		
 		}); 		
	},
	tearDown: function(callback)
	{
		console.log("Test: tearDown(): clear the users table");
		var dataaccessinstance = new dataaccess();
 		dataaccessinstance.query("DELETE from users", function(results)
 		{
  			callback(); 				
 		});
	},
	testMethod: function(test)
	{
		test.expect(1);
		var usersInstance = new users();

		usersInstance.login("myUsername", "myPassword", function(code)
		{
			test.equal(code, 4);
			test.done();
		});	
	}
};

/*****************************************************************/
// METHOD: resetFixture
//
// DESCRIPTION:
// Deletes all entries in the database.
/*****************************************************************/
exports['resetFixture'] = function(test)
{
	test.expect(1);
	var usersInstance = new users();

	usersInstance.TESTAPI_resetFixture(function(code)
	{
		test.equal(code, constants.SUCCESS);
		test.done();
	});
};
