"use client";

import { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FeedbackForm({ bookingId, userId, type }: { bookingId: string; userId: string, type: String }) {
  const [feedback, setFeedback] = useState("");
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(e.target.files);
    }
  };

  const handleClick = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("feedback", feedback);
    
    formData.append("rating", rating.toString());
    if (photos) {
      Array.from(photos).forEach((file) => {
        formData.append("photos", file);
      });
    }

    try {
      const token = localStorage.getItem("Authorization")
      const url = type == "hotel" ? ` https://makemytour-5axz.onrender.com/reply/hotels/${bookingId}/reviews` : ` https://makemytour-5axz.onrender.com/reply/flights/${bookingId}/reviews`;
      const res = await axios.post(url, formData,
        {
          headers: {
            "Authorization" : `Bearer ${token}`,
            "Content-Type": "multipart/form-data" },
        }
      );
      alert("Review submitted successfully!");
      console.log(res.data);
      setFeedback("");
      setPhotos(null);
    } catch (err) {
      console.error(err);
      console.log(err)
      alert("Error submitting review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <button className="bg-blue-600 text-white px-4 py-2 text-sm rounded">
          Review
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Submit Your Review</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write your review..."
              required
            />
          </div>

          <div>
            <Label htmlFor="photos">Upload Photos</Label>
            <Input
              id="photos"
              type="file"
              multiple
              onChange={handleFileChange}
            />
          </div>
          <div style={{ display: "flex", gap: "5px" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleClick(star)}
                style={{
                  cursor: "pointer",
                  fontSize: "24px",
                  color: star <= rating ? "gold" : "lightgray",
                }}
              >
                ★
              </span>
            ))}
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
    </div>
  );
}