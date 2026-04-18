import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux';
import { addNotificationAsync } from '@/store';

interface Notification {
  message?: string,
  timeDate?: Date,
  updatedDate?: Date
}

export default function Notification({ trigger }: { trigger: React.ReactNode }) {

  const selector = useSelector((state: any) => state.notification.notifications);
  const dispatch = useDispatch<any>();
  const [open, setOpen] = React.useState(false);
  const token = useState<string>(
    typeof window !== "undefined"
      ? localStorage.getItem("Authorization") || ""
      : "");

  useEffect(() => {
    if (!token) return;
    const fetchNotification = async () => {
      try {
        const res = await fetch(`https://makemytour-5axz.onrender.com/booking/getIdList`, {
          headers: {
            "Authorization": `Bearer ${token[0]}`
          }
        });
        const data = await res.json();
        if (data) {
          dispatch(addNotificationAsync());
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotification();
  }, []);

  return (
    <>
      {token && (
        <Dialog open={open} onOpenChange={setOpen} >
          <DialogTrigger asChild>
            <div className="relative">
              {trigger}
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {selector.length}
              </span>
            </div>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Notification</DialogTitle>
              <DialogDescription>
                This is a notification message.
              </DialogDescription>
            </DialogHeader>

            {selector.length === 0 ? (
              <p className="text-gray-500">No notifications available.</p>
            ) : (
              <ul className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                {selector.map((notification: Notification, index: number) => (
                  <li key={index} className="p-4 rounded border">
                    {notification.message}
                  </li>
                ))}
              </ul>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
