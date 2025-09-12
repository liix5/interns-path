export type Experience = {
  id: number;
  profession: string;
  place: string;
  year: string;
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
