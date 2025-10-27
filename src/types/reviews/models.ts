import { Type, Location } from '@/utils/mapping';

// Review 공통 모델
export interface IReview {
  id: number;
  userId: number;
  gatheringId: number;
  score: number;
  comment: string;
  createdAt: string; // ISO date-time
}

// Review + 연관 데이터
export interface IReviewWithRelations extends IReview {
  Gathering: {
    id: number;
    type: Type;
    name: string;
    dateTime: string;
    location: Location;
    image?: string;
  };
  User: {
    id: number;
    name: string;
    image?: string;
  };
}
