import { FlightSearchProvider, useFlightSearch } from './context/FlightSearchContext';
import { SearchForm } from './components/SearchForm';
import { Filters } from './components/Filters';
import { FlightList } from './components/FlightList';
import { PriceChart } from './components/PriceChart';
import { FlightDetailModal } from './components/FlightDetailModal';
import { Plane } from 'lucide-react';
// import SkyscannerClone from './components/SkyscannerClone'

function AppContent() {
  const { selectedFlight, selectedFlightData } = useFlightSearch(); 

  return (
    <div className="min-h-screen bg-white">
      <div className='bg-blue-950 px-3 py-10 md:p-10'>
        <div className="max-w-7xl mx-auto md:px-3">
          <div className='flex space-x-3 mb-4 bg-blue-600 w-fit px-4 py-2 rounded-full text-white'>
            <Plane />
            <p>Flights</p>
          </div>
          <h2 className="text-3xl font-bold text-gray-100 mb-2">
            Millions of cheap flights. One simple search.
          </h2>
          <p className="text-gray-100">Search and compare flight prices from hundreds of airlines</p>
        </div>
        <div className="max-w-7xl mx-auto md:px-4 py-4">
          <SearchForm />
          {/* <SkyscannerClone /> */}
        </div>
      </div>

      <div className="mt-8 px-1 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-8">
            <div className="bg-blue-950 p-2 rounded-2xl order-1 md:order-2 md:col-span-2 space-y-6">
              <Filters />
              <div className="bg-white p-2 rounded-2xl md:hidden">
                <PriceChart />
              </div>
              <FlightList />
            </div>

            <div className="order-2 md:order-1 md:col-span-3 hidden md:block">
              <div className="md:sticky md:top-32 md:max-h-[calc(100vh-4rem)]">
                <PriceChart />
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedFlight && <FlightDetailModal flightOffer={selectedFlight} flightData={selectedFlightData || undefined} />}
    </div>
  );
}

function App() {
  return (
    <FlightSearchProvider>
      <AppContent />
    </FlightSearchProvider>
  );
}

export default App;
