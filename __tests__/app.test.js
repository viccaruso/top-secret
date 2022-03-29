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
});
