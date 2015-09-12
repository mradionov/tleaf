'use strict';

// Use this type of error to display custom error message in a nice way
// It is processed in cli.js in 'uncaughtException' listener
function UserError(userMessage, originalError) {
  // you can pass original error object, if re-throwing to keep it's info
  originalError = originalError || {};

  this.name = 'UserError';
  this.userMessage = userMessage;
  this.message = originalError.message || userMessage;
  this.stack = originalError.stack;
}

UserError.prototype = Object.create(Error.prototype);
UserError.prototype.constructor = UserError;

module.exports = UserError;