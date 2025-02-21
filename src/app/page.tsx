'use client'

import { useState } from 'react'
import FlightForm from '@/components/FlightForm'
import FlightResults from '@/components/FlightResults'
import { FlightData } from '@/types'

export default function Home() {
  const [results, setResults] = useState<FlightData[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (searchParams: {
    airline?: string
    flightNumber?: string
    origin?: string
  }) => {
    setLoading(true)
    try {
      const response = await fetch('/api/flights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      })
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Error fetching flight data:', error)
    }
    setLoading(false)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Flight Tracker
      </h1>
      <FlightForm onSearch={handleSearch} />
      {loading ? (
        <div className="text-center mt-8">Loading...</div>
      ) : (
        <FlightResults results={results} />
      )}
    </main>
  )
} 