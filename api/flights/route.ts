import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import { FlightData } from '@/types'

export async function POST(request: Request) {
  try {
    const { airline, flightNumber, origin } = await request.json()

    const browser = await puppeteer.launch({ headless: 'new' })
    const page = await browser.newPage()

    // Navigate to the FIDS page
    await page.goto('https://soekarnohatta-airport.co.id/fids?type_data=A')

    // Change the number of entries shown to 750
    await page.evaluate(() => {
      const select = document.querySelector('#tablefids_length > label > select') as HTMLSelectElement
      if (select) {
        const option = select.querySelector('option[value="100"]') as HTMLOptionElement
        if (option) {
          option.value = '750'
          select.value = '100'
          select.dispatchEvent(new Event('change'))
        }
      }
    })

    // Wait for the table to load
    await page.waitForSelector('#tablefids')

    // Extract flight data
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
    console.error('Error scraping flight data:', error)
    return NextResponse.json({ error: 'Failed to fetch flight data' }, { status: 500 })
  }
} 