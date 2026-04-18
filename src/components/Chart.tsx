"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

export default function Chart({ data }: { data: any[] }) {

    const formatted = data.map((item) => ({
        price: item.price,
        time: new Date(item.timestamp).toLocaleDateString(), // or toLocaleTimeString()
    }));

    return (
        <div className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Price History</h2>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formatted}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />

                    <Tooltip
                        formatter={(value: any) => [`₹${value}`, "Price"]}
                        labelFormatter={(label) => `Date: ${label}`}
                    />

                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#16a34a"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}