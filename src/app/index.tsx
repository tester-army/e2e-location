import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SiteHeader } from '@/components/site-header';
import { WorldGrid } from '@/components/world-grid';
import { colors, type } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.page}>
      <SiteHeader />

      <View style={styles.main}>
        <Text style={[type.label, styles.secondary]}>[01] Location</Text>
        <Text accessibilityRole="header" style={[type.display, styles.primary]}>
          Where are you?
        </Text>
        <Text style={[type.bodyS, styles.secondary]}>
          Find me asks for your location, then shows the city you&apos;re in.
        </Text>

        <View style={styles.grid}>
          <WorldGrid point={null} />
        </View>
      </View>

      <View style={styles.actions}>
        <Text style={[type.caption, styles.faint]}>e2e sets the permission, the location, and the network.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 16, backgroundColor: colors.canvas },
  main: { flex: 1, justifyContent: 'center', gap: 12 },
  grid: { marginTop: 20, marginBottom: 4 },
  actions: { gap: 12, paddingTop: 24 },
  primary: { color: colors.textPrimary },
  secondary: { color: colors.textSecondary },
  faint: { color: colors.textFaint },
});
