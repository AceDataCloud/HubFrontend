export interface ICourse {
  id: number;
  tags?: string[];
  title?: string;
  cover?: string;
  thumbnail?: string;
  duration?: number;
  introduction?: string;
  createdAt?: string;
  updatedAt?: string;
  publisherId?: number;
}

export interface ICourseListResponse {
  count: number;
  items: ICourse[];
}

export type ICourseDetailResponse = ICourse;