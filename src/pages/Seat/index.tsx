"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import { Calendar, Clock, CreditCard, MapPin, Plane } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { handleflightbooking, updateFlights } from "@/api";
import { useRouter } from "next/navigation";
import { sendFlightUpdate } from "@/components/Socket";
import { setSeatmatrix } from "@/store";

const Seat = ({
  label,
  booked,
  type,
  isMine,
  onClick,
}: {
  label: string;
  booked: boolean;
  type: "business" | "economy";
  isMine: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      className={cn(
        "w-10 h-10 flex items-center justify-center rounded-md text-xs font-semibold transition",

        isMine
          ? "bg-green-600 text-white"
          : booked
            ? "bg-red-500 text-white cursor-not-allowed"
            : type === "business"
              ? "bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer"
              : "bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
      )}
      onClick={() => onClick()}
    >
      {label}
    </div>
  );
};

export default function SeatsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const flightState = useSelector((state: any) => state.flights.flight?.[0]);
  const seatTypeRaw = useSelector((state: any) => state.flights.seatType);
  const seatMatrix = useSelector((state: any) => state.flights.seatMatrix);
  const [mySeats, setMySeats] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const seatLabels = ["A", "B", "C", "D", "E", "F"];
  useEffect(() => {
    if (!flightState) return;

    const updatedSeats =
      seatTypeRaw?.toLowerCase().startsWith("b")
        ? flightState.bussinesseats
        : flightState.economicseats;

    if (updatedSeats) {
      dispatch(setSeatmatrix(updatedSeats));
    }
  }, [flightState, seatTypeRaw]);

  const type = seatTypeRaw?.toLowerCase().includes("econom") ? "economy" : "business";

  const handleClick = (row: number, col: number) => {
    const label = `${row + 1}${seatLabels[col]}`;
    const updated = seatMatrix.map((r: boolean[]) => [...r]);
    if (updated[row][col]) return;
    updated[row][col] = true;
    dispatch(setSeatmatrix(updated));
    setMySeats((prev) =>
      prev.includes(label)
        ? prev.filter((s) => s != label)
        : [...prev, label]
    );
  };

  const getBookedSeats = () => {
    const result: string[] = [];
    seatMatrix?.forEach((row: any, i: number) => {
      row.forEach((val: any, j: number) => {
        if (val) result.push(`${i + 1}${seatLabels[j]}`);
      });
    });
    return result;
  };

  const handleBooking = async () => {
    if (!flightState) return;
    await handleflightbooking({
      userId: user?.id,
      bookingId: flightState.id,
      type: "flight",
      status: "ON_TIME",
      quantity: mySeats.length,
      seat: seatTypeRaw,
      totalPrice:
        flightState.price * mySeats.length +
        374 * mySeats.length +
        249 * mySeats.length -
        250 * mySeats.length,
      seats: mySeats,
    });
    await updateFlights({
      id: flightState.id,
      seatType: seatTypeRaw,
      seats: mySeats,
      status: "ON_TIME",
      departureTime: flightState.departureTime,
      arrivalTime: flightState.arrivalTime,
      delayReason: null,
    });
    localStorage.setItem("sm", JSON.stringify(seatMatrix))
    sendFlightUpdate({
      id: flightState.id,
      status: flightState.status,
      to: flightState.to,
      from: flightState.from,
      departureTime: flightState.departureTime,
      arrivalTime: flightState.arrivalTime,
      seatType: seatTypeRaw,
      seatsMatrix: seatMatrix
    });
    router.push("/");
  };
  const renderRow = (rowData: boolean[], rowIndex: number) => {
    const mid = rowData.length / 2;
    const rowNumber = rowIndex + 1;
    return (
      <div key={rowIndex} className="flex justify-center gap-2 mb-3">
        <div className="w-6 text-xs text-gray-500">{rowNumber}</div>
        <div className="flex gap-2">
          {rowData.slice(0, mid).map((booked, i) => {
            const label = `${rowNumber}${seatLabels[i]}`;
            return (
              <Seat
                key={i}
                label={label}
                booked={booked}
                isMine={mySeats.includes(label)}
                type={type}
                onClick={() => handleClick(rowIndex, i)}
              />
            );
          })}
        </div>
        <div className="w-6" />
        <div className="flex gap-2">
          {rowData.slice(mid).map((booked, i) => {
            const label = `${rowNumber}${seatLabels[mid + i]}`;
            return (
              <Seat
                key={i}
                label={label}
                booked={booked}
                isMine={mySeats.includes(label)}
                type={type}
                onClick={() => handleClick(rowIndex, mid + i)}
              />
            );
          })}
        </div>
      </div>
    );
  };

  const bookedSeats = getBookedSeats();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow-sm max-w-3xl mx-auto">
        <h1 className="text-xl font-bold mb-6 capitalize">
          {type} Seat Selection
        </h1>

        {seatMatrix?.length === 0 ? (
          <div className="text-center text-gray-500">
            No seats available
          </div>
        ) : (
          seatMatrix?.map((row: any, i: number) => renderRow(row, i))
        )}
        <div className="mt-6 text-sm">
          <b>Your Seats:</b> {mySeats.join(", ") || "None"}
        </div>
        <div className="mt-2 text-sm">
          <b>All Booked:</b> {bookedSeats.join(", ") || "None"}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              disabled={!flightState}
              className="mt-6 w-full bg-red-600 text-white p-2 rounded-lg disabled:opacity-50"
            >
              Confirm Booking
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center">
                <Plane className="w-6 h-6 mr-2" />
                Flight Booking Details
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center">
                    <Plane className="w-4 h-4 mr-2" />
                    Flight Name
                  </Label>
                  <Input value={flightState?.flightName || ""} readOnly />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    From
                  </Label>
                  <Input value={flightState?.from || ""} readOnly />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    To
                  </Label>
                  <Input value={flightState?.to || ""} readOnly />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Departure
                  </Label>
                  <Input
                    value={
                      flightState?.departureTime
                        ? new Date(flightState?.departureTime).toLocaleString()
                        : ""
                    }
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Arrival
                  </Label>
                  <Input
                    value={
                      flightState?.arrivalTime
                        ? new Date(flightState?.arrivalTime).toLocaleString()
                        : ""
                    }
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tickets</Label>
                  <Input value={mySeats?.length} readOnly />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Selected Seats</Label>
                  <Input value={mySeats?.join(", ") || "None"} readOnly />
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Fare Summary
                </h3>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Base Fare</span>
                    <span>₹ {(flightState?.price * mySeats.length || 0).toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Taxes</span>
                    <span>₹ {(374 * mySeats.length).toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Other</span>
                    <span>₹ {(249 * mySeats.length).toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>- ₹ {(250 * mySeats.length).toLocaleString()}</span>
                  </div>

                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span>
                      ₹ {(
                        (flightState?.price * mySeats.length || 0) +
                        374 * mySeats.length +
                        249 * mySeats.length -
                        250 * mySeats.length
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Button className="w-full mt-4" onClick={handleBooking}>
              Proceed to Payment
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}