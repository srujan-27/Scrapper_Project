
const puppeteer = require('puppeteer');

module.exports = async function scrapeYouTube(link) {
  const browser = await puppeteer.launch({ headless: false }); // Headful mode for debugging
  const page = await browser.newPage();

  try {
    // Navigate to the YouTube video URL
    await page.goto(link, { waitUntil: 'networkidle2' });

    // Wait for dynamic content to load
    await new Promise(resolve => setTimeout(resolve, 5000)); // 5-second delay

    // Wait for the title or other elements to load
    await page.waitForSelector('h1.title, h1.ytd-watch-metadata', { timeout: 15000 });

    // Scrape video details
    const videoData = await page.evaluate(() => {
      // Get the title
      const titleElement = document.querySelector(
        'h1.style-scope.ytd-watch-metadata yt-formatted-string'
      );
      const title = titleElement?.innerText.trim() || 'Not found';

      // Get the views
      const viewsElement = document.querySelector(
        '.view-count.style-scope.ytd-video-view-count-renderer'
      );
      const views = viewsElement?.innerText.trim() || 'Not found';

      // Get the likes
      const likeElement = document.querySelector(
        'div.ytwFactoidRendererFactoid[role="text"]'
      );
      const likes = likeElement
        ? likeElement.getAttribute('aria-label').split(' likes')[0] || 'Not found'
        : 'Not found';

      return {
        title,
        views,
        likes,
      };
    });

    console.log('Scraped Data:', videoData);

    await browser.close();
    return videoData; // Return the scraped data
  } catch (error) {
    console.error('Error in scrapeYouTube:', error.message);
    await browser.close();
    throw error; // Propagate the error
  }
};
