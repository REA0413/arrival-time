import { useState } from 'react'
import { FlightData } from 'types';
import FlightForm from '@/components/FlightForm'
import FlightResults from '@/components/FlightResults'

export default function Home() {
  const [results, setResults] = useState<FlightData[]>([])
  const [loading, setLoading] = useState(false)

  const triggerGithubAction = async () => {
    try {
      await fetch('https://api.github.com/repos/REA0413/waktu-tiba/dispatches', {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
        },
        body: JSON.stringify({
          event_type: 'trigger-scrape'
        })
      });
    } catch (error) {
      console.error('Error triggering GitHub Action:', error);
    }
  };

  const handleSearch = async (searchParams: {
    airline?: string
    flightNumber?: string
    origin?: string
  }) => {
    setLoading(true)
    try {
      await triggerGithubAction()
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