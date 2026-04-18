"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Room = {
  type: string;
  price: number;
  photos: string[];
  amenities: string[];
  availability: boolean[];
};

type Hotel = {
  _id: string;
  hotelName: string;
  location: string;
  rating: number;
  state?: string;
  country?: string;
  description: string;
  rooms: Room[];
};

type RecommendationType = {
  item: Hotel;
  reason: string;
};

function isRecommendationArray(
  data: RecommendationType[] | Hotel[]
): data is RecommendationType[] {
  return (data as RecommendationType[])[0]?.item !== undefined;
}

export default function Recommendation({
  hotels,
}: {
  hotels: RecommendationType[] | Hotel[];
}) {
  const router = useRouter();
  if (!hotels || hotels.length === 0) return null;
  const normalizedHotels: Hotel[] = isRecommendationArray(hotels)
    ? hotels.map((h) => h.item)
    : hotels;
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Recommended for you</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {normalizedHotels.map((hotel, index) => {
          const firstRoom = hotel.rooms?.[0];
          const image =
            firstRoom?.photos?.[0] ||
            "https://via.placeholder.com/400x250?text=No+Image";
          console.log(image);

          return (
            <div
              key={index}
              onClick={() => router.push(`/book-hotel/${hotel._id}`)}
              className={cn(
                "cursor-pointer bg-white rounded-2xl shadow-md overflow-hidden transition hover:shadow-lg"
              )}
            >
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={image}
                  alt={hotel.hotelName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-lg line-clamp-1">
                  {hotel.hotelName}
                </h3>

                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500 line-clamp-1">
                    📍 {hotel.location}
                  </p>
                  <span className="text-green-600 font-bold">
                    ₹{firstRoom?.price || 0}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}