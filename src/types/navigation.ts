import { ResponseLocationMapVO } from './location';

export type RootStackParamList = {
  LocationMain: { location?: ResponseLocationMapVO } | undefined;
  LocationSearch: undefined;
  LocationDetail: {
    locationId: number;
  };
  MomentWrite: {
    locationId: number;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 