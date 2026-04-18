"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";

export default function HotelAllimages({ id }: { id: string }) {
  const [images, setImages] = useState<string[][]>([]);
  const [flatImages, setFlatImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(
          `https://makemytour-5axz.onrender.com/public/${id}/images`
        );
        setImages(res.data);
        const flattened = res.data.flat();
        setFlatImages(flattened);
      } catch (err) {
        console.error("Error fetching images", err);
      }
    };

    if (id) fetchImages();
  }, [id]);

  if (!flatImages.length) {
    return <div className="p-4">No Images</div>;
  }

  return (
  <div className="max-w-6xl mx-auto px-4">
    <div className="grid grid-cols-5 gap-4 relative z-0"> 
      <div className="col-span-4 h-full">
        <img
          src={flatImages[0]}
          className="w-full h-full object-cover rounded-xl"
        />
      </div>
      <div className="col-span-1 flex flex-col gap-4 h-full">
        {flatImages[1] && (
          <img
            src={flatImages[1]}
            className="w-full h-1/2 object-cover rounded-xl"
          />
        )}
        {flatImages[2] && (
          <div className="relative h-1/2">
            <img
              src={flatImages[2]}
              className="w-full h-full object-cover rounded-xl"
            />
            {flatImages.length > 3 && (
              <div className="absolute bottom-2 left-2 bg-white/80 px-3 py-1 text-sm rounded shadow">
                +{flatImages.length - 3} Photos
              </div>
            )}
          </div>
        )}
      </div>
    </div>

  </div>
);
}