export interface ResponseLocationMapVO {
  locationId: number;
  locationName: string;
  address: string;
  latitude: number;
  longitude: number;
  momentCount: number;
  description?: string;
  images?: string[];
}
