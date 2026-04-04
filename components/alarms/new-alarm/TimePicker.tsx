import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@/components/ui/organisms/picker';
import { useColorScheme } from '@/lib/useColorScheme';

const ITEM_HEIGHT = 64;
const ROW_GAP = -8;
const TOTAL_ITEM_HEIGHT = ITEM_HEIGHT + ROW_GAP;

export default function TimePicker() {
  const [hour, setHour] = useState('05');
  const [min, setMin] = useState('20');
  const [period, setPeriod] = useState('AM');
  const { colors } = useColorScheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.card }]}>
      <View
        style={[
          styles.card,
          {
            height: TOTAL_ITEM_HEIGHT * 5,
            backgroundColor: colors.card,
          },
        ]}>
        <View
          style={[
            styles.selectionOverlay,
            {
              height: TOTAL_ITEM_HEIGHT - 4,
              top: TOTAL_ITEM_HEIGHT * 2 + 2,
              backgroundColor: colors.muted,
            },
          ]}
          pointerEvents="none"
        />

        <View style={styles.pickerRow}>
          <Picker
            items={['AM', 'PM']}
            width={60}
            itemHeight={ITEM_HEIGHT}
            rowGap={ROW_GAP}
            fontSize={30}
            onItemChange={setPeriod}
            textColor={colors.foreground}
            font="Poppins_500Medium"
            deceleration={0.993}
          />
          <Picker
            items={Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))}
            width={70}
            itemHeight={ITEM_HEIGHT}
            rowGap={ROW_GAP}
            fontSize={34}
            onItemChange={setHour}
            initialIndex={4}
            textColor={colors.foreground}
            font="Poppins_500Medium"
            deceleration={0.993}
          />
          <Picker
            items={Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))}
            width={70}
            itemHeight={ITEM_HEIGHT}
            rowGap={ROW_GAP}
            fontSize={34}
            onItemChange={setMin}
            initialIndex={19}
            textColor={colors.foreground}
            font="Poppins_500Medium"
            deceleration={0.993}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    borderRadius: 32,
    position: 'relative',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerRow: {
    flexDirection: 'row',
    zIndex: 2,
    alignItems: 'center',
    gap: 45,
  },
  selectionOverlay: {
    position: 'absolute',
    left: 10,
    right: 10,
    borderRadius: 8,
    zIndex: 1,
    opacity: 0.5,
  },
});
