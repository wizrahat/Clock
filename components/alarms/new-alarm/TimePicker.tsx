import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@/components/common/Picker';
import { useColorScheme } from '@/lib/useColorScheme';

type TimeFormat = '12' | '24';

const ITEM_HEIGHT = 64;
const ROW_GAP = -8;
const TOTAL_ITEM_HEIGHT = ITEM_HEIGHT + ROW_GAP;

const HOURS_12 = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const HOURS_24 = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

const PERIOD = ['AM', 'PM'] as const;

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

  const hourRef = useRef(initHour);
  const minRef = useRef(initMin);
  const periodRef = useRef(initPeriod);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const { colors } = useColorScheme();

  const screenStyle = useMemo(
    () => [styles.screen, { backgroundColor: colors.card }] as const,
    [colors.card]
  );
  const cardStyle = useMemo(
    () => [styles.card, { height: TOTAL_ITEM_HEIGHT * 5, backgroundColor: colors.card }] as const,
    [colors.card]
  );
  const overlayStyle = useMemo(
    () =>
      [
        styles.selectionOverlay,
        {
          height: TOTAL_ITEM_HEIGHT - 4,
          top: TOTAL_ITEM_HEIGHT * 2 + 2,
          backgroundColor: colors.muted,
        },
      ] as const,
    [colors.muted]
  );
  const pickerRowStyle = useMemo(
    () => [styles.pickerRow, { gap: timeFormat === '12' ? 45 : 60 }] as const,
    [timeFormat]
  );

  const handleHourChange = useCallback(
    (newHour: string) => {
      hourRef.current = newHour;
      onChangeRef.current?.(timeToMinutes(newHour, minRef.current, periodRef.current, timeFormat));
    },
    [timeFormat]
  );

  const handleMinChange = useCallback(
    (newMin: string) => {
      minRef.current = newMin;
      onChangeRef.current?.(timeToMinutes(hourRef.current, newMin, periodRef.current, timeFormat));
    },
    [timeFormat]
  );

  const handlePeriodChange = useCallback(
    (newPeriod: string) => {
      periodRef.current = newPeriod;
      onChangeRef.current?.(timeToMinutes(hourRef.current, minRef.current, newPeriod, timeFormat));
    },
    [timeFormat]
  );

  const hourItems = timeFormat === '12' ? HOURS_12 : HOURS_24;
  const initHourIndex = useMemo(() => hourItems.indexOf(initHour), [hourItems, initHour]);
  const initMinIndex = useMemo(() => parseInt(initMin, 10), [initMin]);
  const initPeriodIndex = useMemo(() => (initPeriod === 'PM' ? 1 : 0), [initPeriod]);

  const sharedPickerProps = useMemo(
    () => ({
      itemHeight: ITEM_HEIGHT,
      rowGap: ROW_GAP,
      textColor: colors.foreground,
      font: 'Poppins_600SemiBold' as const,
      deceleration: 0.993,
    }),
    [colors.foreground]
  );

  return (
    <View style={[screenStyle]}>
      <View style={[cardStyle]}>
        <View style={[overlayStyle]} pointerEvents="none" />

        <View style={[pickerRowStyle]}>
          {timeFormat === '12' && (
            <Picker
              {...sharedPickerProps}
              items={PERIOD}
              width={60}
              fontSize={30}
              onItemChange={handlePeriodChange}
              initialIndex={initPeriodIndex}
            />
          )}
          <Picker
            {...sharedPickerProps}
            items={hourItems}
            width={70}
            fontSize={34}
            onItemChange={handleHourChange}
            initialIndex={initHourIndex}
          />
          <Picker
            {...sharedPickerProps}
            items={MINUTES}
            width={70}
            fontSize={34}
            onItemChange={handleMinChange}
            initialIndex={initMinIndex}
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
