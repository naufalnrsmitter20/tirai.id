"use client";

import { COLORS } from "@/constants/color";
import { Star } from "lucide-react";
import { useState } from "react";

interface StarsSelectorProps {
  maxStars?: number;
  value?: number;
  onRatingChange?: (rating: number) => void;
}

export const StarsSelector: React.FC<StarsSelectorProps> = ({
  maxStars = 5,
  value,
  onRatingChange,
}) => {
  const [currentRating, setCurrentRating] = useState(value || 0);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const handleClick = (rating: number) => {
    setCurrentRating(rating);
    if (onRatingChange) onRatingChange(rating);
  };

  const handleMouseEnter = (rating: number) => setHoveredRating(rating);
  const handleMouseLeave = () => setHoveredRating(null);

  return (
    <div className="ites-center flex gap-x-1">
      {Array.from({ length: maxStars }, (_, index) => {
        const starValue = index + 1;

        return (
          <Star
            key={index}
            className="size-8 cursor-pointer transition-colors duration-200"
            color={
              (hoveredRating || currentRating) >= starValue
                ? COLORS.primary[800]
                : "#e4e5e9"
            }
            fill={
              (hoveredRating || currentRating) >= starValue
                ? COLORS.primary[800]
                : "#e4e5e9"
            }
            onClick={
              value === undefined ? () => handleClick(starValue) : undefined
            }
            onMouseEnter={
              value === undefined
                ? () => handleMouseEnter(starValue)
                : undefined
            }
            onMouseLeave={value === undefined ? handleMouseLeave : undefined}
          />
        );
      })}
    </div>
  );
};
