import { Text } from "@/components/common/Text";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Alarm, AlarmsTable } from "@/db/schema";
import { updateAlarm } from "@/lib/alarms";
import { formatTime } from "@/lib/utils";
import { View } from "react-native";

export default function AlarmCard({ alarm }: { alarm: Alarm }) {
  const { id, isActive, label, time, scheduleType, specificDates, repeatDays } = alarm;
  const scheduleLabel = scheduleType === "once" ? "Once" : scheduleType === "repeat" ? "Repeat" : "Specific";


  const handleToggle = async (isActive: boolean) => {
    await updateAlarm(id, { isActive })
  }

  return (
    <Card className="bg-card py-2.5 transition-all" style={{
      opacity: isActive ? 1 : 0.5
    }} >
      <CardContent className="flex-row items-center justify-between px-3.5">
        <View className="flex justify-center items-start gap-0.5 ">
          <Text className="text-sm text-muted-foreground mb-1.5">{label}</Text>
          <Text className="text-3xl font-bold text-foreground" font="Poppins_500Medium">{formatTime(time)}</Text>
          <Text className="text-sm text-muted-foreground">{scheduleLabel}</Text>
        </View>
        <Switch className="scale-[1.4]" checked={isActive} onCheckedChange={handleToggle} />
      </CardContent>
    </Card>
  )
};
