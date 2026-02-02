"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageCircle, Phone, Copy } from "lucide-react";
import { Experience } from "@/app/lib/definitions";
import { useState } from "react";
import { toast } from "sonner";

type ExperienceCardProps = {
  experience: Experience;
};

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyContact = () => {
    if (contact) {
      navigator.clipboard.writeText(contact);
      setCopied(true);
      toast.success("تم نسخ معلومات التواصل");
      setTimeout(() => setCopied(false), 2000);
    }
  };
  const {
    profession,
    place,
    city,
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
    interview_info,
    contact,
  } = experience;
  return (
    <Card
      className="w-full bg-transparent max-w-2xl mx-auto shadow-md rounded-2xl"
      dir="rtl"
    >
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-xl font-semibold">{profession}</span>
          <span className=" text-sm text-foreground/80">
            {city && `${city} - `}{place}
          </span>
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

        {/* Interview Information */}
        {interview_info && (
          <div className=" bg-violet-50 border border-violet-200 p-4 rounded-xl">
            <div className="flex items-start gap-2">
              <MessageCircle className="h-5 w-5 text-violet-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-violet-700 mb-2">
                  معلومات المقابلة
                </p>
                <p className="text-sm text-violet-800 whitespace-pre-line">
                  {interview_info}
                </p>
              </div>
            </div>
          </div>
        )}

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

        {/* Contact Information */}
        {contact && (
          <div className="bg-muted/30 border border-muted p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-0.5">
                    للتواصل مع صاحب التجربة
                  </p>
                  <p className="text-sm text-foreground/80">{contact}</p>
                </div>
                <button
                  onClick={handleCopyContact}
                  className="p-1.5 hover:bg-muted rounded transition-colors"
                  title="نسخ"
                >
                  <Copy
                    className={`h-4 w-4 ${copied ? "text-primary" : "text-muted-foreground"}`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
