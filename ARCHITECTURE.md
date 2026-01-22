# Flight Search Engine MVP - Architecture

## Project Overview

**Flight Search Engine MVP** is a React-based flight search application that allows users to search for flights, filter results, and view detailed flight information. It integrates with the Amadeus flight search API to provide real-world flight data and includes client-side filtering, price visualization, and a responsive UI built with Tailwind CSS.

**Tech Stack:**
- **Frontend:** React 18.3.1, TypeScript 5.5.3, Vite 5.4.2
- **Styling:** Tailwind CSS 3.4.1, PostCSS 8.4.35
- **UI Components:** Ant Design 6.2.1, Lucide React 0.344.0
- **Charting:** Recharts 3.6.0
- **Animation:** Framer Motion 12.28.1
- **State Management:** React Context API
- **Linting:** ESLint 9.9.1 with TypeScript support

## Project Structure

```
fl-s/
├── src/
│   ├── types/
│   │   ├── flight.ts           # Domain types (Flight, SearchParams)
│   │   ├── api.ts              # API response types (Amadeus format)
│   │   └── filters.ts          # Filter state types (FiltersState)
│   ├── services/
│   │   └── flightApi.ts        # Amadeus API integration + auth + mapper
│   ├── utils/
│   │   └── filterFlights.ts    # Client-side flight filtering logic
│   ├── context/
│   │   └── FlightSearchContext.tsx  # Global state management
│   ├── components/
│   │   ├── SearchForm.tsx      # Main search input form
│   │   ├── FlightList.tsx      # Flight results list
│   │   ├── FlightCard.tsx      # Individual flight card component
│   │   ├── Filters.tsx         # Filter sidebar (price, stops, airlines)
│   │   ├── PriceChart.tsx      # Price distribution bar chart
│   │   ├── FlightDetailModal.tsx  # Full flight details modal
│   │   └── ui/
│   │       └── CustomSelect.tsx    # Reusable custom select component
│   ├── App.tsx                 # Main app layout and component tree
│   ├── main.tsx                # React entry point
│   └── index.css               # Global styles
├── index.html                  # HTML template
├── vite.config.ts              # Vite build configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Project dependencies
├── postcss.config.js           # PostCSS configuration
└── ARCHITECTURE.md             # This file
```

## Type System

### Flight Model (`src/types/flight.ts`)
```typescript
interface Flight {
  id: string;
  price: number;
  currency: string;
  airline: string;
  departure: { time: string; airport: string };
  arrival: { time: string; airport: string };
  duration: string;
  stops: number;
  rawOffer?: AmadeusFlightOffer;
}

interface SearchParams {
  origin: string;                    // IATA code (3 chars)
  destination: string;               // IATA code (3 chars)
  departureDate: string;             // YYYY-MM-DD
  returnDate?: string;               // Optional, for round trips
  passengers: number;
  cabinClass: 'economy' | 'premium_economy' | 'business' | 'first';
  tripType: 'roundtrip' | 'oneway';
}
```

### API Types (`src/types/api.ts`)
- `AmadeusFlightOffer`: Represents the full Amadeus flight offer structure including itineraries, pricing, and traveler pricing details
- `AmadeusResponse`: Wrapper containing array of flight offers
- Includes nested structures for segments, departure/arrival info, pricing breakdown, and baggage

### Filter Types (`src/types/filters.ts`)
```typescript
interface FiltersState {
  maxPrice: number;      // Maximum price filter
  stops: number[];       // Array of stop counts to include (0, 1, 2)
  airlines: string[];    // Array of airline names to include
}
```

## State Management

### FlightSearchContext (`src/context/FlightSearchContext.tsx`)

**Context State:**
- `flights`: Array of all search results
- `filteredFlights`: Results after applying client-side filters
- `filters`: Current filter state (price, stops, airlines)
- `isLoading`: Search in progress flag
- `hasSearched`: Whether a search has been performed
- `searchParams`: Last used search parameters
- `selectedFlight`: Currently selected flight offer for modal display
- `selectedFlightData`: Mapped flight data for modal display

**Context Methods:**
- `search(params: SearchParams)`: Execute flight search via API
  - Fetches from Amadeus API
  - Maps responses to Flight model
  - Updates max price filter based on results
  
