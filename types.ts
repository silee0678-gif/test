export interface Crosswalk {
  id: number;
  name: string;
  // Time in seconds the pedestrian light is green.
  pedestrianGreenSeconds: number;
  // Time in seconds the pedestrian light is red.
  pedestrianRedSeconds: number;
  // A reference timestamp (milliseconds since epoch) when a pedestrian green light *just started*.
  // Used to sync the cycle.
  referenceTime: number;
  // Geographical coordinates for map display
  lat: number;
  lng: number;
}