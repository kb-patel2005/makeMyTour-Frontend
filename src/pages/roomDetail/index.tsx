import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import BookingPopup from "./BookingPopup";
import { sendHotelUpdate } from "@/components/Socket";
type Room = {
    type: string;
    price: number;
    amenities: string[];
    photos: string[];
    availability: boolean[];
};

export default function RoomDetailCard() {

    const user = useSelector((state: any) => state.user.user); 
    const room: Room = useSelector((state: any) => state.hotels.selectedRoom);
    const hotel = useSelector((state: any) => state.hotels.hotels);

    if (!room) {
        return <div className="p-6">No room selected yet.</div>;
    }
    const [selectedImage, setSelectedImage] = useState(room.photos?.[0] ?? "https://via.placeholder.com/600x400?text=No+Image");
    const [selectedRooms, setSelectedRooms] = useState<number[]>([]);

    useEffect(() => {
        if (room) {
            setSelectedRooms(prev =>
                prev.filter(i => !room.availability[i])
            );
        }
    }, [room.availability]);

    const handleSelect = (i: number) => {
        if (room.availability[i]) return;

        setSelectedRooms((prev) =>
            prev.includes(i)
                ? prev.filter((x) => x !== i)
                : [...prev, i]
        );
    };

    return (
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-4 p-4">
                <div className="h-[350px] rounded-xl overflow-hidden">
                    <img
                        src={selectedImage}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {room.photos.map((img, i) => (
                        <img
                            key={i}
                            src={img}
                            onClick={() => setSelectedImage(img)}
                            className={cn(
                                "h-40 w-full object-cover rounded-lg cursor-pointer border-2",
                                selectedImage === img
                                    ? "border-blue-600"
                                    : "border-transparent"
                            )}
                        />
                    ))}
                </div>
            </div>
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold capitalize">
                            {room.type}
                        </h2>
                        {room.type === "suite" && (
                            <Badge className="bg-yellow-500 text-black">
                                Premium
                            </Badge>
                        )}
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                        ₹{room.price}/night
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                        {room.amenities.map((a, i) => (
                            <Badge key={i} variant="secondary">
                                {a}
                            </Badge>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-3"> Choose Your Room </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {room.availability.map((isAvailable: boolean, i: number) => {
                            const isSelected = selectedRooms.includes(i);
                            return (
                                <div
                                    key={i}
                                    onClick={() => handleSelect(i)}
                                    className={cn(
                                        "rounded-xl border p-4 cursor-pointer transition text-center",
                                        !isAvailable
                                            ? "bg-gray-200 cursor-not-allowed"
                                            : isSelected
                                                ? "border-green-600 bg-green-50 shadow-md"
                                                : "hover:shadow-md"
                                    )}
                                >
                                    <p className="font-semibold text-lg"> Room {i + 1} </p>
                                    <p className="text-xs text-gray-500">
                                        2 Guests • King Bed
                                    </p>
                                    <div className="mt-2">
                                        {isAvailable ? (
                                            <Badge variant="destructive">
                                                Booked
                                            </Badge>
                                        ) : isSelected ? (
                                            <Badge className="bg-green-600 text-white">
                                                Selected
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline">
                                                Available
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* SUMMARY */}
                <div className="flex justify-between items-center bg-gray-100 p-4 rounded-xl">
                    <div>
                        <p className="text-sm text-gray-500">
                            Selected Rooms
                        </p>
                        <p className="font-semibold">
                            {selectedRooms.length
                                ? selectedRooms.map((i) => `Room ${i + 1}`).join(", ")
                                : "None"}
                        </p>
                    </div>

                    <div className="text-xl font-bold text-green-600">
                        ₹{room.price * selectedRooms.length}
                    </div>
                </div>
                <BookingPopup
                    onClicke={async () => {
                        sendHotelUpdate({
                            ...hotel,
                            rooms: hotel.rooms.map((r: any) => r.type === room.type ?
                                {
                                    ...r,
                                    availability: room.availability.map((avail: boolean, idx: number) =>
                                        selectedRooms.includes(idx) ? true : avail
                                    )
                                } : r
                            )
                        });
                    }}
                    hotelData={{
                        ...hotel,
                        rooms: hotel.rooms.map((r: any) => r.type === room.type ?
                            {
                                ...r,
                                availability: r.availability.map((avail: boolean, idx: number) =>
                                    selectedRooms.includes(idx) ? true : avail
                                )
                            } : r
                        )
                    }}
                    roomType={room.type}
                    bookingId={hotel._id}
                    totalPrice={room.price * selectedRooms.length}
                    quantity={selectedRooms.length}
                    room={selectedRooms}
                    rooms={[{ type: room.type, rooms: selectedRooms.map(String) }]}
                    userId={user?.id} />
            </div>
        </div>
    );
}