- `updateFilters(filters: Partial<FiltersState>)`: Update active filters (immediate effect)

- `resetFilters()`: Reset filters to full range of current search results

- `setSelectedFlight(flight, flightData)`: Set flight for modal display

**Hook Usage:**
```typescript
const { flights, filteredFlights, filters, search, updateFilters } = useFlightSearch();
```
All components use the `useFlightSearch()` hook to access context.

## Data Flow

1. **Search Initialization:**
   - User fills SearchForm with origin, destination, dates, passengers
   - Form submission calls `search()` context method
   - Loading state set to true

2. **API Call:**
   - `flightApi.ts` gets access token from Amadeus OAuth2 endpoint
   - Token cached with 30-minute expiry
   - Flight search request sent with query parameters
   - Amadeus returns array of AmadeusFlightOffer objects

3. **Data Transformation:**
   - `mapAmadeusToFlight()` normalizes each offer to Flight model
   - Extracts first/last segment times for departure/arrival
   - Calculates stops from segment count
   - Maps airline code to full airline name
   - Limits results to 25 flights
   - Stored in context state

4. **Client-Side Filtering:**
   - `filterFlights()` applies active filters to all results
   - Filters run on every filter update (no debouncing)
   - `getMaxPrice()` calculates maximum price for slider range

5. **Component Rendering:**
   - FlightList renders filteredFlights sorted by price
   - PriceChart visualizes price distribution
   - Filters display available airlines and max price slider
   - FlightCard shows abbreviated flight info with select button
   - Modal shows full details on card selection

## Key Components

### SearchForm
- **Input fields:** Origin/destination IATA codes, departure/return dates, passenger count, cabin class, trip type
- **Features:** 
  - Swap origin/destination button
  - Date range picker for round trips
  - Dropdown for passengers and cabin class
  - Form validation
- **Output:** Calls `search()` with SearchParams

### FlightList
- **States:** Loading, no search, no results, results list
- **Features:**
  - Auto-sorts by price (lowest first)
  - Shows "Best departing flight" badge on cheapest
  - Result count display
- **Child:** FlightCard for each result

### FlightCard
- **Displays:** Departure time/airport, arrival time/airport, duration, stops, airline, price
- **Interaction:** Select button opens FlightDetailModal
- **Styling:** Responsive grid layout, hover effects

### Filters
- **Visibility:** Only shows after search with results
- **Components:**
  - Price slider (0 to max price, step 10)
  - Multi-select for stops (Nonstop, 1 stop, 2 stops)
  - Multi-select for airlines (dynamically populated)
- **Updates:** Immediate filter application on change

### PriceChart
- **Visualization:** Bar chart with 5 price ranges ($0-200, $200-400, etc.)
- **Metrics:** Lowest and average price display
- **Responsiveness:** Hidden on mobile, sticky on desktop

### FlightDetailModal
- **Display:** Slide-in modal (bottom on mobile, right side on desktop)
- **Content:**
  - Full flight itinerary with departure/arrival details
  - Terminal information
  - Airline and flight number
  - Cabin class details
  - Baggage allowance (checked + cabin bags)
  - Price breakdown (base + fees)
- **Animation:** Framer Motion smooth slide/fade transitions
- **Interaction:** Click overlay or back button to close

### CustomSelect
- **Generic component** for dropdown selections
- **Features:** Chevron icon, keyboard-friendly, click outside to close
- **Usage:** Trip type, passengers, cabin class selections

## API Integration

### Amadeus API (`src/services/flightApi.ts`)

**Authentication:**
- OAuth2 flow with client credentials grant
- Access token obtained from `https://test.api.amadeus.com/v1/security/oauth2/token`
- Token cached with expiry time (30 minutes default)
- Credentials from environment variables: `VITE_API_KEY`, `VITE_API_SECRET`

**Search Endpoint:**
- `https://test.api.amadeus.com/v2/shopping/flight-offers`
- Query parameters:
  - `originLocationCode`: IATA code
  - `destinationLocationCode`: IATA code
  - `departureDate`: YYYY-MM-DD
  - `returnDate`: Optional, YYYY-MM-DD
  - `adults`: Passenger count
  - `max`: Result limit (set to 250, returned limited to 25)

