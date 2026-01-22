import { useFlightSearch } from '../context/FlightSearchContext';
import { FlightCard } from './FlightCard';
import { Search } from 'lucide-react';

export function FlightList() {
  const { filteredFlights, isLoading, hasSearched } = useFlightSearch();

  if (isLoading) {
    return (
      <div className="p-12 text-center">
        <div className="inline-flex items-center justify-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
        </div>
        <p className="text-gray-100 font-medium">Searching for flights...</p>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="p-12 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
          <Search size={24} className="text-gray-600" />
        </div>
        <p className="text-gray-100 font-medium">Start your search</p>
        <p className="text-gray-100 text-sm mt-1">Enter your travel details to find flights</p>
      </div>
    );
  }

  if (filteredFlights.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-100 font-medium">No flights found</p>
        <p className="text-gray-100 text-sm mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  const sortedFlights = [...filteredFlights].sort((a, b) => a.price - b.price);
  const bestPrice = sortedFlights[0]?.price;

  return (
    <div className="space-y-3">
      {/* <div className="pb-3 border-b border-gray-300"> */}
      <div className='mb-6 px-6 py-2 bg-blue-600 w-fit rounded-full'>
        <h2 className="text-sm text-white">
          {filteredFlights.length} of {filteredFlights.length} results
        </h2>
      </div>
      {sortedFlights.map((flight, index) => (
        <div key={flight.id} className="relative">
          {index === 0 && flight.price === bestPrice && (
            <div className="absolute -top-2 left-4 bg-white px-2 py-1 text-xs text-gray-700 border border-gray-300 rounded z-10">
              Best departing flight
            </div>
          )}
          <FlightCard flight={flight} />
        </div>
      ))}
    </div>
  );
}
