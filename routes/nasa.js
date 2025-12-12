import dotenv from 'dotenv';
dotenv.config();
const express = require('express');
const axios = require('axios');


const router = express.Router();
const NASA_KEY = process.env.NASA_API_KEY;
const BASE_URL = 'https://api.nasa.gov';

// 1. Astronomy Picture of the Day
router.get('/apod', async (req, res) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/planetary/apod`, {
      params: { api_key: NASA_KEY }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Mars Rover Photos (Curiosity, latest sol)
router.get('/mars', async (req, res) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/mars-photos/api/v1/rovers/curiosity/photos`, {
      params: {
        sol: 1000,
        api_key: NASA_KEY,
        page: 1
      }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Near Earth Objects (this week)
router.get('/asteroids', async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  try {
    const { data } = await axios.get(`${BASE_URL}/neo/rest/v1/feed`, {
      params: {
        start_date: today,
        api_key: NASA_KEY
      }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;