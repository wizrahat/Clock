import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@/components/ui/organisms/picker';
import { useColorScheme } from '@/lib/useColorScheme';

type TimeFormat = '12' | '24';

const ITEM_HEIGHT = 64;
const ROW_GAP = -8;
const TOTAL_ITEM_HEIGHT = ITEM_HEIGHT + ROW_GAP;
const DEBOUNCE_MS = 300;

const HOURS_12 = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const HOURS_24 = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

interface TimePickerProps {
  value?: number;
  onChange?: (totalMinutes: number) => void;
  timeFormat?: TimeFormat;
}

function minutesToTime(totalMinutes: number, timeFormat: TimeFormat) {
  const hours24 = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;

  if (timeFormat === '12') {
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 || 12;
    return {
      hour: String(hours12).padStart(2, '0'),
      min: String(minutes).padStart(2, '0'),
      period,
    };
  }

  return {
    hour: String(hours24).padStart(2, '0'),
    min: String(minutes).padStart(2, '0'),
    period: 'AM' as const,
  };
}

function timeToMinutes(hour: string, min: string, period: string, timeFormat: TimeFormat) {
  let hours = parseInt(hour, 10);
  const minutes = parseInt(min, 10);

  if (timeFormat === '12') {
    if (period === 'AM' && hours === 12) hours = 0;
    if (period === 'PM' && hours !== 12) hours += 12;
  }

  return hours * 60 + minutes;
}

export default function TimePicker({ value = 300, onChange, timeFormat = '12' }: TimePickerProps) {
  const { hour: initHour, min: initMin, period: initPeriod } = minutesToTime(value, timeFormat);

  const [hour, setHour] = useState(initHour);
  const [min, setMin] = useState(initMin);
  const [period, setPeriod] = useState(initPeriod);
  const { colors } = useColorScheme();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!onChangeRef.current) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChangeRef.current?.(timeToMinutes(hour, min, period, timeFormat));
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [hour, min, period, timeFormat]);

  const hourItems = timeFormat === '12' ? HOURS_12 : HOURS_24;
  const initHourIndex = hourItems.indexOf(initHour);
  const initMinIndex = parseInt(initMin, 10);

  return (
    <View style={[styles.screen, { backgroundColor: colors.card }]}>
      <View style={[styles.card, { height: TOTAL_ITEM_HEIGHT * 5, backgroundColor: colors.card }]}>
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

        <View
          style={[
            styles.pickerRow,
            {
              gap: timeFormat === '12' ? 45 : 60,
            },
          ]}>
          {timeFormat === '12' && (
            <Picker
              items={['AM', 'PM']}
              width={60}
              itemHeight={ITEM_HEIGHT}
              rowGap={ROW_GAP}
              fontSize={30}
              onItemChange={setPeriod}
              initialIndex={initPeriod === 'PM' ? 1 : 0}
              textColor={colors.foreground}
              font="Poppins_600SemiBold"
              deceleration={0.993}
            />
          )}
          <Picker
            items={hourItems}
            width={70}
            itemHeight={ITEM_HEIGHT}
            rowGap={ROW_GAP}
            fontSize={34}
            onItemChange={setHour}
            initialIndex={initHourIndex}
            textColor={colors.foreground}
            font="Poppins_600SemiBold"
            deceleration={0.993}
          />
          <Picker
            items={MINUTES}
            width={70}
            itemHeight={ITEM_HEIGHT}
            rowGap={ROW_GAP}
            fontSize={34}
            onItemChange={setMin}
            initialIndex={initMinIndex}
            textColor={colors.foreground}
            font="Poppins_600SemiBold"
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
