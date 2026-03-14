import { Text } from "@/components/common/Text";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Alarm } from "@/db/schema";
import { useState } from "react";
import { View } from "react-native";

export default function AlarmCard({ alarm }: { alarm: Alarm }) {
  const { isActive, label, time, scheduleType, specificDates, repeatDays } = alarm;
  const [isToggleActive, setIsToggleActive] = useState(isActive);
  const scheduleLabel = scheduleType === "once" ? "Once" : scheduleType === "repeat" ? "Repeat" : "Specific";
  return (
    <Card className="bg-card py-2" style={{
      opacity: isToggleActive ? 1 : 0.5
    }} >
      <CardContent className="flex-row items-center justify-between">
        <View className="flex justify-center items-start ">
          <Text className="text-sm text-muted-foreground mb-2">{label}</Text>
          <Text className="text-3xl font-bold text-foreground" font="Poppins_600SemiBold">{time}</Text>
          <Text className="text-sm text-muted-foreground">{scheduleLabel}</Text>
        </View>
        <Switch className="scale-[1.4] " checked={isToggleActive} onCheckedChange={() => setIsToggleActive(!isToggleActive)} />
      </CardContent>
    </Card>
  )
};
