export type City = {
  id: string;
  name_ar: string;
  name_en?: string;
  region?: string;
};

export type Experience = {
  id: string;
  profession: string | number[];
  place: string;
  city?: string;
  city_id?: number;
  year: Date;
  rotation: string;
  tags?: string[];
  rating?: number;
  description: string;
  positives: string;
  negatives: string;
  requirements?: string;
  departments?: string;
  working_hours?: string;
  interview_info?: string;
  contact?: string;
  createdAt: string;
};

export type Profession = {
  id: string;
  name: string;
};
