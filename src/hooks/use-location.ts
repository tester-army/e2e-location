import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { LogBox } from 'react-native';

// A Debug build loses Metro in airplane mode; keep that warning off the screen.
LogBox.ignoreLogs(['Cannot connect to Expo CLI']);

export type Fix = { latitude: number; longitude: number };
export type Permission = 'unknown' | 'granted' | 'denied';

const LOOKUP_FAILED = "Couldn't look up your city. Check your connection and try again.";

// Without mayShowUserSettingsDialog, Android first asks to turn on Location Accuracy, and No thanks fails the fix.
const WATCH_OPTIONS: Location.LocationOptions = {
  accuracy: Location.Accuracy.High,
  distanceInterval: 1000,
  mayShowUserSettingsDialog: false,
};

export function useLocation() {
  const [permission, setPermission] = useState<Permission>('unknown');
  const [fix, setFix] = useState<Fix | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const watch = useRef<Location.LocationSubscription | null>(null);
  const lookups = useRef(0);

  useEffect(() => () => watch.current?.remove(), []);

  async function lookUp({ latitude, longitude }: Fix) {
    const lookup = ++lookups.current;
    setFix({ latitude, longitude });
    try {
      // Android's geocoder never answers offline.
      const [address] = await withTimeout(Location.reverseGeocodeAsync({ latitude, longitude }), 10_000);
      if (lookup !== lookups.current) return;
      const name = address?.city ?? address?.subregion ?? address?.region;
      setCity(name ?? null);
      setError(name ? null : "There's no city at this spot.");
    } catch {
      if (lookup !== lookups.current) return;
      setCity(null);
      setError(LOOKUP_FAILED);
    } finally {
      if (lookup === lookups.current) setBusy(false);
    }
  }

  async function find() {
    watch.current?.remove();
    watch.current = null;
    setBusy(true);
    setError(null);
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      setPermission(granted ? 'granted' : 'denied');
      if (!granted) {
        setFix(null);
        setCity(null);
        setBusy(false);
        return;
      }
      watch.current = await Location.watchPositionAsync(
        WATCH_OPTIONS,
        ({ coords }) => lookUp(coords),
        (reason) => {
          setError(`Couldn't get your location: ${reason}`);
          setBusy(false);
        },
      );
    } catch (e) {
      setError(`Couldn't get your location: ${e instanceof Error ? e.message : String(e)}`);
      setBusy(false);
    }
  }

  return { permission, fix, city, error, busy, find };
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`timed out after ${ms} ms`)), ms);
    promise.then(resolve, reject).finally(() => clearTimeout(timer));
  });
}
