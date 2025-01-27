const puppeteer = require('puppeteer');
const fs = require('fs');

module.exports = async function scrapeInstagram(link) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Load cookies from the file
    if (fs.existsSync('cookies.json')) {
      try {
        const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf-8'));
        await page.setCookie(...cookies);
        console.log('Loaded session from cookies!');
      } catch (err) {
        console.error('Failed to load cookies:', err.message);
        throw new Error('Invalid cookies.json file');
      }
    } else {
      throw new Error('cookies.json file not found. Please provide valid cookies.');
    }

    // Navigate to the target Instagram profile
    await page.goto(link, { waitUntil: 'networkidle2' });

    // Scrape profile data
    const profileData = await page.evaluate(() => {
      const counts = document.querySelectorAll('header section ul li span');
      return {
        followers: counts[1]?.getAttribute('title') || counts[1]?.innerText || 'Not found',
        following: counts[2]?.innerText || 'Not found',
        posts: counts[0]?.innerText || 'Not found',
      };
    });

    console.log('Scraped Data:', profileData);

    await browser.close();
    return profileData; // Return scraped data
  } catch (error) {
    console.error('Error in scrapeInstagram:', error.message);
    await browser.close();
    throw error; // Propagate the error to the caller
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////////
//Tried for the account based and location
////////////////////////////////////////////////////////////////////////////////////////////////////////////
// const puppeteer = require('puppeteer');
// const fs = require('fs');

// module.exports = async function scrapeInstagram(link) {
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();

//   try {
//     // Load cookies from the file
//     if (fs.existsSync('cookies.json')) {
//       const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf-8'));
//       await page.setCookie(...cookies);
//       console.log('Loaded session from cookies!');
//     } else {
//       throw new Error('cookies.json file not found. Please provide valid cookies.');
//     }

//     // Navigate to the target Instagram profile
//     await page.goto(link, { waitUntil: 'networkidle2' });

//     // Wait for the page to load
//     await page.waitForSelector('header section ul li span', { timeout: 15000 });

//     // Scrape basic profile data
//     const profileData = await page.evaluate(() => {
//       const counts = document.querySelectorAll('header section ul li span');
//       return {
//         followers: counts[1]?.getAttribute('title') || counts[1]?.innerText || 'Not found',
//         following: counts[2]?.innerText || 'Not found',
//         posts: counts[0]?.innerText || 'Not found',
//       };
//     });

//     // Select and click the SVG representing the three dots
//     const threeDotsButton = await page.$('svg[aria-label="Options"]');
//     if (threeDotsButton) {
//       await threeDotsButton.click();
//       await new Promise(resolve => setTimeout(resolve, 1000)); // Replace waitForTimeout
//     } else {
//       throw new Error('Three dots button not found');
//     }

//     // Wait and click the "About this account" button
//     const aboutButton = await page.waitForSelector(
//       'button.xjbqb8w.x1qhh985.xcfux6l.xm0m39n.x1yvgwvq.x13fuv20.x178xt8z.x1ypdohk.xvs91rp.x1evy7pa.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x1wxaq2x.x1iorvi4.x1sxyh0.xjkvuk6.xurb0ha.x2b8uid.x87ps6o.xxymvpz.xh8yej3.x52vrxo.x4gyw5p.x5n08af',
//       { timeout: 5000 }
//     );

//     if (aboutButton) {
//       await aboutButton.click();

//       // Wait for the popup to load
//       await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

//       // Scrape data from the popup
//       const aboutData = await page.evaluate(() => {
//         const dialogContent = document.querySelector('[role="dialog"]');
//         if (!dialogContent) return { accountBased: 'Not found', verified: 'Not found' };

//         const accountBasedElement = Array.from(dialogContent.querySelectorAll('span')).find(span =>
//           span.innerText.includes('Account based in')
//         );
//         const verifiedElement = Array.from(dialogContent.querySelectorAll('span')).find(span =>
//           span.innerText.includes('Verified')
//         );

//         return {
//           accountBased: accountBasedElement
//             ? accountBasedElement.nextElementSibling?.innerText.trim() || 'Not found'
//             : 'Not found',
//           verified: verifiedElement
//             ? verifiedElement.nextElementSibling?.innerText.trim() || 'Not found'
//             : 'Not found',
//         };
//       });

//       console.log('Scraped About Data:', aboutData);

//       await browser.close();
//       return { ...profileData, ...aboutData };
//     } else {
//       throw new Error('"About this account" button not found');
//     }
//   } catch (error) {
//     console.error('Error in scrapeInstagram:', error.message);
//     await browser.close();
//     throw error;
//   }
// };
