import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFlightSearch } from '../context/FlightSearchContext';
import { Search } from 'lucide-react'

export function PriceChart() {
  const { filteredFlights, hasSearched } = useFlightSearch();

  if (!hasSearched || filteredFlights.length === 0)
    return (
      <div className="hidden md:block p-20 text-center bg-blue-950 rounded-2xl">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
          <Search size={24} className="text-gray-600" />
        </div>
        <p className="text-gray-100 font-medium">Price insights will appear here</p>
        <p className="text-gray-100 text-sm mt-1">Search for flights to track and compare prices</p>
      </div>
    );

  const priceRanges = [
    { range: '$0-200', min: 0, max: 200 },
    { range: '$200-400', min: 200, max: 400 },
    { range: '$400-600', min: 400, max: 600 },
    { range: '$600-800', min: 600, max: 800 },
    { range: '$800+', min: 800, max: Infinity },
  ];

  const chartData = priceRanges.map(({ range, min, max }) => ({
    range,
    count: filteredFlights.filter(f => f.price >= min && f.price < max).length,
  }));

  const avgPrice = Math.round(
    filteredFlights.reduce((sum, f) => sum + f.price, 0) / filteredFlights.length
  );
  const minPrice = Math.min(...filteredFlights.map(f => f.price));
  console.log("Has searched value: ", hasSearched)

  return (
    // <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
    <div className="pt-6">
      <h3 className="text-base font-medium text-gray-900 mb-4">Price insights</h3>

      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
        <div>
          <div className="text-xs text-gray-600 mb-1">Lowest</div>
          <div className="text-xl font-normal text-gray-900">${minPrice.toFixed(0)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-600 mb-1">Average</div>
          <div className="text-xl font-normal text-gray-900">${avgPrice.toFixed(0)}</div>
        </div>
      </div>

      <div className="w-full h-48 md:h-64 min-h-64">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="range" tick={{ fontSize: 11 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
              }}
              cursor={{ fill: 'rgba(37, 99, 235, 0.05)' }}
            />
            <Bar dataKey="count" fill="#1a73e8" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
