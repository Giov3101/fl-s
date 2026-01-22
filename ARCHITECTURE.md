# Flight Search Engine MVP - Architecture

## Folder Structure

```
src/
├── types/
│   ├── flight.ts        # Domain types (Flight, SearchParams)
│   ├── api.ts           # API response types (Amadeus format)
│   └── filters.ts       # Filter state types
├── services/
│   └── flightApi.ts     # API calls + mock data + mapper
├── utils/
│   └── filterFlights.ts # Client-side filtering logic
├── context/
│   └── FlightSearchContext.tsx  # Global state management
├── components/
│   ├── SearchForm.tsx
│   ├── FlightList.tsx
│   ├── FlightCard.tsx
│   ├── Filters.tsx
│   └── PriceChart.tsx
└── App.tsx
```

## Key Patterns

### State Management
- Single Context holds flights, filters, loading state
- All components consume via `useFlightSearch()` hook
- Filters update immediately, no debouncing

### Type Safety
- API types separated from domain types
- Mapper converts Amadeus response to clean Flight model
- No `any` types used

### Data Flow
1. User searches → `FlightSearchContext.search()`
2. API call → mock Amadeus data
3. Mapper normalizes to `Flight[]`
4. Stored in context
5. Filters applied client-side
6. Components render filtered results

## Mock Data
Uses realistic Amadeus API structure. Replace `searchFlights()` in `flightApi.ts` with real API when ready.

## Next Steps
- Swap mock API for real Amadeus integration
- Add sorting (price, duration, etc.)
- Persist filters in URL params
- Add more filter options
