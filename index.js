const express = require('express');
const bodyParser = require('body-parser');
const supabaseClient = require('@supabase/supabase-js');
const { isValidStateAbbreviation } = require('usa-state-validator');
const dotenv = require('dotenv');

const app = express();
const port = 3000;
dotenv.config();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);

const API_KEY = process.env.API_KEY;

app.get('/', (req, res) => {
  res.sendFile('public/main.html', { root: __dirname });
});

app.get('/about', (req, res) => {
  res.sendFile('public/about.html', { root: __dirname });
});

app.get('/compare', (req, res) => {
  res.sendFile('public/compare.html', { root: __dirname });
});

app.get('/contact', async (req, res) =>  {
    const output = {
        phrase: 'Hello World',
    };

    res.json(output);
});

const RAPIDAPI_HEADERS = {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': 'basketball-head.p.rapidapi.com',
    'Content-Type': 'application/json'
};

app.get('/api/db-check', async (req, res) => {
    const { firstname, lastname } = req.query;
    const { data, error } = await supabase
        .from('players')
        .select('*')
        .ilike('player_first_name', firstname)
        .ilike('player_last_name', lastname)
        .maybeSingle();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data); 
});

app.get('/api/external-fetch', async (req, res) => {
    const { firstname, lastname } = req.query;
    try {
        const searchRes = await fetch('https://basketball-head.p.rapidapi.com/players/search', {
            method: 'POST',
            headers: RAPIDAPI_HEADERS,
            body: JSON.stringify({ firstname, lastname, pageSize: 1 })
        });
        const searchData = await searchRes.json();
        const player = searchData.body[0]

        if (!player) return res.status(404).json({ error: "Player not found" });

        const statsRes = await fetch(`https://basketball-head.p.rapidapi.com/players/${player.playerId}/stats/PerGame?seasonType=Regular&seasonId=Career`, { 
            method: 'GET', headers: RAPIDAPI_HEADERS 
        });
        const statsData = await statsRes.json();
        const career = statsData.body;
        console.log(career);

        res.json({
            player_id: player.playerId,
            player_first_name: player.firstName,
            player_last_name: player.lastName,
            points_per_game: parseFloat(career.pointsPerGame) || 0,
            rebounds_per_game: parseFloat(career.totalReboundsPerGame) || 0,
            assists_per_game: parseFloat(career.assistsPerGame) || 0
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/db-push', async (req, res) => {
    const { data, error } = await supabase
        .from('players')
        .upsert(req.body, { onConflict: 'player_id' })
        .select().single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.listen(port, () => {
  console.log(`App is available on port: ${port}`);
});