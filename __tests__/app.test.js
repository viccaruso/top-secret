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
    const agent = request.agent(app);
    // Create user
    await UserService.createUser(dummyUser);
    // Sign the user in
    await agent.post('/api/v1/users/sessions').send({ email: 'dummy@defense.gov', password: 'pa$$word' });
    // Sign the user out
    const res = await agent.delete('/api/v1/users/sessions');
    // Check that response message confirms user logged out.
    expect(res.body).toEqual({
      message: 'You have logged out.'
    });
  });

  it('Should return an error if secrets are accessed without a logged in user', async () => {
    // Try to get secrets from /api/v1/secrets while user is not logged in
    const res = await request(app).get('/api/v1/secrets');
    expect(res.body).toEqual({
      status: 401,
      message: 'You need to be logged in to access these secrets.'
    });
  });

  it('Should return a list of secrets if user is logged in', async () => {
    // Create an agent to hold session cookie for a user when they are logged in
    const agent = request.agent(app);

    // Create a user
    await UserService.createUser(dummyUser);

    // Use the agent to sign in 
    await agent.post('/api/v1/users/sessions').send({ email: 'dummy@defense.gov', password: 'pa$$word' });

    // And try to get secrets using the agent (that now has valid session cookie)
    const res = await agent.get('/api/v1/secrets');

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
        description: 'The missile launch code is: up, up, down, down, left, right, left, right, B, A, Start',
        createdAt: expect.any(String)
      }
    ]);

  });

  it('Should return an error if a user tries to post a secret when they are not logged in.', async () => {
    // Try to post a secret to /api/v1/secrets while user is not logged in
    const res = await request(app).post('/api/v1/secrets').send({ title: 'Answer to the Ultimate Question of Life, the Universe, and Everything', description: '42' });
    expect(res.body).toEqual({
      status: 401,
      message: 'You need to be logged in to access these secrets.'
    });
  });

  it('Should post a secret when user is logged in', async () => {
    // Set up agent
    const agent = request.agent(app);
    // Create a user
    await UserService.createUser(dummyUser);
    // Sign the user in
    await agent.post('/api/v1/users/sessions').send({ email: 'dummy@defense.gov', password: 'pa$$word' });
    // And now try to post a secret using the agent (that is signed in)
    const res = await agent.post('/api/v1/secrets').send({ title: 'Ultra Secret: Answer to the Ultimate Question of Life, the Universe, and Everything', description: '42' });
    expect(res.body).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      ...res.body
    });
  });
});
