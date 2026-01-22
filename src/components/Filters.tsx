import { useFlightSearch } from '../context/FlightSearchContext';
import { getUniqueAirlines, getMaxPrice } from '../utils/filterFlights';
import { Select, Checkbox } from 'antd';

export function Filters() {
  const { flights, filters, updateFilters, hasSearched } = useFlightSearch();

  if (!hasSearched || flights.length === 0) return null;

  const airlines = getUniqueAirlines(flights);
  const maxPossiblePrice = getMaxPrice(flights);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-4">
          <div className='md:col-span-2'>
            <h3 className="text-base font-medium text-gray-900 mb-4">Max price</h3>
            <div className="mb-2">
              <span className="text-2xl font-normal text-gray-900">
                ${filters.maxPrice.toFixed(0)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={maxPossiblePrice}
              step="10"
              value={filters.maxPrice}
              onChange={(e) => updateFilters({ maxPrice: Number(e.target.value) })}
              className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="md:col-span-1">
            <h3 className="text-base font-medium text-gray-900 mb-2">Stops</h3>
            <Select
              mode="multiple"
              value={filters.stops}
              onChange={(value) => updateFilters({ stops: value })}
              options={[
                { label: 'Nonstop', value: 0 },
                { label: '1 stop', value: 1 },
                { label: '2 stops', value: 2 },
              ]}
              className="w-full"
              placeholder="Select stops"
              optionLabelProp="label"
              renderOption={(option) => (
                <div>
                  <Checkbox checked={filters.stops.includes(option.data.value)} />
                  <span className="ml-2">{option.data.label}</span>
                </div>
              )}
            />
          </div>

          <div className="md:col-span-1">
            <h3 className="text-base font-medium text-gray-900 mb-2">Airlines</h3>
            <Select
              mode="multiple"
              value={filters.airlines}
              onChange={(value) => updateFilters({ airlines: value })}
              options={airlines.map(airline => ({ label: airline, value: airline }))}
              className="w-full"
              placeholder="Select airlines"
              optionLabelProp="label"
              renderOption={(option) => (
                <div>
                  <Checkbox checked={filters.airlines.includes(option.data.value)} />
                  <span className="ml-2">{option.data.label}</span>
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}