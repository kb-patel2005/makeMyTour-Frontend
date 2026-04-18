import { Dialog, DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import React, { useState } from 'react'
import { DialogContent, DialogHeader, DialogTrigger } from './ui/dialog'
import { cancelbooking } from '@/api';
import { Button } from './ui/button';

export default function CancellationForm({ id, bookingId, type, qty }: { id: string; bookingId: string; type: string; qty: any }) {

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [open, setOpen] = React.useState(false);
  const [reason, setReason] = useState("");

  const flightOptions = [
    "none",
    "Emergency" ,
    "Change of plans" ,
    "Health issues" ,
    "personal"
  ];

  const hotelOptions = [
    "none",
    "Emergency" ,
    "Change of plans" ,
    "Health issues" ,
     "Food compliance" ,
    "personal" 
  ];

  const options = type === "flight" ? flightOptions : hotelOptions;

  const [userData, setUserData] = React.useState({
    ...user,
    bookings: user?.bookings || []
  });

  const cancelbook = async (id: any, bookingId: any, type: any, qty: any, reason: String) => {
    try {
      await cancelbooking(bookingId, reason);
      setUserData(() => ({
        ...userData
      }));
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={() => setOpen(!open)}>
        <DialogTrigger asChild>
          <Button>cancel booking</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Booking Cancellation form
            </DialogTitle>
            <DialogDescription>
              Please provide the reason for cancellation.
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-4" onSubmit={async(e) => {
              cancelbook(id, bookingId, type, qty, reason);
              setOpen(false);
              }}> 
            <h1>{type} Cancellation</h1>
            <p>booking ID: {bookingId}</p>
            <p>booking Type: {type}</p>
            <p>you booked: {qty}</p>
            <label className="flex flex-col gap-1">
              Reason for cancellation:
              <select
                className="border p-2 rounded"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              >
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>

            </label>
            <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded" >
              Submit Cancellation
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
