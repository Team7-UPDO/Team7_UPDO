import type { IGathering, IParticipant } from '@/types/gatherings/models';
import type { IJoinedGathering } from '@/types/gatherings/response';

export function createGathering(overrides?: Partial<IGathering>): IGathering {
  return {
    id: 1,
    type: 'DALLAEMFIT',
    name: '테스트 모임',
    dateTime: '2099-12-01T10:00:00Z',
    registrationEnd: '2099-11-30T10:00:00Z',
    location: '건대입구',
    participantCount: 3,
    capacity: 20,
    createdBy: 100,
    image: undefined,
    ...overrides,
  };
}

export function createParticipant(overrides?: Partial<IParticipant>): IParticipant {
  return {
    userId: 1,
    gatheringId: 1,
    joinedAt: '2024-01-01T00:00:00Z',
    User: {
      id: 1,
      email: 'test@test.com',
      name: '테스트 유저',
      companyName: '테스트 회사',
      image: undefined,
    },
    ...overrides,
  };
}

export function createJoinedGathering(overrides?: Partial<IJoinedGathering>): IJoinedGathering {
  return {
    ...createGathering(),
    joinedAt: '2024-01-01T00:00:00Z',
    isCompleted: false,
    isReviewed: false,
    ...overrides,
  };
}
