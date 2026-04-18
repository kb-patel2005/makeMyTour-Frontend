"use client";

import { useEffect, useState } from "react";

type PriceDay = {
  date: string;
  price: number;
};

type SimpleDay = {
  date: string;
  price: number;
};

const BASE_PRICE = 5000;

const flightHistory: PriceDay[] = [];

const holidays: SimpleDay[] = [
  { date: "2026-01-26", price: 5000 },
  { date: "2026-08-15", price: 5000 },
];

const festivals: SimpleDay[] = [
  { date: "2026-11-12", price: 5000 },
];

export default function PriceCalendarPage() {
  const [data, setData] = useState<PriceDay[]>([]);

  useEffect(() => {
    if (flightHistory.length > 0) {
      setData(flightHistory);
      return;
    }

    const result: PriceDay[] = [];
    const today = new Date();

    for (let i = 0; i < 15; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);

      const dateStr = d.toISOString().split("T")[0];

      const holiday = holidays.find((h) => h.date === dateStr);
      if (holiday) {
        result.push({
          date: dateStr,
          price: Math.round(holiday.price * 1.08),
        });
        continue;
      }

      const festival = festivals.find((f) => f.date === dateStr);
      if (festival) {
        result.push({
          date: dateStr,
          price: Math.round(festival.price * 1.06),
        });
        continue;
      }

      const randomOffset = Math.floor(Math.random() * 200) - 100;

      result.push({
        date: dateStr,
        price: BASE_PRICE + randomOffset,
      });
    }

    setData(result);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-xl font-bold mb-6">Flight Price Calendar</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border text-center bg-gray-50"
            >
              <div className="text-sm text-gray-600">
                {new Date(item.date).toDateString()}
              </div>

              <div className="text-lg font-bold mt-2">
                ₹ {item.price}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}