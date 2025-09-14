"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Experience } from "@/app/lib/definitions";

type ExperienceCardProps = {
  experience: Experience;
};

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  console.log(experience);
  const {
    profession,
    place,
    year,
    rotation,
    tags = [],
    rating = 0,
    description,
    positives: pros,
    negatives: cons,
    requirements,
    departments,
    working_hours,
  } = experience;
  return (
    <Card
      className="w-full bg-transparent max-w-2xl mx-auto shadow-md rounded-2xl"
      dir="rtl"
    >
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-xl font-semibold">{profession}</span>
          <span className=" text-sm text-foreground/80">{place}</span>
          <div className="flex items-center gap-2 text-sm text-foreground/80">
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

      <CardContent className="space-y-4">
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <Badge key={idx} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Rating */}
        {rating > 0 && (
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        )}

        {/* Optional Details */}
        {requirements && (
          <p className="text-sm">
            <span className="font-semibold text-primary ">المتطلبات:</span>{" "}
            {requirements}
          </p>
        )}
        {departments && (
          <p className="text-sm">
            <span className="font-semibold text-primary ">الأقسام:</span>{" "}
            {departments}
          </p>
        )}
        {working_hours && (
          <p className="text-sm">
            <span className="text-primary font-semibold"> ساعات العمل :</span>{" "}
            {working_hours}
          </p>
        )}

        {/* Main Experience */}
        <div>
          <p className="whitespace-pre-line text-foreground">{description}</p>
        </div>

        {/* Pros & Cons */}
        <div className="grid sm:grid-cols-2 gap-4">
          {pros && (
            <div className="bg-green-50 border border-green-200 p-3 rounded-xl">
              <p className="font-semibold text-green-700 mb-1">الإيجابيات</p>
              <p className="text-sm text-green-800 whitespace-pre-line">
                {pros}
              </p>
            </div>
          )}
          {cons && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-xl">
              <p className="font-semibold text-red-700 mb-1">السلبيات</p>
              <p className="text-sm text-red-800 whitespace-pre-line">{cons}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
