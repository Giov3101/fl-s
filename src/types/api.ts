export interface AmadeusFlightOffer {
  id: string;
  itineraries: Array<{
    segments: Array<{
      departure: {
        iataCode: string;
        terminal: string;
        at: string;
      };
      arrival: {
        iataCode: string;
        terminal: string;
        at: string;
      };
      carrierCode: string;
      duration: string;
      number: string;
      aircraft: {
        code: string;
      }
    }>;
    duration: string;
  }>;
  validatingAirlineCodes: string[];
  price: {
    total: string;
    base: string;
    currency: string;
    fees: Array<{
      amount: string,
      type: string
    }>
  }
  travelerPricings: Array<{
    fareOption: string,
    travelerType: string
    fareDetailsBySegment: Array<{
      cabin: string,
      fareBasis: string,
      class: string,
      includedCheckedBags: {
        quantity: number
      },
      includedCabinBags: {
        quantity: number
      }
    }>
  }>
}

export interface AmadeusResponse {
  data: AmadeusFlightOffer[];
}
