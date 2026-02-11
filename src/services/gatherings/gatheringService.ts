import {
  CancelGatheringResponse,
  CreateGatheringRequest,
  CreateGatheringResponse,
  GetGatheringDetailResponse,
  GetGatheringsParams,
  GetGatheringsResponse,
  GetJoinedGatheringsParams,
  GetJoinedGatheringsResponse,
  GetParticipantsParams,
  GetParticipantsResponse,
  JoinGatheringResponse,
  LeaveGatheringResponse,
} from '@/types/gatherings';

import HttpClient from '../httpClient';

export class GatheringService {
  private http = HttpClient.getInstance();

  private toQuery<T extends object>(params?: T) {
    if (!params) return '';
    return (
      '?' + new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString()
    );
  }

  getGatherings(params?: GetGatheringsParams) {
    return this.http.get<GetGatheringsResponse>(`/gatherings${this.toQuery(params)}`);
  }

  createGathering(data: CreateGatheringRequest) {
    const formData = new FormData();
    formData.append('location', data.location);
    formData.append('type', data.type);
    formData.append('name', data.name);
    formData.append('dateTime', data.dateTime);
    formData.append('capacity', String(data.capacity));
    if (data.image) formData.append('image', data.image);
    if (data.registrationEnd) formData.append('registrationEnd', data.registrationEnd);
    return this.http.post<CreateGatheringResponse>(`/gatherings`, formData);
  }

  getJoinedGatherings(params?: GetJoinedGatheringsParams) {
    return this.http.get<GetJoinedGatheringsResponse>(`/gatherings/joined${this.toQuery(params)}`);
  }

  getGatheringDetail(id: number) {
    return this.http.get<GetGatheringDetailResponse>(`/gatherings/${id}`);
  }

  getParticipants(id: number, params?: GetParticipantsParams) {
    return this.http.get<GetParticipantsResponse>(
      `/gatherings/${id}/participants${this.toQuery(params)}`,
    );
  }

  cancelGathering(id: number) {
    return this.http.put<CancelGatheringResponse>(`/gatherings/${id}/cancel`);
  }

  joinGathering(id: number) {
    return this.http.post<JoinGatheringResponse>(`/gatherings/${id}/join`);
  }

  leaveGathering(id: number) {
    return this.http.delete<LeaveGatheringResponse>(`/gatherings/${id}/leave`);
  }
}

export const gatheringService = new GatheringService();

export const createGathering = gatheringService.createGathering.bind(gatheringService);
export const getGatherings = gatheringService.getGatherings.bind(gatheringService);
export const getGatheringDetail = gatheringService.getGatheringDetail.bind(gatheringService);
export const getJoinedGatherings = gatheringService.getJoinedGatherings.bind(gatheringService);
export const getParticipants = gatheringService.getParticipants.bind(gatheringService);
export const cancelGathering = gatheringService.cancelGathering.bind(gatheringService);
export const joinGathering = gatheringService.joinGathering.bind(gatheringService);
export const leaveGathering = gatheringService.leaveGathering.bind(gatheringService);
