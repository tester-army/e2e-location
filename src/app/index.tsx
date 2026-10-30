import * as Linking from 'expo-linking';
import { useNetworkState } from 'expo-network';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LightButton } from '@/components/light-button';
import { OutlineButton } from '@/components/outline-button';
import { SiteHeader } from '@/components/site-header';
import { WorldGrid } from '@/components/world-grid';
import { colors, type } from '@/constants/theme';
import { type Fix, type Permission, useLocation } from '@/hooks/use-location';

const PERMISSION: Record<Permission, string> = { unknown: 'Not asked yet', granted: 'Allowed', denied: 'Denied' };

export default function HomeScreen() {
  const { permission, fix, city, error, busy, find } = useLocation();
  const { isConnected } = useNetworkState();
  const denied = permission === 'denied';

  return (
    <SafeAreaView style={styles.page}>
      <SiteHeader />

      <View style={styles.main}>
        <Text style={[type.label, styles.secondary]}>[01] Location</Text>
        {city ? (
          <Text testID="city" accessibilityRole="header" style={[type.display, styles.primary]}>
            {city}
          </Text>
        ) : (
          <Text accessibilityRole="header" style={[type.display, styles.primary]}>
            {denied ? 'Location is off' : error ? 'No city yet' : busy ? 'Finding you…' : 'Where are you?'}
          </Text>
        )}
        {denied ? (
          <Text testID="location-denied" style={[type.bodyS, styles.secondary]}>
            e2e Location can&apos;t see where you are. Turn on location access in Settings to see your city.
          </Text>
        ) : error ? (
          <Text testID="location-error" accessibilityRole="alert" style={[type.bodyS, styles.error]}>
            {error}
          </Text>
        ) : (
          <Text style={[type.bodyS, styles.secondary]}>
            {city ? 'The city updates as you move.' : "Find me asks for your location, then shows the city you're in."}
          </Text>
        )}

        <View style={styles.grid}>
          <WorldGrid point={fix} dimmed={denied} />
        </View>

        <View>
          <Row label="Permission" value={PERMISSION[permission]} testID="permission" />
          <Row label="Coordinates" value={fix ? format(fix) : '—'} testID="coordinates" />
          <Row
            label="Network"
            value={isConnected === undefined ? '—' : isConnected ? 'Online' : 'Offline'}
            testID="network"
          />
        </View>
      </View>

      <View style={styles.actions}>
        {denied ? (
          <>
            <LightButton testID="open-settings" label="Open Settings" onPress={() => Linking.openSettings()} />
            <OutlineButton testID="find-me" label="Try again" onPress={find} />
          </>
        ) : city ? null : (
          <LightButton
            testID="find-me"
            label={busy ? 'Finding you…' : error ? 'Try again' : 'Find me'}
            disabled={busy}
            onPress={find}
          />
        )}
        <Text style={[type.caption, styles.faint]}>e2e sets the permission, the location, and the network.</Text>
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value, testID }: { label: string; value: string; testID: string }) {
  return (
    <View style={styles.row}>
      <Text style={[type.labelXs, styles.faint]}>{label}</Text>
      <Text testID={testID} style={[type.code, styles.soft]}>
        {value}
      </Text>
    </View>
  );
}

function format({ latitude, longitude }: Fix) {
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}

const styles = StyleSheet.create({
  page: { flex: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 16, backgroundColor: colors.canvas },
  main: { flex: 1, justifyContent: 'center', gap: 12 },
  grid: { marginTop: 20, marginBottom: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  actions: { gap: 12, paddingTop: 24 },
  primary: { color: colors.textPrimary },
  secondary: { color: colors.textSecondary },
  soft: { color: colors.textSoft },
  faint: { color: colors.textFaint },
  error: { color: colors.accentOrange },
});
