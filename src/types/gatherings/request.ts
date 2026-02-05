import { Location, Type } from '@/utils/mapping';

// API 요청할 때 사용하는 Type
export interface CreateGatheringRequest {
  location: Location;
  type: Type;
  name: string;
  dateTime: string;
  capacity: number;
  image?: File; // client-side only
  registrationEnd?: string;
}
