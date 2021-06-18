require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const client = require('./client.js');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');
const authRoutes = createAuthRoutes();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use('/auth', authRoutes);
app.use('/api', ensureAuth);


app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/api/unlocked', async (req, res) => {
  try {
    // eslint-disable-next-line quotes
    const data = await client.query(`SELECT * FROM unlocks WHERE owner_id = $1`,
      [req.userId]
    );
    res.json(data.rows);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/unlocked', async (req, res) => {
  try {
  
    const data = await client.query(
      `INSERT INTO unlocks (
                lumberyard, 
                windmill, 
                mine, 
                watermill, 
                sawmill, 
                farm, 
                blacksmith, 
                tavern, 
                castle, 
                gold,
                prestige,
                gametime,
                clicks,
                owner_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *
        `,
      [req.body.lumberyard,
        req.body.windmill, 
        req.body.mine, 
        req.body.watermill, 
        req.body.sawmill, 
        req.body.farm, 
        req.body.blacksmith, 
        req.body.tavern, 
        req.body.castle, 
        req.body.gold, 
        req.body.prestige, 
        req.body.gametime, 
        req.body.clicks, 
        req.userId]);
  
    res.json(data.rows);
  } catch(e) {
  
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));


module.exports = app;
