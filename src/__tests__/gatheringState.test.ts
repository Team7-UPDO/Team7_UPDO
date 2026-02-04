import {
  getGatheringDetailState,
  isJoinedGathering,
  getGatheringCardState,
  type UseButtonStateHandlers,
} from '@/utils/gatheringState';
import { createGathering, createParticipant, createJoinedGathering } from './factories/gathering';
import { createReview } from './factories/review';

// 기본 핸들러 (handlers가 있어야 buttonState가 반환됨)
const defaultHandlers: UseButtonStateHandlers = {
  onJoin: jest.fn(),
  onLeave: jest.fn(),
  onWriteReview: jest.fn(),
  onRequireLogin: jest.fn(),
};

// 기본 파라미터 생성 헬퍼
function createParams(overrides?: Partial<Parameters<typeof getGatheringDetailState>[0]>) {
  return {
    gathering: createGathering(),
    participantsData: [],
    joinedGatherings: [],
    myReviews: [],
    gatheringId: 1,
    userId: 1,
    isAuthenticated: true,
    handlers: defaultHandlers,
    ...overrides,
  };
}

// isJoinedGathering
describe('isJoinedGathering', () => {
  it('joinedGatherings에 해당 id가 있으면 true를 반환한다', () => {
    const joined = [createJoinedGathering({ id: 5 })];
    expect(isJoinedGathering(joined, 5)).toBe(true);
  });

  it('joinedGatherings에 해당 id가 없으면 false를 반환한다', () => {
    const joined = [createJoinedGathering({ id: 5 })];
    expect(isJoinedGathering(joined, 99)).toBe(false);
  });

  it('빈 배열이면 false를 반환한다', () => {
    expect(isJoinedGathering([], 1)).toBe(false);
  });

  it('undefined이면 false를 반환한다', () => {
    expect(isJoinedGathering(undefined, 1)).toBe(false);
  });
});

