import React, { use } from "react";
import { useSelector } from "react-redux";

type Room = {
    type: string;
    price: number;
    amenities: string[];
    images?: string[];
    availability: boolean[];
};

export default function HotelRoom({ room , onClick }: { room: any; onClick: () => void }) {

    if (!room) {
        return null;
    }

    const imageSrc = room?.photos?.[0] || "https://via.placeholder.com/400x300?text=No+Image";
    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition w-full">
            <div className="h-48 w-full bg-gray-100">
                <img src={imageSrc}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold capitalize">{room.type}</h2>
                    <span className="text-green-600 font-semibold">
                        ₹{room.price}/night
                    </span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {room.amenities?.map((a:string, i:number) => (
                        <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-full">{a}</span>
                    ))}
                </div>
                <button
                onClick={onClick}
                className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                    Select Room
                </button>
            </div>
        </div>
    );
}