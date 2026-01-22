import { Circle, Plane } from 'lucide-react';
import { useFlightSearch } from '../context/FlightSearchContext';
import type { Flight } from '../types/flight';

interface FlightCardProps {
  flight: Flight;
}

export function FlightCard({ flight }: FlightCardProps) {
  const { setSelectedFlight } = useFlightSearch();

  console.log("This is the flight data in flightCare:", flight)

  const handleSelect = () => {
    if (flight.rawOffer) {
      setSelectedFlight(flight.rawOffer, flight);
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(\d+)H(\d+)M/);
    if (match) {
      return `${match[1]} hr ${match[2]} min`;
    }
    return duration;
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg hover:shadow-md transition-shadow duration-200">
      <div className="p-3 md:p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between md:justify-start gap-4 md:gap-8">
              <div className="flex-shrink-0">
                <div className="text-lg md:text-xl font-normal text-gray-900 mb-1">{formatTime(flight.departure.time)}</div>
                <div className="text-xs md:text-sm text-gray-600">{flight.departure.airport}</div>
              </div>

              <div className="flex flex-col items-center flex-1 max-w-xs">
                <div className="text-xs md:text-sm text-gray-600 mb-1">
                  {formatDuration(flight.duration)}
                </div>
                <div className="w-full flex items-center justify-center gap-1">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <Plane size={14} className="text-gray-400 flex-shrink-0" />
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>
                <div className="text-xs md:text-sm text-gray-600 mt-1">
                  {flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                </div>
              </div>

              <div className="flex-shrink-0 text-right">
                <div className="text-lg md:text-xl font-normal text-gray-900 mb-1">{formatTime(flight.arrival.time)}</div>
                <div className="text-xs md:text-sm text-gray-600">{flight.arrival.airport}</div>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="text-xs md:text-sm text-gray-700">{flight.airline}</div>
            </div>
          </div>

          <div className="md:border-l md:pl-4 md:border-gray-300 flex items-center justify-between md:flex-col md:items-end md:gap-2 flex-shrink-0">
            <div className="text-right">
              <div className="text-lg md:text-xl font-normal text-gray-900">
                ${flight.price.toFixed(0)}
              </div>
            </div>
            <button 
              onClick={handleSelect}
              className="px-4 md:px-6 py-1.5 md:py-2 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition-colors font-medium text-xs md:text-sm whitespace-nowrap">
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
