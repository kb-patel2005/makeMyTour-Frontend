// import { hotelBooking, updateHotelrooms } from '@/api';
// import { Dialog, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
// import { DialogContent, DialogTrigger } from '@/components/ui/dialog'
// import React from 'react'

// export default function BookingPopup({ bookingId, totalPrice, quantity, rooms, userId, onClicke, hotelData, roomType, room }: { bookingId: string, totalPrice: number, quantity: number, rooms: { type: string, rooms: string[] }[], userId: string, onClicke: () => void, hotelData: any, roomType: string, room: any }) {
//     const [open, setOpen] = React.useState(false);
//     const onBookingConfirm = async () => {
//         const bookingData = {
//             bookingId,
//             type: "hotel",
//             bookingDate: new Date().toISOString(),
//             quantity,
//             totalPrice,
//             rooms,
//             userId
//         };
//         await hotelBooking(bookingData).then((response) => {
//             console.log("Booking successful:", response);
//         }).catch((error) => {
//             console.error("Booking failed:", error);
//         });
//         await updateHotelrooms(bookingId, hotelData, roomType, room).then((response) => {
//             console.log("Hotel rooms updated successfully:", response);
//         }).catch((error) => {
//             console.error("Failed to update hotel rooms:", error);
//         });
//     }

//     return (
//         <Dialog open={open} onOpenChange={setOpen}>
//             <DialogTrigger asChild>
//                 <button className='bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold'>
//                     Book Now
//                 </button>
//             </DialogTrigger>
//             <DialogContent className='sm:max-w-lg bg-white rounded-lg'>
//                 <DialogHeader>
//                     <DialogTitle className='text-2xl font-bold'>
//                         Confirm Your Booking
//                     </DialogTitle>
//                     <DialogDescription className='text-gray-500 mt-1'>
//                         Please review your booking details before confirming.
//                     </DialogDescription>
//                 </DialogHeader>
//                 <div className='p-6'>
//                     <h2 className='text-xl font-bold mb-4'>Booking Details</h2>
//                     <p className='text-green-500 font-bold mb-2'> you are booked {rooms[0].type}</p>
//                     <div className='mb-4'>
//                         <label className='block text-sm font-medium mb-1'>Booking Date</label>
//                         <p className='w-full border rounded px-3 py-2 bg-gray-100'>
//                             {new Date().toLocaleDateString()}
//                         </p>
//                     </div>
//                     <div className='mb-4'>
//                         <label className='block text-sm font-medium mb-1'>total booked rooms</label>
//                         <p className='w-full border rounded px-3 py-2 bg-gray-100'>
//                             {quantity}
//                         </p>
//                     </div>
//                     <div className='mb-4'>
//                         <label className='block text-sm font-medium mb-1'>total booked rooms</label>
//                         <p className='w-full border rounded px-3 py-2 font-bold bg-gray-100'>
//                             {rooms[0].rooms.map((r) => `Room ${r + 1}`).join(", ")}
//                         </p>
//                     </div>
//                     <div className='mb-4'>
//                         <label className='block text-sm font-medium mb-1'>Total Price</label>
//                         <p className='w-full border rounded px-3 py-2 bg-gray-100'>
//                             ₹{totalPrice}
//                         </p>
//                     </div>
//                 </div>
//                 <div className='p-6 border-t flex justify-end gap-4'>
//                     <button className='px-4 py-2 rounded-lg border' onClick={() => { }}>
//                         Cancel
//                     </button>
//                     <button className='bg-green-500 text-white px-4 py-2 rounded-lg'
//                         onClick={async () => {
//                             await onBookingConfirm();  // DB update first
//                             onClicke();
//                             setOpen(false);
//                         }}>
//                         Confirm Booking
//                     </button>
//                 </div>
//             </DialogContent>
//         </Dialog>
//     )
// }

import { hotelBooking, updateHotelrooms } from "@/api";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";

export default function BookingPopup({
  bookingId,
  totalPrice,
  quantity,
  rooms,
  userId,
  onClicke,
  hotelData,
  roomType,
  room,
}: {
  bookingId: string;
  totalPrice: number;
  quantity: number;
  rooms: { type: string; rooms: string[] }[];
  userId: string;
  onClicke: () => void;
  hotelData: any;
  roomType: string;
  room: any;
}) {
  const [open, setOpen] = React.useState(false);

  const firstRoom = rooms?.[0];

  const onBookingConfirm = async () => {
    const bookingData = {
      bookingId,
      type: "hotel",
      bookingDate: new Date().toISOString(),
      quantity,
      totalPrice,
      rooms,
      userId,
    };

    try {
      const response = await hotelBooking(bookingData);
      console.log("Booking successful:", response);
    } catch (error) {
      console.error("Booking failed:", error);
    }

    try {
      const response = await updateHotelrooms(
        bookingId,
        hotelData,
        roomType,
        room
      );
      console.log("Hotel rooms updated successfully:", response);
    } catch (error) {
      console.error("Failed to update hotel rooms:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
          Book Now
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg bg-white rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Confirm Your Booking
          </DialogTitle>
          <DialogDescription className="text-gray-500 mt-1">
            Please review your booking details before confirming.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Booking Details</h2>

          <p className="text-green-500 font-bold mb-2">
            You are booked {firstRoom?.type ?? "N/A"}
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Booking Date
            </label>
            <p className="w-full border rounded px-3 py-2 bg-gray-100">
              {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Total booked rooms
            </label>
            <p className="w-full border rounded px-3 py-2 bg-gray-100">
              {quantity ?? 0}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Selected Rooms
            </label>
            <p className="w-full border rounded px-3 py-2 bg-gray-100">
              {firstRoom?.rooms
                ?.map((r, idx) => `Room ${idx + 1}`)
                .join(", ") ?? "No rooms selected"}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Total Price
            </label>
            <p className="w-full border rounded px-3 py-2 bg-gray-100">
              ₹{totalPrice ?? 0}
            </p>
          </div>
        </div>

        <div className="p-6 border-t flex justify-end gap-4">
          <button
            className="px-4 py-2 rounded-lg border"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>

          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
            onClick={async () => {
              await onBookingConfirm();
              onClicke?.();
              setOpen(false);
            }}
          >
            Confirm Booking
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}