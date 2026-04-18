import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket, disconnectSocket } from "./Socket";
import { updateHotel, updateFlight, setSeatmatrix, postNotification } from "@/store";
import type { AppDispatch } from "@/store";

type NotificationPayload = {
  entityId: string;
  messages: {
    message: string;
    updatedDate: string;
    dateTime: string;
  };
};

export type FlightUpdateRequest = {
  id: string;
  flightName: string;
  to: string;
  from: string;
  seatType: string;
  seats: string[];
  status: string;
  departureTime: string;
  arrivalTime: string;
  delayReason: string;
  totalPrice: number;
  seatsMatrix: boolean[][];
};

export default function SocketProvider() {
  const dispatch = useDispatch<AppDispatch>();
  const seatType = useSelector((state: any) => state.flights.seatType);

  const seatTypeRef = useRef(seatType);

  useEffect(() => {
    seatTypeRef.current = seatType;
  }, [seatType]);

  useEffect(() => {
    connectSocket({
      onHotel: (data) => dispatch(updateHotel(data)),

      onFlight: (data: FlightUpdateRequest) => {
        dispatch(updateFlight(data));

        const currentSeatType = seatTypeRef.current;

        if (
          data.seatType &&
          currentSeatType &&
          data.seatType.charAt(0).toLowerCase() ===
            currentSeatType.charAt(0).toLowerCase()
        ) {
          if (data.seatsMatrix) {
            dispatch(setSeatmatrix(data.seatsMatrix));
          }
        }

        const payload: NotificationPayload = {
          entityId: data.id,
          messages: {
            message: `Flight ${data.id} | ${data.from}→${data.to} status changed to ${data.status}`,
            updatedDate: new Date(data.departureTime).toISOString(),
            dateTime: new Date().toISOString(),
          },
        };

        if (!currentSeatType?.trim()) {
          dispatch(postNotification(payload));
        }
      },
    });

    return () => disconnectSocket();
  }, []); 
  return null;
}