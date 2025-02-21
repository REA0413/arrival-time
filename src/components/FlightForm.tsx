'use client'

import { useState } from 'react'

interface FlightFormProps {
  onSearch: (params: {
    airline?: string
    flightNumber?: string
    origin?: string
  }) => void
}

export default function FlightForm({ onSearch }: FlightFormProps) {
  const [formData, setFormData] = useState({
    airline: '',
    flightNumber: '',
    origin: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const searchParams = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== '')
    )
    onSearch(searchParams)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <div>
        <label htmlFor="airline" className="block text-sm font-medium mb-1">
          Airline
        </label>
        <input
          type="text"
          id="airline"
          name="airline"
          value={formData.airline}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter airline name"
        />
      </div>
      <div>
        <label htmlFor="flightNumber" className="block text-sm font-medium mb-1">
          Flight Number
        </label>
        <input
          type="text"
          id="flightNumber"
          name="flightNumber"
          value={formData.flightNumber}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter flight number"
        />
      </div>
      <div>
        <label htmlFor="origin" className="block text-sm font-medium mb-1">
          Origin
        </label>
        <input
          type="text"
          id="origin"
          name="origin"
          value={formData.origin}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter origin airport"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Search Flights
      </button>
    </form>
  )
} 