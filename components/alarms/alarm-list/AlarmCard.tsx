import { Switch } from '@/components/common/Switch';
import { Text } from '@/components/common/Text';
import { Card, CardContent } from '@/components/ui/card';
import { Alarm } from '@/db/schema';
import { formatScheduleLabel, updateAlarm } from '@/lib/alarms';
import { formatTime } from '@/lib/utils';
import { View } from 'react-native';

export default function AlarmCard({ alarm }: { alarm: Alarm }) {
  const { id, isActive, label, time, scheduleType, customDates, repeatDays } = alarm;

  const handleToggle = async (isActive: boolean) => {
    await updateAlarm(id, { isActive });
  };

  return (
    <Card
      className="bg-card py-2.5 transition-all"
      style={{
        opacity: isActive ? 1 : 0.5,
      }}>
      <CardContent className="flex-row items-center justify-between px-3.5">
        <View className="flex items-start justify-center gap-1">
          <Text className="mb-2 text-sm text-muted-foreground">{label}</Text>
          <Text className="text-3xl text-foreground" font="Poppins_600SemiBold">
            {formatTime(time)}
          </Text>
          <Text className="text-sm text-muted-foreground">
            {formatScheduleLabel(
              scheduleType,
              repeatDays as number[],
              customDates as string[],
              time
            )}
          </Text>
        </View>
        <Switch
          className="mr-1.5 scale-[1.4] transition-all"
          checked={isActive}
          onCheckedChange={handleToggle}
        />
      </CardContent>
    </Card>
  );
}
