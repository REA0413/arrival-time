const puppeteer = require('puppeteer');

async function scrapeFlights() {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-zygote',
      '--single-process'
    ]
  });

  try {
    const page = await browser.newPage();
    
    // Set timeouts to 60 seconds so the script doesn't give up too quickly
    await page.setDefaultNavigationTimeout(60000);
    await page.setDefaultTimeout(60000);
    
    // Set the browser window size
    await page.setViewport({ width: 1280, height: 800 });

    // Tell us what's happening
    console.log('Navigating to website...');
    // Go to the airport website
    await page.goto('https://soekarnohatta-airport.co.id/fids?type_data=A', {
      waitUntil: 'networkidle2',  // Wait until the page is mostly loaded
      timeout: 60000
    });

    // Wait for the flight table to appear
    console.log('Waiting for table...');
    await page.waitForSelector('#tablefids');

    // Change the number of entries shown to 750
    console.log('Changing entries to 750...');
    await page.evaluate(() => {
      const select = document.querySelector('#tablefids_length > label > select');
      if (select) {
        select.value = '750';
        select.dispatchEvent(new Event('change'));
      }
    });

    // Wait 3 seconds for the table to update
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Get all the flight data from the table
    console.log('Extracting flight data...');
    const flightData = await page.evaluate(() => {
      // Find all rows in the table
      const rows = Array.from(document.querySelectorAll('#tablefids tbody tr'));
      // For each row, get the flight information
      return rows.map(row => {
        const cells = Array.from(row.querySelectorAll('td'));
        return {
          airline: cells[1]?.textContent?.trim() || '',
          flightNumber: cells[2]?.textContent?.trim() || '',
          origin: cells[3]?.textContent?.trim() || '',
          destination: cells[4]?.textContent?.trim() || '',
          scheduledTime: cells[5]?.textContent?.trim() || '',
          status: cells[6]?.textContent?.trim() || ''
        };
      });
    });

    // Tell us it worked and show the data
    console.log('Flight data extracted successfully');
    console.log(flightData);

  } catch (error) {
    // If anything goes wrong, tell us about it
    console.error('Error during scraping:', error);
    throw error;
  } finally {
    // Always close the browser when we're done
    await browser.close();
  }
}

scrapeFlights(); 