// getGatheringDetailState - buttonState
describe('getGatheringDetailState', () => {
  describe('handlers 미제공', () => {
    it('handlers가 없으면 buttonState는 null이다', () => {
      const result = getGatheringDetailState(createParams({ handlers: undefined }));
      expect(result.buttonState).toBeNull();
    });
  });

  describe('삭제된 모임', () => {
    it('canceledAt이 있으면 삭제된 모임 버튼이 비활성화된다', () => {
      const result = getGatheringDetailState(
        createParams({
          gathering: createGathering({ canceledAt: '2024-01-01T00:00:00Z' }),
        }),
      );
      expect(result.buttonState?.text).toBe('삭제된 모임');
      expect(result.buttonState?.disabled).toBe(true);
      expect(result.isCanceled).toBe(true);
    });
  });

  describe('완료 상태', () => {
    it('완료 + 인원 미달이면 개설 취소 버튼이 표시된다', () => {
      const result = getGatheringDetailState(
        createParams({
          gathering: createGathering({
            dateTime: '2020-01-01T00:00:00Z',
            participantCount: 2,
          }),
          participantsData: [createParticipant(), createParticipant({ userId: 2 })],
          minParticipants: 5,
        }),
      );
      expect(result.buttonState?.text).toBe('개설 취소');
      expect(result.buttonState?.disabled).toBe(true);
      expect(result.isCompleted).toBe(true);
      expect(result.isOpenConfirmed).toBe(false);
    });

    it('완료 + 참여 + 리뷰 작성 완료이면 참여 완료가 표시된다', () => {
      const userId = 1;
      const result = getGatheringDetailState(
        createParams({
          gathering: createGathering({
            dateTime: '2020-01-01T00:00:00Z',
            participantCount: 5,
          }),
          participantsData: Array.from({ length: 5 }, (_, i) =>
            createParticipant({ userId: i + 1 }),
          ),
          userId,
          myReviews: [createReview()],
          minParticipants: 5,
        }),
      );
      expect(result.buttonState?.text).toBe('참여 완료');
      expect(result.buttonState?.disabled).toBe(true);
      expect(result.isReviewed).toBe(true);
    });

    it('완료 + 참여 + 리뷰 미작성이면 리뷰 작성하기 버튼이 표시된다', () => {
      const userId = 1;
      const result = getGatheringDetailState(
        createParams({
          gathering: createGathering({
            dateTime: '2020-01-01T00:00:00Z',
            participantCount: 5,
          }),
          participantsData: Array.from({ length: 5 }, (_, i) =>
            createParticipant({ userId: i + 1 }),
          ),
          userId,
          myReviews: [],
          minParticipants: 5,
        }),
      );
      expect(result.buttonState?.text).toBe('리뷰 작성하기');
      expect(result.buttonState?.disabled).toBe(false);
      expect(result.buttonState?.action).toBe('review');
    });

    it('완료 + 미참여이면 참여 기간 만료가 표시된다', () => {
      const result = getGatheringDetailState(
        createParams({
          gathering: createGathering({
            dateTime: '2020-01-01T00:00:00Z',
            participantCount: 5,
          }),
          participantsData: Array.from({ length: 5 }, (_, i) =>
            createParticipant({ userId: i + 10 }),
          ),
          userId: 99,
          minParticipants: 5,
        }),
      );
      expect(result.buttonState?.text).toBe('참여 기간 만료');
      expect(result.buttonState?.disabled).toBe(true);
    });
  });

  describe('마감 상태', () => {
    it('모집 기간이 만료되면 참여 기간 만료가 표시된다', () => {
      const result = getGatheringDetailState(
        createParams({
          gathering: createGathering({
            dateTime: '2099-12-01T00:00:00Z',
            registrationEnd: '2020-01-01T00:00:00Z',
          }),
        }),
      );
      expect(result.buttonState?.text).toBe('참여 기간 만료');
      expect(result.buttonState?.disabled).toBe(true);
      expect(result.isRegistrationClosed).toBe(true);
    });

    it('정원이 마감되고 미참여이면 정원 마감이 표시된다', () => {
      const result = getGatheringDetailState(
        createParams({
          gathering: createGathering({ capacity: 3, participantCount: 3 }),
          participantsData: Array.from({ length: 3 }, (_, i) =>
            createParticipant({ userId: i + 10 }),
          ),
          userId: 99,
        }),
      );
      expect(result.buttonState?.text).toBe('정원 마감');
      expect(result.buttonState?.disabled).toBe(true);
      expect(result.isFull).toBe(true);
    });
  });

  describe('비로그인 상태', () => {
    it('비로그인이면 참여하기 버튼에 onRequireLogin이 연결된다', () => {
      const result = getGatheringDetailState(
        createParams({
          isAuthenticated: false,
          userId: null,
        }),
      );
      expect(result.buttonState?.text).toBe('참여하기');
      expect(result.buttonState?.disabled).toBe(false);
      expect(result.buttonState?.onClick).toBe(defaultHandlers.onRequireLogin);
    });
  });

  describe('참여 상태', () => {
    it('참여 중이면 참여 취소하기 버튼이 표시된다', () => {
      const userId = 1;
      const result = getGatheringDetailState(
        createParams({
          participantsData: [createParticipant({ userId })],
          userId,
        }),
      );
      expect(result.buttonState?.text).toBe('참여 취소하기');
      expect(result.buttonState?.action).toBe('leave');
      expect(result.buttonState?.variant).toBe('secondary');
      expect(result.joined).toBe(true);
    });

    it('미참여이면 참여하기 버튼이 표시된다', () => {
      const result = getGatheringDetailState(
        createParams({
          participantsData: [],
          joinedGatherings: [],
          userId: 99,
        }),
      );
      expect(result.buttonState?.text).toBe('참여하기');
      expect(result.buttonState?.action).toBe('join');
      expect(result.buttonState?.variant).toBe('primary');
    });
  });

  describe('로딩 상태', () => {
    it('isLeaving이 true이면 버튼이 비활성화된다', () => {
      const userId = 1;
      const result = getGatheringDetailState(
        createParams({
          participantsData: [createParticipant({ userId })],
          userId,
          isLeaving: true,
        }),
      );
      expect(result.buttonState?.disabled).toBe(true);
    });

    it('isJoining이 true이면 버튼이 비활성화된다', () => {
      const result = getGatheringDetailState(
        createParams({
          participantsData: [],
          userId: 99,
          isJoining: true,
        }),
      );
      expect(result.buttonState?.disabled).toBe(true);
    });
  });

  describe('참가 판정', () => {
    it('participantsData에 userId가 있으면 joined가 true이다', () => {
      const result = getGatheringDetailState(
        createParams({
          participantsData: [createParticipant({ userId: 1 })],
          joinedGatherings: [],
          userId: 1,
        }),
      );
      expect(result.joined).toBe(true);
    });

    it('joinedGatherings에 gatheringId가 있으면 joined가 true이다', () => {
      const result = getGatheringDetailState(
        createParams({
          participantsData: [],
          joinedGatherings: [createJoinedGathering({ id: 1 })],
          gatheringId: 1,
          userId: 99,
        }),
      );
      expect(result.joined).toBe(true);
    });

    it('둘 다 없으면 joined가 false이다', () => {
      const result = getGatheringDetailState(
        createParams({
          participantsData: [],
          joinedGatherings: [],
          userId: 99,
        }),
      );
      expect(result.joined).toBe(false);
    });
  });

  describe('계산 값', () => {
    it('참가자 수와 정원을 올바르게 계산한다', () => {
      const result = getGatheringDetailState(
        createParams({
          gathering: createGathering({ capacity: 15 }),
          participantsData: [createParticipant(), createParticipant({ userId: 2 })],
        }),
      );
      expect(result.currentParticipantCount).toBe(2);
      expect(result.capacity).toBe(15);
      expect(result.isFull).toBe(false);
    });

    it('최소 인원 충족 여부를 올바르게 계산한다', () => {
      const result = getGatheringDetailState(
        createParams({
          participantsData: Array.from({ length: 5 }, (_, i) =>
            createParticipant({ userId: i + 1 }),
          ),
          minParticipants: 5,
        }),
      );
      expect(result.isOpenConfirmed).toBe(true);
    });
  });
});

// getGatheringCardState
describe('getGatheringCardState', () => {
  it('참가자가 정원 이상이면 isFull이 true이다', () => {
    const result = getGatheringCardState('건대입구', 10, 10);
    expect(result.isFull).toBe(true);
  });

  it('참가자가 정원 미만이면 isFull이 false이다', () => {
    const result = getGatheringCardState('건대입구', 10, 5);
    expect(result.isFull).toBe(false);
  });

  it('모집 마감이면 isAllClosed가 true이다', () => {
    const result = getGatheringCardState('건대입구', 10, 5, '2020-01-01T00:00:00Z');
    expect(result.isAllClosed).toBe(true);
  });

  it('정원 마감이면 isAllClosed가 true이다', () => {
    const result = getGatheringCardState('건대입구', 10, 10, '2099-12-01T00:00:00Z');
    expect(result.isAllClosed).toBe(true);
  });

  it('마감도 아니고 정원도 안 찼으면 isAllClosed가 false이다', () => {
    const result = getGatheringCardState('건대입구', 10, 5, '2099-12-01T00:00:00Z');
    expect(result.isAllClosed).toBe(false);
  });

  it('location에 맞는 topic을 반환한다', () => {
    const result = getGatheringCardState('건대입구', 10, 5);
    expect(result.topic).toBe('growth');
  });
});
