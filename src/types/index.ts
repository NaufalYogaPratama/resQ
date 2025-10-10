export interface HistoricEvent {
  _id: string;
  title: string;
  description: string;
  date: string;
  eventType: string;
  impactedAreas?: {
    type: "MultiPoint";
    coordinates: [number, number][];
  };
  source?: string;
}

