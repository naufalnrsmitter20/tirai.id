"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ReviewWithOrderUser } from "@/types/entityRelations";
import { Star } from "lucide-react";

export const ReviewCard = ({ review }: { review: ReviewWithOrderUser }) => {
  return (
    <Card key={review.id} className="overflow-hidden">
      <CardContent className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              {review.rating}/5
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </Badge>
            <span className="font-medium">{review.order.user.name}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600">{review.content}</p>
      </CardContent>
    </Card>
  );
};
