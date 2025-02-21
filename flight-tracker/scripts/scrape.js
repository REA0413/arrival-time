const puppeteer = require('puppeteer');

async function scrapeFlights() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.goto('https://soekarnohatta-airport.co.id/fids?type_data=A', {
      waitUntil: 'networkidle0'
    });

    // Change entries to 750
    await page.evaluate(() => {
      const select = document.querySelector('#tablefids_length > label > select');
      if (select) {
        const option = select.querySelector('option[value="100"]');
        if (option) {
          option.value = '750';
          select.value = '100';
          select.dispatchEvent(new Event('change'));
        }
      }
    });

    // Wait for table to load
    await page.waitForSelector('#tablefids');

    // Extract data
    const flightData = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('#tablefids tbody tr'));
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

    console.log('Scraped flight data:', flightData);

  } catch (error) {
    console.error('Error during scraping:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

scrapeFlights(); 