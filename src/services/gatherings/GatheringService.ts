// src/services/gatherings/GatheringService.ts

import PolymorphicHttpClient from '../PolymorphicHttpClient';
import {
  GetGatheringsParams,
  GetGatheringsResponse,
  CreateGatheringRequest,
  CreateGatheringResponse,
  GetJoinedGatheringsParams,
  GetJoinedGatheringsResponse,
  GetGatheringDetailResponse,
  GetParticipantsParams,
  GetParticipantsResponse,
  CancelGatheringResponse,
  JoinGatheringResponse,
  LeaveGatheringResponse,
} from '@/types/gatherings';

export class GatheringService {
  private http = PolymorphicHttpClient.getInstance();

  private toQuery<T extends object>(params?: T) {
    if (!params) return '';
    return (
      '?' + new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString()
    );
  }

  getGatherings(teamId: string, params?: GetGatheringsParams) {
    return this.http.get<GetGatheringsResponse>(`/${teamId}/gatherings${this.toQuery(params)}`);
  }

  createGathering(teamId: string, data: CreateGatheringRequest) {
    const formData = new FormData();
    formData.append('location', data.location);
    formData.append('type', data.type);
    formData.append('name', data.name);
    formData.append('dateTime', data.dateTime);
    formData.append('capacity', String(data.capacity));
    if (data.image) formData.append('image', data.image);
    if (data.registrationEnd) formData.append('registrationEnd', data.registrationEnd);
    return this.http.post<CreateGatheringResponse>(`/${teamId}/gatherings`, formData);
  }

  getJoinedGatherings(teamId: string, params?: GetJoinedGatheringsParams) {
    return this.http.get<GetJoinedGatheringsResponse>(
      `/${teamId}/gatherings/joined${this.toQuery(params)}`,
    );
  }

  getGatheringDetail(teamId: string, id: number) {
    return this.http.get<GetGatheringDetailResponse>(`/${teamId}/gatherings/${id}`);
  }

  getParticipants(teamId: string, id: number, params?: GetParticipantsParams) {
    return this.http.get<GetParticipantsResponse>(
      `/${teamId}/gatherings/${id}/participants${this.toQuery(params)}`,
    );
  }

  cancelGathering(teamId: string, id: number) {
    return this.http.put<CancelGatheringResponse>(`/${teamId}/gatherings/${id}/cancel`);
  }

  joinGathering(teamId: string, id: number) {
    return this.http.post<JoinGatheringResponse>(`/${teamId}/gatherings/${id}/join`);
  }

  leaveGathering(teamId: string, id: number) {
    return this.http.delete<LeaveGatheringResponse>(`/${teamId}/gatherings/${id}/leave`);
  }
}

export const gatheringService = new GatheringService();
