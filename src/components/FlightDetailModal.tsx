import { ChevronLeftCircle, Plane } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AmadeusFlightOffer } from '../types/api';
import type { Flight } from '../types/flight';
import { useFlightSearch } from '../context/FlightSearchContext';

interface FlightDetailModalProps {
    flightOffer: AmadeusFlightOffer;
    flightData?: Flight;
}

export function FlightDetailModal({ flightOffer, flightData }: FlightDetailModalProps) {
    const { setSelectedFlight } = useFlightSearch();

    const formatTime = (isoString: string) => {
        return new Date(isoString).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatDuration = (duration: string) => {
        const match = duration.match(/PT(\d+)H(\d+)M/);
        if (match) {
            return `${match[1]} hr ${match[2]} min`;
        }
        return duration;
    };

    const segment = flightOffer.itineraries[0].segments[0];
    const travelerPricing = flightOffer.travelerPricings[0];
    const segmentPricing = travelerPricing.fareDetailsBySegment[0];

    const departureTime = flightData?.departure.time || segment.departure.at;
    const arrivalTime = flightData?.arrival.time || segment.arrival.at;
    const airline = flightData?.airline || flightOffer.validatingAirlineCodes[0];
    const price = flightData?.price || parseFloat(flightOffer.price.total);
    const duration = formatDuration(segment.duration);
    const stops = flightData?.stops ;
    
    console.log("fees from pricing: ", flightOffer.price.fees)
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-gray-900/70 z-50 flex items-end md:items-stretch justify-center md:justify-end"
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hidden md:block flex-1"
                    onClick={() => setSelectedFlight(null)}
                />

                <motion.div
                    initial={{ y: '100%', x: '0%' }}
                    animate={{
                        y: '0%',
                        x: '0%'
                    }}
                    exit={{ y: '100%' }}
                    transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 300
                    }}
                    className="md:hidden w-full"
                >
                    <div className="bg-gray-50 w-full h-screen md:h-auto overflow-y-auto shadow-xl">
                        <div className="sticky top-0 bg-blue-950 border-b border-gray-200 p-4 md:p-6 flex items-center justify-between">
                            <button
                                onClick={() => setSelectedFlight(null, null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ChevronLeftCircle size={24} className="text-gray-100" />
                            </button>
                            <h2 className="text-xl md:text-2xl font-semibold text-gray-100">Flight Details</h2>
                            <div className="w-10"></div>
                        </div>

                        <div className="p-4 space-y-4">
                            <div className="grid grid-cols-3 gap-2 items-center bg-gray-100 p-4 rounded-2xl">
                                <div className="text-center">
                                    <div className="text-lg font-semibold text-gray-900">
                                        {formatTime(departureTime)}
                                    </div>
                                    <div className="text-xs text-gray-600">{flightData?.departure.airport}</div>
                                    <div className="text-[10px] text-gray-500">{formatDate(departureTime)}</div>
                                    {segment.departure.terminal && (
                                        <div className="text-[10px] text-gray-500">Terminal: {segment.departure.terminal}</div>
                                    )}
                                </div>

                                <div className="flex flex-col items-center flex-1 max-w-xs">
                                    <div className="text-xs md:text-sm text-gray-600 mb-1">
                                        {duration}
                                    </div>
                                    <div className="w-full flex items-center justify-center gap-1">
                                        <div className="flex-1 h-px bg-gray-300"></div>
                                        <Plane size={14} className="text-gray-400 flex-shrink-0" />
                                        <div className="flex-1 h-px bg-gray-300"></div>
                                    </div>
                                    <div className="text-xs md:text-sm text-gray-600 mt-1">
                                        {stops === 0 ? 'Nonstop' : `${stops} stop${stops > 1 ? 's' : ''}`}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-semibold text-gray-900">
                                        {formatTime(arrivalTime)}
                                    </div>
                                    <div className="text-xs text-gray-600">{flightData?.arrival.airport}</div>
                                    <div className="text-[10px] text-gray-500">{formatDate(arrivalTime)}</div>
                                    {segment?.arrival.terminal && (
                                        <div className="text-[10px] text-gray-500">Terminal: {segment?.arrival.terminal}</div>
                                    )}
                                </div>
                            </div>

                            {/* Airline & Flight Info */}
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <h3 className="text-xs font-semibold text-gray-600 mb-1">Airline</h3>
                                    <div className="text-sm font-semibold text-gray-900">
                                        {airline}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Flight {segment.number}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {segment.aircraft?.code || 'N/A'}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs font-semibold text-gray-600 mb-1">Cabin</h3>
                                    <div className="text-sm font-semibold text-gray-900 capitalize">
                                        {segmentPricing.cabin}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Class {segmentPricing.class}
                                    </div>
                                </div>
                            </div>

                            {/* Baggage Information */}
                            <div className="text-sm">
                                <h3 className="text-xs font-semibold text-gray-600 mb-2">Baggage</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-gray-900">
                                            {segmentPricing.includedCheckedBags?.quantity || 0}
                                        </span>
                                        <span className="text-xs text-gray-600">Checked</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-gray-900">
                                            {segmentPricing.includedCabinBags?.quantity || 1}
                                        </span>
                                        <span className="text-xs text-gray-600">Cabin</span>
                                    </div>
                                </div>
                            </div>

                            {/* Fare Information */}
                            <div className="text-sm">
                                <h3 className="text-xs font-semibold text-gray-600 mb-2">Price</h3>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-600">Base</span>
                                        <span className="font-semibold text-gray-900">
                                            {flightOffer.price.currency} {flightOffer.price.base}
                                        </span>
                                    </div>
                                    {flightOffer.price.fees && flightOffer.price.fees.length > 0 && (
                                        <>
                                            {flightOffer.price.fees.map((fee, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-xs">
                                                    <span className="text-gray-600 capitalize">{fee.type}</span>
                                                    <span className="font-semibold text-gray-900">
                                                        {flightOffer.price.currency} {fee.amount}
                                                    </span>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                    <div className="flex justify-between items-center py-2 border-t border-gray-200 text-sm font-bold">
                                        <span className="text-gray-900">Total</span>
                                        <span className="text-blue-600">
                                            {flightData?.currency || flightOffer.price.currency} {price.toFixed(0)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Passenger Info */}
                            <div className="text-sm">
                                <h3 className="text-xs font-semibold text-gray-600 mb-2">Passenger</h3>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-600">Type</span>
                                        <span className="font-semibold text-gray-900 capitalize">
                                            {travelerPricing.travelerType}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-600">Fare</span>
                                        <span className="font-semibold text-gray-900 capitalize">
                                            {travelerPricing.fareOption}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => setSelectedFlight(null, null)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold text-sm rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-700 transition-colors">
                                    Book
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Desktop version - Slide from right */}
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: '0%' }}
                    exit={{ x: '100%' }}
                    transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 300
                    }}
                    className="hidden md:flex flex-col h-screen w-full max-w-lg"
                >
                    <div className="bg-gray-50 h-screen overflow-y-auto shadow-xl">
                        {/* Header */}
                        <div className="sticky top-0 bg-gray-50 border-b border-gray-200 p-6 flex items-center justify-between">
                            <button
                                onClick={() => setSelectedFlight(null, null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ChevronLeftCircle size={24} className="text-gray-700" />
                            </button>
                            <h2 className="text-2xl font-semibold text-gray-900">Flight Details</h2>
                            <div className="w-10"></div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            {/* Flight Route & Duration */}
                            <div className="grid grid-cols-3 gap-4 items-center bg-gray-100 p-4 rounded-2xl">
                                {/* Departure */}
                                <div className="text-center">
                                    <div className="text-lg font-semibold text-gray-900">
                                        {formatTime(departureTime)}
                                    </div>
                                    <div className="text-xs text-gray-600">{flightData?.departure.airport}</div>
                                    <div className="text-[10px] text-gray-500">{formatDate(departureTime)}</div>
                                    {segment.departure.terminal && (
                                        <div className="text-[10px] text-gray-500">Terminal: {segment.departure.terminal}</div>
                                    )}
                                </div>

                                {/* Journey */}
                                <div className="flex flex-col items-center flex-1 max-w-xs">
                                    <div className="text-xs md:text-sm text-gray-600 mb-1">
                                        {duration}
                                    </div>
                                    <div className="w-full flex items-center justify-center gap-1">
                                        <div className="flex-1 h-px bg-gray-300"></div>
                                        <Plane size={14} className="text-gray-400 flex-shrink-0" />
                                        <div className="flex-1 h-px bg-gray-300"></div>
                                    </div>
                                    <div className="text-xs md:text-sm text-gray-600 mt-1">
                                        {stops === 0 ? 'Nonstop' : `${stops} stop${stops > 1 ? 's' : ''}`}
                                    </div>
                                </div>

                                {/* Arrival */}
                                <div className="text-center">
                                    <div className="text-lg font-semibold text-gray-900">
                                        {formatTime(arrivalTime)}
                                    </div>
                                    <div className="text-xs text-gray-600">{flightData?.arrival.airport}</div>
                                    <div className="text-[10px] text-gray-500">{formatDate(arrivalTime)}</div>
                                    {segment?.arrival.terminal && (
                                        <div className="text-[10px] text-gray-500">Terminal: {segment?.arrival.terminal}</div>
                                    )}
                                </div>
                            </div>

                            {/* Airline & Flight Info */}
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <h3 className="text-xs font-semibold text-gray-600 mb-1">Airline</h3>
                                    <div className="text-sm font-semibold text-gray-900">
                                        {airline}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Flight {segment.number}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {segment.aircraft?.code || 'N/A'}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs font-semibold text-gray-600 mb-1">Cabin</h3>
                                    <div className="text-sm font-semibold text-gray-900 capitalize">
                                        {segmentPricing.cabin}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Class {segmentPricing.class}
                                    </div>
                                </div>
                            </div>

                            {/* Baggage Information */}
                            <div className="text-sm">
                                <h3 className="text-xs font-semibold text-gray-600 mb-2">Baggage</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-gray-900">
                                            {segmentPricing.includedCheckedBags?.quantity || 0}
                                        </span>
                                        <span className="text-xs text-gray-600">Checked</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-gray-900">
                                            {segmentPricing.includedCabinBags?.quantity || 1}
                                        </span>
                                        <span className="text-xs text-gray-600">Cabin</span>
                                    </div>
                                </div>
                            </div>

                            {/* Fare Information */}
                            <div className="text-sm">
                                <h3 className="text-xs font-semibold text-gray-600 mb-2">Price</h3>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-600">Base</span>
                                        <span className="font-semibold text-gray-900">
                                            {flightOffer.price.currency} {flightOffer.price.base}
                                        </span>
                                    </div>
                                    {flightOffer.price.fees && flightOffer.price.fees.length > 0 && (
                                        <>
                                            {flightOffer.price.fees.map((fee, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-xs">
                                                    <span className="text-gray-600 capitalize">{fee.type}</span>
                                                    <span className="font-semibold text-gray-900">
                                                        {flightOffer.price.currency} {fee.amount}
                                                    </span>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                    <div className="flex justify-between items-center py-2 border-t border-gray-200 text-sm font-bold">
                                        <span className="text-gray-900">Total</span>
                                        <span className="text-blue-600">
                                            {flightData?.currency || flightOffer.price.currency} {price.toFixed(0)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Passenger Info */}
                            <div className="text-sm">
                                <h3 className="text-xs font-semibold text-gray-600 mb-2">Passenger</h3>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-600">Type</span>
                                        <span className="font-semibold text-gray-900 capitalize">
                                            {travelerPricing.travelerType}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-600">Fare</span>
                                        <span className="font-semibold text-gray-900 capitalize">
                                            {travelerPricing.fareOption}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons - Desktop optimized */}
                            <div className="flex gap-2 pt-2 sticky bottom-0 bg-gray-50 pb-4">
                                <button
                                    onClick={() => setSelectedFlight(null, null)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold text-sm rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Close
                                </button>
                                <button className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-700 transition-colors">
                                    Book
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}