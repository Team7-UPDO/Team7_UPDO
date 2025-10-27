import { Type, Location } from '@/utils/mapping';

export interface IGathering {
  id: number;
  type: Type;
  name: string;
  dateTime: string;
  registrationEnd?: string;
  location: Location;
  participantCount: number;
  capacity: number;
  image?: string;
  createdBy: number;
  canceledAt?: string;
}

export interface IParticipant {
  userId: number;
  gatheringId: number;
  joinedAt: string;
  User: {
    id: number;
    email: string;
    name: string;
    companyName: string;
    image?: string;
  };
}
