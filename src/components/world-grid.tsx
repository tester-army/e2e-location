import { StyleSheet, Text, View } from 'react-native';

import { colors, type } from '@/constants/theme';

type Point = { latitude: number; longitude: number };

const MERIDIANS = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150];
const PARALLELS = [60, 30, 0, -30, -60];
const MARKER = 22;

const x = (longitude: number) => ((longitude + 180) / 360) * 100;
const y = (latitude: number) => ((90 - latitude) / 180) * 100;

export function WorldGrid({ point, dimmed = false }: { point: Point | null; dimmed?: boolean }) {
  return (
    <View
      style={[styles.grid, dimmed && styles.dimmed]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants">
      {MERIDIANS.map((longitude) => (
        <View
          key={`m${longitude}`}
          style={[styles.meridian, longitude === 0 && styles.axis, { left: `${x(longitude)}%` }]}
        />
      ))}
      {PARALLELS.map((latitude) => (
        <View
          key={`p${latitude}`}
          style={[styles.parallel, latitude === 0 && styles.axis, { top: `${y(latitude)}%` }]}
        />
      ))}
      <Text style={[type.labelXs, styles.corner, styles.topLeft]}>90°N 180°W</Text>
      <Text style={[type.labelXs, styles.corner, styles.bottomRight]}>90°S 180°E</Text>
      {point ? (
        <View style={[styles.marker, { left: `${x(point.longitude)}%`, top: `${y(point.latitude)}%` }]}>
          <View style={[styles.tick, styles.tickVertical, { top: 0 }]} />
          <View style={[styles.tick, styles.tickVertical, { bottom: 0 }]} />
          <View style={[styles.tick, styles.tickHorizontal, { left: 0 }]} />
          <View style={[styles.tick, styles.tickHorizontal, { right: 0 }]} />
          <View style={styles.ring} />
          <View style={styles.dot} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    aspectRatio: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.hairlineStrong,
    backgroundColor: colors.panel,
  },
  dimmed: { opacity: 0.4 },
  meridian: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: StyleSheet.hairlineWidth,
    backgroundColor: colors.hairline,
  },
  parallel: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.hairline,
  },
  axis: { backgroundColor: colors.hairlineStrong },
  corner: { position: 'absolute', color: colors.textGhost },
  topLeft: { top: 8, left: 10 },
  bottomRight: { bottom: 8, right: 10 },
  marker: {
    position: 'absolute',
    width: MARKER,
    height: MARKER,
    marginLeft: -MARKER / 2,
    marginTop: -MARKER / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: { width: 12, height: 12, borderRadius: 6, borderWidth: 1, borderColor: colors.textBright },
  dot: { position: 'absolute', width: 4, height: 4, backgroundColor: colors.accentOrange },
  tick: { position: 'absolute', backgroundColor: colors.textBright },
  tickVertical: { width: 1, height: 4, left: MARKER / 2 - 0.5 },
  tickHorizontal: { height: 1, width: 4, top: MARKER / 2 - 0.5 },
});
