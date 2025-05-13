const request = require('supertest');
const app = require('../index'); // Assuming your Express app is exported from index.js
const mongoose = require('mongoose');
const User = require('../models/User');

let server;

beforeAll(async () => {
  // Connect to test database only if not already connected
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/food-delivery-test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  // Start the server for testing
  server = app.listen(0);
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  }
  // Close the server after tests
  if (server) {
    await server.close();
  }
});

describe('Auth API', () => {
  const userData = { username: 'testuser', email: 'testuser@example.com', password: 'testpass' };

  it('should register a new user', async () => {
    const res = await request(server).post('/api/auth/register').send(userData);
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe('User registered successfully');
  });

  it('should not register an existing user', async () => {
    const res = await request(server).post('/api/auth/register').send(userData);
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('User already exists');
  });

  it('should login an existing user', async () => {
    const res = await request(server).post('/api/auth/login').send({ identifier: userData.username, password: userData.password });
    console.log('Login response:', res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();
  });

  it('should not login with wrong password', async () => {
    const res = await request(server).post('/api/auth/login').send({ identifier: userData.username, password: 'wrongpass' });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Invalid username/email or password');
  });
});