**Error Handling:**
- Token fetch failures logged and thrown
- API response errors logged with status and details
- Empty results handled gracefully
- Network errors propagated to components

**Data Mapping:**
- `mapAmadeusToFlight()` converts AmadeusFlightOffer to Flight
- Extracts key info from first itinerary segment
- Maps airline codes to full names (AA→American Airlines, etc.)
- ISO8601 durations parsed (PT2H30M → "2 hr 30 min")

## Client-Side Filtering

### Filter Logic (`src/utils/filterFlights.ts`)

**filterFlights(flights, filters):**
- Filters out flights exceeding maxPrice
- If stops array specified, only includes matching stop counts
- If airlines array specified, only includes matching airlines
- Returns all flights if no filters applied

**Helper Functions:**
- `getUniqueAirlines(flights)`: Extract and sort unique airline names
- `getMaxPrice(flights)`: Find maximum price for slider max value

## Styling and UI

### Framework: Tailwind CSS
- Utility-first CSS approach
- Responsive breakpoints (md: 768px)
- Custom color theme (blue-950, blue-600, gray scale)
- Mobile-first design

### Layout Structure:
- Hero section with branding (Plane icon + headline)
- SearchForm in blue header
- Two-column responsive grid:
  - Mobile: Filters + results stacked, chart hidden
  - Desktop: Results left (col-span-3), Chart/Filters right (col-span-2)
- Sticky price chart on desktop

### Component Libraries:
- **Ant Design:** Select dropdowns with checkboxes
- **Lucide React:** Icons (Plane, MapPin, Calendar, ChevronDown, etc.)
- **Recharts:** Price distribution bar chart
- **Framer Motion:** Modal slide/fade animations

## Key Patterns

### Type Safety
- Strict TypeScript throughout (noEmit checking enabled)
- API types separated from domain types
- No use of `any` type
- Mapper pattern isolates API response complexity

### Error Handling
- Console logging for debugging
- API errors caught and logged with context
- Loading states prevent user interaction during requests
- Empty results handled with helpful messages

### Performance
- Token caching reduces auth requests
- Client-side filtering is instant (no debouncing)
- Flight results limited to 25 items
- Responsive images and lazy components

### User Experience
- Loading indicators during search
- Empty state messages (before search, no results)
- Price badge highlighting best deals
- Responsive design for mobile/tablet/desktop
- Smooth animations with Framer Motion
- Result sorting by price (cheapest first)

## Environment Variables

Required in `.env`:
```
VITE_API_KEY=<Amadeus API key>
VITE_API_SECRET=<Amadeus API secret>
```

## Development Setup

**Install dependencies:**
```bash
npm install
```

**Development server:**
```bash
npm run dev
```
- Runs on http://localhost:5173 (Vite default)

**Build for production:**
```bash
npm run build
```

**Type checking:**
```bash
npm run typecheck
```

**Linting:**
```bash
npm run lint
```

## Future Enhancements

### Immediate Priorities
- [ ] Real Amadeus API integration verification
- [ ] Add sorting options (price, duration, departure time)
- [ ] Persist search/filter state in URL query parameters
- [ ] Add return flight details to round-trip searches
- [ ] Expand filter options (departure/arrival time, airline alliances)

### Medium-term Features
- [ ] Flight booking integration
- [ ] User saved searches/favorites
- [ ] Price alerts and notifications
- [ ] Multi-city search support
- [ ] Advanced filters (flight stops details, specific airlines)

### Technical Improvements
- [ ] Implement pagination for large result sets
- [ ] Add caching layer for repeated searches
- [ ] Optimize chart rendering with memoization
- [ ] Add error boundary components
- [ ] Implement offline capability with service workers

## Testing Considerations

- Unit tests for `filterFlights()` utility
- Integration tests for API token caching
- Component tests for SearchForm and FlightCard
- E2E tests for complete search flow
- Mock Amadeus API responses for testing

## Browser Compatibility

- Modern browsers supporting ES2020+
- React 18.3 compatible browsers
- No IE11 support
