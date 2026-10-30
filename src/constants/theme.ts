import { StyleSheet } from 'react-native';

export const colors = {
  canvas: '#111111',
  panel: '#161616',
  hairline: 'rgba(255, 255, 255, 0.08)',
  hairlineStrong: 'rgba(255, 255, 255, 0.2)',
  textBright: '#ffffff',
  textPrimary: '#f9f8f7',
  textSoft: 'rgba(255, 255, 255, 0.9)',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textFaint: 'rgba(255, 255, 255, 0.5)',
  textGhost: 'rgba(255, 255, 255, 0.3)',
  buttonFill: '#f9f8f7',
  textOnLight: '#161616',
  outlineFill: 'rgba(22, 22, 22, 0.9)',
  outlineRing: 'rgba(255, 255, 255, 0.8)',
  accentOrange: '#ff8001',
};

// The family names inside the font files, which the expo-font plugin embeds.
export const fonts = {
  display: 'Stack Sans Notch',
  sans: 'Inter',
  mono: 'DM Mono',
};

export const type = StyleSheet.create({
  display: { fontFamily: fonts.display, fontSize: 48, lineHeight: 54 },
  bodyS: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 22 },
  caption: { fontFamily: fonts.sans, fontSize: 12, lineHeight: 16 },
  code: { fontFamily: fonts.mono, fontSize: 14, lineHeight: 22 },
  label: { fontFamily: fonts.mono, fontSize: 12, lineHeight: 23, letterSpacing: 0.6, textTransform: 'uppercase' },
  labelXs: { fontFamily: fonts.mono, fontSize: 10, lineHeight: 14, letterSpacing: 0.5, textTransform: 'uppercase' },
  buttonS: { fontFamily: fonts.mono, fontSize: 13, lineHeight: 20, fontWeight: '500', textTransform: 'uppercase' },
  nav: { fontFamily: fonts.mono, fontSize: 16, lineHeight: 24, textTransform: 'uppercase' },
  brand: { fontFamily: fonts.display, fontSize: 26, lineHeight: 30, letterSpacing: -1.56 },
  brandSlash: { fontFamily: fonts.mono, fontSize: 26, lineHeight: 30, letterSpacing: -1.56 },
});
