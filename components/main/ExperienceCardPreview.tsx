"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Loader2, Star, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { Experience } from "@/app/lib/definitions";
import { Button } from "@/components/ui/button";

type ExperienceCardPreviewProps = {
  experience: Experience;
};

export default function ExperienceCardPreview({
  experience,
}: ExperienceCardPreviewProps) {
  const [Loading, setLoading] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  const {
    id,
    profession,
    place,
    city,
    year,
    rotation,
    tags = [],
    rating = 0,
    description: expText,
  } = experience;

  useEffect(() => {
    // Check if user has edit token for this experience
    const editTokens = JSON.parse(
      localStorage.getItem("experienceEditTokens") || "{}",
    );
    setCanEdit(!!editTokens[id]);
  }, [id]);

  return (
    <Card
      className="w-full relative h-full shadow-sm rounded-xl border hover:shadow-md transition"
      dir="rtl"
    >
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-lg  font-semibold">{profession}</span>
          <span className="text-sm text-foreground/80">
            {city && `${city} - `}{place}
          </span>{" "}
          <div className="flex  items-center gap-2 text-sm text-foreground/80">
            <span>
              {" "}
              {experience.year instanceof Date
                ? experience.year.getFullYear()
                : experience.year}
            </span>{" "}
            • <span>الروتيشن {rotation}</span>
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
        <p className="text-sm mb-8 text-foreground line-clamp-3">
          {expText.length > 180 ? expText.slice(0, 180) + "..." : expText}
        </p>

        {/* Link */}
        <div className="absolute bottom-5 left-5 flex gap-3 items-center">
          {Loading && <Loader2 className="animate-spin mr-auto mb-4" />}
          {!Loading && (
            <>
              <Link
                onClick={() => setLoading(true)}
                href={`/experience/${id}`}
                className="text-primary hover:underline text-sm font-medium"
              >
                اقرأ المزيد
                <span className="pt-2">&larr;</span>
              </Link>
              {canEdit && (
                <Link href={`/experience/${id}/edit`}>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Pencil className="h-3 w-3" />
                    تعديل
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
