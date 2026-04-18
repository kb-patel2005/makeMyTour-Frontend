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
  const flightState = useSelector((state: any) => state.flights.flight?.[0])

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

        const currentFlightId =
          flightState?.id || flightState?._id;

        const incomingFlightId =
          data.id || (data as any)._id;

        // ✅ FIX 1: correct ID match
        const isSameFlight = currentFlightId === incomingFlightId;

        // ✅ FIX 2: normalize seat type
        const normalize = (t: string) =>
          t?.toLowerCase().includes("b") ? "business" : "economy";

        const incomingSeatType = normalize(data.seatType);
        const activeSeatType = normalize(currentSeatType || "");

        if (
          isSameFlight &&
          data.seatsMatrix &&
          incomingSeatType === activeSeatType
        ) {
          dispatch(setSeatmatrix([...data.seatsMatrix]));
        }

        const payload: NotificationPayload = {
          entityId: incomingFlightId,
          messages: {
            message: `Flight ${incomingFlightId} | ${data.from}→${data.to} status changed to ${data.status}`,
            updatedDate: new Date(data.departureTime).toISOString(),
            dateTime: new Date().toISOString(),
          },
        };

        dispatch(postNotification(payload));
      }
    });

    return () => disconnectSocket();
  }, []);
  return null;
}