import type { SearchParams, Flight } from '../types/flight';
import type { AmadeusFlightOffer, AmadeusResponse } from '../types/api';

const AMADEUS_AUTH_URL = 'https://test.api.amadeus.com/v1/security/oauth2/token';
const AMADEUS_SEARCH_URL = 'https://test.api.amadeus.com/v2/shopping/flight-offers';
const API_KEY = import.meta.env.VITE_API_KEY;
const API_SECRET = import.meta.env.VITE_API_SECRET;

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

const AIRLINE_NAMES: Record<string, string> = {
  AA: 'American Airlines',
  UA: 'United Airlines',
  DL: 'Delta Air Lines',
  BA: 'British Airways',
  LH: 'Lufthansa',
  AF: 'Air France',
  SW: 'Southwest Airlines',
  JB: 'JetBlue Airways',
  NK: 'Spirit Airlines',
  F9: 'Frontier Airlines',
};

async function getAccessToken(): Promise<string> {
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now()) {
    console.log('Using cached access token');
    return cachedAccessToken.token;
  }

  if (!API_KEY || !API_SECRET) {
    throw new Error('API credentials not configured! Set VITE_API_KEY and VITE_API_SECRET in .env');
  }

  console.log('Fetching new access token from Amadeus...');

  try {
    const response = await fetch(AMADEUS_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${API_KEY}&client_secret=${API_SECRET}`,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Auth error:', response.status, data);
      throw new Error(`Authentication failed: ${response.status}`);
    }

    if (!data.access_token) {
      throw new Error('No access token received from Amadeus');
    }

    cachedAccessToken = {
      token: data.access_token,
      expiresAt: Date.now() + ((data.expires_in || 1800) * 1000),
    };

    console.log('Access token obtained, expires in:', data.expires_in, 'seconds');
    return data.access_token;
  } catch (error) {
    console.error('Failed to get access token:', error);
    throw error;
  }
}

function mapAmadeusToFlight(offer: AmadeusFlightOffer): Flight {
  const firstSegment = offer.itineraries[0].segments[0];
  const lastSegment = offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1];
  const airline = offer.validatingAirlineCodes[0];

  return {
    id: offer.id,
    price: parseFloat(offer.price.total),
    currency: offer.price.currency,
    airline: AIRLINE_NAMES[airline] || airline,
    departure: {
      time: firstSegment.departure.at,
      airport: firstSegment.departure.iataCode,
    },
    arrival: {
      time: lastSegment.arrival.at,
      airport: lastSegment.arrival.iataCode,
    },
    duration: offer.itineraries[0].duration,
    stops: offer.itineraries[0].segments.length - 1,
    rawOffer: offer,
  };
}

export async function searchFlights(params: SearchParams): Promise<Flight[]> {
  try {
    console.log('Starting flight search with params:', {
      origin: params.origin,
      destination: params.destination,
      departureDate: params.departureDate,
      returnDate: params.returnDate || 'N/A',
      passengers: params.passengers,
      cabinClass: params.cabinClass,
    });

    const accessToken = await getAccessToken();
    console.log("Access Token: ", accessToken);

    const searchParams = new URLSearchParams({
      originLocationCode: params.origin,
      destinationLocationCode: params.destination,
      departureDate: params.departureDate,
      adults: params.passengers.toString(),
      max: '250',
    });

    if (params.returnDate) {
      searchParams.append('returnDate', params.returnDate);
    }

    const searchUrl = `${AMADEUS_SEARCH_URL}?${searchParams.toString()}`;
    console.log('Calling Amadeus API...');

    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Flight search error:', response.status, errorData);
      throw new Error(`Flight search failed: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const responseData: AmadeusResponse = await response.json();
    console.log('Flight search response received');

    if (!responseData.data || responseData.data.length === 0) {
      console.warn('No flights found for the given search parameters');
      return [];
    }

    return responseData.data.map(mapAmadeusToFlight).slice(0, 25);
  } catch (error) {
    console.error('Search flights error:', error);
    throw error;
  }
}
