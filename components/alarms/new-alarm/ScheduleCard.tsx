import { View } from 'react-native';
import { useState, useCallback, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import dayjs, { Dayjs } from 'dayjs';

import { useColorScheme } from '@/lib/useColorScheme';
import ScalePressable from '@/components/common/ScalePressable';
import DateTimePicker, { useDefaultStyles } from 'react-native-ui-datepicker';
import { Text } from '@/components/common/Text';
import { center } from '@shopify/react-native-skia';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface ScheduleCardProps {
  onChange?: (selectedDays: number[]) => void;
}

export default function ScheduleCard({ onChange }: ScheduleCardProps) {
  const { colors, colorScheme, isDarkColorScheme } = useColorScheme();
  const [selectedDays, setSelectedDays] = useState<Set<number>>(new Set([]));
  const [isRepeat, setIsRepeat] = useState(true);

  const [startDate, setStartDate] = useState<Dayjs | undefined>(undefined);
  const [endDate, setEndDate] = useState<Dayjs | undefined>(undefined);

  const selectedRef = useRef<Set<number>>(new Set([]));
  const defaultStyles = useDefaultStyles(colorScheme);

  const toggleDay = useCallback(
    (index: number) => {
      setSelectedDays((prev) => {
        const next = new Set(prev);
        if (next.has(index)) {
          next.delete(index);
        } else {
          next.add(index);
        }

        selectedRef.current = next;
        onChange?.(Array.from(next));

        return next;
      });
    },
    [onChange]
  );

  return (
    <View className="flex-col gap-3 rounded-2xl border-[0.5px] border-border bg-card px-4 pb-3 pt-4">
      <View className="-mt-1 flex-row items-center justify-between">
        <Text className="text-lg text-foreground" font="Poppins_500Medium">
          {isRepeat ? 'Repeat' : 'Custom'}
        </Text>
        <View className="flex-row items-center gap-4">
          <ScalePressable>
            <Ionicons name="flash-outline" size={20} color={colors.mutedForeground} />
          </ScalePressable>
          <ScalePressable onPress={() => setIsRepeat(!isRepeat)}>
            <Ionicons name="calendar-outline" size={20} color={colors.mutedForeground} />
          </ScalePressable>
        </View>
      </View>

      <View className="h-[0.8px] bg-border" />

      {isRepeat ? (
        <View className="flex-row justify-between">
          {DAYS.map((day, index) => {
            const isSelected = selectedDays.has(index);
            return (
              <DayButton
                key={index}
                day={day}
                isSelected={isSelected}
                onPress={() => toggleDay(index)}
              />
            );
          })}
        </View>
      ) : (
        <DateTimePicker
          containerHeight={270}
          mode="range"
          startDate={startDate}
          endDate={endDate}
          onChange={({ startDate: s, endDate: e }) => {
            setStartDate(s ? dayjs(s) : undefined);
            setEndDate(e ? dayjs(e) : undefined);
          }}
          styles={{
            ...defaultStyles,
            range_fill: {
              ...defaultStyles.range_fill,
              backgroundColor: isDarkColorScheme ? 'rgb(2,51,49)' : '#c6fcf5',
            },
            weekdays: {
              ...defaultStyles.weekdays,
              marginBottom: 5,
            },
            day: {
              ...defaultStyles.day,
              width: 38,
              borderRadius: 999,
            },
            selected: {
              ...defaultStyles.selected,
              backgroundColor: colors.primary,
              transform: 'scale(1.1)',
            },
            selected_label: {
              ...defaultStyles.selected_label,
              fontFamily: 'Poppins_600SemiBold',
              color: isDarkColorScheme ? 'rgb(2,51,49)' : '#e5fffb',
            },
            day_cell: {
              ...defaultStyles.day_cell,
              marginBottom: 5,
              marginHorizontal: -0.2,
            },
            day_label: { ...defaultStyles.day_label, fontFamily: 'Poppins_500Medium' },
            today: {
              ...defaultStyles.today,
              backgroundColor: colors.muted,
            },
            range_start_label: {
              ...defaultStyles.range_start_label,
              color: isDarkColorScheme ? 'rgb(2,51,49)' : '#e5fffb',
            },
            range_end_label: {
              ...defaultStyles.range_end_label,
              color: isDarkColorScheme ? 'rgb(2,51,49)' : '#e5fffb',
            },
            month: {
              ...defaultStyles.month,
              borderRadius: 16,
              borderColor: 'transparent',
            },
            month_label: {
              ...defaultStyles.month_label,
              color: colors.foreground,
              fontFamily: 'Poppins_500Medium',
            },
            selected_month: {
              backgroundColor: isDarkColorScheme ? 'rgb(2,51,49)' : '#c6fcf5',
              borderColor: 'transparent',
              borderRadius: 16,
            },
            selected_month_label: {
              ...defaultStyles.selected_month_label,
              color: isDarkColorScheme ? colors.primary : '#115e59',
              fontFamily: 'Poppins_600SemiBold',
            },

            year: {
              ...defaultStyles.year,
              borderRadius: 16,
              borderColor: 'transparent',
            },
            year_label: {
              ...defaultStyles.year_label,
              color: colors.foreground,
              fontFamily: 'Poppins_500Medium',
            },
            active_year: {
              ...defaultStyles.active_year,
              backgroundColor: isDarkColorScheme ? 'rgb(2,51,49)' : '#c6fcf5',
              borderColor: 'transparent',
              borderRadius: 16,
            },
            active_year_label: {
              ...defaultStyles.active_year_label,
              color: isDarkColorScheme ? colors.primary : '#115e59',
              fontFamily: 'Poppins_600SemiBold',
            },
            selected_year: {},
            selected_year_label: {},
          }}
        />
      )}
    </View>
  );
}

const DayButton = ({
  day,
  isSelected,
  onPress,
}: {
  day: string;
  isSelected: boolean;
  onPress: () => void;
}) => (
  <ScalePressable onPress={() => onPress()}>
    <View
      className={`h-[41.8px] w-[41.8px] items-center justify-center rounded-full transition-colors duration-200 ${
        isSelected
          ? 'border-[0.5px] border-teal-400 bg-teal-100 dark:border-teal-500 dark:bg-teal-900/40'
          : 'border border-border' // temporary hardcoded color
      }`}>
      <Text
        font={isSelected ? 'Poppins_600SemiBold' : 'Poppins_400Regular'}
        className={`text-sm font-medium transition-colors duration-200 ${
          isSelected ? 'text-teal-700 dark:text-teal-300' : 'text-muted-foreground'
        }`}>
        {day}
      </Text>
    </View>
  </ScalePressable>
);
