import React from 'react'
import { useRouter } from 'next/dist/client/components/navigation';

interface Flight {
    id: string;
    flightName: string;
    from: string;
    to: string;
    departureTime: string;
    arrivalTime: string;
    price: number;
    availableSeats: number;
    bussinesseats: boolean[][];
    economicseats: boolean[][];
    priceHistory?: { price: number; timestamp: string }[];
}

interface recommandFlights {
    item: Flight;
    reason: string;
}

export default function ReccomandFlight({ flight }: { flight: recommandFlights[] }) {
    const router = useRouter();
    return (
        <div>

            {!flight || flight.length === 0 ? (
                <p className="text-gray-500">No flight recommendations available.</p>
            ) : (<>
                <h2 className="font-bold mt-16 text-xl text-white mb-8">Recommended Flights for you</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
                {flight.map(({ item }, index) => <>
                    <div
                        key={index}
                        onClick={() => router.push(`/book-flight/${item.id}`)}
                        className="cursor-pointer w-[350px] bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition transform hover:scale-105 flex flex-col justify-between"
                    >
                        <div className="p-4 space-y-2">
                            <div className="flex justify-between items-center">
                                <h2 className="text-md font-bold text-gray-800 truncate">
                                    {item.flightName}
                                </h2>
                                <span className="text-green-600 font-semibold text-sm">
                                    ₹{item.price}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 font-medium">
                                {item.from} → {item.to}
                            </p>
                            <p className="text-xs text-gray-500">
                                Departure: {new Date(item.departureTime).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                                Arrival: {new Date(item.arrivalTime).toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-black text-white text-center py-2 text-xs font-semibold rounded-xl">
                            Book Now
                        </div>
                    </div>
                </>)}
                </div>
            </>
            )}
        </div>
    );
}