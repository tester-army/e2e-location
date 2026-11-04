import * as Linking from 'expo-linking';
import { useNetworkState } from 'expo-network';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { SiteHeader } from '@/components/site-header';
import { WorldGrid } from '@/components/world-grid';
import { colors, space, type } from '@/constants/theme';
import { type Fix, type Permission, useLocation } from '@/hooks/use-location';

const PERMISSION: Record<Permission, string> = { unknown: 'not asked yet', granted: 'allowed', denied: 'denied' };

export default function HomeScreen() {
  const { permission, fix, city, error, busy, find } = useLocation();
  const { isConnected } = useNetworkState();
  const denied = permission === 'denied';

  return (
    <SafeAreaView style={styles.page}>
      <SiteHeader />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.main}>
          <Text style={[type.caption, styles.eyebrow]}>[01] location</Text>
          {city ? (
            <Text testID="city" accessibilityRole="header" style={[type.display, styles.primary]}>
              {city}
            </Text>
          ) : (
            <Text accessibilityRole="header" style={[type.display, styles.primary]}>
              {denied ? 'location is off' : error ? 'no city yet' : busy ? 'finding you…' : 'where are you?'}
            </Text>
          )}
          {denied ? (
            <Text testID="location-denied" style={[type.bodyM, styles.secondary]}>
              e2e location can&apos;t see where you are. turn on location access in Settings to see your city.
            </Text>
          ) : error ? (
            <Text testID="location-error" accessibilityRole="alert" style={[type.bodyM, styles.error]}>
              {error}
            </Text>
          ) : (
            <Text style={[type.bodyM, styles.secondary]}>
              {city
                ? 'the city updates as you move.'
                : "find me asks for your location, then shows the city you're in."}
            </Text>
          )}

          <View style={styles.grid}>
            <WorldGrid point={fix} dimmed={denied} />
          </View>

          <View>
            <Row label="permission" value={PERMISSION[permission]} testID="permission" />
            <Row label="coordinates" value={fix ? format(fix) : '—'} testID="coordinates" />
            <Row
              label="network"
              value={isConnected === undefined ? '—' : isConnected ? 'online' : 'offline'}
              testID="network"
            />
          </View>
        </View>

        <View style={styles.actions}>
          {denied ? (
            <>
              <Button testID="open-settings" label="open Settings" onPress={() => Linking.openSettings()} />
              <Button testID="find-me" variant="outline" label="try again" onPress={find} />
            </>
          ) : city ? null : (
            <Button
              testID="find-me"
              label={busy ? 'finding you…' : error ? 'try again' : 'find me'}
              disabled={busy}
              onPress={find}
            />
          )}
          <Text style={[type.bodyS, styles.muted]}>e2e sets the permission, the location, and the network.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value, testID }: { label: string; value: string; testID: string }) {
  return (
    <View style={styles.row}>
      <Text style={[type.caption, styles.muted]}>{label}</Text>
      <Text testID={testID} style={[type.codeM, styles.primary]}>
        {value}
      </Text>
    </View>
  );
}

function format({ latitude, longitude }: Fix) {
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}

const styles = StyleSheet.create({
  page: { flex: 1, paddingHorizontal: space(3), paddingBottom: space(2), backgroundColor: colors.black },
  scroll: { flexGrow: 1, paddingTop: space(3) },
  main: { flex: 1, justifyContent: 'center', gap: space(2) },
  grid: { marginTop: space(1) },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space(2),
    paddingVertical: space(1.5),
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral800,
  },
  actions: { gap: space(2), paddingTop: space(3) },
  eyebrow: { color: colors.mint },
  primary: { color: colors.offWhite },
  secondary: { color: colors.neutral400 },
  muted: { color: colors.neutral500 },
  error: { color: colors.mint },
});
