import { FlightData } from '@/types'

interface FlightResultsProps {
  results: FlightData[]
}

export default function FlightResults({ results }: FlightResultsProps) {
  if (results.length === 0) {
    return null
  }

  return (
    <div className="mt-8 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Airline
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Flight Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Origin
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Destination
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Scheduled Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {results.map((flight, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">{flight.airline}</td>
              <td className="px-6 py-4 whitespace-nowrap">{flight.flightNumber}</td>
              <td className="px-6 py-4 whitespace-nowrap">{flight.origin}</td>
              <td className="px-6 py-4 whitespace-nowrap">{flight.destination}</td>
              <td className="px-6 py-4 whitespace-nowrap">{flight.scheduledTime}</td>
              <td className="px-6 py-4 whitespace-nowrap">{flight.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 