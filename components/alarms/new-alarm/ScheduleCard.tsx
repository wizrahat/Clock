import { View, Text } from 'react-native';
import { useState, useCallback, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { useColorScheme } from '@/lib/useColorScheme';
import ScalePressable from '@/components/common/ScalePressable';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface ScheduleCardProps {
  onChange?: (selectedDays: number[]) => void;
}

export default function ScheduleCard({ onChange }: ScheduleCardProps) {
  const { colors } = useColorScheme();
  const [selectedDays, setSelectedDays] = useState<Set<number>>(new Set([]));
  const selectedRef = useRef<Set<number>>(new Set([]));

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
    <View className="flex-col gap-3 rounded-2xl border-[0.5px] border-border bg-card p-4">
      <View className="mb-1.5 flex-row items-center justify-between">
        <Text className="text-lg font-medium text-foreground">Repeat</Text>
        <View className="flex-row items-center gap-4">
          <ScalePressable>
            <Ionicons name="flash-outline" size={20} color={colors.mutedForeground} />
          </ScalePressable>
          <ScalePressable>
            <Ionicons name="calendar-outline" size={20} color={colors.mutedForeground} />
          </ScalePressable>
        </View>
      </View>

      <View className="h-[0.8px] bg-border" />

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
      className={`h-9 w-9 items-center justify-center rounded-full transition-colors duration-200 ${
        isSelected ? 'bg-teal-100 dark:bg-teal-900/50' : 'bg-card'
      }`}>
      <Text
        className={`text-sm font-medium transition-colors duration-200 ${
          isSelected ? 'text-teal-700 dark:text-primary' : 'text-muted-foreground'
        }`}>
        {day}
      </Text>
    </View>
  </ScalePressable>
);
