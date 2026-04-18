"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateReview } from "@/api";
import { useSelector } from "react-redux";

type Reply = {
  userId?: string;
  email?: string;
  message: string;
  createdAt?: string;
};

type Review = {
  id: string;
  userName: string;
  feedback: string;
  rating: number;
  photos?: any[];
  replies?: Reply[];
  helpfulCount: number;
  createdAt: string;
};

export default function ReviewCard({ review }: { review: Review }) {
  const [localReview, setLocalReview] = useState(review);
  const [replies,setReplies] = useState<Reply[]>([...(review.replies ?? [])]);
  const [message, setMessage] = useState("");
  const user = useSelector((state:any) => state.user.user);

  const handleSend = async () => {
    if (!message.trim()) return;

    setReplies([...replies,{
        userId:user?.id,
        message,
        createdAt: new Date().toISOString()
    }])
    await updateReview(replies, review.id);

    setLocalReview((prev) => ({
      ...prev,
      replies: [
        ...(prev.replies || []),
        { email: "you", message },
      ],
    }));

    setMessage("");
  };

  return (
    <div className="border rounded-xl p-4 space-y-2">

      <div className="flex justify-between">
        <div className="font-semibold">{localReview.userName}</div>
        <div className="text-sm text-gray-500">
          {new Date(localReview.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="text-yellow-500">
        {"★".repeat(localReview.rating)}
        {"☆".repeat(5 - localReview.rating)}
      </div>

      <p className="text-sm">{localReview.feedback}</p>

      {localReview.photos?.length ? (
        <div className="flex gap-2 overflow-x-auto">
          {localReview.photos.map((img, i) => (
            <img
              key={i}
              src={`data:image/jpeg;base64,${img?.data}`}
              className="w-20 h-20 object-cover rounded"
            />
          ))}
        </div>
      ) : null}

      {replies?.length ? (
        <div className="bg-gray-100 p-2 rounded text-sm space-y-1">
          {replies.map((rep, i) => (
            <p key={i}>
              <strong>{rep.email}:</strong> {rep.message}
            </p>
          ))}
        </div>
      ) : null}

      <div className="text-sm text-gray-600">
        👍 Helpful ({localReview.helpfulCount})
      </div>

      <div className="flex gap-2 mt-2">
        <Input
          placeholder="Write a reply..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button onClick={handleSend}>Send</Button>
      </div>

    </div>
  );
}