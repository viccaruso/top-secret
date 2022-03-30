const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

describe('top-secret routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  // Create a dummy user for testing
  const dummyUser = {
    email: 'dummy@defense.gov',
    password: 'pa$$word'
  };

  it('Should create a new user in users table', async () => {
    const res = await request(app).post('/api/v1/users').send(dummyUser);
    expect(res.body).toEqual({ id: expect.any(String), email: 'dummy@defense.gov' });
  });

  it('Should sign an existing user in', async () => {
    const user = await UserService.createUser(dummyUser); // <-- create the user
    const res = await request(app).post('/api/v1/users/sessions').send({ email: 'dummy@defense.gov', password: 'pa$$word' });
    expect(res.body).toEqual({
      message: 'Signed in successfully!',
      user
    });
  });

  it('Should log out a user that was signed in', async () => {
    // Create user
    await UserService.createUser(dummyUser);
    // Sign the user in
    await request(app).post('/api/v1/users/sessions').send({ email: 'dummy@defense.gov', password: 'pa$$word' });
    // Sign the user out
    const res = await request(app).delete('/api/v1/users/sessions');
    // Check that response message confirms user logged out.
    expect(res.body).toEqual({
      message: 'You have logged out.'
    });
  });

  it('Should return a list of secrets for logged in users only', async () => {
    // Create user
    await UserService.createUser(dummyUser);
    // Try to get secrets from /api/v1/secrets while user is not logged in
    let res = await request(app).get('/api/v1/secrets');
    expect(res.body).toEqual({
      status: 401,
      message: 'You need to be logged in to access these secrets.'
    });

    // Now sign them in
    await request(app).post('/api/v1/users/sessions').send({ email: 'dummy@defense.gov', password: 'pa$$word' });
    // And try to get secrets again
    res = await request(app).get('/api/v1/secrets');
    expect(res.body).toEqual([
      {
        title: 'Top Secret: Daniel Radcliffe / Elijah Wood ',
        description: 'It has been proven by top government officials that Daniel Radcliffe and Elijah Wood are indeed the same person.',
        createdAt: expect.any(String)
      },
      {
        title: 'Top Secret: Pop Secret',
        description: 'It is just regular popcorn and there is no secret to it.',
        createdAt: expect.any(String)
      },
      {
        title: 'Top Secret: Konami Code',
        description: 'The missile launch code is: up, up, down, down, left, right, left, right, B, A, Start}',
        createdAt: expect.any(String)
      }
    ]);
  });
});
