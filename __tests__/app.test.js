require('dotenv').config();
const { execSync } = require('child_process');
const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe(' routes', () => {
  let token;
  beforeAll(async () => {
    execSync('npm run setup-db');

    client.connect();

    const signInData = await fakeRequest(app)
      .post('/auth/signup')
      .send({
        email: 'jon@user.com',
        password: '1234'
      });
        
    
    token = signInData.body.token;

  });

  afterAll(() => {
    console.log('this here');
    return client.end();
  });

  test('Post a save file to our table', async () => {
    const unlockedBuildings = 
    {
      'lumberyard': false,
      'windmill': true,
      'mine': false,
      'watermill': false,
      'sawmill': true,
      'farm': false,
      'blacksmith': false,
      'tavern': false,
      'castle': false,
      'gold': 123456,
      'prestige': 2,
      'gametime': 360,
      'clicks': 1500,
    };
    const expectation = {
      'owner_id': 2,
      'lumberyard': false,
      'windmill': true,
      'mine': false,
      'watermill': false,
      'sawmill': true,
      'farm': false,
      'blacksmith': false,
      'tavern': false,
      'castle': false,
      'gold': 123456,
      'prestige': 2,
      'gametime': 360,
      'clicks': 1500,
      'unlock_id': 2,
    };
    const data = await fakeRequest(app)
      .post('/api/unlocked')
      .send(unlockedBuildings)
      .set('Authorization', token)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(data.body).toEqual([expectation]);
  });


});

