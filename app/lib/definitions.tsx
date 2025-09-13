export type Experience = {
  id: string;
  profession: string | number[];
  place: string;
  year: Date;
  rotation: string;
  tags?: string[];
  rating?: number;
  description: string;
  positives: string;
  negatives: string;
  requirements?: string;
  departments?: string;
  workingHours?: string;
  createdAt: string;
};
export type Profession = {
  id: string;
  name: string;
};
