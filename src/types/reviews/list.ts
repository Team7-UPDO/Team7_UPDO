import { IPagination } from '@/types/common';

import { IReviewWithRelations } from './models';

export interface GetReviewsResponse extends IPagination {
  data: IReviewWithRelations[];
}
