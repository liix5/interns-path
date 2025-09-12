"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Star } from "lucide-react";

type Experience = {
  id: number | string;
  profession: string;
  place: string;
  year: string;
  rotation: string;
  tags?: string[];
  rating?: number;
  experience: string;
};

type ExperienceCardPreviewProps = {
  experience: Experience;
};

export default function ExperienceCardPreview({
  experience,
}: ExperienceCardPreviewProps) {
  const {
    id,
    profession,
    place,
    year,
    rotation,
    tags = [],
    rating = 0,
    experience: expText,
  } = experience;

  return (
    <Card
      className="w-full shadow-sm rounded-xl border hover:shadow-md transition"
      dir="rtl"
    >
      {/* نفس الكود السابق */}
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-lg  font-semibold">{profession}</span>
          <div className="flex items-center gap-2 text-sm text-foreground/80">
            <span>{place}</span> • <span>{year}</span> •{" "}
            <span>الروتيشن {rotation}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag, idx) => (
              <Badge key={idx} variant="secondary">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline">+{tags.length - 3}</Badge>
            )}
          </div>
        )}

        {/* Rating */}
        {rating > 0 && (
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        )}

        {/* Experience snippet */}
        <p className="text-sm text-foreground line-clamp-3">
          {expText.length > 180 ? expText.slice(0, 180) + "..." : expText}
        </p>

        {/* Link */}
        <div className="text-left mt-2">
          <Link
            href={`/experience/${id}`}
            className=" text-primary  hover:underline text-sm font-medium"
          >
            اقرأ المزيد &larr;
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
