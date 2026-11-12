/**
 * Author: Darwin Pena Cabrera
 * File: schemas.js
 * Description: JSON validation schemas for API requests.
 */

'use strict';

// Sign-in request validation schema
const signInSchema = {
  type: 'object',
  properties: {
    username: { type: 'string', minLength: 1 },
    password: {
      type: 'string',
      minLength: 8,
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$'
    }
  },
  required: ['username', 'password'],
  additionalProperties: false
};

// Export the validation schemas
module.exports = {
  signInSchema
};