// src/types/reviews/models.ts
// 리뷰 기본 모델
export interface Review {
  teamId: number;
  id: number;
  userId: number;
  gatheringId: number;
  score: number;
  comment: string;
  createdAt: string; // ISO 8601
}

// 리뷰 + 관련 요약 정보
export interface ReviewWithRelations extends Review {
  Gathering: {
    teamId: number;
    id: number;
    type: string;
    name: string;
    dateTime: string;
    location: string;
    image: string;
  };
  User: {
    teamId: number;
    id: number;
    name: string;
    image: string;
  };
}

// 리뷰 평점 모델
export interface ReviewScore {
  teamId: number;
  gatheringId: number;
  type: "DALLAEMFIT" | "OFFICE_STRETCHING" | "MINDFULNESS" | "WORKATION";
  averageScore: number;
  oneStar: number;
  twoStars: number;
  threeStars: number;
  fourStars: number;
  fiveStars: number;
}
