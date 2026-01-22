import { createContext, useContext, useState, ReactNode } from 'react';
import type { Flight, SearchParams } from '../types/flight';
import type { FiltersState } from '../types/filters';
import type { AmadeusFlightOffer } from '../types/api';
import { searchFlights } from '../services/flightApi';
import { filterFlights, getMaxPrice } from '../utils/filterFlights';

interface FlightSearchContextType {
  flights: Flight[];
  filteredFlights: Flight[];
  filters: FiltersState;
  isLoading: boolean;
  hasSearched: boolean;
  searchParams: SearchParams | null;
  selectedFlight: AmadeusFlightOffer | null;
  selectedFlightData: Flight | null;
  search: (params: SearchParams) => Promise<void>;
  updateFilters: (filters: Partial<FiltersState>) => void;
  resetFilters: () => void;
  setSelectedFlight: (flight: AmadeusFlightOffer | null, flightData?: Flight | null) => void;
}

const FlightSearchContext = createContext<FlightSearchContextType | undefined>(undefined);

export function FlightSearchProvider({ children }: { children: ReactNode }) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filters, setFilters] = useState<FiltersState>({
    maxPrice: 10000,
    stops: [],
    airlines: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [selectedFlight, setSelectedFlightState] = useState<AmadeusFlightOffer | null>(null);
  const [selectedFlightData, setSelectedFlightData] = useState<Flight | null>(null);

  const setSelectedFlight = (flight: AmadeusFlightOffer | null, flightData?: Flight | null) => {
    setSelectedFlightState(flight);
    setSelectedFlightData(flightData || null);
  };

  const search = async (params: SearchParams) => {
    setIsLoading(true);
    setHasSearched(true);
    setSearchParams(params);

    try {
      const results = await searchFlights(params);
      setFlights(results);
      setFilters({
        maxPrice: getMaxPrice(results),
        stops: [],
        airlines: [],
      });
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFilters = (newFilters: Partial<FiltersState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      maxPrice: getMaxPrice(flights),
      stops: [],
      airlines: [],
    });
  };

  const filteredFlights = filterFlights(flights, filters);

  return (
    <FlightSearchContext.Provider
      value={{
        flights,
        filteredFlights,
        filters,
        isLoading,
        hasSearched,
        searchParams,
        selectedFlight,
        selectedFlightData,
        search,
        updateFilters,
        resetFilters,
        setSelectedFlight,
      }}
    >
      {children}
    </FlightSearchContext.Provider>
  );
}

export function useFlightSearch() {
  const context = useContext(FlightSearchContext);
  if (!context) {
    throw new Error('useFlightSearch must be used within FlightSearchProvider');
  }
  return context;
}
