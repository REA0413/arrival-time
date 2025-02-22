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
      '--single-process',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ]
  });

  try {
    const page = await browser.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    await page.setDefaultNavigationTimeout(120000);
    await page.setDefaultTimeout(120000);
    
    await page.setViewport({ width: 1280, height: 800 });

    console.log('Navigating to website...');
    
    let retries = 3;
    while (retries > 0) {
      try {
        await page.goto('https://soekarnohatta-airport.co.id/fids?type_data=A', {
          waitUntil: 'networkidle2',
          timeout: 120000
        });
        break;
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        console.log(`Retrying... ${retries} attempts left`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    console.log('Waiting for table...');
    await page.waitForSelector('#tablefids', { timeout: 120000 });

    console.log('Changing entries to 750...');
    await page.evaluate(() => {
      const select = document.querySelector('#tablefids_length > label > select');
      if (select) {
        select.value = '750';
        select.dispatchEvent(new Event('change'));
      }
    });

    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('Extracting flight data...');
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

    console.log('Flight data extracted successfully');
    console.log(flightData);

  } catch (error) {
    console.error('Error during scraping:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

scrapeFlights(); 