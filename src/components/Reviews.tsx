"use client";

import ReplyBox from "./ReplyBox";

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

export default function Reviews({ review }: { review: Review[] }) {

  const total = review.length;
  const averageRating = total ? review.reduce((sum, r) => sum + r.rating, 0) / total : 0;

  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: review.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="space-y-6">

      <div className="p-4 border rounded-xl">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
          <div className="text-sm text-gray-500">{total} reviews</div>
        </div>

        <div className="mt-3 space-y-1">
          {breakdown.map((b) => (
            <div key={b.star} className="flex items-center gap-2">
              <span className="w-6 text-sm">{b.star}★</span>
              <div className="flex-1 bg-gray-200 h-2 rounded">
                <div
                  className="bg-green-500 h-2 rounded"
                  style={{
                    width: `${(b.count / total) * 100 || 0}%`,
                  }}
                />
              </div>
              <span className="text-xs">{b.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {review.length === 0 && (
          <p className="text-gray-500">No reviews yet</p>
        )}

        {review.map((r) => (
          <div key={r.id} className="border rounded-xl p-4 space-y-2">

            <div className="flex justify-between">
              <div className="text-sm text-gray-500">
                {r.createdAt}
              </div>
            </div>

            <div className="text-yellow-500">
              {"★".repeat(r.rating)}
              {"☆".repeat(5 - r.rating)}
            </div>

            <p className="text-sm">{r.feedback}</p>

            {r.photos?.length ? (
              <div className="flex gap-2 overflow-x-auto">
                {r.photos.map((img, i) => (
                  <img
                    key={i}
                    src={`data:image/jpeg;base64,${img}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                ))}
              </div>
            ) : null}

            {r.replies?.length ? (
              <div className="bg-gray-100 p-2 rounded text-sm">
                {r.replies.map((rep, i) => (
                  <p key={i}>
                    <strong>{rep.email}:</strong> {rep.message}
                  </p>
                ))}
              </div>
            ) : null}

            <div className="text-sm text-gray-600">
              <div><ReplyBox trigger={<><div>📝 replies</div></>} review={r}/></div>
              <div> Helpful ({r.helpfulCount})</div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}