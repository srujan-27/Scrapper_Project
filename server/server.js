const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const scrapeYouTube = require('./scrapers/scrapeYouTube');
const scrapeInstagram = require('./scrapers/scrapeInstagram');

const app = express();
app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/scrape', async (req, res) => {
  const { platform, link } = req.body;

  try {
    let result;
    if (platform === 'youtube') {
      result = await scrapeYouTube(link);
    } else if (platform === 'instagram') {
      result = await scrapeInstagram(link);
    } else {
      return res.status(400).json({ error: 'Invalid platform.' });
    }
    res.json(result);
  } catch (err) {
    console.error('Error in /scrape endpoint:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
