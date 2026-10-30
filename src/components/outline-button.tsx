import { Pressable, type PressableProps, StyleSheet, Text } from 'react-native';

import { colors, type } from '@/constants/theme';

type OutlineButtonProps = Omit<PressableProps, 'children' | 'style'> & { label: string };

export function OutlineButton({ label, disabled, ...props }: OutlineButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, disabled && styles.disabled]}
      {...props}>
      {({ pressed }) => <Text style={[type.buttonS, styles.label, pressed && styles.labelPressed]}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.outlineRing,
    backgroundColor: colors.outlineFill,
  },
  pressed: { borderColor: colors.textBright },
  disabled: { opacity: 0.4 },
  label: { color: colors.textSoft },
  labelPressed: { color: colors.textBright },
});
