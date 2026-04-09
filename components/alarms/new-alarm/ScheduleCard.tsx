import { View, Text, Pressable } from 'react-native';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { useColorScheme } from '@/lib/useColorScheme';
import ScalePressable from '@/components/common/ScalePressable';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function ScheduleCard() {
  const { colors } = useColorScheme();
  const [selectedDays, setSelectedDays] = useState<Set<number>>(new Set([]));

  const toggleDay = useCallback((index: number) => {
    setSelectedDays((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  }, []);

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
          const selected = selectedDays.has(index);
          return (
            <ScalePressable key={index} onPress={() => toggleDay(index)}>
              <View
                className={`h-9 w-9 items-center justify-center rounded-full transition-colors duration-200 ${
                  selected ? 'bg-teal-100 dark:bg-teal-900/50' : 'bg-card'
                }`}>
                <Text
                  className={`text-sm font-medium transition-colors duration-200 ${
                    selected ? 'text-teal-700 dark:text-primary' : 'text-muted-foreground'
                  }`}>
                  {day}
                </Text>
              </View>
            </ScalePressable>
          );
        })}
      </View>
    </View>
  );
}
