import { ResponseLocationMapVO } from './location';

export type RootStackParamList = {
  LocationMain: { location?: ResponseLocationMapVO } | undefined;
  LocationSearch: undefined;
  LocationDetail: {
    locationId: number;
  };
  MomentCreate: {
    locationId: number;
    locationName: string;
  };
  MomentDetailScreen: { momentId: number };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 