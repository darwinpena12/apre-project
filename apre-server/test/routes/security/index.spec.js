/**
 * Author: Darwin Pena Cabrera
 * File: index.spec.js
 * Description: Test the Sign-In API Ajv validation.
 */

// Require the modules
const request = require('supertest');
const app = require('../../../src/app');
const { mongo } = require('../../../src/utils/mongo');
const bcrypt = require('bcryptjs');

jest.mock('../../../src/utils/mongo');

// Test the Sign-In API
describe('Sign-In API', () => {
  beforeEach(() => {
    mongo.mockClear();
  });

  // Test the POST /signin endpoint with a missing username
  it('should reject a request with a missing username', async () => {
    const response = await request(app)
      .post('/api/security/signin')
      .send({ password: 'Password01' });

    expect(response.status).toBe(400);
    expect(mongo).not.toHaveBeenCalled();
  });

  // Test the POST /signin endpoint with an invalid password format
  it('should reject a request with an invalid password format', async () => {
    const response = await request(app)
      .post('/api/security/signin')
      .send({ username: 'admin', password: 'password' });

    expect(response.status).toBe(400);
    expect(mongo).not.toHaveBeenCalled();
  });

  // Test the POST /signin endpoint with valid credentials
  it('should sign in a user with valid credentials', async () => {
    const passwordHash = bcrypt.hashSync('Password01', 10);

    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        findOne: jest.fn().mockResolvedValue({
          username: 'admin',
          passwordHash,
          role: 'admin'
        })
      };
      await callback(db);
    });

    const response = await request(app)
      .post('/api/security/signin')
      .send({ username: 'admin', password: 'Password01' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      username: 'admin',
      role: 'admin'
    });
    expect(mongo).toHaveBeenCalled();
  });

  // Test the POST /signin endpoint with an incorrect password
  it('should reject a user with an incorrect password', async () => {
    const passwordHash = bcrypt.hashSync('Password01', 10);

    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        findOne: jest.fn().mockResolvedValue({
          username: 'admin',
          passwordHash,
          role: 'admin'
        })
      };
      await callback(db);
    });

    const response = await request(app)
      .post('/api/security/signin')
      .send({ username: 'admin', password: 'WrongPass01' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Not authorized');
    expect(mongo).toHaveBeenCalled();
  });
});