import { View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function ScheduleCard() {
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 4]);

  const toggleDay = (index: number) => {
    setSelectedDays((prev) =>
      prev.includes(index) ? prev.filter((d) => d !== index) : [...prev, index]
    );
  };

  return (
    <View className="rounded-2xl border-[0.5px] border-neutral-200 bg-white p-4">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-[15px] font-medium text-neutral-900">Repeat</Text>
        <View className="flex-row items-center gap-2.5">
          <TouchableOpacity>
            <Ionicons name="flash-outline" size={18} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="calendar-outline" size={18} color="#888" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="mb-3 h-[0.5px] bg-neutral-200" />

      <View className="flex-row justify-between">
        {DAYS.map((day, index) => {
          const selected = selectedDays.includes(index);
          return (
            <TouchableOpacity
              key={index}
              onPress={() => toggleDay(index)}
              className={`h-9 w-9 items-center justify-center rounded-full ${
                selected ? 'bg-blue-100' : 'bg-neutral-100'
              }`}>
              <Text
                className={`text-[13px] ${
                  selected ? 'font-medium text-blue-600' : 'text-neutral-400'
                }`}>
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
