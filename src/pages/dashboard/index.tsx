"use client";

import FlightCard from "@/components/FlightCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setFlight, setSeatType } from "@/store";

export default function Dashboard() {

  const dispatch = useDispatch();
  const flights = useSelector((state: any) => state.flights.flight);

  useEffect(() => {
    const fetchFlights = async () => {
      const token = localStorage.getItem("Authorization")
      const res = await axios.get(`https://makemytour-5axz.onrender.com/flight`,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      const data = res.data;
      console.log("data",data);
      dispatch(setFlight(data));
      console.log(flights)
    };

    fetchFlights();
  }, []);

  // useEffect(() => {

  //   const flight = async () => {
  //     const res = await getflight();

  //     const data = res;
  //     console.log(data)
  //     setFlights([...flights, ...res]);
  //   }

  //   flight()
  //   console.log(flights)

  //   const client = new Client({
  //     webSocketFactory: () => new SockJS("http://localhost:8080/ws"),

  //     onConnect: () => {
  //       console.log("Connected ✅");

  //       client.subscribe("/topic/flights", (message) => {
  //         const newFlight = JSON.parse(message.body);

  //         setFlights((prev) => {
  //           const exists = prev.some(f => f.id === newFlight.id);

  //           // ❌ ignore if not user's flight
  //           if (!exists) return prev;

  //           // ✅ update existing flight
  //           return prev.map(f =>
  //             f.id === newFlight.id ? newFlight : f
  //           );
  //         });
  //       });
  //     },

  //     onStompError: (frame) => {
  //       console.error("Broker error:", frame);
  //     }
  //   });

  //   client.activate();

  //   return () => {
  //     client.deactivate();
  //   };

  // }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Live Flights</h1>

      <div className="flex flex-wrap justify-evenly">
        {flights && flights.map((flight:any,index:any) => (
          <FlightCard key={index} flight={flight} />
        ))}
      </div>
    </div>
  );
}