const client = require('../lib/client');
// import our seed data:
const unlocks = require('./unlocks.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      unlocks.map(unlock => {
        return client.query(`
                    INSERT INTO unlocks (lumberyard, windmill, mine, watermill, sawmill, farm, blacksmith, tavern, castle, owner_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
                `,
        [unlock.lumberyard, unlock.windmill, unlock.mine, unlock.watermill, unlock.sawmill, unlock.farm, unlock.blacksmith, unlock.tavern, unlock.castle, user.id]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
