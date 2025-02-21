import { NextResponse } from 'next/server'
import puppeteer, { Page } from 'puppeteer'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { airline, flightNumber, origin } = data

    // Validate input
    if (flightNumber && typeof flightNumber !== 'string') {
      return NextResponse.json(
        { error: 'Invalid flight number format' },
        { status: 400 }
      )
    }

    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()

    // Navigate and wait for network to be idle
    await page.goto('https://soekarnohatta-airport.co.id/fids?type_data=A', {
      waitUntil: 'networkidle0'
    })

    // Wait for table to be loaded
    await page.waitForSelector('#tablefids')

    // Change entries to 750
    await page.evaluate(() => {
      const select = document.querySelector('#tablefids_length > label > select') as HTMLSelectElement
      if (select) {
        select.value = '750'
        select.dispatchEvent(new Event('change'))
      }
    })

    // Wait for data to load after changing entries
    await new Promise(resolve => setTimeout(resolve, 2000))

    const flightData = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('#tablefids tbody tr'))
      return rows.map(row => {
        const cells = Array.from(row.querySelectorAll('td'))
        return {
          airline: cells[1]?.textContent?.trim() || '',
          flightNumber: cells[2]?.textContent?.trim() || '',
          origin: cells[3]?.textContent?.trim() || '',
          destination: cells[4]?.textContent?.trim() || '',
          scheduledTime: cells[5]?.textContent?.trim() || '',
          status: cells[6]?.textContent?.trim() || ''
        }
      })
    })

    await browser.close()

    // Filter results based on search criteria
    const filteredResults = flightData.filter(flight => {
      const matchesAirline = !airline || flight.airline.toLowerCase().includes(airline.toLowerCase())
      const matchesFlightNumber = !flightNumber || flight.flightNumber.toLowerCase().includes(flightNumber.toLowerCase())
      const matchesOrigin = !origin || flight.origin.toLowerCase().includes(origin.toLowerCase())
      return matchesAirline && matchesFlightNumber && matchesOrigin
    })

    return NextResponse.json(filteredResults)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch flight data' },
      { status: 500 }
    )
  }
} 