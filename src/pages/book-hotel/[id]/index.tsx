import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { gethotelbyid } from "@/api";
import HotelAllimages from "../HotelAllimages";
import HotelRoom from "../HotelRoom";
import { useDispatch } from "react-redux";
import { setHotels, setRoom } from "@/store";

export default function HotelCard() {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();

  const [hotel, setHotel] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const fetchHotel = async () => {
      const data = await gethotelbyid(id);
      console.log(data);
      setHotel(data);
    };

    fetchHotel();
  }, [id]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {hotel && (
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

          <div className="px-6 pt-6 pb-4 border-b">
            <div className="flex justify-between items-start">

              <div>
                <h1 className="text-2xl font-bold">
                  {hotel.hotelName}
                </h1>

                <p className="text-gray-500 mt-1">
                  {hotel.location}
                </p>

                <p className="text-gray-600 mt-2 text-sm">
                  {hotel.description}
                </p>
              </div>

              <div className="bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-semibold">
                {hotel.rating || 4.2} ⭐
              </div>

            </div>
          </div>

          <div className="p-4 mb-6">
            <HotelAllimages id={id as string} />
          </div>
          <hr />
          <div className="relative z-10 bg-white">
            <h1 className="text-xl font-bold m-5">
              We have multiple ranges in room
            </h1>
            <div className="relative z-10 bg-white px-6 pb-6">
              <div className="grid md:grid-cols-3 gap-6">
                {hotel.rooms?.map((room: any, i: number) => (
                  <HotelRoom key={i} room={room} 
                  onClick={()=>{
                    dispatch(setRoom(room));
                    dispatch(setHotels(hotel));
                    router.push(`/roomDetail`);
                  }}/>
                ))}
              </div>
            </div>
          </div>
          {/* ⭐ REVIEWS */}
          {/* <Reviews id={id as string} /> */}
        </div>
      )}
    </div>
  );
}