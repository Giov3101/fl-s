import { useState, FormEvent } from 'react';
import { ArrowRightLeft, Circle, MapPin, Calendar, Users, Plane, ChevronDown } from 'lucide-react';
import { Select, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useFlightSearch } from '../context/FlightSearchContext';
import type { SearchParams } from '../types/flight';

const { RangePicker } = DatePicker

export function SearchForm() {
  const { search, isLoading } = useFlightSearch();
  const [params, setParams] = useState<SearchParams>({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    cabinClass: 'economy',
    tripType: 'roundtrip',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (params.origin && params.destination && params.departureDate) {
      search(params);
    }
  };

  const handleSwapLocations = () => {
    setParams({ ...params, origin: params.destination, destination: params.origin });
  };

  const today = new Date().toISOString().split('T')[0];

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const passengerLabel = `${params.passengers} ${params.passengers === 1 ? 'Passenger' : 'Passengers'}`;
  const cabinLabel = params.cabinClass.replace('_', ' ');
  const combinedLabel = `${passengerLabel}, ${cabinLabel}`;

  return (
    <form onSubmit={handleSubmit}>
      <div className=''>
        <div className="py-6">
          <div className="relative inline-block mb-6 text-sm">
            <Select
              value={params.tripType}
              onChange={(value) => setParams({ ...params, tripType: value })}
              options={[
                { label: "One way", value: "oneway" },
                { label: "Round trip", value: "roundtrip" },
              ]}
              className="w-32 bg-transparent border-white text-white "
            />
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0 rounded-xl overflow-hidden">
            <div className="md:col-span-3 md:pr-1 mb-1 border-b border-gray-300 md:border-none relative">
              <input
                type="text"
                value={params.origin}
                onChange={(e) => setParams({ ...params, origin: e.target.value.toUpperCase() })}
                placeholder="Where from?"
                maxLength={3}
                className="w-full pl-10 pr-4 py-4 md:py-8 text-base focus:outline-none focus:bg-gray-50 placeholder-gray-300 rounded-none"
                required
              />
              <Circle size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <button
                type="button"
                onClick={handleSwapLocations}
                className="absolute right-2 bottom-[-70%] md:bottom-0 md:top-1/2 -translate-y-1/2 md:right-auto md:left-full md:-translate-x-1/2 p-2 bg-white border-2 border-blue-950 rounded-full hover:bg-gray-50 z-10 rotate-90 md:rotate-0"
              >
                <ArrowRightLeft size={16} className="text-gray-600" />
              </button>
            </div>

            <div className="md:col-span-3 md:pr-1 mb-1 relative">
              <input
                type="text"
                value={params.destination}
                onChange={(e) => setParams({ ...params, destination: e.target.value.toUpperCase() })}
                placeholder="Where to?"
                maxLength={3}
                className="w-full pl-10 pr-4 md:pl-12 py-3 md:py-8 text-base focus:outline-none focus:bg-gray-50 placeholder-gray-300 rounded-none"
                required
              />
              <MapPin size={16} className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <div className="md:col-span-3 md:pr-1 mb-1">
              {params.tripType === 'oneway' ? (
                <div className='relative'>
                  <DatePicker
                    value={params.departureDate ? dayjs(params.departureDate) : null}
                    onChange={(date) => setParams({ ...params, departureDate: date ? date.format('YYYY-MM-DD') : '' })}
                    minDate={dayjs(today)}
                    className="w-full pl-10 pr-3 py-3 md:py-8 text-base focus:outline-none focus:bg-gray-50 rounded-none"
                  />
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              ) : (
                <>
                  <div className="hidden md:block">
                    <RangePicker
                      value={params.departureDate && params.returnDate ? [dayjs(params.departureDate), dayjs(params.returnDate)] : null}
                      onChange={(dates) => {
                        if (dates && dates.length === 2 && dates[0] && dates[1]) {
                          setParams({ ...params, departureDate: dates[0].format('YYYY-MM-DD'), returnDate: dates[1].format('YYYY-MM-DD') });
                        }
                      }}
                      minDate={dayjs(today)}
                      className="w-full pl-10 pr-3 py-3 md:py-8 text-base focus:outline-none focus:bg-gray-50 rounded-none"
                    />
                  </div>
                  <div className="flex flex-col md:hidden space-y-1">
                    <div className='relative'>
                      <DatePicker
                        value={params.departureDate ? dayjs(params.departureDate) : null}
                        onChange={(date) => setParams({ ...params, departureDate: date ? date.format('YYYY-MM-DD') : '' })}
                        minDate={dayjs(today)}
                        className="w-full pl-10 pr-3 py-3 text-base focus:outline-none focus:bg-gray-50 rounded-none"
                      />
                      <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    <div className='relative'>
                      <DatePicker
                        value={params.returnDate ? dayjs(params.returnDate) : null}
                        onChange={(date) => setParams({ ...params, returnDate: date ? date.format('YYYY-MM-DD') : '' })}
                        minDate={dayjs(params.departureDate || today)}
                        className="w-full pl-10 pr-3 py-3 text-base focus:outline-none focus:bg-gray-50 rounded-none"
                      />
                      <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="md:col-span-2 md:pr-1 relative">
              <Select
                value={combinedLabel}
                open={dropdownOpen}
                onOpenChange={setDropdownOpen}
                options={[]}
                className="md:w-full w-full pl-10 pr-3 py-3 md:py-8 text-base focus:outline-none focus:bg-gray-50 rounded-none"
                popupRender={() => (
                  <div className="p-2">
                    <div className="mb-4 border-b pb-4">
                      <div className="flex items-center justify-between space-x-3">
                        <span className="font-medium">Passengers</span>
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={() => setParams({ ...params, passengers: Math.max(1, params.passengers - 1) })}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{params.passengers}</span>
                          <button
                            type="button"
                            onClick={() => setParams({ ...params, passengers: Math.min(6, params.passengers + 1) })}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium mb-2">Cabin Class</div>
                      {[
                        { label: "Economy", value: "economy" as const },
                        { label: "Premium Economy", value: "premium_economy" as const },
                        { label: "Business", value: "business" as const },
                        { label: "First", value: "first" as const },
                      ].map((option) => (
                        <div
                          key={option.value}
                          onClick={() => {
                            setParams({ ...params, cabinClass: option.value });
                            setDropdownOpen(false);
                          }}
                          className="p-2 cursor-pointer hover:bg-gray-100 rounded flex items-center"
                        >
                          <Plane size={16} className="text-gray-400" />
                          <span>{option.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              />
              <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <div className="hidden md:block md:col-span-1">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-full px-3 py-3 md:py-8 bg-blue-600 text-white flex justify-center items-center rounded-none md:rounded-r-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium text-sm transition-colors"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='md:hidden'>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-32 py-3 md:py-8 bg-blue-600 text-white flex justify-center rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium text-sm flex items-center gap-2 transition-colors"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
}