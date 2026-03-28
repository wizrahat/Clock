import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@/components/ui/organisms/picker';
import { useColorScheme } from '@/lib/useColorScheme';

const ITEM_HEIGHT = 64;

export default function TimePicker() {
  const [hour, setHour] = useState('05');
  const [min, setMin] = useState('20');
  const [period, setPeriod] = useState('AM');
  const { colors } = useColorScheme();

  const ROW_GAP = -5;
  const TOTAL_ITEM_HEIGHT = ITEM_HEIGHT + ROW_GAP;

  const dynamicStyles = StyleSheet.create({
    screen: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.card,
    },
    card: {
      flexDirection: 'row',
      borderRadius: 32,
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: colors.card,
      paddingHorizontal: 16,
    },
    pickerRow: {
      flexDirection: 'row',
      zIndex: 2,
      alignItems: 'center',
    },
    selectionOverlay: {
      position: 'absolute',
      left: 10,
      right: 10,
      borderRadius: 8,
      zIndex: 1,
      backgroundColor: colors.muted,
      opacity: 0.5,
    },
  });

  return (
    <View style={dynamicStyles.screen}>
      <View style={[dynamicStyles.card, { height: TOTAL_ITEM_HEIGHT * 5 }]}>
        <View
          style={[
            dynamicStyles.selectionOverlay,
            {
              height: TOTAL_ITEM_HEIGHT - 4,
              top: TOTAL_ITEM_HEIGHT * 2 + 2,
            },
          ]}
          pointerEvents="none"
        />

        <View style={[dynamicStyles.pickerRow, { gap: 40 }]}>
          <Picker
            items={['AM', 'PM']}
            width={60}
            itemHeight={ITEM_HEIGHT}
            rowGap={ROW_GAP}
            fontSize={24}
            onItemChange={setPeriod}
            loop={false}
            textColor={colors.foreground}
            font="Poppins_500Medium"
            deceleration={0.994}
          />
          <Picker
            items={Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))}
            width={70}
            itemHeight={ITEM_HEIGHT}
            rowGap={ROW_GAP}
            fontSize={32}
            onItemChange={setHour}
            initialIndex={4}
            textColor={colors.foreground}
            font="Poppins_500Medium"
            deceleration={0.994}
          />
          <Picker
            items={Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))}
            width={70}
            itemHeight={ITEM_HEIGHT}
            rowGap={ROW_GAP}
            fontSize={32}
            onItemChange={setMin}
            initialIndex={19}
            textColor={colors.foreground}
            font="Poppins_500Medium"
            deceleration={0.994}
          />
        </View>
      </View>
    </View>
  );
}
