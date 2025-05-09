const request = require('supertest');
const app = require('../index'); // Assuming your Express app is exported from index.js
const mongoose = require('mongoose');
const User = require('../models/User');

beforeAll(async () => {
  // Connect to test database
  await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/food-delivery-test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('Auth API', () => {
  const userData = { username: 'testuser', password: 'testpass' };

  it('should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send(userData);
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe('User registered successfully');
  });

  it('should not register an existing user', async () => {
    const res = await request(app).post('/api/auth/register').send(userData);
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('User already exists');
  });

  it('should login an existing user', async () => {
    const res = await request(app).post('/api/auth/login').send(userData);
    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();
  });

  it('should not login with wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'testuser', password: 'wrongpass' });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Invalid username or password');
  });
});
