const client = require('../lib/client');
const { getEmoji } = require('../lib/emoji.js');

// async/await needs to run in a function
run();

async function run() {

  try {
    // initiate connecting to db
    await client.connect();

    // run a query to create tables
    await client.query(`
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(256) NOT NULL,
                    hash VARCHAR(512) NOT NULL
                );           
                CREATE TABLE unlocks (
                    unlock_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL ,
                    lumberyard BOOLEAN NOT NULL,
                    windmill BOOLEAN NOT NULL,
                    mine BOOLEAN NOT NULL,
                    watermill BOOLEAN NOT NULL,
                    sawmill BOOLEAN NOT NULL,
                    farm BOOLEAN NOT NULL,
                    blacksmith BOOLEAN NOT NULL,
                    tavern BOOLEAN NOT NULL,
                    castle BOOLEAN NOT NULL,
                    gold INTEGER NOT NULL,
                    prestige INTEGER NOT NULL,
                    gametime INTEGER NOT NULL,
                    clicks INTEGER NOT NULL,
                    owner_id INTEGER NOT NULL REFERENCES users(id)
            );
        `);

    console.log('create tables complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}
