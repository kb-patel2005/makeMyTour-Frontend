"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelector } from "react-redux";
import { updateReview } from "@/api";

type Reply = {
  userId?: string;
  email?: string;
  message: string;
  createdAt: string;
};

type Review = {
  id: string;
  feedback: string;
  rating: number;
  createdAt?: any;
  photos?: any[];
  replies?: Reply[] | null;
  entityId: string;
  entityType: string;
  flagged?: boolean;
  helpfulCount?: any;
  userId: string;
};

type Props = {
  trigger: any;
  review: Review | null;
};

export default function ReplyBox({ trigger, review }: Props) {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const user = useSelector((state: any) => state.user.user);

  if (!review) return null;

  useEffect(() => {
    if (review?.replies) {
      setReplies(review.replies);
    } else {
      setReplies([]);
    }
  }, [review]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    const newReply: Reply = {
      userId: user?.id,
      email: user?.email,
      message: message,
      createdAt: new Date().toISOString(),
    };

    const updatedReplies = [...replies, newReply];

    try {
      setReplies(updatedReplies);
      await updateReview({ replies: updatedReplies }, review.id);
      setMessage("");
    } catch (err) {
      console.error("Reply failed:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      {/* Trigger */}
      <DialogTrigger asChild>
        <div onClick={handleOpen}>
          {trigger}
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-md h-[60vh] flex flex-col bg-white">

        <DialogHeader>
          <DialogTitle>Replies</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 mt-2">
          <div className="space-y-2">

            {replies.length === 0 && (
              <p className="text-sm text-gray-400 text-center">
                No replies yet
              </p>
            )}

            {replies.map((r, i) => (
              <div
                key={i}
                className="bg-gray-100 p-1 rounded-md"
              >
                <div>
                  <p className="text-[9px] text-gray-400">{r.email}</p>
                  <p className="text-md">{r.message}</p>
                </div>
              </div>
            ))}

          </div>
        </ScrollArea>

        {user?.email &&
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Write a reply..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button onClick={handleSend}>Send</Button>
          </div>
        }
      </DialogContent>
    </Dialog>
  );
}