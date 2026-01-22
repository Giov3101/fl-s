import type { AmadeusFlightOffer } from './api';

export interface Flight {
  id: string;
  price: number;
  currency: string;
  airline: string;
  departure: {
    time: string;
    airport: string;
  };
  arrival: {
    time: string;
    airport: string;
  };
  duration: string;
  stops: number;
  rawOffer?: AmadeusFlightOffer;
}

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass: 'economy' | 'premium_economy' | 'business' | 'first';
  tripType: 'roundtrip' | 'oneway';
}
