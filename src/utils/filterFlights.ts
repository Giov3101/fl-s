import type { Flight } from '../types/flight';
import type { FiltersState } from '../types/filters';

export function filterFlights(flights: Flight[], filters: FiltersState): Flight[] {
  return flights.filter(flight => {
    if (flight.price > filters.maxPrice) return false;

    if (filters.stops.length > 0 && !filters.stops.includes(flight.stops)) {
      return false;
    }

    if (filters.airlines.length > 0 && !filters.airlines.includes(flight.airline)) {
      return false;
    }

    return true;
  });
}

export function getUniqueAirlines(flights: Flight[]): string[] {
  return Array.from(new Set(flights.map(f => f.airline))).sort();
}

export function getMaxPrice(flights: Flight[]): number {
  return Math.max(...flights.map(f => f.price), 1000);
}
