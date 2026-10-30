// iOS: Allow “e2e Location” to use your location? Android: Allow e2e Location to access this device’s location?
export const LOCATION_PROMPT = /^Allow .?e2e Location.? to (use your|access this device.s) location\?$/;
export const ALLOW = /^(Allow While Using App|While using the app)$/;
export const DONT_ALLOW = /^Don.t allow$/i;

export type Place = { latitude: number; longitude: number };

export const PARIS: Place = { latitude: 48.8584, longitude: 2.2945 };
export const BERLIN: Place = { latitude: 52.5163, longitude: 13.3777 };

// Google's geocoder answers coordinates it has looked up before from a cache, even offline, so each run takes a new point.
export function nearDamSquare(): Place {
  return { latitude: round(52.371 + Math.random() * 0.004), longitude: round(4.889 + Math.random() * 0.006) };
}

export function coordinates({ latitude, longitude }: Place) {
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}

function round(degrees: number) {
  return Math.round(degrees * 10_000) / 10_000;
}
