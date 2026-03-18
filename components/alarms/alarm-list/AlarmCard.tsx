import { Text } from "@/components/common/Text";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { updateAlarm } from "@/lib/alarms";
import { formatTime } from "@/lib/utils";
import { useAlarmStore } from "@/store/alarms";
import { View } from "react-native";

export default function AlarmCard({ id }: { id: string }) {
  const alarm = useAlarmStore(state => state.alarms?.find(alarm => alarm.id === id))

  if (!alarm) return null

  const { isActive, label, time, scheduleType } = alarm
  const scheduleLabel = scheduleType === "once" ? "Once" : scheduleType === "repeat" ? "Repeat" : "Specific";


  const handleToggle = async (isActive: boolean) => {
    await updateAlarm(id, { isActive })
  }

  return (
    <Card className="bg-card py-2" style={{
      opacity: isActive ? 1 : 0.5
    }} >
      <CardContent className="flex-row items-center justify-between">
        <View className="flex justify-center items-start ">
          <Text className="text-sm text-muted-foreground mb-2">{label}</Text>
          <Text className="text-3xl font-bold text-foreground" font="Poppins_600SemiBold">{formatTime(time)}</Text>
          <Text className="text-sm text-muted-foreground">{scheduleLabel}</Text>
        </View>
        <Switch className="scale-[1.4] " checked={isActive} onCheckedChange={handleToggle} />
      </CardContent>
    </Card>
  )
};
