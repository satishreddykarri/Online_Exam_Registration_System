const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('Authentication Routes', () => {
  // Test Signup
  test('POST /api/auth/signup - Create new user', async () => {
    const userData = {
      name: 'John Doe',
      rollNumber: 'RN12345',
      phone: '9876543210',
      email: 'john@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/auth/signup')
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe(userData.email);
  });

  // Test Signup - Missing fields
  test('POST /api/auth/signup - Missing required fields', async () => {
    const userData = {
      name: 'John Doe'
    };

    const response = await request(app)
      .post('/api/auth/signup')
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  // Test Signup - Duplicate email
  test('POST /api/auth/signup - Duplicate email', async () => {
    const userData = {
      name: 'Jane Doe',
      rollNumber: 'RN54321',
      phone: '9876543211',
      email: 'john@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/auth/signup')
      .send(userData);

    expect(response.status).toBe(400);
  });

  // Test Login
  test('POST /api/auth/login - Valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        rollNumber: 'RN12345',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user');
  });

  // Test Login - Invalid credentials
  test('POST /api/auth/login - Invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        rollNumber: 'invalid',
        password: 'wrong'
      });

    expect(response.status).toBe(400);
  });

  // Test Login - Missing fields
  test('POST /api/auth/login - Missing fields', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        rollNumber: 'RN12345'
      });

    expect(response.status).toBe(400);
  });
});

describe('Exam Routes', () => {
  // Test Exam Registration
  test('POST /api/exams/register - Register for exam', async () => {
    const response = await request(app)
      .post('/api/exams/register')
      .send({
        userId: '507f1f77bcf86cd799439011',
        subject: 'Mathematics'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('exam');
  });

  // Test Get Exams by User
  test('GET /api/exams/user/:userId - Get user exams', async () => {
    const response = await request(app)
      .get('/api/exams/user/507f1f77bcf86cd799439011');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.exams)).toBe(true);
  });
});

describe('Payment Routes', () => {
  // Test Create Payment
  test('POST /api/payments/create - Create payment record', async () => {
    const response = await request(app)
      .post('/api/payments/create')
      .send({
        userId: '507f1f77bcf86cd799439011',
        examId: '507f1f77bcf86cd799439012',
        transactionId: 'TXN123456789',
        cardLastDigits: '1234'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('payment');
  });
});