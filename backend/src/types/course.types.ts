export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
export type CourseStatus = 'draft' | 'published' | 'archived';

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  short_desc: string | null;
  category: string;
  price: number;
  discount_percent: number;
  thumbnail_url: string | null;
  gallery_urls: string[];
  duration: string | null;
  level: CourseLevel;
  instructor: string | null;
  tags: string[];
  status: CourseStatus;
  rating: number;
  enrollment_count: number;
  certified: boolean;
  color: string;
  created_by: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CoursePublic extends Omit<Course, 'created_by'> {
  effectivePrice: number;
  viewCount?: number;
}

export interface CreateCourseDTO {
  title: string;
  description?: string;
  shortDesc?: string;
  category: string;
  price?: number;
  discountPercent?: number;
  duration?: string;
  level?: CourseLevel;
  instructor?: string;
  tags?: string[];
  certified?: boolean;
  color?: string;
  status?: CourseStatus;
}

export interface UpdateCourseDTO extends Partial<CreateCourseDTO> {
  thumbnailUrl?: string;
  galleryUrls?: string[];
}
